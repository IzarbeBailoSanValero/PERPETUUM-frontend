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

    <v-chip size="x-small" class="mt-2" variant="tonal"> <!--Muestra un pequeño chip indicando el tipo: texto, foto, video, etc.-->
      {{ memory.type }}
    </v-chip>
  </v-card>
</template>

<script setup lang="ts">
// Importamos la interfaz  del store 
import type { Memory } from '@/stores/memorialStore'

// PROPS: Recibo un objeto "memory" del padre, que debe cumplir la interfaz
defineProps<{
  memory: Memory
}>()

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