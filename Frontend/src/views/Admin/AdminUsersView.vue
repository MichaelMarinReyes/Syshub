<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/api/axios'
import AdminStatCard from '@/components/admin/AdminStatCard.vue'
import UserTable from '@/components/user/UserTable.vue'

const users = ref([])

const fetchUsers = async () => {
  try {
    const response = await api.get('/users')
    users.value = response.data
  } catch (error) {
    console.error('Error:', error)
  }
}

onMounted(fetchUsers)

const totalAdmins = computed(() => users.value.filter(u => u.role?.name.toLowerCase().includes('admin')).length)
const totalModeradores = computed(() => users.value.filter(u => u.role?.name.toLowerCase() === 'moderador').length)
const totalAuxiliares = computed(() => users.value.filter(u => u.role?.name.toLowerCase() === 'auxiliar').length)
const totalEstudiantes = computed(() => users.value.filter(u => u.role?.name.toLowerCase() === 'estudiante').length)
</script>

<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <AdminStatCard title="Administradores" :count="totalAdmins" color="purple" icon="crown" />
      <AdminStatCard title="Moderadores" :count="totalModeradores" color="indigo" icon="shield" />
      <AdminStatCard title="Auxiliares" :count="totalAuxiliares" color="blue" icon="user-tie" />
      <AdminStatCard title="Estudiantes" :count="totalEstudiantes" color="green" icon="users" />
    </div>

    <section class="bg-white rounded-xl shadow-sm border border-gray-100">
      <UserTable :users="users" @refresh="fetchUsers" />
    </section>
  </div>
</template>