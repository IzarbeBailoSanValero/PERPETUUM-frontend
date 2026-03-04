<template>
  <!-- Tarjeta de un recuerdo individual (usada en el Muro) -->
  <v-card border flat class="pa-4 rounded-lg mb-4">
    <div class="d-flex justify-space-between align-center mb-2">
      <span class="text-subtitle-2 font-weight-bold text-indigo">
        {{ memory.authorRelation || 'Anónimo' }}
      </span>
      <span class="text-caption text-grey">
        {{ formatDate(memory.createdDate) }}
      </span>
    </div>

    <v-card-text v-if="memory.textContent" class="pa-0 text-body-1 mxb-3">
      {{ memory.textContent }}
    </v-card-text>

    <v-img v-if="memory.mediaURL" :src="memory.mediaURL" max-height="300" cover
      class="rounded-lg bg-grey-lighten-2"></v-img>

    <v-chip size="x-small" class="mt-2" variant="tonal">
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