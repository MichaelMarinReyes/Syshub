<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "vue-toastification";
import api from '@/api/axios'; 

const router = useRouter();
const toast = useToast();

const articles = ref([]);
const isLoading = ref(true);

const fetchArticles = async () => {
  isLoading.ref = true;
  try {
    const response = await api.get('/blog-articles'); 
    articles.value = response.data;
    
  } catch (error) {
    toast.error("Error al cargar los artículos del servidor");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchArticles();
});

const goToCreate = () => {
  router.push({ name: 'ArticleCreate' }); 
};

const goToReader = (id) => {
  router.push({ name: 'ArticleReader', params: { id } });
};

const goToEdit = (event, id) => {
  event.stopPropagation();
  router.push({ name: 'ArticleEdit', params: { id } });
};
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Artículos</h2>
      <button 
        @click="goToCreate"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
        <i class="fas fa-plus"></i> Nuevo Artículo
      </button>
    </div>

    <!-- Estado de Carga -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Tabla de Artículos -->
    <div v-else-if="articles.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Título</th>
            <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Estado</th>
            <th class="px-6 py-4 text-right">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="art in articles" 
            :key="art.id" 
            @click="goToReader(art.id)"
            class="border-t border-gray-50 hover:bg-blue-50/30 cursor-pointer transition-colors group"
          >
            <td class="px-6 py-4 text-sm font-medium text-gray-700 group-hover:text-blue-600">
              {{ art.title }}
            </td>
            <td class="px-6 py-4">
              <span :class="art.status === 'Publicado' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'" 
                    class="px-2 py-1 rounded text-[10px] font-bold uppercase">
                {{ art.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-right text-gray-400">
              <button @click="goToEdit($event, art.id)" class="hover:text-blue-600 p-2">
                <i class="fas fa-edit"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
      <i class="fas fa-file-alt text-gray-300 text-4xl mb-3"></i>
      <p class="text-gray-500">No tienes artículos redactados aún.</p>
    </div>
  </div>
</template>