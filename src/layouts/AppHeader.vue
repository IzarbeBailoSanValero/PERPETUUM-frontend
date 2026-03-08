<template>
  <!-- Menú lateral temporal para móvil: se abre con la hamburguesa -->
  <v-navigation-drawer v-model="mobileMenu" location="right" temporary>
    <v-list nav>
      <v-list-item
        v-if="route.path !== '/'"
        prepend-icon="mdi-home-outline"
        :title="t('nav.home')"
        to="/"
        @click="mobileMenu = false"
      />
      <v-list-item
        v-if="!auth.isLoggedIn && route.path !== '/login'"
        prepend-icon="mdi-login"
        :title="t('nav.login')"
        to="/login"
        @click="mobileMenu = false"
      />
      <v-list-item
        v-if="!auth.isLoggedIn && route.path !== '/register'"
        prepend-icon="mdi-account-plus"
        :title="t('nav.register')"
        to="/register"
        @click="mobileMenu = false"
      />
      <v-list-item
        v-if="auth.isLoggedIn && (auth.userRole === 'Admin' || auth.userRole === 'Staff')"
        prepend-icon="mdi-shield-crown"
        :title="t('nav.adminPanel')"
        to="/admin/dashboard"
        @click="mobileMenu = false"
      />
      <v-list-item
        v-if="auth.isLoggedIn && auth.userRole === 'Guardian'"
        prepend-icon="mdi-account-heart"
        :title="t('nav.guardianPanel')"
        to="/guardian/my-memorials"
        @click="mobileMenu = false"
      />
      <v-list-item
        v-if="auth.isLoggedIn && auth.userRole === 'StandardUser'"
        prepend-icon="mdi-account-circle"
        :title="t('nav.myProfile')"
        to="/profile"
        @click="mobileMenu = false"
      />
      <v-divider v-if="auth.isLoggedIn" class="my-2" />
      <v-list-item
        v-if="auth.isLoggedIn"
        prepend-icon="mdi-logout"
        :title="t('nav.logout')"
        base-color="error"
        @click="handleLogout"
      />
    </v-list>

    <!-- Tema e idioma al pie del menú móvil -->
    <template v-slot:append>
      <v-divider />
      <div class="d-flex justify-center align-center ga-2 pa-3">
        <LangToggle />
        <ThemeToggle />
      </div>
    </template>
  </v-navigation-drawer>

  <v-app-bar elevation="1">
    <v-app-bar-title
      class="font-weight-bold text-primary"
      style="cursor: pointer"
      @click="router.push('/')"
    >PERPETUUM</v-app-bar-title>

    <v-spacer />

    <!-- Botones de escritorio: se ocultan en móvil (xs) -->
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

    <!-- En móvil: solo tema, idioma y hamburguesa -->
    <template v-else>
      <LangToggle />
      <ThemeToggle />
      <v-btn icon="mdi-menu" variant="text" @click="mobileMenu = true" />
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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

// Controla la apertura del menú lateral en móvil
const mobileMenu = ref(false)

function handleLogout() {
  mobileMenu.value = false
  auth.logout()
  router.push('/')
}
</script>