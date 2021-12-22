<template>
  <div id="app">
    <VFormDesigner>
      <!-- 自定义按钮插槽演示 -->
      <template #customToolButtons>
        <el-button type="text">test</el-button>
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
  }
}
</script>

<style lang="scss">
  #app {
    height: 100%;
  }
</style>
