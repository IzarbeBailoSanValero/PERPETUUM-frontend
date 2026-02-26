
    <!-- Listado y formulario de crud de Difuntos-->

    <!--
    Listado: Una tabla básica que lee del Store.
    Formulario: Un modal que solo se encarga de enviar datos.
    Sincronización: Cuando guardas, llamas a fetchAllDeceased() para que la tabla se actualice.
-->

<!--apuntes varios: 
- v-data-table: Es como un Excel inteligente. Solo le pasas headers (las columnas) e items (los datos del Store). Ella se encarga de pintar las filas.
- v-model="dialog": Es un interruptor. Si es true, el modal aparece; si es false, desaparece.
- Object.assign o limpieza manual: Al terminar de guardar, borramos el contenido de form.name, etc., para que si el usuario quiere crear otro difunto, el formulario esté limpio.
- store.fetchAllDeceased(): Reactividad. En lugar de insertar la fila nueva a mano, le decimos al Store: "Oye, los datos han cambiado en la base de datos, ve a buscarlos de nuevo". Vue detecta el cambio y actualiza la pantalla solo.
-->

    <template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-5">
      <h2 class="text-h4">Listado de Difuntos</h2>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="dialog = true">
        Nuevo Difunto
      </v-btn>
    </div>

    <v-card variant="outlined">
      <v-data-table 
        :headers="headers" 
        :items="store.deceasedList" 
        :loading="store.loading"
      >
        <template v-slot:item.photoURL="{ value }">
          <v-avatar size="40" color="grey-lighten-2">
            <v-img :src="value"></v-img>
          </v-avatar>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="500">
      <v-card title="Registrar Difunto" class="pa-4">
        <v-card-text>
          <v-text-field v-model="form.name" label="Nombre Completo" variant="underlined"></v-text-field>
          <v-text-field v-model="form.dni" label="DNI" variant="underlined"></v-text-field>
          <v-text-field v-model="form.deathDate" label="Fecha de Defunción" type="date" variant="underlined"></v-text-field>
          <v-text-field v-model="form.photoURL" label="URL de la Foto" variant="underlined"></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="save" :loading="saving">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useMemorialStore } from '@/stores/memorialStore'
import apiClient from '@/plugins/axios'
import Swal from 'sweetalert2'

const store = useMemorialStore()
const dialog = ref(false)
const saving = ref(false)

// Cabeceras: 
const headers = [
  { title: 'Foto', key: 'photoURL' },
  { title: 'Nombre', key: 'name' },
  { title: 'DNI', key: 'dni' },
  { title: 'Fecha', key: 'deathDate' }
]

// Formulario: Solo los campos obligatorios para  DTO
const form = reactive({
  name: '',
  dni: '',
  deathDate: '',
  photoURL: '',
  funeralHomeId: 0, 
  guardianId: 0    
})

// Cargar datos al entrar
onMounted(() => {
  store.fetchAllDeceased()
})

// Función para guardar (POST)
async function save() {
  saving.value = true
  try {
    await apiClient.post('/Deceased', form)
    dialog.value = false // Cerrar modal
    store.fetchAllDeceased() // Recargar la tabla automáticamente
    
    // Limpiar el formulario para la próxima vez
    form.name = ''; form.dni = ''; form.deathDate = ''; form.photoURL = '';
  } catch (error) {
    Swal.fire({
  title: '¡error al guardar!',
});
  } finally {
    saving.value = false
  }
}
</script>