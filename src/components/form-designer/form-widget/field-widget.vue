<!--
/**
 * author: vformAdmin
 * email: vdpadmin@163.com
 * website: http://www.vform666.com/
 * date: 2021.08.18
 * remark: 如果要分发VForm源码，需在本文件顶部保留此文件头信息！！
 */
-->

<template>
  <div class="field-wrapper" :class="{'design-time-bottom-margin': !!this.designer}">
    <el-form-item v-if="!!field.formItemFlag" :label="label" :label-width="labelWidth + 'px'"
                  :title="field.options.labelTooltip"
                  v-show="!field.options.hidden || (designState === true)"
                  :rules="rules" :prop="getPropName()"
                  :class="[selected ? 'selected' : '', labelAlign, customClass, field.options.required ? 'required' : '']"
                  @click.native.stop="selectField(field)">

      <span v-if="!!field.options.labelIconClass" slot="label" class="custom-label">
        <template v-if="field.options.labelIconPosition === 'front'">
          <template v-if="!!field.options.labelTooltip">
            <el-tooltip :content="field.options.labelTooltip" effect="light">
              <i :class="field.options.labelIconClass"></i></el-tooltip>{{label}}</template>
          <template v-else>
            <i :class="field.options.labelIconClass"></i>{{label}}</template>
        </template>
        <template v-else-if="field.options.labelIconPosition === 'rear'">
          <template v-if="!!field.options.labelTooltip">
            {{label}}<el-tooltip :content="field.options.labelTooltip" effect="light">
            <i :class="field.options.labelIconClass"></i></el-tooltip></template>
          <template v-else>
            {{label}}<i :class="field.options.labelIconClass"></i></template>
        </template>
      </span>

      <template v-if="field.type === 'input'">
        <el-input ref="fieldEditor" v-model="fieldModel"
                  :disabled="field.options.disabled" :readonly="field.options.readonly"
                  :size="field.options.size" class="hide-spin-button"
                  :type="inputType"
                  :show-password="field.options.showPassword"
                  :placeholder="field.options.placeholder"
                  :clearable="field.options.clearable"
                  :minlength="field.options.minLength" :maxlength="field.options.maxLength"
                  :show-word-limit="field.options.showWordLimit"
                  :prefix-icon="field.options.prefixIcon" :suffix-icon="field.options.suffixIcon"
                  @focus="handleFocusCustomEvent" @blur="handleBlurCustomEvent" @input="handleInputCustomEvent"
                  @change="handleChangeEvent">
          <el-button slot="append" v-if="field.options.appendButton" :disabled="field.options.disabled || field.options.appendButtonDisabled"
                     :class="field.options.buttonIcon" @click.native="emitAppendButtonClick"></el-button>
        </el-input>
      </template>

      <template v-if="field.type === 'textarea'">
        <el-input type="textarea" ref="fieldEditor" v-model="fieldModel"
                  :disabled="field.options.disabled" :readonly="field.options.readonly"
                  :size="field.options.size"
                  :placeholder="field.options.placeholder" :rows="field.options.rows"
                  :minlength="field.options.minLength" :maxlength="field.options.maxLength"
                  :show-word-limit="field.options.showWordLimit"
                  @focus="handleFocusCustomEvent" @blur="handleBlurCustomEvent" @input="handleInputCustomEvent"
                  @change="handleChangeEvent">
        </el-input>
      </template>

      <template v-if="field.type === 'number'">
        <el-input-number ref="fieldEditor" v-model="fieldModel" class="full-width-input"
                         :disabled="field.options.disabled"
                         :size="field.options.size" :controls-position="field.options.controlsPosition"
                         :placeholder="field.options.placeholder"
                         :min="field.options.min" :max="field.options.max"
                         :precision="field.options.precision" :step="field.options.step"
                         @focus="handleFocusCustomEvent" @blur="handleBlurCustomEvent"
                         @change="handleChangeEvent"></el-input-number>
      </template>

      <template v-if="field.type === 'radio'">
        <el-radio-group ref="fieldEditor" v-model="fieldModel"
                        :disabled="field.options.disabled" :size="field.options.size"
                        @change="handleChangeEvent">
          <template v-if="!!field.options.buttonStyle">
            <el-radio-button v-for="(item, index) in field.options.optionItems" :key="index" :label="item.value"
                      :disabled="item.disabled" :border="field.options.border"
                      :style="{display: field.options.displayStyle}">{{item.label}}</el-radio-button>
          </template>
          <template v-else>
            <el-radio v-for="(item, index) in field.options.optionItems" :key="index" :label="item.value"
                      :disabled="item.disabled" :border="field.options.border"
                      :style="{display: field.options.displayStyle}">{{item.label}}</el-radio>
          </template>
        </el-radio-group>
      </template>

      <template v-if="field.type === 'checkbox'">
        <el-checkbox-group ref="fieldEditor" v-model="fieldModel"
                           :disabled="field.options.disabled" :size="field.options.size"
                           @change="handleChangeEvent">
          <template v-if="!!field.options.buttonStyle">
            <el-checkbox-button v-for="(item, index) in field.options.optionItems" :key="index" :label="item.value"
                                :disabled="item.disabled" :border="field.options.border"
                                :style="{display: field.options.displayStyle}">{{item.label}}</el-checkbox-button>
          </template>
          <template v-else>
            <el-checkbox v-for="(item, index) in field.options.optionItems" :key="index" :label="item.value"
                         :disabled="item.disabled" :border="field.options.border"
                         :style="{display: field.options.displayStyle}">{{item.label}}</el-checkbox>
          </template>
        </el-checkbox-group>
      </template>

      <template v-if="field.type === 'select'">
        <el-select ref="fieldEditor" v-model="fieldModel" class="full-width-input"
                   :disabled="field.options.disabled"
                   :size="field.options.size"
                   :clearable="field.options.clearable"
                   :filterable="field.options.filterable"
                   :allow-create="field.options.allowCreate"
                   :default-first-option="allowDefaultFirstOption"
                   :automatic-dropdown="field.options.automaticDropdown"
                   :multiple="field.options.multiple" :multiple-limit="field.options.multipleLimit"
                   :placeholder="field.options.placeholder || i18nt('render.hint.selectPlaceholder')"
                   :remote="this.field.options.remote" :remote-method="remoteQuery"
                   @focus="handleFocusCustomEvent" @blur="handleBlurCustomEvent"
                   @change="handleChangeEvent">
          <el-option v-for="item in field.options.optionItems" :key="item.value" :label="item.label"
                  :value="item.value" :disabled="item.disabled">
          </el-option>
        </el-select>
      </template>

      <template v-if="field.type === 'time'">
        <el-time-picker ref="fieldEditor" v-model="fieldModel" class="full-width-input"
                        :disabled="field.options.disabled" :readonly="field.options.readonly"
                        :size="field.options.size"
                        :clearable="field.options.clearable" :editable="field.options.editable"
                        :format="field.options.format" value-format="HH:mm:ss"
                        :placeholder="field.options.placeholder || i18nt('render.hint.timePlaceholder')"
                        @focus="handleFocusCustomEvent" @blur="handleBlurCustomEvent"
                        @change="handleChangeEvent">
        </el-time-picker>
      </template>

      <template v-if="field.type === 'time-range'">
        <el-time-picker ref="fieldEditor" is-range v-model="fieldModel" class="full-width-input"
                        :disabled="field.options.disabled" :readonly="field.options.readonly"
                        :size="field.options.size"
                        :clearable="field.options.clearable" :editable="field.options.editable"
                        :format="field.options.format" value-format="HH:mm:ss"
                        :start-placeholder="field.options.startPlaceholder || i18nt('render.hint.startTimePlaceholder')"
                        :end-placeholder="field.options.endPlaceholder || i18nt('render.hint.endTimePlaceholder')"
                        @focus="handleFocusCustomEvent" @blur="handleBlurCustomEvent"
                        @change="handleChangeEvent">
        </el-time-picker>
      </template>

      <template v-if="field.type === 'date'">
        <el-date-picker ref="fieldEditor" :type="field.options.type" v-model="fieldModel" class="full-width-input"
                        :readonly="field.options.readonly" :disabled="field.options.disabled"
                        :size="field.options.size"
                        :clearable="field.options.clearable" :editable="field.options.editable"
                        :format="field.options.format" :value-format="field.options.valueFormat"
                        :placeholder="field.options.placeholder || i18nt('render.hint.datePlaceholder')"
                        @focus="handleFocusCustomEvent" @blur="handleBlurCustomEvent"
                        @change="handleChangeEvent"></el-date-picker>
      </template>

      <template v-if="field.type === 'date-range'">
        <el-date-picker ref="fieldEditor" :type="field.options.type" v-model="fieldModel" class="full-width-input"
                        :disabled="field.options.disabled" :readonly="field.options.readonly"
                        :size="field.options.size"
                        :clearable="field.options.clearable" :editable="field.options.editable"
                        :format="field.options.format" :value-format="field.options.valueFormat"
                        :start-placeholder="field.options.startPlaceholder || i18nt('render.hint.startDatePlaceholder')"
                        :end-placeholder="field.options.endPlaceholder || i18nt('render.hint.endDatePlaceholder')"
                        @focus="handleFocusCustomEvent" @blur="handleBlurCustomEvent"
                        @change="handleChangeEvent"></el-date-picker>
      </template>

      <template v-if="field.type === 'switch'">
        <el-switch ref="fieldEditor" v-model="fieldModel"
                   :disabled="field.options.disabled"
                   :active-text="field.options.activeText" :inactive-text="field.options.inactiveText"
                   :active-color="field.options.activeColor" :inactive-color="field.options.inactiveColor"
                   :width="field.options.switchWidth"
                   @change="handleChangeEvent">
        </el-switch>
      </template>

      <template v-if="field.type === 'rate'">
        <el-rate ref="fieldEditor" v-model="fieldModel"
                 :disabled="field.options.disabled"
                 :max="field.options.max"
                 :low-threshold="field.options.lowThreshold" :high-threshold="field.options.highThreshold"
                 :allow-half="field.options.allowHalf"
                 :show-text="field.options.showText" :show-score="field.options.showScore"
                 @change="handleChangeEvent"></el-rate>
      </template>

      <template v-if="field.type === 'color'">
        <el-color-picker ref="fieldEditor" v-model="fieldModel"
                         :size="field.options.size"
                         :disabled="field.options.disabled"
                         @change="handleChangeEvent"></el-color-picker>
      </template>

      <template v-if="field.type === 'slider'">
        <el-slider ref="fieldEditor" v-model="fieldModel"
                   :disabled="field.options.disabled"
                   :min="field.options.min" :max="field.options.max" :step="field.options.step"
                   :range="field.options.range" :vertical="field.options.vertical"
                   @change="handleChangeEvent"></el-slider>
      </template>

      <template v-if="field.type === 'picture-upload'">
        <el-upload ref="fieldEditor" :disabled="field.options.disabled"
                   :action="field.options.uploadURL" :headers="uploadHeaders" :data="uploadData"
                   :with-credentials="field.options.withCredentials"
                   :multiple="field.options.multipleSelect" :file-list="fileList" :show-file-list="field.options.showFileList"
                   list-type="picture-card" :class="{'hideUploadDiv': uploadBtnHidden}"
                   :limit="field.options.limit" :on-exceed="handlePictureExceed"
                   :before-upload="beforePictureUpload"
                   :on-success="handlePictureUpload" :on-error="handelUploadError" :on-remove="handlePictureRemove">
          <div slot="tip" class="el-upload__tip"
               v-if="!!field.options.uploadTip">{{field.options.uploadTip}}</div>
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </template>

      <template v-if="field.type === 'file-upload'">
        <el-upload ref="fieldEditor" :disabled="field.options.disabled"
                   :style="styleVariables" class="dynamicPseudoAfter"
                   :action="field.options.uploadURL" :headers="uploadHeaders" :data="uploadData"
                   :with-credentials="field.options.withCredentials"
                   :multiple="field.options.multipleSelect" :file-list="fileList"
                   :show-file-list="field.options.showFileList" :class="{'hideUploadDiv': uploadBtnHidden}"
                   :limit="field.options.limit" :on-exceed="handleFileExceed" :before-upload="beforeFileUpload"
                   :on-success="handleFileUpload" :on-error="handelUploadError" :on-remove="handleFileRemove">
          <div slot="tip" class="el-upload__tip"
               v-if="!!field.options.uploadTip">{{field.options.uploadTip}}</div>
          <i slot="default" class="el-icon-plus avatar-uploader-icon"></i>
          <div slot="file" slot-scope="{file}" class="upload-file-list">
            <span class="upload-file-name" :title="file.name">{{file.name}}</span>
            <a :href="file.url" download="">
              <i class="el-icon-download file-action" title="i18nt('render.hint.downloadFile')"></i></a>
            <i class="el-icon-delete file-action" title="i18nt('render.hint.removeFile')" v-if="!field.options.disabled"
               @click="removeUploadFile(file.name)"></i>
          </div>
        </el-upload>
      </template>

      <template v-if="field.type === 'rich-editor'">
        <vue-editor ref="fieldEditor" v-model="fieldModel" :editor-toolbar="customToolbar"
                    :disabled="field.options.disabled" :placeholder="field.options.placeholder"
                    @text-change="handleRichEditorChangeEvent"
                    @focus="handleRichEditorFocusEvent" @blur="handleRichEditorBlurEvent"></vue-editor>
      </template>

      <template v-if="field.type === 'cascader'">
        <el-cascader ref="fieldEditor" :options="field.options.optionItems" v-model="fieldModel" class="full-width-input"
                     :disabled="field.options.disabled"
                     :size="field.options.size"
                     :clearable="field.options.clearable"
                     :filterable="field.options.filterable"
                     :placeholder="field.options.placeholder || i18nt('render.hint.selectPlaceholder')"
                     @focus="handleFocusCustomEvent" @blur="handleBlurCustomEvent"
                     @change="handleChangeEvent"></el-cascader>
      </template>

    </el-form-item>
    <div v-else class="static-content-item" v-show="!field.options.hidden || (designState === true)"
         :class="{'selected': selected}" @click.stop="selectField(field)">
      <template v-if="field.type === 'static-text'">
        <div ref="fieldEditor">{{field.options.textContent}}</div>
      </template>

      <template v-if="field.type === 'html-text'">
        <div ref="fieldEditor" v-html="field.options.htmlContent"></div>
      </template>

      <template v-if="field.type === 'button'">
        <el-button ref="fieldEditor" :type="field.options.type"
                   :plain="field.options.plain" :round="field.options.round"
                   :circle="field.options.circle" :icon="field.options.icon"
                   :disabled="field.options.disabled"
                   @click.native="handleButtonWidgetClick">
          {{field.options.label}}</el-button>
      </template>

      <template v-if="field.type === 'divider'">
        <el-divider ref="fieldEditor"
                    direction="horizontal" :content-position="field.options.contentPosition">
          {{field.options.label}}</el-divider>
      </template>

    </div>

    <template v-if="!!this.designer">
      <div class="field-action" v-if="designer.selectedId === field.id">
        <i class="el-icon-back" :title="i18nt('designer.hint.selectParentWidget')" @click.stop="selectParentWidget(field)"></i>
        <i class="el-icon-top" v-if="!!parentList && (parentList.length > 1)" :title="i18nt('designer.hint.moveUpWidget')"
           @click.stop="moveUpWidget(field)"></i>
        <i class="el-icon-bottom" v-if="!!parentList && (parentList.length > 1)" :title="i18nt('designer.hint.moveDownWidget')"
           @click.stop="moveDownWidget(field)"></i>
        <i class="el-icon-delete" :title="i18nt('designer.hint.remove')" @click.stop="removeFieldWidget"></i>
      </div>

      <div class="drag-handler background-opacity" v-if="designer.selectedId === field.id">
        <i class="el-icon-rank" :title="i18nt('designer.hint.dragHandler')"></i>
        <i>{{i18nt('designer.widgetLabel.' + field.type)}}</i>
        <i v-if="field.options.hidden === true" class="iconfont icon-hide"></i>
      </div>
    </template>
  </div>
