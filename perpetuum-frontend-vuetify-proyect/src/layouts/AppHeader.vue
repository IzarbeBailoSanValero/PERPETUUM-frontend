
<template>
  <v-app-bar elevation="1">
    <v-app-bar-title class="font-weight-bold text-indigo">PERPETUUM</v-app-bar-title>
    
    <v-spacer />

    <v-btn to="/" variant="text" class="text-none">
      {{ t.navHome }}
    </v-btn>
    
    <v-btn to="/login" variant="text" class="text-none">
      {{ t.navLogin }}
    </v-btn>
    
    <LangToggle />
    <ThemeToggle />
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '@/stores/uiStore'

// gestión de IU
import LangToggle from '@/components/ui/LangToggle.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const ui = useUiStore()

/* APUNTES SOBRE i18n:
 Si el usuario cambia idioma,  se recalcula y actualiza los textos de la interfaz sin refrescar.
*/
const t = computed(() => {
  if (ui.language === 'en') {
    return {
      navHome: 'Home',
      navLogin: 'Login'
    }
  }
  //  defecto español
  return {
    navHome: 'Inicio',
    navLogin: 'Acceder'
  }
})
</script>