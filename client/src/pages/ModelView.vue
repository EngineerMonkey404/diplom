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
          >
            <!-- <div class="text-center py-[5px]">{{ route.params.id }}</div> -->
            <MeshCollection
              :meshes="
                myScene?.meshes.filter(mesh => mesh.name !== '__root__') || []
              "
              :nodes="nodes"
              @change-current-detail="meshName => (currentDetail = meshName)"
            />
          </SplitterPanel>
          <SplitterPanel
            v-if="currentDetail"
            :size="25"
            class="h-full overflow-auto p-[5px]"
          >
            <h3>Деталь {{ currentDetail }}</h3>

            <p class="">
              Здесь будет описание детали Здесь будет описание детали Здесь
              будет описание детали Здесь будет описание детали Здесь будет
              описание детали Здесь будет описание детали Здесь будет описание
              деталиЗдесь будет описание детали Здесь будет описание детали
            </p>
          </SplitterPanel>
        </Splitter>

        <div
          class="absolute bottom-0 left-0 w-[80%] bg-white p-[10px] flex gap-[20px]"
        >
          <button @click="clipY()">clipY</button>
          <button @click="clipX()">clipX</button>
          <button @click="clipZ()">clipZ</button>
          <button @click="resetClip()">reset clip</button>
          <button @click="resetElements()">reset choosen elements</button>
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
import { Scene, HighlightLayer } from 'babylonjs'
import { useRoute } from 'vue-router'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import MeshCollection from '../components/MeshCollection.vue'

const canvas = ref()
// const meshes = ref<AbstractMesh[]>([])
const myScene = ref<Scene>()
const myHl = ref<HighlightLayer>()
const route = useRoute()
const currentDetail = ref('')

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
  const { engine, scene, hl } = await createScene(canvas.value, route.params.id)
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
</script>

<style scoped></style>
