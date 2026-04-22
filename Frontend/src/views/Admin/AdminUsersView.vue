<script setup>
import { useAuthStore } from '@/stores/auth' 
import Sidebar from '@/components/admin/Sidebar.vue'
import AdminStatCard from '@/components/admin/AdminStatCard.vue'
import UserTable from '@/components/user/UserTable.vue'

const authStore = useAuthStore()
</script>

<template>
    <div class="flex min-h-screen bg-gray-50">
        <Sidebar />

        <main class="flex-1 p-8">
            <header class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">Panel de Administración</h1>
                    <p class="text-gray-500 text-sm">Gestiona roles y permisos de usuarios</p>
                </div>
                <div class="flex items-center space-x-4">
                    <button class="relative p-2 text-gray-400 hover:text-indigo-600">
                        <span
                            class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                        <i class="fas fa-bell text-xl"></i>
                    </button>
                    <div
                        class="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                        M
                    </div>
                </div>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <AdminStatCard title="Administradores" count="2" color="purple" icon="crown" />
                <AdminStatCard title="Moderadores" count="2" color="indigo" icon="shield" />
                <AdminStatCard title="Auxiliares" count="2" color="blue" icon="user-tie" />
                <AdminStatCard title="Estudiantes" count="3" color="green" icon="users" />
            </div>

            <section class="bg-white rounded-xl shadow-sm border border-gray-100">
                <UserTable />
            </section>
        </main>
    </div>
</template>