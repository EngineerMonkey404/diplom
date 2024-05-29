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
        v-for="(collection, index) in props.collections"
        :key="index"
        class="px-[5px] cursor-pointer hover:bg-gray-200 border-b"
        :class="currentCollections.includes(collection) ? 'bg-gray-100' : ''"
        @click="handleCollection(collection)"
      >
        {{ collection.title }}
      </li>
    </ul>
    <ul
      v-if="currentWindow === 'Элементы'"
      class="overflow-auto grow"
    >
      <li
        v-for="mesh in props.meshes"
        class="px-[5px] cursor-pointer hover:bg-gray-200 border-b"
        :class="currentDetails.includes(mesh.id) ? 'bg-gray-100' : ''"
        @click="handleDetail(mesh.id)"
      >
        {{ mesh.id }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DetailDoc, Collection } from '../types';
import { AbstractMesh } from 'babylonjs';

const props = defineProps<{
  details: DetailDoc[]
  collections: Collection[]
  meshes: AbstractMesh[]
}>()
const emit = defineEmits(['change-current-detail'])

const currentWindow = ref('Узлы')
const currentDetails = ref<string[]>([])
const currentCollections = ref<Collection[]>([])

function handleDetail(detailId: string) {
  let index = currentDetails.value.findIndex(mesh => mesh === detailId)
  if (index === -1) {
    currentDetails.value.push(detailId)
  } else {
    currentDetails.value.splice(index, 1)
  }
  props.meshes.forEach(mesh => {
    if (mesh.name !== '__root__') {
      if (!currentDetails.value.includes(mesh.name)) {
        mesh.setEnabled(false)
      } else {
        mesh.setEnabled(true)
      }
    }
  })
  currentCollections.value = []
  if (props.details.flatMap(detail => detail.detailId).includes(detailId)) {
    emit('change-current-detail', detailId)
  } else {
    emit('change-current-detail', '')
  }
}

function handleCollection(currCollection: Collection) {
  let index = currentCollections.value.findIndex(collection => collection.title === currCollection.title)
  if (index === -1) {
    currentCollections.value.push(currCollection)
  } else {
    currentCollections.value.splice(index, 1)
  }
  let choosenElements = currentCollections.value.flatMap(collection => collection.details)
  props.meshes.forEach(mesh => {
    if (mesh.id !== '__root__') {
      if (!choosenElements.includes(mesh.id)) {
        mesh.setEnabled(false)
      } else {
        mesh.setEnabled(true)
      }
    }
  })
  currentDetails.value = []
  emit('change-current-detail', '')
}
</script>

<style scoped>
.btn-style {
  @apply px-[10px] py-[5px] rounded-t-[10px] transition;
}
</style>
