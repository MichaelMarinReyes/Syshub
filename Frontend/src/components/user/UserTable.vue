<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import api from '../../api/axios';
import { useToast } from "vue-toastification";

const toast = useToast();
const activeMenuId = ref(null);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showRoleModal = ref(false);
const selectedUser = ref(null);
const newRoleId = ref(null);
const isSubmitting = ref(false);
const availableRoles = ref([]);
const availableStatuses = ref([]);
const showStatusModal = ref(false);
const newStatusId = ref(null);

const fetchRoles = async () => {
  try {
    const response = await api.get('/roles');
    availableRoles.value = response.data;
  } catch (error) {
    console.error("Error al cargar roles:", error);
    toast.error("No se pudieron cargar los niveles de acceso");
  }
};

const fetchStatuses = async () => {
  try {
    const response = await api.get('/statuses');
    availableStatuses.value = response.data;
  } catch (error) {
    console.error("Error al cargar estados:", error);
  }
};

onMounted(() => {
  fetchRoles();
  fetchStatuses();
});

const props = defineProps({
  users: {
    type: Array,
    default: () => []
  },
  isLoading: Boolean
});

const emit = defineEmits(['refresh']);

const filteredUsers = computed(() => {
  if (!searchQuery.value) return props.users;
  const query = searchQuery.value.toLowerCase();
  return props.users.filter(user => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const email = (user.email || '').toLowerCase();
    const role = (user.role?.name || '').toLowerCase();
    const status = (user.status?.name || '').toLowerCase();
    return fullName.includes(query) || email.includes(query) || role.includes(query) || status.includes(query);
  });
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredUsers.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value));

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

const openStatusModal = (user) => {
  selectedUser.value = user;
  newStatusId.value = user.status?.id || null;
  showStatusModal.value = true;
  activeMenuId.value = null;
};

const updateUserStatus = async () => {
  if (!newStatusId.value || !selectedUser.value) return;
  isSubmitting.value = true;
  try {
    await api.patch(`/user/${selectedUser.value.id}/status`, {
      statusId: newStatusId.value
    });

    toast.success(`Estado de ${selectedUser.value.firstName} actualizado`);
    emit('refresh');
    showStatusModal.value = false;
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    toast.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg || "Error al cambiar el estado");
  } finally {
    isSubmitting.value = false;
  }
};

const openRoleModal = (user) => {
  selectedUser.value = user;
  newRoleId.value = user.role?.id || null;
  showRoleModal.value = true;
  activeMenuId.value = null;
};

const closeRoleModal = () => {
  showRoleModal.value = false;
  selectedUser.value = null;
  newRoleId.value = null;
};

const updateUserRole = async () => {
  if (!newRoleId.value || !selectedUser.value) return;
  isSubmitting.value = true;
  try {
    await api.patch(`/user/${selectedUser.value.id}/role`, { roleId: newRoleId.value });
    toast.success(`Rol actualizado para ${selectedUser.value.firstName}`);
    emit('refresh');
    closeRoleModal();
  } catch (error) {
    const errorMsg = error.response?.data?.message;
    toast.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg || "Error al actualizar");
  } finally {
    isSubmitting.value = false;
  }
};

