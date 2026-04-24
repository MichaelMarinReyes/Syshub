<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useToast } from "vue-toastification";

const authStore = useAuthStore();
const toast = useToast();
const searchQuery = ref('');
const activeTab = ref('Más Populares');

const tabs = ['Más Populares', 'Recientes', 'Preguntas Técnicas'];

// Datos evolucionados con tipos de contenido (Pregunta vs Publicación)
const threads = ref([
  { id: 1, title: '¿Cómo configurar OSPF en Debian 12?', cat1: 'Redes', cat2: 'Infraestructura', creator: 'm_marin', responses: 5, votes: 12, type: 'Pregunta Técnica', date: '2026-04-23' },
  { id: 2, title: 'Guía rápida de SCRUM para proyectos de Sistemas', cat1: 'Gestión', cat2: 'Desarrollo', creator: 'v_ramos', responses: 2, votes: 8, type: 'Publicación', date: '2026-04-22' },
  { id: 3, title: 'Error al importar 1.5M de registros en Oracle', cat1: 'DBA', cat2: 'Tecnología', creator: 'e_lopez', responses: 10, votes: 15, type: 'Pregunta Técnica', date: '2026-04-24' },
  { id: 4, title: 'Mejores fuentes para la terminal Kitty', cat1: 'Debian', cat2: 'Tecnología', creator: 'm_marin', responses: 4, votes: 5, type: 'Publicación', date: '2026-04-24' },
]);

const canModerate = computed(() => ['Admin', 'Moderador'].includes(authStore.userRole));

// Filtrado por búsqueda y por Pestaña
const filteredThreads = computed(() => {
  let list = threads.value.filter(t => 
    t.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    t.creator.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  if (activeTab.value === 'Preguntas Técnicas') {
    return list.filter(t => t.type === 'Pregunta Técnica');
  }
  
  if (activeTab.value === 'Más Populares') {
    return list.sort((a, b) => b.votes - a.votes);
  }

  return list;
});

// Sistema de Valoración (Interacción)
const handleVote = (id, delta) => {
  const thread = threads.value.find(t => t.id === id);
  if (thread) {
    thread.votes += delta;
    toast.info(delta > 0 ? "Valoración positiva enviada" : "Valoración actualizada");
  }
};

const createPost = () => {
  toast.success("Abriendo editor de publicación...");
};
</script>

<template>
  <div class="p-6 bg-[#F8FAFC] min-h-screen">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Sys-Reddit: Foro de Discusión</h1>
        <p class="text-sm text-gray-500">Comunidad académica de Ingeniería en Sistemas</p>
      </div>
      
      <button @click="createPost" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
        <i class="fas fa-plus-circle"></i>
        <span>Nueva Publicación</span>
      </button>
    </div>

    <div class="bg-white rounded-t-2xl border-x border-t border-gray-100 p-3 flex flex-wrap items-center justify-between gap-4 shadow-sm">
      <div class="flex bg-gray-50 p-1 rounded-xl">
        <button 
          v-for="tab in tabs" :key="tab"
          @click="activeTab = tab"
          :class="activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          class="px-4 py-2 text-xs font-bold transition-all rounded-lg"
        >
          {{ tab }}
        </button>
      </div>

      <div class="flex items-center space-x-2">
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <i class="fas fa-search text-xs"></i>
          </span>
          <input 
            v-model="searchQuery"
            type="text" placeholder="Filtrar contenido..." 
            class="pl-9 pr-4 py-2 border border-gray-100 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all w-64"
          />
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
            <span :class="thread.type === 'Pregunta Técnica' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'"
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
              <span class="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5">
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
                  <div class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold">
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
            <button class="text-[10px] font-bold text-red-500 hover:bg-red-50 px-2 py-1 rounded transition-colors uppercase">
              <i class="fas fa-ban mr-1"></i> Suspender
            </button>
            <button class="text-[10px] font-bold text-gray-400 hover:bg-gray-50 px-2 py-1 rounded transition-colors uppercase">
              <i class="fas fa-eye-slash mr-1"></i> Ocultar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>