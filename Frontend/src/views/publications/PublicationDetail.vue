<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../api/axios';

const route = useRoute();
const publication = ref(null);
const comments = ref([]);
const newComment = ref('');

const fetchDetail = async () => {
  try {
    // El backend debe soportar GET /publications/:id
    const { data } = await api.get(`/publications/${route.params.id}`);
    publication.value = data;
    comments.value = data.comments || [];
  } catch (error) {
    console.error("Error cargando detalle");
  }
};

const postComment = async () => {
  if (!newComment.value.trim()) return;
  try {
    await api.post('/comments', {
      contenido: newComment.value,
      idPublication: route.params.id
    });
    newComment.value = '';
    fetchDetail();
  } catch (error) {
    console.error("Error al comentar");
  }
};

onMounted(fetchDetail);
</script>

<template>
  <div v-if="publication" class="max-w-4xl mx-auto p-6">
    <!-- CABECERA DEL POST -->
    <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <h1 class="text-3xl font-bold mb-4">{{ publication.title }}</h1>
      <p class="text-gray-600 mb-6">{{ publication.content }}</p>
    </div>

    <!-- SECCIÓN DE COMENTARIOS -->
    <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100">
      <h2 class="font-bold mb-4">Comentarios ({{ comments.length }})</h2>
      
      <!-- Input para nuevo comentario -->
      <div class="mb-8 flex gap-3">
        <textarea v-model="newComment" class="flex-1 p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Escribe tu aporte técnico..."></textarea>
        <button @click="postComment" class="bg-blue-600 text-white px-6 rounded-xl font-bold">Enviar</button>
      </div>

      <!-- Lista de comentarios -->
      <div class="space-y-4">
        <div v-for="c in comments" :key="c.id" class="bg-white p-4 rounded-xl border border-gray-100">
          <p class="text-sm text-gray-800">{{ c.contenido }}</p>
          <span class="text-[10px] text-gray-400 font-bold uppercase mt-2 block">{{ c.user?.firstName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>