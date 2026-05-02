<script setup>
import { ref, onMounted } from 'vue';
import api from '../../api/axios'; // Asumiendo tu configuración de Axios
import { useToast } from "vue-toastification";

const toast = useToast();
const reports = ref([]);
const isLoading = ref(true);

const showViewModal = ref(false);
const selectedReport = ref(null);

const fetchReports = async () => {
  try {
    isLoading.value = true;
    const response = await api.get('/reports');
    reports.value = response.data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    toast.error("Error al cargar la cola de moderación");
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchReports);

const getTypeBadgeClass = (type) => {
  return type === 'reddit'
    ? 'bg-orange-100 text-orange-700 border-orange-200'
    : 'bg-indigo-100 text-indigo-700 border-indigo-200';
};

const openViewer = (report) => {
  selectedReport.value = report;
  showViewModal.value = true;
};

const handleAction = async (action, reportId, publicationId) => {
  try {
    if (action === 'restaurar') {
      const ID_ESTADO_ACTIVO = 'be74dddc-dab4-4aac-88cc-50cc6232008f';

      await api.patch(`/publications/${publicationId}/status`, {
        statusId: ID_ESTADO_ACTIVO
      });
/*
      await api.patch(`/reports/${reportId}/resolve`, {
        status: 'rechazado'
      });*/

      toast.success("Contenido restaurado y reporte archivado");

    } else if (action === 'eliminar') {
      await api.delete(`/reports/${reportId}/purge`);
      toast.success("Eliminación exitosa: Publicación y reporte borrados");
    }

    showViewModal.value = false;
    await fetchReports();

  } catch (error) {
    const errorMsg = error.response?.data?.message || `No se pudo completar la acción: ${action}`;
    toast.error(errorMsg);
    console.error(`Error en moderación (${action}):`, error);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '---';
  return new Date(dateString).toLocaleDateString('es-GT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen font-sans">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800">Panel de Moderación</h1>
        <p class="text-sm text-gray-500 mt-1">Gestión de denuncias para mantener la integridad de Syshub.</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 class="text-lg font-bold text-gray-700">Cola de Denuncias</h2>
          <button @click="fetchReports"
            class="text-indigo-600 text-xs font-bold uppercase flex items-center hover:bg-indigo-50 px-3 py-2 rounded-lg transition-all">
            <i class="fas fa-sync-alt mr-2" :class="{ 'animate-spin': isLoading }"></i> Actualizar
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="bg-gray-50/50 text-gray-400 text-[11px] font-black uppercase tracking-widest border-b">
                <th class="py-4 px-6">Reportero</th>
                <th class="py-4 px-6">Origen</th>
                <th class="py-4 px-6">Motivo</th>
                <th class="py-4 px-6">Fecha de Publicación</th>
                <th class="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-if="isLoading">
                <td colspan="5" class="py-12 text-center">
                  <div class="inline-block animate-bounce text-indigo-600 font-bold">Cargando...</div>
                </td>
              </tr>
              <tr v-else v-for="report in reports" :key="report.id" class="hover:bg-blue-50/20 transition-colors group">
                <td class="py-4 px-6">
                  <div class="flex flex-col">
                    <span class="font-bold text-gray-700">{{ report.userReporter.firstName }} {{
                      report.userReporter.lastName }}</span>
                    <span class="text-[10px] text-gray-400">{{ report.userReporter.email }}</span>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <span
                    :class="['px-2 py-0.5 rounded text-[10px] font-bold border uppercase', getTypeBadgeClass(report.publication.contentType)]">
                    {{ report.publication.contentType }}
                  </span>
                </td>
                <td class="py-4 px-6">
                  <p class="text-gray-600 max-w-xs truncate" :title="report.reasonComplaint">{{ report.reasonComplaint
                  }}</p>
                </td>
                <td class="py-4 px-6 text-gray-400 text-xs">
                  {{ formatDate(report.publication.createdAt) }}
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="flex gap-1 justify-end">
                    <!-- HOVERS AGREGADOS MEDIANTE TITLE -->
                    <button @click="openViewer(report)" title="Ver detalles completos y contenido"
                      class="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition-all">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button @click="handleAction('restaurar', report.id, report.publication.id)"
                      title="Restaurar: No procede reporte y mantener contenido"
                      class="p-2.5 text-green-600 hover:bg-green-100 rounded-xl transition-all">
                      <i class="fas fa-check-circle"></i>
                    </button>
                    <button @click="handleAction('eliminar', report.id)"
                      title="Eliminar: Borrar publicación del sistema"
                      class="p-2.5 text-red-600 hover:bg-red-100 rounded-xl transition-all">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Visor -->
    <Teleport to="body">
      <div v-if="showViewModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-primario/60 backdrop-blur-sm" @click="showViewModal = false"></div>
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden animate-in zoom-in duration-200">
          <div class="bg-indigo-600 p-6 text-white flex justify-between items-start">
            <div>
              <h3 class="text-xl font-bold">Revisión de Contenido</h3>
              <p class="text-indigo-100 text-[10px] uppercase font-black tracking-tighter mt-1">Ref: {{
                selectedReport.id }}</p>
            </div>
            <span class="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              {{ selectedReport.resolutionStatus }}
            </span>
          </div>

          <div class="p-8">
            <div class="mb-6">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Título de la
                Publicación</label>
              <h4 class="text-lg font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 mt-1">
                {{ selectedReport.publication.title }}
              </h4>
            </div>

            <div class="grid grid-cols-2 gap-6 mb-6">
              <div class="bg-gray-50 p-4 rounded-2xl">
                <label class="text-[10px] font-black text-gray-400 uppercase block mb-1">Motivo de Denuncia</label>
                <p class="text-sm text-gray-700 italic">"{{ selectedReport.reasonComplaint }}"</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-2xl">
                <label class="text-[10px] font-black text-gray-400 uppercase block mb-1">Autor del Contenido</label>
                <p class="text-sm font-bold text-gray-700">ID Usuario: {{ selectedReport.publication.idUser }}</p>
              </div>
            </div>

            <div class="flex items-center justify-between pt-6 border-t border-gray-100">
              <button @click="showViewModal = false"
                class="px-6 py-2.5 text-xs font-bold text-gray-400 uppercase hover:bg-gray-50 rounded-xl transition-all">
                Cerrar Visor
              </button>
              <div class="flex gap-3">
                <button @click="handleAction('restaurar', selectedReport.id, selectedReport.publication.id)"
                  class="px-5 py-2.5 bg-green-500 text-white rounded-xl text-xs font-bold uppercase shadow-lg shadow-green-200 hover:bg-green-600 transition-all">
                  Restaurar
                </button>
                <button @click="handleAction('eliminar', selectedReport.id)"
                  class="px-5 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold uppercase shadow-lg shadow-red-200 hover:bg-red-700 transition-all">
                  Eliminar Todo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>