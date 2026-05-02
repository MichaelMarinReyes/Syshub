<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import { useToast } from "vue-toastification";

const props = defineProps(['id']);

const toast = useToast();
const loading = ref(false);
const activeTab = ref('materials');
const course = ref({ nombre: 'Cargando...' });
const materials = ref([]);
const students = ref([]);

const newMaterial = ref({
    titulo: '',
    contenido: '',
    tipo: 'documento',
    enlace_recurso: ''
});

const fetchCourseData = async () => {
    loading.value = true;
    try {
        const [courseRes, materialsRes, studentsRes] = await Promise.all([
            api.get(`/courses/${props.id}`),
            api.get(`/publications/course/${props.id}`),
            api.get(`/assignments/course/${props.id}/students`)
        ]);

        course.value = courseRes.data;
        materials.value = materialsRes.data;
        students.value = studentsRes.data;
    } catch (error) {
        toast.error("Error al sincronizar con Syshub");
    } finally {
        loading.value = false;
    }
};

const handleUpload = async () => {
    if (!newMaterial.value.titulo || !newMaterial.value.contenido) {
        return toast.warning("Título y descripción son obligatorios");
    }

    try {
        const payload = {
            ...newMaterial.value,
            id_curso: props.id
        };
        await api.post('/publications', payload);
        toast.success("Material publicado exitosamente");

        newMaterial.value = { titulo: '', contenido: '', tipo: 'documento', enlace_recurso: '' };
        activeTab.value = 'materials';
        fetchCourseData();
    } catch (error) {
        toast.error("Error al subir el material");
    }
};

const getIcon = (type) => {
    const icons = { 'documento': 'fa-file-alt', 'video': 'fa-video', 'link': 'fa-link', 'tarea': 'fa-tasks' };
    return icons[type] || 'fa-folder';
};

onMounted(fetchCourseData);
</script>

<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <div class="max-w-6xl mx-auto">

            <!-- Header del Curso -->
            <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div class="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase mb-1">
                            <i class="fas fa-university"></i> CUNOC - Auxiliatura
                        </div>
                        <h1 class="text-3xl font-black text-gray-800">{{ course.nombre }}</h1>
                    </div>
                    <div class="flex bg-gray-100 p-1 rounded-2xl">
                        <button @click="activeTab = 'materials'"
                            :class="['px-6 py-2 rounded-xl text-xs font-black uppercase transition-all', activeTab === 'materials' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400']">
                            Materiales
                        </button>
                        <button @click="activeTab = 'students'"
                            :class="['px-6 py-2 rounded-xl text-xs font-black uppercase transition-all', activeTab === 'students' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400']">
                            Estudiantes
                        </button>
                        <button @click="activeTab = 'upload'"
                            :class="['px-6 py-2 rounded-xl text-xs font-black uppercase transition-all', activeTab === 'upload' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400']">
                            <i class="fas fa-plus mr-1"></i> Subir
                        </button>
                    </div>
                </div>
            </div>

            <!-- Contenido de Materiales -->
            <div v-if="activeTab === 'materials'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="item in materials" :key="item.id"
                    class="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all group">
                    <div class="flex justify-between items-start mb-4">
                        <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-indigo-500">
                            <i :class="['fas', getIcon(item.tipo)]"></i>
                        </div>
                        <span class="text-[9px] font-black text-gray-300 uppercase italic">ID: {{ item.id.split('-')[0]
                            }}</span>
                    </div>
                    <h3 class="font-bold text-gray-800 mb-2">{{ item.titulo }}</h3>
                    <p class="text-xs text-gray-500 line-clamp-3 mb-6">{{ item.contenido }}</p>
                    <div class="flex justify-between items-center pt-4 border-t border-gray-50">
                        <span class="text-[10px] font-bold text-gray-400">{{ new
                            Date(item.fechaPublicacion).toLocaleDateString() }}</span>
                        <button
                            class="text-indigo-600 font-black text-[10px] uppercase hover:underline">Gestionar</button>
                    </div>
                </div>
            </div>

            <!-- Listado de Estudiantes (Asignaciones) -->
            <div v-if="activeTab === 'students'"
                class="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <div class="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h2 class="font-black text-gray-700 uppercase text-sm tracking-widest">Alumnos Asignados</h2>
                    <span class="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black">{{
                        students.length }} Total</span>
                </div>
                <table class="w-full">
                    <thead class="bg-gray-50 text-[10px] font-black text-gray-400 uppercase">
                        <tr>
                            <th class="px-8 py-4 text-left">Usuario</th>
                            <th class="px-8 py-4 text-left">Correo</th>
                            <th class="px-8 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="st in students" :key="st.id" class="hover:bg-gray-50/50 transition-colors">
                            <td class="px-8 py-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center text-[10px] font-bold">
                                        {{ st.user.firstName[0] }}{{ st.user.lastName[0] }}
                                    </div>
                                    <span class="text-sm font-bold text-gray-700">{{ st.user.firstName }} {{
                                        st.user.lastName }}</span>
                                </div>
                            </td>
                            <td class="px-8 py-4 text-sm text-gray-500">{{ st.user.email }}</td>
                            <td class="px-8 py-4 text-center">
                                <button class="text-gray-300 hover:text-red-500 transition-colors"><i
                                        class="fas fa-user-minus"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Formulario para Subir Material -->
            <div v-if="activeTab === 'upload'" class="max-w-2xl mx-auto">
                <div class="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                    <h2 class="text-xl font-black text-gray-800 mb-6 uppercase tracking-tighter">Nueva Publicación</h2>

                    <div class="space-y-5">
                        <div>
                            <label class="text-[10px] font-black text-gray-400 uppercase ml-2">Título del
                                material</label>
                            <input v-model="newMaterial.titulo" type="text" placeholder="Ej: Guía de Laboratorio 1"
                                class="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-500 transition-all" />
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="text-[10px] font-black text-gray-400 uppercase ml-2">Tipo</label>
                                <select v-model="newMaterial.tipo"
                                    class="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-500">
                                    <option value="documento">📄 Documento</option>
                                    <option value="video">🎥 Grabación</option>
                                    <option value="link">🔗 Enlace Externo</option>
                                    <option value="tarea">📝 Tarea (Classroom)</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-[10px] font-black text-gray-400 uppercase ml-2">Enlace
                                    (Opcional)</label>
                                <input v-model="newMaterial.enlace_recurso" type="text" placeholder="https://..."
                                    class="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-500" />
                            </div>
                        </div>

                        <div>
                            <label class="text-[10px] font-black text-gray-400 uppercase ml-2">Contenido o
                                Instrucciones</label>
                            <textarea v-model="newMaterial.contenido" rows="4"
                                placeholder="Describe el material aquí..."
                                class="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-500"></textarea>
                        </div>

                        <div class="flex gap-3 pt-4">
                            <button @click="handleUpload"
                                class="flex-1 bg-indigo-600 text-white font-black uppercase text-xs py-4 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                                Publicar en Classroom
                            </button>
                            <button @click="activeTab = 'materials'"
                                class="px-8 bg-gray-100 text-gray-400 font-black uppercase text-xs rounded-2xl hover:bg-gray-200 transition-all">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>