<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card border flat class="rounded-xl">
          <v-card-title class="d-flex align-center pa-4">
            <v-icon icon="mdi-message-draw" class="mr-3"></v-icon>
            Moderación de Recuerdos
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Filtrar recuerdos..."
              single-line
              hide-details
              variant="solo"
              density="compact"
              style="max-width: 300px;"
            ></v-text-field>
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="memories"
            :search="search"
            :loading="loading"
            no-data-text="No hay recuerdos pendientes de moderar"
            class="pa-2"
          >
            <template v-slot:item.type="{ item }">
              <v-chip size="small" :color="getTypeColor(item.type)" variant="tonal">
                {{ formatType(item.type) }}
              </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <div class="d-flex gap-2">
                <v-btn
                  icon="mdi-check"
                  color="success"
                  variant="text"
                  @click="updateStatus(item.id, 1)" 
                ></v-btn>
                <v-btn
                  icon="mdi-close"
                  color="error"
                  variant="text"
                  @click="updateStatus(item.id, 2)"
                ></v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '@/plugins/axios'

const memories = ref([])
const loading = ref(false)
const search = ref('')

// Definición de las columnas de la tabla
const headers = [
  { title: 'Fecha', key: 'createdDate' },
  { title: 'Relación', key: 'authorRelation' },
  { title: 'Mensaje', key: 'textContent' },
  { title: 'Tipo', key: 'type', align: 'center' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
]

// Cargar recuerdos desde la API
async function fetchMemories() {
  loading.value = true
  try {
    // Pedimos solo los que NO están aprobados (ajusta la URL según tu API)
    const response = await apiClient.get('/Memory/pending') 
    memories.value = response.data
  } catch (error) {
    console.error("Error cargando recuerdos:", error)
  } finally {
    loading.value = false
  }
}

// Aprobar (1) o Rechazar (2) un recuerdo
async function updateStatus(id: number, status: number) {
  try {
    // LLamada PUT a tu C#
    await apiClient.put(`/Memory/${id}/status`, { status })
    // Recargamos la lista para que el que acabamos de moderar desaparezca
    await fetchMemories()
  } catch (error) {
    alert("Error al actualizar el estado")
  }
}

// Helpers visuales
const formatType = (type: any) => {
  if (type == 1) return 'Condolencia'
  if (type == 2) return 'Anécdota'
  return 'Foto'
}

const getTypeColor = (type: any) => {
  if (type == 1) return 'indigo'
  if (type == 2) return 'teal'
  return 'orange'
}

onMounted(fetchMemories)
</script>