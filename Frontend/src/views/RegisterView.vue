<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';

const router = useRouter();
const loading = ref(false);
const errorMessage = ref('');

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  roleId: 'Estudiante'
});

const handleRegister = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    console.log(form.value)
    await api.post('/users/register', form.value);

    alert('¡Registro exitoso! Ya puedes intentar iniciar sesión.');
    //router.push('/login');

  } catch (error) {
    const backendMessage = error.response?.data?.message;
    errorMessage.value = Array.isArray(backendMessage)
      ? backendMessage.join(', ')
      : (backendMessage || 'Ocurrió un error inesperado al registrarse');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Crear cuenta en Syshub</h2>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre</label>
            <input v-model="form.firstName" type="text" required
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Apellido</label>
            <input v-model="form.lastName" type="text" required
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Correo Institucional</label>
          <input v-model="form.email" type="email" required
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input v-model="form.password" type="password" required
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Tipo de Usuario</label>
          <select v-model="form.roleId" required
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="Estudiante">Estudiante</option>
            <option value="Auxiliar">Auxiliar</option>
            <option value="Moderador">Moderador</option>
          </select>
          <p v-if="form.roleId !== 'Estudiante'" class="mt-2 text-xs text-amber-600 font-medium italic">
            * Nota: Tu cuenta requerirá aprobación de un administrador.
          </p>
        </div>

        <div>
          <button type="submit" :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="loading">Registrando...</span>
            <span v-else>Registrarse</span>
          </button>
        </div>

        <div v-if="errorMessage" class="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
          {{ errorMessage }}
        </div>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?
        <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">Inicia sesión
          aquí</router-link>
      </p>
    </div>
  </div>
</template>