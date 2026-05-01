<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const menuConfig = {
  Admin: [
    { name: 'Usuarios', to: '/admin/usuarios', icon: 'fa-users-cog' },
    { name: 'Reportes Globales', to: '/admin/reportes', icon: 'fa-shield-alt' },
    { name: 'Clasificación', to: '/admin/clasificacion', icon: 'fa-layer-group' },
  ],
  Moderador: [
    { name: 'Cola de Reportes', to: '/moderador/reportes', icon: 'fa-flag' },
    { name: 'Revisión Pendiente', to: '/moderador/revision', icon: 'fa-clock' },
    { name: 'Gestión Contenido', to: '/moderador/articulos-global', icon: 'fa-tasks' },
  ],
}

const generalItems = [
  { name: 'Sys-Reddit', to: '/app/sys-reddit', icon: 'fa-comments' },
  { name: 'Mis Artículos', to: '/app/articulos', icon: 'fa-file-alt' },
]

const roleMenuItems = computed(() => {
  const role = authStore.userRole;
  return menuConfig[role] || [];
})

const sidebarTitle = computed(() => `SYSHUB ${authStore.userRole?.toUpperCase() || 'APP'}`)
</script>

<template>
  <aside class="w-64 bg-[#2196F3] min-h-screen text-white flex flex-col shadow-xl">

    <div class="p-6 flex items-center space-x-3 border-b border-blue-400/30">
      <div class="bg-white/20 p-2 rounded-lg">
        <i class="fas fa-terminal text-sm"></i>
      </div>
      <span class="font-bold tracking-wider text-lg italic">{{ sidebarTitle }}</span>
    </div>

    <nav class="flex-1 mt-6 px-4 flex flex-col gap-y-6">

      <div>
        <p class="px-3 text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-2 opacity-70">Personal</p>
        <div class="space-y-1">
          <router-link v-for="item in generalItems" :key="item.to" :to="item.to"
            class="flex items-center space-x-3 p-3 rounded-xl transition-all text-blue-50 hover:bg-white/10 hover:text-white"
            active-class="bg-white/20 text-white border border-white/20 shadow-inner">
            <i :class="['fas', item.icon, 'w-5']"></i>
            <span class="font-medium text-sm">{{ item.name }}</span>
          </router-link>
        </div>
      </div>

      <div v-if="roleMenuItems.length > 0">
        <p class="px-3 text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-2 opacity-70">Administración</p>
        <div class="space-y-1">
          <router-link v-for="item in roleMenuItems" :key="item.to" :to="item.to"
            class="flex items-center space-x-3 p-3 rounded-xl transition-all text-blue-50 hover:bg-white/10 hover:text-white"
            active-class="bg-white/20 text-white border border-white/20 shadow-inner">
            <i :class="['fas', item.icon, 'w-5']"></i>
            <span class="font-medium text-sm">{{ item.name }}</span>
          </router-link>
        </div>
      </div>

    </nav>

    <div class="p-4 border-t border-blue-400/30">
      <div class="mb-4 px-3 py-2 bg-blue-800/40 rounded-lg border border-white/10">
        <p class="text-[10px] text-blue-200 uppercase font-bold">Usuario</p>
        <p class="text-xs truncate">{{ authStore.user?.email || 'michael@cunoc.edu.gt' }}</p>
      </div>
      <button @click="handleLogout"
        class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/20 text-blue-100 hover:text-red-200 transition-colors group">
        <i class="fas fa-sign-out-alt w-5 group-hover:scale-110 transition-transform"></i>
        <span class="font-medium text-sm">Cerrar Sesión</span>
      </button>
    </div>
  </aside>
</template>