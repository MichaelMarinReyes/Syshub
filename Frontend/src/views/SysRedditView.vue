<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useToast } from "vue-toastification";
import { useRouter } from 'vue-router';
import api from '../api/axios';

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

const threads = ref([]);
const isLoading = ref(true);
const showModal = ref(false);
const isSubmitting = ref(false);

const newPost = ref({
  title: '',
  type: 'Publicación',
  cat1: 'Desarrollo',
  content: ''
});

const searchQuery = ref('');
const activeTab = ref('Más Populares');
const tabs = ['Más Populares', 'Recientes', 'Preguntas Técnicas'];

const goToDetail = (id) => {
  router.push({ name: 'publication-detail', params: { id } });
};

const hoveredThread = ref(null);

const handleStarVote = async (id, stars) => {
  try {
    // Usamos PATCH directamente sobre el recurso de la publicación
    // Enviamos el entero 'stars' para que el backend lo sume o lo asigne
    const { data } = await api.patch(`/publications/${id}`, {
      votes: stars
    });

    // Actualización reactiva en la lista
    const thread = threads.value.find(t => t.id === id);
    if (thread) {
      // Si tu backend devuelve la publicación actualizada, tomamos el valor real
      // Si no, lo actualizamos localmente para feedback inmediato
      thread.votes = data.votes !== undefined ? data.votes : (thread.votes + stars);
    }

    toast.success(`Puntuación de ${stars} estrellas enviada`);
  } catch (error) {
    toast.error("No se pudo actualizar la puntuación en el servidor");
    console.error("Error en PATCH:", error);
  } finally {
    hoveredThread.value = null;
  }
};

const fetchPublications = async () => {
  isLoading.value = true;
  try {
    const { data } = await api.get('/publications');

    threads.value = data.map(pub => ({
      id: pub.id,
      title: pub.title,
      content: pub.content || '',
      type: pub.contentType === 'foro' ? 'Pregunta Técnica' : 'Publicación',
      cat1: pub.tags?.[0]?.nameTag || 'General',
      cat2: pub.tags?.length > 1 ? pub.tags[1].nameTag : 'Sistemas',
      creator: pub.user ? `${pub.user.firstName} ${pub.user.lastName}` : 'Anónimo',
      responses: pub.responsesCount || 0,
      votes: pub.votes || 0,
      date: pub.createdAt
    }));
  } catch (error) {
    toast.error("Error al conectar con el servidor de Debian");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchPublications();
});

const canModerate = computed(() => ['Admin', 'Moderador'].includes(authStore.userRole));

const filteredThreads = computed(() => {
  let list = [...threads.value].filter(t =>
    t.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    t.creator.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  if (activeTab.value === 'Preguntas Técnicas') return list.filter(t => t.type === 'Pregunta Técnica');
  if (activeTab.value === 'Más Populares') return list.sort((a, b) => b.votes - a.votes);
  if (activeTab.value === 'Recientes') return list.sort((a, b) => new Date(b.date) - new Date(a.date));

  return list;
});

const submitPost = async () => {
  if (!newPost.value.title || !newPost.value.content) {
    toast.error("Campos obligatorios incompletos");
    return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      title: newPost.value.title,
      content: newPost.value.content,
      contentType: newPost.value.type === 'Pregunta Técnica' ? 'foro' : 'repositorio',
      idUser: authStore.user?.id,
      idCourse: "50ed1bde-8ac3-42c9-9222-4b1096afb06c",
    };

    await api.post('/publications', payload);
    await fetchPublications();
    toast.success("Publicación guardada en Syshub");
    closeModal();
  } catch (error) {
    toast.error("No se pudo guardar la publicación");
  } finally {
    isSubmitting.value = false;
  }
};

const closeModal = () => {
  showModal.value = false;
  newPost.value = { title: '', type: 'Publicación', cat1: 'Desarrollo', content: '' };
};
</script>

