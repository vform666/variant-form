<template>
  <el-container class="panel-container">
    <el-tabs :active-name="activeTab" style="height: 100%; overflow: hidden">
      <el-tab-pane :label="i18nt('designer.hint.widgetSetting')" name="1">
        <el-scrollbar class="setting-scrollbar" :style="{height: scrollerHeight}">

          <template v-if="!!designer.selectedWidget && !designer.selectedWidget.category">
            <el-form :model="optionModel" size="mini" label-position="left" label-width="120px" class="setting-form"
                     @submit.native.prevent>
              <el-collapse v-model="widgetActiveCollapseNames" class="setting-collapse">
                <el-collapse-item name="1" v-if="showCollapse(commonProps)" :title="i18nt('designer.setting.commonSetting')">
                  <template v-for="(editorName, propName) in commonProps">
                    <component v-if="hasPropEditor(propName, editorName)" :is="getPropEditor(propName, editorName)"
                               :designer="designer" :selected-widget="selectedWidget" :option-model="optionModel"></component>
                  </template>
                </el-collapse-item>

                <el-collapse-item name="2" v-if="showCollapse(advProps)" :title="i18nt('designer.setting.advancedSetting')">
                  <template v-for="(editorName, propName) in advProps">
                    <component v-if="hasPropEditor(propName, editorName)" :is="getPropEditor(propName, editorName)"
                               :designer="designer" :selected-widget="selectedWidget" :option-model="optionModel"></component>
                  </template>
                </el-collapse-item>

                <el-collapse-item name="3" v-if="showEventCollapse() && showCollapse(eventProps)" :title="i18nt('designer.setting.eventSetting')">
                  <template v-for="(editorName, propName) in eventProps">
                    <component v-if="hasPropEditor(propName, editorName)" :is="getPropEditor(propName, editorName)"
                               :designer="designer" :selected-widget="selectedWidget" :option-model="optionModel"></component>
                  </template>
                </el-collapse-item>
              </el-collapse>

            </el-form>
          </template>

          <template v-if="(!!designer.selectedWidget && !!designer.selectedWidget.category)">
            <el-form :model="optionModel" size="mini" label-position="left" label-width="120px" class="setting-form"
                     @submit.native.prevent>
              <el-collapse v-model="widgetActiveCollapseNames" class="setting-collapse">
                <el-collapse-item name="1" v-if="showCollapse(commonProps)" :title="i18nt('designer.setting.commonSetting')">
                  <template v-for="(editorName, propName) in commonProps">
                    <component v-if="hasPropEditor(propName, editorName)" :is="getPropEditor(propName, editorName)"
                               :designer="designer" :selected-widget="selectedWidget" :option-model="optionModel"></component>
                  </template>
                </el-collapse-item>

                <el-collapse-item name="2" v-if="showCollapse(advProps)" :title="i18nt('designer.setting.advancedSetting')">
                  <template v-for="(editorName, propName) in advProps">
                    <component v-if="hasPropEditor(propName, editorName)" :is="getPropEditor(propName, editorName)"
                               :designer="designer" :selected-widget="selectedWidget" :option-model="optionModel"></component>
                  </template>
                </el-collapse-item>

                <el-collapse-item name="3" v-if="showEventCollapse() && showCollapse(eventProps)" :title="i18nt('designer.setting.eventSetting')">
                  <template v-for="(editorName, propName) in eventProps">
                    <component v-if="hasPropEditor(propName, editorName)" :is="getPropEditor(propName, editorName)"
                               :designer="designer" :selected-widget="selectedWidget" :option-model="optionModel"></component>
                  </template>
                </el-collapse-item>
              </el-collapse>
            </el-form>
          </template>

        </el-scrollbar>
      </el-tab-pane>

      <el-tab-pane v-if="!!designer" :label="i18nt('designer.hint.formSetting')" name="2">
        <el-scrollbar class="setting-scrollbar" :style="{height: scrollerHeight}">
          <form-setting :designer="designer" :form-config="formConfig"></form-setting>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="i18nt('designer.setting.editWidgetEventHandler')" :visible.sync="showWidgetEventDialogFlag"
               v-if="showWidgetEventDialogFlag" :show-close="true" class="small-padding-dialog" append-to-body v-dialog-drag
               :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true">
      <el-alert type="info" :closable="false" :title="eventHeader"></el-alert>
      <code-editor :mode="'javascript'" :readonly="false" v-model="eventHandlerCode" ref="ecEditor"></code-editor>
      <el-alert type="info" :closable="false" title="}"></el-alert>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showWidgetEventDialogFlag = false">
          {{i18nt('designer.hint.cancel')}}</el-button>
        <el-button type="primary" @click="saveEventHandler">
          {{i18nt('designer.hint.confirm')}}</el-button>
      </div>
    </el-dialog>

  </el-container>
