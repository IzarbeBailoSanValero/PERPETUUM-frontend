<template>
  <v-app>
    <GuardianSidebar />
    <v-main>
      <v-app-bar elevation="1">
        <v-app-bar-title class="font-weight-bold">Panel Familiar</v-app-bar-title>
        <v-spacer />
        <v-btn variant="text" class="text-none" to="/guardian/home">Inicio</v-btn>
        <v-btn variant="text" class="text-none" to="/guardian/my-memorials">Memoriales</v-btn>
        <v-btn variant="text" class="text-none" to="/guardian/moderation">Moderación</v-btn>
        <v-btn color="error" variant="text" class="text-none" @click="handleLogout">Cerrar sesión</v-btn>
      </v-app-bar>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import GuardianSidebar from './GuardianSidebar.vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>
