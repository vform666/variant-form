import {deepClone} from "@/utils/util"
import FormValidators from '@/utils/validators'

export default {
  inject: ['refList', 'formConfig', 'getGlobalDsv', 'globalOptionData', 'globalModel', 'getOptionData'],

  computed: {
    subFormName() {
      return !!this.parentWidget ? this.parentWidget.options.name : ''
    },

    subFormItemFlag() {
      return !!this.parentWidget ? this.parentWidget.type === 'sub-form' : false
    },

    formModel: {
      cache: false,
      get() {
        return this.globalModel.formModel
      }
    },

  },

  methods: {

    //--------------------- 组件内部方法 begin ------------------//
    getPropName() {
      if (this.subFormItemFlag && !this.designState) {
        return this.subFormName + "." + this.subFormRowIndex + "." + this.field.options.name + ""
      } else {
        return this.field.options.name
      }
    },

    initFieldModel() {
      if (!this.field.formItemFlag) {
        return
      }

      if (!!this.subFormItemFlag && !this.designState) {  //SubForm子表单组件需要特殊处理！！
        let subFormData = this.formModel[this.subFormName]
        if (((subFormData === undefined) || (subFormData[this.subFormRowIndex] === undefined) ||
            (subFormData[this.subFormRowIndex][this.field.options.name] === undefined)) &&
            (this.field.options.defaultValue !== undefined)) {
          this.fieldModel = this.field.options.defaultValue
          subFormData[this.subFormRowIndex][this.field.options.name] = this.field.options.defaultValue
        } else if (subFormData[this.subFormRowIndex][this.field.options.name] === undefined) {
          this.fieldModel = null
          subFormData[this.subFormRowIndex][this.field.options.name] = null
        } else {
          this.fieldModel = subFormData[this.subFormRowIndex][this.field.options.name]
        }

        /* 主动触发子表单内field-widget的onChange事件！！ */
        setTimeout(() => {  //延时触发onChange事件, 便于更新计算字段！！
          this.handleOnChangeForSubForm(this.fieldModel, this.oldFieldValue, subFormData, this.subFormRowId)
        }, 800)
        this.oldFieldValue = deepClone(this.fieldModel)

        this.initFileList()  //处理图片上传、文件上传字段

        return
      }

      if ((this.formModel[this.field.options.name] === undefined) &&
          (this.field.options.defaultValue !== undefined)) {
        this.fieldModel = this.field.options.defaultValue
      } else if (this.formModel[this.field.options.name] === undefined) {  //如果formModel为空对象，则初始化字段值为null!!
        this.formModel[this.field.options.name] = null
      } else {
        this.fieldModel = this.formModel[this.field.options.name]
      }
      this.oldFieldValue = deepClone(this.fieldModel)
      this.initFileList()  //处理图片上传、文件上传字段
    },

    initFileList() { //初始化上传组件的已上传文件列表
      if ( ((this.field.type !== 'picture-upload') && (this.field.type !== 'file-upload')) || (this.designState === true) ) {
        return
      }

      if (!!this.fieldModel) {
        if (Array.isArray(this.fieldModel)) {
          this.fileList = deepClone(this.fieldModel)
        } else {
          this.fileList.splice(0, 0, deepClone(this.fieldModel))
        }
      }
    },

    initEventHandler() {
      this.$on('setFormData', (newFormData) => {
        //console.log('formModel of globalModel----------', this.globalModel.formModel)
        if (!this.subFormItemFlag) {
          this.setValue(newFormData[this.field.options.name])
        }
      })

      this.$on('field-value-changed', (values) => {
        if (!!this.subFormItemFlag) {
          let subFormData = this.formModel[this.subFormName]
          this.handleOnChangeForSubForm(values[0], values[1], subFormData, this.subFormRowId)
        } else {
          this.handleOnChange(values[0], values[1])
        }
      })

      /* 监听重新加载选项事件 */
      this.$on('reloadOptionItems', (widgetNames) => {
        if ((widgetNames.length === 0) || (widgetNames.indexOf(this.field.options.name) > -1)) {
          this.initOptionItems(true)
        }
      })
    },

    handleOnCreated() {
      if (!!this.field.options.onCreated) {
        let customFunc = new Function(this.field.options.onCreated)
        customFunc.call(this)
      }
    },

    handleOnMounted() {
      if (!!this.field.options.onMounted) {
        let mountFunc = new Function(this.field.options.onMounted)
        mountFunc.call(this)
      }
    },

    registerToRefList(oldRefName) {
      if ((this.refList !== null) && !!this.field.options.name) {
        if (this.subFormItemFlag && !this.designState) { //处理子表单元素（且非设计状态）
          if (!!oldRefName) {
            delete this.refList[oldRefName + '@row' + this.subFormRowId]
          }
          this.refList[this.field.options.name + '@row' + this.subFormRowId] = this
        } else {
          if (!!oldRefName) {
            delete this.refList[oldRefName]
          }
          this.refList[this.field.options.name] = this
        }
      }
    },

    unregisterFromRefList() {  //销毁组件时注销组件ref
      if ((this.refList !== null) && !!this.field.options.name) {
        let oldRefName = this.field.options.name
        if (this.subFormItemFlag && !this.designState) { //处理子表单元素（且非设计状态）
          delete this.refList[oldRefName + '@row' + this.subFormRowId]
        } else {
          delete this.refList[oldRefName]
        }
      }
    },

    initOptionItems(keepSelected) {
      if (this.designState) {
        return
      }

      if ((this.field.type === 'radio') || (this.field.type === 'checkbox')
          || (this.field.type === 'select') || (this.field.type === 'cascader')) {
        /* 异步更新option-data之后globalOptionData不能获取到最新值，改用provide的getOptionData()方法 */
        const newOptionItems = this.getOptionData()
        if (!!newOptionItems && newOptionItems.hasOwnProperty(this.field.options.name)) {
          if (!!keepSelected) {
            this.reloadOptions(newOptionItems[this.field.options.name])
          } else {
            this.loadOptions(newOptionItems[this.field.options.name])
          }
        }
      }
    },

    refreshDefaultValue() {
      if ((this.designState === true) && (this.field.options.defaultValue !== undefined)) {
        this.fieldModel = this.field.options.defaultValue
      }
    },

    clearFieldRules() {
      if (!this.field.formItemFlag) {
        return
      }

      this.rules.splice(0, this.rules.length)  //清空已有
    },

    buildFieldRules() {
      if (!this.field.formItemFlag && this.field.options.hidden) {
        return
      }

      this.rules.splice(0, this.rules.length)  //清空已有
      if (!!this.field.options.required) {
        this.rules.push({
          required: true,
          //trigger: ['blur', 'change'],
          trigger: ['blur'],  /* 去掉change事件触发校验，change事件触发时formModel数据尚未更新，导致radio/checkbox必填校验出错！！ */
          message: this.field.options.requiredHint || this.i18nt('render.hint.fieldRequired'),
        })
      }

      if (!!this.field.options.validation) {
        let vldName = this.field.options.validation
        if (!!FormValidators[vldName]) {
          this.rules.push({
            validator: FormValidators[vldName],
            trigger: ['blur', 'change'],
            label: this.field.options.label,
            errorMsg: this.field.options.validationHint
          })
        } else {
          this.rules.push({
            validator: FormValidators['regExp'],
            trigger: ['blur', 'change'],
            regExp: vldName,
            label: this.field.options.label,
            errorMsg: this.field.options.validationHint
          })
        }
      }

      if (!!this.field.options.onValidate) {
        let customFn = (rule, value, callback) => {
          let tmpFunc =  new Function('rule', 'value', 'callback', this.field.options.onValidate)
          return tmpFunc.call(this, rule, value, callback)
        }
        this.rules.push({
          validator: customFn,
          trigger: ['blur', 'change'],
          label: this.field.options.label
        })
      }
    },

    /**
     * 禁用字段值变动触发表单校验
     */
    disableChangeValidate() {
      if (!this.rules) {
        return
      }

      this.rules.forEach(rule => {
        if (!!rule.trigger) {
          rule.trigger.splice(0, rule.trigger.length)
        }
      })
    },

    /**
     * 启用字段值变动触发表单校验
     */
    enableChangeValidate() {
      if (!this.rules) {
        return
      }

      this.rules.forEach(rule => {
        if (!!rule.trigger) {
          rule.trigger.push('blur')
          rule.trigger.push('change')
        }
      })
    },

    disableOptionOfList(optionList, optionValue) {
      if (!!optionList && (optionList.length > 0)) {
        optionList.forEach(opt => {
          if (opt.value === optionValue) {
            opt.disabled = true
          }
        })
      }
    },

    enableOptionOfList(optionList, optionValue) {
      if (!!optionList && (optionList.length > 0)) {
        optionList.forEach(opt => {
          if (opt.value === optionValue) {
            opt.disabled = false
          }
        })
      }
    },

    //--------------------- 组件内部方法 end ------------------//

    //--------------------- 事件处理 begin ------------------//

    emitFieldDataChange(newValue, oldValue) {
      this.$emit('field-value-changed', [newValue, oldValue])

      /* 必须用dispatch向指定父组件派发消息！！ */
      this.dispatch('VFormRender', 'fieldChange',
          [this.field.options.name, newValue, oldValue, this.subFormName, this.subFormRowIndex])
    },

    syncUpdateFormModel(value) {
      if (!!this.designState) {
        return
      }

      if (!!this.subFormItemFlag) {
        let subFormData = this.formModel[this.subFormName] || [{}]
        let subFormDataRow = subFormData[this.subFormRowIndex]
        subFormDataRow[this.field.options.name] = value
      } else {
        this.formModel[this.field.options.name] = value
      }
    },

    handleChangeEvent(value) {  /* input的清除输入小按钮会同时触发handleChangeEvent、handleInputCustomEvent！！ */
      this.syncUpdateFormModel(value)
      this.emitFieldDataChange(value, this.oldFieldValue)

      //number组件一般不会触发focus事件，故此处需要手工赋值oldFieldValue！！
      this.oldFieldValue = deepClone(value)  /* oldFieldValue需要在initFieldModel()方法中赋初值!! */

      /* 主动触发表单的单个字段校验，用于清除字段可能存在的校验错误提示 */
      this.dispatch('VFormRender', 'fieldValidation', [this.getPropName()])
    },

    handleFocusCustomEvent(event) {
      this.oldFieldValue = deepClone(this.fieldModel)  //保存修改change之前的值

      if (!!this.field.options.onFocus) {
        let customFn = new Function('event', this.field.options.onFocus)
        customFn.call(this, event)
      }
    },

    handleBlurCustomEvent(event) {
      if (!!this.field.options.onBlur) {
        let customFn = new Function('event', this.field.options.onBlur)
        customFn.call(this, event)
      }
    },

    handleInputCustomEvent(value) {
      this.syncUpdateFormModel(value)

      /* 主动触发表单的单个字段校验，用于清除字段可能存在的校验错误提示 */
      this.dispatch('VFormRender', 'fieldValidation', [this.getPropName()])

      if (!!this.field.options.onInput) {
        let customFn = new Function('value', this.field.options.onInput)
        customFn.call(this, value)
      }
    },

    emitAppendButtonClick() {
      if (!!this.designState) { //设计状态不触发点击事件
        return
      }

      if (!!this.field.options.onAppendButtonClick) {
        let customFn = new Function(this.field.options.onAppendButtonClick)
        customFn.call(this)
      } else {
        /* 必须调用mixins中的dispatch方法逐级向父组件发送消息！！ */
        this.dispatch('VFormRender', 'appendButtonClick', [this])
      }
    },

    handleOnChange(val, oldVal) {  //自定义onChange事件
      if (!!this.field.options.onChange) {
        let changeFn = new Function('value', 'oldValue', this.field.options.onChange)
        changeFn.call(this, val, oldVal)
      }
    },

    handleOnChangeForSubForm(val, oldVal, subFormData, rowId) {  //子表单自定义onChange事件
      if (!!this.field.options.onChange) {
        let changeFn = new Function('value', 'oldValue', 'subFormData', 'rowId', this.field.options.onChange)
        changeFn.call(this, val, oldVal, subFormData, rowId)
      }
    },

    handleButtonWidgetClick() {
      if (!!this.designState) { //设计状态不触发点击事件
        return
      }

      if (!!this.field.options.onClick) {
        let changeFn = new Function(this.field.options.onClick)
        changeFn.call(this)
      } else {
        this.dispatch('VFormRender', 'buttonClick', [this]);
      }
    },

    remoteQuery(keyword) {
      if (!!this.field.options.onRemoteQuery) {
        let remoteFn = new Function('keyword', this.field.options.onRemoteQuery)
        remoteFn.call(this, keyword)
      }
    },

    //--------------------- 事件处理 end ------------------//

    //--------------------- 以下为组件支持外部调用的API方法 begin ------------------//
    /* 提示：用户可自行扩充这些方法！！！ */

    getFormRef() { /* 获取VFrom引用，必须在VForm组件created之后方可调用 */
      return this.refList['v_form_ref']
    },

    getWidgetRef(widgetName, showError) {
      let foundRef = this.refList[widgetName]
      if (!foundRef && !!showError) {
        this.$message.error(this.i18nt('render.hint.refNotFound') + widgetName)
      }
      return foundRef
    },

    getFieldEditor() { //获取内置的el表单组件
      return this.$refs['fieldEditor']
    },

    /*
      注意：VFormRender的setFormData方法不会触发子表单内field-widget的setValue方法，
      因为setFormData方法调用后，子表单内所有field-widget组件已被清空，接收不到setFormData事件！！
    * */
    setValue(newValue) {
      /* if ((this.field.type === 'picture-upload') || (this.field.type === 'file-upload')) {
        this.fileList = newValue
      } else */ if (!!this.field.formItemFlag) {
        let oldValue = deepClone(this.fieldModel)
        this.fieldModel = newValue
        this.initFileList()

        this.syncUpdateFormModel(newValue)
        this.emitFieldDataChange(newValue, oldValue)
      }
    },

    getValue() {
      /* if ((this.field.type === 'picture-upload') || (this.field.type === 'file-upload')) {
        return this.fileList
      } else */ {
        return this.fieldModel
      }
    },

    resetField() {
      if (!!this.subFormItemFlag) { //跳过子表单组件
        return
      }

      let defaultValue = this.field.options.defaultValue
      this.setValue(defaultValue)

      //清空上传组件文件列表
      if ((this.field.type === 'picture-upload') || (this.field.type === 'file-upload')) {
        this.$refs['fieldEditor'].clearFiles()
        this.fileList.splice(0, this.fileList.length)
      }
    },

    setWidgetOption(optionName, optionValue) { //通用组件选项修改API
      if (this.field.options.hasOwnProperty(optionName)) {
        this.field.options[optionName] = optionValue
        //TODO: 是否重新构建组件？？有些属性修改后必须重新构建组件才能生效，比如字段校验规则。
      }
    },

    setReadonly(flag) {
      this.field.options.readonly = flag
    },

    setDisabled(flag) {
      this.field.options.disabled = flag
    },

    setAppendButtonVisible(flag) {
      this.field.options.appendButton = flag
    },

    setAppendButtonDisabled(flag) {
      this.field.options.appendButtonDisabled = flag
    },

    setHidden(flag) {
      this.field.options.hidden = flag

      if (!!flag) {  //清除组件校验规则
        this.clearFieldRules()
      } else {  //重建组件校验规则
        this.buildFieldRules()
      }
    },

    setRequired(flag) {
      this.field.options.required = flag
      this.buildFieldRules()
    },

    setLabel(newLabel) {
      this.field.options.label = newLabel
    },

    focus() {
      if (!!this.getFieldEditor() && !!this.getFieldEditor().focus) {
        this.getFieldEditor().focus()
      }
    },

    clearSelectedOptions() {  //清空已选选项
      if ((this.field.type !== 'checkbox') && (this.field.type !== 'radio') && (this.field.type !== 'select')) {
        return
      }

      if ((this.field.type === 'checkbox') ||
          ((this.field.type === 'select') && this.field.options.multiple)) {
        this.fieldModel = []
      } else {
        this.fieldModel = ''
      }
    },

    /**
     * 加载选项，并清空字段值
     * @param options
     */
    loadOptions(options) {
      this.field.options.optionItems = deepClone(options)
      //this.clearSelectedOptions()  //清空已选选项
    },

    /**
     * 重新加载选项，不清空字段值
     * @param options
     */
    reloadOptions(options) {
      this.field.options.optionItems = deepClone(options)
    },

    /**
     * 返回radio/checkbox/select/cascader的选项数据
     * @returns 选择项数组
     */
    getOptions() {
      return this.field.options.optionItems
    },

    disableOption(optionValue) {
      this.disableOptionOfList(this.field.options.optionItems, optionValue)
    },

    enableOption(optionValue) {
      this.enableOptionOfList(this.field.options.optionItems, optionValue)
    },

    setUploadHeader(name, value) {
      this.$set(this.uploadHeaders, name, value)
    },

    setUploadData(name, value) {
      this.$set(this.uploadData, name, value)
    },

    setToolbar(customToolbar) {
      this.customToolbar = customToolbar
    },

    /**
     * 是否子表单内嵌的组件
     * @returns {boolean}
     */
    isSubFormItem() {
      return !!this.parentWidget ? this.parentWidget.type === 'sub-form' : false
    },

    /**
     * 动态增加自定义css样式
     * @param className
     */
    addCssClass(className) {
      if (!this.field.options.customClass) {
        this.field.options.customClass = [className]
      } else {
        this.field.options.customClass.push(className)
      }
    },

    /**
     * 动态移除自定义css样式
     * @param className
     */
    removeCssClass(className) {
      if (!this.field.options.customClass) {
        return
      }

      let foundIdx = -1
      this.field.options.customClass.map((cc, idx) => {
        if (cc === className) {
          foundIdx = idx
        }
      })
      if (foundIdx > -1) {
        this.field.options.customClass.splice(foundIdx, 1)
      }
    },

    //--------------------- 以上为组件支持外部调用的API方法 end ------------------//

  }
}
