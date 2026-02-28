



<template>   
  <!-- Menú para cambiar el idioma -->
  <v-menu>
    <!--  botón con icono de traducción -->
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-translate" v-bind="props"></v-btn>
    </template>

    <!-- Lista de opciones de idioma -->
    <v-list>
      <!-- Cuando click aquí cambio a esp, en el siguiente a inglés -->
      <v-list-item @click="changeLang('es')">
        <v-list-item-title>Español</v-list-item-title>
      </v-list-item>

      
      <v-list-item @click="changeLang('en')">
        <v-list-item-title>English</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/uiStore'

//guardar el idioma que elijo
const ui = useUiStore()

function changeLang(lang: string) {
 
  ui.setLanguage(lang)//  se guarda en el store y se actualiza la interfaz.
}

</script>