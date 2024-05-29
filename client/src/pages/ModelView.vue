<template>
  <div class="h-screen w-screen flex flex-col relative">
    <div class="flex w-[80%] justify-center py-[10px] gap-x-[40px]">
      <RouterLink
        class="absolute top-[10px] left-[10px]"
        to="/"
      >
        back
      </RouterLink>
      <button
        class="btn-style"
        @click="currentWindow = 'Модель'"
        :class="currentWindow === 'Модель' ? 'bg-gray-100' : ''"
      >
        Модель
      </button>
      <button
        class="btn-style"
        @click="currentWindow = 'Документация'"
        :class="currentWindow === 'Документация' ? 'bg-gray-100' : ''"
      >
        Документация
      </button>
      <RouterLink
        class="absolute top-[10px] right-[21%]"
        to="/admin/login"
      >
        Войти
      </RouterLink>
    </div>
    <div
      v-show="currentWindow === 'Модель'"
      class="flex w-[80%] h-full"
    >
      <div class="grow flex flex-col overflow-hidden">
        <canvas
          ref="canvas"
          class="grow object-cover"
        ></canvas>

        <div class="bg-white p-[10px] flex gap-[20px]">
          <button @click="clipY()">clipY</button>
          <button @click="clipX()">clipX</button>
          <button @click="clipZ()">clipZ</button>
          <button @click="resetClip()">reset clip</button>
          <button @click="resetElements()">reset choosen elements</button>
        </div>
      </div>
      <Splitter
        class="absolute right-0 top-0 h-full bg-white w-[20%] rounded-none"
        layout="vertical"
      >
        <SplitterPanel
          :size="currentDetail ? 75 : 100"
          class="p-[5px]"
        >
          <!-- <div class="text-center py-[5px]">{{ route.params.id }}</div> -->
          <MeshCollection
            :details="model?.detailsDocumentation || []"
            :collections="model?.collection || []"
            :meshes="
              myScene?.meshes.filter(mesh => mesh.name !== '__root__') || []
            "
            @change-current-detail="detailId => changeDetail(detailId)"
          />
        </SplitterPanel>
        <SplitterPanel
          v-if="currentDetail"
          :size="25"
          class="h-full overflow-auto p-[5px]"
        >
          <h3>Деталь {{ currentDetail.detailId }}</h3>

          <p class="">
            {{ currentDetail.documentation }}
          </p>
        </SplitterPanel>
      </Splitter>
    </div>

    <div
      v-if="currentWindow === 'Документация'"
      class="container mx-auto"
    >
      <p
        class="m-0"
        v-html="model?.html"
      ></p>
    </div>
  </div>
  <!-- <TabView>
    <TabPanel header="Модель"></TabPanel>
    <TabPanel header="Документация"></TabPanel>
  </TabView>
  <div class="relative h-screen w-screen"></div> -->
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onMounted } from 'vue'
import { createScene } from '../scenes/MainScene'
import { Scene, HighlightLayer } from 'babylonjs'
import { RouterLink, useRoute } from 'vue-router'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import MeshCollection from '../components/MeshCollection.vue'
import { httpClient } from '../axiosInstance'
import { Model, DetailDoc } from '../types'

const canvas = ref()
// const meshes = ref<AbstractMesh[]>([])
const myScene = ref<Scene>()
const myHl = ref<HighlightLayer>()
const route = useRoute()
const currentDetail = ref<DetailDoc | null>(null)
const model = ref<Model | null>(null)
const currentWindow = ref('Модель')

const nodes = [
  {
    name: 'Node1',
    elements: ['1', '2', '3', '4', '5'],
  },
  {
    name: 'Node2',
    elements: ['6', '7', '8', '9', '10'],
  },
  {
    name: 'Node3',
    elements: ['11', '12', '13', '14', '15'],
  },
]

onMounted(async () => {
  model.value = (await httpClient.get(`/models/${route.params.id}`)).data
  const { engine, scene, hl } = await createScene(
    canvas.value,
    model.value?.fileName || '',
  )
  myScene.value = scene
  myHl.value = hl
  //console.log(myScene.value)
})

function clipY() {
  let center = getVisibleMeshesCentroid()
  var plane = new BABYLON.Plane(0, 1, 0, -center.y) // Клиппинг-плоскость, параллельная Y (например, горизонтальное сечение)
  // plane.normalize() // Нормализуем плоскость

  // Применяем клиппинг-плоскости ко всем мешам в сцене или только к загруженным
  myScene.value?.meshes.forEach(function (mesh) {
    if (mesh.material) {
      mesh.material.clipPlane = plane
    }
  })
}

function clipX() {
  let center = getVisibleMeshesCentroid()
  var plane = new BABYLON.Plane(1, 0, 0, -center.x) // Клиппинг-плоскость, параллельная Y (например, горизонтальное сечение)

  // Применяем клиппинг-плоскости ко всем мешам в сцене или только к загруженным
  myScene.value?.meshes.forEach(function (mesh) {
    if (mesh.material) {
      mesh.material.clipPlane = plane
    }
  })
}

function clipZ() {
  let center = getVisibleMeshesCentroid()
  var plane = new BABYLON.Plane(0, 0, 1, -center.z) // Клиппинг-плоскость, параллельная Y (например, горизонтальное сечение)

  // Применяем клиппинг-плоскости ко всем мешам в сцене или только к загруженным
  myScene.value?.meshes.forEach(function (mesh) {
    if (mesh.material) {
      mesh.material.clipPlane = plane
    }
  })
}

function resetClip() {
  myScene.value?.meshes.forEach(function (mesh) {
    if (mesh.material) {
      mesh.material.clipPlane = null
    }
  })
}

function getVisibleMeshesCentroid() {
  let visibleMeshes =
    myScene.value?.meshes.filter(
      mesh => mesh.isEnabled() && mesh.name !== '__root__',
    ) || []
  let sum = new BABYLON.Vector3(0, 0, 0)
  visibleMeshes.forEach(mesh => {
    sum.addInPlace(mesh.getBoundingInfo().boundingBox.centerWorld)
  })
  return sum.scale(1 / visibleMeshes.length)
}

function resetElements() {
  resetClip()
  myScene.value?.meshes.forEach(mesh => mesh.setEnabled(true))
}

function changeDetail(detailId: string) {
  let index = model.value?.detailsDocumentation.findIndex(
    detail => detail.detailId === detailId,
  )
  if (index !== -1) {
    currentDetail.value = model.value?.detailsDocumentation[index!]!
  } else {
    currentDetail.value = null
  }
}
</script>

<style scoped></style>
