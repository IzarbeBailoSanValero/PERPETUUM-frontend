<template>
  <!-- Barra superior principal del layout -->
  <v-app-bar flat border>

    <!-- Botón hamburguesa: solo visible en móvil (oculto en md+) -->
    <v-btn
      icon="mdi-menu"
      class="d-flex d-md-none"
      @click="emit('toggle-drawer')"
      aria-label="Abrir menú"
    />

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
      <v-badge dot color="error">
        <v-icon></v-icon>
      </v-badge>
    </v-btn>

    <!-- Menú desplegable del usuario -->
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" class="text-none">
          <v-avatar size="32" color="primary" class="mr-2">AD</v-avatar>
          <!-- Nombre oculto en pantallas muy pequeñas -->
          <span class="d-none d-sm-inline">Administrador</span>
        </v-btn>
      </template>

      <v-list>
        <v-list-item prepend-icon="mdi-account" title="Perfil"></v-list-item>
        <v-list-item prepend-icon="mdi-logout" title="Cerrar Sesión" color="error" @click="handleLogout"></v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

// Emite al AdminLayout para que toglee el drawer
const emit = defineEmits<{ (e: 'toggle-drawer'): void }>()

function handleLogout() {
  auth.logout()
  router.push({ name: 'Login' })
}
</script>