<script setup>
import { ref } from 'vue';
import { useToast } from "vue-toastification";

const toast = useToast();
const projects = ref([
  { id: 1, author: 'Michael Marín', type: 'SaaS', title: 'Sistema de Ventas para Escuelas', date: '2026-05-01', priority: 'high' },
  { id: 2, author: 'Vicente', type: 'IoT', title: 'Estación de Calidad de Aire', date: '2026-04-28', priority: 'medium' }
]);

const getPriorityColor = (priority) => {
  if (priority === 'high') return 'text-red-500';
  if (priority === 'medium') return 'text-orange-500';
  return 'text-green-500';
};
</script>

<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800">Panel de Curaduría</h1>
        <p class="text-sm text-gray-500">Selecciona los proyectos más destacados para la página principal.</p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 class="font-bold text-gray-700">Cola de Postulaciones</h2>
          <div class="flex gap-2">
            <input type="text" placeholder="Filtrar..." class="text-xs border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none w-64">
            <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase">Ver Detalles</button>
          </div>
        </div>

        <table class="w-full text-left text-sm">
          <thead>
            <tr class="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
              <th class="py-4 px-6">Postulado por</th>
              <th class="py-4 px-6">Tipo</th>
              <th class="py-4 px-6">Proyecto</th>
              <th class="py-4 px-6">Fecha</th>
              <th class="py-4 px-6">Impacto</th>
              <th class="py-4 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="p in projects" :key="p.id" class="hover:bg-blue-50/20 transition-all group">
              <td class="py-4 px-6 font-bold text-gray-700">{{ p.author }}</td>
              <td class="py-4 px-6 text-xs text-gray-500">{{ p.type }}</td>
              <td class="py-4 px-6">
                <div class="text-gray-800 font-medium">{{ p.title }}</div>
              </td>
              <td class="py-4 px-6 text-gray-400 text-xs">{{ p.date }}</td>
              <td class="py-4 px-6">
                <i class="fas fa-flag" :class="getPriorityColor(p.priority)"></i>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex gap-2 justify-end">
                  <button class="bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-indigo-600 hover:text-white transition-all">Revisar</button>
                  <button class="bg-green-100 text-green-600 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-green-600 hover:text-white transition-all">Destacar</button>
                  <button class="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-red-600 hover:text-white transition-all">Ocultar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>