import Vue from 'vue'
import si18n from './smart-vue-i18n/index'

import enLocaleElement from "element-ui/lib/locale/lang/en";
import zhLocaleElement from "element-ui/lib/locale/lang/zh-CN";
import locale from "element-ui/lib/locale"

import enLocale from "@/lang/en-US";
import zhLocale from "@/lang/zh-CN";
import enLocale_render from "@/lang/en-US_render";
import zhLocale_render from "@/lang/zh-CN_render";
import enLocale_extension from "@/lang/en-US_extension";
import zhLocale_extension from "@/lang/zh-CN_extension";

const langResources = {
  'en-US': {
    something: {
      //...
    },
    ...enLocaleElement,
    ...enLocale,
    ...enLocale_render,
    ...enLocale_extension
  },

  'zh-CN': {
    something: {
      //...
    },
    ...zhLocaleElement,
    ...zhLocale,
    ...zhLocale_render,
    ...zhLocale_extension
  }
}

Vue.use(si18n, {
  lang: localStorage.getItem('v_form_locale') || 'zh-CN',
  messages: langResources
})

locale.i18n((key, value) => Vue.prototype.$st(key))

export const changeLocale = function(langName) {
  Vue.prototype.$si18n.setLang(langName)
  localStorage.setItem('v_form_locale', langName)
}

export const translate = function(key) {
  return Vue.prototype.$st(key)
}

export default {
  methods: {
    i18nt(key) {
      return this.$st(key)
    },

    /* 如果key1不存在，则查找key2 */
    i18n2t(key1, key2) {
      return this.$st2(key1, key2)
    },

  }
}
