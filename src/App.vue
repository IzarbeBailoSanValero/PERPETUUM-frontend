<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup lang="ts">
import { onBeforeMount, watch } from 'vue'
import { useTheme } from 'vuetify'
import { useUiStore } from '@/stores/uiStore'

const theme = useTheme()
const ui = useUiStore()

// Inicializa tema antes de montar la app
onBeforeMount(() => {
  theme.global.name.value = ui.isDark ? 'dark' : 'light'
})

// Opcional: sincroniza cambios en tiempo real
watch(() => ui.isDark, (val) => {
  theme.global.name.value = val ? 'dark' : 'light'
})
</script>