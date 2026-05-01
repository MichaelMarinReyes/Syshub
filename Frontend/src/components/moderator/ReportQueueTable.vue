<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  reports: {
    type: Array,
    required: true,
    default: () => []
  }
});

const emit = defineEmits(['inspect', 'approve', 'delete', 'selectionChanged']);
const selectedReports = ref([]);

const isAllSelected = computed({
  get() {
    return props.reports.length > 0 && selectedReports.value.length === props.reports.length;
  },
  set(value) {
    selectedReports.value = value ? props.reports.map(report => report.id) : [];
  }
});

const handleSelectionChange = () => {
  emit('selectionChanged', selectedReports.value);
};

const priorityFlagStyle = (priority) => {
  const styles = {
    Alta: 'text-red-500',
    Media: 'text-yellow-500',
    Baja: 'text-green-500',
    Urgente: 'text-purple-600'
  };
  return styles[priority] || 'text-gray-400';
};

const formatDate = (dateString) => {
  if (!dateString) return '---';
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString();
  } catch (e) {
    return dateString;
  }
};
</script>

<template>
  <!-- Usamos 'fondo-suave' para el borde y 'oscuro' para textos principales -->
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse min-w-full">
        <!-- Header con tu color 'primario' para el texto de encabezado -->
        <thead class="bg-gray-50 border-b border-gray-100 hidden sm:table-header-group">
          <tr>
            <th class="px-6 py-4 w-12">
              <input v-model="isAllSelected" type="checkbox" 
                class="h-4 w-4 rounded border-gray-300 text-acento focus:ring-acento cursor-pointer" 
                @change="handleSelectionChange" />
            </th>
            <th class="px-4 py-4 text-[11px] font-bold text-primario uppercase tracking-wider">Reportado por</th>
            <th class="px-4 py-4 text-[11px] font-bold text-primario uppercase tracking-wider">Tipo</th>
            <th class="px-4 py-4 text-[11px] font-bold text-primario uppercase tracking-wider">Contenido</th>
            <th class="px-4 py-4 text-[11px] font-bold text-primario uppercase tracking-wider">Fecha</th>
            <th class="px-4 py-4 text-[11px] font-bold text-primario uppercase tracking-wider text-center">Prioridad</th>
            <th class="px-4 py-4 text-[11px] font-bold text-primario uppercase tracking-wider text-right">Acciones</th>
          </tr>
        </thead>

        <tbody class="text-sm text-oscuro block sm:table-row-group">
          <tr v-for="report in reports" :key="report.id"
            class="border-b border-gray-50 hover:bg-fondo-suave/50 transition-colors block sm:table-row p-4 sm:p-0"
            :class="{ 'bg-blue-50/50': selectedReports.includes(report.id) }">

            <!-- Checkbox -->
            <td class="px-6 py-4 hidden sm:table-cell w-12">
              <input v-model="selectedReports" type="checkbox" :value="report.id" 
                class="h-4 w-4 rounded border-gray-300 text-acento focus:ring-acento" 
                @change="handleSelectionChange" />
            </td>

            <!-- Usuario -->
            <td class="px-2 py-3 sm:px-4 sm:py-4 block sm:table-cell">
              <div class="flex items-center space-x-3">
                <!-- Avatar usando tu color 'primario' -->
                <div class="h-10 w-10 sm:h-9 sm:w-9 rounded-full bg-primario text-white flex-shrink-0 flex items-center justify-center text-xs font-bold uppercase">
                  {{ report.reporterName?.[0] || '?' }}
                </div>
                <div class="min-w-0">
                  <p class="font-semibold text-oscuro truncate">{{ report.reporterName || 'Usuario Desconocido' }}</p>
                  <p class="text-[10px] text-gray-400 uppercase tracking-tighter">ID: {{ report.id?.split('-')[0] || 'N/A' }}</p>
                </div>
              </div>
            </td>

            <!-- Tipo (Etiquetas con color 'acento') -->
            <td class="px-2 py-1 sm:px-4 sm:py-4 block sm:table-cell">
              <span class="sm:hidden text-[10px] font-bold text-gray-400 uppercase mr-2">Tipo:</span>
              <span :class="{
                'text-orange-600 bg-orange-50': report.type === 'Usuario',
                'text-acento bg-blue-50': report.type === 'Publicación',
                'text-purple-600 bg-purple-50': report.type === 'Artículo'
              }" class="px-2 py-0.5 rounded text-[11px] font-bold uppercase">
                {{ report.type || 'General' }}
              </span>
            </td>

            <!-- Contenido -->
            <td class="px-2 py-1 sm:px-4 sm:py-4 block sm:table-cell">
               <span class="sm:hidden text-[10px] font-bold text-gray-400 uppercase mr-2">Motivo:</span>
               <p class="text-gray-600 inline sm:block truncate max-w-full sm:max-w-[200px]">
                {{ report.content || 'Sin descripción' }}
              </p>
            </td>

            <!-- Fecha -->
            <td class="px-2 py-1 sm:px-4 sm:py-4 block sm:table-cell text-gray-500 text-xs">
              <span class="sm:hidden text-[10px] font-bold text-gray-400 uppercase mr-2">Fecha:</span>
              {{ formatDate(report.date) }}
            </td>

            <!-- Prioridad (Solo desktop) -->
            <td class="px-4 py-4 hidden sm:table-cell text-center">
              <i :class="['fas fa-flag text-lg', priorityFlagStyle(report.priority)]"></i>
            </td>

            <!-- Acciones (Usando 'acento' y 'primario') -->
            <td class="px-2 py-4 sm:px-4 sm:py-4 block sm:table-cell text-right">
              <div class="flex flex-row sm:justify-end gap-2">
                <button @click="emit('inspect', report)" 
                  class="flex-1 sm:flex-none px-3 py-2 bg-acento text-white text-[10px] font-bold uppercase rounded shadow-sm hover:opacity-90 transition-opacity">
                  Revisar
                </button>
                <button @click="emit('approve', report)" 
                  class="flex-1 sm:flex-none px-3 py-2 bg-green-600 text-white text-[10px] font-bold uppercase rounded shadow-sm hover:opacity-90 transition-opacity">
                  Aprobar
                </button>
                <button @click="emit('delete', report)" 
                  class="flex-1 sm:flex-none px-3 py-2 bg-red-600 text-white text-[10px] font-bold uppercase rounded shadow-sm hover:opacity-90 transition-opacity">
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>