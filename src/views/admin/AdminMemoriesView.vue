
<template>
<v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card border flat class="rounded-xl">
          
          <v-card-title class="d-flex align-center pa-4">
            <v-icon icon="mdi-message-draw" class="mr-3"></v-icon>
            Moderación de Recuerdos
            
            <v-spacer></v-spacer> <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Filtrar por nombre o texto..."
              hide-details
              variant="solo"
              density="compact"
              style="max-width: 300px;"
            ></v-text-field>
          </v-card-title>

          <v-table class="pa-2">
            <thead>
              <tr>
                <th>Difunto</th>
                <th>Mensaje</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <MemoryRow 
                v-for="item in filteredMemories" 
                :key="item.id" 
                :memory="item"
                @approve="updateStatus(item.id, 1)" 
                @reject="updateStatus(item.id, 2)"
              />
            </tbody>
          </v-table>
          
          <v-alert v-if="memories.length === 0 && !loading" type="info" variant="tonal" class="ma-4">
            No hay recuerdos pendientes de moderar.
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>








<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import apiClient from '@/plugins/axios' // Nuestra conexión con el backend
import { useUiStore } from '@/stores/uiStore' // Para mostrar avisos SweetAlert
import MemoryRow from '@/components/admin/MemoryRow.vue' // Importamos el molde de la fila

const ui = useUiStore()
const memories = ref<any[]>([]) // Aquí guardaremos la lista que venga del back
const loading = ref(false)      // Para saber si estamos esperando al servidor
const search = ref('')          // El texto que el usuario escribe para filtrar

// COMPUTED: Una variable que se recalcula sola cuando cambia 'search' o 'memories'
// Sirve para filtrar la lista sin perder los datos originales
const filteredMemories = computed(() => {
  return memories.value.filter(m => 
    m.deceasedName?.toLowerCase().includes(search.value.toLowerCase()) ||
    m.textContent?.toLowerCase().includes(search.value.toLowerCase())
  )
})

//  pide al servidor los recuerdos que tienen estado pendiente
async function fetchMemories() {
  loading.value = true
  try {
    const response = await apiClient.get('/Memory/pending') 
    memories.value = response.data
  } catch (error) {
    console.error("Error cargando recuerdos del servidor")
  } finally {
    loading.value = false
  }
}

// // Aprobar o Rechazar  un recuerdo Llama al PUT de la API.
async function updateStatus(id: number, status: number) {
  try {
    await apiClient.put(`/Memory/${id}/status`, { status })

    ui.notify(status === 1 ? "Aprobado correctamente" : "Recuerdo rechazado", "success")
    await fetchMemories()   // Recargamos la lista para que el que acabamos de moderar desaparezca
  } catch (error) {
    ui.notify("Error al procesar la solicitud", "error")
  }
}

// Se ejecuta automáticamente al abrir esta pantalla
onMounted(fetchMemories)









