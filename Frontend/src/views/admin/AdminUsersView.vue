<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/api/axios'
import AdminStatCard from '@/components/admin/AdminStatCard.vue'
import UserTable from '@/components/user/UserTable.vue'

const users = ref([])

const fetchUsers = async () => {
  try {
    const response = await api.get('/user')
    users.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error al obtener usuarios:', error.response?.data || error.message)
    users.value = []
  }
}

onMounted(fetchUsers)

const totalAdmins = computed(() => 
  users.value.filter(u => u.role?.name?.toLowerCase().includes('admin')).length || 0
)

const totalModeradores = computed(() => 
  users.value.filter(u => u.role?.name?.toLowerCase() === 'moderador').length || 0
)

const totalAuxiliares = computed(() => 
  users.value.filter(u => u.role?.name?.toLowerCase() === 'auxiliar').length || 0
)

const totalEstudiantes = computed(() => 
  users.value.filter(u => u.role?.name?.toLowerCase() === 'estudiante').length || 0
)
</script>

<template>
  <div class="p-4 md:p-0">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      <AdminStatCard title="Administradores" :count="totalAdmins" color="purple" icon="crown" />
      <AdminStatCard title="Moderadores" :count="totalModeradores" color="indigo" icon="shield" />
      <AdminStatCard title="Auxiliares" :count="totalAuxiliares" color="blue" icon="user-tie" />
      <AdminStatCard title="Estudiantes" :count="totalEstudiantes" color="green" icon="users" />
    </div>

    <section class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <UserTable :users="users" @refresh="fetchUsers" />
    </section>
  </div>
</template>