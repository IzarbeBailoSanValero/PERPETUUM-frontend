
    <!--  Listado y creación de Familiares/Guardianes -->
<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-5">
      <h2 class="text-h4">Gestión de Guardianes</h2>
      <v-btn color="indigo" prepend-icon="mdi-plus" @click="dialog = true">
        Nuevo Familiar
      </v-btn>
    </div>

    <v-card variant="outlined">
      <v-data-table :headers="headers" :items="guardians" :loading="loading">
        <template v-slot:item.name="{ item }">
          <GuardianRow :item="item" />
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-delete" variant="text" color="error" @click="confirmDelete(item.id)"></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="500">
      <v-card title="Registrar Guardián" class="pa-4">
        <VForm @submit="save" :validation-schema="schema" v-slot="{ errors }">
          <v-card-text>
            <Field name="name" v-model="form.name" v-slot="{ field }">
              <v-text-field v-bind="field" label="Nombre Completo" variant="underlined" :error-messages="errors.name" />
            </Field>

            <Field name="email" v-model="form.email" v-slot="{ field }">
              <v-text-field v-bind="field" label="Correo Electrónico" variant="underlined" :error-messages="errors.email" />
            </Field>

            <Field name="phone" v-model="form.phone" v-slot="{ field }">
              <v-text-field v-bind="field" label="Teléfono" variant="underlined" :error-messages="errors.phone" />
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
import { ref, reactive, onMounted } from 'vue'
import apiClient from '@/plugins/axios'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/authStore'
import GuardianRow from '@/components/admin/GuardianRow.vue'
import { Form as VForm, Field } from 'vee-validate'
import * as yup from 'yup'

const auth = useAuthStore()
const dialog = ref(false)
const loading = ref(false)
const saving = ref(false)
const guardians = ref([])

// Esquema de validación Yup
const schema = yup.object({
  name: yup.string().required('Nombre obligatorio').min(3, 'Nombre demasiado corto'),
  email: yup.string().email('Email inválido').required('Email obligatorio'),
  phone: yup.string().required('Teléfono obligatorio')
})

const headers = [
  { title: 'Familiar', key: 'name' },
  { title: 'Teléfono', key: 'phone' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

const form = reactive({
  name: '',
  email: '',
  phone: '',
  funeralHomeId: auth.user?.funeralHomeId || null
})

async function fetchGuardians() {
  loading.value = true
  try {
    const response = await apiClient.get('/MemorialGuardian')
    guardians.value = response.data
  } finally { loading.value = false }
}

async function save() {
  saving.value = true
  try {
    await apiClient.post('/MemorialGuardian', form)
    dialog.value = false
    fetchGuardians()
    Object.assign(form, { name: '', email: '', phone: '' })
    Swal.fire({ title: '¡Listo!', icon: 'success', timer: 1500, showConfirmButton: false })
  } catch (error) {
    Swal.fire('Error', 'No se pudo registrar al guardián', 'error')
  } finally { saving.value = false }
}

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
      fetchGuardians()
      Swal.fire('Eliminado', '', 'success')
    } catch (e) {
      Swal.fire('Error', 'No se puede eliminar porque tiene difuntos a su cargo', 'error')
    }
  }
}

onMounted(fetchGuardians)
</script>