</template>

<script>
  import CodeEditor from '@/components/code-editor/index'
  import PropertyEditors from './property-editor/index'
  import FormSetting from './form-setting'
  import WidgetProperties from './propertyRegister'
  import {
    addWindowResizeHandler,
  } from "@/utils/util";
  import i18n from "@/utils/i18n";
  import { propertyRegistered } from "@/components/form-designer/setting-panel/propertyRegister";

  const {COMMON_PROPERTIES, ADVANCED_PROPERTIES, EVENT_PROPERTIES} = WidgetProperties

  export default {
    name: "SettingPanel",
    componentName: "SettingPanel",
    mixins: [i18n],
    components: {
      CodeEditor,
      FormSetting,
      ...PropertyEditors,
    },
    props: {
      designer: Object,
      selectedWidget: Object,
      formConfig: Object,
      globalDsv: {
        type: Object,
        default: () => ({})
      },
    },
    provide() {
      return {
        isSubFormChildWidget: () => this.subFormChildWidgetFlag,
      }
    },
    inject: ['getDesignerConfig'],
    data() {
      return {
        designerConfig: this.getDesignerConfig(),

        scrollerHeight: 0,

        activeTab: "2",
        widgetActiveCollapseNames: ['1', '3'], //['1', '2', '3'],
        formActiveCollapseNames: ['1', '2'],

        commonProps: COMMON_PROPERTIES,
        advProps: ADVANCED_PROPERTIES,
        eventProps: EVENT_PROPERTIES,

        showWidgetEventDialogFlag: false,
        eventHandlerCode: '',
        curEventName: '',
        eventHeader: '',

        subFormChildWidgetFlag: false,
      }
    },
    computed: {
      optionModel: {
        get() {
          return this.selectedWidget.options
        },

        set(newValue) {
          this.selectedWidget.options = newValue
        }
      },

    },
    watch: {
      'designer.selectedWidget': {
        handler(val) {
          if (!!val) {
            this.activeTab = "1"
          }
        }
      },

      'selectedWidget.options': {  //组件属性变动后，立即保存表单JSON！！
        deep: true,
        handler() {
          this.designer.saveCurrentHistoryStep()
        }
      },

      formConfig: {
        deep: true,
        handler() {
          this.designer.saveCurrentHistoryStep()
        }
      },

    },
    created() {
      this.$on('editEventHandler', function (eventName, eventParams) {
        this.editEventHandler(eventName, eventParams)
      })

      this.designer.handleEvent('form-css-updated', (cssClassList) => {
        this.designer.setCssClassList(cssClassList)
      })

      //监听字段组件选中事件
      this.designer.handleEvent('field-selected', (parentWidget) => {
        this.subFormChildWidgetFlag = !!parentWidget && (parentWidget.type === 'sub-form');
        //console.log('subFormChildWidgetFlag', this.subFormChildWidgetFlag)
      })
    },
    mounted() {
      if (!this.designer.selectedWidget) {
        this.activeTab = "2"
      } else {
        this.activeTab = "1"
      }

      this.scrollerHeight = window.innerHeight - 56 - 48 + 'px'
      addWindowResizeHandler(() => {
        this.$nextTick(() => {
          this.scrollerHeight = window.innerHeight - 56 - 48 + 'px'
          //console.log(this.scrollerHeight)
        })
      })
    },
    methods: {
      showEventCollapse() {
        if (this.designerConfig['eventCollapse'] === undefined) {
          return true
        }

        return !!this.designerConfig['eventCollapse']
      },

      hasPropEditor(propName, editorName) {
        if (!editorName) {
          return false
        }

        /* alert组件注册了两个type属性编辑器，跳过第一个type属性编辑器，只显示第二个alert-type属性编辑器！！ */
        if (propName.indexOf('-') <= -1) {
          let uniquePropName = this.selectedWidget.type + '-' + propName
          if (propertyRegistered(uniquePropName)) {
            return false
          }
        }

        let originalPropName = propName.replace(this.selectedWidget.type + '-', '')  //去掉组件名称前缀-，如果有的话！！
        return this.designer.hasConfig(this.selectedWidget, originalPropName)
      },

      getPropEditor(propName, editorName) {
        let originalPropName = propName.replace(this.selectedWidget.type + '-', '')  //去掉组件名称前缀-，如果有的话！！
        let ownPropEditorName = `${this.selectedWidget.type}-${originalPropName}-editor`
        //console.log(ownPropEditorName, this.$options.components[ownPropEditorName])
        if (!!this.$options.components[ownPropEditorName]) {  //局部注册的属性编辑器组件
          return ownPropEditorName
        }

        return !!this.$root.$options.components[ownPropEditorName] ? ownPropEditorName : editorName  //全局注册的属性编辑器组件
      },

      showCollapse(propsObj) {
        let result = false

        for (let propName in propsObj) {
          if (!propsObj.hasOwnProperty(propName)) {
            continue
          }

          if (this.hasPropEditor(propName, propsObj[propName])) {
            result = true
            break
          }
        }

        return result
      },

      editEventHandler(eventName, eventParams) {
        this.curEventName = eventName
        this.eventHeader = `${this.optionModel.name}.${eventName}(${eventParams.join(', ')}) {`
        this.eventHandlerCode = this.selectedWidget.options[eventName] || ''

        // 设置字段校验函数示例代码
        if ((eventName === 'onValidate') && (!this.optionModel['onValidate'])) {
          this.eventHandlerCode = "  /* sample code */\n  /*\n  if ((value > 100) || (value < 0)) {\n    callback(new Error('error message'))  //fail\n  } else {\n    callback();  //pass\n  }\n  */"
        }

        this.showWidgetEventDialogFlag = true
      },

      saveEventHandler() {
        const codeHints = this.$refs.ecEditor.getEditorAnnotations()
        let syntaxErrorFlag = false
        if (!!codeHints && (codeHints.length > 0)) {
          codeHints.forEach((chItem) => {
            if (chItem.type === 'error') {
              syntaxErrorFlag = true
            }
          })

          if (syntaxErrorFlag) {
            this.$message.error(this.i18nt('designer.setting.syntaxCheckWarning'))
            return
          }
        }

        this.selectedWidget.options[this.curEventName] = this.eventHandlerCode
        this.showWidgetEventDialogFlag = false
      },

    }
  }
