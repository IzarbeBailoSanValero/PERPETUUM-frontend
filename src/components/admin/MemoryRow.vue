<template>
  <tr>
    <td>{{ memory.deceasedName || 'N/A' }}</td>
    
    <td class="text-truncate" style="max-width: 300px;">
      {{ memory.textContent || 'Sin mensaje' }}
    </td>
    
    <td>
      <v-chip size="small" :color="getTypeColor(memory.type ?? memory.Type)" variant="tonal">
        {{ formatType(memory.type ?? memory.Type) }}
      </v-chip>
    </td>
    
    <td>{{ formatDate(memory.createdDate) }}</td>
    
    <td>
      <div class="d-flex gap-2">
        <v-btn icon="mdi-check" color="success" variant="text" @click="$emit('approve', memory.id)"></v-btn>
        
        <v-btn icon="mdi-close" color="error" variant="text" @click="$emit('reject', memory.id)"></v-btn>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
// props , x donde el padre nos pasa la información del recuerdo
defineProps<{ memory: any }>()

//  le habla al "padre"
defineEmits(['approve', 'reject'])




// DISEÑO 


const formatType = (type: any) => {
  const t = type == null ? '' : String(type)
  if (t === '1' || t === 'Condolence') return 'Condolencia'
  if (t === '2' || t === 'Anecdote') return 'Anécdota'
  if (t === '3' || t === 'Photo') return 'Foto'
  return t ? 'Desconocido' : '—'
}

// Asigna color por tipo
const getTypeColor = (type: any) => {
  const t = type == null ? '' : String(type)
  if (t === '1' || t === 'Condolence') return 'indigo'
  if (t === '2' || t === 'Anecdote') return 'teal'
  if (t === '3' || t === 'Photo') return 'orange'
  return 'grey'
}


const formatDate = (date: any) => {
  if (!date) return '---'
  return new Date(date).toLocaleDateString()
}
</script>
