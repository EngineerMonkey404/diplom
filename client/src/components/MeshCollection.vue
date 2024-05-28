<template>
  <div class="h-full flex flex-col">
    <div class="flex gap-x-[20px] pt-[15px] border-b">
      <button
        class="btn-style"
        @click="currentWindow = 'Узлы'"
        :class="currentWindow === 'Узлы' ? 'bg-gray-100' : ''"
      >
        Узлы
      </button>
      <button
        class="btn-style"
        @click="currentWindow = 'Элементы'"
        :class="currentWindow === 'Элементы' ? 'bg-gray-100' : ''"
      >
        Элементы
      </button>
    </div>
    <ul
      v-if="currentWindow === 'Узлы'"
      class="overflow-auto grow"
    >
      <li
        v-for="(node, index) in props.nodes"
        :key="index"
        class="px-[5px] cursor-pointer hover:bg-gray-200 border-b"
        :class="currentNodes.includes(node) ? 'bg-gray-100' : ''"
        @click="handleNode(node)"
      >
        {{ node.name }}
      </li>
    </ul>
    <ul
      v-if="currentWindow === 'Элементы'"
      class="overflow-auto grow"
    >
      <li
        v-for="mesh in props.meshes"
        class="px-[5px] cursor-pointer hover:bg-gray-200 border-b"
        :class="currentMeshes.includes(mesh.name) ? 'bg-gray-100' : ''"
        @click="handleMesh(mesh.name)"
      >
        {{ mesh.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AbstractMesh } from 'babylonjs/Meshes/abstractMesh'

interface Node {
  name: string
  elements: string[]
}

const props = defineProps<{
  meshes: AbstractMesh[]
  nodes: Node[]
}>()
const emit = defineEmits(['change-current-detail'])

const currentWindow = ref('Узлы')
const currentMeshes = ref<string[]>([])
const currentNodes = ref<Node[]>([])

function handleMesh(meshName: string) {
  let index = currentMeshes.value.findIndex(mesh => mesh === meshName)
  if (index === -1) {
    currentMeshes.value.push(meshName)
  } else {
    currentMeshes.value.splice(index, 1)
  }
  props.meshes.forEach(mesh => {
    if (mesh.name !== '__root__') {
      if (!currentMeshes.value.includes(mesh.name)) {
        mesh.setEnabled(false)
      } else {
        mesh.setEnabled(true)
      }
    }
  })
  currentNodes.value = []
  emit('change-current-detail', meshName)
}

function handleNode(currNode: Node) {
  let index = currentNodes.value.findIndex(node => node.name === currNode.name)
  if (index === -1) {
    currentNodes.value.push(currNode)
  } else {
    currentNodes.value.splice(index, 1)
  }
  let choosenElements = currentNodes.value.flatMap(node => node.elements)
  props.meshes.forEach(mesh => {
    if (mesh.name !== '__root__') {
      if (!choosenElements.includes(mesh.name)) {
        mesh.setEnabled(false)
      } else {
        mesh.setEnabled(true)
      }
    }
  })
  currentMeshes.value = []
  emit('change-current-detail', '')
}
</script>

<style scoped>
.btn-style {
  @apply px-[10px] py-[5px] rounded-t-[10px] transition;
}
</style>
