<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-item prepend-icon="mdi-shield-crown" title="PERPETUUM" subtitle="Admin" />
      <v-divider />
      <v-list-item 
        prepend-icon="mdi-view-dashboard" 
        title="Dashboard" 
        to="/admin/dashboard"
      />
      <v-list-item 
        prepend-icon="mdi-account-multiple" 
        title="Difuntos" 
        to="/admin/deceased"
      />
      <v-list-item 
        prepend-icon="mdi-account-heart" 
        title="Guardianes" 
        to="/admin/guardians"
      />
      <v-divider />
      <v-list-item 
        prepend-icon="mdi-logout" 
        title="Cerrar Sesión"
      />
    </v-list>
  </v-navigation-drawer>
</template>
