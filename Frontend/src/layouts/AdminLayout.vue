<script setup>
import Sidebar from '@/components/admin/Sidebar.vue';
</script>

<template>
  <div class="flex">
    <Sidebar /> <main class="flex-1">
      <router-view /> 
    </main>
  </div>
</template>