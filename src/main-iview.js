import 'babel-polyfill'
import './utils/debug-console'
import Vue from 'vue'
import axios from "axios";
import App from './App-iview.vue'
import ViewUI from 'view-design';
import './utils/directive'
import './icons'

import ContainerWidget from "@/components-iview/form-designer/form-widget/container-widget";
import ContainerItem from "@/components-iview/form-render/container-item";

import 'view-design/dist/styles/iview.css';
import '@/styles/index.scss'
import '@/iconfont/iconfont.css'

/* 递归组件如需在递归组件的嵌套组件中使用，必须注册为全局组件，原因不明？？ begin */
Vue.component('container-widget', ContainerWidget)
Vue.component('container-item', ContainerItem)
/* end */
Vue.use(ViewUI, {size:'small'});


if (typeof window !== 'undefined') {
  window.axios = axios
}

Vue.config.productionTip = false

new Vue({
  el: "#app",
  render: h => h(App),
})
