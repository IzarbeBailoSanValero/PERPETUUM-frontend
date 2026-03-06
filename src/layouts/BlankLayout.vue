<script>
/*
Apuntes:
Los Layouts son "cáscaras". Su única misión es colocar el menú y dejar un hueco (<router-view />) para que aparezca el contenido.
*/ 
</script>
<template>
  <v-app>
    <v-main class="d-flex align-center justify-center bg-background">
      <router-view />
    </v-main>
  </v-app>
</template>