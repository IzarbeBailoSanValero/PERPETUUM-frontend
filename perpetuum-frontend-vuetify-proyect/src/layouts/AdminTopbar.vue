<template>
  <v-toolbar color="surface">
    <v-breadcrumbs :items="breadcrumbs">
      <template #divider>
        <v-icon icon="mdi-chevron-right" />
      </template>
    </v-breadcrumbs>
    <v-spacer />
    <v-btn icon="mdi-bell" />
    <v-menu>
      <template #activator="{ props }">
        <v-btn icon="mdi-account-circle" v-bind="props" />
      </template>
      <v-list>
        <v-list-item title="Perfil" prepend-icon="mdi-account" />
        <v-list-item title="Configuración" prepend-icon="mdi-cog" />
        <v-divider />
        <v-list-item title="Cerrar Sesión" prepend-icon="mdi-logout" />
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const breadcrumbs = ref([
  { title: 'Admin', disabled: false, href: '/admin' },
  { title: 'Dashboard', disabled: true }
])
</script>
