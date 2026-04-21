import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../components/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

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
    }
    /*{
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('../views/AdminDashboard.vue'),
      meta: { requiresAuth: true, role: 'Administrador' }
    },
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
    const userRole = localStorage.getItem('role')

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login')
    } else if (to.meta.role && to.meta.role !== userRole) {
        next('/')
    } else {
        next()
    }
})

export default router