<template>
  <div class="p-6 bg-[#F8FAFC] min-h-screen relative">

    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Sys-Reddit</h1>
        <p class="text-sm text-gray-500">Comunidad de Ingeniería CUNOC</p>
      </div>

      <button @click="showModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 transition-transform active:scale-95">
        <i class="fas fa-plus-circle"></i>
        <span>Nueva Publicación</span>
      </button>
    </div>

    <!-- Modal para Nueva Publicación -->
    <Transition name="fade">
      <div v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
          <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 class="text-xl font-bold text-gray-800">Crear nuevo aporte</h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
          </div>

          <form @submit.prevent="submitPost" class="p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-black uppercase text-gray-400 mb-1">Tipo de contenido</label>
                <select v-model="newPost.type"
                  class="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none">
                  <option>Publicación</option>
                  <option>Pregunta Técnica</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-black uppercase text-gray-400 mb-1">Área Académica</label>
                <select v-model="newPost.cat1"
                  class="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none">
                  <option>Desarrollo</option>
                  <option>Infraestructura</option>
                  <option>Redes</option>
                  <option>DBA</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-black uppercase text-gray-400 mb-1">Título del hilo</label>
              <input v-model="newPost.title" type="text" placeholder="Ej: Error al configurar IPTables..."
                class="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                required />
            </div>

            <div>
              <label class="block text-xs font-black uppercase text-gray-400 mb-1">Contenido / Detalles</label>
              <textarea v-model="newPost.content" rows="5" placeholder="Describe tu aporte o duda técnica..."
                class="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button type="button" @click="closeModal"
                class="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancelar</button>
              <button type="submit" :disabled="isSubmitting"
                class="bg-blue-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                <i v-if="isSubmitting" class="fas fa-spinner animate-spin"></i>
                {{ isSubmitting ? 'Publicando...' : 'Publicar ahora' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Tabs y Barra de Búsqueda -->
    <div
      class="bg-white rounded-t-2xl border-x border-t border-gray-100 p-3 flex flex-wrap items-center justify-between gap-4 shadow-sm">
      <div class="flex bg-gray-50 p-1 rounded-xl">
        <button v-for="tab in tabs" :key="tab" @click="activeTab = tab"
          :class="activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          class="px-4 py-2 text-xs font-bold transition-all rounded-lg">
          {{ tab }}
        </button>
      </div>

      <div class="flex items-center space-x-2">
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <i class="fas fa-search text-xs"></i>
          </span>
          <input v-model="searchQuery" type="text" placeholder="Filtrar contenido..."
            class="pl-9 pr-4 py-2 border border-gray-100 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all w-64" />
        </div>
      </div>
    </div>

    <!-- Grid de Publicaciones -->
    <div class="bg-white border-x border-b border-gray-100 rounded-b-2xl p-6 shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="thread in filteredThreads" :key="thread.id"
          class="border border-gray-50 rounded-2xl p-5 hover:shadow-xl hover:border-blue-100 transition-all relative flex flex-col group bg-white">

          <button class="absolute top-5 right-5 text-gray-300 hover:text-gray-600 transition-colors">
            <i class="fas fa-ellipsis-h"></i>
          </button>

          <div class="mb-3">
            <span
              :class="thread.type === 'Pregunta Técnica' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'"
              class="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border">
              {{ thread.type }}
            </span>
          </div>

          <!-- Título con clic para ver detalle -->
          <h3 @click="goToDetail(thread.id)"
            class="font-bold text-gray-800 text-lg mb-4 leading-snug group-hover:text-blue-700 transition-colors cursor-pointer">
            {{ thread.title }}
          </h3>

          <div class="space-y-3 mb-6 flex-1">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold text-gray-400 uppercase w-16">Área</span>
              <span
                class="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5">
                <i class="fas fa-tag text-[8px]"></i> {{ thread.cat1 }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold text-gray-400 uppercase w-16">Tópico</span>
              <span class="text-[11px] font-bold text-gray-600">{{ thread.cat2 }}</span>
            </div>
          </div>

          <!-- Footer de la Card -->
          <div class="flex items-center justify-between pt-4 border-t border-gray-50">
            <div class="flex items-center gap-5">
              <div class="flex flex-col">
                <span class="text-[9px] font-bold text-gray-400 uppercase mb-1">Autor</span>
                <div class="flex items-center gap-1.5">
                  <div
                    class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                    {{ thread.creator[0].toUpperCase() }}
                  </div>
                  <span class="text-xs font-bold text-gray-700">{{ thread.creator }}</span>
                </div>
              </div>

              <div class="flex flex-col items-center relative">
                <span class="text-[9px] font-bold text-gray-400 uppercase mb-1">Feedback</span>

                <div @mouseenter="hoveredThread = thread.id" @mouseleave="hoveredThread = null"
                  class="flex items-center gap-3 text-gray-500 relative">
                  <!-- Comentarios -->
                  <div @click="goToDetail(thread.id)"
                    class="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors">
                    <i class="fas fa-comment-dots text-xs"></i>
                    <span class="text-xs font-bold">{{ thread.responses }}</span>
                  </div>

                  <!-- Sección de Puntuación -->
                  <div class="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md relative cursor-pointer group">
                    <i class="fas fa-star text-[10px] text-yellow-500"></i>
                    <span class="text-xs font-bold text-gray-800">{{ thread.votes }}</span>

                    <!-- Menú Flotante de Estrellas -->
                    <Transition name="pop">
                      <div v-if="hoveredThread === thread.id"
                        class="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-white shadow-2xl border border-gray-100 rounded-full px-4 py-2 flex gap-1 z-50 stars-container">

                        <button v-for="star in 5" :key="star" @click.stop="handleStarVote(thread.id, star)"
                          class="star-btn text-gray-200 hover:text-yellow-400 transition-all transform hover:scale-125">
                          <i class="fas fa-star text-sm"></i>
                        </button>

                        <div
                          class="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white">
                        </div>
                      </div>
                    </Transition>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Opciones de Moderación -->
          <div v-if="canModerate" class="mt-4 flex gap-2 pt-4 border-t border-dashed border-gray-100">
            <button
              class="text-[10px] font-bold text-red-500 hover:bg-red-50 px-2 py-1 rounded transition-colors uppercase">
              <i class="fas fa-ban mr-1"></i> Suspender
            </button>
            <button
              class="text-[10px] font-bold text-gray-400 hover:bg-gray-50 px-2 py-1 rounded transition-colors uppercase">
              <i class="fas fa-eye-slash mr-1"></i> Ocultar
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && filteredThreads.length === 0" class="text-center py-20">
        <i class="fas fa-folder-open text-gray-200 text-5xl mb-4"></i>
        <p class="text-gray-400 font-medium">No se encontraron hilos técnicos.</p>
      </div>
    </div>
  </div>
</template>