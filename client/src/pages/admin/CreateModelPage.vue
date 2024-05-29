<template>
  <div class="container mx-auto">
    <h2 class="text-center my-[30px]">Добавление модели</h2>
    <h3 class="mb-[20px]">Раздел документации</h3>
    <DocsEditor v-model="documentation"/>
    {{ documentation }}
    <!-- <FileUpload
      mode="advanced"
      :showUploadButton="false"
      :showCancelButton="false"
      chooseLabel="Выберите файл"
      @select="onSelect"
    /> -->
    <input @change="onSelect($event)" id="file-input" type="file"/>
    <label for="file-input">Выбор файла</label>
    <img
      v-if="image"
      class="w-[100px] h-[100px] object-cover"
      :src="image"
      alt=""
    />
    <div
      v-if="meshes.length"
      class="my-[100px]"
    >
      <button @click="addDetailDoc()">Добавить описание детали</button>
      <div
        v-for="(detail, index) in details"
        :key="index"
        class="flex gap-x-[50px]"
      >
        <Dropdown
          v-model="detail.detailId"
          :options="meshes"
          placeholder="Выберите деталь"
          class="self-start"
        />
        <Textarea
          v-model="detail.documentation"
          rows="5"
          cols="30"
        />
      </div>
    </div>

    <div
      v-if="meshes.length"
      class="mb-[100px]"
    >
      <button @click="addNode()">Добавить узел</button>
      <div
        v-for="(node, index) in nodes"
        :key="index"
        class="flex gap-x-[50px]"
      >
        <InputText
          type="text"
          v-model="node.title"
        />
        <MultiSelect
          v-model="node.details"
          display="chip"
          :options="meshes"
          placeholder="Выберите детали"
        />
      </div>
      <button @click="handleCreate()">Создать модель</button>
    </div>
  </div>
  <canvas
    ref="canvas"
    class="hidden"
  ></canvas>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DocsEditor from '../../components/DocsEditor.vue'
import FileUpload from 'primevue/fileupload'
// import { FileUploadSelectEvent } from 'primevue/fileupload'
import { createScene } from '../../scenes/AdminScene'
import { Scene } from 'babylonjs'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import MultiSelect from 'primevue/multiselect'
import InputText from 'primevue/inputtext'
import { httpClient } from '../../axiosInstance'
import { DetailDoc, Collection } from '../../types'

const canvas = ref(null)
const myScene = ref<Scene>()

const details = ref<DetailDoc[]>([])

const meshes = ref<string[]>([])

const nodes = ref<Collection[]>([])

const image = ref('')
const documentation = ref('')

const model = new FormData()

async function onSelect(event: any) {
  console.log(event.target.files[0])
  if (canvas.value && event.target.files[0]) {
    const { engine, scene } = await createScene(canvas.value, event.target.files[0])
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
          model.append('image', dataURLtoFile(data, `${event.target.files[0].name}.png` ))
        },
      )

    })
  
  }
}

function addDetailDoc() {
  if (!details.value.length || details.value.at(-1)?.detailId) {
    details.value.push({ detailId: '', documentation: '', modelId: 0 })
  }
}

function addNode() {
  if (!nodes.value.length || nodes.value.at(-1)?.title) {
    nodes.value.push({ title: '', details: [], modelId: 0, })
  }
}

async function handleCreate() {
  model.append('html', documentation.value)
  let id = await (await httpClient.post('/models', model)).data
  console.log(id)
  let requests = details.value.map(detail => {
    detail.modelId = id
    return httpClient.post('/documentation', detail)
  })

  let requestsCollection = nodes.value.map(node => {
    node.modelId = id
    return httpClient.post('/collection', node)
  })
  Promise.all([...requests, ...requestsCollection])
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
