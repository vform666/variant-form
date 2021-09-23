<template>
  <div class="toolbar-container">
    <div class="left-toolbar">
      <el-button type="text" :disabled="undoDisabled" :title="i18nt('designer.toolbar.undoHint')" @click="undoHistory">
        <svg-icon icon-class="undo" /></el-button>
      <el-button type="text" :disabled="redoDisabled" :title="i18nt('designer.toolbar.redoHint')" @click="redoHistory">
        <svg-icon icon-class="redo" /></el-button>
      <el-button-group style="margin-left: 20px">
        <el-button :type="layoutType === 'PC' ? 'primary': ''" @click="changeLayoutType('PC')">
          {{i18nt('designer.toolbar.pcLayout')}}</el-button>
        <el-button :type="layoutType === 'H5' ? 'primary': ''" @click="changeLayoutType('H5')">
          {{i18nt('designer.toolbar.mobileLayout')}}</el-button>
      </el-button-group>
    </div>

    <div class="right-toolbar">
      <el-button type="text" @click="clearFormWidget"><i class="el-icon-delete" />{{i18nt('designer.toolbar.clear')}}</el-button>
      <el-button type="text" @click="previewForm"><i class="el-icon-view" />{{i18nt('designer.toolbar.preview')}}</el-button>
      <el-button type="text" @click="importJson">{{i18nt('designer.toolbar.importJson')}}</el-button>
      <el-button type="text" @click="exportJson">{{i18nt('designer.toolbar.exportJson')}}</el-button>
      <el-button type="text" @click="exportCode">{{i18nt('designer.toolbar.exportCode')}}</el-button>
      <el-button type="text" @click="generateSFC"><svg-icon icon-class="vue-sfc" />{{i18nt('designer.toolbar.generateSFC')}}</el-button>
    </div>

    <el-dialog :title="i18nt('designer.toolbar.preview')" :visible.sync="showPreviewDialogFlag" v-if="showPreviewDialogFlag"
               :show-close="true" :close-on-click-modal="false" :close-on-press-escape="false" center v-dialog-drag
               :destroy-on-close="true" class="small-padding-dialog" width="75%" :fullscreen="layoutType === 'H5'">
      <div>
        <div class="form-render-wrapper" :class="[layoutType === 'H5' ? 'h5-layout' : '']">
          <VFormRender ref="preForm" :form-json="formJson" :form-data="testFormData"
                       @appendButtonClick="testOnAppendButtonClick" @buttonClick="testOnButtonClick"
                       @formChange="handleFormChange"></VFormRender>
        </div>
      </div>
      <code-editor v-model="testFunc" style="display: none"></code-editor>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getFormData">{{i18nt('designer.hint.getFormData')}}</el-button>
        <el-button type="primary" @click="resetForm">{{i18nt('designer.hint.resetForm')}}</el-button>
        <el-button type="primary" @click="setFormDisabled">{{i18nt('designer.hint.disableForm')}}</el-button>
        <el-button type="primary" @click="setFormEnabled">{{i18nt('designer.hint.enableForm')}}</el-button>
        <el-button type="" @click="showPreviewDialogFlag = false">{{i18nt('designer.hint.closePreview')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="i18nt('designer.toolbar.importJson')" :visible.sync="showImportJsonDialogFlag"
               v-if="showImportJsonDialogFlag" :show-close="true" class="small-padding-dialog" center v-dialog-drag
               :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true">
      <el-alert type="info" :title="i18nt('designer.hint.importJsonHint')" show-icon></el-alert>
      <code-editor :mode="'json'" :readonly="false" v-model="importTemplate"></code-editor>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doJsonImport">
          {{i18nt('designer.hint.import')}}</el-button>
        <el-button @click="showImportJsonDialogFlag = false">
          {{i18nt('designer.hint.cancel')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="i18nt('designer.toolbar.exportJson')" :visible.sync="showExportJsonDialogFlag"
               v-if="showExportJsonDialogFlag" :show-close="true" class="small-padding-dialog" center v-dialog-drag
               :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true">
      <code-editor :mode="'json'" :readonly="true" v-model="jsonContent"></code-editor>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="copy-json-btn" :data-clipboard-text="jsonRawContent" @click="copyFormJson">
          {{i18nt('designer.hint.copyJson')}}</el-button>
        <el-button @click="saveFormJson">{{i18nt('designer.hint.saveFormJson')}}</el-button>
        <el-button type="" @click="showExportJsonDialogFlag = false">
          {{i18nt('designer.hint.closePreview')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="i18nt('designer.toolbar.exportCode')" :visible.sync="showExportCodeDialogFlag"
               v-if="showExportCodeDialogFlag" :show-close="true" class="small-padding-dialog" center v-dialog-drag
               width="65%" :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true">
      <el-tabs type="border-card" class="no-box-shadow no-padding" v-model="activeCodeTab">
        <el-tab-pane label="Vue" name="vue">
          <code-editor :mode="'html'" :readonly="true" v-model="vueCode" :user-worker="false"></code-editor>
        </el-tab-pane>
        <el-tab-pane label="HTML" name="html">
          <code-editor :mode="'html'" :readonly="true" v-model="htmlCode" :user-worker="false"></code-editor>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="copy-vue-btn" :data-clipboard-text="vueCode" @click="copyVueCode">
          {{i18nt('designer.hint.copyVueCode')}}</el-button>
        <el-button type="primary" class="copy-html-btn" :data-clipboard-text="htmlCode" @click="copyHtmlCode">
          {{i18nt('designer.hint.copyHtmlCode')}}</el-button>
        <el-button @click="saveVueCode">{{i18nt('designer.hint.saveVueCode')}}</el-button>
        <el-button @click="saveHtmlCode">{{i18nt('designer.hint.saveHtmlCode')}}</el-button>
        <el-button type="" @click="showExportCodeDialogFlag = false">
          {{i18nt('designer.hint.closePreview')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="i18nt('designer.hint.exportFormData')" :visible.sync="showFormDataDialogFlag"
               v-if="showFormDataDialogFlag" :show-close="true" class="dialog-title-light-bg" center v-dialog-drag
               :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true"
               :append-to-body="true">
      <div style="border: 1px solid #DCDFE6">
        <code-editor :mode="'json'" :readonly="true" v-model="formDataJson"></code-editor>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="copy-form-data-json-btn" :data-clipboard-text="formDataRawJson" @click="copyFormDataJson">
          {{i18nt('designer.hint.copyFormData')}}</el-button>
        <el-button @click="saveFormData">{{i18nt('designer.hint.saveFormData')}}</el-button>
        <el-button type="" @click="showFormDataDialogFlag = false">
          {{i18nt('designer.hint.closePreview')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="i18nt('designer.toolbar.generateSFC')" :visible.sync="showExportSFCDialogFlag"
               v-if="showExportSFCDialogFlag" :show-close="true" class="small-padding-dialog" center v-dialog-drag
               width="65%" :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true">
      <el-tabs type="border-card" class="no-box-shadow no-padding" v-model="activeSFCTab">
        <el-tab-pane label="Vue2" name="vue2">
          <code-editor :mode="'html'" :readonly="true" v-model="sfcCode" :user-worker="false"></code-editor>
        </el-tab-pane>
        <el-tab-pane label="Vue3" name="vue3">
          <code-editor :mode="'html'" :readonly="true" v-model="sfcCodeV3" :user-worker="false"></code-editor>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="copy-vue2-sfc-btn" :data-clipboard-text="sfcCode" @click="copyV2SFC">
          {{i18nt('designer.hint.copyVue2SFC')}}</el-button>
        <el-button type="primary" class="copy-vue3-sfc-btn" :data-clipboard-text="sfcCodeV3" @click="copyV3SFC">
          {{i18nt('designer.hint.copyVue3SFC')}}</el-button>
        <el-button @click="saveV2SFC">{{i18nt('designer.hint.saveVue2SFC')}}</el-button>
        <el-button @click="saveV3SFC">{{i18nt('designer.hint.saveVue3SFC')}}</el-button>
        <el-button type="" @click="showExportSFCDialogFlag = false">
          {{i18nt('designer.hint.closePreview')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import VFormRender from '@/components/form-render/index'
  import CodeEditor from '@/components/code-editor/index'
  import Clipboard from 'clipboard'
  import {deepClone, copyToClipboard, generateId, getQueryParam} from "@/utils/util";
  import i18n from '@/utils/i18n'
  import {generateCode} from "@/utils/code-generator";
  import {genSFC} from "@/utils/sfc-generator";
  import loadBeautifier from "@/utils/beautifierLoader";
  import { saveAs } from 'file-saver'

  export default {
    name: "ToolbarPanel",
    mixins: [i18n],
    components: {
      VFormRender,
      CodeEditor,
      Clipboard,
    },
    props: {
      designer: Object
    },
    data() {
      return {
        showPreviewDialogFlag: false,
        showImportJsonDialogFlag: false,
        showExportJsonDialogFlag: false,
        showExportCodeDialogFlag: false,
        showFormDataDialogFlag: false,
        showExportSFCDialogFlag: false,

        testFunc: '',
        importTemplate: '',
        jsonContent: '',
        jsonRawContent: '',

        formDataJson: '',
        formDataRawJson: '',

        vueCode: '',
        htmlCode: '',

        sfcCode: '',
        sfcCodeV3: '',

        activeCodeTab: 'vue',
        activeSFCTab: 'vue2',

        testFormData: {
          // 'userName': '666888',
          // 'productItems': [
          //   {'pName': 'iPhone12', 'pNum': 10},
          //   {'pName': 'P50', 'pNum': 16},
          // ]
        },
      }
    },
    computed: {
      formJson() {
        return {
          widgetList: this.designer.widgetList,
          formConfig: this.designer.formConfig
        }
      },

      undoDisabled() {
        return !this.designer.undoEnabled()
      },

      redoDisabled() {
        return !this.designer.redoEnabled()
      },

      layoutType() {
        return this.designer.getLayoutType()
      },

    },
    methods: {
      undoHistory() {
        this.designer.undoHistoryStep()
      },

      redoHistory() {
        this.designer.redoHistoryStep()
      },

      changeLayoutType(newType) {
        this.designer.changeLayoutType(newType)
      },

      clearFormWidget() {
        this.designer.clearDesigner()
      },

      previewForm() {
        this.showPreviewDialogFlag = true
      },

      saveAsFile(fileContent, defaultFileName) {
        this.$prompt(this.i18nt('designer.hint.fileNameForSave'), this.i18nt('designer.hint.saveFileTitle'), {
          inputValue: defaultFileName,
          closeOnClickModal: false,
          inputPlaceholder: this.i18nt('designer.hint.fileNameInputPlaceholder')
        }).then(({ value }) => {
          if (!value) {
            value = defaultFileName
          }

          if (getQueryParam('vscode') == 1) {
            this.vsSaveFile(value, fileContent)
            return
          }

          const fileBlob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' })
          saveAs(fileBlob ,value)
        }).catch(() => {
          //
        })
      },

      vsSaveFile(fileName, fileContent) {
        const msgObj = {
          cmd: 'writeFile',
          data: {
            fileName,
            code: fileContent
          }
        }
        window.parent.postMessage(msgObj, '*')
      },

      importJson() {
        this.importTemplate = JSON.stringify(this.designer.getImportTemplate(), null, '  ')
        this.showImportJsonDialogFlag = true
      },

      doJsonImport() {
        try {
          let importObj = JSON.parse(this.importTemplate)
          this.designer.loadFormJson(importObj)

          this.showImportJsonDialogFlag = false
          this.$message.success(this.i18nt('designer.hint.importJsonSuccess'))

          this.designer.emitHistoryChange()
        } catch(ex) {
          this.$message.error(ex + '')
        }
      },

      exportJson() {
        let widgetList = deepClone(this.designer.widgetList)
        let formConfig = deepClone(this.designer.formConfig)
        this.jsonContent = JSON.stringify({widgetList, formConfig}, null, '  ')
        this.jsonRawContent = JSON.stringify({widgetList, formConfig})
        this.showExportJsonDialogFlag = true
      },

      copyFormJson(e) {
        copyToClipboard(this.jsonRawContent, e,
            this.$message,
            this.i18nt('designer.hint.copyJsonSuccess'),
            this.i18nt('designer.hint.copyJsonFail')
        )
      },

      saveFormJson() {
        this.saveAsFile(this.jsonContent, `vform${generateId()}.json`)
      },

      exportCode() {
        this.vueCode = generateCode(this.formJson)
        this.htmlCode = generateCode(this.formJson, 'html')
        this.showExportCodeDialogFlag = true
      },

      copyVueCode(e) {
        copyToClipboard(this.vueCode, e,
            this.$message,
            this.i18nt('designer.hint.copyVueCodeSuccess'),
            this.i18nt('designer.hint.copyVueCodeFail')
        )
      },

      copyHtmlCode(e) {
        copyToClipboard(this.htmlCode, e,
            this.$message,
            this.i18nt('designer.hint.copyHtmlCodeSuccess'),
            this.i18nt('designer.hint.copyHtmlCodeFail')
        )
      },

      saveVueCode() {
        this.saveAsFile(this.vueCode, `vform${generateId()}.vue`)
      },

      saveHtmlCode() {
        this.saveAsFile(this.htmlCode, `vform${generateId()}.html`)
      },

      generateSFC() {
        loadBeautifier(beautifier => {
          this.sfcCode = genSFC(this.designer.formConfig, this.designer.widgetList, beautifier)
          this.sfcCodeV3 = genSFC(this.designer.formConfig, this.designer.widgetList, beautifier, true)
          this.showExportSFCDialogFlag = true
        })
      },

      copyV2SFC(e) {
        copyToClipboard(this.sfcCode, e,
            this.$message,
            this.i18nt('designer.hint.copySFCSuccess'),
            this.i18nt('designer.hint.copySFCFail')
        )
      },

      copyV3SFC(e) {
        copyToClipboard(this.sfcCodeV3, e,
            this.$message,
            this.i18nt('designer.hint.copySFCSuccess'),
            this.i18nt('designer.hint.copySFCFail')
        )
      },

      saveV2SFC() {
        this.saveAsFile(this.sfcCode, `vformV2-${generateId()}.vue`)
      },

      saveV3SFC() {
        this.saveAsFile(this.sfcCodeV3, `vformV3-${generateId()}.vue`)
      },

      getFormData() {
        this.$refs['preForm'].getFormData().then(formData => {
          this.formDataJson = JSON.stringify(formData, null, '  ')
          this.formDataRawJson = JSON.stringify(formData)

          this.showFormDataDialogFlag = true
        }).catch(error => {
          this.$message.error(error)
        })
      },

      copyFormDataJson(e) {
        copyToClipboard(this.formDataRawJson, e,
            this.$message,
            this.i18nt('designer.hint.copyJsonSuccess'),
            this.i18nt('designer.hint.copyJsonFail')
        )
      },

      saveFormData() {
        this.saveAsFile(this.htmlCode, `formData${generateId()}.json`)
      },

      resetForm() {
        this.$refs['preForm'].resetForm()
      },

      setFormDisabled() {
        this.$refs['preForm'].disableForm()
      },

      setFormEnabled() {
        this.$refs['preForm'].enableForm()
      },

      handleFormChange(fieldName, newValue, oldValue, formModel) {
        console.log('---formChange start---')
        console.log('fieldName', fieldName)
        console.log('newValue', newValue)
        console.log('oldValue', oldValue)
        console.log('formModel', formModel)
        console.log('---formChange end---')
      },

      testOnAppendButtonClick(clickedWidget) {
        console.log('test', clickedWidget)
      },

      testOnButtonClick(button) {
        console.log('test', button)
      },

    }
  }
</script>

<style lang="scss" scoped>
  div.toolbar-container {

  }

  .left-toolbar {
    float: left;
    font-size: 16px;
  }

  .right-toolbar {
    float: right;

    ::v-deep .el-button--text {
      font-size: 14px !important;
    }
  }

  .el-button i {
    margin-right: 3px;
  }

  .small-padding-dialog {
    ::v-deep .el-dialog__header {
      padding-top: 3px;
      padding-bottom: 3px;
      background: #f1f2f3;
    }

    ::v-deep .el-dialog__body {
      padding: 12px 15px 12px 15px;

      .el-alert {
        padding: 0 10px;
      }
    }

    ::v-deep .ace-container {
      border: 1px solid #DCDFE6;
    }
  }

  .dialog-title-light-bg {
    ::v-deep .el-dialog__header {
      background: #f1f2f3;
    }
  }

  .no-box-shadow {
    box-shadow: none;
  }

  .no-padding.el-tabs--border-card {
    ::v-deep .el-tabs__content {
      padding: 0;
    }
  }

  .form-render-wrapper {
    //height: calc(100vh - 142px);
  }

  .form-render-wrapper.h5-layout {
    margin: 0 auto;
    width: 420px;
    border-radius: 15px;
    //border-width: 10px;
    box-shadow: 0 0 1px 10px #495060;
    height: calc(100vh - 142px);
  }
</style>
