<template>
  <TabView class="h-screen w-screen">
    <TabPanel header="Модель">
      <div>
        <canvas
          ref="canvas"
          class="w-[90%] h-[94.8vh]"
        ></canvas>
        <Splitter
          class="absolute right-0 top-0 bg-white w-[20%] h-full rounded-none"
          layout="vertical"
        >
          <SplitterPanel
            :size="currentDetail ? 75 : 100"
            class="flex flex-col"
          >
            <div class="text-center py-[5px]">{{ route.params.id }}</div>
            <ul class="overflow-auto">
              <li
                @click="handleClick(mesh.name)"
                v-for="mesh in myScene?.meshes"
                class="px-[5px] cursor-pointer hover:bg-gray-200"
                :class="currentMeshes.includes(mesh.name) ? 'bg-gray-100' : ''"
              >
                {{ mesh.name }}
              </li>
            </ul>
          </SplitterPanel>
          <SplitterPanel
            v-if="currentMeshes.at(-1)"
            :size="25"
            class="h-full overflow-auto p-[5px]"
          >
            <h3>Деталь {{ currentMeshes.at(-1) }}</h3>

            <p class="">
              Здесь будет описание детали Здесь будет описание детали Здесь
              будет описание детали Здесь будет описание детали Здесь будет
              описание детали Здесь будет описание детали Здесь будет описание
              деталиЗдесь будет описание детали Здесь будет описание детали
            </p>
          </SplitterPanel>
        </Splitter>
        <!-- <div
        class="absolute right-0 top-0 bg-white bg-opacity-[60%] py-5 px-5 w-[20%] overflow-auto h-full"
      >
        <div>{{ route.params.id }}</div>
        <div
          @click="handleClick(mesh)"
          v-for="mesh in myScene?.meshes"
        >
          {{ mesh.name }}
        </div>
        <div v-if="currentDetail">
          <h3>Деталь {{ currentDetail }}</h3>
  
          <p>Здесь будет описание детали</p>
        </div>
      </div> -->
        <div
          class="absolute bottom-0 left-0 w-[80%] bg-white p-[10px] flex gap-[20px]"
        >
          <button @click="clipY()">clipY</button>
          <button @click="clipX()">clipX</button>
          <button @click="clipZ()">clipZ</button>
          <button @click="resetClip()">reset clip</button>
        </div>
      </div>
    </TabPanel>
    <TabPanel header="Документация">
      <p class="m-0">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
        illo inventore veritatis et quasi architecto beatae vitae dicta sunt
        explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
        odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
        voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non
        numquam eius modi.
      </p>
    </TabPanel>
  </TabView>
  <!-- <div class="relative h-screen w-screen"></div> -->
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onMounted } from 'vue'
import { createScene } from '../scenes/MainScene'
import { AbstractMesh } from 'babylonjs/Meshes/abstractMesh'
import { Scene, HighlightLayer } from 'babylonjs'
import { useRoute } from 'vue-router'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

const canvas = ref()
// const meshes = ref<AbstractMesh[]>([])
const myScene = ref<Scene>()
const myHl = ref<HighlightLayer>()
const route = useRoute()
const currentDetail = ref('')
const currentMeshes = ref<string[]>([])

onMounted(async () => {
  const { engine, scene, hl } = await createScene(canvas.value, route.params.id)
  myScene.value = scene
  myHl.value = hl
  //console.log(myScene.value)
})

function handleClick(meshName: string) {
  let index = currentMeshes.value.findIndex(mesh => mesh === meshName)
  if (index === -1) {
    currentMeshes.value.push(meshName)
  } else {
    currentMeshes.value.splice(index, 1)
  }
  myScene.value?.meshes.forEach(mesh => {
    if (mesh.name !== '__root__') {
      if (!currentMeshes.value.includes(mesh.name)) {
        mesh.setEnabled(false)
      } else {
        mesh.setEnabled(true)
      }
    }
  })
  // mesh.position.x += 0.1
  // myHl.value?.removeAllMeshes()
  // myHl.value?.addMesh(mesh, BABYLON.Color3.Green())
  //console.log(mesh.name)
  currentDetail.value = meshName
}

function clipY() {
  var plane = new BABYLON.Plane(0, 1, 0, 0) // Клиппинг-плоскость, параллельная Y (например, горизонтальное сечение)
  plane.normalize() // Нормализуем плоскость

  // Применяем клиппинг-плоскости ко всем мешам в сцене или только к загруженным
  myScene.value?.meshes.forEach(function (mesh) {
    if (mesh.material) {
      mesh.material.clipPlane = plane
    }
  })
}

function clipX() {
  var plane = new BABYLON.Plane(1, 0, 0, 0) // Клиппинг-плоскость, параллельная Y (например, горизонтальное сечение)
  plane.normalize() // Нормализуем плоскость

  // Применяем клиппинг-плоскости ко всем мешам в сцене или только к загруженным
  myScene.value?.meshes.forEach(function (mesh) {
    if (mesh.material) {
      mesh.material.clipPlane = plane
    }
  })
}

function clipZ() {
  if (currentMeshes.value.length) {
    let coordinatesZ = myScene.value?.meshes.map(mesh => {
      if (currentMeshes.value.includes(mesh.name)) {
        console.log(mesh.position.z)
        return mesh.position.z
      }
    }) || [0]
    let minZ = Math.min(...coordinatesZ)
    let maxZ = Math.max(...coordinatesZ)
    let coordinatesY = myScene.value?.meshes.map(mesh => {
      if (currentMeshes.value.includes(mesh.name)) {
        console.log(mesh.position.y)
        return mesh.position.y
      }
    }) || [0]
    let minY = Math.min(...coordinatesY)
    let maxY = Math.max(...coordinatesY)
    let coordinatesX = myScene.value?.meshes.map(mesh => {
      if (currentMeshes.value.includes(mesh.name)) {
        console.log(mesh.position.x)
        return mesh.position.x
      }
    }) || [0]
    let minX = Math.min(...coordinatesX)
    let maxX = Math.max(...coordinatesX)
    var plane = new BABYLON.Plane(
      coordinatesX.length > 1 ? (maxX + minX) / 2 : maxX / 2,
      coordinatesY.length > 1 ? (maxY + minY) / 2 : maxY / 2,
      coordinatesZ.length > 1 ? (maxZ + minZ) / 2 : maxZ / 2,
      0
    ) // Клиппинг-плоскость, параллельная Y (например, горизонтальное сечение)
    plane.normalize() // Нормализуем плоскость

    // Применяем клиппинг-плоскости ко всем мешам в сцене или только к загруженным
    myScene.value?.meshes.forEach(function (mesh) {
      if (mesh.material) {
        mesh.material.clipPlane = plane
      }
    })
  } else {
    var plane = new BABYLON.Plane(0, 0, 1, 0) // Клиппинг-плоскость, параллельная Y (например, горизонтальное сечение)
    plane.normalize() // Нормализуем плоскость

    // Применяем клиппинг-плоскости ко всем мешам в сцене или только к загруженным
    myScene.value?.meshes.forEach(function (mesh) {
      if (mesh.material) {
        mesh.material.clipPlane = plane
      }
    })
  }
}

function resetClip() {
  myScene.value?.meshes.forEach(function (mesh) {
    if (mesh.material) {
      mesh.material.clipPlane = null
    }
  })
}
</script>

<style scoped></style>
