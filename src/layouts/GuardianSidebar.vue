<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-item prepend-icon="mdi-account-heart" title="PERPETUUM" subtitle="Guardián" />
      <v-divider />
      <v-list-item
        prepend-icon="mdi-home-outline"
        title="Inicio Familiar"
        to="/guardian/home"
      />
      <v-list-item 
        prepend-icon="mdi-book-open-variant" 
        title="Mis Memoriales" 
        to="/guardian/my-memorials"
      />
      <v-list-item 
        prepend-icon="mdi-shield-check" 
        title="Moderación" 
        to="/guardian/moderation"
      />
      <v-divider />
      <v-list-item 
        prepend-icon="mdi-logout" 
        title="Cerrar Sesión"
        @click="handleLogout"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>
