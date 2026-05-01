<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "vue-toastification";
import api from '@/api/axios';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const articles = ref([]);
const isLoading = ref(true);
const searchQuery = ref("");
const activeTab = ref('all');

// --- Lógica de Permisos Globales ---
const canModerate = computed(() => {
  const role = (typeof authStore.user?.role === 'object' ? authStore.user?.role?.nombre : authStore.user?.role)?.toLowerCase();
  return role === 'admin' || role === 'moderador';
});

const filteredArticles = computed(() => {
  let list = articles.value;

  if (activeTab.value === 'mine') {
    list = list.filter(art => art.publication?.idUser === authStore.user?.id);
  }

  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return list;

  return list.filter(art => {
    const title = art.publication?.title?.toLowerCase() || '';
    const author = `${art.publication?.user?.firstName} ${art.publication?.user?.lastName}`.toLowerCase();
    return title.includes(query) || author.includes(query);
  });
});

const fetchArticles = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/blog-articles');
    articles.value = response.data;
  } catch (error) {
    toast.error("Error al cargar los artículos");
  } finally {
    isLoading.value = false;
  }
};

const deleteArticle = async (id) => {
  if (!confirm("¿Eliminar permanentemente?")) return;
  try {
    await api.delete(`/blog-articles/${id}`);
    articles.value = articles.value.filter(a => a.idPublication !== id);
    toast.success("Eliminado con éxito");
  } catch (error) {
    toast.error("Error al eliminar");
  }
};

onMounted(fetchArticles);

const goToCreate = () => router.push({ name: 'ArticleCreate' });
const goToReader = (id) => router.push({ name: 'ArticleReader', params: { id } });
const goToEdit = (event, id) => {
  event.stopPropagation();
  router.push({ name: 'ArticleEdit', params: { id } });
};
</script>

<template>
  <div class="max-w-5xl mx-auto p-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight text-center sm:text-left">
        Artículos
      </h2>
      <button @click="goToCreate"
        class="w-full md:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-sm transition-all active:scale-95">
        <i class="fas fa-plus mr-2"></i> Nuevo Artículo
      </button>
    </div>

    <!-- Barra de Búsqueda y Navegación de Pestañas -->
    <div class="space-y-6 mb-8">
      <div class="relative group">
        <input v-model="searchQuery" type="text" placeholder="Buscar título o autor..."
          class="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all shadow-sm" />
        <i
          class="fas fa-search absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
      </div>

      <!-- Tabs estilo Reddit/Sys-Reddit -->
      <div class="flex border-b border-gray-100">
        <button @click="activeTab = 'all'"
          :class="activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'"
          class="px-6 py-3 font-bold text-sm transition-all">
          Todos los artículos
        </button>
        <button @click="activeTab = 'mine'"
          :class="activeTab === 'mine' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'"
          class="px-6 py-3 font-bold text-sm transition-all">
          Mis artículos
        </button>
      </div>
    </div>

    <!-- Estado de Carga -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-b-blue-600 mb-4"></div>
      <p class="text-gray-500 font-medium italic">Sincronizando con Debian...</p>
    </div>

    <!-- Listado de Tarjetas -->
    <div v-else-if="filteredArticles.length > 0" class="flex flex-col gap-4">
      <div v-for="art in filteredArticles" :key="art.idPublication"
        class="group bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-xl transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center">

        <div class="flex-grow min-w-0 w-full cursor-pointer" @click="goToReader(art.idPublication)">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {{ art.publication?.contentType || 'Blog' }}
            </span>
            <span class="text-xs text-gray-400">• {{ new Date(art.publication?.createdAt).toLocaleDateString() }}</span>
          </div>
          <h3 class="text-xl font-bold text-gray-800 group-hover:text-blue-600 truncate transition-colors">
            {{ art.publication?.title }}
          </h3>
          <p class="text-sm text-gray-500">
            Escrito por <span class="font-semibold">{{ art.publication?.user?.firstName }} {{
              art.publication?.user?.lastName }}</span>
          </p>
        </div>

        <!-- Acciones Dinámicas -->
        <div class="flex gap-2 self-end sm:self-center">

          <!-- EDITAR: Solo si el usuario es el dueño -->
          <button v-if="art.publication?.idUser === authStore.user?.id" @click="goToEdit($event, art.idPublication)"
            class="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Editar">
            <i class="fas fa-edit"></i>
          </button>

          <!-- ELIMINAR: Si es el dueño O si es Moderador/Admin -->
          <button v-if="art.publication?.idUser === authStore.user?.id || canModerate"
            @click.stop="deleteArticle(art.idPublication)"
            class="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Eliminar">
            <i class="fas fa-trash-alt"></i>
          </button>

          <!-- REPORTAR: Solo para otros artículos si no soy moderador -->
          <button v-if="art.publication?.idUser !== authStore.user?.id && !canModerate"
            @click.stop="reportArticle(art.idPublication)"
            class="p-2.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
            title="Reportar">
            <i class="fas fa-flag"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
      <i class="fas fa-file-alt text-gray-200 text-5xl mb-4"></i>
      <h3 class="text-lg font-bold text-gray-800">No hay artículos aquí</h3>
      <p class="text-gray-400">¿Por qué no empiezas redactando algo nuevo?</p>
    </div>
  </div>
</template>