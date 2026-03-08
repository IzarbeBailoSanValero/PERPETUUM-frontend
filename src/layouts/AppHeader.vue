<template>
  <v-app-bar elevation="1">
    <v-app-bar-title
      class="font-weight-bold text-primary"
      style="cursor: pointer"
      @click="router.push('/')"
    >PERPETUUM</v-app-bar-title>

    <v-spacer />

    <!-- Navegación normal: visible en pantallas sm+ -->
    <template v-if="!mobile">
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
    </template>

    <!-- En móvil: solo tema, idioma y menú hamburguesa -->
    <template v-else>
      <LangToggle />
      <ThemeToggle />

      <!-- Menú hamburguesa -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-menu" v-bind="props" class="ml-1" />
        </template>
        <v-list min-width="200">
          <v-list-item
            v-if="route.path !== '/'"
            to="/"
            prepend-icon="mdi-home"
            :title="t('nav.home')"
          />
          <template v-if="!auth.isLoggedIn">
            <v-list-item
              v-if="route.path !== '/login'"
              to="/login"
              prepend-icon="mdi-login"
              :title="t('nav.login')"
            />
            <v-list-item
              v-if="route.path !== '/register'"
              to="/register"
              prepend-icon="mdi-account-plus"
              :title="t('nav.register')"
            />
          </template>
          <template v-else>
            <v-list-item
              v-if="auth.userRole === 'Admin' || auth.userRole === 'Staff'"
              to="/admin/dashboard"
              prepend-icon="mdi-view-dashboard"
              :title="t('nav.adminPanel')"
            />
            <v-list-item
              v-if="auth.userRole === 'Guardian'"
              to="/guardian/my-memorials"
              prepend-icon="mdi-book-open-variant"
              :title="t('nav.guardianPanel')"
            />
            <v-list-item
              v-if="auth.userRole === 'StandardUser'"
              to="/profile"
              prepend-icon="mdi-account-circle"
              :title="t('nav.myProfile')"
            />
            <v-divider />
            <v-list-item
              prepend-icon="mdi-logout"
              :title="t('nav.logout')"
              @click="handleLogout"
              base-color="error"
            />
          </template>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/stores/authStore'
import { useRoute, useRouter } from 'vue-router'
import LangToggle from '@/components/ui/LangToggle.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const { t } = useI18n()
const { mobile } = useDisplay()
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>