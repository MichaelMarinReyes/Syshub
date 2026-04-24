<script setup>
import { ref, computed } from 'vue';

// Definimos las props que recibirá del padre
const props = defineProps({
  reports: {
    type: Array,
    required: true,
    default: () => []
  }
});

// Emits para comunicar acciones al componente padre
const emit = defineEmits(['inspect', 'approve', 'delete', 'selectionChanged']);

// Estado de selección
const selectedReports = ref([]);

// Lógica del checkbox maestro
const isAllSelected = computed({
  get() {
    return props.reports.length > 0 && selectedReports.value.length === props.reports.length;
  },
  set(value) {
    if (value) {
      selectedReports.value = props.reports.map(report => report.id);
    } else {
      selectedReports.value = [];
    }
  }
});

// Emitir cambios de selección para acciones masivas (inferiores)
const handleSelectionChange = () => {
  emit('selectionChanged', selectedReports.value);
};

// Función para determinar el color de la bandera según la prioridad
const priorityFlagStyle = (priority) => {
  const styles = {
    Alta: 'text-red-500',
    Media: 'text-yellow-500',
    Baja: 'text-green-500',
    Urgente: 'text-purple-600'
  };
  return styles[priority] || 'text-gray-400';
};
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <table class="w-full text-left border-collapse">
      <thead class="bg-gray-50/50 border-b border-gray-100">
        <tr>
          <th class="px-6 py-4 w-12">
            <input 
              v-model="isAllSelected"
              type="checkbox" 
              class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              @change="handleSelectionChange"
            />
          </th>
          <th class="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Reportado por</th>
          <th class="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tipo</th>
          <th class="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Contenido</th>
          <th class="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
          <th class="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Prioridad</th>
          <th class="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
        </tr>
      </thead>
      
      <tbody class="text-sm text-gray-700">
        <tr v-for="report in reports" :key="report.id" 
            class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
            :class="{ 'bg-blue-50/30': selectedReports.includes(report.id) }">
          
          <td class="px-6 py-4">
            <input 
              v-model="selectedReports"
              type="checkbox" 
              :value="report.id"
              class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              @change="handleSelectionChange"
            />
          </td>
          
          <td class="px-4 py-4">
            <div class="flex items-center space-x-3">
              <div class="h-9 w-9 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold shadow-inner">
                {{ report.reporterName[0] }}
              </div>
              <div>
                <p class="font-semibold text-gray-800 leading-none">{{ report.reporterName }}</p>
                <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">ID: {{ report.id.split('-')[0] }}</p>
              </div>
            </div>
          </td>
          
          <td class="px-4 py-4 font-medium text-gray-500">{{ report.type }}</td>
          
          <td class="px-4 py-4 max-w-[300px]">
            <p class="text-gray-600 truncate" :title="report.content">{{ report.content }}</p>
          </td>
          
          <td class="px-4 py-4 text-gray-500 text-xs tabular-nums">{{ report.date }}</td>
          
          <td class="px-4 py-4 text-center">
            <i :class="['fas fa-flag text-lg', priorityFlagStyle(report.priority)]" :title="`Prioridad ${report.priority}`"></i>
          </td>
          
          <td class="px-4 py-4 text-right">
            <div class="flex items-center justify-end space-x-2">
              <button 
                @click="emit('inspect', report)"
                class="px-3 py-1.5 bg-[#2196F3] text-white text-[10px] font-bold uppercase rounded hover:bg-blue-600 transition-all shadow-sm"
              >
                Revisar
              </button>
              <button 
                @click="emit('approve', report)"
                class="px-3 py-1.5 bg-[#4CAF50] text-white text-[10px] font-bold uppercase rounded hover:bg-green-600 transition-all shadow-sm"
              >
                Aprobar
              </button>
              <button 
                @click="emit('delete', report)"
                class="px-3 py-1.5 bg-[#F44336] text-white text-[10px] font-bold uppercase rounded hover:bg-red-600 transition-all shadow-sm"
              >
                Eliminar
              </button>
              <button class="text-gray-400 hover:text-gray-600 ml-2">
                <i class="fas fa-ellipsis-v text-xs"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="reports.length === 0" class="text-center py-16 border-t border-gray-100 bg-gray-50">
      <i class="fas fa-flag-checkered text-5xl text-gray-300 mb-4"></i>
      <p class="text-gray-500 font-medium">¡La cola está limpia!</p>
      <p class="text-sm text-gray-400 mt-1">No hay reportes pendientes de revisión.</p>
    </div>
  </div>
</template>