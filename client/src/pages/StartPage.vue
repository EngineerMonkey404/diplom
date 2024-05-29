<template>
  <div class="mx-[220px] my-[100px]">
    <div>
      <div class="flex justify-between items-center mb-[20px]">
        <input
          class="input-style"
          placeholder="Поиск"
          v-model="search"
        />

        <RouterLink
          v-if="cookies.get('role') === 'admin'"
          to="/admin/create-model"
        >
          Создать модель
        </RouterLink>
        <RouterLink
          v-else
          to="/admin/login"
        >
          Войти
        </RouterLink>
      </div>

      <div
        class="grid grid-cols-3"
        v-if="models.length"
      >
        <div v-for="(model, index) of models">
          <RouterLink
            :to="{ name: 'modelView', params: { id: model.id } }"
            :key="index"
            class="w-[200px] h-[200px] rounded-[16px] overflow-hidden border border-[#694DF9] p-[10px] flex flex-col gap-y-[10px]"
          >
            <span>{{ model.fileName }}</span>
            <img
              class="w-full h-full object-cover rounded-[16px]"
              :src="`http://localhost:3001/public/${model.previewImageName}`"
              alt=""
            />
          </RouterLink>
          <div
            v-if="cookies.get('role') === 'admin'"
            class="flex gap-[10px] mt-[10px]"
          >
            <RouterLink
              :to="{ name: 'updateModel', params: { id: model.id } }"
              class="link-style"
            >
              edit
            </RouterLink>
            <button
              @click="handleDelete(model.id)"
              class="btn-style"
            >
              delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { httpClient } from '../axiosInstance'
import type { Model } from '../types'
import { useCookies } from 'vue3-cookies'

const search = ref('')
const page = ref(1)

const { cookies } = useCookies()

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

async function handleDelete(id: number) {
  await httpClient.delete(`/models/${id}`)
  models.value = (
    await httpClient.get('models', {
      params: { search: search.value, page: page.value },
    })
  ).data
}
</script>

<style scoped>
.btn-style {
  @apply px-[15px] py-[5px] rounded-[16px] border border-[#694DF9] transition-colors duration-300 hover:text-[#694DF9];
}
</style>
