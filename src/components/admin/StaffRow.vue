<template>
  <div class="d-flex align-center py-2">
    <v-avatar color="blue-grey-lighten-2" size="40" class="mr-3">
      <v-icon color="blue-grey" :icon="(item.isAdmin || !item.funeralHomeId) ? 'mdi-shield-crown' : 'mdi-account-hard-hat'"></v-icon>
    </v-avatar>
    
    <div>
      <div class="text-subtitle-1 font-weight-bold">{{ item.name }}</div>
      <div class="text-caption text-grey">
        <v-icon size="12" class="mr-1">mdi-email</v-icon>{{ item.email }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  item: {
    id: number;
    name: string;
    email: string;
    dni?: string;
    funeralHomeId: number | null;
    isAdmin?: boolean;
  }
}>()
</script>
