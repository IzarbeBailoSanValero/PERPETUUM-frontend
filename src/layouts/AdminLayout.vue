<template>
  <!-- v-app es el contenedor raíz obligatorio de Vuetify.-->
  <v-app>

    <!-- drawerOpen controla la visibilidad del sidebar en móvil -->
    <AdminSidebar v-model:open="drawerOpen" />

    <!-- onToggleDrawer emitido desde el topbar para abrir/cerrar el sidebar en móvil -->
    <AdminTopbar @toggle-drawer="drawerOpen = !drawerOpen" />

    <!-- v-main es el área donde se renderiza el contenido principal. Vuetify calcula el espacio restante después del sidebar y topbar. -->
    <v-main class="bg-surface-variant">

      <!-- v-container añade márgenes y controla el ancho del contenido.fluid = ocupa todo el ancho disponible.pa-4 en móvil, pa-6 en desktop. -->
      <v-container fluid class="pa-4 pa-md-6">

        <!-- router-view es donde Vue Router inyecta la vista actual. Aquí aparecerán Dashboard, Difuntos, Empleados, etc. -->
        <router-view />

      </v-container>
    </v-main>

    <!--como requisito del enunciado, hago un footer distinto para admin-->
    <v-footer app border class="bg-surface justify-center text-caption text-medium-emphasis">
      PERPETUUM Management System ; {{ new Date().getFullYear() }} — Panel de Control Interno
    </v-footer>

  </v-app>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import AdminSidebar from './AdminSidebar.vue'
import AdminTopbar from './AdminTopbar.vue'

const { mdAndUp } = useDisplay()

// En desktop (md+) el drawer arranca abierto; en móvil, cerrado
const drawerOpen = ref(mdAndUp.value)

// Si el usuario rota/cambia el tamaño a desktop, reabrimos el drawer automáticamente
watch(mdAndUp, (isDesktop) => {
  if (isDesktop) drawerOpen.value = true
})
</script>