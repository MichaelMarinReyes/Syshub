<script setup>
import { ref } from 'vue';

const activeMenuId = ref(null);
const users = ref([]);
const isLoading = ref(true);
const fetchUsers = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get('http://localhost:3000/users', {
      headerds: {
        Authorization: `Brearer ${localStorage.getItem('token')}`
      }
    });
    users.value = response.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchUsers();
});

const toggleMenu = (id) => {
  activeMenuId.value = activeMenuId.value === id ? null : id;
};

const roleBadgeStyle = (role) => {
  const styles = {
    'Administrador': 'bg-purple-100 text-purple-700',
    'moderador': 'bg-indigo-100 text-indigo-700',
    'estudiante': 'bg-green-100 text-green-700',
    'auxiliar': 'bg-blue-100 text-blue-700',
  };
  return styles[role] || 'bg-gray-100 text-gray-700';
};
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left">
      <thead class="bg-gray-50 border-b border-gray-100">
        <tr>
          <th class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Usuario</th>
          <th class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Email</th>
          <th class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Rol</th>
          <th class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Estado</th>
          <th class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Acciones</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-50">
        <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50/50 transition-colors">
          <td class="px-6 py-4 flex items-center space-x-3">
            <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <i class="fas fa-user text-xs"></i>
            </div>
            <span class="font-medium text-gray-700">{{ user.nombre }} {{ user.apellido }}</span>
          </td>
          <td class="px-6 py-4 text-gray-500 text-sm">{{ user.email }}</td>
          <td class="px-6 py-4">
             <span :class="roleBadgeStyle(user.role)" class="px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit">
                {{ user.role }}
             </span>
          </td>
          <td class="px-6 py-4">
            <span class="flex items-center text-sm" :class="user.active ? 'text-green-600' : 'text-gray-400'">
              <span class="h-2 w-2 rounded-full mr-2" :class="user.active ? 'bg-green-500' : 'bg-gray-300'"></span>
              {{ user.active ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td class="px-6 py-4 relative">
             <button @click="toggleMenu(user.id)" class="text-gray-400 hover:text-gray-600 p-1">
               <i class="fas fa-ellipsis-v"></i>
             </button>

             <div v-if="activeMenuId === user.id" 
                  class="absolute right-10 top-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-lg z-50 py-2">
               <button class="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600">
                 <i class="fas fa-edit mr-2"></i> Editar Rol
               </button>
               <button class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                 <i class="fas fa-ban mr-2"></i> Suspender
               </button>
             </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>