import VFormRender from '@/components-iview/form-render/index.vue'
import ContainerItem from "@/components-iview/form-render/container-item";
import axios from "axios";

import {i18n} from '@/components-iview/utils/i18n.js'

VFormRender.install = function (Vue) {
  Vue.component(VFormRender.name, VFormRender)
}

const components = [
  VFormRender
]

const install = (Vue) => {
  /* 递归组件如需在递归组件的嵌套组件中使用，必须注册为全局组件，原因不明？？ begin */
  Vue.component('container-item', ContainerItem)
  /* end */

  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) { /* script方式引入时主动调用install方法！！ */
  window.axios = axios
  install(window.Vue);
}

export default {
  install,
  i18n,
  VFormRender
}
