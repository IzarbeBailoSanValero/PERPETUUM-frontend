<script setup lang="ts">
import type { Memory } from '@/stores/memoryStore'

const props = defineProps<{ memory: Memory }>()

const emit = defineEmits<{ delete: [memoryId: number] }>()

const dateFormatted = new Date(props.memory.createdDate).toLocaleDateString('es-ES')


</script>

<template>
  <div>
    <h3><strong>{{ $t('myMemories.dedicatedTo') }} {{ memory.deceasedName }}</strong></h3>
    <h4>{{ $t('myMemories.writtenOn') }} {{dateFormatted}}</h4>
    <img v-if="memory.type === 'Photo' && memory.mediaURL" :src="memory.mediaURL" alt="foto subida">
    <h5 v-if="memory.textContent">{{ memory.textContent }}</h5>
    <p>{{ $t('myMemories.status') }}: {{ memory.status }}</p>

    <button @click="emit('delete', memory.id)">{{ $t('myMemories.deleteBtn') }}</button>
  </div>
</template>