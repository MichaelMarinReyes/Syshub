<script setup>
import ReportQueueTable from '@/components/moderator/ReportQueueTable.vue';
</script>

<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Moderación General - Cola de Reportes</h2>
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
      <ReportQueueTable :reports="[]" :is-loading="false" />
    </div>
  </div>
</template>