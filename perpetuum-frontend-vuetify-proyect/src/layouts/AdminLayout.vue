<template>
  <!-- v-app es el contenedor raíz obligatorio de Vuetify.-->
  <v-app>

    <AdminSidebar />

    <AdminTopbar />

    <!-- v-main es el área donde se renderiza el contenido principal. Vuetify calcula el espacio restante después del sidebar y topbar. -->
    <v-main class="bg-grey-lighten-4">

      <!-- v-container añade márgenes y controla el ancho del contenido.fluid = ocupa todo el ancho disponible.pa-6 = padding amplio para que el contenido respire. -->
      <v-container fluid class="pa-6">

        <!-- router-view es donde Vue Router inyecta la vista actual. Aquí aparecerán Dashboard, Difuntos, Empleados, etc. -->
        <router-view />

      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import AdminSidebar from './AdminSidebar.vue'
import AdminTopbar from './AdminTopbar.vue'
</script>



