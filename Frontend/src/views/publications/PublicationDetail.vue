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
    const { data } = await api.get(`/publications/${route.params.id}`);

    publication.value = { ...data };

    comments.value = data.comments.map(comment => ({
      ...comment,
      user: {
        ...comment.user,
        role: comment.user.role || { name: 'Sin Rol' }
      }
    }));
  } catch (error) {
    console.error("Error cargando detalle");
  }
};

const postComment = async () => {
  if (!newComment.value.trim()) return;
  try {
    await api.post('/comments', {
      content: newComment.value,
      idPublication: route.params.id
    });
    newComment.value = '';
    fetchDetail();
  } catch (error) {
    console.error("Error al publicar comentario");
  }
};

const ratedComments = ref(new Set());

const rateComment = async (commentId, score) => {
  if (ratedComments.value.has(commentId)) return;

  const finalScore = Math.min(score, 10);

  try {
    await api.patch(`/comments/${commentId}/rate`, {
      qualityScore: finalScore
    });

    ratedComments.value.add(commentId);
    toast?.success(`Puntuado con ${finalScore} puntos`);

    fetchDetail();
  } catch (error) {
    console.error("Error al puntuar:", error);
    toast?.error("No se pudo registrar la puntuación");
  }
};

onMounted(fetchDetail);
</script>

<template>
  <div v-if="publication" class="max-w-4xl mx-auto p-6">
    <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <div class="flex gap-2 mb-4">
        <span v-for="tag in publication.tags" :key="tag.idLabel"
          class="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
          #{{ tag.nameTag }}
        </span>
      </div>

      <h1 class="text-3xl font-bold mb-4 text-gray-900">{{ publication.title }}</h1>

      <p class="text-gray-700 leading-relaxed mb-6">{{ publication.content }}</p>

      <div class="flex items-center gap-3 border-t pt-4">
        <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
          {{ publication.user?.firstName[0] }}
        </div>
        <div>
          <p class="text-sm font-bold text-gray-800">{{ publication.user?.firstName }} {{ publication.user?.lastName }}
          </p>
          <p class="text-xs text-gray-400 uppercase tracking-wider">{{ publication.course?.name }}</p>
        </div>
      </div>
    </div>

    <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100">
      <h2 class="font-bold text-lg mb-4 text-gray-800">Comentarios ({{ comments.length }})</h2>

      <div class="mb-8 flex gap-3">
        <textarea v-model="newComment"
          class="flex-1 p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          placeholder="Escribe tu aporte o solución..."></textarea>
        <button @click="postComment"
          class="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl font-bold transition-colors">
          Enviar
        </button>
      </div>

      <div class="space-y-4">
        <div v-for="c in comments" :key="c.idComment" class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p class="text-gray-700 mb-3">{{ c.content }}</p>

          <div class="flex justify-between items-center">
            <p class="text-[11px] font-bold text-gray-800 uppercase tracking-tight">
              {{ c.user?.firstName }} {{ c.user?.lastName }}
              <span class="text-blue-600 ml-1">• {{ c.user?.role?.name || 'Cargando...' }}</span>
            </p>
            <div :class="c.qualityScore >= 8 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
              class="px-2.5 py-1 rounded-lg text-xs font-black shadow-sm border border-white">
              <i class="fas fa-medal mr-1"></i>
              {{ c.qualityScore }}
            </div>
            <div v-if="!ratedComments.has(c.idComment)" class="flex items-center bg-gray-100 rounded-lg p-1">
              <select @change="(e) => rateComment(c.idComment, parseInt(e.target.value))"
                class="bg-transparent text-[10px] font-bold outline-none px-1 cursor-pointer">
                <option value="" disabled selected>Puntuar</option>
                <option v-for="n in 10" :key="n" :value="n">{{ n }} pts</option>
              </select>
            </div>

            <span v-else class="text-[9px] text-gray-400 font-bold italic">
              Ya puntuado
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>