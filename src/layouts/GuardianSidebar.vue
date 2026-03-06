<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-item prepend-icon="mdi-account-heart" :title="auth.user?.name || 'Guardián'" />
      <v-divider />
      <v-list-item prepend-icon="mdi-book-open-variant" :title="t('sidebar.guardian.myMemorials')"  to="/guardian/my-memorials" />
      <v-list-item prepend-icon="mdi-pencil"            :title="t('sidebar.guardian.editMemorial')" to="/guardian/my-memorials" />
      <v-list-item prepend-icon="mdi-shield-check"      :title="t('sidebar.guardian.moderation')"  to="/guardian/moderation" />
      <v-list-item prepend-icon="mdi-earth"             :title="t('sidebar.guardian.publicArea')"  to="/" />
      <v-divider />
      <v-list-item prepend-icon="mdi-logout" :title="t('sidebar.guardian.logout')" @click="handleLogout" />
    </v-list>

    <!-- Controles de tema e idioma al pie del sidebar -->
    <template v-slot:append>
      <v-divider />
      <div class="d-flex justify-center align-center gap-1 pa-3">
        <ThemeToggle />
        <LangToggle />
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import LangToggle from '@/components/ui/LangToggle.vue'

const { t } = useI18n()
const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>