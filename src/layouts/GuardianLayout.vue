<template>
  <v-app>
    <GuardianSidebar />
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import GuardianSidebar from './GuardianSidebar.vue'
</script>
