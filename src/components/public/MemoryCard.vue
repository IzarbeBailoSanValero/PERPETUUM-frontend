<template>
  <!-- Tarjeta de un recuerdo individual (estilo red social) -->
  <v-card
    border
    flat
    class="pa-4 rounded-xl mb-4"
    elevation="3"
  >
    <!-- Encabezado -->
    <div class="d-flex justify-space-between align-center mb-3">
      <div class="d-flex flex-column">
        <span class="text-subtitle-2 font-weight-bold text-primary">
          {{ memory.authorName || 'Anónimo' }}
        </span>
        <span
          v-if="memory.authorRelation"
          class="text-caption text-medium-emphasis"
        >
          {{ memory.authorRelation }}
        </span>
      </div>

      <span class="text-caption text-medium-emphasis">
        {{ formatDate(memory.createdDate) }}
      </span>
    </div>

    <!-- Texto -->
    <v-card-text
      v-if="memory.textContent"
      class="pa-0 text-body-1 mb-3"
    >
      {{ memory.textContent }}
    </v-card-text>

    <!-- Imagen  -->
   <v-sheet
  v-if="memory.mediaURL"
  class="overflow-hidden rounded-lg mb-3 mx-auto"
  elevation="2"
  max-width="280"
>
  <v-img
    :src="memory.mediaURL"
    :aspect-ratio="1"
    cover
    class="rounded-lg"
    referrerpolicy="no-referrer"
  ></v-img>
</v-sheet>



    <!-- Tipo -->
    <v-chip
      size="x-small"
      class="mt-1"
      variant="tonal"
      color="primary"
    >
      {{ typeLabel }}
    </v-chip>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Memory } from '@/stores/memorialStore'

const props = defineProps<{
  memory: Memory
}>()

const typeLabel = computed(() => {
  const t = props.memory?.type ?? ''
  if (t === 'Condolence' || t === '1') return 'Condolencia'
  if (t === 'Anecdote' || t === '2') return 'Anécdota'
  if (t === 'Photo' || t === '3') return 'Foto'
  return t || '—'
})

// Función sencilla para formatear la fecha que viene de C#
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(undefined,  //undefined usa automáticamente el idioma y formato del navegador del usuario
    {
      year: 'numeric',   // muestra el año completo (2024)
      month: 'long',     // muestra el mes en texto (mayo)
      day: 'numeric'     // muestra el día (10)
    }
  )
}
</script>