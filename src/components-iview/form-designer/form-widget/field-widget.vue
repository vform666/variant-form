<template>
	<div class="field-wrapper" :class="{'design-time-bottom-margin': !!this.designer}">
		<FormItem v-if="!!field.formItemFlag" :label="label" :labelWidth="labelWidth||0"
			:title="field.options.labelTooltip" v-show="!field.options.hidden || (designState === true)" :rules="rules"
			:prop="getPropName()"
			:class="[selected ? 'selected' : '', labelAlign, customClass, field.options.required ? 'required' : '']"
			@click.native.stop="selectField(field)">

			<span v-if="!!field.options.labelTooltip" slot="label" class="custom-label">
					<Tooltip :content="field.options.labelTooltip" v-if="field.options.labelIconPosition === 'front'">
						<i :class="field.options.labelIconClass"></i>
						{{label}}
					</Tooltip>
					<Tooltip v-else :content="field.options.labelTooltip">
						{{label}}<i :class="field.options.labelIconClass"></i>
					</Tooltip>
			</span>

			<template v-if="field.type === 'input'">
					<Input ref="fieldEditor" 
						v-model="fieldModel" 
						:disabled="field.options.disabled"
						:readonly="field.options.readonly" 
						:size="field.options.size||'default'" 
						 class="hide-spin-button"
						
						:type="inputType" 
						:password ="field.options.showPassword"
						:placeholder="field.options.placeholder" 
						:clearable="field.options.clearable"
						:maxlength="field.options.maxLength"
						:show-word-limit="field.options.showWordLimit" 
						:prefix="field.options.prefixIcon"
						:suffix="field.options.suffixIcon" 	
						
						:minlength="field.options.minLength"
						@change="handleChangeEvent" 
						@focus="handleFocusCustomEvent"
						@blur="handleBlurCustomEvent" 
						@input="handleInputCustomEvent">
						
						<Button slot="append"
							v-if="field.options.appendButton"
							type="primary"
							:disabled="field.options.disabled || field.options.appendButtonDisabled"
							:icon="field.options.buttonIcon" 
							@click.native="emitAppendButtonClick">{{field.options.appendButtonText}}</Button>
					</Input>
			</template>
			
			<template v-if="field.type === 'textarea'">
				<Input type="textarea" ref="fieldEditor" v-model="fieldModel" :disabled="field.options.disabled"
					:readonly="field.options.readonly" :size="field.options.size||'default'"
					:placeholder="field.options.placeholder" :rows="field.options.rows"
					:minlength="field.options.minLength" :maxlength="field.options.maxLength"
					:show-word-limit="field.options.showWordLimit" @change="handleChangeEvent"
					@focus="handleFocusCustomEvent" @blur="handleBlurCustomEvent" @input="handleInputCustomEvent">
				</Input>
			</template>

			<template v-if="field.type === 'number'">
				<InputNumber  ref="fieldEditor" v-model="fieldModel" class="full-width-input"
					:disabled="field.options.disabled"
					:size="field.options.size||'default'"
					:controls-outside="field.options.controlsPosition==='default'" 
					:placeholder="field.options.placeholder"
					:min="field.options.min" 
					:max="field.options.max" 
					:precision="parseInt(field.options.precision||0)"
					:step="parseFloat(field.options.step|1)" 					
					:formatter="field.options.formatter||undefined"					
					
					@change="handleChangeEvent" 
					@focus="handleFocusCustomEvent"
					@blur="handleBlurCustomEvent"/>
			</template>

			<template v-if="field.type === 'radio'">
				<RadioGroup ref="fieldEditor" 
					 v-model="fieldModel" 
					:disabled="field.options.disabled" 
					:size="field.options.size||'default'">
					<Radio v-for="(item, index) in field.options.optionItems" 
						:key="index" 
						:label="item.value"
						:size="field.options.size||'default'"
						:disabled="field.options.disabled" 
						:style="{display: field.options.displayStyle}">{{item.label}}
					</Radio>
				</RadioGroup>
			</template>

			<template v-if="field.type === 'checkbox'">
				<CheckboxGroup ref="fieldEditor" 
				 v-model="checkedList" 
				:disabled="field.options.disabled" 
				:size="field.options.size||'default'">
					<Checkbox v-for="(item, index) in field.options.optionItems" 
						:key="index" 
						:label="item.label"
						:value="item.value" 
						:size="field.options.size||'default'"
						:data-value="item.value" 
						:disabled="field.options.disabled"
						:style="{display: field.options.displayStyle}">
					</Checkbox>
				</CheckboxGroup>
			</template>

			<template v-if="field.type === 'select'">
				<Select ref="fieldEditor" 
					v-model="fieldModel" class="full-width-input"
					:disabled="field.options.disabled" 
					:size="field.options.size||'default'" 
					:clearable="field.options.clearable"
					:filterable="field.options.filterable" 
					:allow-create="field.options.allowCreate"
					:default-first-option="allowDefaultFirstOption"
					:automatic-dropdown="field.options.automaticDropdown" 
					:multiple="field.options.multiple"
					:multiple-limit="field.options.multipleLimit"
					:placeholder="field.options.placeholder || i18nt('render.hint.selectPlaceholder')"
					:remote="this.field.options.remote" 
					:remote-method="remoteQuery" 
					
					@focus="handleFocusCustomEvent"
					@blur="handleBlurCustomEvent">
					<Option v-for="item in field.options.optionItems" :key="item.value" :label="item.label"
						:value="item.value" :disabled="item.disabled">
					</Option>
				</Select>
			</template>

			<template v-if="field.type === 'time'">
				<TimePicker ref="fieldEditor" type="time" v-model="fieldModel" class="full-width-input" 
					confirm 	
					:transfer="true"
					:disabled="field.options.disabled" 
					:readonly="field.options.readonly" 
					:size="field.options.size||'default'"
					:clearable="field.options.clearable" 
					:editable="field.options.editable"
					:format="field.options.format" 
					 value-format="HH:mm:ss"
					:placeholder="field.options.placeholder || i18nt('render.hint.timePlaceholder')"
					@focus="handleFocusCustomEvent" @blur="handleBlurCustomEvent">
				</TimePicker>
			</template>

			<template v-if="field.type === 'time-range'">
				<TimePicker ref="fieldEditor" type="timerange" v-model="fieldModel" class="full-width-input"
					confirm
					:transfer="true"
					:disabled="field.options.disabled" :readonly="field.options.readonly"
					:size="field.options.size||'default'"
					:clearable="field.options.clearable" :editable="field.options.editable"
					:format="field.options.format" 
					 value-format="HH:mm:ss"
					:start-placeholder="field.options.startPlaceholder || i18nt('render.hint.startTimePlaceholder')"
					:end-placeholder="field.options.endPlaceholder || i18nt('render.hint.endTimePlaceholder')"
					@focus="handleFocusCustomEvent" @blur="handleBlurCustomEvent">
				</TimePicker>
			</template>

			<template v-if="field.type === 'date'">
				<DatePicker type="date" ref="fieldEditor" :type="field.options.type" 
					v-model="fieldModel"
					class="full-width-input" 
					:readonly="field.options.readonly" 
					:disabled="field.options.disabled"
					:size="field.options.size||'default'" 
					:clearable="field.options.clearable" 
					:editable="field.options.editable"
					:format="field.options.format" 
					:value-format="field.options.valueFormat"
					:placeholder="field.options.placeholder || i18nt('render.hint.datePlaceholder')"
					@focus="handleFocusCustomEvent" @blur="handleBlurCustomEvent"></DatePicker>
			</template>

			<template v-if="field.type === 'date-range'">
				<DatePicker type="daterange" ref="fieldEditor" 
					:type="field.options.type" v-model="fieldModel"
					class="full-width-input" 
					:disabled="field.options.disabled" 
					:readonly="field.options.readonly"
					:size="field.options.size||'default'" 
					:clearable="field.options.clearable" 
					:editable="field.options.editable"
					:format="field.options.format" 
					:value-format="field.options.valueFormat"
					:start-placeholder="field.options.startPlaceholder || i18nt('render.hint.startDatePlaceholder')"
					:end-placeholder="field.options.endPlaceholder || i18nt('render.hint.endDatePlaceholder')"
					@focus="handleFocusCustomEvent" @blur="handleBlurCustomEvent"></DatePicker>
			</template>

			<template v-if="field.type === 'switch'">
				<iSwitch ref="fieldEditor" v-model="fieldModel" 
				    :size="field.options.size||'default'"
					:disabled="field.options.disabled"
					:active-text="field.options.activeText" 
					:inactive-text="field.options.inactiveText"
					:true-color="field.options.activeColor==''?field.options.activeColor:undefined"
					:false-color="field.options.inactiveColor==''?field.options.activeColor:undefined"
					:width="field.options.switchWidth">
					<span slot="open" v-if="field.options.activeText">{{field.options.activeText}}</span>
					<span slot="close" v-if="field.options.inactiveText">{{field.options.inactiveText}}</span>
				</iSwitch>
			</template>

			<template v-if="field.type === 'rate'">
				<Rate ref="fieldEditor" v-model="fieldModel" 
					:disabled="field.options.disabled"
					:count="field.options.max" 
					:clearable="field.options.clearable"
					:allow-half="field.options.allowHalf"
					:show-text="field.options.showText" >
				</Rate>
			</template>

			<template v-if="field.type === 'color'">
				<ColorPicker ref="fieldEditor" v-model="fieldModel" 
					:size="field.options.size||'default'"
					:disabled="field.options.disabled"></ColorPicker>
			</template>

			<template v-if="field.type === 'slider'">
				<Slider ref="fieldEditor" v-model="fieldModel" 
					:disabled="field.options.disabled"
					:min="parseInt(field.options.min||1)" 
					:max="parseInt(field.options.max||100)" 
					:step="parseInt(field.options.step||1)"
					:range="field.options.range"></Slider>
			</template>

			<template v-if="field.type === 'picture-upload'">
				<Upload ref="fieldEditor" 
					:disabled="field.options.disabled" 
					:action="field.options.uploadURL"
					:headers="uploadHeaders" 
					:data="uploadData" 
					:with-credentials="field.options.withCredentials"
					:multiple="field.options.multipleSelect" 					
					:show-upload-list="field.options.showFileList" 
					:class="{'hideUploadDiv': uploadBtnHidden}" 
					:max-size="field.options.fileMaxSize"
					:format="field.options.fileTypes"
					:accept="field.options.fileAccept?field.options.fileAccept.toString():undefined"
					paste
					
					:on-exceeded-size="handlePictureExceed" 
					:before-upload="beforePictureUpload"
					:on-success="handlePictureUpload" 
					:on-error="handelUploadError" 
					:on-remove="handlePictureRemove"
					:on-preview="handleUploadPreview"
					:on-progress="handleUploadProgress">
					<div slot="tip" class="el-upload__tip" v-if="!!field.options.uploadTip">{{field.options.uploadTip}}</div>
					<i class="ivu-icon ivu-icon-md-add avatar-uploader-icon"></i>
				</Upload>
			</template>

			<template v-if="field.type === 'file-upload'">
				<Upload ref="fieldEditor" 
					:disabled="field.options.disabled" 
					:style="styleVariables"
					class="dynamicPseudoAfter" 
					:action="field.options.uploadURL" 
					:headers="uploadHeaders"
					:data="uploadData" 
					:with-credentials="field.options.withCredentials"
					:multiple="field.options.multipleSelect" 
					:file-list="fileList"
					:show-upload-list="field.options.showFileList" 
					:class="{'hideUploadDiv': uploadBtnHidden}"
					:max-size="field.options.fileMaxSize" 
					:format="field.options.fileTypes"
					:accept="field.options.fileAccept?field.options.fileAccept.toString():undefined"
					paste
					
					:on-exceeded-size="handleFileExceed" 
					:before-upload="beforeFileUpload"
					:on-success="handleFileUpload" 
					:on-error="handelUploadError" 
					:on-remove="handleFileRemove"
					:on-preview="handleUploadPreview"
					:on-progress="handleUploadProgress">
					<div slot="tip" class="el-upload__tip" v-if="!!field.options.uploadTip">{{field.options.uploadTip}}
					</div>
					<i slot="default" class="ivu-icon ivu-icon-md-add avatar-uploader-icon"></i>
					<div slot="file" slot-scope="{file}" class="upload-file-list">
						<span class="upload-file-name" :title="file.name">{{file.name}}</span>
						<a :href="file.url" download="">
							<i class="ivu-icon ivu-icon-ios-cloud-download-outline file-action" title="i18nt('render.hint.downloadFile')"></i></a>
						<i class="ivu-icon ivu-icon-ios-trash file-action" title="i18nt('render.hint.removeFile')"
							@click="removeUploadFile(file.name)"></i>
					</div>
				</Upload>
			</template>

			<template v-if="field.type === 'rich-editor'">
				<vue-editor ref="fieldEditor" v-model="fieldModel" :editor-toolbar="customToolbar"
					:disabled="field.options.disabled" :placeholder="field.options.placeholder"
					@focus="handleRichEditorFocusEvent" @blur="handleRichEditorBlurEvent"></vue-editor>
			</template>

			<template v-if="field.type === 'cascader'">
				<Cascader  ref="fieldEditor" 
					:data="field.options.optionItems" 
					v-model="fieldModel"
					class="full-width-input" 
					:disabled="field.options.disabled" 
					:size="field.options.size"
					:clearable="field.options.clearable" 
					:filterable="field.options.filterable"
					:placeholder="field.options.placeholder || i18nt('render.hint.selectPlaceholder')"
					@focus="handleFocusCustomEvent" 
					@blur="handleBlurCustomEvent">
				</Cascader>
			</template>

		</FormItem>
		<div v-else class="static-content-item" v-show="!field.options.hidden || (designState === true)"
			:class="{'selected': selected}" @click.stop="selectField(field)">
			<template v-if="field.type === 'static-text'">
				<div ref="fieldEditor">{{field.options.textContent}}</div>
			</template>

			<template v-if="field.type === 'html-text'">
				<div ref="fieldEditor" v-html="field.options.htmlContent"></div>
			</template>

			<template v-if="field.type === 'button'">
				<Button ref="fieldEditor" 					
					:type="field.options.type||'default'" 
					:size="field.options.size||'default'" 
					:ghost="field.options.plain"
					:icon="field.options.icon"					
					:shape="field.options.circle?'circle':undefined"
					:disabled="field.options.disabled"
					:to="field.options.to"
					:replace="field.options.replace"
					:target="field.options.target"
					:append="field.options.append"
					 @click.native="handleButtonWidgetClick">
					 <span v-if="field.options.label!=''">{{field.options.label}}</span>
				</Button>
			</template>

			<template v-if="field.type === 'divider'">
				<Divider ref="fieldEditor"
				 :size="field.options.size||'default'"
				 :type="(field.options.direction!='horizontal')?'vertical':'horizontal'" 
				 :orientation="field.options.contentPosition">
					{{field.options.label}}
				</Divider>
			</template>

		</div>

		<template v-if="!!this.designer">
			<div class="field-action" v-if="designer.selectedId === field.id">
				<i class="ivu-icon ivu-icon-md-arrow-back" :title="i18nt('designer.hint.selectParentWidget')"
					@click.stop="selectParentWidget(field)"></i>
				<i class="ivu-icon ivu-icon-md-arrow-up" v-if="!!parentList && (parentList.length > 1)"
					:title="i18nt('designer.hint.moveUpWidget')" @click.stop="moveUpWidget(field)"></i>
				<i class="ivu-icon ivu-icon-md-arrow-down" v-if="!!parentList && (parentList.length > 1)"
					:title="i18nt('designer.hint.moveDownWidget')" @click.stop="moveDownWidget(field)"></i>
				<i class="ivu-icon ivu-icon-ios-trash" :title="i18nt('designer.hint.remove')" @click.stop="removeField"></i>
			</div>

			<div class="drag-handler background-opacity" v-if="designer.selectedId === field.id">
				<i class="ivu-icon ivu-icon-md-move" :title="i18nt('designer.hint.dragHandler')"></i>
				<i>{{i18nt('designer.widgetLabel.' + field.type)}}</i>
				<i v-if="field.options.hidden === true" class="iconfont icon-hide"></i>
			</div>
		</template>
	</div>