</template>

<script>
  //import ElFormItem from 'element-ui/packages/form/src/form-item.vue'  /* 用于源码调试Element UI */
  //import ElInput from 'element-ui/packages/input/src/input.vue'  /* 用于源码调试Element UI */
  //import ElUpload from 'element-ui/packages/upload/src/index.vue'  /* 用于源码调试Element UI */
  import emitter from 'element-ui/lib/mixins/emitter'
  import {deepClone} from "../../../utils/util";
  import FormValidators from '../../../utils/validators'
  import i18n, {translate} from "../../../utils/i18n";

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

      subFormRowIndex: { /* 子表单组件行索引，从0开始计数 */
        type: Number,
        default: -1
      },
      subFormColIndex: { /* 子表单组件列索引，从0开始计数 */
        type: Number,
        default: -1
      },
      subFormRowId: { /* 子表单组件行Id，唯一id且不可变 */
        type: String,
        default: ''
      },

    },
    components: {
      //ElFormItem,
      //ElInput,
      //ElUpload,

      VueEditor: resolve => { //懒加载！！
        require(['vue2-editor'], ({VueEditor}) => resolve(VueEditor))
      }
    },
    inject: ['refList', 'formConfig', 'globalOptionData', 'globalModel'],
    data() {
      return {
        oldFieldValue: null, //field组件change之前的值
        valueChangedFlag: false, //vue2-editor数据值是否改变标志
        fieldModel: null,
        rules: [],

        checkedList: [],

        uploadHeaders: {},
        uploadData: {
          key: '',  //七牛云上传文件名
          //token: '',  //七牛云上传token

          //policy: '',  //又拍云上传policy
          //authorization: '',  //又拍云上传签名
        },
        fileList: [],  //上传文件列表
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
          return 'text'  //当input的type设置为number时，如果输入非数字字符，则v-model拿到的值为空字符串，无法实现输入校验！故屏蔽之！！
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
      //
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

      initOptionItems() {
        if (this.designState) {
          return
        }

        if ((this.field.type === 'radio') || (this.field.type === 'checkbox')
            || (this.field.type === 'select') || (this.field.type === 'cascader')) {
          if (!!this.globalOptionData && this.globalOptionData.hasOwnProperty(this.field.options.name)) {
            this.loadOptions( this.globalOptionData[this.field.options.name] )
          }
        }
      },

      refreshDefaultValue() {
        if ((this.designState === true) && (this.field.options.defaultValue !== undefined)) {
          this.fieldModel = this.field.options.defaultValue
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

      initEventHandler() {
        this.$on('setFormData', function (newFormData) {
          console.log('formModel of globalModel----------', this.globalModel.formModel)
          if (!this.subFormItemFlag) {
            this.setValue(newFormData[this.field.options.name])
          }
        })

        this.$on('field-value-changed', function (values) {
          if (!!this.subFormItemFlag) {
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

      selectField(field) {
        if (!!this.designer) {
          this.designer.setSelected(field)
          this.designer.emitEvent('field-selected', this.parentWidget)  //发送选中组件的父组件对象
        }
      },

      selectParentWidget() {
        if (this.parentWidget) {
          this.designer.setSelected(this.parentWidget)
        } else {
          this.designer.clearSelected()
        }
      },

      moveUpWidget() {
        this.designer.moveUpWidget(this.parentList, this.indexOfParentList)
        this.designer.emitHistoryChange()
      },

      moveDownWidget() {
        this.designer.moveDownWidget(this.parentList, this.indexOfParentList)
        this.designer.emitHistoryChange()
      },

      removeFieldWidget() {
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

      handleChangeEvent(value) {
        this.syncUpdateFormModel(value)
        this.emitFieldDataChange(value, this.oldFieldValue)

        //number组件一般不会触发focus事件，故此处需要手工赋值oldFieldValue！！
        this.oldFieldValue = deepClone(value)  /* oldFieldValue需要在initFieldModel()方法中赋初值!! */
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
        if (!!this.field.options.onInput) {
          let customFn = new Function('value', this.field.options.onInput)
          customFn.call(this, value)
        }
      },

      handleRichEditorChangeEvent() {
        this.valueChangedFlag = true
      },

      handleRichEditorFocusEvent() {
        this.oldFieldValue = deepClone(this.fieldModel)
      },

      handleRichEditorBlurEvent() {
        if (this.valueChangedFlag) {
          this.emitFieldDataChange(this.fieldModel, this.oldFieldValue)
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

      remoteQuery(keyword) {
        if (!!this.field.options.onRemoteQuery) {
          let remoteFn = new Function('keyword', this.field.options.onRemoteQuery)
          remoteFn.call(this, keyword)
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
        this.rules.splice(0, this.rules.length)  //清空已有
        if (!!this.field.options.required) {
          this.rules.push({
            required: true,
            message: this.i18nt('render.hint.fieldRequired'),
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
          let customFn = new Function('rule', 'value', 'callback', this.field.options.onValidate)
          this.rules.push({
            validator: customFn,
            trigger: ['blur', 'change'],
            label: this.field.options.label
          })
        }
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

      handlePictureExceed() {
        //let uploadLimit = this.field.options.limit
        this.$message.warning(eval('`' + this.i18nt('render.hint.uploadExceed') + '`'));
      },

      updateUploadFieldModelAndEmitDataChange() {
        let oldValue = deepClone(this.fieldModel)
        this.fieldModel = deepClone(this.fileList)
        this.syncUpdateFormModel(this.fieldModel)
        this.emitFieldDataChange(this.fieldModel, oldValue)
      },

      beforePictureUpload(file) {
        let fileTypeCheckResult = false
        if (!!this.field.options && !!this.field.options.fileTypes) {
          let uploadFileTypes = this.field.options.fileTypes
          if (uploadFileTypes.length > 0) {
            fileTypeCheckResult = uploadFileTypes.some( (ft) => {
              return file.type === 'image/' + ft
            })
          }
        }
        if (!fileTypeCheckResult) {
          this.$message.error(this.i18nt('render.hint.unsupportedFileType') + file.type)
          return false;
        }

        let fileSizeCheckResult = false
        let uploadFileMaxSize = 5  //5MB
        if (!!this.field.options && !!this.field.options.fileMaxSize) {
          uploadFileMaxSize = this.field.options.fileMaxSize
        }
        fileSizeCheckResult = file.size / 1024 / 1024 <= uploadFileMaxSize
        if (!fileSizeCheckResult) {
          this.$message.error(this.$('render.hint.fileSizeExceed') + uploadFileMaxSize + 'MB')
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
            this.updateUploadFieldModelAndEmitDataChange()

            this.uploadBtnHidden = this.fileList.length >= this.field.options.limit
          }
        }
      },

      handlePictureRemove(file, fileList) {
        let foundIdx = -1
        this.fileList.forEach((tf,idx) => {
          if (tf.name === file.name) {
            foundIdx = idx
          }
        })

        this.fileList = fileList
        this.updateUploadFieldModelAndEmitDataChange()

        this.uploadBtnHidden = fileList.length >= this.field.options.limit
      },

      handelUploadError(err, file, fileList) {
        if (!!this.field.options.onUploadError) {
          let customFn = new Function('error', 'file', 'fileList', this.field.options.onUploadError)
          customFn.call(this, err, file, fileList)
        } else {
          this.$message({
            message: this.i18nt('render.hint.uploadError') + err,
            duration: 3000,
            type: 'error',
          })
        }
      },

      handleFileExceed() {
        //let uploadLimit = this.field.options.limit
        this.$message.warning(eval('`' + this.i18nt('render.hint.uploadExceed') + '`'));
      },

      beforeFileUpload(file) {
        let fileTypeCheckResult = false
        let extFileName = file.name.substring(file.name.lastIndexOf('.') + 1)
        if (!!this.field.options && !!this.field.options.fileTypes) {
          let uploadFileTypes = this.field.options.fileTypes
          if (uploadFileTypes.length > 0) {
            fileTypeCheckResult = uploadFileTypes.some( (ft) => {
              return extFileName.toLowerCase() === ft.toLowerCase()
            })
          }
        }
        if (!fileTypeCheckResult) {
          this.$message.error(this.i18nt('render.hint.unsupportedFileType') + extFileName)
          return false;
        }

        let fileSizeCheckResult = false
        let uploadFileMaxSize = 5  //5MB
        if (!!this.field.options && !!this.field.options.fileMaxSize) {
          uploadFileMaxSize = this.field.options.fileMaxSize
        }
        fileSizeCheckResult = file.size / 1024 / 1024 <= uploadFileMaxSize
        if (!fileSizeCheckResult) {
          this.$message.error(this.i18nt('render.hint.fileSizeExceed') + uploadFileMaxSize + 'MB')
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
            this.updateUploadFieldModelAndEmitDataChange()

            this.uploadBtnHidden = this.fileList.length >= this.field.options.limit
          }
        }
      },

      handleFileRemove(file, fileList) {
        let foundIdx = -1
        this.fileList.forEach((tf,idx) => {
          if (tf.name === file.name) {
            foundIdx = idx
          }
        })

        this.fileList = fileList
        this.updateUploadFieldModelAndEmitDataChange()

        this.uploadBtnHidden = fileList.length >= this.field.options.limit
      },

      removeUploadFile(fileName) {
        let foundIdx = -1
        this.fileList.forEach((file,idx) => {
          if (file.name === fileName) {
            foundIdx = idx
          }
        })

        if (foundIdx >= 0) {
          this.fileList.splice(foundIdx, 1)
          this.updateUploadFieldModelAndEmitDataChange()

          this.uploadBtnHidden = this.fileList.length >= this.field.options.limit
        }
      },

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

      loadOptions(options) {
        this.field.options.optionItems = deepClone(options)
        this.clearSelectedOptions()  //清空已选选项
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

    .field-action{
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

      i {
        font-size: 12px;
        font-style: normal;
        color: #fff;
        margin: 4px;
        cursor: move;
      }

      &:hover {
        //opacity: 1;
        background: $--color-primary;
      }
    }
  }

  .el-form-item {
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
  }

  .required ::v-deep .el-form-item__label::before {
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }

  .static-content-item {
    min-height: 20px;
    display: flex;  /* 垂直居中 */
    align-items: center;  /* 垂直居中 */

    ::v-deep .el-divider--horizontal {
      margin: 0;
    }
  }

  .el-form-item.selected, .static-content-item.selected {
    outline: 2px solid $--color-primary;
  }

  ::v-deep .label-left-align .el-form-item__label {
    text-align: left;
  }

  ::v-deep .label-center-align .el-form-item__label {
    text-align: center;
  }

  ::v-deep .label-right-align .el-form-item__label {
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
    ::v-deep div.el-upload--picture-card { /* 隐藏最后的图片上传按钮 */
      display: none;
    }

    ::v-deep div.el-upload--text { /* 隐藏最后的文件上传按钮 */
      display: none;
    }

    ::v-deep div.el-upload__tip { /* 隐藏最后的文件上传按钮 */
      display: none;
    }
  }

  .upload-file-list {
    font-size: 12px;

    .file-action {
      color: $--color-primary;
      margin-left: 5px;
      margin-right: 5px;
      cursor: pointer;
    }
  }

</style>
