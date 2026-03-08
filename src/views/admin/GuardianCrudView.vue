```vue
<template>
  <v-container>

    <div class="d-flex justify-space-between align-center flex-wrap ga-3 mb-4">
      <h2 class="text-h4 font-weight-bold">Gestión de Guardianes</h2>

      <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateModal">
        Nuevo Familiar
      </v-btn>
    </div>

    <v-card variant="outlined" class="rounded-xl">

      <v-data-table
        :headers="headers"
        :items="guardians"
        :loading="loading"
      >

        <template #item.actions="{ item }">
          <v-btn icon="mdi-pencil" variant="text" color="primary" @click="openEditModal(item)" />
          <v-btn icon="mdi-delete" variant="text" color="error" @click="confirmDelete(item.id)" />
        </template>

      </v-data-table>

    </v-card>

    <!-- MODAL -->
    <v-dialog v-model="dialog" max-width="500">

      <v-card
        :title="isEditing ? 'Editar Guardián' : 'Crear Guardián'"
        class="pa-4 rounded-lg"
      >

        <v-card-text>

          <v-text-field
            v-model="form.name"
            label="Nombre"
            variant="outlined"
            class="mb-3"
          />

          <v-text-field
            v-model="form.dni"
            label="DNI"
            variant="outlined"
            class="mb-3"
          />

          <v-text-field
            v-model="form.email"
            label="Email"
            variant="outlined"
            class="mb-3"
          />

          <v-text-field
            v-model="form.phoneNumber"
            label="Teléfono"
            variant="outlined"
            class="mb-3"
          />

          <v-text-field
            v-if="!isEditing"
            v-model="form.password"
            label="Contraseña"
            type="password"
            variant="outlined"
          />

        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">
            Cancelar
          </v-btn>
          <v-btn color="primary" @click="save" :loading="saving">
            Guardar
          </v-btn>
        </v-card-actions>

      </v-card>

    </v-dialog>

  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import apiClient from '@/plugins/axios'
import Swal from 'sweetalert2'

interface Guardian {
  id: number
  name: string
  dni: string
  email: string
  phoneNumber: string
}

const guardians = ref<Guardian[]>([])
const loading = ref(false)

const dialog = ref(false)
const saving = ref(false)

const isEditing = ref(false)
const editId = ref<number | null>(null)

/* HEADERS TIPADOS PARA VUETIFY 3 */
const headers = [
  { title: 'Nombre', key: 'name' },
  { title: 'Teléfono', key: 'phoneNumber' },
  { title: 'Acciones', key: 'actions', align: 'end' as const, sortable: false }
]

const form = reactive({
  name: '',
  dni: '',
  email: '',
  phoneNumber: '',
  password: ''
})

function resetForm() {
  form.name = ''
  form.dni = ''
  form.email = ''
  form.phoneNumber = ''
  form.password = ''
}

function openCreateModal() {
  resetForm()
  isEditing.value = false
  dialog.value = true
}

function openEditModal(item: Guardian) {
  isEditing.value = true
  editId.value = item.id

  form.name = item.name
  form.dni = item.dni
  form.email = item.email
  form.phoneNumber = item.phoneNumber
  form.password = ''

  dialog.value = true
}

async function fetchGuardians() {
  loading.value = true

  try {
    const res = await apiClient.get('/MemorialGuardian')
    guardians.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function save() {
  saving.value = true

  try {

    if (isEditing.value && editId.value) {

      await apiClient.put(`/MemorialGuardian/${editId.value}`, form)

      Swal.fire('Actualizado', '', 'success')

    } else {

      await apiClient.post('/MemorialGuardian', form)

      Swal.fire('Creado', '', 'success')

    }

    dialog.value = false
    fetchGuardians()

  } catch (err) {

    console.error(err)
    Swal.fire('Error', 'No se pudo guardar', 'error')

  } finally {
    saving.value = false
  }
}

async function confirmDelete(id: number) {

  const result = await Swal.fire({
    title: '¿Eliminar guardián?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33'
  })

  if (!result.isConfirmed) return

  try {

    await apiClient.delete(`/MemorialGuardian/${id}`)

    fetchGuardians()

    Swal.fire('Eliminado', '', 'success')

  } catch {

    Swal.fire('Error', 'No se pudo eliminar', 'error')

  }
}

onMounted(fetchGuardians)
</script>
```
