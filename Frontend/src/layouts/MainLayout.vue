<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from '../components/Sidebar.vue';

const route = useRoute();

const menuConfigs = {
  admin: {
    roleName: 'Admin',
    items: [
      { name: 'Usuarios', path: '/admin/users', icon: 'fa-users' },
      { name: 'Reportes', path: '/admin/reports', icon: 'fa-chart-bar' },
      { name: 'Clasificación', path: '/admin/classification', icon: 'fa-sitemap' }
    ]
  },
  moderator: {
    roleName: 'Moderador',
    items: [
      { name: 'Cola de Reportes', path: '/mod/reports', icon: 'fa-flag' },
      { name: 'Revisión', path: '/mod/review', icon: 'fa-clock' },
      { name: 'Foros', path: '/mod/forums', icon: 'fa-comments' },
      { name: 'Artículos', path: '/mod/articles', icon: 'fa-file-alt' }
    ]
  }
};

const currentConfig = computed(() => {
  if (route.path.startsWith('/admin')) return menuConfigs.admin;
  if (route.path.startsWith('/mod')) return menuConfigs.moderator;
  return { roleName: 'User', items: [] };
});
</script>

<template>
  <div class="flex bg-gray-50 min-h-screen">
    <Sidebar 
      :menuItems="currentConfig.items" 
      :roleName="currentConfig.roleName" 
    />
    <main class="flex-1 p-8">
      <router-view />
    </main>
  </div>
</template>