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
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateModal">
        Nuevo Difunto
      </v-btn>
    </div>

    <v-card variant="outlined">
      <v-data-table :headers="headers" :items="store.deceasedList" :loading="store.loading">
        
        <template v-slot:item.name="{ item }">
          <DeceasedRow :item="{ name: item.name, photoURL: item.photoURL }" />
        </template>

        <template v-slot:item.deathDate="{ value }">
          <v-chip size="small" variant="outlined" color="primary">{{ value }}</v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-pencil" variant="text" color="blue" @click="openEditModal(item)"></v-btn>
          <v-btn icon="mdi-delete" variant="text" color="red" @click="deleteItem(item.id)"></v-btn>
        </template>

      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="500">
      <v-card :title="isEditing ? 'Editar Difunto' : 'Registrar Difunto'" class="pa-4">
        
        <VForm @submit="save" :validation-schema="schema" v-slot="{ errors }">
          <v-card-text class="d-flex flex-column ga-4">
            
            <Field name="name" v-slot="{ field, value }">
              <v-text-field 
                v-model="form.name"
                v-bind="field" 
                label="Nombre Completo" 
                variant="underlined"
                :error-messages="errors.name" 
              ></v-text-field>
            </Field>

            <Field name="dni" v-slot="{ field, value }">
              <v-text-field 
                v-model="form.dni"
                v-bind="field" 
                label="DNI" 
                variant="underlined"
                :error-messages="errors.dni"
              ></v-text-field>
            </Field>

            <Field name="deathDate" v-slot="{ field, value }">
              <v-text-field 
                v-model="form.deathDate"
                v-bind="field" 
                label="Fecha de Defunción" 
                type="date"
                variant="outlined"
                :error-messages="errors.deathDate"
              ></v-text-field>
            </Field>

            <Field name="birthDate" v-slot="{ field, value }">
              <v-text-field 
                v-model="form.birthDate"
                v-bind="field" 
                label="Fecha de Nacimiento" 
                type="date"
                variant="outlined"
                :error-messages="errors.birthDate"
              ></v-text-field>
            </Field>

            <Field name="guardianId" v-slot="{ field, value }">
              <v-select 
                v-model="form.guardianId"
                v-bind="field" 
                :items="guardians" 
                item-title="name" 
                item-value="id"
                label="Familiar Responsable" 
                variant="underlined"
                :loading="loadingGuardians"
                :error-messages="errors.guardianId"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" :title="item.raw.name" :subtitle="item.raw.email"></v-list-item>
                </template>
              </v-select>
            </Field>

            <Field name="biography" v-slot="{ field, value }">
              <v-textarea
                v-model="form.biography"
                v-bind="field"
                label="Biografía (Obligatoria)"
                variant="outlined"
                rows="2"
                :error-messages="errors.biography"
              ></v-textarea>
            </Field>

            <Field name="photoURL" v-slot="{ field, value }">
              <v-text-field
                v-model="form.photoURL"
                v-bind="field"
                label="URL de la Foto"
                variant="outlined"
                :error-messages="errors.photoURL"
              ></v-text-field>
            </Field>

            <Field name="epitaph" v-slot="{ field, value }">
              <v-text-field
                v-model="form.epitaph"
                v-bind="field"
                label="Epitafio"
                variant="outlined"
                :error-messages="errors.epitaph"
              ></v-text-field>
            </Field>
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
import { ref, reactive, onMounted, computed } from 'vue'
import { useMemorialStore } from '@/stores/memorialStore'
import { useAuthStore } from '@/stores/authStore'
import apiClient from '@/plugins/axios'
import Swal from 'sweetalert2'

import type { DeceasedCreate } from '@/models/Deceased'
import DeceasedRow from '@/components/admin/DeceasedRow.vue'

import { Form as VForm, Field } from 'vee-validate'
import * as yup from 'yup'

const store = useMemorialStore()
const auth = useAuthStore()

const dialog = ref(false)
const saving = ref(false)
const loadingGuardians = ref(false)
const guardians = ref<any[]>([])


const isEditing = ref(false)
const editId = ref<number | null>(null)