</script>

<style lang="scss" scoped>
  .panel-container {
    padding: 0 8px;
  }

  .setting-scrollbar {
    ::v-deep .el-scrollbar__wrap {
      overflow-x: hidden; /* IE浏览器隐藏水平滚动条箭头！！ */
    }
  }

  .setting-collapse {
    ::v-deep .el-collapse-item__content {
      padding-bottom: 6px;
    }

    ::v-deep .el-collapse-item__header {
      font-style: italic;
      font-weight: bold;
    }
  }

  .setting-form {
    ::v-deep .el-form-item__label {
      font-size: 13px;
      //text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    ::v-deep .el-form-item--mini.el-form-item {
      margin-bottom: 6px;
    }
  }

  /* 隐藏Chrome浏览器中el-input数字输入框右侧的上下调整小箭头 */
  ::v-deep .hide-spin-button input::-webkit-outer-spin-button,
  ::v-deep .hide-spin-button input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }

  /* 隐藏Firefox浏览器中el-input数字输入框右侧的上下调整小箭头 */
  ::v-deep .hide-spin-button input[type="number"] {
    -moz-appearance: textfield;
  }

  ::v-deep .custom-divider.el-divider--horizontal {
    margin: 10px 0;
  }

  ::v-deep .custom-divider-margin-top.el-divider--horizontal {
    margin: 20px 0;
  }

  .small-padding-dialog {
    ::v-deep .el-dialog__body {
      padding: 6px 15px 12px 15px;
    }
  }

</style>
