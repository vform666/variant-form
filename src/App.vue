<template>
  <div id="app">
    <VFormDesigner ref="vfDesignerRef" :designer-config="designerConfig"></VFormDesigner>
  </div>
</template>

<script>
import VFormDesigner from './components/form-designer/index.vue'

export default {
  name: 'App',
  components: {
    VFormDesigner,
  },
  data() {
    return {
      designerConfig: {
        resetFormJson: true,
      }
    }
  }
}
</script>

<style lang="scss">
  #app {
    height: 100%;
  }
</style>
