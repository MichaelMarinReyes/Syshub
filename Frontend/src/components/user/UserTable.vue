<script setup>
import { ref, computed, watch } from 'vue';
import api from '../../api/axios';
import { useToast } from "vue-toastification";

const toast = useToast();
const activeMenuId = ref(null);
const searchQuery = ref('');

// --- Lógica de Paginación ---
const currentPage = ref(1);
const itemsPerPage = ref(5); // Valor inicial: 5 usuarios por página

const props = defineProps({
  users: {
    type: Array,
    default: () => []
  },
  isLoading: Boolean
});

const emit = defineEmits(['refresh']);

// 1. Primero filtramos
const filteredUsers = computed(() => {
  if (!searchQuery.value) return props.users;
  const query = searchQuery.value.toLowerCase();
  return props.users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    const role = user.role?.name?.toLowerCase() || '';
    const status = user.status?.name?.toLowerCase() || '';
    return fullName.includes(query) || email.includes(query) || role.includes(query) || status.includes(query);
  });
});

// 2. Luego paginamos los resultados filtrados
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredUsers.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value));

// Resetear a la página 1 si cambia la búsqueda o la cantidad por página
watch([searchQuery, itemsPerPage], () => {
  currentPage.value = 1;
});

const toggleMenu = (id) => {
  activeMenuId.value = activeMenuId.value === id ? null : id;
};

const roleBadgeStyle = (role) => {
  if (!role) return 'bg-gray-100 text-gray-700';
  const r = role.toString().toLowerCase();
  const styles = {
    'administrador': 'bg-purple-100 text-purple-700',
    'admin': 'bg-purple-100 text-purple-700',
    'moderador': 'bg-indigo-100 text-indigo-700',
    'estudiante': 'bg-green-100 text-green-700',
    'auxiliar': 'bg-blue-100 text-blue-700',
  };
  return styles[r] || 'bg-gray-100 text-gray-700';
};

const toggleUserStatus = async (user) => {
  const isActivo = user.status?.name === 'Activo';
  const action = isActivo ? 'suspender' : 'habilitar';
  try {
    await api.patch(`/users/${user.id}/status`, {
      status: isActivo ? 'Suspendido' : 'Activo'
    });
    toast.success(`Usuario ${action}ado con éxito`);
    emit('refresh');
  } catch (error) {
    toast.error(`No se pudo ${action} al usuario`);
  } finally {
    activeMenuId.value = null;
  }
};

const openRoleModal = (user) => {
  activeMenuId.value = null;
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    
    <div class="p-4 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="relative flex-1 max-w-md">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <i class="fas fa-search text-xs"></i>
        </span>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Buscar usuarios..." 
          class="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>
      
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <label class="text-xs text-gray-400 font-medium uppercase">Ver:</label>
          <select v-model="itemsPerPage" class="text-sm border-gray-200 rounded-md bg-gray-50 focus:ring-0 py-1 px-2 cursor-pointer outline-none">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>
    </div>

    <div class="overflow-x-auto">
      <div v-if="isLoading" class="flex justify-center p-10">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>

      <table v-else class="w-full text-left border-collapse">
        <thead class="bg-gray-50/50">
          <tr>
            <th class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Usuario</th>
            <th class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Email</th>
            <th class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Rol</th>
            <th class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Estado</th>
            <th class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="text-gray-700">
          <tr v-for="user in paginatedUsers" :key="user.id" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center space-x-3">
                <div class="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                  {{ user.firstName[0] }}{{ user.lastName[0] }}
                </div>
                <div>
                  <p class="font-semibold text-gray-800 leading-none">{{ user.firstName }} {{ user.lastName }}</p>
                  <p class="text-[10px] text-gray-400 mt-1 uppercase">ID: {{ user.id.split('-')[0] }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-gray-500 text-sm">{{ user.email }}</td>
            <td class="px-6 py-4">
              <span :class="['px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide', roleBadgeStyle(user.role?.name)]">
                {{ user.role?.name }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span class="flex items-center space-x-2">
                <span :class="['h-2 w-2 rounded-full', user.status?.name === 'Activo' ? 'bg-green-500' : 'bg-red-500']"></span>
                <span class="text-sm font-medium">{{ user.status?.name }}</span>
              </span>
            </td>
            <td class="px-6 py-4 text-right relative">
              <button @click.stop="toggleMenu(user.id)" class="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50">
                <i class="fas fa-ellipsis-v"></i>
              </button>

              <div v-if="activeMenuId === user.id" class="absolute right-6 mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-1.5">
                <button @click="openRoleModal(user)" class="w-full text-left px-3 py-2 text-xs font-medium text-gray-600 hover:bg-blue-50 rounded-lg flex items-center space-x-2">
                  <i class="fas fa-user-tag w-4"></i>
                  <span>Cambiar Rol</span>
                </button>
                <button @click="toggleUserStatus(user)" :class="['w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center space-x-2', user.status?.name === 'Activo' ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50']">
                  <i :class="['fas w-4', user.status?.name === 'Activo' ? 'fa-user-slash' : 'fa-user-check']"></i>
                  <span>{{ user.status?.name === 'Activo' ? 'Suspender' : 'Habilitar' }}</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
      <p class="text-sm text-gray-500 italic">
        Mostrando <span class="font-bold text-gray-800">{{ paginatedUsers.length }}</span> de <span class="font-bold text-gray-800">{{ filteredUsers.length }}</span> usuarios
      </p>
      
      <div class="flex items-center space-x-2">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <i class="fas fa-chevron-left text-xs"></i>
        </button>
        
        <span class="text-xs font-bold text-gray-500 uppercase tracking-tighter mx-2">
          Página {{ currentPage }} de {{ totalPages || 1 }}
        </span>

        <button 
          @click="currentPage++" 
          :disabled="currentPage >= totalPages"
          class="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <i class="fas fa-chevron-right text-xs"></i>
        </button>
      </div>
    </div>
  </div>
</template>