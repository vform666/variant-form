<template>

	<Form :label-position="labelPosition" :size="size" :class="[customClass]" class="render-form"
		:validate-on-rule-change="false" :model="formDataModel" ref="renderForm" @submit.native.prevent>
		<template v-for="(widget, index) in widgetList">
			<template v-if="'container' === widget.category">
				<container-item :widget="widget" :key="widget.id" :parent-list="widgetList"
					:index-of-parent-list="index" :parent-widget="null"></container-item>
			</template>
			<template v-else>
				<field-widget :field="widget" :form-model="formDataModel" :designer="null" :key="widget.id"
					:parent-list="widgetList" :index-of-parent-list="index" :parent-widget="null" 
					@field-value-changed="valueChanged"></field-widget>
			</template>
		</template>
	</Form>

</template>

<script>
	//import ElForm from 'element-ui/packages/form/src/form.vue'
	import emitter from 'element-ui/lib/mixins/emitter'
	import FieldWidget from "../form-designer/form-widget/field-widget";
	import ContainerItem from "./container-item";
	import {
		deepClone,
		insertCustomCssToHead,
		insertGlobalFunctionsToHtml
	} from "../../utils/util";
	//import i18n from "../../utils/i18n";
	import i18n, {
		changeLocale
	} from "../utils/i18n";

	export default {
		name: "VFormRender",
		componentName: 'VFormRender',
		mixins: [emitter, i18n],
		components: {
			FieldWidget,
			ContainerItem,
			//ElForm,
		},
		props: {
			//designer: Object, /* 不能引入designer对象，VFormRender组件脱离表单设计器运行！！ */

			formJson: Object, //prop传入的表单配置
			formData: { //prop传入的表单数据
				Object,
				default: () => {}
			},
			optionData: { //prop传入的选项数据
				type: Object,
				default: () => {}
			},
			eventHandler:{ //传入事件处理程序
				type: Object,
				default: () => {}
			},
			container:Object
		},
		provide() {
			return {
				refList: this.widgetRefList,
				sfRefList: this.subFormRefList, //收集SubForm引用
				formConfig: this.formConfig,
				globalOptionData: this.optionData,
				globalModel: {
					formModel: this.formDataModel,
				}
			}
		},
		data() {
			return {
				formDataModel: {
					//
				},
				widgetRefList: {},
				subFormRefList: {},
			}
		},
		computed: {
			formConfig() {
				return this.formJson.formConfig
			},

			widgetList() {
				return this.formJson.widgetList
			},

			labelPosition() {
				if (!!this.formConfig && !!this.formConfig.labelPosition) {
					return this.formConfig.labelPosition
				}

				return 'left'
			},

			size() {
				if (!!this.formConfig && !!this.formConfig.size) {
					return this.formConfig.size
				}

				return 'medium'
			},

			customClass() {
				return this.formConfig.customClass || ''
			},

		},
		watch: {
			//
		},
		created() {
			this.insertCustomStyleAndScriptNode()
			this.buildFormModel()
			this.addFieldChangeEventHandler()
			this.registerFormToRefList()
			this.handleOnCreated()
		},
		mounted() {
			this.initLocale()
			this.handleOnMounted()
		},
		methods: {					
			initLocale() {
				let curLocale = localStorage.getItem('v_form_locale') || 'zh-CN'
				this.changeLanguage(curLocale)
			},

			insertCustomStyleAndScriptNode() {
				if (!!this.formConfig && !!this.formConfig.cssCode) {
					insertCustomCssToHead(this.formConfig.cssCode)
				}

				if (!!this.formConfig && !!this.formConfig.functions) {
					insertGlobalFunctionsToHtml(this.formConfig.functions)
				}
			},

			buildFormModel() {
				//this.formDataModel = this.formData  //
				//this._provided.globalModel.formModel = this.formData

				this.widgetList.forEach((wItem) => {
					this.buildDataFromWidget(wItem, null)
				})
			},

			buildDataFromWidget(wItem, parentItem) {
				if (wItem.category === 'container') {
					if (wItem.type === 'grid') {
						if (!!wItem.cols && (wItem.cols.length > 0)) {
							wItem.cols.forEach((childItem) => {
								this.buildDataFromWidget(childItem, wItem)
							})
						}
					} else if (wItem.type === 'table') {
						if (!!wItem.rows && (wItem.rows.length > 0)) {
							wItem.rows.forEach((rowItem) => {
								if (!!rowItem.cols && (rowItem.cols.length > 0)) {
									rowItem.cols.forEach((colItem) => {
										this.buildDataFromWidget(colItem, wItem)
									})
								}
							})
						}
					} else if (wItem.type === 'tab') {
						if (!!wItem.tabs && (wItem.tabs.length > 0)) {
							wItem.tabs.forEach((tabItem) => {
								if (!!tabItem.widgetList && (tabItem.widgetList.length > 0)) {
									tabItem.widgetList.forEach((childItem) => {
										this.buildDataFromWidget(childItem, wItem)
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

								this.$set(this.formDataModel, subFormName, [subFormDataRow]) //
							} else {
								this.$set(this.formDataModel, subFormName, []) //
							}
						} else {
							let initialValue = this.formData[subFormName]
							this.$set(this.formDataModel, subFormName, deepClone(initialValue))
						}
					} else if ((wItem.type === 'grid-col') || (wItem.type === 'table-cell')) {
						if (!!wItem.widgetList && (wItem.widgetList.length > 0)) {
							wItem.widgetList.forEach((childItem) => {
								this.buildDataFromWidget(childItem, wItem)
							})
						}
					} else {
						if (!!wItem.widgetList && (wItem.widgetList.length > 0)) {
							wItem.widgetList.forEach((childItem) => {
								this.buildDataFromWidget(childItem, wItem)
							})
						}
					}
				} else if (!!wItem.formItemFlag) {
					if (!this.formData.hasOwnProperty(wItem.options.name)) {
						//this.formDataModel[wItem.options.name] = '' //这种写法不支持对象属性响应式更新，必须用$set方法！！
						this.$set(this.formDataModel, wItem.options.name, wItem.options.defaultValue) //设置字段默认值
					} else {
						let initialValue = this.formData[wItem.options.name]
						this.$set(this.formDataModel, wItem.options.name, deepClone(initialValue))
					}
				}
			},

			addFieldChangeEventHandler() {
				this.$on('fieldChange', function(fieldName, newValue, oldValue, subFormName, subFormRowIndex) {
					this.handleFieldDataChange(fieldName, newValue, oldValue, subFormName, subFormRowIndex)
					this.$emit('formChange', fieldName, newValue, oldValue, this.formDataModel, subFormName,
						subFormRowIndex)
					//this.$emit('subFormChange', subFormName, subFormRowIndex,
					//    fieldName, newValue, oldValue, this.formDataModel)
				})
			},

			registerFormToRefList() {
				this.widgetRefList['v_form_ref'] = this
			},

			handleFieldDataChange(fieldName, newValue, oldValue, subFormName, subFormRowIndex) {
				if (!!this.formConfig.onFormDataChange) {
					let customFunc = new Function('fieldName', 'newValue', 'oldValue', 'formModel', 'subFormName',
						'subFormRowIndex',
						this.formConfig.onFormDataChange)
					customFunc.call(this, fieldName, newValue, oldValue, this.formDataModel, subFormName, subFormRowIndex)
				}
			},

			// forceUpdate() {
			//   this.$forceUpdate()
			// },

			handleOnCreated() {
				if (!!this.formConfig.onFormCreated) {
					let customFunc = new Function(this.formConfig.onFormCreated)
					customFunc.call(this)
				}
			},

			handleOnMounted() {
				if (!!this.formConfig.onFormMounted) {
					let customFunc = new Function(this.formConfig.onFormMounted)
					customFunc.call(this)
				}
			},

			findWidgetAndSetDisabled(widgetName, disabledFlag) {
				let foundW = this.getWidgetRef(widgetName)
				if (!!foundW) {
					foundW.setDisabled(disabledFlag)
				}
			},

			findWidgetAndSetHidden(widgetName, hiddenFlag) {
				let foundW = this.getWidgetRef(widgetName)
				if (!!foundW) {
					foundW.setHidden(hiddenFlag)
				}
			},

			//--------------------- 以下为组件支持外部调用的API方法 begin ------------------//
			/* 提示：用户可自行扩充这些方法！！！ */

			changeLanguage(langName) {
				changeLocale(langName)
			},

			getNativeForm() { //获取原生form引用
				return this.$refs['renderForm']
			},

			getWidgetRef(widgetName, showError = false) {
				let foundRef = this.widgetRefList[widgetName]
				if (!foundRef && !!showError) {
					this.$message.error(this.i18nt('render.hint.refNotFound') + widgetName)
				}
				return foundRef
			},

			getFormData(needValidation = true) {
				if (!needValidation) {
					return this.formDataModel
				}

				let callback = function nullFunc() {}
				let promise = new window.Promise(function(resolve, reject) {
					callback = function callback(formData, error) {
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

				//return this.$refs['renderForm'].validate()
				return promise
			},

			setFormData(formData) { //设置表单数据
				//this.formDataModel = formData //inject注入的formModel不是响应式的，直接赋值在其他组件拿不到最新值！！
				this._provided.globalModel.formModel = formData /* 这种写法可使inject的属性保持响应式更新！！ */
				//

				// 通知SubForm组件：表单数据更新事件！！
				this.broadcast('ContainerItem', 'setFormData', formData)
				// 通知FieldWidget组件：表单数据更新事件！！
				this.broadcast('FieldWidget', 'setFormData', formData)
			},

			getFieldValue(fieldName) { //单个字段获取值
				let fieldRef = this.getWidgetRef(fieldName)
				if (!!fieldRef && !!fieldRef.getValue) {
					return fieldRef.getValue()
				}
			},

			setFieldValue(fieldName, fieldValue) { //单个更新字段值
				let fieldRef = this.getWidgetRef(fieldName)
				if (!!fieldRef && !!fieldRef.setValue) {
					fieldRef.setValue(fieldValue)
				}
			},

			getSubFormValues(subFormName, needValidation = true) {
				let foundSFRef = this.subFormRefList[subFormName]
				// if (!foundSFRef) {
				//   return this.formDataModel[subFormName]
				// }
				return foundSFRef.getSubFormValues(needValidation)
			},

			disableForm() {
				let wNameList = Object.keys(this.widgetRefList)
				wNameList.forEach(wName => {
					let foundW = this.getWidgetRef(wName)
					if (!!foundW) {
						// try {
						//   foundW.setDisabled(true)
						// } catch (ex) {
						//   console.log('disableForm error: ', ex.message)
						// }

						if (!!foundW.setDisabled) {
							foundW.setDisabled(true)
						}
					}
				})
			},

			enableForm() {
				let wNameList = Object.keys(this.widgetRefList)
				wNameList.forEach(wName => {
					let foundW = this.getWidgetRef(wName)
					if (!!foundW) {
						// try {
						//   foundW.setDisabled(false)
						// } catch (ex) {
						//   console.log('disableForm error: ', wName + ', ' + ex.message)
						// }

						if (!!foundW.setDisabled) {
							foundW.setDisabled(false)
						}
					}
				})
			},

			resetForm() { //重置表单
				let subFormNames = Object.keys(this.subFormRefList)
				subFormNames.forEach(sfName => {
					if (!!this.subFormRefList[sfName].resetSubForm) {
						this.subFormRefList[sfName].resetSubForm()
					}
				})

				let wNameList = Object.keys(this.widgetRefList)
				wNameList.forEach(wName => {
					let foundW = this.getWidgetRef(wName)
					if (!!foundW && !!foundW.resetField) {
						foundW.resetField()
					}
				})

				this.$refs.renderForm.clearValidate()
			},

			validateForm() {
				//
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
			
			valueChanged(args){
				console.log(">>>>");
				console.log(args);
			}

			//--------------------- 以上为组件支持外部调用的API方法 end ------------------//

		},
	}
</script>

<style lang="scss" scoped>
	.el-form ::v-deep .el-row {
		padding: 8px;
	}
</style>
