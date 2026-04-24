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
    { name: 'Usuarios', to: '/admin/usuarios', icon: 'fa-users' },
    { name: 'Reportes', to: '/admin/reportes', icon: 'fa-shield-alt' },
    { name: 'Clasificación', to: '/admin/clasificacion', icon: 'fa-layer-group' },
  ],
  Moderador: [
    { name: 'Cola de Reportes', to: '/moderador/reportes', icon: 'fa-flag' },
    { name: 'Revisión', to: '/moderador/revision', icon: 'fa-clock' },
    { name: 'Foros', to: '/moderador/foros', icon: 'fa-comments' },
    { name: 'Artículos', to: '/moderador/articulos', icon: 'fa-file-alt' },
  ],/*
  Estudiante: [
    { name: 'Mis Cursos', to: '/dashboard/cursos', icon: 'fa-book' },
    { name: 'Foros', to: '/dashboard/foros', icon: 'fa-comments' },
  ]*/
}

const menuItems = computed(() => {
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
      <span class="font-bold tracking-wider text-lg">{{ sidebarTitle }}</span>
    </div>

    <nav class="flex-1 mt-6 px-4 space-y-2">
      <router-link v-for="item in menuItems" :key="item.to" :to="item.to"
        class="flex items-center space-x-3 p-3 rounded-xl transition-all text-blue-100 hover:bg-white/10 hover:text-white"
        active-class="bg-white/20 text-white border border-white/20 shadow-inner">
        <i :class="['fas', item.icon, 'w-5']"></i>
        <span class="font-medium">{{ item.name }}</span>
      </router-link>

      <router-link to="/app/sys-reddit" class="flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-blue-700"
        active-class="bg-blue-800 border-l-4 border-white">
        <i class="fas fa-comments w-5"></i>
        <span class="font-medium text-sm">Sys-Reddit</span>
      </router-link>
    </nav>

    <div class="p-4 border-t border-blue-400/30">
      <button @click="handleLogout"
        class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/20 text-blue-100 hover:text-red-200 transition-colors">
        <i class="fas fa-sign-out-alt w-5"></i>
        <span class="font-medium">Cerrar Sesión</span>
      </button>
    </div>
  </aside>
</template>