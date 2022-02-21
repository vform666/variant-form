import axios from 'axios'

import VFormDesigner from '@/components/form-designer/index.vue'
import VFormRender from '@/components/form-render/index.vue'
import {loadExtension} from "@/extension/extension-loader"

import '@/utils/directive'
import '@/icons'
import '@/iconfont/iconfont.css'

loadExtension()

VFormDesigner.install = function (Vue) {
  Vue.component(VFormDesigner.name, VFormDesigner)
}

VFormRender.install = function (Vue) {
  Vue.component(VFormRender.name, VFormRender)
}

const components = [
  VFormDesigner,
  VFormRender
]

const install = (Vue) => {
  window.axios = axios
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) { /* script方式引入时主动调用install方法！！ */
  install(window.Vue);
}

export default {
  install,
  VFormDesigner,
  VFormRender
}
