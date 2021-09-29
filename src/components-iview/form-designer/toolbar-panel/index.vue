<template>
	<div class="toolbar-container">
		<div class="left-toolbar">
			<Button type="text" :disabled="undoDisabled" :title="i18nt('designer.toolbar.undoHint')"
				@click="undoHistory" style="background-color: transparent;">
				<svg-icon icon-class="undo" />
			</Button>
			<Button type="text" :disabled="redoDisabled" :title="i18nt('designer.toolbar.redoHint')"
				@click="redoHistory" style="background-color: transparent;">
				<svg-icon icon-class="redo" />
			</Button>
			<ButtonGroup style="margin-left: 20px">
				<Button :type="layoutType === 'PC' ? 'primary': 'default'" @click="changeLayoutType('PC')">
					{{i18nt('designer.toolbar.pcLayout')}}
				</Button>
				<Button :type="layoutType === 'H5' ? 'primary': 'default'" @click="changeLayoutType('H5')">
					{{i18nt('designer.toolbar.mobileLayout')}}
				</Button>
			</ButtonGroup>
		</div>

		<div class="right-toolbar">
			<Button type="text" @click="clearFormWidget"><i class="ivu-icon ivu-icon-ios-trash" />{{i18nt('designer.toolbar.clear')}}</Button>
			<Button type="text" @click="previewForm"><i class="ivu-icon ivu-icon-ios-eye-outline" />{{i18nt('designer.toolbar.preview')}}</Button>
			<Button type="text" @click="importJson">{{i18nt('designer.toolbar.importJson')}}</Button>
			<Button type="text" @click="exportJson">{{i18nt('designer.toolbar.exportJson')}}</Button>
			<Button type="text" @click="exportCode">{{i18nt('designer.toolbar.exportCode')}}</Button>
			<Button type="text" v-if="false">{{i18nt('designer.toolbar.generateCode')}}</Button>
			<Button type="text" @click="generateSFC"><svg-icon icon-class="vue-sfc" />{{i18nt('designer.toolbar.generateSFC')}}</Button>
		</div>

		<Modal :title="i18nt('designer.toolbar.preview')"
			v-model="showPreviewDialogFlag" :closable="true" class="small-padding-dialog" draggable
			:mask-closable="false" width="1200" 
			:fullscreen ="layoutType === 'H5'">
			<div v-if="showPreviewDialogFlag">
				<div class="form-render-wrapper" :class="[layoutType === 'H5' ? 'h5-layout' : '']">
					<VFormRender ref="preForm" :form-json="formJson" :form-data="testFormData"
						@appendButtonClick="testOnAppendButtonClick" @buttonClick="testOnButtonClick"
						@formChange="handleFormChange" @change="handlerNativeChange"
						></VFormRender>
				</div>
			</div>
			<code-editor v-model="testFunc" style="display: none"></code-editor>
			<div slot="footer" class="dialog-footer">
				<Button type="primary" size="default" @click="getFormData">{{i18nt('designer.hint.getFormData')}}</Button>
				<Button type="primary" size="default" @click="resetForm">{{i18nt('designer.hint.resetForm')}}</Button>
				<Button type="primary" size="default" @click="setFormDisabled">{{i18nt('designer.hint.disableForm')}}</Button>
				<Button type="primary" size="default" @click="setFormEnabled">{{i18nt('designer.hint.enableForm')}}</Button>
				<Button type="default" size="default" @click="showPreviewDialogFlag = false">{{i18nt('designer.hint.closePreview')}}</Button>
			</div>
		</Modal>

		<Modal :title="i18nt('designer.toolbar.importJson')"
			v-model="showImportJsonDialogFlag" :closable="true" class="small-padding-dialog" width="800" draggable
			:mask-closable="false">
			<Alert show-icon>{{i18nt('designer.hint.importJsonHint')}}</Alert>
			<code-editor v-if="showImportJsonDialogFlag" :mode="'json'" :readonly="false" v-model="importTemplate"></code-editor>
			<div slot="footer" class="dialog-footer">
				<Button size="default" @click="showImportJsonDialogFlag = false">
					{{i18nt('designer.hint.cancel')}}
				</Button>
				<Button size="default" type="primary" @click="doJsonImport">
					{{i18nt('designer.hint.import')}}
				</Button>
			</div>
		</Modal>
		
		<Modal :title="i18nt('designer.toolbar.exportJson')"
			v-model="showExportJsonDialogFlag" :closable="true" class="small-padding-dialog" draggable
			width="800" :mask-closable="false">
			<code-editor v-if="showExportJsonDialogFlag" :mode="'json'" :readonly="true" v-model="jsonContent"></code-editor>
			<div slot="footer" class="dialog-footer">
				<Button size="default" type="primary" class="copy-json-btn" :data-clipboard-text="jsonRawContent">
					{{i18nt('designer.hint.copyJson')}}
				</Button>
				<Button size="default" type="default" @click="showExportJsonDialogFlag = false">
					{{i18nt('designer.hint.closePreview')}}
				</Button>
			</div>
		</Modal>

		<Modal :title="i18nt('designer.toolbar.exportCode')"
			v-model="showExportCodeDialogFlag" :closable="true" class="small-padding-dialog" draggable
			:mask-closable="false"
			width="960">
			<Tabs type="line" class="no-box-shadow" v-model="activeCodeTab">
				<TabPane label="Vue" name="vue">
					<code-editor v-if="showExportCodeDialogFlag" :mode="'html'" :readonly="true" v-model="vueCode" :user-worker="false"></code-editor>
				</TabPane>
				<TabPane label="HTML" name="html">
					<code-editor v-if="showExportCodeDialogFlag" :mode="'html'" :readonly="true" v-model="htmlCode" :user-worker="false"></code-editor>
				</TabPane>
			</Tabs>
			<div slot="footer" class="dialog-footer">
				<Button size="default" type="primary" class="copy-vue-btn" :data-clipboard-text="vueCode">
					{{i18nt('designer.hint.copyVueCode')}}
				</Button>
				<Button size="default" type="primary" class="copy-html-btn" :data-clipboard-text="htmlCode">
					{{i18nt('designer.hint.copyHtmlCode')}}
				</Button>
				<Button size="default" type="primary" @click="saveVueCode">{{i18nt('designer.hint.saveVueCode')}}</Button>
				<Button size="default" type="primary" @click="saveHtmlCode">{{i18nt('designer.hint.saveHtmlCode')}}</Button>
				<Button size="default" type="default" @click="showExportCodeDialogFlag = false">
					{{i18nt('designer.hint.closePreview')}}
				</Button>
			</div>
		</Modal>

		<Modal :title="i18nt('designer.hint.exportFormData')"
			v-model="showFormDataDialogFlag" :closable="true" class="dialog-title-light-bg" width="800" draggable
			:mask-closable="false">
			<div style="border: 1px solid #DCDFE6">
				<code-editor v-if="showFormDataDialogFlag" :mode="'json'" :readonly="true" v-model="formDataJson"></code-editor>
			</div>
			<div slot="footer" class="dialog-footer">
				<Button size="default" type="primary" class="copy-form-data-json-btn" :data-clipboard-text="formDataRawJson">
					{{i18nt('designer.hint.copyFormData')}}
				</Button>
				<Button size="default" type="default" @click="showFormDataDialogFlag = false">
					{{i18nt('designer.hint.closePreview')}}
				</Button>
			</div>
		</Modal>
		
		
		<Modal :title="i18nt('designer.toolbar.generateSFC')" width="960" 
		           v-model="showExportSFCDialogFlag" :closable="true" class="dialog-title-light-bg" draggable
			:mask-closable="false">
		  <Tabs type="line" class="no-box-shadow no-padding" v-model="activeSFCTab">
		    <TabPane label="Vue2" name="vue2">
		      <code-editor v-if="showExportSFCDialogFlag" :mode="'html'" :readonly="true" v-model="sfcCode" :user-worker="false"></code-editor>
		    </TabPane>
		    <TabPane label="Vue3" name="vue3">
		      <code-editor v-if="showExportSFCDialogFlag" :mode="'html'" :readonly="true" v-model="sfcCodeV3" :user-worker="false"></code-editor>
		    </TabPane>
		  </Tabs>
		  <div slot="footer" class="dialog-footer">
		    <Button size="default" type="primary" class="copy-vue2-sfc-btn" :data-clipboard-text="sfcCode" @click="copyV2SFC">
		      {{i18nt('designer.hint.copyVue2SFC')}}</Button>
		    <Button size="default" type="primary" class="copy-vue3-sfc-btn" :data-clipboard-text="sfcCodeV3" @click="copyV3SFC">
		      {{i18nt('designer.hint.copyVue3SFC')}}</Button>
		    <Button size="default" @click="saveV2SFC">{{i18nt('designer.hint.saveVue2SFC')}}</Button>
		    <Button size="default" @click="saveV3SFC">{{i18nt('designer.hint.saveVue3SFC')}}</Button>
		    <Button size="default" type="default" @click="showExportSFCDialogFlag = false">
		      {{i18nt('designer.hint.closePreview')}}</Button>
		  </div>
		</Modal>
		
		
		
		<Modal :title="this.i18nt('designer.hint.saveFileTitle')" width="300px"
		    v-model="showExportSFCFileNameDialogFlag" :closable="true" class="dialog-title-light-bg" draggable
			:mask-closable="false">
			<Input type="text" size="large" v-model="saveFileName" :placeholder="i18nt('designer.hint.fileNameForSave')" clearable/>
			<div slot="footer" class="dialog-footer">
				<Button size="default" type="primary" @click="saveFileExec">{{i18nt('designer.hint.confirm')}}</Button>
				<Button size="default" type="default" @click="showExportSFCFileNameDialogFlag = false">{{i18nt('designer.hint.closePreview')}}</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import VFormRender from '@/components-iview/form-render/index'
	import CodeEditor from '@/components-iview/code-editor/index'
	import Clipboard from 'clipboard'
	import {deepClone, copyToClipboard, generateId, getQueryParam} from "@/utils/util";
	import i18n from "../../utils/i18n";
	import {generateCode} from "../../utils/code-generator";
	import {genSFC} from "../../utils/sfc-generator";
	import loadBeautifier from "@/utils/beautifierLoader";
	import { saveAs } from 'file-saver'
	

	export default {
		name: "ToolbarPanel",
		mixins: [i18n],
		components: {
			VFormRender,
			//CodeEditor: () => import('@/components/code-editor/index'),
			CodeEditor,
			Clipboard,
		},
		props: {
			designer: Object
		},
		mounted() {
			if(this.load) this.reloadCode();
		},
		data() {
			return {
				showPreviewDialogFlag: false,
				showImportJsonDialogFlag: false,
				showExportJsonDialogFlag: false,
				showExportCodeDialogFlag: false,
				showFormDataDialogFlag: false,
				showExportSFCDialogFlag: false,
				showExportSFCFileNameDialogFlag: false,


				saveFileHandler:null,
				saveFileName:'',
				
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
				}
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
			saveFileExec(){
				this.saveAsFile(this.saveFileHandler[0],this.saveFileHandler[1])
			},
			saveAsFile(fileContent, defaultFileName) {
				let value="";
				  if (!this.saveFileName) {
					value = defaultFileName
				  }else{
					  value=this.saveFileName ;
				  }

				  if (getQueryParam('vscode') == 1) {
					this.vsSaveFile(value, fileContent)
					return
				  }

				  const fileBlob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' })
				  saveAs(fileBlob ,value)
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
					this.$Message.success(this.i18nt('designer.hint.importJsonSuccess'))

					this.designer.emitHistoryChange()
				} catch (ex) {
					this.$Message.error(ex + '')
				}
			},

			exportJson() {
				//alert( JSON.stringify(this.designer.widgetList) )
				//this.jsonContent = JSON.stringify(this.designer.widgetList, null, '  ')
				let widgetList = deepClone(this.designer.widgetList)
				let formConfig = deepClone(this.designer.formConfig)
				this.jsonContent = JSON.stringify({
					widgetList,
					formConfig
				}, null, '  ')
				this.jsonRawContent = JSON.stringify({
					widgetList,
					formConfig
				})
				this.showExportJsonDialogFlag = true;
				this.$forceUpdate();
				this.$nextTick(() => {
					let copyClipboard = new Clipboard('.copy-json-btn')
					copyClipboard.on('success', e => {
						this.$Message.success(this.i18nt('designer.hint.copyJsonSuccess'))
						copyClipboard.destroy() // 释放内存
					})
					copyClipboard.on('error', e => { // 不支持复制
						this.$Message.error(this.i18nt('designer.hint.copyJsonFail'))
						copyClipboard.destroy()
					})
				})
			},
			exportCode() {
				this.vueCode = generateCode(this.formJson)
				this.htmlCode = generateCode(this.formJson, 'html')
				this.showExportCodeDialogFlag = true

				this.$nextTick(() => {
					let vueClipboard = new Clipboard('.copy-vue-btn')
					vueClipboard.on('success', e => {
						this.$Message.success(this.i18nt('designer.hint.copyVueCodeSuccess'))
						vueClipboard.destroy() // 释放内存
					})
					vueClipboard.on('error', e => { // 不支持复制
						this.$Message.error(this.i18nt('designer.hint.copyVueCodeFail'))
						vueClipboard.destroy()
					})

					let htmlClipboard = new Clipboard('.copy-html-btn')
					htmlClipboard.on('success', e => {
						this.$Message.success(this.i18nt('designer.hint.copyHtmlCodeSuccess'))
						htmlClipboard.destroy() // 释放内存
					})
					htmlClipboard.on('error', e => { // 不支持复制
						this.$Message.error(this.i18nt('designer.hint.copyHtmlCodeFail'))
						htmlClipboard.destroy()
					})
				})
			},

			  copyVueCode(e) {
				copyToClipboard(this.vueCode, e,
					this.$Message,
					this.i18nt('designer.hint.copyVueCodeSuccess'),
					this.i18nt('designer.hint.copyVueCodeFail')
				)
			  },

			  copyHtmlCode(e) {
				copyToClipboard(this.htmlCode, e,
					this.$Message,
					this.i18nt('designer.hint.copyHtmlCodeSuccess'),
					this.i18nt('designer.hint.copyHtmlCodeFail')
				)
			  },

			  saveVueCode() {
				this.saveFileHandler=[this.vueCode, `vform${generateId()}.vue`];
				this.showExportSFCFileNameDialogFlag=true;
			  },

			  saveHtmlCode() {
				this.saveFileHandler=[this.htmlCode, `vform${generateId()}.vue`];
				this.showExportSFCFileNameDialogFlag=true;
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
					this.$Message,
					this.i18nt('designer.hint.copySFCSuccess'),
					this.i18nt('designer.hint.copySFCFail')
				)
			  },

			  copyV3SFC(e) {
				copyToClipboard(this.sfcCodeV3, e,
					this.$Message,
					this.i18nt('designer.hint.copySFCSuccess'),
					this.i18nt('designer.hint.copySFCFail')
				)
			  },

			  saveV2SFC() {
				this.saveFileHandler=[this.sfcCode, `vformV2-${generateId()}.vue`];
				this.showExportSFCFileNameDialogFlag=true;
				// this.saveAsFile(this.sfcCode, `vformV2-${generateId()}.vue`)
			  },

			  saveV3SFC() {
				  this.saveFileHandler=[this.sfcCodeV3, `vformV3-${generateId()}.vue`];
				  this.showExportSFCFileNameDialogFlag=true;
				// this.saveAsFile(this.sfcCodeV3, `vformV3-${generateId()}.vue`)
			  },

			getFormData() {
				this.$refs['preForm'].getFormData().then(formData => {
					//alert( JSON.stringify(formData) )

					this.formDataJson = JSON.stringify(formData, null, '  ')
					this.formDataRawJson = JSON.stringify(formData)

					this.showFormDataDialogFlag = true
					this.$nextTick(() => {
						let copyClipboard = new Clipboard('.copy-form-data-json-btn')
						copyClipboard.on('success', e => {
							this.$Message.success(this.i18nt('designer.hint.copyJsonSuccess'))
							copyClipboard.destroy() // 释放内存
						})
						copyClipboard.on('error', e => { // 不支持复制
							this.$Message.error(this.i18nt('designer.hint.copyJsonFail'))
							copyClipboard.destroy()
						})
					})
				}).catch(error => {
					this.$Message.error(error)
				})
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
			handlerNativeChange(args){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	div.toolbar-container {
		//border-bottom: 1px solid #EBEEF5;
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
		.ivu-icon{
			font-size:18px;
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

	.form-render-wrapper {
		//height: calc(100vh - 142px);
	}

	.form-render-wrapper.h5-layout {
		margin: 0 auto;
		width: 420px;
		border-radius: 15px;
		//border-width: 10px;
		background-color:blue;
		box-shadow: 0 0 1px 10px #495060;
		height: calc(100vh - 142px);
	}
</style>
