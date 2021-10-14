import emitter from 'element-ui/lib/mixins/emitter'

export default {
  mixins: [emitter],
  created() {
    // this.$on('saveEventHandler', function (params) {
    //   //this.optionModel[eventName] = handlerCodes
    //   this.optionModel[params[0]] = params[1]
    // })

  },
  methods: {
    editEventHandler(eventName, eventParams) {
      this.dispatch('SettingPanel', 'editEventHandler', [eventName, [...eventParams]])
    },


  }
}
