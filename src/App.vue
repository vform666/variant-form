<template>
  <div id="app">
    <VFormDesigner ref="vfDesignerRef" :designer-config="designerConfig" :global-dsv="globalDsv">
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
      },

      //全局数据源变量
      globalDsv: {
        testApiHost: 'http://www.test.com/api',
        testPort: 8080,
      },
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
