<script setup>
import { ref, computed, onMounted } from 'vue';
import AdminStatCard from '@/components/admin/AdminStatCard.vue';
import ReportQueueTable from '@/components/moderator/ReportQueueTable.vue';
import api from '@/api/axios';

const reports = ref([]);
const isLoading = ref(true);

// Datos para las tarjetas de moderación
const stats = computed(() => [
  { title: 'Cola de Reportes', count: reports.value.length, color: 'purple', icon: 'flag' },
  { title: 'Revisión Pendiente', count: 12, color: 'indigo', icon: 'clock' },
  { title: 'Foros Activos', count: 45, color: 'blue', icon: 'comments' },
  { title: 'Artículos Nuevos', count: 8, color: 'green', icon: 'file-alt' }
]);

const fetchReports = async () => {
  try {
    isLoading.value = true;
    const response = await api.get('/reports');
    reports.value = response.data;
  } catch (error) {
    console.error('Error al cargar reportes:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchReports);
</script>

<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-800">Panel de Moderación</h2>
      <button @click="fetchReports" class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-2">
        <i class="fas fa-sync-alt" :class="{ 'animate-spin': isLoading }"></i>
        <span>Actualizar Cola</span>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <AdminStatCard 
        v-for="stat in stats" 
        :key="stat.title"
        :title="stat.title"
        :count="stat.count"
        :color="stat.color"
        :icon="stat.icon"
      />
    </div>

    <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
        <h3 class="font-bold text-gray-700 uppercase tracking-widest text-sm">Cola de Reportes</h3>
        <div class="flex space-x-2">
          <button class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-all">
            <i class="fas fa-filter mr-2"></i>Filtrar
          </button>
        </div>
      </div>
      
      <ReportQueueTable :reports="reports" :is-loading="isLoading" @refresh="fetchReports" />
    </section>
  </div>
</template>