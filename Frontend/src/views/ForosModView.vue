<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// Control de permisos: Admin y Moderador pueden gestionar
const canModerate = computed(() => 
  ['Admin', 'Moderador'].includes(authStore.userRole)
);

const threads = ref([
  {
    id: 1,
    title: 'Título del Hilo',
    category: 'IA',
    creator: 'Sys-Reddit',
    responses: 9,
    lastActivity: '27 de anumizo',
    isPinned: true
  },
  {
    id: 2,
    title: 'Título del Hilo',
    category: 'Desarrollo',
    creator: 'Sys-Reddit',
    responses: 9,
    lastActivity: '17 de anumizo',
    isPinned: false
  }
  // ... más hilos
]);

// Acciones de Moderación
const closeThread = (id) => console.log("Cerrando hilo:", id);
const moveCategory = (id) => console.log("Moviendo categoría:", id);
const hideThread = (id) => console.log("Ocultando hilo:", id);
</script>

<template>
  <div class="p-6 bg-[#F1F5F9] min-h-screen">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold text-gray-800">Foros de Discusión - Hilos Abiertos</h2>
      
      <div class="relative">
        <select class="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10">
          <option>🚀 Sys-Reddit</option>
        </select>
        <i class="fas fa-chevron-down absolute right-3 top-3 text-gray-400 text-xs pointer-events-none"></i>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="thread in threads" :key="thread.id" 
           class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative group hover:shadow-md transition-shadow">
        
        <button class="absolute top-6 right-6 text-gray-300 hover:text-gray-500">
          <i class="fas fa-ellipsis-v"></i>
        </button>

        <div v-if="thread.isPinned" class="flex items-center text-gray-400 text-xs font-bold mb-2 gap-1 uppercase tracking-wider">
          <i class="fas fa-thumbtack rotate-45 text-[10px]"></i> Fijar
        </div>

        <h3 class="text-xl font-bold text-gray-800 mb-4">{{ thread.title }}</h3>

        <div class="grid grid-cols-3 gap-4 mb-6">
          <div>
            <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Categoría</p>
            <span :class="thread.category === 'IA' ? 'bg-green-100 text-green-700' : 'bg-emerald-100 text-emerald-700'"
                  class="px-2 py-0.5 rounded text-[11px] font-bold flex items-center w-fit">
              <i class="fas fa-circle text-[6px] mr-1.5"></i> {{ thread.category }}
            </span>
          </div>
          <div>
            <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Creador</p>
            <p class="text-xs font-bold text-gray-700">{{ thread.creator }}</p>
          </div>
          <div class="flex gap-4">
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Respuestas</p>
              <p class="text-xs font-bold text-gray-700">{{ thread.responses }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Última Actividad</p>
              <p class="text-xs font-bold text-gray-700 whitespace-nowrap">{{ thread.lastActivity }}</p>
            </div>
          </div>
        </div>

        <div v-if="canModerate" class="flex items-center gap-2 pt-4 border-t border-gray-50">
          <button @click="closeThread(thread.id)" 
                  class="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 border border-red-100">
            <i class="fas fa-times text-[10px]"></i> Cerrar Hilo
          </button>
          
          <button @click="moveCategory(thread.id)" 
                  class="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[10px] font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 border border-gray-100">
            <i class="fas fa-share text-[10px]"></i> Mover Categoria
          </button>
          
          <button @click="hideThread(thread.id)" 
                  class="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[10px] font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 border border-gray-100">
            <i class="fas fa-eye text-[10px]"></i> Ocultar
          </button>
        </div>

        <div v-else class="pt-4 border-t border-gray-50 text-right">
          <button class="text-blue-600 font-bold text-xs hover:underline">
            Leer conversación <i class="fas fa-arrow-right ml-1"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>