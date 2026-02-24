<template>
  <!--contenedor oficial de Vuetify para barras laterales.
      - permanent: simepre visible, no se oculta
      - elevation: sombra
  -->
  <v-navigation-drawer    
    permanent   
    elevation="2"
    color="indigo-darken-4"
  >

  <!--encabezado supperior con el nombre del sistema-->
    <v-list class="pa-4">
      <v-list-item
        title="PERPETUUM"
        subtitle="Panel B2B"
        prepend-icon="mdi-infinity"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <!--sección de navegaciónlo integra con  rpouter para navegar + animaciones
    - v-list → contenedor de elementos de lista
    - v-list-item → un elemento de lista con:
          title + subtitle + prepend-icon
    
    -->
    <v-list nav>
      <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" to="/admin/dashboard"></v-list-item> <!--equivale a <router-link to="/admin/dashboard">-->

      <!--menu desplegable que se abre y cierra. el activator es el botón que lo despliega
          - el activador: el slot recibe un objeto props que contiene (evento click etc). 
      -->
      <v-list-group value="Management">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-database" title="Entidades"></v-list-item> <!--los sub items: Solo se muestran cuando el grupo está abierto . Se comportan como enlaces normales del router-->
        </template>

        <v-list-item prepend-icon="mdi-grave-stone" title="Difuntos" to="/admin/deceased"></v-list-item>
        <v-list-item prepend-icon="mdi-account-hard-hat" title="Empleados" to="/admin/staff"></v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>