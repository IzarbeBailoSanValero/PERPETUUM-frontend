<template>
  <v-app>
    <GuardianSidebar v-model:open="drawerOpen" />

    <!-- Topbar con hamburguesa para móvil -->
    <v-app-bar flat border>
      <v-btn
        icon="mdi-menu"
        class="d-flex d-md-none"
        @click="drawerOpen = !drawerOpen"
        aria-label="Abrir menú"
      />
      <v-toolbar-title class="text-subtitle-1 font-weight-bold text-primary">
        PERPETUUM
      </v-toolbar-title>
      <v-spacer />
      <!-- Accesos rápidos en la topbar solo en móvil -->
      <ThemeToggle class="d-flex d-md-none" />
      <LangToggle class="d-flex d-md-none" />
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-4 pa-md-6">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import GuardianSidebar from './GuardianSidebar.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import LangToggle from '@/components/ui/LangToggle.vue'

const { mdAndUp } = useDisplay()

// En desktop (md+) el drawer arranca abierto; en móvil, cerrado
const drawerOpen = ref(mdAndUp.value)

watch(mdAndUp, (isDesktop) => {
  if (isDesktop) drawerOpen.value = true
})
</script>