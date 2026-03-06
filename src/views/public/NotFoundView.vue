<template>
  <v-container class="fill-height d-flex align-center justify-center py-16">
    <v-row justify="center" class="text-center">
      <v-col cols="12" sm="8" md="6">

        <!-- Icono decorativo -->
        <div class="not-found-icon mb-6">
          <v-icon size="100" color="primary" class="opacity-30">mdi-grave-stone</v-icon>
        </div>

        <!-- Número 404 grande -->
        <h1 class="not-found-number font-weight-black mb-2">404</h1>

        <!-- Título y descripción -->
        <h2 class="text-h5 font-weight-medium mb-3">{{ t('notFound.title') }}</h2>
        <p class="text-body-1 text-medium-emphasis mb-8">{{ t('notFound.subtitle') }}</p>

        <!-- Acciones -->
        <div class="d-flex flex-wrap justify-center ga-3">
          <v-btn
            color="primary"
            size="large"
            prepend-icon="mdi-home"
            to="/"
          >
            {{ t('notFound.homeBtn') }}
          </v-btn>
          <v-btn
            variant="tonal"
            size="large"
            prepend-icon="mdi-arrow-left"
            @click="router.back()"
          >
            {{ t('notFound.backBtn') }}
          </v-btn>
        </div>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
</script>

<style scoped>
.not-found-number {
  font-size: clamp(6rem, 20vw, 12rem);
  line-height: 1;
  letter-spacing: -0.05em;
  color: rgb(var(--v-theme-primary));
  opacity: 0.15;
  user-select: none;
}
.not-found-icon {
  animation: float 4s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-12px); }
}
</style>