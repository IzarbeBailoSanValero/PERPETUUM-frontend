<script setup lang="ts">
import type { Memory } from '@/stores/memoryStore'

const props = defineProps<{ memory: Memory }>()

const emit = defineEmits<{ delete: [memoryId: number] }>()

</script>

<template>
  <div>
    <h3><strong>Recuerdo dedicado a {{ memory.deceasedName }}</strong></h3>
    <h4>Fecha: {{ memory.createdDate }}</h4>
    <img v-if="memory.type === 'Photo' && memory.mediaURL" :src="memory.mediaURL" alt="foto subida">
    <h5 v-if="memory.textContent">{{ memory.textContent }}</h5>
    <p>Estado: {{ memory.status }}</p>

    <button @click="emit('delete', memory.id)">Borrar</button>
  </div>
</template>