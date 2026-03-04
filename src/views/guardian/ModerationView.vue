<template>
  <v-container fluid>
    <v-card border flat class="rounded-xl pa-4">
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-shield-check" class="mr-3" />
        Moderación de comentarios
        <v-spacer />
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Filtrar por difunto o texto"
          density="compact"
          hide-details
          style="max-width: 320px;"
          variant="solo"
        />
      </v-card-title>

      <v-divider class="my-4" />

      <v-progress-linear v-if="store.loading" indeterminate color="primary" class="mb-4" />

      <v-table v-else>
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
          <tr v-for="memory in filteredMemories" :key="memory.id">
            <td>{{ memory.deceasedName }}</td>
            <td class="text-truncate" style="max-width: 420px;">
              {{ memory.textContent || memory.mediaURL || "Sin contenido" }}
            </td>
            <td>{{ getTypeLabel(memory.type ?? memory.Type) }}</td>
            <td>{{ formatDate(memory.createdDate) }}</td>
            <td>
              <div class="d-flex ga-2">
                <v-btn size="small" color="success" @click="moderate(memory.id, 1)">Aprobar</v-btn>
                <v-btn size="small" color="error" variant="tonal" @click="moderate(memory.id, 2)">Rechazar</v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-alert v-if="!store.loading && filteredMemories.length === 0" type="info" variant="tonal" class="mt-4">
        No hay comentarios pendientes de moderación.
      </v-alert>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useMemoryStore } from '@/stores/memoryStore'
import { useUiStore } from '@/stores/uiStore'

const store = useMemoryStore()
const ui = useUiStore()
const search = ref('')

const filteredMemories = computed(() =>
  store.memories.filter((memory) => {
    const term = search.value.trim().toLowerCase()
    if (!term) return true

    return (
      memory.deceasedName.toLowerCase().includes(term) ||
      (memory.textContent ?? '').toLowerCase().includes(term)
    )
  })
)

function getTypeLabel(type: number | string | undefined) {
  const t = type === undefined ? '' : String(type)
  if (t === '1' || t === 'Condolence') return 'Condolencia'
  if (t === '2' || t === 'Anecdote') return 'Anécdota'
  if (t === '3' || t === 'Photo') return 'Foto'
  return t ? 'Desconocido' : '—'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

async function moderate(id: number, status: 1 | 2) {
  try {
    await store.updateMemoryStatus(id, status)
    ui.notify(status === 1 ? 'Comentario aprobado.' : 'Comentario rechazado.', 'success')
  } catch (error) {
    ui.notify('No se pudo aplicar la moderación.', 'error')
  }
}

onMounted(async () => {
  await store.fetchPendingMemories()
})
</script>
