<template>
  <!-- <label>Добавить новую модель</label>
<input type=file id="addFile" @change="handleFileChange"> -->
  <input
    placeholder="Поиск"
    v-model="search"
  />
  <div>{{ search }}</div>
  <template v-if="models.length">
    <div
      v-for="(model, index) of models"
      :key="index"
    >
      <RouterLink
        :to="{ name: 'modelView', params: { id: model.id } }"
        class="block"
      >
        {{ model.fileName }}
      </RouterLink>
      <img
        class="w-[150px] h-[150px] object-cover"
        :src="`http://localhost:3001/public/${model.previewImageName}`"
        alt=""
      />
    </div>
  </template>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { httpClient } from '../axiosInstance'
import type { Model } from '../types';

const search = ref('')
const page = ref(1)

const models = ref<Model[] | []>([])

// async function handleFileChange(event: Event){

onMounted(async () => {
  models.value = (
    await httpClient.get('models', {
      params: { search: search.value, page: page.value },
    })
  ).data
  console.log(models.value)
})
</script>

<style scoped></style>
