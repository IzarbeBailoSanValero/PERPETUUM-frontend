<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-5">
      <h2 class="text-h4 font-weight-bold">Gestión de Guardianes</h2>
      
      <v-btn color="indigo" prepend-icon="mdi-plus" @click="openCreateModal">
        Nuevo Familiar
      </v-btn>
    </div>

    <v-card variant="outlined" class="rounded-xl">
      <v-data-table :headers="headers" :items="guardians" :loading="loading">
        
        <template v-slot:item.name="{ item }">
          <GuardianRow :item="item" />
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-pencil" variant="text" color="blue" @click="openEditModal(item)"></v-btn>
          <v-btn icon="mdi-delete" variant="text" color="error" @click="confirmDelete(item.id)"></v-btn>
        </template>

      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="500">
      <v-card :title="isEditing ? 'Editar Guardián' : 'Registrar Guardián'" class="pa-4 rounded-lg">
        
        <VForm @submit="save" :validation-schema="schema" v-slot="{ errors }">
          <v-card-text>
            
            <Field name="name" v-slot="{ field, value }">
              <v-text-field v-bind="field" v-model="form.name" label="Nombre Completo" variant="outlined" :error-messages="errors.name" class="mb-3" />
            </Field>

            <Field name="dni" v-slot="{ field, value }">
              <v-text-field v-bind="field" v-model="form.dni" label="DNI" variant="outlined" :error-messages="errors.dni" class="mb-3" />
            </Field>

            <Field name="email" v-slot="{ field, value }">
              <v-text-field v-bind="field" v-model="form.email" label="Correo Electrónico" variant="outlined" :error-messages="errors.email" class="mb-3" />
            </Field>

            <Field name="phone" v-slot="{ field, value }">
              <v-text-field v-bind="field" v-model="form.phoneNumber" label="Teléfono" variant="outlined" :error-messages="errors.phone" class="mb-3" />
            </Field>

            <Field v-if="!isEditing" name="password" v-slot="{ field, value }">
              <v-text-field v-bind="field" v-model="form.password" label="Contraseña" type="password" variant="outlined" :error-messages="errors.password" class="mb-3" />
            </Field>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
            <v-btn color="indigo" type="submit" :loading="saving">Guardar</v-btn>
          </v-card-actions>
        </VForm>

      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed} from 'vue'
import apiClient from '@/plugins/axios' // inyecta el token JWT 
import Swal from 'sweetalert2' 
import { useAuthStore } from '@/stores/authStore' // extraer ID de usuario actual
import GuardianRow from '@/components/admin/GuardianRow.vue' 

import { Form as VForm, Field } from 'vee-validate'
import * as yup from 'yup'


//  INTERFACES 
interface Guardian {
  id: number;
  name: string;
  dni: string;
  email: string;
  phoneNumber: string;
  funeralHomeId: number | null;
}
//REACTIVO
const auth = useAuthStore() // datos del usuario logueado
const dialog = ref(false) // visibilidad del modal
const loading = ref(false) // spinner tabla
const saving = ref(false) // spinner  botón de guardar
const guardians = ref<Guardian[]>([]) //  datos para enviar al backend

// Controladores de modo Edición
const isEditing = ref(false) // false ->Crear true -> Editar
const editId = ref<number | null>(null) // id de elemento que estamos editando


// CONFIGURACIÓN DE TABLA + FORMULARIO
const headers = [
  { title: 'Familiar', key: 'name' },
  { title: 'Teléfono', key: 'phoneNumber' },
  { title: 'Acciones', key: 'actions', align: 'end' as const, sortable: false }
]

// Objeto reactivo enlazado a los inputs x v-model
const form = reactive<any>({
  name: '',
  dni: '',
  email: '',
  phoneNumber: '',
  password: '',
  funeralHomeId: auth.user?.funeralHomeId || 1,   //  familiar pertenece a la misma funeraria que el empleado que lo crea
  staffId: auth.user?.id || 0
})

// VALIDACIÓN
const schema = computed(() => {
  if (isEditing.value) {
    // Al editar, campos opcionales
    return yup.object({
      name: yup.string().min(3, 'Nombre demasiado corto'),
      dni: yup.string(),
      email: yup.string().email('Email inválido'),
      phone: yup.string(),
      password: yup.string().nullable()
    })
  }
  // Al crear, campos requeridos
  return yup.object({
    name: yup.string().required('Nombre obligatorio').min(3, 'Nombre demasiado corto'),
    dni: yup.string().required('DNI obligatorio'),
    email: yup.string().email('Email inválido').required('Email obligatorio'),
    phone: yup.string().required('Teléfono obligatorio'),
    password: yup.string().required('Contraseña obligatoria').min(6, 'Mínimo 6 caracteres')
  })
})



// CRUD


// GET: lista de guardianes 
async function fetchGuardians() {
  loading.value = true
  try {
    const response = await apiClient.get('/MemorialGuardian')
    guardians.value = response.data
  } finally { loading.value = false }
}

// preparo crear: Limpia  formulario y abre modal
function openCreateModal() {
  isEditing.value = false
  editId.value = null
  Object.assign(form, { name: '', dni: '', email: '', phoneNumber: '', password: '' })
  dialog.value = true
}

// preparo editar: vuelca los datos de la fila seleccionada en el formulario
function openEditModal(item: any) {
  isEditing.value = true
  editId.value = item.id
  Object.assign(form, { 
    name: item.name, 
    dni: item.dni, 
    email: item.email, 
    phoneNumber: item.phoneNumber,
    password: '' // por seguridad vacía
  })
  dialog.value = true
}

// GUARDAR POST / PUT
async function save(values: any, { resetForm }: any) {
  saving.value = true
  try {
    if (isEditing.value && editId.value) {
      // MODO EDICIÓN PUT - Enviar solo campos con valor
      const updateData: any = { id: editId.value }
      if (form.name) updateData.name = form.name
      if (form.dni) updateData.dni = form.dni
      if (form.email) updateData.email = form.email
      if (form.phoneNumber) updateData.phoneNumber = form.phoneNumber
      
      await apiClient.put(`/MemorialGuardian/${editId.value}`, updateData)
      Swal.fire({ title: '¡Actualizado!', icon: 'success', timer: 1500, showConfirmButton: false })
    } else {
      // MODO CREACIÓN POST
      await apiClient.post('/MemorialGuardian', form)
      Swal.fire({ title: '¡Creado!', icon: 'success', timer: 1500, showConfirmButton: false })
    }
    
    // cerramos modal y recargamos la lista
    dialog.value = false
    fetchGuardians()
  } catch (error: any) {
    console.error('Error al guardar:', error.response?.data || error)
    const errorMsg = error.response?.data?.message || error.response?.data || 'Revisa los datos, puede que el Email o DNI ya existan.'
    Swal.fire('Error', errorMsg, 'error')
  } finally { saving.value = false }
}

// DELETE ->Alerta antes 
async function confirmDelete(id: number) {
  const result = await Swal.fire({
    title: '¿Eliminar familiar?',
    text: "Esto puede afectar a los difuntos asignados",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Sí, borrar'
  })

  if (result.isConfirmed) {
    try {
      await apiClient.delete(`/MemorialGuardian/${id}`)
      fetchGuardians() // Recargamos para ver el borrado
      Swal.fire('Eliminado', '', 'success')
    } catch (e) {
      Swal.fire('Error', 'No se puede eliminar porque tiene difuntos a su cargo', 'error')
    }
  }
}



//AL CREAR COMPONENTE
// Al montar el componente en la pantalla, pedimos los datos inmediatamente
onMounted(() => {
  fetchGuardians()
})
</script>