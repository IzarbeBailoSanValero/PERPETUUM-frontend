
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
          
          <v-alert v-if="store.memories.length === 0 && !store.loading" type="info" variant="tonal" class="ma-4">
            No hay recuerdos pendientes de moderar.
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>








<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMemoryStore } from '@/stores/memoryStore'
import { useUiStore } from '@/stores/uiStore'
import MemoryRow from '@/components/admin/MemoryRow.vue'

const ui = useUiStore()
const store = useMemoryStore()
const search = ref('')

const filteredMemories = computed(() => {
  return store.memories.filter(m => 
    m.deceasedName?.toLowerCase().includes(search.value.toLowerCase()) ||
    m.textContent?.toLowerCase().includes(search.value.toLowerCase())
  )
})

async function updateStatus(id: number, status: number) {
  try {
    await store.updateMemoryStatus(id, status)
    ui.notify(status === 1 ? "Aprobado correctamente" : "Recuerdo rechazado", "success")
  } catch (error) {
    ui.notify("Error al procesar la solicitud", "error")
  }
}

onMounted(() => {
  store.fetchPendingMemories()
})
</script>









