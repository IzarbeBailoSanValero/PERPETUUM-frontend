<script lang="ts" setup>
import { useAuthStore } from '@/stores/authStore';
import { useMemoryStore } from '@/stores/memoryStore';
import { onMounted } from 'vue';


const memoryStore = useMemoryStore();
const authStore = useAuthStore();

const userId = authStore.userId;
const memories = memoryStore.memories;


const handleDelete = ( memoryId : number , userId : number | null) => {
    if (userId != null){
        memoryStore.deleteMemory(memoryId, userId);
    }
}


onMounted(()=>{
    if (userId != null){
        memoryStore.fetchMemoriesByUser(userId);
    }
})





</script>


<template> 
<h1>Mis recuerdos</h1>
<article>
    <ul v-for="memory in memories">
        <li>
            <h3><strong>Recuerdo dedicado a {{ memory.deceasedName }}</strong></h3>
            <h4>Fecha de realización: {{memory.createdDate}}</h4>
            <h5>{{ memory.textContent }}</h5>
            <span>Estado: {{ memory.status }}</span>
            <button @click="handleDelete( memory.id, userId)"></button>
        </li>
    </ul>
    
</article>
</template>



<styles scoped>

</styles>

