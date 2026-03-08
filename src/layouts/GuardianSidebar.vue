<template>
  <!-- En escritorio: permanent=true → siempre visible.
       En móvil:      temporary=true → se superpone y se cierra al tocar fuera. -->
  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :permanent="!mobile"
    :temporary="mobile"
  >
    <v-list>
      <v-list-item prepend-icon="mdi-account-heart" :title="auth.user?.name || 'Guardián'" />
      <v-divider />
      <v-list-item prepend-icon="mdi-book-open-variant" :title="t('sidebar.guardian.myMemorials')"  to="/guardian/my-memorials" @click="closeOnMobile" />
      <v-list-item prepend-icon="mdi-earth"             :title="t('sidebar.guardian.publicArea')"   to="/"                      @click="closeOnMobile" />
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
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import LangToggle from '@/components/ui/LangToggle.vue'

const { t } = useI18n()
const { mobile } = useDisplay()
const auth = useAuthStore()
const router = useRouter()

// v-model del drawer: GuardianLayout controla si está abierto o cerrado
defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

// En móvil, cerrar el drawer al navegar para que no tape el contenido
function closeOnMobile() {
  if (mobile.value) emit('update:modelValue', false)
}

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>