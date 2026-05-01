<script setup>
import { ref, onMounted } from 'vue';
import api from '../../api/axios';
import { useToast } from "vue-toastification";

const toast = useToast();
const isLoading = ref(false);

const classificationData = ref({
  categoriasCurso: [
    { id: 1, name: 'Desarrollo', count: 1 },
    { id: 2, name: 'Infraestructura', count: 1 },
    { id: 3, name: 'Tecnología', count: 1 },
    { id: 4, name: 'Exterior', count: 1 },
    { id: 5, name: 'Preuniversitarias', count: 1 },
    { id: 6, name: 'Educativo', count: 1 },
    { id: 7, name: 'Áreas', count: 1 }
  ],
  correoDeCurs: [
    { id: 1, name: 'IA', count: 1 },
    { id: 2, name: 'Infraestructura', count: 1 },
    { id: 3, name: 'IA', count: 1 },
    { id: 4, name: 'Freesocioss', count: 1 }
  ],
  areasTecnicas: [
    { id: 1, name: 'Desarrollo', count: 1 },
    { id: 2, name: 'Poseología', count: 1 },
    { id: 3, name: 'Infraestructura', count: 1 },
    { id: 4, name: 'Áreas Técnicas', count: 1 }
  ]
});

const handleUpdateExtraction = async () => {
  isLoading.value = true;
  try {
    // Aquí iría tu endpoint de NestJS para actualizar la extracción sistémica
    // await api.post('/classification/sync');
    toast.info("Sincronizando clasificación sistémica...");
    
    // Simulación de éxito
    setTimeout(() => {
      toast.success("Extracción actualizada correctamente");
      isLoading.value = false;
    }, 1500);
  } catch (error) {
    toast.error("Error al actualizar la clasificación");
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-800">Clasificación Sistémica</h2>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div class="mb-8">
        <h3 class="text-sm font-bold text-gray-700 uppercase tracking-widest">Pensium Vigente</h3>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="space-y-4">
          <h4 class="text-xs font-bold text-gray-400 uppercase mb-4">Categorías de Curso</h4>
          <div v-for="item in classificationData.categoriasCurso" :key="item.id" 
               class="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
            <div class="flex items-center space-x-3">
              <i class="fas fa-chevron-right text-[10px] text-gray-300 group-hover:text-blue-500 transition-colors"></i>
              <span class="text-sm text-gray-600 font-medium">{{ item.name }}</span>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-xs font-bold text-gray-400">{{ item.count }}</span>
              <button class="text-gray-300 hover:text-gray-600"><i class="fas fa-ellipsis-v text-xs"></i></button>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <h4 class="text-xs font-bold text-gray-400 uppercase mb-4">Áreas Técnicas</h4>
          <div v-for="item in classificationData.areasTecnicas" :key="item.id" 
               class="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
            <div class="flex items-center space-x-3">
              <i class="fas fa-chevron-right text-[10px] text-gray-300 group-hover:text-blue-500 transition-colors"></i>
              <span class="text-sm text-gray-600 font-medium">{{ item.name }}</span>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-xs font-bold text-gray-400">{{ item.count }}</span>
              <button class="text-gray-300 hover:text-gray-600"><i class="fas fa-ellipsis-v text-xs"></i></button>
            </div>
          </div>
        </div>

      </div>

      <div class="mt-12 flex justify-end">
        <button 
          @click="handleUpdateExtraction"
          :disabled="isLoading"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-blue-200 transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          <i v-if="isLoading" class="fas fa-spinner animate-spin"></i>
          <span>Actualizar Extracción</span>
        </button>
      </div>
    </div>
  </div>
</template>