import emitter from '@/utils/emitter'

export default {
  mixins: [emitter],
  created() {},
  methods: {
    editEventHandler(eventName, eventParams) {
      this.dispatch('SettingPanel', 'editEventHandler', [eventName, [...eventParams]])
    },

  }
}
