<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <aside class="w-64 bg-[#2196F3] min-h-screen text-white flex flex-col shadow-xl">
    
    <div class="p-6 flex items-center space-x-3 border-b border-blue-400/30">
      <div class="bg-white/20 p-2 rounded-lg">
        <i class="fas fa-terminal text-sm"></i>
      </div>
      <span class="font-bold tracking-wider text-lg">SYSHUB ADMIN</span>
    </div>

    <nav class="flex-1 mt-6 px-4 space-y-2">
      <router-link 
        v-if="authStore.userRole === 'Admin'" 
        to="/admin"
        class="flex items-center space-x-3 p-3 rounded-xl transition-all bg-white/10 border border-white/10"
      >
        <i class="fas fa-users w-5"></i>
        <span class="font-medium">Usuarios</span>
      </router-link>

      <router-link 
        to="/reportes"
        class="flex items-center space-x-3 p-3 rounded-xl transition-all hover:bg-white/10 text-blue-100 hover:text-white"
      >
        <i class="fas fa-shield-alt w-5"></i>
        <span class="font-medium">Reportes</span>
      </router-link>

      <router-link 
        to="/clasificacion"
        class="flex items-center space-x-3 p-3 rounded-xl transition-all hover:bg-white/10 text-blue-100 hover:text-white"
      >
        <i class="fas fa-layer-group w-5"></i>
        <span class="font-medium">Clasificación</span>
      </router-link>
    </nav>

    <div class="p-4 border-t border-blue-400/30">
      <button 
        @click="handleLogout"
        class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/20 text-blue-100 hover:text-red-200 transition-colors"
      >
        <i class="fas fa-sign-out-alt w-5"></i>
        <span class="font-medium">Cerrar Sesión</span>
      </button>
    </div>
  </aside>
</template>