<template>
  <!-- Barra superior principal del layout -->
  <v-app-bar flat border>
    
    
    <!-- Título de la barra.
         Muestra "Admin / NombreDeLaRutaActual".
         $route.name viene del router y cambia automáticamente según la vista. -->
    <v-toolbar-title class="text-subtitle-1">
      Admin / {{ $route.name }}
    </v-toolbar-title>

    <!-- Empuja los elementos siguientes hacia la derecha -->
    <v-spacer></v-spacer>

    <!-- Botón de notificaciones -->
    <v-btn icon="mdi-bell-outline" class="mr-2">
      <!-- Badge: punto rojo indicando notificaciones -->
      <v-badge dot color="red">
        <!-- El icono se renderiza dentro del badge -->
        <v-icon></v-icon>
      </v-badge>
    </v-btn>

    <!-- Menú desplegable del usuario -->
    <v-menu>
      <!-- Activador del menú: el botón que al hacer clic abre el menú -->
      <template v-slot:activator="{ props }">
        <!-- props contiene los eventos y atributos necesarios para abrir el menú -->
        <v-btn v-bind="props" class="text-none">
          <!-- Avatar del usuario -->
          <v-avatar size="32" color="primary" class="mr-2">AD</v-avatar>
          <!-- Nombre del usuario -->
          Administrador
        </v-btn>
      </template>

      <!-- Contenido del menú -->
      <v-list>
        <!-- Opción: ir al perfil -->
        <v-list-item prepend-icon="mdi-account" title="Perfil"></v-list-item>

        <!-- Opción: cerrar sesión -->
        <v-list-item prepend-icon="mdi-logout" title="Cerrar Sesión" color="error" @click="handleLogout"></v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>


<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'


/*
1. Llama al store de autenticación (authStore)
2. Ejecuta logout() → borra token, usuario, etc.
3. Redirige a la ruta "Login"
*/
const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push({ name: 'Login' })
}


</script>