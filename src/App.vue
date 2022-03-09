<template>
  <div id="app">
    <VFormDesigner ref="vfDesignerRef" :designer-config="designerConfig">
      <template #customToolButtons>
        <el-button type="text" @click="printFormJson">测试按钮</el-button>
      </template>
    </VFormDesigner>
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
        resetFormJson: false,
        toolbarMaxWidth: 490,
      }
    }
  },
  methods: {
    printFormJson() {
      console.log( this.$refs.vfDesignerRef.getFormJson() )
    }
  }
}
</script>

<style lang="scss">
  #app {
    height: 100%;
  }
</style>