// Esquema de validación condicional
const schema = computed(() => {
  if (isEditing.value) {
    // Al editar, campos opcionales (solo validamos formato si se proporciona)
    return yup.object({
      name: yup.string().max(100, 'Máximo 100 caracteres'),
      dni: yup.string(),
      deathDate: yup.string()
        .test('no-future', 'La fecha no puede ser futura', value => {
          if (!value) return true
          return new Date(value) <= new Date()
        }),
      birthDate: yup.string()
        .test('no-future', 'La fecha no puede ser futura', value => {
          if (!value) return true
          return new Date(value) <= new Date()
        })
        .test('before-death', 'Debe ser anterior a la fecha de muerte', function(value) {
          const { deathDate } = this.parent
          if (!value || !deathDate) return true
          return new Date(value) < new Date(deathDate)
        }),
      guardianId: yup.number().typeError('Debe ser un número válido'),
      biography: yup.string().max(1000, 'Máximo 1000 caracteres'),
      photoURL: yup.string().url('Formato de URL inválido'),
      epitaph: yup.string().max(255, 'Máximo 255 caracteres')
    })
  }
  // Al crear, campos requeridos
  return yup.object({
    name: yup.string().required('El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
    dni: yup.string().required('DNI requerido'),
    deathDate: yup.string()
      .required('La fecha de muerte es obligatoria')
      .test('no-future', 'La fecha no puede ser futura', value => {
        return new Date(value) <= new Date()
      }),
    birthDate: yup.string()
      .required('La fecha de nacimiento es obligatoria')
      .test('no-future', 'La fecha no puede ser futura', value => {
        return new Date(value) <= new Date()
      })
      .test('before-death', 'Debe ser anterior a la fecha de muerte', function(value) {
        const { deathDate } = this.parent
        return new Date(value) < new Date(deathDate)
      }),
    guardianId: yup.number().required('Selecciona un responsable').typeError('Debes elegir un guardián'),
    biography: yup.string().required('La biografía es obligatoria').max(1000, 'Máximo 1000 caracteres'),
    photoURL: yup.string().required('La URL es obligatoria').url('Formato de URL inválido'),
    epitaph: yup.string().required('El epitafio es obligatorio').max(255, 'Máximo 255 caracteres')
  })
})

const headers = [
  { title: 'Nombre y Foto', key: 'name', align: 'start' as const }, 
  { title: 'DNI', key: 'dni', align: 'start' as const },
  { title: 'Fecha', key: 'deathDate', align: 'end' as const },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' as const }
]

// Gestión de estado con Pinia ( DeceasedCreateDTO)
// Le ponemos any para poder inyectarle el Id luego al editar sin que TypeScript se queje
const form = reactive<any>({
  name: '',
  dni: '',
  deathDate: '',
  birthDate: '',
  biography: '', 
  photoURL: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  epitaph: '',
  // Extraemos IDs del token
  funeralHomeId: auth.user?.funeralHomeId || 1, // Fallback a  para evitar error de FK si crea un Admin Global
  staffId: auth.user?.id || 0, // El StaffId es el ID del usuario logueado
  guardianId: 0
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

// limpiar o preparar el form al crear
function openCreateModal() {
  isEditing.value = false
  editId.value = null
  Object.assign(form, { 
    name: '', dni: '', deathDate: '', birthDate: '', 
    photoURL: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png', 
    guardianId: null, biography: '', epitaph: '' 
  });
  dialog.value = true
}

// rellenar los datos al editar
async function openEditModal(item: any) {
  isEditing.value = true
  editId.value = item.id
  
  try {
    // Pedimos los datos completos del difunto al backend
    const response = await apiClient.get(`/Deceased/${item.id}`)
    const data = response.data
    
    // Rellenamos el form y recortamos la hora de la fecha 
    Object.assign(form, {
      name: data.name,
      dni: data.dni,
      deathDate: data.deathDate.split('T')[0],
      birthDate: data.birthDate.split('T')[0],
      biography: data.biography,
      photoURL: data.photoURL,
      epitaph: data.epitaph,
      guardianId: data.guardianId
    })
    
    dialog.value = true
  } catch (error) {
    Swal.fire('Error', 'No se pudieron cargar los datos del difunto', 'error')
  }
}

// funcion de POST / PUT
async function save() {
  // Asegurar que los IDs del Store están presentes antes de enviar
  form.funeralHomeId = auth.user?.funeralHomeId || 1; // Fallback a 1 para Admin
  form.staffId = auth.user?.id || 0;

  saving.value = true
  try {
    // Persistencia de datos en backend
    if (isEditing.value && editId.value) {
      // Si editando,  PUT e inyectamos el ID al objeto form
      await apiClient.put(`/Deceased/${editId.value}`, { ...form, id: editId.value })
      Swal.fire({ title: '¡Actualizado!', icon: 'success', timer: 2000, showConfirmButton: false });
    } else {
      // Si no,  POST normal
      await apiClient.post('/Deceased', form)
      Swal.fire({ title: '¡Éxito!', icon: 'success', timer: 2000, showConfirmButton: false });
    }

    dialog.value = false 
    store.fetchAllDeceased() // sincronizo pinia

    // Limpieza  manteniendo  id del usuario logueado
    openCreateModal() // Llama a la función que ya limpia todo y lo deja listo
    dialog.value = false //lo cierro porque openCreateModal lo abre

  } catch (error: any) {
    if (error.response?.status === 403) {
      Swal.fire('Acceso denegado', 'No tienes permiso para modificar este difunto.', 'error')
    } else {
      Swal.fire({ title: 'Error', text: 'Revisa que todos los campos obligatorios estén llenos o el DNI no esté duplicado.', icon: 'error' });
    }
  } finally {
    saving.value = false
  }
}

//  borrar
async function deleteItem(id: number) {
  const result = await Swal.fire({
    title: '¿Eliminar difunto?',
    text: "Esta acción no se puede deshacer.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Sí, borrar'
  })

  if (result.isConfirmed) {
    try {
      await apiClient.delete(`/Deceased/${id}`)
      store.fetchAllDeceased() //sicnronizo cn tabla
      Swal.fire('Eliminado', 'El difunto ha sido borrado.', 'success')
    } catch (e: any) {
      if (e.response?.status === 403) {
        Swal.fire('Acceso denegado', 'No tienes permiso para borrar este difunto.', 'error')
      } else {
        Swal.fire('Error', 'No se pudo eliminar el registro.', 'error')
      }
    }
  }
}
</script>