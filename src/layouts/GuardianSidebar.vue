<template>
  <!--
    :permanent="mdAndUp"  → En desktop (md+) siempre visible.
    :temporary="!mdAndUp" → En móvil es un overlay que se cierra al pulsar fuera.
  -->
  <v-navigation-drawer
    :model-value="open"
    @update:model-value="emit('update:open', $event)"
    :permanent="mdAndUp"
    :temporary="!mdAndUp"
  >
    <v-list>
      <v-list-item prepend-icon="mdi-account-heart" :title="auth.user?.name || 'Guardián'" />
      <v-divider />
      <v-list-item prepend-icon="mdi-book-open-variant" :title="t('sidebar.guardian.myMemorials')"  to="/guardian/my-memorials" />
      <v-list-item prepend-icon="mdi-earth"             :title="t('sidebar.guardian.publicArea')"  to="/" />
      <v-divider />
      <v-list-item prepend-icon="mdi-logout" :title="t('sidebar.guardian.logout')" @click="handleLogout" />
    </v-list>

    <!-- Controles de tema e idioma al pie del sidebar (solo desktop, en móvil van en topbar) -->
    <template v-slot:append>
      <v-divider />
      <div class="d-none d-md-flex justify-center align-center gap-1 pa-3">
        <ThemeToggle />
        <LangToggle />
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import LangToggle from '@/components/ui/LangToggle.vue'

const { t } = useI18n()
const { mdAndUp } = useDisplay()
const auth = useAuthStore()
const router = useRouter()

defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>()

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>