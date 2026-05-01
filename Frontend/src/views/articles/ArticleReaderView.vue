<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// En una app real, aquí harías fetch a tu API con route.params.id
const article = ref({
  title: 'Guía de Debian 13 para Estudiantes',
  author: 'Michael (Sistemas)',
  date: '30 de Abril, 2026',
  content: `
    <p>Debian 13 "Trixie" introduce mejoras significativas en la gestión de paquetes...</p>
    <h2>Configuración inicial</h2>
    <pre><code>sudo apt update && sudo apt upgrade</code></pre>
    <p>Es fundamental configurar correctamente los repositorios en el CUNOC...</p>
  `
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Barra superior tipo Drive -->
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 h-14 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button @click="router.back()" class="p-2 hover:bg-gray-100 rounded-full text-gray-600">
          <i class="fas fa-arrow-left"></i>
        </button>
        <span class="text-sm font-medium text-gray-700 truncate max-w-xs">{{ article.title }}</span>
      </div>
      <div class="flex items-center gap-2">
        <button class="p-2 hover:bg-gray-100 rounded-full text-gray-600" title="Imprimir">
          <i class="fas fa-print"></i>
        </button>
        <button class="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-blue-700">
          Compartir
        </button>
      </div>
    </nav>

    <!-- Contenedor del "Documento" -->
    <main class="max-w-4xl mx-auto mt-8 bg-white shadow-lg border border-gray-200 min-h-[1056px] p-16 md:p-24">
      <header class="mb-12 border-b border-gray-100 pb-8">
        <h1 class="text-4xl font-serif font-bold text-gray-900 mb-4 leading-tight">
          {{ article.title }}
        </h1>
        <div class="flex items-center text-sm text-gray-500 gap-4">
          <span class="font-bold text-blue-600">{{ article.author }}</span>
          <span>•</span>
          <span>{{ article.date }}</span>
        </div>
      </header>

      <!-- El contenido se renderiza como HTML (viniendo de Quill) -->
      <article 
        class="prose prose-blue max-w-none prose-img:rounded-xl"
        v-html="article.content"
      ></article>
    </main>
  </div>
</template>

<style scoped>
/* Estilos para que el HTML de Quill se vea bien */
:deep(h2) {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #1f2937;
}
:deep(p) {
  margin-bottom: 1.25rem;
  line-height: 1.75;
  color: #374151;
}
:deep(pre) {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-family: 'Fira Code', monospace;
  font-size: 0.875rem;
}
</style>