</template>

<script>
	//import ElFormItem from 'element-ui/packages/form/src/form-item.vue'  /* 用于源码调试Element UI */
	//import ElInput from 'element-ui/packages/input/src/input.vue'  /* 用于源码调试Element UI */
	import emitter from 'element-ui/lib/mixins/emitter'
	import {
		deepClone,
		isEmptyStr,
		isNotNull
	} from "../../../utils/util";
	import FormValidators from '../../../utils/validators'
	import i18n, {
		translate
	} from "../../utils/i18n";

	let selectFileText = "'" + translate('render.hint.selectFile') + "'"

	export default {
		name: "FieldWidget",
		componentName: 'FieldWidget',
		mixins: [emitter, i18n],
		props: {
			field: Object,
			parentWidget: Object,
			parentList: Array,
			indexOfParentList: Number,
			designer: Object,

			designState: {
				type: Boolean,
				default: false
			},

			subFormRowIndex: {
				/* 子表单组件行索引，从0开始计数 */
				type: Number,
				default: -1
			},
			subFormColIndex: {
				/* 子表单组件列索引，从0开始计数 */
				type: Number,
				default: -1
			},
			subFormRowId: {
				/* 子表单组件行Id，唯一id且不可变 */
				type: String,
				default: ''
			},

		},
		components: {
			//ElFormItem,
			//ElInput,

			VueEditor: resolve => { //懒加载！！
				require(['vue2-editor'], ({
					VueEditor
				}) => resolve(VueEditor))
			}
		},
		inject: ['refList', 'formConfig', 'globalOptionData', 'globalModel'],
		data() {
			return {
				oldInputValue: null, //el-input组件change之前的值
				valueChangedFlag: false, //vue2-editor数据值是否改变标志
				fieldModel: null,
				rules: [],

				checkedList: [],

				uploadHeaders: {},
				uploadData: {
					key: '', //七牛云上传文件名
					//token: '',  //七牛云上传token

					//policy: '',  //又拍云上传policy
					//authorization: '',  //又拍云上传签名
				},
				fileList: [], //上传文件列表
				uploadBtnHidden: false,

				customToolbar: [], //富文本编辑器自定义工具栏


				styleVariables: {
					'--select-file-action': selectFileText,
				},
			}
		},

		computed: {
			selected() {
				return !!this.designer && this.field.id === this.designer.selectedId
			},

			label() {
				if (!!this.field.options.labelHidden) {
					return ''
				}

				return this.field.options.label
			},

			labelWidth() {
				if (!!this.field.options.labelHidden) {
					return 0
				}

				if (!!this.field.options.labelWidth) {
					return this.field.options.labelWidth
				}

				if (!!this.designer) {
					return this.designer.formConfig.labelWidth
				} else {
					return this.formConfig.labelWidth
				}
			},

			labelAlign() {
				if (!!this.field.options.labelAlign) {
					return this.field.options.labelAlign
				}

				if (!!this.designer) {
					return this.designer.formConfig.labelAlign || 'label-left-align'
				} else {
					return this.formConfig.labelAlign || 'label-left-align'
				}
			},

			customClass() {
				return !!this.field.options.customClass ? this.field.options.customClass.join(' ') : ''
			},

			size() {
				if (!!this.field.options.size) {
					return this.field.options.size
				}

				if (!!this.designer) {
					if (!!this.designer.formConfig && !!this.designer.formConfig.size) {
						return this.designer.formConfig.size
					}
				} else {
					if (!!this.formConfig && !!this.formConfig.size) {
						return this.formConfig.size
					}
				}

				return 'medium'
			},

			inputType() {
				if (this.field.options.type === 'number') {
					return 'text' //当input的type设置为number时，如果输入非数字字符，则v-model拿到的值为空字符串，无法实现输入校验！故屏蔽之！！
				}

				return this.field.options.type
			},

			allowDefaultFirstOption() {
				return (!!this.field.options.filterable && !!this.field.options.allowCreate)
			},

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
			}

		},
		watch: {
			checkedList: {
				deep: true,
				handler(val, oldVal) {
					if (!!this.designState) {
						return
					}

					let checkedValueList = []
					if (!!val && (val.length > 0)) {
						val.forEach((checkedLabel) => {
							if (this.field.options.optionItems.length > 0) {
								let foundItems = this.field.options.optionItems.filter(chOpt => {
									return checkedLabel === chOpt.label
								})
								if (!!foundItems && (foundItems.length > 0)) {
									checkedValueList.push(foundItems[0].value)
								}
							}
						})
					}

					let oldCheckedValueList = []
					if (!!oldVal && (oldVal.length > 0)) {
						oldVal.forEach((checkedLabel) => {
							if (this.field.options.optionItems.length > 0) {
								let foundItems = this.field.options.optionItems.filter(chOpt => {
									return checkedLabel === chOpt.label
								})
								if (!!foundItems && (foundItems.length > 0)) {
									oldCheckedValueList.push(foundItems[0].value)
								}
							}
						})
					}

					if (this.subFormItemFlag) {
						let subFormData = this.formModel[this.subFormName] || [{}]
						let subFormDataRow = subFormData[this.subFormRowIndex]
						subFormDataRow[this.field.options.name] = checkedValueList
					} else {
						this.formModel[this.field.options.name] = checkedValueList
					}
					this.$emit('field-value-changed', [val, oldVal])
					this.emitFieldDataChangeForForm(checkedValueList, oldCheckedValueList)
				}
			},

			fieldModel: {
				deep: true,
				handler(val, oldVal) {
					if (!!this.designState) {
						return
					}

					if (this.subFormItemFlag) {
						let subFormData = this.formModel[this.subFormName] || [{}]
						let subFormDataRow = subFormData[this.subFormRowIndex]
						subFormDataRow[this.field.options.name] = val
						this.valueChangedFlag = true
					} else {
						this.formModel[this.field.options.name] = val
						this.valueChangedFlag = true
					}

					if ((this.field.type !== 'input') && (this.field.type !== 'textarea') &&
						(this.field.type !== 'number') && (this.field.type !== 'rich-editor')) {
						this.$emit('field-value-changed', [val, oldVal])
						this.emitFieldDataChangeForForm(val, oldVal)
					}
				}
			},

			fileList: {
				deep: true,
				handler(val, oldVal) {
					if (!!this.designState) {
						return
					}

					if (this.subFormItemFlag) {
						/* inject的formModel不是响应式的，获取不到最新值！！ */
						let subFormData = this.formModel[this.subFormName] || [{}]
						let subFormDataRow = subFormData[this.subFormRowIndex]
						subFormDataRow[this.field.options.name] = val
					} else {
						this.formModel[this.field.options.name] = val
					}

					this.$emit('field-value-changed', [val, oldVal])
					this.emitFieldDataChangeForForm(val, oldVal)
				},
			},

		},

		beforeCreate() {
			/* 这里不能访问方法和属性！！ */
		},

		created() {
			/* 注意：子组件mounted在父组件created之后、父组件mounted之前触发，故子组件mounted需要用到的prop
			   需要在父组件created中初始化！！ */
			this.initOptionItems()
			this.initFieldModel()
			this.registerToRefList()
			this.initEventHandler()
			this.buildFieldRules()

			this.handleOnCreated()
		},

		mounted() {
			this.handleOnMounted()
		},

		beforeDestroy() {
			this.unregisterFromRefList()
		},

		methods: {
			initFieldModel() {
				if (this.field.formItemFlag === false) {
					return
				}

				if (!!this.subFormItemFlag && !this.designState) { //SubForm子表单组件需要特殊处理！！
					let subFormData = this.formModel[this.subFormName]
					if (((subFormData === undefined) || (subFormData[this.subFormRowIndex] === undefined) ||
							(subFormData[this.subFormRowIndex][this.field.options.name] === undefined)) &&
						(this.field.options.defaultValue !== undefined)) {
						this.fieldModel = this.field.options.defaultValue
						this.initCheckedList() //处理checkbox字段
						this.initFileList() //处理图片上传、文件上传字段

						return
					}

					if (subFormData[this.subFormRowIndex][this.field.options.name] === undefined) {
						subFormData[this.subFormRowIndex][this.field.options.name] = null
					}
					this.fieldModel = subFormData[this.subFormRowIndex][this.field.options.name]
					this.initCheckedList() //处理checkbox字段
					this.initFileList() //处理图片上传、文件上传字段

					return
				}

				if ((this.formModel[this.field.options.name] === undefined) &&
					(this.field.options.defaultValue !== undefined)) {
					this.fieldModel = this.field.options.defaultValue
					this.initCheckedList() //处理checkbox字段
					this.initFileList() //处理图片上传、文件上传字段

					return
				}

				if (this.formModel[this.field.options.name] === undefined) { //如果formModel为空对象，则初始化字段值为null!!
					this.formModel[this.field.options.name] = null
				}
				this.fieldModel = this.formModel[this.field.options.name]
				this.initCheckedList() //处理checkbox字段
				this.initFileList() //处理图片上传、文件上传字段
			},

			initOptionItems() {
				// if (!!this.field.options.optionItems) {
				//   this.optionItems = deepClone(this.field.options.optionItems)
				// }

				if (this.designState) {
					return
				}

				if ((this.field.type === 'radio') || (this.field.type === 'checkbox') ||
					(this.field.type === 'select') || (this.field.type === 'cascader')) {
					if (!!this.globalOptionData && this.globalOptionData.hasOwnProperty(this.field.options.name)) {
						this.loadOptions(this.globalOptionData[this.field.options.name])
					}
				}
			},

			refreshDefaultValue() {
				if ((this.designState === true) && (this.field.options.defaultValue !== undefined)) {
					this.fieldModel = this.field.options.defaultValue
					this.$nextTick(() => {
						this.initCheckedList()
					})
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

			unregisterFromRefList() { //销毁组件时注销组件ref
				if ((this.refList !== null) && !!this.field.options.name) {
					let oldRefName = this.field.options.name
					if (this.subFormItemFlag && !this.designState) { //处理子表单元素（且非设计状态）
						delete this.refList[oldRefName + '@row' + this.subFormRowId]
					} else {
						delete this.refList[oldRefName]
					}
				}
			},

			initEventHandler() {
				this.$on('setFormData', function(newFormData) {
					console.log('formModel of globalModel----------', this.globalModel.formModel)
					if (!this.subFormItemFlag) {
						this.setValue(newFormData[this.field.options.name])
					}
				})

				this.$on('field-value-changed', function(values) {
					if (this.subFormItemFlag) {
						let subFormData = this.formModel[this.subFormName]
						this.handleOnChangeForSubForm(values[0], values[1], subFormData, this.subFormRowId)
					} else {
						this.handleOnChange(values[0], values[1])
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

			handleOnBeforeUpload(file) {
				if (!!this.field.options.onBeforeUpload) {
					let bfFunc = new Function('file', this.field.options.onBeforeUpload)
					let result = bfFunc.call(this, file)
					if (typeof result === 'boolean') {
						return result
					} else {
						return true
					}
				}

				return true
			},

			initCheckedList() {
				/* 加载选项时也需要重新初始化 */
				if (this.field.type === 'checkbox') {
					let checkedValueList = this.fieldModel //this.formModel[this.field.options.name]
					if (!checkedValueList || (checkedValueList.length === 0)) {
						this.checkedList = []
						return
					}

					let checkedLabelList = []
					checkedValueList.forEach(chValue => {
						let foundItems = this.field.options.optionItems.filter(chOpt => {
							return chOpt.value === chValue
						})
						if (!!foundItems && (foundItems.length > 0)) {
							checkedLabelList.push(foundItems[0].label)
						}
					})
					this.checkedList = checkedLabelList
				}
			},

			selectField(field) {
				if (!!this.designer) {
					this.designer.setSelected(field)
					this.designer.emitEvent('field-selected', this.parentWidget) //发送选中组件的父组件对象
				}
			},

			selectParentWidget(field) {
				if (this.parentWidget) {
					this.designer.setSelected(this.parentWidget)
				} else {
					this.designer.clearSelected()
				}
			},

			moveUpWidget(widget) {
				this.designer.moveUpWidget(this.parentList, this.indexOfParentList, this)
				this.designer.emitHistoryChange()
			},

			moveDownWidget(widget) {
				this.designer.moveDownWidget(this.parentList, this.indexOfParentList, this)
				this.designer.emitHistoryChange()
			},

			removeField() {
				if (!!this.parentList) {
					let nextSelected = null
					if (this.parentList.length === 1) {
						if (!!this.parentWidget) {
							nextSelected = this.parentWidget
						}
					} else if (this.parentList.length === (1 + this.indexOfParentList)) {
						nextSelected = this.parentList[this.indexOfParentList - 1]
					} else {
						nextSelected = this.parentList[this.indexOfParentList + 1]
					}

					this.$nextTick(() => {
						this.parentList.splice(this.indexOfParentList, 1)
						//if (!!nextSelected) {
						this.designer.setSelected(nextSelected)
						//}

						this.designer.emitHistoryChange()
					})
				}
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

			emitPrependButtonClick() {
				/* 必须调用mixins中的dispatch方法逐级向父组件发送消息！！ */
				this.dispatch('VFormRender', 'prependButtonClick', [this]);
			},
			emitAppendButtonClick() {
				/* 必须调用mixins中的dispatch方法逐级向父组件发送消息！！ */
				this.dispatch('VFormRender', 'appendButtonClick', [this]);
			},

			handleOnChange(val, oldVal) {
				if (!!this.field.options.onChange) {
					let changeFn = new Function('value', 'oldValue', this.field.options.onChange)
					changeFn.call(this, val, oldVal)
				}
			},

			handleOnChangeForSubForm(val, oldVal, subFormData, rowId) {
				if (!!this.field.options.onChange) {
					let changeFn = new Function('value', 'oldValue', 'subFormData', 'rowId', this.field.options.onChange)
					changeFn.call(this, val, oldVal, subFormData, rowId)
				}
			},

			// handleTextInput(content) {
			//   if (!!this.field.options.onTextInput) {
			//     let changeFn = new Function('content', this.field.options.onTextInput)
			//     changeFn.call(this, content)
			//   }
			// },

			handleChangeEvent(value) {				
				this.emitFieldDataChangeForForm(value, this.oldInputValue)
				//number组件一般不会触发focus事件，故此处需要手工赋值oldInputValue！！
				this.oldInputValue = value
			},

			handleFocusCustomEvent(event) {
				this.oldInputValue = this.fieldModel //保存修改change之前的值

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

				if (!!this.field.options.onInput) {
					let customFn = new Function('value', this.field.options.onInput);
					customFn.call(this, value)
				}
			},

			handleRichEditorFocusEvent(quill) {
				this.oldInputValue = this.fieldModel
			},

			handleRichEditorBlurEvent(quill) {
				if (this.valueChangedFlag) {
					this.$emit('field-value-changed', [this.fieldModel, this.oldInputValue])
					this.emitFieldDataChangeForForm(this.fieldModel, this.oldInputValue)
					this.valueChangedFlag = false
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

			emitFieldDataChangeForForm(newValue, oldValue /*, formDataModel*/ ) {
				/* 必须用dispatch向指定父组件派发消息！！ */
				this.dispatch('VFormRender', 'fieldChange',
					[this.field.options.name, newValue, oldValue, this.subFormName, this.subFormRowIndex])
			},

			remoteQuery(keyword) {
				if (!!this.field.options.onRemoteQuery) {
					let remoteFn = new Function('keyword', this.field.options.onRemoteQuery)
					remoteFn.call(this)
				}
			},

			getPropName() {
				if (this.subFormItemFlag && !this.designState) {
					return this.subFormName + "." + this.subFormRowIndex + "." + this.field.options.name + ""
				} else {
					return this.field.options.name
				}
			},

			buildFieldRules() {
				this.rules.splice(0, this.rules.length) //清空已有
				if (!!this.field.options.required) {
					this.rules.push({
						required: true,
						message: this.i18nt('render.hint.fieldRequired'),
					})
				}

				if (!!this.field.options.validation) {
					let vldName = this.field.options.validation
					if (!!vldName && !!FormValidators[vldName]) {
						this.rules.push({
							validator: FormValidators[vldName],
							trigger: ['blur', 'change'],
							label: this.field.options.label,
							errorMsg: this.field.options.validationHint
						})
					} else if (!!vldName) {
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
					let customFn = new Function('rule', 'value', 'callback', this.field.options.onValidate)
					this.rules.push({
						validator: customFn,
						trigger: ['blur', 'change'],
						label: this.field.options.label
					})
				}
			},

			initFileList() { //初始化上传组件的已上传文件列表
				if (((this.field.type !== 'picture-upload') && (this.field.type !== 'file-upload')) || (this
						.designState === true)) {
					return
				}

				if (!!this.formModel[this.field.options.name]) {
					if (Array.isArray(this.formModel[this.field.options.name])) {
						this.fileList = this.formModel[this.field.options.name]
					} else {
						this.fileList.splice(0, 0, this.formModel[this.field.options.name])
					}
				}
			},

			handlePictureExceed(files, fileList) {
				let uploadLimit = this.field.options.limit
				this.$Message.warning(eval('`' + this.i18nt('render.hint.uploadExceed') + '`'));
			},

			beforePictureUpload(file) {
				let fileTypeCheckResult = false
				if (!!this.field.options && !!this.field.options.fileTypes) {
					let uploadFileTypes = this.field.options.fileTypes
					if (uploadFileTypes.length > 0) {
						fileTypeCheckResult = uploadFileTypes.some((ft, idx) => {
							return file.type === 'image/' + ft
						})
					}
				}
				if (!fileTypeCheckResult) {
					this.$Message.error(this.i18nt('render.hint.unsupportedFileType') + file.type)
					return false;
				}

				let fileSizeCheckResult = false
				let uploadFileMaxSize = 5 //5MB
				if (!!this.field.options && !!this.field.options.fileMaxSize) {
					uploadFileMaxSize = this.field.options.fileMaxSize
				}
				fileSizeCheckResult = file.size / 1024 / 1024 <= uploadFileMaxSize
				if (!fileSizeCheckResult) {
					this.$Message.error(this.$('render.hint.fileSizeExceed') + uploadFileMaxSize + 'MB')
					return false;
				}

				this.uploadData.key = file.name
				return this.handleOnBeforeUpload(file)
			},

			handlePictureUpload(res, file, fileList) {
				if (!!this.field.options.onUploadSuccess) {
					let customFn = new Function('result', 'file', 'fileList', this.field.options.onUploadSuccess)
					customFn.call(this, res, file, fileList)
				} else {
					if (file.status === 'success') {
						this.fileList.push(file)
						if (!!this.formModel[this.field.options.name]) {
							this.formModel[this.field.options.name].push({
								name: file.name,
								url: file.url
							})
						} else {
							this.formModel[this.field.options.name] = [{
								name: file.name,
								url: file.url
							}]
						}
						this.uploadBtnHidden = this.fileList.length >= this.field.options.limit
					}
				}
			},

			handlePictureRemove(file, fileList) {
				let foundIdx = -1
				this.fileList.forEach((tf, idx) => {
					if (tf.name === file.name) {
						foundIdx = idx
					}
				})
				if (!!this.formModel[this.field.options.name]) {
					this.formModel[this.field.options.name].splice(foundIdx, 1)
				}

				this.fileList = fileList
				this.uploadBtnHidden = fileList.length >= this.field.options.limit
			},

			handelUploadError(err, file, fileList) {
				if (!!this.field.options.onUploadError) {
					let customFn = new Function('error', 'file', 'fileList', this.field.options.onUploadError)
					customFn.call(this, err, file, fileList)
				} else {
					this.$Message({
						message: this.i18nt('render.hint.uploadError') + err,
						duration: 3000,
						type: 'error',
					})
				}
			},

			handleFileExceed(files, fileList) {
				let uploadLimit = this.field.options.limit
				this.$Message.warning(eval('`' + this.i18nt('render.hint.uploadExceed') + '`'));
			},
			
			handleUploadPreview(files, fileList){
				if (!!this.field.options.onUploadPreview) {
					let customFn = new Function('error', 'file', 'fileList', this.field.options.onUploadPreview)
					customFn.call(this, err, file, fileList)
				}
			},
			
			handleUploadProgress(event, file, fileList){
				if (!!this.field.options.onUploadPregress) {
					let customFn = new Function('error', 'file', 'fileList', this.field.options.onUploadPregress)
					customFn.call(this, err, file, fileList)
				}
			},

			beforeFileUpload(file) {
				let fileTypeCheckResult = false
				let extFileName = file.name.substring(file.name.lastIndexOf('.') + 1)
				if (!!this.field.options && !!this.field.options.fileTypes) {
					let uploadFileTypes = this.field.options.fileTypes
					if (uploadFileTypes.length > 0) {
						fileTypeCheckResult = uploadFileTypes.some((ft, idx) => {
							return extFileName.toLowerCase() === ft.toLowerCase()
						})
					}
				}
				if (!fileTypeCheckResult) {
					this.$Message.error(this.i18nt('render.hint.unsupportedFileType') + extFileName)
					return false;
				}

				let fileSizeCheckResult = false
				let uploadFileMaxSize = 5 //5MB
				if (!!this.field.options && !!this.field.options.fileMaxSize) {
					uploadFileMaxSize = this.field.options.fileMaxSize
				}
				fileSizeCheckResult = file.size / 1024 / 1024 <= uploadFileMaxSize
				if (!fileSizeCheckResult) {
					this.$Message.error(this.i18nt('render.hint.fileSizeExceed') + uploadFileMaxSize + 'MB')
					return false;
				}

				this.uploadData.key = file.name
				return this.handleOnBeforeUpload(file)
			},

			handleFileUpload(res, file, fileList) {
				if (!!this.field.options.onUploadSuccess) {
					let mountFunc = new Function('result', 'file', 'fileList', this.field.options.onUploadSuccess)
					mountFunc.call(this, res, file, fileList)
				} else {
					if (file.status === 'success') {
						this.fileList.push(file)
						if (!!this.formModel[this.field.options.name]) {
							this.formModel[this.field.options.name].push({
								name: file.name,
								url: file.url
							})
						} else {
							this.formModel[this.field.options.name] = [{
								name: file.name,
								url: file.url
							}]
						}
						this.uploadBtnHidden = this.fileList.length >= this.field.options.limit
					}
				}
			},

			handleFileRemove(file, fileList) {
				let foundIdx = -1
				this.fileList.forEach((tf, idx) => {
					if (tf.name === file.name) {
						foundIdx = idx
					}
				})
				if (!!this.formModel[this.field.options.name]) {
					this.formModel[this.field.options.name].splice(foundIdx, 1)
				}

				this.fileList = fileList
				this.uploadBtnHidden = fileList.length >= this.field.options.limit
			},

			removeUploadFile(fileName) {
				let foundIdx = -1
				this.fileList.forEach((file, idx) => {
					if (file.name === fileName) {
						foundIdx = idx
					}
				})

				if (foundIdx >= 0) {
					this.fileList.splice(foundIdx, 1)
					if (!!this.formModel[this.field.options.name]) {
						this.formModel[this.field.options.name].splice(foundIdx, 1)
					}
					this.uploadBtnHidden = this.fileList.length >= this.field.options.limit
				}
			},

			//--------------------- 以下为组件支持外部调用的API方法 begin ------------------//
			/* 提示：用户可自行扩充这些方法！！！ */

			getFormRef() {
				/* 获取VFrom引用，必须在VForm组件created之后方可调用 */
				return this.refList['v_form_ref']
			},

			getWidgetRef(widgetName, showError) {
				let foundRef = this.refList[widgetName]
				if (!foundRef && !!showError) {
					this.$Message.error(this.i18nt('render.hint.refNotFound') + widgetName)
				}
				return foundRef
			},

			getFieldEditor() { //获取内置的el表单组件
				return this.$refs['fieldEditor']
			},

			setValue(newValue) {
				if (this.field.type === 'checkbox') {
					let checkedValueList = []
					if (!newValue) {
						this.checkedList = []
						return
					} else if (Array.isArray(newValue)) {
						checkedValueList = newValue
					} else {
						checkedValueList = [newValue]
					}

					let checkedLabelList = []
					checkedValueList.forEach(chValue => {
						let foundItems = this.field.options.optionItems.filter(chOpt => {
							return chOpt.value === chValue
						})
						if (!!foundItems && (foundItems.length > 0)) {
							checkedLabelList.push(foundItems[0].label)
						}
					})
					this.checkedList = checkedLabelList
				} else if ((this.field.type === 'picture-upload') || (this.field.type === 'file-upload')) {
					this.fileList = newValue
				} else if (!!this.field.formItemFlag) {
					this.fieldModel = newValue
				}
			},

			getValue() {
				/* TODO: 是否直接从formModel取值更方便?? */
				if (this.field.type === 'checkbox') {
					if ((!this.checkedList) || (this.checkedList.length <= 0)) {
						return []
					}

					let checkedValueList = []
					this.checkedList.forEach((checkedLabel) => {
						if (this.field.options.optionItems.length > 0) {
							let foundItems = this.field.options.optionItems.filter(chOpt => {
								return checkedLabel === chOpt.label
							})
							if (!!foundItems && (foundItems.length > 0)) {
								checkedValueList.push(foundItems[0].value)
							}
						}
					})
					return checkedValueList
				} else if ((this.field.type === 'picture-upload') || (this.field.type === 'file-upload')) {
					return this.fileList
				} else {
					return this.fieldModel
				}
			},

			resetField() {
				let defaultValue = this.field.options.defaultValue
				this.setValue(defaultValue)
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

			loadOptions(options) {
				//this.field.options.optionItems = options
				this.field.options.optionItems = deepClone(options)
				this.initCheckedList()
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

			//--------------------- 以上为组件支持外部调用的API方法 end ------------------//

		}
	}
</script>

<style lang="scss" scoped>
	@import "../../../styles/global.scss";

	.design-time-bottom-margin {
		margin-bottom: 5px;
	}

	.field-wrapper {
		position: relative;

		.field-action {
			position: absolute;
			//bottom: -24px;
			bottom: 0;
			right: -2px;
			height: 22px;
			line-height: 22px;
			background: $--color-primary;
			z-index: 9;

			i {
				font-size: 14px;
				color: #fff;
				margin: 0 5px;
				cursor: pointer;
			}
		}

		.drag-handler {
			position: absolute;
			top: 0;
			//bottom: -22px;  /* 拖拽手柄位于组件下方，有时无法正常拖动，原因未明？？ */
			left: -1px;
			height: 20px;
			line-height: 20px;
			//background: $--color-primary;
			z-index: 9;
			display:flex;
			align-items: center;

			i {
				font-size: 12px;
				font-style: normal;
				color: #fff;
				margin: 0px 4px;
				
				cursor: move;
			}

			&:hover {
				//opacity: 1;
				background: $--color-primary;
			}
		}
	}

	.ivu-form-item {
		//margin-bottom: 0 !important;
		//margin-bottom: 6px;

		//margin-top: 2px;
		position: relative;

		::v-deep .el-form-item__label {
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		::v-deep .el-form-item__content {
			//position: unset;  /* TODO: 忘了这个样式设置是为了解决什么问题？？ */
		}

		span.custom-label i {
			margin: 0 3px;
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
		
		::v-deep .hide-button{
			.ivu-input-group-append,.ivu-input-group-prepend{
				padding:0px;
				border: none;
			}
		}
	}

	.required ::v-deep .el-form-item__label::before {
		content: '*';
		color: #F56C6C;
		margin-right: 4px;
	}

	.static-content-item {
		min-height: 20px;
		display: flex;
		/* 垂直居中 */
		align-items: center;
		/* 垂直居中 */

		::v-deep .el-divider--horizontal {
			margin: 0;
		}
	}

	.el-form-item.selected,
	.static-content-item.selected {
		outline: 2px solid $--color-primary;
	}

	::v-deep .label-left-align .ivu-form-item-label {
		text-align: left;
	}

	::v-deep .label-center-align .ivu-form-item-label {
		text-align: center;
	}

	::v-deep .label-right-align .ivu-form-item-label {
		text-align: right;
	}

	.full-width-input {
		width: 100% !important;
	}

	.dynamicPseudoAfter ::v-deep .el-upload.el-upload--text {
		color: $--color-primary;
		font-size: 12px;

		.el-icon-plus:after {
			content: var(--select-file-action);
		}
	}

	.hideUploadDiv {
		::v-deep div.el-upload--picture-card {
			/* 隐藏最后的图片上传按钮 */
			display: none;
		}

		::v-deep div.el-upload--text {
			/* 隐藏最后的文件上传按钮 */
			display: none;
		}

		::v-deep div.el-upload__tip {
			/* 隐藏最后的文件上传按钮 */
			display: none;
		}
	}
	
	
</style>
