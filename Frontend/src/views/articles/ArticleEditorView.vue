<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "vue-toastification";
import { useAuthStore } from '../../stores/auth'
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import api from '../../api/axios'

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const title = ref('');
const idCurso = ref(null)
const editorContainer = ref(null);
let quill = null;
const lastSaved = ref(null);

const toolbarOptions = [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    ['link', 'image'],
    ['clean']
];

onMounted(() => {
    quill = new Quill('#editor', {
        modules: { toolbar: toolbarOptions },
        theme: 'snow',
        placeholder: 'Comienza tu investigación...'
    });

    const draft = localStorage.getItem('article_draft');
    if (draft) {
        const { title: draftTitle, content } = JSON.parse(draft);
        title.value = draftTitle;
        quill.root.innerHTML = content;
        toast.info("Borrador cargado automáticamente");
    }

    const autoSaveInterval = setInterval(saveToLocal, 30000);
    onBeforeUnmount(() => clearInterval(autoSaveInterval));
});

const saveToLocal = () => {
    if (!quill) return;
    const draft = {
        title: title.value,
        content: quill.root.innerHTML,
        date: new Date().toLocaleTimeString()
    };
    localStorage.setItem('article_draft', JSON.stringify(draft));
    lastSaved.value = draft.date;
};

const publishArticle = async () => {
    if (!title.value.trim() || quill.root.innerText.trim().length < 10) {
        toast.warning("El artículo debe tener un título y contenido suficiente");
        return;
    }

    const payload = {
        title: title.value,
        idUser: authStore.user?.id,
        idCourse: idCurso.value || null,
        body: quill.root.innerHTML,
        urlImage: null
    };

    try {
        await api.post('/blog-articles', payload);

        localStorage.removeItem('article_draft');
        toast.success("¡Artículo publicado con éxito!");
        router.push({ name: 'ArticlesList' });
    } catch (error) {
        const mensajeError = error.response?.data?.message || "Error al publicar el artículo";
        toast.error(mensajeError);
    }
};

const adjustHeight = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
};
</script>

<template>
    <div class="min-h-screen bg-white flex flex-col font-sans">
        <!-- Header de Control -->
        <header class="h-16 border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 bg-white z-50">
            <div class="flex items-center gap-4">
                <button @click="router.back()" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="h-4 w-[1px] bg-gray-200"></div>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Editor</span>
            </div>

            <div class="flex items-center gap-4">
                <span v-if="lastSaved" class="text-[10px] text-gray-400 font-medium">
                    BORRADOR GUARDADO {{ lastSaved }}
                </span>
                <button @click="publishArticle"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-indigo-100 transition-all">
                    Publicar
                </button>
            </div>
        </header>

        <!-- Lienzo de Escritura -->
        <main class="flex-1 overflow-y-auto pt-16 pb-32">
            <div class="max-w-3xl mx-auto px-6">
                <!-- Título Estilo Medium -->
                <textarea v-model="title" @input="adjustHeight" placeholder="Título de la investigación"
                    class="w-full text-5xl font-extrabold border-none focus:ring-0 placeholder-gray-100 resize-none leading-tight mb-8"
                    rows="1"></textarea>

                <!-- El Editor -->
                <div id="editor" class="border-none"></div>
            </div>
        </main>
    </div>
</template>

<style>
.ql-container.ql-snow,
.ql-toolbar.ql-snow {
    border: none !important;
}

.ql-toolbar.ql-snow {
    position: sticky;
    top: 64px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    z-index: 40;
    border-bottom: 1px solid #f9fafb !important;
    display: flex;
    justify-content: center;
    padding: 8px 0;
}

.ql-editor {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-size: 1.25rem;
    line-height: 1.8;
    color: #1f2937;
    min-height: 60vh;
    padding: 0 !important;
}

.ql-editor.ql-blank::before {
    left: 0 !important;
    font-style: normal;
    color: #d1d5db;
}

.ql-editor p {
    margin-bottom: 1.5rem;
}

.ql-editor h1,
.ql-editor h2 {
    font-weight: 800;
    color: #111827;
    margin-top: 2rem;
}
</style>