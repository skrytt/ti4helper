<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <main>
    <div class="wrapper">
      <HelloWorld msg="Hello World" />
    </div>
  </main>
</template>

<style scoped>
body {
  /* This app is designed for a fixed screen ratio/size */
  width: 1920px;
  height: 1080px;
}
</style>
