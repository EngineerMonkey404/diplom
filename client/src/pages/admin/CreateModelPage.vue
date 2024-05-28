<template>
  <div class="container mx-auto">
    <h2 class="text-center my-[30px]">Добавление модели</h2>
    <h3 class="mb-[20px]">Раздел документации</h3>
    <DocsEditor />

    <FileUpload
      mode="advanced"
      :showUploadButton="false"
      :showCancelButton="false"
      chooseLabel="Выберите файл"
      @select="onSelect"
    />
    <img
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
      {{ nodes }}
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
import { FileUploadSelectEvent } from 'primevue/fileupload'
import { createScene } from '../../scenes/AdminScene'
import { Scene } from 'babylonjs'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import MultiSelect from 'primevue/multiselect'
import InputText from 'primevue/inputtext'

const canvas = ref(null)
const myScene = ref<Scene>()

const details = ref<{ detailId: string; documentation: string }[]>([])

const meshes = ref<string[]>([])

const nodes = ref<{ title: string; details: string[] }[]>([])

const image = ref('')

async function onSelect(event: FileUploadSelectEvent) {
  console.log(event.files[0])
  if (canvas.value && event.files[0]) {
    const { engine, scene } = await createScene(canvas.value, event.files[0])
    myScene.value = scene
    console.log(myScene.value.meshes)
    meshes.value = myScene.value.meshes
      .map(mesh => mesh.id)
      .filter(node => node !== '__root__')

    scene.onReadyObservable.add(() => {
      BABYLON.Tools.CreateScreenshot(engine, scene.activeCamera, { precision: 1.0 }, (data) => {
        image.value = data
      })
    })
  }
}

function addDetailDoc() {
  if (!details.value.length || details.value.at(-1)?.detailId) {
    details.value.push({ detailId: '', documentation: '' })
  }
}

function addNode() {
  if (!nodes.value.length || nodes.value.at(-1)?.title) {
    nodes.value.push({ title: '', details: [] })
  }
}
</script>
