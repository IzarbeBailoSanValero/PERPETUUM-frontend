<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-4 pa-sm-6 text-center">
          <v-icon size="80" color="error" class="mb-4">mdi-lock</v-icon>
          <h1 class="text-h5 text-sm-h4 mb-4">Acceso No Autorizado</h1>
          <p class="text-body-1 mb-6">
            No tienes permisos para acceder a esta página.
          </p>
          <v-btn color="primary" @click="$router.push('/')">
            Volver al Inicio
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
</script>