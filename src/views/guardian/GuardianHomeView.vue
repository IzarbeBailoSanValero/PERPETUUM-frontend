<template>
  <v-container fluid>
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">Espacio Familiar</h1>
        <p class="text-medium-emphasis mt-2">
          Gestiona los memoriales de tus seres queridos y modera los comentarios pendientes.
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card border class="rounded-xl">
          <v-card-item>
            <v-card-title>Mis Memoriales</v-card-title>
            <v-card-subtitle>Consulta los perfiles asignados a tu cuenta</v-card-subtitle>
          </v-card-item>
          <v-card-actions>
            <v-btn color="primary" to="/guardian/my-memorials">Ir a memoriales</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card border class="rounded-xl">
          <v-card-item>
            <v-card-title>Moderación</v-card-title>
            <v-card-subtitle>Aprueba o rechaza comentarios pendientes</v-card-subtitle>
          </v-card-item>
          <v-card-actions>
            <v-btn color="primary" to="/guardian/moderation">Ir a moderación</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
