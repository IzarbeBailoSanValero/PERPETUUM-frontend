<template>
  <v-app-bar elevation="1">
    <v-app-bar-title class="font-weight-bold text-indigo">PERPETUUM</v-app-bar-title>
    
    <v-spacer />

    <v-btn 
      v-if="route.path !== '/'"
      to="/" 
      exact 
      variant="text" 
      class="text-none" 
      active-class="text-indigo font-weight-black bg-indigo-lighten-5"
    >
      {{ t.navHome }}
    </v-btn>
    
    <v-btn 
      v-if="!auth.isLoggedIn && route.path !== '/login'"
      to="/login" 
      exact 
      variant="text" 
      class="text-none" 
      active-class="text-indigo font-weight-black bg-indigo-lighten-5"
    >
      {{ t.navLogin }}
    </v-btn>

    <v-btn 
      v-if="!auth.isLoggedIn && route.path !== '/register'"
      to="/register" 
      exact 
      color="indigo" 
      variant="flat" 
      class="text-none ml-2"
    >
      {{ t.navRegister }}
    </v-btn>

    <v-btn 
      v-if="auth.isLoggedIn && (auth.userRole === 'Admin' || auth.userRole === 'Staff')" 
      to="/admin/dashboard" 
      color="indigo" 
      variant="tonal" 
      class="text-none ml-2"
    >
      Panel de Gestión
    </v-btn>

    <v-btn
      v-if="auth.isLoggedIn && auth.userRole === 'Guardian'"
      to="/guardian/my-memorials"
      color="indigo"
      variant="tonal"
      class="text-none ml-2"
    >
      Espacio Familiar
    </v-btn>

    <v-btn
      v-if="auth.isLoggedIn && auth.userRole === 'StandardUser'"
      to="/profile"
      color="indigo"
      variant="tonal"
      prepend-icon="mdi-account-circle"
      class="text-none ml-2"
    >
      Mi Perfil
    </v-btn>
      
    <v-btn 
      v-if="auth.isLoggedIn"
      @click="handleLogout" 
      color="error" 
      variant="text" 
      class="text-none ml-2"
    >
      {{ t.navLogout }}
    </v-btn>
    
    <LangToggle class="ml-2" />
    <ThemeToggle />
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { useRoute, useRouter } from 'vue-router'

// gestión de IU
import LangToggle from '@/components/ui/LangToggle.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const ui = useUiStore()
const auth = useAuthStore()
const router = useRouter()
const route = useRoute() 

// cerrar sesión y volver a la home
function handleLogout() {
  auth.logout()
  router.push('/')
}

/* APUNTES SOBRE i18n:
 Si el usuario cambia idioma,  se recalcula y actualiza los textos de la interfaz sin refrescar.
*/
const t = computed(() => {
  if (ui.language === 'en') {
    return {
      navHome: 'Home',
      navLogin: 'Login',
      navRegister: 'Sign Up',
      navLogout: 'Logout'    
    }
  }
  return {
    navHome: 'Inicio',
    navLogin: 'Acceder',
    navRegister: 'Registrarse', 
    navLogout: 'Cerrar Sesión'  
  }
})
</script>