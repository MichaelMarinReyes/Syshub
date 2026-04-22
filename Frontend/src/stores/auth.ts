import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/axios'

export const useAuthStore = defineStore('auth', () => {
    
    // 1. Estado: Variables que guardan la info
    const token = ref<string | null>(localStorage.getItem('token'))
    const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

    // 2. Getters: Datos computados basados en el estado
    const isAuthenticated = computed(() => !!token.value)
    const userRole = computed(() => user.value?.role || null)

    // 3. Acciones: Funciones para cambiar el estado
    async function login(email: string, pass: string) {
        try {
        const { data } = await api.post('/auth/login', { email, password: pass });
        
        const userData = {
            id: data.user.id,
            name: data.user.firstName,
            role: data.user.role
        };

        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(userData));

        token.value = data.access_token;
        user.value = userData;
        
        return data;
    } catch (error) {
        throw error;
    }
    }

    function logout() {
        token.value = null
        user.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return { token, user, isAuthenticated, userRole, login, logout }
})