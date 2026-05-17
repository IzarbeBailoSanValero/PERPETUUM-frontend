<script lang="ts" setup>
import { useAuthStore } from '@/stores/authStore';
import { useMemoryStore } from '@/stores/memoryStore';
import { onMounted } from 'vue';
import MyMemoryCard from '@/components/user/MyMemoryCard.vue';

const memoryStore = useMemoryStore();
const authStore = useAuthStore();




const handleDelete = (memoryId: number) => {
    if (authStore.userId != null) {
        memoryStore.deleteMemory(memoryId, authStore.userId);
    }
}


onMounted(() => {
    if (authStore.userId != null) {
        memoryStore.fetchMemoriesByUser(authStore.userId);
    }
})

</script>


<template>
    <h1>Mis recuerdos</h1>
    <article>

        <p v-if="memoryStore.loading">{{ $t('myMemories.title') }}</p>
        <p v-else-if="memoryStore.memories.length === 0">{{ $t('myMemories.loading') }}</p>
        <ul v-else>
            <li v-for="memory in memoryStore.memories" :key="memory.id">
                <MyMemoryCard @delete="handleDelete" :memory="memory"></MyMemoryCard>
            </li>
        </ul>

    </article>
</template>



<style scoped>
img {
    max-width: 300px;
    height: auto;
}
</style>
