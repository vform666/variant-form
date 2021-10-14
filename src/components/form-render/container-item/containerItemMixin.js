import {generateId} from "@/utils/util";

export default {
  computed: {
    customClass() {
      return this.widget.options.customClass || ''
    },

    formModel: {
      cache: false,
      get() {
        return this.globalModel.formModel
      }
    },

  },

  methods: {
    unregisterFromRefList() {  //销毁容器组件时注销组件ref
      if ((this.refList !== null) && !!this.widget.options.name) {
        let oldRefName = this.widget.options.name
        delete this.refList[oldRefName]
      }
    },

    //--------------------- 以下为组件支持外部调用的API方法 begin ------------------//
    /* 提示：用户可自行扩充这些方法！！！ */

    setHidden(flag) {
      this.widget.options.hidden = flag
    },

    activeTab(tabIndex) { //tabIndex从0计数
      if ((tabIndex >= 0) && (tabIndex < this.widget.tabs.length)) {
        this.widget.tabs.forEach((tp, idx) => {
          tp.options.active = idx === tabIndex
          if (idx === tabIndex) {
            this.activeTabName = tp.options.name
          }
        })

      }
    },

    disableTab(tabIndex) {
      if ((tabIndex >= 0) && (tabIndex < this.widget.tabs.length)) {
        this.widget.tabs[tabIndex].options.disabled = true
      }
    },

    enableTab(tabIndex) {
      if ((tabIndex >= 0) && (tabIndex < this.widget.tabs.length)) {
        this.widget.tabs[tabIndex].options.disabled = false
      }
    },

    hideTab(tabIndex) {
      if ((tabIndex >= 0) && (tabIndex < this.widget.tabs.length)) {
        this.widget.tabs[tabIndex].options.hidden = true
      }
    },

    showTab(tabIndex) {
      if ((tabIndex >= 0) && (tabIndex < this.widget.tabs.length)) {
        this.widget.tabs[tabIndex].options.hidden = false
      }
    },

    disableSubFormRow(rowIndex) {
      this.widget.widgetList.forEach(subWidget => {
        let swRefName = subWidget.options.name + '@row' + this.rowIdData[rowIndex]
        let foundSW = this.getWidgetRef(swRefName)
        if (!!foundSW) {
          foundSW.setDisabled(true)
        }
      })
    },

    enableSubFormRow(rowIndex) {
      this.widget.widgetList.forEach(subWidget => {
        let swRefName = subWidget.options.name + '@row' + this.rowIdData[rowIndex]
        let foundSW = this.getWidgetRef(swRefName)
        if (!!foundSW) {
          foundSW.setDisabled(false)
        }
      })
    },

    disableSubForm() {
      if (this.rowIdData.length > 0) {
        this.rowIdData.forEach((dataRow, rIdx) => {
          this.disableSubFormRow(rIdx)
        })
      }
    },

    enableSubForm() {
      if (this.rowIdData.length > 0) {
        this.rowIdData.forEach((dataRow, rIdx) => {
          this.enableSubFormRow(rIdx)
        })
      }
    },

    resetSubForm() { //重置subForm数据为空
      if (this.widget.type === 'sub-form') {
        let subFormModel = this.formModel[this.widget.options.name]
        if (!!subFormModel) {
          subFormModel.splice(0, subFormModel.length)
          this.rowIdData.splice(0, this.rowIdData.length)
        }
      }
    },

    getSubFormValues(needValidation = true) {
      if (this.widget.type === 'sub-form') {
        //TODO: 逐行校验子表单！！
        return this.formModel[this.widget.options.name]
      } else {
        this.$message.error(this.i18nt('render.hint.nonSubFormType'))
      }
    },

    // validateField(fieldName) { //逐行校验子表单字段
    //   //TODO:
    // },
    //
    // validateSubForm() { //逐行校验子表单全部字段
    //   //TODO:
    // },

    //--------------------- 以上为组件支持外部调用的API方法 end ------------------//

  },

}
