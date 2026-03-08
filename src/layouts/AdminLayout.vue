<template>
  <!-- v-app es el contenedor raíz obligatorio de Vuetify. -->
  <v-app>

    <!-- Pasamos drawer como v-model para que AdminTopbar pueda abrir/cerrar el sidebar -->
    <AdminSidebar v-model="drawer" />

    <AdminTopbar @toggle-drawer="drawer = !drawer" />

    <!-- v-main es el área donde se renderiza el contenido principal.
         Vuetify calcula el espacio restante después del sidebar y topbar. -->
    <v-main class="bg-surface-variant">

      <!-- v-container añade márgenes y controla el ancho del contenido.
           fluid = ocupa todo el ancho disponible.
           pa-3 pa-sm-6 = padding compacto en móvil, amplio en escritorio. -->
      <v-container fluid class="pa-3 pa-sm-6">

        <!-- router-view es donde Vue Router inyecta la vista actual.
             Aquí aparecerán Dashboard, Difuntos, Empleados, etc. -->
        <router-view />

      </v-container>
    </v-main>

    <!--como requisito del enunciado, hago un footer distinto para admin-->
    <v-footer app border class="bg-surface justify-center text-caption text-medium-emphasis flex-wrap text-center">
      PERPETUUM Management System · {{ new Date().getFullYear() }} — Panel de Control Interno
    </v-footer>

  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import AdminSidebar from './AdminSidebar.vue'
import AdminTopbar from './AdminTopbar.vue'

const { mobile } = useDisplay()

// Arranca cerrado siempre; onMounted lo abre en escritorio una vez que
// useDisplay() ya tiene el tamaño real de la ventana
const drawer = ref(false)

onMounted(() => {
  if (!mobile.value) drawer.value = true
})
</script>