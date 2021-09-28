import Vue from 'vue'
import VueI18n from 'vue-i18n'

import enLocale from "../lang/en-US";
import zhLocale from "../lang/zh-CN";
import enLocale_render from "../lang/en-US_render";
import zhLocale_render from "../lang/zh-CN_render";

import en from 'view-design/dist/locale/en-US';
import zh from 'view-design/dist/locale/zh-CN';

import locale from "view-design/src/locale"


const langResources = {
    'en-US': {
		...en,
		...enLocale,
		...enLocale_render
	},
    'zh-CN': {
		...zh,
		...zhLocale,
		...zhLocale_render
	}
};


Vue.use(VueI18n);

export const i18n = new VueI18n({
    locale: localStorage.getItem('v_form_locale') || 'zh-CN',  // set locale
    messages:langResources  // set locale messages
});

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
