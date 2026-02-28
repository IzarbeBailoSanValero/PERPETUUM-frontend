<!-- BOTÓN CLARO / OSCURO
 Vuetify tiene un composable llamado useTheme() que controla los colores de toda la página en tiempo real.
CAMBIO DE TEMA: Utilizo el composable useTheme() de Vuetify sincronizado con el estado persistente de Pinia (localStorage).
-->

<template>
  <v-btn 
    :icon="ui.isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'" 
    @click="toggle"
    variant="text"
  ></v-btn>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'
import { useUiStore } from '@/stores/uiStore'
import { onMounted } from 'vue'

const theme = useTheme()
const ui = useUiStore()

// Al cargar el botón, leemos lo que hay en el Store y se lo pasamos a Vuetify
onMounted(() => {
  theme.global.name.value = ui.isDark ? 'dark' : 'light'
})

// Función  al hacer clic
function toggle() {
  ui.toggleTheme() // Cambia el valor en el Store y localStorage
  theme.global.name.value = ui.isDark ? 'dark' : 'light' // Vuetify cambia  colores 
}



</script>