import Vue from 'vue'

/**
 * 格式说明：属性名称==对应属性编辑器的组件名称
 */
const COMMON_PROPERTIES = {
  //字段
  'name'              :            'name-editor',
  'label'             :            'label-editor',
  'labelAlign'        :            'labelAlign-editor',
  'type'              :            'type-editor',
  'defaultValue'      :            'defaultValue-editor',
  'placeholder'       :            'placeholder-editor',
  'startPlaceholder'  :            'startPlaceholder-editor',
  'endPlaceholder'    :            'endPlaceholder-editor',
  'columnWidth'       :            'columnWidth-editor',
  'size'              :            'size-editor',
  'displayStyle'      :            'displayStyle-editor',
  'buttonStyle'       :            'buttonStyle-editor',
  'border'            :            'border-editor',
  'labelWidth'        :            'labelWidth-editor',
  'labelHidden'       :            'labelHidden-editor',
  'rows'              :            'rows-editor',
  'required'          :            'required-editor',
  'validation'        :            'validation-editor',
  'validationHint'    :            'validationHint-editor',
  'readonly'          :            'readonly-editor',
  'disabled'          :            'disabled-editor',
  'hidden'            :            'hidden-editor',
  'clearable'         :            'clearable-editor',
  'editable'          :            'editable-editor',
  'showPassword'      :            'showPassword-editor',
  'textContent'       :            'textContent-editor',
  'htmlContent'       :            'htmlContent-editor',
  'format'            :            'format-editor',
  'valueFormat'       :            'valueFormat-editor',
  'filterable'        :            'filterable-editor',
  'allowCreate'       :            'allowCreate-editor',
  'remote'            :            'remote-editor',
  'automaticDropdown' :            'automaticDropdown-editor',
  'multiple'          :            'multiple-editor',
  'multipleLimit'     :            'multipleLimit-editor',
  'contentPosition'   :            'contentPosition-editor',
  'optionItems'       :            'optionItems-editor',
  'uploadURL'         :            'uploadURL-editor',
  'uploadTip'         :            'uploadTip-editor',
  'withCredentials'   :            'withCredentials-editor',
  'multipleSelect'    :            'multipleSelect-editor',
  'limit'             :            'limit-editor',
  'fileMaxSize'       :            'fileMaxSize-editor',
  'fileTypes'         :            'fileTypes-editor',
  'customClass'       :            'customClass-editor',

  //容器
  'showBlankRow'       :            'showBlankRow-editor',
  'showRowNumber'      :            'showRowNumber-editor',
  'cellWidth'          :            'cellWidth-editor',
  'cellHeight'         :            'cellHeight-editor',
  'gutter'             :            'gutter-editor',
  'span'               :            'span-editor',
  'offset'             :            'offset-editor',
  'push'               :            'push-editor',
  'pull'               :            'pull-editor',

}

const ADVANCED_PROPERTIES = {
  'min'               :            'min-editor',
  'max'               :            'max-editor',
  'precision'         :            'precision-editor',
  'step'              :            'step-editor',
  'controlsPosition'  :            'controlsPosition-editor',
  'minLength'         :            'minLength-editor',
  'maxLength'         :            'maxLength-editor',
  'showWordLimit'     :            'showWordLimit-editor',
  'prefixIcon'        :            'prefixIcon-editor',
  'suffixIcon'        :            'suffixIcon-editor',
  'switchWidth'       :            'switchWidth-editor',
  'activeText'        :            'activeText-editor',
  'inactiveText'      :            'inactiveText-editor',
  'activeColor'       :            'activeColor-editor',
  'inactiveColor'     :            'inactiveColor-editor',
  'lowThreshold'      :            'lowThreshold-editor',
  'highThreshold'     :            'highThreshold-editor',
  'allowHalf'         :            'allowHalf-editor',
  'showText'          :            'showText-editor',
  'showScore'         :            'showScore-editor',
  'range'             :            'range-editor',
  'vertical'          :            'vertical-editor',
  'plain'             :            'plain-editor',
  'round'             :            'round-editor',
  'circle'            :            'circle-editor',
  'icon'              :            'icon-editor',
  'labelIconClass'    :            'labelIconClass-editor',
  'labelIconPosition' :            'labelIconPosition-editor',
  'labelTooltip'      :            'labelTooltip-editor',
  'appendButton'      :            'appendButton-editor',
  'appendButtonDisabled':          'appendButtonDisabled-editor',
  'buttonIcon'        :            'buttonIcon-editor',

}

const EVENT_PROPERTIES = {
  //字段
  'onCreated'         :            'onCreated-editor',
  'onMounted'         :            'onMounted-editor',
  'onClick'           :            'onClick-editor',
  'onInput'           :            'onInput-editor',
  'onChange'          :            'onChange-editor',
  'onFocus'           :            'onFocus-editor',
  'onBlur'            :            'onBlur-editor',
  'onRemoteQuery'     :            'onRemoteQuery-editor',
  'onBeforeUpload'    :            'onBeforeUpload-editor',
  'onUploadSuccess'   :            'onUploadSuccess-editor',
  'onUploadError'     :            'onUploadError-editor',
  'onValidate'        :            'onValidate-editor',

  //容器
  'onSubFormRowAdd'   :            'onSubFormRowAdd-editor',
  'onSubFormRowInsert':            'onSubFormRowInsert-editor',
  'onSubFormRowDelete':            'onSubFormRowDelete-editor',
  'onSubFormRowChange':            'onSubFormRowChange-editor',

}

/**
 * 如属性编辑器的组件名称设置为null，则不显示该属性编辑器！！
 * @param propName 属性名称
 * @param propEditorName 对应属性编辑器的组件名称
 */
export function registerCommonProperty(propName, propEditorName) {
  COMMON_PROPERTIES[propName] = propEditorName
}

export function registerAdvancedProperty(propName, propEditorName) {
  ADVANCED_PROPERTIES[propName] = propEditorName
}

export function registerEventProperty(propName, propEditorName) {
  EVENT_PROPERTIES[propName] = propEditorName
}

export function registerCPEditor(propName, propEditorName, editorComponent) {
  Vue.component(propEditorName, editorComponent)
  registerCommonProperty(propName, propEditorName)
}

export function registerAPEditor(propName, propEditorName, editorComponent) {
  Vue.component(propEditorName, editorComponent)
  registerAdvancedProperty(propName, propEditorName)
}

export function registerEPEditor(propName, propEditorName, editorComponent) {
  Vue.component(propEditorName, editorComponent)
  registerEventProperty(propName, propEditorName)
}

export default {
  COMMON_PROPERTIES,
  ADVANCED_PROPERTIES,
  EVENT_PROPERTIES
}


