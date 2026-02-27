<!-- Listado y formulario de crud de Difuntos-->

<!--
      Carga: Al entrar, disparas dos peticiones en paralelo (onMounted).
      Interacción: El usuario abre el modal, rellena datos y elige un único guardián de la lista.
      Persistencia: Envías el objeto form (que ya contiene los IDs necesarios).
      Sincronización: Al recibir el OK, limpias el formulario y disparas fetchAllDeceased() para que la tabla de fondo se actualice sin refrescar la página.
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
      <v-data-table :headers="headers" :items="store.deceasedList" :loading="store.loading">
        
        <template v-slot:item.name="{ item }">
          <DeceasedRow :item="item" />
        </template>

        <template v-slot:item.deathDate="{ value }">
          <v-chip size="small" variant="outlined" color="primary">{{ value }}</v-chip>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="500">
      <v-card title="Registrar Difunto" class="pa-4">
        
        <VForm @submit="save" :validation-schema="schema" v-slot="{ errors }">
          <v-card-text>
            
            <Field name="name" v-model="form.name" v-slot="{ field }">
              <v-text-field 
                v-bind="field" 
                label="Nombre Completo" 
                variant="underlined"
                :error-messages="errors.name" 
              ></v-text-field>
            </Field>

            <Field name="dni" v-model="form.dni" v-slot="{ field }">
              <v-text-field 
                v-bind="field" 
                label="DNI" 
                variant="underlined"
                :error-messages="errors.dni"
              ></v-text-field>
            </Field>

            <Field name="deathDate" v-model="form.deathDate" v-slot="{ field }">
              <v-text-field 
                v-bind="field" 
                label="Fecha de Defunción" 
                type="date"
                variant="underlined"
                :error-messages="errors.deathDate"
              ></v-text-field>
            </Field>

            <Field name="guardianId" v-model="form.guardianId" v-slot="{ field }">
              <v-select 
                v-bind="field" 
                :items="guardians" 
                item-title="name" 
                item-value="id"
                label="Familiar Responsable" 
                variant="underlined"
                :loading="loadingGuardians"
                :error-messages="errors.guardianId"
              ></v-select>
            </Field>

            <v-text-field v-model="form.photoURL" label="URL de la Foto" variant="underlined"></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
            <v-btn color="primary" type="submit" :loading="saving">Guardar</v-btn>
          </v-card-actions>
        </VForm>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useMemorialStore } from '@/stores/memorialStore'
import { useAuthStore } from '@/stores/authStore'
import apiClient from '@/plugins/axios'
import Swal from 'sweetalert2'

//Uso de componentes individuales y validación Vee-Validate yup
import DeceasedRow from '@/components/admin/DeceasedRow.vue'
import { Form as VForm, Field } from 'vee-validate'
import * as yup from 'yup'

const store = useMemorialStore()
const auth = useAuthStore()

const dialog = ref(false)
const saving = ref(false)
const loadingGuardians = ref(false)
const guardians = ref<any[]>([])

// Esquema de validación 
const schema = yup.object({
  name: yup.string().required('El nombre es obligatorio').min(3, 'Mínimo 3 letras'),
  dni: yup.string().required('DNI requerido'),
  deathDate: yup.string().required('La fecha es obligatoria'),
  guardianId: yup.number().required('Selecciona un responsable').nullable()
})

const headers = [
  { title: 'Nombre y Foto', key: 'name' }, //  asocia al slot item.name
  { title: 'DNI', key: 'dni' },
  { title: 'Fecha', key: 'deathDate' }
]

// Gestión de estado con Pinia (se alimenta de auth.user)
const form = reactive({
  name: '',
  dni: '',
  deathDate: '',
  photoURL: '',
  // lo pongo opcional porque empiezzza siendo nulo, para que no se rompa
  funeralHomeId: auth.user?.funeralHomeId || null, 
  guardianId: null
})

// traer familiares desde el backend
async function fetchGuardians() {
  loadingGuardians.value = true
  try {
    const response = await apiClient.get('/MemorialGuardian')
    guardians.value = response.data
  } catch (error) {
    console.error("No se pudieron cargar los guardianes")
  } finally {
    loadingGuardians.value = false
  }
}

//  Carga de datos inicial
onMounted(() => {
  store.fetchAllDeceased() // Pide datos de difuntos al backend a través del Store
  fetchGuardians()         // Carga los guardianes para el selector
})

// Función de pOST
async function save() {
  //  Captura el id de la funeraria si no estaba al cargar
  if (!form.funeralHomeId && auth.user?.funeralHomeId) {
    form.funeralHomeId = auth.user.funeralHomeId;
  }

  saving.value = true
  try {
    // Persistencia de datos en backend
    await apiClient.post('/Deceased', form)
    dialog.value = false 
    store.fetchAllDeceased() // sincronizo pinia

    // Limpieza 
    Object.assign(form, { name: '', dni: '', deathDate: '', photoURL: '', guardianId: null });

   
    Swal.fire({ title: '¡Éxito!', icon: 'success', timer: 2000, showConfirmButton: false });

  } catch (error) {
    Swal.fire({ title: 'Error', text: 'No se pudo registrar', icon: 'error' });
  } finally {
    saving.value = false
  }
}
</script>