const statusDotStyle = (statusName) => {
  const styles = {
    'Activo': 'bg-green-500',
    'Inactivo': 'bg-gray-400',
    'Suspendido': 'bg-red-500',
    'En Revisión': 'bg-orange-400'
  };
  return styles[statusName] || 'bg-gray-200';
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Header de Tabla -->
    <div class="p-4 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="relative flex-1 max-w-md">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <i class="fas fa-search text-xs"></i>
        </span>
        <input v-model="searchQuery" type="text" placeholder="Buscar usuarios..."
          class="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-acento/20 focus:border-acento transition-all" />
      </div>

      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <label class="text-xs text-gray-400 font-bold uppercase">Ver:</label>
          <select v-model="itemsPerPage"
            class="text-sm border-gray-200 rounded-md bg-gray-50 focus:ring-0 py-1 px-2 cursor-pointer outline-none font-bold text-primario">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="overflow-x-auto">
      <div v-if="isLoading" class="flex justify-center p-10">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-acento"></div>
      </div>

      <table v-else class="w-full text-left border-collapse min-w-[700px]">
        <thead class="bg-gray-50/50">
          <tr>
            <th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Usuario</th>
            <th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email</th>
            <th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Rol</th>
            <th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Estado</th>
            <th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="text-oscuro">
          <tr v-for="user in paginatedUsers" :key="user.id"
            class="border-b border-gray-50 hover:bg-fondo-suave/50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center space-x-3">
                <div
                  class="h-9 w-9 rounded-full bg-primario text-white flex items-center justify-center text-xs font-bold uppercase">
                  {{ user.firstName?.[0] }}{{ user.lastName?.[0] }}
                </div>
                <div>
                  <p class="font-semibold text-oscuro leading-none">{{ user.firstName }} {{ user.lastName }}</p>
                  <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">ID: {{ user.id?.split('-')[0] }}
                  </p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-gray-500 text-sm">{{ user.email }}</td>
            <td class="px-6 py-4">
              <span
                :class="['px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide', roleBadgeStyle(user.role?.name)]">
                {{ user.role?.name || 'Sin Rol' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span class="flex items-center space-x-2">
                <span
                  :class="['h-2 w-2 rounded-full', user.status?.name === 'Activo' ? 'bg-green-500' : 'bg-red-500']"></span>
                <span class="text-xs font-bold text-gray-600 uppercase">{{ user.status?.name }}</span>
              </span>
            </td>
            <td class="px-6 py-4 text-right relative">
              <button @click.stop="toggleMenu(user.id)"
                class="text-gray-400 hover:text-acento p-2 rounded-full hover:bg-blue-50">
                <i class="fas fa-ellipsis-v"></i>
              </button>

              <!-- Dropdown de Acciones -->
              <div v-if="activeMenuId === user.id"
                class="absolute right-6 mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-1.5 animate-in fade-in slide-in-from-top-1">
                <button @click="openRoleModal(user)"
                  class="w-full text-left px-3 py-2 text-xs font-bold text-gray-600 hover:bg-blue-50 rounded-lg flex items-center space-x-2 transition-colors">
                  <i class="fas fa-user-tag w-4 text-acento"></i>
                  <span>Cambiar Rol</span>
                </button>
                <!-- Botón de Sancionar corregido para abrir modal dinámico -->
                <button @click="openStatusModal(user)"
                  class="w-full text-left px-3 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 rounded-lg flex items-center space-x-2 transition-colors">
                  <i class="fas fa-gavel w-4"></i>
                  <span>Sancionar / Estado</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Cambio de Rol -->
    <Teleport to="body">
      <div v-if="showRoleModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-primario/40 backdrop-blur-sm" @click="closeRoleModal"></div>
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden animate-in zoom-in duration-200">
          <div class="bg-primario p-6 text-white text-center">
            <h3 class="text-lg font-bold">Ajustar Nivel de Acceso</h3>
            <p class="text-blue-100 text-[10px] mt-1 uppercase tracking-widest font-bold">{{ selectedUser?.firstName }}
              {{ selectedUser?.lastName }}</p>
          </div>
          <div class="p-6">
            <div class="space-y-2">
              <div v-for="role in availableRoles" :key="role.id" @click="newRoleId = role.id"
                :class="['p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between', newRoleId === role.id ? 'border-acento bg-blue-50' : 'border-gray-50 hover:border-gray-100']">
                <span
                  :class="['text-sm font-bold uppercase', newRoleId === role.id ? 'text-acento' : 'text-gray-500']">{{
                    role.name }}</span>
                <i v-if="newRoleId === role.id" class="fas fa-check-circle text-acento"></i>
              </div>
            </div>
            <div class="mt-8 flex items-center gap-3">
              <button @click="closeRoleModal"
                class="flex-1 py-3 text-xs font-bold text-gray-400 uppercase hover:bg-gray-50 rounded-xl transition-colors">Cancelar</button>
              <button @click="updateUserRole" :disabled="isSubmitting"
                class="flex-1 py-3 bg-acento text-white text-xs font-bold uppercase rounded-xl shadow-lg hover:bg-blue-700 disabled:opacity-50">
                {{ isSubmitting ? 'Procesando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal de Sancionar / Estado -->
    <Teleport to="body">
      <div v-if="showStatusModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-primario/40 backdrop-blur-sm" @click="showStatusModal = false"></div>
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden animate-in zoom-in duration-200">
          <div class="bg-orange-600 p-6 text-white text-center">
            <h3 class="text-lg font-bold">Sancionar / Cambiar Estado</h3>
            <p class="text-orange-100 text-[10px] mt-1 uppercase tracking-widest font-bold">{{ selectedUser?.firstName
            }} {{ selectedUser?.lastName }}</p>
          </div>
          <div class="p-6">
            <div class="space-y-2">
              <div v-for="status in availableStatuses" :key="status.id" @click="newStatusId = status.id"
                :class="['p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between', newStatusId === status.id ? 'border-orange-500 bg-orange-50' : 'border-gray-50 hover:border-gray-100']">
                <span
                  :class="['text-sm font-bold uppercase', newStatusId === status.id ? 'text-orange-600' : 'text-gray-500']">{{
                    status.name }}</span>
                <i v-if="newStatusId === status.id" class="fas fa-check-circle text-orange-500"></i>
              </div>
            </div>
            <div class="mt-8 flex items-center gap-3">
              <button @click="showStatusModal = false"
                class="flex-1 py-3 text-xs font-bold text-gray-400 uppercase hover:bg-gray-50 rounded-xl transition-colors">Cancelar</button>
              <button @click="updateUserStatus" :disabled="isSubmitting"
                class="flex-1 py-3 bg-orange-600 text-white text-xs font-bold uppercase rounded-xl shadow-lg hover:bg-orange-700 disabled:opacity-50">
                {{ isSubmitting ? 'Procesando...' : 'Aplicar Estado' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>