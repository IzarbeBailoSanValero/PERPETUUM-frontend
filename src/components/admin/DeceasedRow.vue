<!--una sola fila del difunto. la pagina llama a este componente -> requisito de no mezclar el v-for y el pintado (datos y diseño)-->
<template>
  <div class="d-flex align-center py-2">
    <v-avatar size="45" color="grey-lighten-2" class="mr-4">
      <v-img :src="item.photoURL">
        <template v-slot:placeholder>
          <v-icon>mdi-account</v-icon>
        </template>
        <template v-slot:error>
          <v-icon>mdi-image-off</v-icon>
        </template>
      </v-img>
    </v-avatar>
    
    <div>
      <div class="text-subtitle-1 font-weight-bold">{{ item.name }}</div>
      <div class="text-caption text-grey">DNI: {{ item.dni || 'N/A' }}</div> <!--si dni no disponible-->
    </div>
  </div>
</template>



<script setup lang="ts">

defineProps<{
  item: {
    name: string;
    dni?: string;
    photoURL?: string;
  }
}>()
</script>