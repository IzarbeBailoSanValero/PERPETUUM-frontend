    <!-- Tarjeta de estadística para el Dashboard -->
<template>
  <v-card class="rounded-xl pa-4" elevation="2" border>
    <div class="d-flex align-center">
      <v-avatar :color="color" variant="tonal" size="56" class="mr-4">
        <v-icon :icon="icon" size="28"></v-icon>
      </v-avatar>

      <div>
        <div class="text-overline text-grey-darken-1 line-height-1 mb-1">
          {{ title }}
        </div>
        <div class="text-h4 font-weight-bold">
          {{ value }}
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
/**
 *APUNTES DE TYPESCRIPT:
  Usamos una interfaz para definir qué datos "inyectará" el padre (DashboardView). dashboard pasa config. tarjeta dibuja
  title: El nombre del indicador.  value: Puede ser un número (156) o un texto ("12k"). icon: El nombre del icono de Material Design (ej: "mdi-account"). 
 */
defineProps<{
  title: string
  value: string | number
  icon: string
  color: string
}>()
</script>

