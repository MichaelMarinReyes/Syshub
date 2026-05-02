<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import { useToast } from "vue-toastification";

const toast = useToast();
const loading = ref(false);
const courses = ref([]); 
const selectedCourse = ref(null);
const sections = ref([]); 
const students = ref([]);
const activeTab = ref('materials');

const showCreateModal = ref(false);
const showJoinModal = ref(false);

const newCourse = ref({
  nombre: '',
  codigo_acceso: ''
});

const joinCode = ref('');

const generateCode = () => {
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  newCourse.value.codigo_acceso = `SYS-${random}`;
};

const fetchMyCourses = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/courses/my-classes'); 
    courses.value = data;
  } catch (error) {
    toast.error("Error al cargar cursos");
  } finally {
    loading.value = false;
  }
};

const createCourse = async () => {
  try {
    await api.post('/courses', newCourse.value);
    toast.success("Curso creado con éxito");
    showCreateModal.value = false;
    newCourse.value = { nombre: '', codigo_acceso: '' };
    fetchMyCourses();
  } catch (error) {
    toast.error("Error al crear el curso");
  }
};

const joinCourse = async () => {
  try {
    await api.post('/assignments/join', { codigo: joinCode.value });
    toast.success("Te has unido al curso correctamente");
    showJoinModal.value = false;
    joinCode.value = '';
    fetchMyCourses();
  } catch (error) {
    toast.error("Código no válido o ya estás asignado");
  }
};

const openCourse = async (course) => {
  selectedCourse.value = course;
  loading.value = true;
  try {
    const [materialsRes, studentsRes] = await Promise.all([
      api.get(`/publications/course/${course.id}`),
      api.get(`/assignments/course/${course.id}/students`)
    ]);

    sections.value = [{
      title: 'Contenido del Curso',
      items: materialsRes.data.map(item => ({
        id: item.id,
        title: item.titulo,
        description: item.contenido,
        type: item.tipo || 'documento',
        date: new Date(item.fechaPublicacion).toLocaleDateString()
      }))
    }];
    students.value = studentsRes.data;
  } catch (error) {
    toast.error("No se pudo cargar el curso");
  } finally {
    loading.value = false;
  }
};

const closeCourse = () => {
  selectedCourse.value = null;
  sections.value = [];
  students.value = [];
};

onMounted(fetchMyCourses);
</script>

