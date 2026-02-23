<template>
  <v-app>
    <AdminSidebar />
    <v-main>
      <AdminTopbar />
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import AdminSidebar from './AdminSidebar.vue'
import AdminTopbar from './AdminTopbar.vue'
</script>
