import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AdminUsersView from '../views/Admin/AdminUsersView.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

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
        path: '/registro',
        name: 'register',
        component: RegisterView,
        meta: { title: 'Registrarse - Syshub' }
    },
    {
        path: '/admin',
        component: AdminLayout,
        meta: { requiresAuth: true, role: 'Admin' },
        redirect: { name: 'admin-users' },
        children: [
            {
                path: 'usuarios', 
                name: 'admin-users',
                component: () => import('@/views/Admin/AdminUsersView.vue'),
                meta: { title: 'Usuarios - Syshub Admin' }
            },
            {
                path: 'reportes',
                name: 'admin-reports',
                component: () => import('@/views/Admin/ReportModerationView.vue'),
                meta: { title: 'Moderación - Syshub Admin' }
            },/*
            {
                path: 'clasificacion',
                name: 'admin-classification',
                component: () => import('@/views/Admin/ClassificationView.vue'),
            }*/
        ]
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
    const token = localStorage.getItem('token')
    const isAuthenticated = !!token

    let userRole = null
    try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}')
        userRole = userData.role
    } catch (e) {
        console.error("Error parseando usuario del localStorage")
    }

    if (to.meta.requiresAuth && !isAuthenticated) {
        return next('/login')
    }

    if (to.meta.role && to.meta.role !== userRole) {
        return next(userRole === 'Estudiante' ? '/estudiante' : '/login')
    }

    if (to.meta.title) {
        document.title = to.meta.title
    }

    next()
})

export default router