<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      
      <!-- VISTA 1: GALERÍA -->
      <div v-if="!selectedCourse">
        <div class="flex justify-between items-center mb-10">
          <div>
            <h1 class="text-3xl font-black text-gray-800 tracking-tighter">SYSHUB CLASSROOM</h1>
            <p class="text-gray-500 text-sm">Gestión académica para auxiliares y estudiantes.</p>
          </div>
          <div class="flex gap-3">
            <button @click="showJoinModal = true" class="bg-white text-indigo-600 border border-indigo-100 px-6 py-3 rounded-2xl text-xs font-bold uppercase shadow-sm hover:bg-gray-50 transition-all">
              Unirse con Código
            </button>
            <button @click="showCreateModal = true; generateCode()" class="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase shadow-xl shadow-indigo-100 hover:scale-105 transition-all">
              <i class="fas fa-plus mr-2"></i> Crear Curso
            </button>
          </div>
        </div>

        <!-- Grid de Cursos -->
        <div v-if="courses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="course in courses" :key="course.id" @click="openCourse(course)"
               class="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-pointer group">
            <div class="h-24 bg-gradient-to-r from-indigo-600 to-indigo-400 p-6">
               <span class="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase italic">
                Cód: {{ course.codigo_acceso }}
              </span>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{{ course.nombre }}</h3>
              <p class="text-gray-400 text-xs mt-1">CUNOC - Centro Universitario de Occidente</p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-100">
          <i class="fas fa-layer-group text-4xl text-gray-200 mb-4"></i>
          <h2 class="text-lg font-bold text-gray-700">No hay cursos activos</h2>
          <p class="text-gray-400 text-sm mt-1">Crea uno o únete mediante un código de auxiliar.</p>
        </div>
      </div>

      <!-- VISTA 2: DETALLE (Se mantiene igual que tu anterior pero con el código visible) -->
      <div v-else>
        <button @click="closeCourse" class="flex items-center text-gray-400 hover:text-indigo-600 font-bold text-xs uppercase mb-6 transition-colors">
          <i class="fas fa-chevron-left mr-2"></i> Volver a la galería
        </button>
        <div class="bg-white rounded-3xl p-8 mb-8 flex justify-between items-center shadow-sm border border-gray-100">
           <div>
              <h1 class="text-2xl font-black text-gray-800 uppercase">{{ selectedCourse.nombre }}</h1>
              <span class="text-indigo-600 font-mono font-bold text-sm">Código de invitación: {{ selectedCourse.codigo_acceso }}</span>
           </div>
           <div class="flex gap-4">
              <button @click="activeTab = 'materials'" :class="[activeTab === 'materials' ? 'text-indigo-600' : 'text-gray-400']" class="text-xs font-black uppercase">Materiales</button>
              <button @click="activeTab = 'students'" :class="[activeTab === 'students' ? 'text-indigo-600' : 'text-gray-400']" class="text-xs font-black uppercase">Estudiantes</button>
           </div>
        </div>
        <!-- ... (resto de las tablas de materiales y estudiantes) ... -->
      </div>

      <!-- MODAL: CREAR CURSO -->
      <div v-if="showCreateModal" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
          <h2 class="text-xl font-black text-gray-800 mb-6 uppercase">Nuevo Curso</h2>
          <div class="space-y-4">
            <div>
              <label class="text-[10px] font-black text-gray-400 uppercase ml-1">Nombre del Curso</label>
              <input v-model="newCourse.nombre" type="text" class="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Ej: Teoría de Sistemas 1">
            </div>
            <div>
              <label class="text-[10px] font-black text-gray-400 uppercase ml-1">Código de Acceso (Auto-generado)</label>
              <div class="flex gap-2">
                <input v-model="newCourse.codigo_acceso" type="text" readonly class="flex-1 bg-gray-100 border-none rounded-2xl px-4 py-3 text-sm font-mono font-bold text-indigo-600">
                <button @click="generateCode" class="bg-gray-100 p-3 rounded-2xl hover:bg-gray-200"><i class="fas fa-sync-alt"></i></button>
              </div>
            </div>
          </div>
          <div class="flex gap-3 mt-8">
            <button @click="createCourse" class="flex-1 bg-indigo-600 text-white font-black uppercase text-xs py-4 rounded-2xl hover:bg-indigo-700">Crear Curso</button>
            <button @click="showCreateModal = false" class="px-6 text-gray-400 font-bold text-xs uppercase">Cancelar</button>
          </div>
        </div>
      </div>

      <!-- MODAL: UNIRSE A CURSO -->
      <div v-if="showJoinModal" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl text-center">
          <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-key text-2xl"></i>
          </div>
          <h2 class="text-xl font-black text-gray-800 mb-2 uppercase">Unirse a un Curso</h2>
          <p class="text-gray-400 text-xs mb-6">Ingresa el código proporcionado por tu auxiliar.</p>
          <input v-model="joinCode" type="text" class="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-center text-lg font-mono font-bold tracking-widest focus:ring-2 focus:ring-indigo-500 mb-6" placeholder="SYS-XXXXX">
          <div class="flex gap-3">
            <button @click="joinCourse" class="flex-1 bg-indigo-600 text-white font-black uppercase text-xs py-4 rounded-2xl">Unirse ahora</button>
            <button @click="showJoinModal = false" class="px-6 text-gray-400 font-bold text-xs uppercase">Cerrar</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>