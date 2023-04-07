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
        headerShow: false,  //是否显示顶栏
        // languageMenu: true,  //是否显示语言切换菜单
        externalLink: false,  //是否显示GitHub、文档等外部链接
        // formTemplates: true,  //是否显示表单模板
        // eventCollapse: true,  //是否显示组件事件属性折叠面板
        // widgetNameReadonly: true,  //禁止修改组件名称
        // clearDesignerButton: true,  //是否显示清空设计器按钮
        // previewFormButton: true,  //是否显示预览表单按钮
        // importJsonButton: true,  //是否显示导入JSON按钮
        // exportJsonButton: true,  //是否显示导出JSON器按钮
        // exportCodeButton: true,  //是否显示导出代码按钮
        // generateSFCButton: true,  //是否显示生成SFC按钮
        // toolbarMaxWidth: 420,  //设计器工具按钮栏最大宽度（单位像素）
        // toolbarMinWidth: 300,  //设计器工具按钮栏最小宽度（单位像素）
        // presetCssCode: '',  //设计器预设CSS样式代码
        // resetFormJson: false,  //是否在设计器初始化时将表单内容重置为空
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
