<template>
    <div class="relative h-screen w-screen">
    <canvas ref="canvas" class="h-full w-screen"></canvas>
    <div class="absolute right-0 top-0 bg-white bg-opacity-[60%] py-5 px-5">
      <div>{{ route.params.filename }}</div>
      <div @click="handleClick(mesh)" v-for="mesh in myScene?.meshes">
        {{ mesh.name }}
      </div>
      <div v-if="currentDetail">
        <h3>Деталь {{ currentDetail }}</h3>
  
        <p>Здесь будет описание детали</p>
      </div>
    </div>
  </div>
  </template>
  
  
  <script setup lang="ts">
  import {ref} from "vue"
  import {onMounted} from "vue";
  import { createScene } from "../scenes/MainScene";
  import { AbstractMesh, } from "babylonjs/Meshes/abstractMesh";
  import { Scene, HighlightLayer } from "babylonjs";
  import { useRoute } from 'vue-router'
  
  const canvas = ref()
  // const meshes = ref<AbstractMesh[]>([])
  const myScene = ref<Scene>()
  const myHl = ref<HighlightLayer>()
  const route = useRoute()
  const currentDetail = ref('')
  
  onMounted(async () => {
    const { engine, scene, hl }=await createScene(canvas.value, route.params.filename)
    myScene.value = scene
    myHl.value = hl
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
  