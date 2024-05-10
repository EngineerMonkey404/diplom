
<template>
<!-- <label>Добавить новую модель</label>
<input type=file id="addFile" @change="handleFileChange"> -->
<input placeholder="Поиск" v-model="search">
<div>{{ search }}</div>
<template v-if="models.length">
    <RouterLink v-for="model of models" :to="{name:'modelView', params: {filename: model.fileName}}" class="block">{{ model.fileName }}</RouterLink>
</template>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { httpClient } from '../axiosInstance';

const search = ref('')
const page = ref(1)

const formData = new FormData()
const models = ref([])

// async function handleFileChange(event: Event){

onMounted(async () => {
    models.value = (await httpClient.get("models", {params: {search: search.value, page: page.value}})).data
    console.log(models.value)
})

</script>

<style scoped>
</style>