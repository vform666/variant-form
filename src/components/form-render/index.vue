<!--
/**
 * author: vformAdmin
 * email: vdpadmin@163.com
 * website: https://www.vform666.com
 * date: 2021.08.18
 * remark: 如果要分发VForm源码，需在本文件顶部保留此文件头信息！！
 */
-->

<template>
  <el-form :label-position="labelPosition" :size="size" :class="[customClass]" class="render-form"
           :label-width="labelWidth" :validate-on-rule-change="false"
           :model="formDataModel" ref="renderForm"
           @submit.native.prevent>
    <template v-for="(widget, index) in widgetList">
      <template v-if="'container' === widget.category">
        <component :is="getContainerWidgetName(widget)" :widget="widget" :key="widget.id" :parent-list="widgetList"
                        :index-of-parent-list="index" :parent-widget="null">
          <!-- 递归传递插槽！！！ -->
          <template v-for="slot in Object.keys($scopedSlots)" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope"/>
          </template>
        </component>
      </template>
      <template v-else>
        <component :is="getWidgetName(widget)" :field="widget" :form-model="formDataModel" :designer="null" :key="widget.id" :parent-list="widgetList"
                      :index-of-parent-list="index" :parent-widget="null">
          <!-- 递归传递插槽！！！ -->
          <template v-for="slot in Object.keys($scopedSlots)" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope"/>
          </template>
        </component>
      </template>
    </template>
  </el-form>
</template>

