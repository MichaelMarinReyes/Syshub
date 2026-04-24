<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

const isPasswordVisible = ref(false)
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

const handleSubmit = async () => {
  try {
    await authStore.login(form.value.email, form.value.password);

    if (authStore.userRole === 'Admin') {
      router.push({ name: 'admin-users' });
    } else if (authStore.userRole === 'Estudiante') {
      router.push({ name: 'student-home' });
    } else {
      router.push('/');
    }
  } catch (error) {
    toast.error("Credenciales incorrectas.");
    console.error('Error:', error);
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#111111] flex flex-col items-center justify-center p-4">

    <div class="text-center mb-10 w-full max-w-md">
      <h1 class="text-4xl font-semibold text-white mb-3">
        Iniciar Sesión
      </h1>
      <p class="text-gray-500 text-lg">
        Ingresa tus credenciales para continuar
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="w-full max-w-[380px] space-y-7">

      <div class="space-y-2">
        <label for="email" class="block text-base font-medium text-gray-200">
          Correo electrónico
        </label>
        <input type="email" id="email" v-model="form.email"
          class="w-full bg-[#1A1A1A] text-white border border-transparent p-4 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-inner"
          placeholder="tu@email.com" required />
      </div>

      <div class="space-y-2 relative">
        <label for="password" class="block text-base font-medium text-gray-200">
          Contraseña
        </label>
        <div class="relative">
          <input :type="isPasswordVisible ? 'text' : 'password'" id="password" v-model="form.password"
            class="w-full bg-[#1A1A1A] text-white border border-transparent p-4 pr-12 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-inner"
            placeholder="********" required />
          <button type="button" @click="togglePasswordVisibility"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            aria-label="Alternar visibilidad de contraseña">
            <svg v-if="isPasswordVisible" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L9.878 9.878" />
            </svg>
          </button>
        </div>
      </div>

      <a href="#" class="block text-right text-base font-medium text-blue-500 hover:text-blue-400 mt-2 mb-8">
        ¿Olvidaste tu contraseña?
      </a>

      <button type="submit"
        class="w-full bg-[#203D9D] text-white text-base font-medium py-5 rounded-2xl hover:bg-[#1a348c] transition-colors shadow-lg">
        Iniciar Sesión
      </button>

      <p class="text-center text-base font-medium text-gray-400 mt-8">
        ¿No tienes cuenta?
        <router-link to="/registro" class="text-blue-500 hover:text-blue-400 font-semibold ml-1 transition-colors">
          Regístrate aquí
        </router-link>
      </p>
    </form>
  </div>
</template>
