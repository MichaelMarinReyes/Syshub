<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useToast } from "vue-toastification";
import api from '../api/axios'

const authStore = useAuthStore();
const toast = useToast();

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

const fetchPublications = async () => {
  isLoading.value = true;
  try {
    const { data } = await api.get('/publications');
    // Mapeamos los campos del backend (PostgreSQL) a tu diseño de cards
    threads.value = data.map(pub => ({
      id: pub.id,
      title: pub.titulo,
      content: pub.contenido,
      type: pub.tipo_contenido === 'foro' ? 'Pregunta Técnica' : 'Publicación',
      cat1: pub.course?.nombre || 'General',
      cat2: 'Sistemas',
      creator: pub.user?.username || 'Usuario',
      responses: pub.comments?.length || 0,
      votes: pub.votos || 0,
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
  let list = threads.value.filter(t =>
    t.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    t.creator.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  if (activeTab.value === 'Preguntas Técnicas') return list.filter(t => t.type === 'Pregunta Técnica');
  if (activeTab.value === 'Más Populares') return list.sort((a, b) => b.votes - a.votes);
  if (activeTab.value === 'Recientes') return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  return list;
});

// 2. Enviar nueva publicación al backend
const submitPost = async () => {
  if (!newPost.value.title || !newPost.value.content) {
    toast.error("Campos obligatorios incompletos");
    return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      titulo: newPost.value.title,
      contenido: newPost.value.content,
      tipo_contenido: newPost.value.type === 'Pregunta Técnica' ? 'foro' : 'repositorio',
      // idUsuario: authStore.userId // Si manejas el ID en el store
    };

    const { data } = await api.post('/publications', payload);

    // Recargamos la lista para traer la data fresca con sus IDs de DB
    await fetchPublications();

    toast.success("Publicación guardada en Syshub");
    closeModal();
  } catch (error) {
    toast.error("No se pudo guardar la publicación");
  } finally {
    isSubmitting.value = false;
  }
};

const handleVote = async (id, delta) => {
  try {
    // Ejemplo de endpoint de votos: patch /publications/:id/vote
    // await api.patch(`/publications/${id}/vote`, { delta });
    const thread = threads.value.find(t => t.id === id);
    if (thread) thread.votes += delta;
    toast.info("Voto registrado");
  } catch (error) {
    toast.error("Error al votar");
  }
};

const closeModal = () => {
  showModal.value = false;
  newPost.value = { title: '', type: 'Publicación', cat1: 'Desarrollo', content: '' };
};
</script>

<template>
  <div class="p-6 bg-[#F8FAFC] min-h-screen relative">

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

          <h3 class="font-bold text-gray-800 text-lg mb-4 leading-snug group-hover:text-blue-700 transition-colors">
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

              <div class="flex flex-col items-center">
                <span class="text-[9px] font-bold text-gray-400 uppercase mb-1">Feedback</span>
                <div class="flex items-center gap-3 text-gray-500">
                  <div class="flex items-center gap-1">
                    <i class="fas fa-comment-dots text-xs"></i>
                    <span class="text-xs font-bold">{{ thread.responses }}</span>
                  </div>
                  <div class="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md">
                    <button @click.stop="handleVote(thread.id, 1)" class="hover:text-blue-600 transition-colors">
                      <i class="fas fa-arrow-up text-xs"></i>
                    </button>
                    <span class="text-xs font-bold text-gray-800">{{ thread.votes }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
    </div>
  </div>
</template>