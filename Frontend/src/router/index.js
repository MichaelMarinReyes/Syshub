import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AdminUsersView from '../views/Admin/AdminUsersView.vue'

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { title: 'Iniciar Sesión - Syshub' }
    },
    {
        path:'/register',
        name: 'register',
        component: RegisterView,
        meta: { title: 'Registrarse - Syshub'}
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: AdminUsersView,
      meta: { requiresAuth: true, role: 'Admin' }
    },/*
    {
      path: '/estudiante',
      name: 'student-home',
      component: () => import('../views/StudentHome.vue'),
      meta: { requiresAuth: true, role: 'Estudiante' }
    }*/
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token')
    
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    const userRole = userData.role

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login')
    } else if (to.meta.role && to.meta.role !== userRole) {
        next('/login') 
    } else {
        next()
    }
})

export default router