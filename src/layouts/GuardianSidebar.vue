<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-item prepend-icon="mdi-account-heart" :title="auth.user?.name || 'Guardián'" subtitle="Cuenta familiar" />
      <v-divider />
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
      <v-list-item
        prepend-icon="mdi-earth"
        title="Área Pública"
        to="/"
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
