# Variant Form
##### 一款高效的Vue表单，可视化设计，一键生成源码，享受更多摸鱼时间。

![image](https://ks3-cn-beijing.ksyuncs.com/vform-static/img/vform_demo.gif)

<br/>

文档官网：<a href="http://www.vform666.com/" target="_blank">http://www.vform666.com/</a>

在线演示：<a href="http://demo.vform666.com/" target="_blank">http://demo.vform666.com/</a>

VS Code插件：<a href="http://www.vform666.com/pages/plugin/" target="_blank">http://www.vform666.com/pages/plugin/</a>

Github仓库：<a href="https://github.com/vform666/variant-form" target="_blank">https://github.com/vform666/variant-form</a>

Gitee备份仓库：<a href="https://gitee.com/vdpadmin/variant-form" target="_blank">https://gitee.com/vdpadmin/variant-form</a>

技术交流群：微信搜索“vformAdmin”，或者扫如下二维码加群

![image](https://ks3-cn-beijing.ksyuncs.com/vform-static/img/vx-qrcode-242.png)



####### 打包
```
//VFromDesigner:
npm run lib-iview
//VFromRender
npm run lib-render-iview
```

####### 使用vFormDesigner的lib包
1. main.js全局注册
```
...
import ViewUI from 'view-design';
import VFormDesigner from './{YOURPATH}/VFormDesigner.umd.min.js'
import './{YOURPATH}/VFormDesigner.css'
...
Vue.use(VFormDesigner);
Vue.use(ViewUI, {size:'small'});
...
new Vue({
  render: h => h(App)
}).$mount('#app')
```
2. 在Vue模板中使用组件
```
<template>
  <v-form-designer></v-form-designer>
</template>

<script>
  export default {
    data() {
      return {
      }
    }
  }
</script>

<style lang="scss">
body {
  margin: 0;  /* 如果页面出现垂直滚动条，则加入此行CSS以消除之 */
}


```


####### 使用vFormRender的lib包
1. main.js全局注册
```
...
import ViewUI from 'view-design';
import VFormRender from './{YOURPATH}/VFormRender.umd.min.js'
import './{YOURPATH}/VFormRender.css'
...
Vue.use(VFormRender);
Vue.use(ViewUI, {size:'small'});
...
new Vue({
  render: h => h(App)
}).$mount('#app')
```
2. 在Vue模板中使用组件
```
<template>
  <div>
    <v-form-render :form-json="formJson" :form-data="formData" :option-data="optionData" ref="vFormRef">
    </v-form-render>
    <el-button type="primary" @click="submitForm">Submit</el-button>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        formJson: {"widgetList":[],"formConfig":{"labelWidth":80,"labelPosition":"left","size":"","labelAlign":"label-left-align","cssCode":"","customClass":"","functions":"","layoutType":"PC","onFormCreated":"","onFormMounted":"","onFormDataChange":""}},
        formData: {},
        optionData: {}
      }
    },
    methods: {
      submitForm() {
        this.$refs.vFormRef.getFormData().then(formData => {
          // Form Validation OK
          alert( JSON.stringify(formData) )
        }).catch(error => {
          // Form Validation failed
          this.$message.error(error)
        })
      }
    }
  }
</script>
```



<br/>

#### 安装依赖
```
npm install
```

#### 开发调试
```
npm run serve
```

#### 生产打包
```
npm run build
```

#### 浏览器兼容性
```Chrome（及同内核的浏览器如QQ浏览器、360浏览器等等），Firefox，Safari，IE 11```
