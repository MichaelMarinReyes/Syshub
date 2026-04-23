<script setup>
import AdminStatCard from '@/components/admin/AdminStatCard.vue'
import UserTable from '@/components/user/UserTable.vue'
</script>

<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <AdminStatCard title="Administradores" count="2" color="purple" icon="crown" />
      <AdminStatCard title="Moderadores" count="2" color="indigo" icon="shield" />
      <AdminStatCard title="Auxiliares" count="2" color="blue" icon="user-tie" />
      <AdminStatCard title="Estudiantes" count="3" color="green" icon="users" />
    </div>

    <section class="bg-white rounded-xl shadow-sm border border-gray-100">
      <UserTable />
    </section>
  </div>
</template>