import {deepAssign, get} from './utils'

const install = (Vue, options) => {
    const proto = Vue.prototype
    proto.$si18n = proto.$si18n || {}
    // 初始化多语言
    deepAssign(proto.$si18n, options)

    const _vm = new Vue({
        data: options
    })
    Object.defineProperty(Vue.prototype.$si18n, 'lang', {
        get() {
            return _vm.lang
        }
    })

    proto.$st = (path, ...args) => {
        let messages = _vm.messages[_vm.lang]
        if (!proto.$si18n.messages) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('[yxI18n] Locale not correctly registered')
            }
            return () => path
        }
        //const message = get(messages, path) || get(messages, path)
        const message = get(messages, path)
        return typeof message === 'function'
            ? message(...args)
            : (message !== null ? message : path)
    }

    proto.$st2 = (path, path2) => {
      let messages = _vm.messages[_vm.lang]
      const message = get(messages, path)
      return (message !== null) ? message : get(messages, path2)
    }

    proto.$si18n.add = (messages = {}) => {
        deepAssign(proto.$si18n.messages, messages)
    }

    proto.$si18n.setLang = lang => {
        _vm.lang = lang
    }

    Vue.mixin({
        beforeCreate() {
            this.$options.i18n && this.$si18n.add(this.$options.i18n)
        }
    })
}

export default {
    install
}
