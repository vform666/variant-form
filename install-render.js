import VFormRender from '@/components/form-render/index.vue'
import {loadExtension} from "@/extension/extension-loader"
import axios from "axios"

loadExtension()

VFormRender.install = function (Vue) {
  Vue.component(VFormRender.name, VFormRender)
}

const components = [
  VFormRender
]

const install = (Vue) => {
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
  VFormRender
}
