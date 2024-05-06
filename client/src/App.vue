
<template>

  <canvas ref="canvas" style="height:100%; width:100%"></canvas>
</template>


<script setup lang="ts">
import {ref} from "vue"
import {onMounted} from "vue";
import {createScene} from "./scenes/MainScene.ts";

const canvas = ref()

onMounted(() => {
  createScene(canvas.value)
})
</script>


<style scoped>

</style>
