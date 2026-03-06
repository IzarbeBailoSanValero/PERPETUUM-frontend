<template>
  <v-app-bar elevation="1">
    <v-app-bar-title
      class="font-weight-bold text-primary"
      style="cursor: pointer"
      @click="router.push('/')"
    >PERPETUUM</v-app-bar-title>

    <v-spacer />

    <v-btn
      v-if="route.path !== '/'"
      to="/"
      exact
      variant="text"
      class="text-none"
      active-class="text-primary font-weight-black"
    >
      {{ t('nav.home') }}
    </v-btn>

    <v-btn
      v-if="!auth.isLoggedIn && route.path !== '/login'"
      to="/login"
      exact
      variant="text"
      class="text-none"
      active-class="text-primary font-weight-black"
    >
      {{ t('nav.login') }}
    </v-btn>

    <v-btn
      v-if="!auth.isLoggedIn && route.path !== '/register'"
      to="/register"
      exact
      color="primary"
      variant="flat"
      class="text-none ml-2"
    >
      {{ t('nav.register') }}
    </v-btn>

    <v-btn
      v-if="auth.isLoggedIn && (auth.userRole === 'Admin' || auth.userRole === 'Staff')"
      to="/admin/dashboard"
      color="primary"
      variant="tonal"
      class="text-none ml-2"
    >
      {{ t('nav.adminPanel') }}
    </v-btn>

    <v-btn
      v-if="auth.isLoggedIn && auth.userRole === 'Guardian'"
      to="/guardian/my-memorials"
      color="primary"
      variant="tonal"
      class="text-none ml-2"
    >
      {{ t('nav.guardianPanel') }}
    </v-btn>

    <v-btn
      v-if="auth.isLoggedIn && auth.userRole === 'StandardUser'"
      to="/profile"
      color="primary"
      variant="tonal"
      prepend-icon="mdi-account-circle"
      class="text-none ml-2"
    >
      {{ t('nav.myProfile') }}
    </v-btn>

    <v-btn
      v-if="auth.isLoggedIn"
      @click="handleLogout"
      color="error"
      variant="text"
      class="text-none ml-2"
    >
      {{ t('nav.logout') }}
    </v-btn>

    <LangToggle class="ml-2" />
    <ThemeToggle />
  </v-app-bar>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import { useRoute, useRouter } from 'vue-router'
import LangToggle from '@/components/ui/LangToggle.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const { t } = useI18n()
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>