import Vue from 'vue'
import VueI18n from 'vue-i18n'

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

Vue.use(VueI18n)


const i18n = new VueI18n({
  locale: localStorage.getItem('v_form_locale') || 'zh-CN',
  //locale: 'en-US',
  messages: langResources,
})

locale.i18n((key, value) => i18n.t(key, value))

export const changeLocale = function(langName) {
  i18n.locale = langName
  localStorage.setItem('v_form_locale', langName)
}

export const translate = function(key) {
  return i18n._t(key, i18n.locale, i18n._getMessages())
}

export default {
  methods: {
    i18nt(key) {
      return i18n._t(key, i18n.locale, i18n._getMessages())
    }
  }
}
