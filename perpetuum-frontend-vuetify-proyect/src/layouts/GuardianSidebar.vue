<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-item prepend-icon="mdi-account-heart" title="PERPETUUM" subtitle="Guardián" />
      <v-divider />
      <v-list-item 
        prepend-icon="mdi-book-open-variant" 
        title="Mis Memoriales" 
        to="/guardian/my-memorials"
      />
      <v-list-item 
        prepend-icon="mdi-shield-check" 
        title="Moderación" 
        to="/guardian/moderation"
      />
      <v-list-item 
        prepend-icon="mdi-cog" 
        title="Ajustes" 
        to="/guardian/settings"
      />
      <v-divider />
      <v-list-item 
        prepend-icon="mdi-logout" 
        title="Cerrar Sesión"
      />
    </v-list>
  </v-navigation-drawer>
</template>
