<template>
  <v-app-bar elevation="1">
    <v-app-bar-title class="font-weight-bold text-indigo">
      PERPETUUM
    </v-app-bar-title>

    <v-spacer />

    <v-btn to="/" variant="text">Inicio</v-btn>
    <v-btn to="/login" variant="text">Login</v-btn>

    <ThemeToggle />

    <v-btn icon="mdi-translate" />
  </v-app-bar>
</template>

<script setup lang="ts">
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
</script>


