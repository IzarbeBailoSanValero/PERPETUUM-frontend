<script lang="ts" setup>
import { useAuthStore } from '@/stores/authStore';
import { useMemoryStore } from '@/stores/memoryStore';
import { onMounted } from 'vue';


const memoryStore = useMemoryStore();
const authStore = useAuthStore();




const handleDelete = ( memoryId : number ) => {
        console.log('handleDelete llamado', memoryId)
    if (authStore.userId != null){
        memoryStore.deleteMemory(memoryId, authStore.userId );
    }
}


onMounted(()=>{
    if (authStore.userId != null){
        memoryStore.fetchMemoriesByUser(authStore.userId);
    }
})

</script>


<template> 
<h1>Mis recuerdos</h1>
<article>
    <ul>
        <li v-for="memory in memoryStore.memories" :key="memory.id">
            <h3><strong>Recuerdo dedicado a {{ memory.deceasedName }}</strong></h3>
            <h4>Fecha de realización: {{memory.createdDate}}</h4>

            <img v-if="memory.type === 'Photo' && memory.mediaURL" :src="memory.mediaURL" alt = "foto subida">

            <h5 v-if="memory.textContent">{{ memory.textContent }}</h5>
            <p>Estado: {{ memory.status }}</p>
            <button @click="handleDelete( memory.id)">Borrar</button>
        </li>
    </ul>
    
</article>
</template>



<style scoped>
    img{
        max-width:300px;
        height:auto;
    }
</style>

