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
const labels = ref([]);
const isLoading = ref(true);
const showModal = ref(false);
const isSubmitting = ref(false);

const newPost = ref({
  title: '',
  type: 'Publicación',
  content: '',
  selectedTags: new Set()
});

const searchQuery = ref('');
const activeTab = ref('Recientes');
const tabs = ['Recientes', 'Preguntas Técnicas'];

const fetchInitialData = async () => {
  isLoading.value = true;
  try {
    const [pubRes, labelRes] = await Promise.all([
      api.get('/publications'),
      api.get('/labels')
    ]);

    labels.value = labelRes.data;
    threads.value = pubRes.data.map(pub => ({
      id: pub.id,
      title: pub.title,
      type: pub.contentType === 'foro' ? 'Pregunta Técnica' : 'Publicación',
      cat1: pub.tags?.[0]?.nameTag || 'General',
      cat2: pub.tags?.length > 1 ? pub.tags[1].nameTag : 'Sistemas',
      creator: pub.user ? `${pub.user.firstName} ${pub.user.lastName}` : 'Anónimo',
      responses: pub.responsesCount || 0,
      date: pub.createdAt
    }));
  } catch (error) {
    console.error("Error en el fetch:", error);
    toast.error("Error al conectar con el servidor");
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchInitialData);

const submitPost = async () => {
  if (!newPost.value.title || !newPost.value.content) {
    return toast.error("Completa los campos obligatorios");
  }
  
  isSubmitting.value = true;
  try {
    const payload = {
      title: newPost.value.title,
      content: newPost.value.content,
      contentType: newPost.value.type === 'Pregunta Técnica' ? 'foro' : 'repositorio',
      idUser: authStore.user?.id,
      tagIds: Array.from(newPost.value.selectedTags)
    };

    await api.post('/publications', payload);
    await fetchInitialData(); 
    toast.success("Publicación creada exitosamente");
    closeModal();
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Error al publicar";
    toast.error(errorMsg);
  } finally {
    isSubmitting.value = false;
  }
};

const closeModal = () => {
  showModal.value = false;
  newPost.value = { 
    title: '', 
    type: 'Publicación', 
    content: '', 
    selectedTags: new Set() 
  };
};

const toggleTag = (id) => {
  if (newPost.value.selectedTags.has(id)) {
    newPost.value.selectedTags.delete(id);
  } else {
    newPost.value.selectedTags.add(id);
  }
};

const goToDetail = (id) => {
  router.push({ name: 'publication-detail', params: { id } });
};

const canModerate = computed(() => ['Admin', 'Moderador'].includes(authStore.userRole));

const filteredThreads = computed(() => {
  let list = [...threads.value].filter(t =>
    t.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    t.creator.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  if (activeTab.value === 'Preguntas Técnicas') {
    return list.filter(t => t.type === 'Pregunta Técnica');
  }
  return list.sort((a, b) => new Date(b.date) - new Date(a.date));
});

const handleSuspend = async (id) => {
  if (!confirm("¿Suspender publicación?")) return;
  try {
    await api.patch(`/publications/${id}`, { statusId: 'suspendido' });
    threads.value = threads.value.filter(t => t.id !== id);
    toast.info("Publicación suspendida");
  } catch (error) {
    toast.error("Error al realizar la acción");
  }
};
</script>

<template>
  <div class="p-6 bg-[#F8FAFC] min-h-screen relative">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Sys-Reddit</h1>
        <p class="text-sm text-gray-500">Comunidad de Ingeniería CUNOC</p>
      </div>
      <button @click="showModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2">
        <i class="fas fa-plus-circle"></i>
        <span>Nueva Publicación</span>
      </button>
    </div>

    <!-- Modal de Creación Actualizado -->
    <Transition name="fade">
      <div v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
          <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 class="text-xl font-bold text-gray-800">Crear nuevo aporte</h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <form @submit.prevent="submitPost" class="p-6 space-y-5">
            <!-- Selector de Tipo -->
            <div class="w-full">
              <label class="block text-[10px] font-black uppercase text-gray-400 mb-1">Tipo de Contenido</label>
              <select v-model="newPost.type"
                class="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                <option>Publicación</option>
                <option>Pregunta Técnica</option>
              </select>
            </div>

            <!-- Título -->
            <div>
              <label class="block text-[10px] font-black uppercase text-gray-400 mb-1">Título</label>
              <input v-model="newPost.title" type="text" placeholder="¿Sobre qué quieres hablar?"
                class="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>

            <!-- Selector de Etiquetas Dinámico -->
            <div>
              <label class="block text-[10px] font-black uppercase text-gray-400 mb-2">Etiquetas Técnicas</label>
              <div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                <button 
                  v-for="tag in labels" 
                  :key="tag.idLabel"
                  type="button"
                  @click="toggleTag(tag.idLabel)"
                  :class="newPost.selectedTags.has(tag.idLabel) 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                          : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'"
                  class="text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1"
                >
                  <i v-if="newPost.selectedTags.has(tag.idLabel)" class="fas fa-check text-[8px]"></i>
                  #{{ tag.nameTag }}
                </button>
              </div>
            </div>

            <!-- Contenido -->
            <div>
              <label class="block text-[10px] font-black uppercase text-gray-400 mb-1">Cuerpo del mensaje</label>
              <textarea v-model="newPost.content" rows="5" placeholder="Escribe los detalles aquí..."
                class="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

            <!-- Footer Modal -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-50">
              <button type="button" @click="closeModal" class="px-6 py-2.5 text-gray-500 font-bold hover:text-gray-700">
                Cancelar
              </button>
              <button type="submit" :disabled="isSubmitting"
                class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isSubmitting ? 'Publicando...' : 'Publicar ahora' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Filtros de Navegación -->
    <div class="bg-white rounded-t-2xl border border-gray-100 p-3 flex flex-wrap items-center justify-between gap-4 shadow-sm">
      <div class="flex bg-gray-50 p-1 rounded-xl">
        <button v-for="tab in tabs" :key="tab" @click="activeTab = tab"
          :class="activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'"
          class="px-4 py-2 text-xs font-bold rounded-lg transition-all">
          {{ tab }}
        </button>
      </div>
      <div class="relative">
        <i class="fas fa-search absolute left-3 top-3 text-gray-400 text-xs"></i>
        <input v-model="searchQuery" type="text" placeholder="Filtrar por título o autor..."
          class="pl-9 pr-4 py-2 border border-gray-100 rounded-xl text-sm bg-gray-50 w-64 outline-none focus:ring-2 focus:ring-blue-100" />
      </div>
    </div>

    <!-- Grid de Publicaciones -->
    <div class="bg-white border-x border-b border-gray-100 rounded-b-2xl p-6 shadow-sm">
      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="thread in filteredThreads" :key="thread.id"
          class="border border-gray-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition-all flex flex-col group bg-white shadow-sm">

          <div class="mb-3">
            <span
              :class="thread.type === 'Pregunta Técnica' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'"
              class="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
              {{ thread.type }}
            </span>
          </div>

          <h3 @click="goToDetail(thread.id)"
            class="font-bold text-gray-800 text-lg mb-4 cursor-pointer hover:text-blue-700 leading-tight">
            {{ thread.title }}
          </h3>

          <!-- Tags Visuales -->
          <div class="space-y-3 mb-6 flex-1 text-[11px] font-bold">
            <div class="flex items-center gap-2">
              <span class="text-gray-400 uppercase w-12">Tags</span>
              <div class="flex gap-1 overflow-hidden">
                <span class="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded truncate">#{{ thread.cat1 }}</span>
                <span v-if="thread.cat2 !== 'Sistemas'" class="text-gray-400">/</span>
                <span v-if="thread.cat2 !== 'Sistemas'" class="text-gray-600 truncate">{{ thread.cat2 }}</span>
              </div>
            </div>
          </div>

          <!-- Footer Publicación -->
          <div class="flex items-center justify-between pt-4 border-t border-gray-50">
            <div class="flex flex-col">
              <span class="text-[9px] font-bold text-gray-400 uppercase mb-1">Autor</span>
              <span class="text-xs font-bold text-gray-700 truncate w-24">{{ thread.creator }}</span>
            </div>

            <div
              class="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
              @click="goToDetail(thread.id)">
              <i class="fas fa-comment-dots text-sm"></i>
              <span class="text-xs font-bold">{{ thread.responses }}</span>
              <span class="text-[10px] font-medium text-gray-400">respuestas</span>
            </div>
          </div>

          <!-- Moderación -->
          <div v-if="canModerate" class="mt-4 flex gap-2 pt-4 border-t border-dashed border-gray-100">
            <button @click.stop="handleSuspend(thread.id)"
              class="flex-1 text-[10px] font-bold text-red-500 hover:bg-red-50 py-2 rounded-lg uppercase transition-colors">
              Suspender
            </button>
            <button @click.stop="handleHide(thread.id)"
              class="flex-1 text-[10px] font-bold text-gray-400 hover:bg-gray-50 py-2 rounded-lg uppercase transition-colors">
              Ocultar
            </button>
          </div>
        </div>
      </div>

      <!-- Estado Vacío -->
      <div v-if="!isLoading && filteredThreads.length === 0" class="text-center py-20 text-gray-400">
        <i class="fas fa-search mb-4 text-3xl"></i>
        <p>No se encontraron resultados para tu búsqueda.</p>
      </div>
    </div>
  </div>
</template>