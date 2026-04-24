<script setup>
import { ref } from 'vue';

const pendingContent = ref([
  {
    id: 1,
    type: 'proyecto',
    title: 'Proyecto Guardado',
    subtitle: 'Sys-Reddit',
    category: null,
    creator: null,
    responses: null,
    lastActivity: null,
    image: null, // Aquí iría la URL de la imagen del folder
    isPinned: true
  },
  {
    id: 2,
    type: 'hilo',
    title: 'Título del Hilo',
    category: 'IA',
    creator: 'Maninooas',
    responses: 3,
    lastActivity: '23 days ago',
    image: null
  },
  {
    id: 3,
    type: 'articulo',
    title: 'Proyecto Articulo',
    subtitle: 'Contenide em articulos e o onlimelo...',
    image: 'https://via.placeholder.com/150', // Reemplazar con imagen real
  },
  {
    id: 4,
    type: 'hilo',
    title: 'Título del Hilo',
    category: 'Desarrollo',
    creator: 'Matiina Manner',
    responses: 2,
    lastActivity: '25 days ago'
  },
  {
    id: 5,
    type: 'hilo',
    title: 'Título del Hilo',
    category: null,
    creator: 'Ablawas',
    responses: 2,
    lastActivity: '27 days ago'
  },
  {
    id: 6,
    type: 'articulo',
    title: 'Proyecto Articulos e',
    image: 'https://via.placeholder.com/150', // Simulación de código de la imagen
  }
]);

const handleConfirmDelete = (id) => {
  console.log("Eliminando contenido:", id);
};

const handleViewContent = (id) => {
  console.log("Viendo contenido:", id);
};
</script>

<template>
  <div class="p-6 bg-[#F8FAFC] min-h-screen">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Contenido Guardado - Revisión Pendiente</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="item in pendingContent" :key="item.id" 
           class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        
        <div v-if="item.type === 'proyecto' || item.type === 'articulo'" 
             class="h-40 bg-[#334155] relative flex items-center justify-center">
          <button v-if="item.isPinned" class="absolute top-3 left-3 bg-white/20 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded flex items-center gap-1">
            <i class="fas fa-thumbtack rotate-45"></i> Pijar
          </button>
          
          <img v-if="item.image" :src="item.image" class="w-full h-full object-cover" />
          <i v-else class="fas fa-folder-open text-4xl text-gray-400/50"></i>
        </div>

        <div class="p-5 flex-1">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-gray-800 text-lg leading-tight">{{ item.title }}</h3>
            <button class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-ellipsis-v"></i>
            </button>
          </div>

          <div v-if="item.type === 'hilo'" class="space-y-1 mb-4">
            <p v-if="item.category" class="text-xs font-bold text-gray-500 uppercase">Categoría</p>
            <span v-if="item.category" 
                  :class="item.category === 'IA' ? 'bg-green-100 text-green-700' : 'bg-emerald-100 text-emerald-700'"
                  class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold">
              <i class="fas fa-folder mr-1"></i> {{ item.category }}
            </span>
            <p class="text-sm text-gray-600 mt-2"><span class="font-bold">Creador:</span> {{ item.creator }}</p>
            <p class="text-sm text-gray-600"><span class="font-bold">Respuestas:</span> {{ item.responses }}</p>
            <p class="text-xs text-gray-400 italic">Última Actividad: {{ item.lastActivity }}</p>
          </div>

          <div v-else class="mb-4">
            <p class="text-sm text-gray-500 line-clamp-2">{{ item.subtitle }}</p>
          </div>

          <div class="flex items-center gap-2 mt-auto">
            <button @click="handleConfirmDelete(item.id)" 
                    class="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold py-2 rounded-lg transition-colors">
              Confirmar Eliminación
            </button>
            <button @click="handleViewContent(item.id)" 
                    class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold py-2 rounded-lg transition-colors">
              Ver Contenido
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>