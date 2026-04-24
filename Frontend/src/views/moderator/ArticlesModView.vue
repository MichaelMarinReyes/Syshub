<script setup>
const articles = [
  { id: 1, title: 'Guía de Debian 13 para Estudiantes', status: 'Publicado' },
  { id: 2, title: 'Configuración de OSPF en Routers Reales', status: 'Borrador' }
];
</script>

<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Artículos</h2>
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Título</th>
            <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Estado</th>
            <th class="px-6 py-4 text-right px-6">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="art in articles" :key="art.id" class="border-t border-gray-50">
            <td class="px-6 py-4 text-sm font-medium text-gray-700">{{ art.title }}</td>
            <td class="px-6 py-4">
              <span :class="art.status === 'Publicado' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'" 
                    class="px-2 py-1 rounded text-[10px] font-bold uppercase">
                {{ art.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-right text-gray-400">
              <button class="hover:text-blue-600"><i class="fas fa-edit"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>