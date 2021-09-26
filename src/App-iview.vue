<template>
  <div id="app">
    <VFormDesigner />
  </div>
</template>

<script>
import VFormDesigner from './components-iview/form-designer/index.vue'

export default {
  name: 'App',
  components: {
    VFormDesigner
  }
}
</script>

<style lang="scss">
  #app {
    height: 100%;
  }
</style>
