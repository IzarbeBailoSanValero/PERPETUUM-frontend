<template><!-- Modal para crear una nueva condolencia/foto -->
  <v-dialog v-model="dialog" max-width="500"> <!--pongo un modal para añadir contenido sin cmabiar de pagina-->
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="primary" prepend-icon="mdi-plus">
        Añadir Recuerdo
      </v-btn>
    </template>

    <v-card class="pa-4">
      <v-card-title>Nuevo Recuerdo</v-card-title>

      <v-card-text> <!--https://vuetifyjs.com/en/components/selects/#usage-->
        <v-select v-model="selectedTypeText" label="¿Qué quieres compartir?"
          :items="['Condolencia', 'Anécdota', 'Foto']" variant="underlined"></v-select>

        <v-text-field v-model="form.authorRelation" label="Tu relación (ej: Nieto)" variant="underlined"></v-text-field>

        <v-textarea v-model="form.textContent" label="Tu mensaje" variant="underlined"></v-textarea>

        <v-file-input
          v-if="selectedTypeText === 'Foto'"
          v-model="photoInput"
          label="Sube una imagen"
          variant="underlined"
          accept="image/*"
          :multiple="false"
          prepend-icon="mdi-camera"
          show-size
        ></v-file-input>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="dialog = false">Cerrar</v-btn>
        <v-btn color="primary" @click="sendToApi" :loading="loading">Enviar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import apiClient from '@/plugins/axios'
import { useUiStore } from '@/stores/uiStore'


const ui = useUiStore()

const props = defineProps<{ deceasedId: number }>()
const emit = defineEmits(['success'])

const dialog = ref(false)
const loading = ref(false)
const selectedTypeText = ref('Condolencia') // Texto para el v-select
const photoInput = ref<File[] | File | null>(null)

// Objeto que coincide con MemoryCreateDTO de C#
const form = reactive({
  deceasedId: props.deceasedId,
  type: 1,
  textContent: '',
  mediaURL: '',
  authorRelation: ''
})

async function sendToApi() {
  loading.value = true

  // Convertimos el texto del selector al número que espera tu DTO
  if (selectedTypeText.value === 'Condolencia') form.type = 1
  if (selectedTypeText.value === 'Anécdota') form.type = 2
  if (selectedTypeText.value === 'Foto') form.type = 3

  try {
    if (form.type === 3) {
      const file = Array.isArray(photoInput.value) ? photoInput.value[0] : photoInput.value
      if (!file) {
        ui.notify('Selecciona una imagen antes de enviar.', 'error')
        return
      }

      const fd = new FormData()
      fd.append('DeceasedId', String(form.deceasedId))
      fd.append('Type', '3')
      fd.append('TextContent', form.textContent || '')
      fd.append('AuthorRelation', form.authorRelation || '')
      fd.append('Photo', file)

      // POST /api/Memory/photo (multipart/form-data) -> backend -> Cloudinary
      await apiClient.post('/Memory/photo', fd)
    } else {
      // POST /api/Memory enviando el MemoryCreateDTO (JSON)
      await apiClient.post('/Memory', form)
    }

    dialog.value = false
    emit('success') // Refrescamos la lista de la página

    // ui.notify es el método en el uiStore con SweetAlert2
    ui.notify('Recuerdo enviado. Aparecerá cuando el familiar lo apruebe', 'success')

    // Limpiamos
    form.textContent = ''
    form.mediaURL = ''
    photoInput.value = null
  } catch (error: any) {
    if (error.response?.status === 401) {
      ui.notify('Necesitas iniciar sesión para publicar un recuerdo.', 'error')
    } else if (error.response?.status === 403) {
      ui.notify('Tu perfil no tiene permiso para publicar recuerdos.', 'error')
    } else if (error.response?.status === 500) {
      ui.notify('Error del servidor al guardar el recuerdo. Comprueba que estás logueado y que tu usuario puede publicar recuerdos.', 'error')
    } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      ui.notify('No se pudo conectar con el servidor. Comprueba que la API está en marcha (puerto 8080).', 'error')
    } else {
      ui.notify('Revisa los datos o intenta de nuevo más tarde.', 'error')
    }
  }
  finally { loading.value = false }
}

/*
Apuntes: 
    1 Captura: El v-model captura los datos en el objeto reactive.
    2 Persistencia: Axios envía el MemoryCreateDTO al [HttpPost] de C#.
    3 Sincronización: Al recibir 200, el componente emite un evento al padre.
    4 Reactividad: El padre vuelve a ejecutar el GET, Pinia actualiza el state, y Vue repinta la lista de recuerdos automáticamente.
*/
</script>
