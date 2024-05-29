<template>
  <div
    v-if="currentModel"
    class="container mx-auto relative"
  >
    <RouterLink
      class="absolute top-[-6px] link-style"
      to="/"
    >
      Назад
    </RouterLink>
    <h2 class="text-center my-[30px]">Добавление модели</h2>
    <h3 class="mb-[20px]">Раздел документации</h3>
    <DocsEditor
      v-model="currentModel.html"
      content=""
    />
    <input
      @change="onSelect($event)"
      id="file-input"
      type="file"
    />
    <label for="file-input">Выбор файла</label>
    <img
      v-if="image"
      class="w-[200px] h-[200px] object-cover mt-[30px]"
      :src="image"
      alt=""
    />
    <div
      v-if="meshes.length"
      class="my-[100px]"
    >
      <button
        class="btn-style"
        @click="addDetailDoc()"
      >
        Добавить описание детали
      </button>
      <div class="grid grid-cols-2 gap-[50px] mt-[20px]">
        <div
          v-for="(detail, index) in currentModel.detailsDocumentation"
          :key="index"
          class="flex gap-x-[50px]"
        >
          <Dropdown
            v-model="detail.detailId"
            :options="meshes"
            placeholder="Выберите деталь"
            class="self-start w-[200px] border input-style !p-0"
          />
          <textarea
            v-model="detail.documentation"
            rows="5"
            cols="30"
            class="input-style"
          ></textarea>
        </div>
      </div>
    </div>

    <div
      v-if="meshes.length"
      class="mb-[100px]"
    >
      <button
        class="btn-style"
        @click="addNode()"
      >
        Добавить узел
      </button>
      <div class="grid grid-cols-2 gap-[50px] mt-[20px] mb-[40px]">
        <div
          v-for="(node, index) in currentModel.collection"
          :key="index"
          class="flex gap-x-[50px]"
        >
          <input
            class="input-style"
            type="text"
            v-model="node.title"
          />
          <MultiSelect
            v-model="node.details"
            display="chip"
            :options="meshes"
            placeholder="Выберите детали"
            class="self-start w-[200px] border input-style !p-0"
          />
        </div>
      </div>
      <div class="text-center">
        <button
          class="btn-style"
          @click="handleUpdate()"
        >
          Обновить модель
        </button>
      </div>
    </div>
  </div>
  <canvas
    ref="canvas"
    class="hidden"
  ></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DocsEditor from '../../components/DocsEditor.vue'
import { createAdminScene } from '../../scenes/AdminScene'
import { createScene } from '../../scenes/MainScene'
import { Scene } from 'babylonjs'
import Dropdown from 'primevue/dropdown'
import MultiSelect from 'primevue/multiselect'
import { httpClient } from '../../axiosInstance'
import { DetailDoc, Collection, Model } from '../../types'
import { useRouter, useRoute } from 'vue-router'

const canvas = ref(null)
const myScene = ref<Scene>()

const router = useRouter()
const route = useRoute()

const meshes = ref<string[]>([])

const image = ref('')

const model = new FormData()

const currentModel = ref<Model | null>(null)

onMounted(async () => {
  currentModel.value = (await httpClient.get(`/models/${route.params.id}`)).data
  if (canvas.value) {
    const { engine, scene } = await createScene(
      canvas.value,
      currentModel.value?.fileName || '',
    )
    myScene.value = scene
    meshes.value = myScene.value.meshes
      .map(mesh => mesh.id)
      .filter(node => node !== '__root__')
  }
})

async function onSelect(event: any) {
  if (model.has('file')) {
    model.delete('file')
  }
  console.log(event.target.files[0])
  if (canvas.value && event.target.files[0]) {
    const { engine, scene } = await createAdminScene(
      canvas.value,
      event.target.files[0],
    )
    myScene.value = scene
    meshes.value = myScene.value.meshes
      .map(mesh => mesh.id)
      .filter(node => node !== '__root__')
    model.append('file', event.target.files[0])
    scene.onReadyObservable.add(() => {
      BABYLON.Tools.CreateScreenshot(
        engine,
        scene.activeCamera,
        { precision: 1.0 },
        data => {
          image.value = data
          console.log(image.value)
          model.append(
            'image',
            dataURLtoFile(data, `${event.target.files[0].name}.png`),
          )
        },
      )
    })
  }
}

function addDetailDoc() {
  if (
    !currentModel.value?.detailsDocumentation.length ||
    currentModel.value?.detailsDocumentation.at(-1)?.detailId
  ) {
    currentModel.value?.detailsDocumentation.push({
      detailId: '',
      documentation: '',
      modelId: 0,
    })
  }
}

function addNode() {
  if (
    !currentModel.value?.collection.length ||
    currentModel.value?.collection.at(-1)?.title
  ) {
    currentModel.value?.collection.push({ title: '', details: [], modelId: 0 })
  }
}

async function handleUpdate() {
  model.append('html', currentModel.value?.html || '')
  let id = await (await httpClient.post('/models', model)).data
  let requests = currentModel.value?.detailsDocumentation.map(detail => {
    detail.modelId = id
    return httpClient.post(`/documentation/${detail.modelId}/${detail.detailId}`, detail)
  })

  let requestsCollection = currentModel.value?.collection.map(node => {
    node.modelId = id
    return httpClient.post(`/collection/${node.id}`, node)
  })
  Promise.all([...requests!, ...requestsCollection!])

  router.push('/')
}

function dataURLtoFile(dataurl: string, filename: string) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)![1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}
</script>

<style scoped>
.btn-style {
  @apply px-[15px] py-[5px] rounded-[16px] border border-[#694DF9] transition-colors duration-300 hover:text-[#694DF9];
}
</style>
