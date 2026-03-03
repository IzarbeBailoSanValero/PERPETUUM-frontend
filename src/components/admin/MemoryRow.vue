<template>
  <tr>
    <td>{{ memory.deceasedName || 'N/A' }}</td>
    
    <td class="text-truncate" style="max-width: 300px;">
      {{ memory.textContent || 'Sin mensaje' }}
    </td>
    
    <td>
      <v-chip size="small" :color="getTypeColor(memory.type)" variant="tonal">
        {{ formatType(memory.type) }}
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
  if (type == 1) return 'Condolencia'
  if (type == 2) return 'Anécdota'
  return 'Foto'
}

// Asigna  color por tipo
const getTypeColor = (type: any) => {
  if (type == 1) return 'indigo'
  if (type == 2) return 'teal'
  return 'orange'
}


const formatDate = (date: any) => {
  if (!date) return '---'
  return new Date(date).toLocaleDateString()
}
</script>
