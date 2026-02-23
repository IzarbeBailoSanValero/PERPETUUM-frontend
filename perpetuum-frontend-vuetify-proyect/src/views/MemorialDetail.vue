<template>
  <div>
    <h1>Memorial Detail</h1>
    <p>Memorial ID: {{ id }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string
}>()
</script>
