<template>
  <v-app>
    <router-view />
  </v-app>
</template>





<script setup lang="ts">
/*
Apuntes: 
- Aquí no debe haber lógica, porque:Es el punto de entrada.Solo envuelve todo en <v-app>.El router decide qué layout mostrar.
solo sincronizo el motor de temas de vuetify con el store para que antes de moanral la aplicacion tengamos el tema de preferencia de usuario
*/

import { onBeforeMount } from 'vue'
import { useTheme } from 'vuetify'
import { useUiStore } from '@/stores/uiStore'

const theme = useTheme()
const ui = useUiStore()

onBeforeMount(() => {
  theme.global.name.value = ui.isDark ? 'dark' : 'light'
})
</script>