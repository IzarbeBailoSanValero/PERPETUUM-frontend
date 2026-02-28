  <script setup lang="ts">
  //tabla genérica para DeceasedCrudView y StaffCrudView.

  /*
  apuntes: 
  - props: padre a hijo.  ///  emits: hijo a padre

  - la tabla: se comunica con el componente padre mediante emits.
    Es un componente reutilizable que muestra una tabla (v-data-table) con:
        headers (columnas)
        items (filas)
        loading (estado de carga) --> muestra un spinner si está cargando
        botones de acción por fila (editar y eliminar)
  */



  defineProps<{     //El componente recibe desde el padre:
    headers: any[],
    items: any[],
    loading: boolean
  }>()
  

  defineEmits(['edit', 'delete'])     //El componente envía eventos al padre cuando el usuario hace clic en los botones.Esto permite que el padre controle la lógica, mientras este componente solo muestra la tabla.
  </script>


<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :loading="loading"
  >       <!--hasta aquí e sel componente prefabricado de vuetify-->
    <template v-slot:item.actions="{ item }"> <!--aquí, a través de un slot (forma de reescirbir/personalizar cosas en vuetify) sobreescirbo para deicr que en la columna actions quiero un botón de editar y borrar-->
      <v-btn icon="mdi-pencil" variant="text" color="blue" @click="$emit('edit', item)"></v-btn>
      <v-btn icon="mdi-delete" variant="text" color="red" @click="$emit('delete', item)"></v-btn>
    </template>
  </v-data-table>
</template>
