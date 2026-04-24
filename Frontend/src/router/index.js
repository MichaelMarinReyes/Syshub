import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AdminUsersView from '../views/admin/AdminUsersView.vue'
import MainLayout from '../layouts/MainLayout.vue'

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
        path: '/app',
        component: MainLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: 'sys-reddit',
                name: 'sys-reddit',
                component: () => import('@/views/SysRedditView.vue'),
                meta: { title: 'Sys-Reddit - Foro de Discusión' }
            },
        ]
    },
    {
        path: '/admin',
        component: MainLayout,
        meta: { requiresAuth: true, role: 'Admin' },
        redirect: { name: 'admin-users' },
        children: [
            {
                path: 'usuarios',
                name: 'admin-users',
                component: () => import('@/views/admin/AdminUsersView.vue'),
                meta: { title: 'Usuarios - Syshub Admin' }
            },
            {
                path: 'reportes',
                name: 'admin-reports',
                component: () => import('@/views/admin/ReportModerationView.vue'),
                meta: { title: 'Moderación - Syshub Admin' }
            },
            {
                path: 'clasificacion',
                name: 'admin-classification',
                component: () => import('@/views/admin/ClasificationView.vue'),
            }
        ]
    },
    {
        path: '/moderador',
        component: MainLayout,
        meta: { requiresAuth: true, role: 'Moderador' },
        redirect: { name: 'mod-reports' },
        children: [
            {
                path: 'reportes',
                name: 'mod-reports',
                component: () => import('@/views/moderator/ModeratorView.vue'),
                meta: { title: 'Cola de Reportes - Moderación' }
            },
            {
                path: 'revision',
                name: 'mod-review',
                component: () => import('@/views/moderator/PendingReviewView.vue'),
                meta: { title: 'Revisión Pendiente - Moderación' }
            },
            {
                path: 'foros',
                name: 'mod-forums',
                component: () => import('@/views/moderator/ForumsModView.vue'),
                meta: { title: 'Gestión de Foros - Moderación' }
            },
            {
                path: 'articulos',
                name: 'mod-articles',
                component: () => import('@/views/moderator/ArticlesModView.vue'),
                meta: { title: 'Gestión de Artículos - Moderación' }
            }
        ]
    }
    /*
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