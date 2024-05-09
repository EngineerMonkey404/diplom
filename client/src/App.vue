
<template>

  <canvas ref="canvas" style="height:100%; width:100%"></canvas>
  <div @click="handleClick(mesh)" v-for="mesh in myScene?.meshes">
    {{ mesh.name }}
  </div>
  <div v-if="currentDetail">
    <h3>Деталь {{ currentDetail }}</h3>
    <p>Здесь будет описание детали</p>
  </div>
</template>


<script setup lang="ts">
import {ref} from "vue"
import {onMounted} from "vue";
import {createScene} from "./scenes/MainScene.ts";
import { AbstractMesh, } from "babylonjs/Meshes/abstractMesh";
import { Scene, HighlightLayer } from "babylonjs";

const canvas = ref()
// const meshes = ref<AbstractMesh[]>([])
const myScene = ref<Scene>()
const myHl = ref<HighlightLayer>()

const currentDetail = ref('')

onMounted(async () => {
  const { engine, scene, hl } = await createScene(canvas.value)
  myScene.value = scene
  myHl.value = hl
  //console.log(myScene.value)
})

function handleClick(mesh: AbstractMesh) {
  mesh.position.x += 0.1
  myHl.value?.removeAllMeshes()
  myHl.value?.addMesh(mesh, BABYLON.Color3.Green())
  //console.log(mesh.name)
  currentDetail.value = mesh.name
}
</script>


<style scoped>

</style>
