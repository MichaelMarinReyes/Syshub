<script setup>
import { ref } from 'vue';

const reports = ref([
  { id: 1, user: 'Syshub', type: 'Desarrollo', content: 'Contenido inapropiado que incluye lenguaje ofensivo...', date: '2022-01-12', priority: 'high' },
  { id: 2, user: 'Syshub', type: 'Posts', content: 'Información errónea sobre temas sensibles', date: '2022-01-12', priority: 'medium' },
  { id: 3, user: 'Syshub', type: 'Posts', content: 'Spam publicando el mismo enlace...', date: '2022-01-12', priority: 'medium' },
  { id: 4, user: 'Syshub', type: 'Comentario', content: 'Acoso hacia otro usuario en los comentarios', date: '2022-01-12', priority: 'high' },
  { id: 5, user: 'Syshub', type: 'Desarrollo', content: 'Contenido pirata donde seguro cualquier link externo', date: '2022-01-12', priority: 'low' },
]);

const getPriorityClass = (priority) => {
  switch (priority) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

const handleAction = (action, report) => {
  console.log(`Ejecutando ${action} en el reporte:`, report.id);
  // Aquí llamarías a tus endpoints del backend
};
</script>
<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-2xl font-bold mb-6">Moderación de Contenido</h1>

    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold">Queue</h2>
        <div class="flex gap-2">
          <button class="flex items-center px-4 py-2 text-sm border rounded hover:bg-gray-50">
            <span class="mr-2">icon-filtrar</span> Filtrar
          </button>
          <button class="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600">
            Ver Detalles
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="text-gray-400 uppercase text-xs border-b">
              <th class="py-3 px-4">Reportado por</th>
              <th class="py-3 px-4">Tipo</th>
              <th class="py-3 px-4">Contenido</th>
              <th class="py-3 px-4">Fecha</th>
              <th class="py-3 px-4">Prioridad</th>
              <th class="py-3 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in reports" :key="report.id" class="border-b hover:bg-gray-50 transition">
              <td class="py-4 px-4 flex items-center">
                <div class="w-8 h-8 bg-gray-200 rounded-full mr-2"></div> {{ report.user }}
              </td>
              <td class="py-4 px-4">{{ report.type }}</td>
              <td class="py-4 px-4 max-w-xs truncate">{{ report.content }}</td>
              <td class="py-4 px-4 text-gray-500">{{ report.date }}</td>
              <td class="py-4 px-4">
                <span :class="getPriorityClass(report.priority)" class="inline-block w-3 h-3 rounded-full"></span>
              </td>
              <td class="py-4 px-4 flex gap-2">
                <button @click="handleAction('revisar', report)" class="bg-blue-500 text-white px-3 py-1 rounded text-xs">Revisar</button>
                <button @click="handleAction('aprobar', report)" class="bg-green-500 text-white px-3 py-1 rounded text-xs">Aprobar</button>
                <button @click="handleAction('eliminar', report)" class="bg-red-500 text-white px-3 py-1 rounded text-xs">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 flex gap-4">
        <select class="border rounded px-3 py-1 text-sm bg-white">
          <option>Física</option>
        </select>
        <select class="border rounded px-3 py-1 text-sm bg-white">
          <option>Estado</option>
        </select>
        <select class="border rounded px-3 py-1 text-sm bg-white">
          <option>Aprobante</option>
        </select>
        <button class="border rounded px-4 py-1 text-sm hover:bg-gray-50">Agrupar</button>
      </div>
    </div>
  </div>
</template>