<script>
  //import ElForm from 'element-ui/packages/form/src/form.vue'  /* 用于源码调试Element UI */
  import emitter from '@/utils/emitter'
  import './container-item/index'
  import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'
  import {
    generateId, deepClone, getAllContainerWidgets, getAllFieldWidgets,
    insertCustomCssToHead,
    insertGlobalFunctionsToHtml,
    traverseFieldWidgets, buildDefaultFormJson
  } from "@/utils/util"
  import i18n, { changeLocale } from "../../utils/i18n"

  export default {
    name: "VFormRender",
    componentName: 'VFormRender',
    mixins: [emitter, i18n],
    components: {
      //ElForm,

      ...FieldComponents,
    },
    props: {
      formJson: { //prop传入的表单JSON配置
        type: Object,
        default: () => buildDefaultFormJson()
      },
      formData: { //prop传入的表单数据
        type: Object,
        default: () => ({})
      },
      optionData: { //prop传入的选项数据
        type: Object,
        default: () => ({})
      },
      previewState: { //是否表单预览状态
        type: Boolean,
        default: false
      },
      globalDsv: {
        type: Object,
        default: () => ({})
      },
    },
    provide() {
      return {
        refList: this.widgetRefList,
        sfRefList: this.subFormRefList,  //收集SubForm引用
        formConfig: this.formConfig,
        getGlobalDsv: () => this.globalDsv, // 全局数据源变量
        globalOptionData: this.optionData,
        getOptionData: () => this.optionData,  /* 该方法用于在异步更新option-data之后重新获取到最新值 */
        globalModel: {
          formModel: this.formDataModel,
        },
        previewState: this.previewState,
      }
    },
    data() {
      return {
        formJsonObj: this.formJson,

        formDataModel: {
          //
        },

        widgetRefList: {},
        subFormRefList: {},
        formId: null,  //表单唯一Id，用于区分页面上的多个v-form-render组件！！

        externalComponents:  {},  //外部组件实例集合
      }
    },
    computed: {
      formConfig() {
        return this.formJsonObj.formConfig
      },

      widgetList() {
        return this.formJsonObj.widgetList
      },

      labelPosition() {
        if (!!this.formConfig && !!this.formConfig.labelPosition) {
          return this.formConfig.labelPosition
        }

        return 'left'
      },

      labelWidth() {
        if (!!this.formConfig && !!this.formConfig.labelWidth) {
          return this.formConfig.labelWidth + 'px'
        }

        return '80px'
      },

      size() {
        if (!!this.formConfig && !!this.formConfig.size) {
          return this.formConfig.size
        }

        return 'medium'
      },

      customClass() {
        return !!this.formConfig && !!this.formConfig.customClass ? this.formConfig.customClass : ''
      },

    },
    watch: {
      //
    },
    created() {
      this.buildFormModel(!this.formJsonObj ? null : this.formJsonObj.widgetList)
      this.initFormObject()
    },
    mounted() {
      this.initLocale()
      this.handleOnMounted()
    },
    methods: {
      initFormObject(insertHtmlCodeFlag = true) {
        this.formId = 'vfRender' + generateId()
        if (!!insertHtmlCodeFlag) {
          this.insertCustomStyleAndScriptNode()
        }
        this.addFieldChangeEventHandler()
        this.addFieldValidateEventHandler()
        this.registerFormToRefList()
        this.handleOnCreated()
      },

      getContainerWidgetName(widget) {
        if (widget.type === 'grid') {  //grid-item跟VueGridLayout全局注册组件重名，故特殊处理！！
          return 'vf-grid-item'
        }

        return widget.type + '-item'
      },

      getWidgetName(widget) {
        return widget.type + '-widget'
      },

      initLocale() {
        let curLocale = localStorage.getItem('v_form_locale') || 'zh-CN'
        this.changeLanguage(curLocale)
      },

      insertCustomStyleAndScriptNode() {
        if (!!this.formConfig && !!this.formConfig.cssCode) {
          insertCustomCssToHead(this.formConfig.cssCode,
              !!this.previewState ? '' : this.formId)
        }

        if (!!this.formConfig && !!this.formConfig.functions) {
          insertGlobalFunctionsToHtml(this.formConfig.functions,
              !!this.previewState ? '' : this.formId)
        }
      },

      buildFormModel(widgetList) {
        if (!!widgetList && (widgetList.length > 0)) {
          widgetList.forEach((wItem) => {
            this.buildDataFromWidget(wItem)
          })
        }
      },

      buildDataFromWidget(wItem) {
        if (wItem.category === 'container') {
          if (wItem.type === 'grid') {
            if (!!wItem.cols && (wItem.cols.length > 0)) {
              wItem.cols.forEach((childItem) => {
                this.buildDataFromWidget(childItem)
              })
            }
          } else if (wItem.type === 'table') {
            if (!!wItem.rows && (wItem.rows.length > 0)) {
              wItem.rows.forEach((rowItem) => {
                if (!!rowItem.cols && (rowItem.cols.length > 0)) {
                  rowItem.cols.forEach((colItem) => {
                    this.buildDataFromWidget(colItem)
                  })
                }
              })
            }
          } else if (wItem.type === 'tab') {
            if (!!wItem.tabs && (wItem.tabs.length > 0)) {
              wItem.tabs.forEach((tabItem) => {
                if (!!tabItem.widgetList && (tabItem.widgetList.length > 0)) {
                  tabItem.widgetList.forEach((childItem) => {
                    this.buildDataFromWidget(childItem)
                  })
                }
              })
            }
          } else if (wItem.type === 'sub-form') {
            let subFormName = wItem.options.name
            if (!this.formData.hasOwnProperty(subFormName)) {
              let subFormDataRow = {}
              if (wItem.options.showBlankRow) {
                wItem.widgetList.forEach(subFormItem => {
                  if (!!subFormItem.formItemFlag) {
                    subFormDataRow[subFormItem.options.name] = subFormItem.options.defaultValue
                  }
                })

                this.$set(this.formDataModel, subFormName, [subFormDataRow])  //
              } else {
                this.$set(this.formDataModel, subFormName, [])  //
              }
            } else {
              let initialValue = this.formData[subFormName]
              this.$set(this.formDataModel, subFormName, deepClone(initialValue))
            }
          } else if ((wItem.type === 'grid-col') || (wItem.type === 'table-cell')) {
            if (!!wItem.widgetList && (wItem.widgetList.length > 0)) {
              wItem.widgetList.forEach((childItem) => {
                this.buildDataFromWidget(childItem)
              })
            }
          } else {  //自定义容器组件
            if (!!wItem.widgetList && (wItem.widgetList.length > 0)) {
              wItem.widgetList.forEach((childItem) => {
                this.buildDataFromWidget(childItem)
              })
            }
          }
        } else if (!!wItem.formItemFlag) {
          if (!this.formData.hasOwnProperty(wItem.options.name)) {
            //this.formDataModel[wItem.options.name] = '' //这种写法不支持对象属性响应式更新，必须用$set方法！！
            this.$set(this.formDataModel, wItem.options.name, wItem.options.defaultValue)  //设置字段默认值
          } else {
            let initialValue = this.formData[wItem.options.name]
            this.$set(this.formDataModel, wItem.options.name, deepClone(initialValue))
          }
        }
      },

      addFieldChangeEventHandler() {
        this.$off('fieldChange')  //移除原有事件监听
        this.$on('fieldChange', (fieldName, newValue, oldValue, subFormName, subFormRowIndex) => {
          this.handleFieldDataChange(fieldName, newValue, oldValue, subFormName, subFormRowIndex)
          this.$emit('formChange', fieldName, newValue, oldValue, this.formDataModel, subFormName, subFormRowIndex)
        })
      },

      addFieldValidateEventHandler() {
        this.$off('fieldValidation')  //移除原有事件监听
        this.$on('fieldValidation', (fieldName) => {
          this.$refs.renderForm.validateField(fieldName)
        })
      },

      registerFormToRefList() {
        this.widgetRefList['v_form_ref'] = this
      },

      handleFieldDataChange(fieldName, newValue, oldValue, subFormName, subFormRowIndex) {
        if (!!this.formConfig && !!this.formConfig.onFormDataChange) {
          let customFunc = new Function('fieldName', 'newValue', 'oldValue', 'formModel', 'subFormName', 'subFormRowIndex',
              this.formConfig.onFormDataChange)
          customFunc.call(this, fieldName, newValue, oldValue, this.formDataModel, subFormName, subFormRowIndex)
        }
      },

      handleOnCreated() {
        if (!!this.formConfig && !!this.formConfig.onFormCreated) {
          let customFunc = new Function(this.formConfig.onFormCreated)
          customFunc.call(this)
        }
      },

      handleOnMounted() {
        if (!!this.formConfig && !!this.formConfig.onFormMounted) {
          let customFunc = new Function(this.formConfig.onFormMounted)
          customFunc.call(this)
        }
      },

      findWidgetAndSetDisabled(widgetName, disabledFlag) {
        let foundW = this.getWidgetRef(widgetName)
        if (!!foundW) {
          foundW.setDisabled(disabledFlag)
        } else { //没找到，可能是子表单中的组件
          this.findWidgetOfSubFormAndSetDisabled(widgetName, disabledFlag)
        }
      },

      findWidgetOfSubFormAndSetDisabled(widgetName, disabledFlag) {
        this.findWidgetNameInSubForm(widgetName).forEach(wn => {
          let sw = this.getWidgetRef(wn)
          if (!!sw) {
            sw.setDisabled(disabledFlag)
          }
        })
      },

      findWidgetAndSetHidden(widgetName, hiddenFlag) {
        let foundW = this.getWidgetRef(widgetName)
        if (!!foundW) {
          foundW.setHidden(hiddenFlag)
        } else { //没找到，可能是子表单中的组件
          this.findWidgetOfSubFormAndSetHidden(widgetName, hiddenFlag)
        }
      },

      findWidgetOfSubFormAndSetHidden(widgetName, hiddenFlag) {
        this.findWidgetNameInSubForm(widgetName).forEach(wn => {
          let sw = this.getWidgetRef(wn)
          if (!!sw) {
            sw.setHidden(hiddenFlag)
          }
        })
      },

      findWidgetNameInSubForm(widgetName) {
        let result = []
        let subFormName = null
        let handlerFn = (field, parent) => {
          if (!!field.options && (field.options.name === widgetName)) {
            subFormName = parent.options.name
          }
        }
        traverseFieldWidgets(this.widgetList, handlerFn)

        if (!!subFormName) {
          let subFormRef = this.getWidgetRef(subFormName)
          if (!!subFormRef) {
            let rowIds = subFormRef.getRowIdData()
            if (!!rowIds && (rowIds.length > 0)) {
              rowIds.forEach(rid => {
                result.push( widgetName + '@row' + rid)
              })
            }
          }
        }

        return result
      },

      //--------------------- 以下为组件支持外部调用的API方法 begin ------------------//
      /* 提示：用户可自行扩充这些方法！！！ */

      changeLanguage(langName) {
        changeLocale(langName)
      },

      getNativeForm() { //获取原生form引用
        return this.$refs['renderForm']
      },

      getFormRef() {
        return this
      },

      getWidgetRef(widgetName, showError = false) {
        let foundRef = this.widgetRefList[widgetName]
        if (!foundRef && !!showError) {
          this.$message.error(this.i18nt('render.hint.refNotFound') + widgetName)
        }
        return foundRef
      },

      clearFormDataModel() {
        for (let pkey in this.formDataModel) {
          delete this.formDataModel[pkey]
        }
      },

      /**
       * 动态加载表单JSON
       * @param newFormJson
       */
      setFormJson(newFormJson) {
        if (!!newFormJson) {
          if ((typeof newFormJson === 'string') || (newFormJson.constructor === Object)) {
            let newFormJsonObj = null
            if (typeof newFormJson === 'string') {
              newFormJsonObj = JSON.parse(newFormJson)
            } else {
              newFormJsonObj = newFormJson
            }

            if (!newFormJsonObj.formConfig || !newFormJsonObj.widgetList) {
              this.$message.error('Invalid format of form json.')
              return
            }

            /* formDataModel必须在widgetList赋值完成初始化，因为widgetList赋值意味着子组件开始创建！！！ */
            //this.formDataModel = {}  //清空表单数据对象（有bug，会导致表单校验失败！！）
            this.clearFormDataModel()  //上行代码有问题，会导致表单校验失败，故保留原对象引用只清空对象属性！！
            this.buildFormModel(newFormJsonObj.widgetList)

            this.$set(this.formJsonObj, 'formConfig', newFormJsonObj.formConfig)
            this._provided.formConfig = newFormJsonObj.formConfig  //强制更新provide的formConfig对象
            this.$set(this.formJsonObj, 'widgetList', newFormJsonObj.widgetList)

            this.insertCustomStyleAndScriptNode()  /* 必须先插入表单全局函数，否则VForm内部引用全局函数会报错！！！ */
            this.$nextTick(() => {
              this.initFormObject(false)
              this.handleOnMounted()
            })
          } else {
            this.$message.error('Set form json failed.')
          }
        }
      },

      /**
       * 重新加载选项数据
       * @param widgetNames 指定重新加载的组件名称或组件名数组，不传则重新加载所有选项字段
       */
      reloadOptionData(widgetNames) {
        let eventParams = []
        if (!!widgetNames && (typeof widgetNames === 'string')) {
          eventParams = [widgetNames]
        } else if (!!widgetNames && Array.isArray(widgetNames)) {
          eventParams = [...widgetNames]
        }
        this.broadcast('FieldWidget', 'reloadOptionItems', [eventParams])
      },

      getFormData(needValidation = true) {
        if (!needValidation) {
          return this.formDataModel
        }

        let callback = function nullFunc() {}
        let promise = new window.Promise(function (resolve, reject) {
          callback = function(formData, error) {
            !error ? resolve(formData) : reject(error);
          };
        });

        this.$refs['renderForm'].validate((valid) => {
          if (valid) {
            callback(this.formDataModel)
          } else {
            callback(this.formDataModel, this.i18nt('render.hint.validationFailed'))
          }
        })

        return promise
      },

      setFormData(formData) { //设置表单数据
        Object.keys(this.formDataModel).forEach(propName => {
          if (!!formData && formData.hasOwnProperty(propName)) {
            this.formDataModel[propName] = deepClone( formData[propName] )
          }
        })

        // 通知SubForm组件：表单数据更新事件！！
        this.broadcast('ContainerItem', 'setFormData', this.formDataModel)
        // 通知FieldWidget组件：表单数据更新事件！！
        this.broadcast('FieldWidget', 'setFormData', this.formDataModel)
      },

      getFieldValue(fieldName) { //单个字段获取值
        let fieldRef = this.getWidgetRef(fieldName)
        if (!!fieldRef && !!fieldRef.getValue) {
          return fieldRef.getValue()
        }

        if (!fieldRef) { //如果是子表单字段
          let result = []
          this.findWidgetNameInSubForm(fieldName).forEach(wn => {
            let sw = this.getWidgetRef(wn)
            if (!!sw && !!sw.getValue) {
              result.push( sw.getValue() )
            }
          })

          return result
        }
      },

      setFieldValue(fieldName, fieldValue) { //单个更新字段值
        let fieldRef = this.getWidgetRef(fieldName)
        if (!!fieldRef && !!fieldRef.setValue) {
          fieldRef.setValue(fieldValue)
        }

        if (!fieldRef) { //如果是子表单字段
          this.findWidgetNameInSubForm(fieldName).forEach(wn => {
            let sw = this.getWidgetRef(wn)
            if (!!sw && !!sw.setValue) {
              sw.setValue(fieldValue)
            }
          })
        }
      },

      getSubFormValues(subFormName, needValidation = true) {
        let foundSFRef = this.subFormRefList[subFormName]
        return foundSFRef.getSubFormValues(needValidation)
      },

      setSubFormValues(subFormName, subFormValues) {
        //TODO: 待实现！！
      },

      disableForm() {
        let wNameList = Object.keys(this.widgetRefList)
        wNameList.forEach(wName => {
          let foundW = this.getWidgetRef(wName)
          if (!!foundW) {
            if (!!foundW.widget && (foundW.widget.type === 'sub-form')) {
              foundW.disableSubForm()
            } else {
              !!foundW.setDisabled && foundW.setDisabled(true)
            }
          }
        })
      },

      enableForm() {
        let wNameList = Object.keys(this.widgetRefList)
        wNameList.forEach(wName => {
          let foundW = this.getWidgetRef(wName)
          if (!!foundW) {
            if (!!foundW.widget && (foundW.widget.type === 'sub-form')) {
              foundW.enableSubForm()
            } else {
              !!foundW.setDisabled && foundW.setDisabled(false)
            }
          }
        })
      },

      resetForm() {  //重置表单
        let subFormNames = Object.keys(this.subFormRefList)
        subFormNames.forEach(sfName => {
          if (!!this.subFormRefList[sfName].resetSubForm) {
            this.subFormRefList[sfName].resetSubForm()
          }
        })

        let wNameList = Object.keys(this.widgetRefList)
        wNameList.forEach(wName => {
          let foundW = this.getWidgetRef(wName)
          if (!!foundW && !foundW.subFormItemFlag && !!foundW.resetField) { // 跳过子表单字段！！
            foundW.resetField()
          }
        })

        this.$nextTick(() => {
          this.clearValidate()  /* 清除resetField方法触发的校验错误提示 */
        })
      },

      clearValidate(props) {
        this.$refs.renderForm.clearValidate(props)
      },

      /**
       * 校验表单
       * @param callback 回调函数
       */
      validateForm(callback) {
        this.$refs['renderForm'].validate((valid) => {
          callback(valid)
        })
      },

      validateFields() {
        //
      },

      disableWidgets(widgetNames) {
        if (!!widgetNames) {
          if (typeof widgetNames === 'string') {
            this.findWidgetAndSetDisabled(widgetNames, true)
          } else if (Array.isArray(widgetNames)) {
            widgetNames.forEach(wn => {
              this.findWidgetAndSetDisabled(wn, true)
            })
          }
        }
      },

      enableWidgets(widgetNames) {
        if (!!widgetNames) {
          if (typeof widgetNames === 'string') {
            this.findWidgetAndSetDisabled(widgetNames, false)
          } else if (Array.isArray(widgetNames)) {
            widgetNames.forEach(wn => {
              this.findWidgetAndSetDisabled(wn, false)
            })
          }
        }
      },

      hideWidgets(widgetNames) {
        if (!!widgetNames) {
          if (typeof widgetNames === 'string') {
            this.findWidgetAndSetHidden(widgetNames, true)
          } else if (Array.isArray(widgetNames)) {
            widgetNames.forEach(wn => {
              this.findWidgetAndSetHidden(wn, true)
            })
          }
        }
      },

      showWidgets(widgetNames) {
        if (!!widgetNames) {
          if (typeof widgetNames === 'string') {
            this.findWidgetAndSetHidden(widgetNames, false)
          } else if (Array.isArray(widgetNames)) {
            widgetNames.forEach(wn => {
              this.findWidgetAndSetHidden(wn, false)
            })
          }
        }
      },

      /**
       * 获取所有字段组件
       * @returns {*[]}
       */
      getFieldWidgets(widgetList = null) {
        return !!widgetList ? getAllFieldWidgets(widgetList) : getAllFieldWidgets(this.formJsonObj.widgetList)
      },

      /**
       * 获取所有容器组件
       * @returns {*[]}
       */
      getContainerWidgets(widgetList = null) {
        return !!widgetList ? getAllContainerWidgets(widgetList) : getAllContainerWidgets(this.formJsonObj.widgetList)
      },

      /**
       * 增加外部组件引用，可通过getEC()方法获取外部组件，以便在VForm内部调用外部组件方法
       * @param componentName 外部组件名称
       * @param externalComponent 外部组件实例
       */
      addEC(componentName, externalComponent) {
        this.externalComponents[componentName] = externalComponent
      },

      /**
       * 判断外部组件是否可获取
       * @param componentName 外部组件名称
       * @returns {boolean}
       */
      hasEC(componentName) {
        return this.externalComponents.hasOwnProperty(componentName)
      },

      /**
       * 获取外部组件实例
       * @param componentName
       * @returns {*}
       */
      getEC(componentName) {
        return this.externalComponents[componentName]
      },

      /**
       * 获取globalDsv对象
       * @returns {*}
       */
      getGlobalDsv() {
        return this.globalDsv
      },

      //--------------------- 以上为组件支持外部调用的API方法 end ------------------//

    },
  }
</script>

<style lang="scss" scoped>
  .el-form ::v-deep .el-row {
    padding: 8px;
  }
</style>
