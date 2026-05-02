<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import { useToast } from "vue-toastification";

const toast = useToast();
const sections = ref([]);
const selectedCourse = ref('Teoría de Sistemas 1');

const fetchMaterials = async () => {
  try {
    // Simulando carga de materiales del curso actual
    const { data } = await api.get('/publications/course/active'); 
    // Aquí deberías agrupar la data por semanas en el frontend o recibirla así del backend
    sections.value = data; 
  } catch (error) {
    toast.error("Error al cargar materiales didácticos");
  }
};

const getIcon = (type) => {
  const icons = {
    'documento': 'fa-file-alt text-gray-500',
    'video': 'fa-video text-red-500',
    'link': 'fa-link text-blue-500'
  };
  return icons[type] || 'fa-folder text-indigo-500';
};

onMounted(fetchMaterials);
</script>

<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-end mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Gestión de Materiales y Grabaciones</h1>
          <div class="flex gap-4 mt-2">
            <button class="text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 pb-1">Mis Guías/Artículos</button>
            <button class="text-sm font-bold text-gray-400 hover:text-indigo-500 pb-1">Grabaciones de Clase</button>
          </div>
        </div>
        <button class="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
          <i class="fas fa-plus mr-2"></i> Agregar Nuevo Material
        </button>
      </div>

      <!-- Secciones (Semanas) -->
      <div v-for="section in sections" :key="section.title" class="mb-10">
        <h3 class="text-lg font-bold text-gray-700 mb-4 border-b border-gray-200 pb-2">
          {{ section.title }}
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="item in section.items" :key="item.id" 
               class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow relative group">
            
            <div class="flex justify-between items-start mb-3">
              <span class="bg-gray-100 px-2 py-1 rounded text-[10px] font-black uppercase text-gray-500 flex items-center">
                <i :class="['fas mr-1.5', getIcon(item.type)]"></i> {{ item.type }}
              </span>
              <button class="text-gray-300 hover:text-gray-600"><i class="fas fa-ellipsis-v"></i></button>
            </div>

            <h4 class="font-bold text-gray-800 mb-1">{{ item.title }}</h4>
            <p class="text-xs text-gray-500 mb-4 line-clamp-2">{{ item.description }}</p>
            
            <div class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-4">
              Publicación: {{ item.date }}
            </div>

            <div class="flex gap-4 pt-4 border-t border-gray-50">
              <button class="text-[10px] font-black uppercase text-gray-400 hover:text-indigo-600 flex items-center">
                <i class="fas fa-edit mr-1"></i> Editar
              </button>
              <button class="text-[10px] font-black uppercase text-gray-400 hover:text-red-500 flex items-center">
                <i class="fas fa-eye-slash mr-1"></i> Ocultar
              </button>
              <button class="text-[10px] font-black uppercase text-gray-400 hover:text-blue-500 flex items-center">
                <i class="fas fa-comments mr-1"></i> Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>