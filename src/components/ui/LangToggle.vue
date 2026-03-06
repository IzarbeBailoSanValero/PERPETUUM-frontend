<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-translate" v-bind="props" />
    </template>
    <v-list>
      <v-list-item @click="changeLang('es')" :active="locale === 'es'">
        <v-list-item-title>🇪🇸 Español</v-list-item-title>
      </v-list-item>
      <v-list-item @click="changeLang('en')" :active="locale === 'en'">
        <v-list-item-title>🇬🇧 English</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/i18n'

const { locale } = useI18n()

function changeLang(lang: 'es' | 'en') {
  setLocale(lang)
}
</script>