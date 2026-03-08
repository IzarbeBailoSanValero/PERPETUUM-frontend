<template>
  <v-app>

    <!-- Mismo patrón responsive que AdminLayout:
         v-model controla apertura/cierre del sidebar desde la topbar -->
    <GuardianSidebar v-model="drawer" />

    <!-- Topbar mínima con hamburguesa para móvil -->
    <v-app-bar flat border>
      <v-btn
        icon="mdi-menu"
        variant="text"
        @click="drawer = !drawer"
      />
      <v-app-bar-title class="font-weight-bold text-primary">PERPETUUM</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <!-- pa-3 pa-sm-4: padding compacto en móvil, más holgado en escritorio -->
      <v-container fluid class="pa-3 pa-sm-4">
        <router-view />
      </v-container>
    </v-main>

  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import GuardianSidebar from './GuardianSidebar.vue'

const { mobile } = useDisplay()

// En escritorio el drawer arranca abierto; en móvil arranca cerrado
const drawer = ref(!mobile.value)
</script>