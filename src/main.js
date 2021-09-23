import 'babel-polyfill'
import './utils/debug-console'
import Vue from 'vue'
import axios from "axios";
import App from './App.vue'
import ElementUI from 'element-ui'
import './utils/directive'
import './icons'

import ContainerWidget from "@/components/form-designer/form-widget/container-widget";
import ContainerItem from "@/components/form-render/container-item";

import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import '@/iconfont/iconfont.css'


/* 递归组件如需在递归组件的嵌套组件中使用，必须注册为全局组件，原因不明？？ begin */
Vue.component('container-widget', ContainerWidget)
Vue.component('container-item', ContainerItem)
/* end */

Vue.use(ElementUI, { size: 'small' })

if (typeof window !== 'undefined') {
  window.axios = axios
}

Vue.config.productionTip = false

new Vue({
  el: "#app",
  render: h => h(App),
})
