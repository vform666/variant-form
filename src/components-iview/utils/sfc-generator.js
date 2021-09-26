import {isNotNull} from "@/utils/util";
import {genVue2JS} from "./vue2js-generator";
import {beautifierOpts} from "@/utils/beautifierLoader";
import {genVue3JS} from "./vue3js-generator";

function buildClassAttr(ctn, defaultClass) {
  const cop = ctn.options
  let gridClassArray = []
  !!defaultClass && gridClassArray.push(defaultClass)
  !!cop.customClass && (cop.customClass.length > 0) && gridClassArray.push(cop.customClass.join(' '))
  return gridClassArray.length > 0 ? `class="${gridClassArray.join(' ')}"` : ''
}

const containerTemplates = {  //容器组件属性
  'grid': (ctn, formConfig) => {
    const gridClassAttr = buildClassAttr(ctn)
    const gridTemplate =
`<Row ${gridClassAttr}>
${ctn.cols.map(col => {
  const colOpt = col.options
  const colClassAttr = buildClassAttr(col, 'grid-cell')
  return `<Col :span="${colOpt.span}" ${colClassAttr}>
    ${col.widgetList.map(cw => {
        if (cw.category === 'container') {
          return buildContainerWidget(cw, formConfig)
        } else {
          return buildFieldWidget(cw, formConfig)
        }
      }).join('')
    }
    </Col>`
  }).join('')
}
</Row>`

    return gridTemplate
  },

  'table': (ctn, formConfig) => {
    const tableClassAttr = buildClassAttr(ctn, 'table-layout')
    const tableTemplate =
`<div class="table-container">
  <table ${tableClassAttr}><tbody>
  ${ctn.rows.map(tr => {
      return `<tr>${
          tr.cols.filter(td => !td.merged).map(td => {
            const tdOpt = td.options
            const tdClassAttr = buildClassAttr(td, 'table-cell')
            const colspanAttr = (!isNaN(tdOpt.colspan) && (tdOpt.colspan !== 1)) ? `colspan="${tdOpt.colspan}"` : ''
            const rowspanAttr = (!isNaN(tdOpt.rowspan) && (tdOpt.rowspan !== 1)) ? `rowspan="${tdOpt.rowspan}"` : ''

            let tdStyleArray = []
            !!tdOpt.cellWidth && tdStyleArray.push('width: ' + tdOpt.cellWidth + ' !important')
            !!tdOpt.cellHeight && tdStyleArray.push('height: ' + tdOpt.cellHeight + ' !important')
            let tdStyleAttr = (tdStyleArray.length > 0) ? `style="${tdStyleArray.join(';')}"` : ''

            return `<td ${tdClassAttr} ${colspanAttr} ${rowspanAttr} ${tdStyleAttr}>${td.widgetList.map(tw => {
                          if (tw.category === 'container') {
                            return buildContainerWidget(tw, formConfig)
                          } else {
                            return buildFieldWidget(tw, formConfig)
                          }
                        }).join('')
                        }
                    </td>`
          }).join('')
      }</tr>`
    }).join('')
  }
  </tbody></table>
</div>`
    return tableTemplate
  },

  'tab': (ctn, formConfig) => {
    const tabClassAttr = buildClassAttr(ctn)
    const vModel = ctn.tabs && (ctn.tabs.length > 0) ? `v-model="${ctn.options.name}ActiveTab"` : ''
    const tabTemplate =
`<div class="tab-container">
  <Tabs ${vModel} type="${ctn.displayType}" ${tabClassAttr}>
    ${ctn.tabs.map(tab => {
      const tabOpt = tab.options
      const disabledAttr = (tabOpt.disabled === true) ? `disabled` : ''
      return `<TabsPane name="${tabOpt.name}" label="${tabOpt.label}" ${disabledAttr}>
        ${tab.widgetList.map(tw => {
          if (tw.category === 'container') {
            return buildContainerWidget(tw, formConfig)
          } else {
            return buildFieldWidget(tw, formConfig)
          }
        }).join('')
      }</TabsPane>`
    }).join('')}
  </Tabs>
</div>`

    return tabTemplate
  },

  'sub-form': (ctn, formConfig) => {
    //TODO:
  },

}

function buildContainerWidget(widget, formConfig) {
  return containerTemplates[widget.type] ? containerTemplates[widget.type](widget, formConfig) : null
}

function getElAttrs(widget, formConfig) {  //获取El组件属性
  let wop = widget.options
  return {
    vModel: `v-model="${formConfig.modelName}.${wop.name}"`,
    readonly: wop.readonly ? `readonly="true"` : '',
    disabled: wop.disabled ? `:disabled="true"` : '',
    size: !!wop.size ? `size="${wop.size}"` : '',
    type: !!wop.type ? `type="${wop.type === 'number' ? 'text' : wop.type}"` : '',
    showPassword: !!wop.showPassword ? `:show-password="${wop.showPassword}"` : '',
    placeholder: !!wop.placeholder ? `placeholder="${wop.placeholder}"` : '',
    rows: (isNotNull(wop.rows) && !isNaN(wop.rows)) ? `rows="${wop.rows}"` : '',
    clearable: !!wop.clearable ? 'clearable' : '',
    minlength: (isNotNull(wop.minLength) && !isNaN(wop.minLength)) ? `:minlength="${wop.minLength}"` : '',
    maxlength: (isNotNull(wop.maxLength) && !isNaN(wop.maxLength)) ? `:maxlength="${wop.maxLength}"` : '',
    showWordLimit: !!wop.showWordLimit ? `:show-word-limit="true"`: '',
    prefixIcon: !!wop.prefixIcon ? `prefix="${wop.prefixIcon}"` : '',
    suffixIcon: !!wop.suffixIcon ? `suffix="${wop.suffixIcon}"` : '',
    controlsPosition: wop.controlsPosition === 'right' ? `controls-outside="right"` : `controls-outside="default"`,
    min: (isNotNull(wop.min) && !isNaN(wop.min)) ? `:min="${wop.min}"` : '',
    max: (isNotNull(wop.max) && !isNaN(wop.max)) ? `:max="${wop.max}"` : '',
    precision: (isNotNull(wop.precision) && !isNaN(wop.precision)) ? `:precision="${wop.precision}"` : '',
    step: (isNotNull(wop.step) && !isNaN(wop.step)) ? `:step="${wop.step}"` : '',
    filterable: !!wop.filterable ? `filterable` : '',
    allowCreate: !!wop.allowCreate ? `allow-create` : '',
    defaultFirstOption: (!!wop.filterable && !!wop.allowCreate) ? `default-first-option` : '',
    multiple: !!wop.multiple ? `multiple` : '',
    multipleLimit: (!isNaN(wop.multipleLimit) && (wop.multipleLimit > 0)) ? `:multiple-limit="${wop.multipleLimit}"` : '',
    automaticDropdown: !!wop.automaticDropdown ? `automatic-dropdown` : '',
    remote: !!wop.remote ? `remote` : '',
    format: !!wop.format ? `format="${wop.format}"` : '',
    valueFormat: !!wop.valueFormat ? `value-format="${wop.valueFormat}"` : '',
    editable: !!wop.editable ? `:editable="${wop.editable}"` : '',
    startPlaceholder: !!wop.startPlaceholder ? `start-placeholder="${wop.startPlaceholder}"` : '',
    endPlaceholder: !!wop.endPlaceholder ? `end-placeholder="${wop.endPlaceholder}"` : '',

    activeText: !!wop.activeText ? `active-text="${wop.activeText}"` : '',
    inactiveText: !!wop.inactiveText ? `inactive-text="${wop.inactiveText}"` : '',
    activeColor: !!wop.activeColor ? `true-color="${wop.activeColor}"` : '',
    inactiveColor: !!wop.inactiveColor ? `false-color="${wop.inactiveColor}"` : '',
    switchWidth: (!isNaN(wop.switchWidth) && (wop.switchWidth !== 40)) ? `:width="${wop.switchWidth}"` : '',

    rateMax: (!isNaN(wop.max) && (wop.max !== 5)) ? `:max="${wop.max}"` : '',
    lowThreshold: (!isNaN(wop.lowThreshold) && (wop.lowThreshold !== 2)) ? `:low-threshold="${wop.lowThreshold}"` : '',
    highThreshold: (!isNaN(wop.highThreshold) && (wop.highThreshold !== 4)) ? `:high-threshold="${wop.highThreshold}"` : '',
    allowHalf: !!wop.allowHalf ? `allow-half` : '',
    showText: !!wop.showText ? `show-text` : '',
    showScore: !!wop.showScore ? `show-score` : '',

    sliderMin: (!isNaN(wop.min) && (wop.min !== 0)) ? `:min="${wop.min}"` : '',
    sliderMax: (!isNaN(wop.max) && (wop.max !== 100)) ? `:max="${wop.max}"` : '',
    sliderStep: (!isNaN(wop.step) && (wop.step !== 1)) ? `:step="${wop.step}"` : '',
    sliderRange: !!wop.range ? `range` : '',
    sliderVertical: !!wop.vertical ? `vertical` : '',

    uploadAction: !!wop.uploadURL ? `action="${wop.uploadURL}"` : '',
    withCredentials: !!wop.withCredentials ? `with-credentials` : '',
    multipleSelect: !!wop.multipleSelect ? `multiple` : '',
    showFileList: !!wop.showFileList ? `show-upload-list` : '',
    limit: !isNaN(wop.limit) ? `:limit="${wop.limit}"` : '',
	fileAccept: !!wop.fileAccept ? `:format="${wop.fileAccept}"` : '',
	fileTypes: !!wop.fileTypes ? `:accept="${wop.fileTypes}"` : '',
	fileMaxSize: !!wop.fileMaxSize? `:max-size="${wop.fileMaxSize}"`:``,
    uploadTipSlotChild: !!wop.uploadTip ? `<template #tip><div class="el-upload__tip">${wop.uploadTip}</div></template>` : '',
    pictureUploadIconChild: `<template #default><i class="ivu-icon ivu-icon-md-add"></i></template>`,
    fileUploadIconChild: `<template #default><i class="ivu-icon ivu-icon-md-add"></i></template>`,

    buttonType: !!wop.type ? `type="${wop.type}` : '',
    buttonPlain: !!wop.plain ? `plain` : '',
    buttonRound: !!wop.round ? `round` : '',
    buttonCircle: !!wop.circle ? `circle` : '',
    buttonIcon: !!wop.icon ? `icon="${wop.icon}"` : '',
    contentPosition: (!!wop.contentPosition && (wop.contentPosition !== 'center')) ? `content-position="${wop.contentPosition}"` : '',

    appendButtonChild: !!wop.appendButton ? `<template #append><Button class="${wop.buttonIcon}" ${!!wop.appendButtonDisabled ? 'disabled' : ''}></Button></template>` : '',
  }
}

function buildRadioChildren(widget, formConfig) {
  let wop = widget.options
  const childTag = !!wop.buttonStyle ? 'RadioButton' : 'Radio'
  const borderAttr = !!wop.border ? `border` : ''
  const styleAttr = `style="display: ${wop.displayStyle}"`
  return `<${childTag} v-for="(item, index) in ${wop.name}Options" :key="index" :label="item.value"
          :disabled="item.disabled" ${borderAttr} ${styleAttr}>{{item.label}}</${childTag}>`
}

function buildCheckboxChildren(widget, formConfig) {
  let wop = widget.options
  const childTag = !!wop.buttonStyle ? 'CheckboxButton' : 'Checkbox'
  const borderAttr = !!wop.border ? `border` : ''
  const styleAttr = `style="display: ${wop.displayStyle}"`
  return `<${childTag} v-for="(item, index) in ${wop.name}Options" :key="index" :label="item.value"
          :disabled="item.disabled" ${borderAttr} ${styleAttr}>{{item.label}}</${childTag}>`
}

function buildSelectChildren(widget, formConfig) {
  let wop = widget.options
  const childTag = 'Option'
  return `<${childTag} v-for="(item, index) in ${wop.name}Options" :key="index" :label="item.value"
          :value="item.value" :disabled="item.disabled"></${childTag}>`
}

function buildDivider(widget, formConfig) {
  let wop = widget.options
  
  return {
	 size: !!wop.size ? `size="${wop.size}"` : '',
	 type: (!!wop.contentPosition && (wop.direction !== 'horizontal')) ? `type="vertical"` : `type="horizontal"`,
	 contentPosition: (!!wop.contentPosition && (wop.contentPosition !== 'center')) ? `orientation="${wop.contentPosition}"` : '',
  }
}
function buildInputComposite(widget, formConfig) {
  let wop = widget.options
  
  return {
	 appendDiv: (wop.prependControl&&wop.prependControlType=='div') ? 
			`<div slot="prepend">
				<Icon :type="${wop.prependControlIcon}" />${wop.prependControlText} 
			 </div>`: '',
	 prependDiv: (wop.appendControl&&wop.appendControlType=='div') ? 
			`<div slot="append">
				<Icon :type="${wop.appendControlIcon}" />${wop.appendControlText} 
			 </div>`: '',
	 appendButton: (wop.prependControl&&wop.prependControlType=='button') ? 
			`<Button slot="prepend"
			  :disabled="${!!wop.disabled || !!wop.prependControlDisabled}"
			  :icon="${wop.prependControlIcon}"
			>${wop.prependControlText} 
			 </Button>`: '',
	 prependButton: (wop.appendControl&&wop.appendControlType=='button') ? 
			`<Button slot="append"
			  :disabled="${!!wop.disabled || !!wop.appendButtonDisabled}"
			  :icon="${wop.appendControlIcon}"
			>${wop.appendControlText} 
			 </Button>`: ''
  }
}

const elTemplates = {  //字段组件属性
  'input': (widget, formConfig) => {
    const {vModel, readonly, disabled, size, type, showPassword, placeholder, clearable,
      maxlength, showWordLimit, prefixIcon, suffixIcon, appendButtonChild} = getElAttrs(widget, formConfig)
    return `<Input ${vModel} ${readonly} ${disabled} ${size} ${type} ${showPassword} ${placeholder} ${clearable}
            ${maxlength} ${showWordLimit} ${prefixIcon} ${suffixIcon}>${appendButtonChild}</Input>`
  },
  
  'input-composite': (widget, formConfig) => {
    const {vModel, readonly, disabled, size, type, showPassword, placeholder, clearable,
      maxlength, showWordLimit, prefixIcon, suffixIcon, appendButtonChild} = getElAttrs(widget, formConfig)
	  
	const {appendDiv,prependDiv,appendButton,prependButton} =buildInputComposite(widget, formConfig);
    return `<Input ${vModel} ${readonly} ${disabled} ${size} ${type} ${showPassword} ${placeholder} ${clearable}
             ${maxlength} ${showWordLimit} ${prefixIcon} ${suffixIcon}>
			${appendDiv}
			${prependDiv}
			${appendButton}
			${prependButton}
			</Input>`
  },

  'textarea': (widget, formConfig) => {
    const {vModel, readonly, disabled, size, type, showPassword, placeholder, rows, clearable,
      maxlength, showWordLimit} = getElAttrs(widget, formConfig)
    return `<Input type="textarea" ${vModel} ${readonly} ${disabled} ${size} ${type} ${showPassword} ${placeholder}
            ${rows} ${clearable} ${maxlength} ${showWordLimit}></Input>`
  },

  'number': (widget, formConfig) => {
    const {vModel, disabled, size, type, showPassword, placeholder, controlsPosition, min, max, precision, step
      } = getElAttrs(widget, formConfig)
    return `<InputNumber ${vModel} class="full-width-input" ${disabled} ${size} ${type} ${showPassword}
            ${placeholder} ${controlsPosition} ${min} ${max} ${precision} ${step}></InputNumber>`
  },

  'radio': (widget, formConfig) => {
    const {vModel, disabled, size} = getElAttrs(widget, formConfig)
    const radioOptions = buildRadioChildren(widget, formConfig)
    return `<RadioGroup ${vModel} ${disabled} ${size}>${radioOptions}</RadioGroup>`
  },

  'checkbox': (widget, formConfig) => {
    const {vModel, disabled, size} = getElAttrs(widget, formConfig)
    const checkboxOptions = buildCheckboxChildren(widget, formConfig)
    return `<CheckboxGroup ${vModel} ${disabled} ${size}>${checkboxOptions}</CheckboxGroup>`
  },

  'select': (widget, formConfig) => {
    const {vModel, disabled, size, clearable, filterable, allowCreate, defaultFirstOption, automaticDropdown,
      multiple, multipleLimit, remote, placeholder} = getElAttrs(widget, formConfig)
    const selectOptions = buildSelectChildren(widget, formConfig)
    return `<Select ${vModel} class="full-width-input" ${disabled} ${size} ${clearable} ${filterable}
            ${allowCreate} ${defaultFirstOption} ${automaticDropdown} ${multiple} ${multipleLimit} ${placeholder}
            ${remote}>${selectOptions}</Select>`
  },

  'time': (widget, formConfig) => {
    const {vModel, readonly, disabled, size, placeholder, clearable, format, editable
      } = getElAttrs(widget, formConfig)
    return `<TimePicker confirm ${vModel} class="full-width-input" ${readonly} ${disabled} ${size} ${format}
             ${placeholder} ${clearable} ${editable}></TimePicker>`
  },

  'time-range': (widget, formConfig) => {
    const {vModel, readonly, disabled, size, startPlaceholder, endPlaceholder, clearable, format, editable
      } = getElAttrs(widget, formConfig)
    return `<TimePicker confirm type="range" ${vModel} class="full-width-input" ${readonly} ${disabled} ${size} ${format}
            ${startPlaceholder} ${endPlaceholder} ${clearable} ${editable}></TimePicker>`
  },

  'date': (widget, formConfig) => {
    const {vModel, readonly, disabled, size, type, placeholder, clearable, format, valueFormat, editable
      } = getElAttrs(widget, formConfig)
    return `<DatePicker ${vModel} ${type} class="full-width-input" ${readonly} ${disabled} ${size} ${format}
              ${valueFormat} ${placeholder} ${clearable} ${editable}></DatePicker>`
  },

  'date-range': (widget, formConfig) => {
    const {vModel, readonly, disabled, size, type, startPlaceholder, endPlaceholder, clearable, format, valueFormat, editable
      } = getElAttrs(widget, formConfig)
    return `<DatePicker is-range ${vModel} ${type} class="full-width-input" ${readonly} ${disabled} ${size} ${format}
            ${valueFormat} ${startPlaceholder} ${endPlaceholder} ${clearable} ${editable}></DatePicker>`
  },

  'switch': (widget, formConfig) => {
    const {vModel, disabled, activeText, inactiveText, activeColor, inactiveColor, switchWidth
      } = getElAttrs(widget, formConfig)
    return `<iSwitch ${vModel} ${disabled} ${activeText} ${inactiveText} ${activeColor} ${inactiveColor}
            ${switchWidth}></iSwitch>`
  },

  'rate': (widget, formConfig) => {
    const {vModel, disabled, rateMax, allowHalf, showText} = getElAttrs(widget, formConfig)
    return `<Rate ${vModel} ${disabled} ${rateMax} ${allowHalf} ${showText} ></Rate>`
  },

  'color': (widget, formConfig) => {
    const {vModel, disabled, size
      } = getElAttrs(widget, formConfig)
    return `<ColorPicker ${vModel} ${disabled} ${size}></ColorPicker>`
  },

  'slider': (widget, formConfig) => {
    const {vModel, disabled, sliderMin, sliderMax, sliderStep, sliderRange, sliderVertical
      } = getElAttrs(widget, formConfig)
    return `<Slider ${vModel} ${disabled} ${sliderMin} ${sliderMax} ${sliderStep} ${sliderRange}
            ></Slider>`
  },

  'picture-upload': (widget, formConfig) => {
    const {vModel, disabled, uploadAction, withCredentials, multipleSelect, showFileList, limit,
		fileAccept,fileTypes,fileMaxSize,
      uploadTipSlotChild, pictureUploadIconChild} = getElAttrs(widget, formConfig)
    let wop = widget.options
    return `<Upload 
			:headers="${wop.name}UploadHeaders" 
			:data="${wop.name}UploadData" 
			:action="${uploadAction}" 
			paste 
            ${disabled} 
			${uploadAction} 
			${withCredentials} 
			${multipleSelect} 
			${showFileList} 
			${fileAccept} 
			${fileTypes} 
			${fileMaxSize} 
            >${uploadTipSlotChild} ${pictureUploadIconChild}</Upload>`
  },

  'file-upload': (widget, formConfig) => {
    const {vModel, disabled, uploadAction, withCredentials, multipleSelect, showFileList, limit,
		fileAccept,fileTypes,fileMaxSize,
      uploadTipSlotChild, fileUploadIconChild} = getElAttrs(widget, formConfig)
    let wop = widget.options
    return `<Upload 
			:headers="${wop.name}UploadHeaders" 
			:data="${wop.name}UploadData" 
			:action="${uploadAction}" 
			paste 
			${disabled} 
			${uploadAction} 
			${withCredentials} 
			${multipleSelect} 
			${showFileList} 
			${fileAccept} 
			${fileTypes} 
			${fileMaxSize} 
			>${uploadTipSlotChild} ${fileUploadIconChild}</Upload>`
  },

  'rich-editor': (widget, formConfig) => {
    const {vModel, disabled, placeholder
    } = getElAttrs(widget, formConfig)
    return `<vue-editor ${vModel} ${disabled} ${placeholder}></vue-editor>`
  },

  'cascader': (widget, formConfig) => {
    const {vModel, disabled, size, clearable, filterable, placeholder} = getElAttrs(widget, formConfig)
    let wop = widget.options
    const optionsAttr = `:options="${wop.name}Options"`
    return `<Cascader ${vModel} class="full-width-input" ${optionsAttr} ${disabled} ${size} ${clearable}
            ${filterable} ${placeholder}></Cascader>`
  },

  'static-text': (widget, formConfig) => {
    return `<div>${widget.options.textContent}</div>`
  },

  'html-text': (widget, formConfig) => {
    return `<div v-html="${widget.options.htmlContent}"></div>`
  },

  'button': (widget, formConfig) => {
    const {buttonType, buttonPlain, buttonRound, buttonCircle, buttonIcon, disabled} = getElAttrs(widget, formConfig)
    return `<Button ${buttonType} ${buttonPlain} ${buttonRound} ${buttonCircle} ${buttonIcon}
            ${disabled}>${widget.options.label}</Button>`
  },

  'divider': (widget, formConfig) => {
    const {contentPosition,size,type} = buildDivider(widget, formConfig)
    return `<Divider ${type} ${size} ${contentPosition}></Divider>` 
  },

}

function buildFieldWidget(widget, formConfig) {
  let wop = widget.options
  const label = wop.labelHidden ? '' : wop.label
  const labelWidthAttr = wop.labelHidden ? `:label-width="0"` : (!!wop.labelWidth ? `:label-width="${wop.labelWidth}"` : '')
  const labelTooltipAttr = wop.labelTooltip ? `title="${wop.labelTooltip}"` : ''
  const propAttr = `prop="${wop.name}"`

  let classArray = []
  !!wop.required && classArray.push('required')
  !!wop.customClass && (wop.customClass.length > 0) && classArray.push(wop.customClass.join(' '))
  if (!!wop.labelAlign) {
    wop.labelAlign !== 'label-left-align' && classArray.push(wop.labelAlign)
  } else {
    //classArray.push(formConfig.labelAlign || 'label-left-align')
    formConfig.labelAlign !== 'label-left-align' && classArray.push(formConfig.labelAlign)
  }
  const classAttr = (classArray.length > 0) ? `class="${classArray.join(' ')}"` : ''

  let customLabelDom =
`<template #label><span class="custom-label">${wop.labelIconPosition === 'front' ?
  (!!wop.labelTooltip ?
      `<Tooltip content="${wop.labelTooltip}"><i class="${wop.labelIconClass}"></i></Tooltip>${wop.label}` :
      `<i class="${wop.labelIconClass}"></i>${wop.label}`
  )
  :
  (!!wop.labelTooltip ?
      `${wop.label}<Tooltip content="${wop.labelTooltip}"><i class="${wop.labelIconClass}"></i></Tooltip>` :
      `${wop.label}<i class="${wop.labelIconClass}"></i>`
  )
}
</span></template>`
  !wop.labelIconClass && (customLabelDom = '')

  const fwDom = elTemplates[widget.type] ? elTemplates[widget.type](widget, formConfig) : null
  const isFormItem = !!widget.formItemFlag
  const vShowAttr = !!wop.hidden ? `v-show="false"` : ''
  return isFormItem ?
`<FormItem label="${label}" ${labelWidthAttr} ${labelTooltipAttr} ${propAttr} ${classAttr} >
  ${customLabelDom}
  ${fwDom}
</FormItem>`
      :
`<div class="static-content-item" ${vShowAttr}>${fwDom}</div>`
}

function genTemplate(formConfig, widgetList, vue3Flag = false) {
  const submitAttr = !!vue3Flag ? `@submit.prevent` : `@submit.native.prevent`
  let childrenList = []
  widgetList.forEach(wgt => {
    if (wgt.category === 'container') {
      childrenList.push( buildContainerWidget(wgt, formConfig) )
    } else {
      childrenList.push( buildFieldWidget(wgt, formConfig) )
    }
  })

  const formTemplate =
`  <Form :model="${formConfig.modelName}" ref="${formConfig.refName}" :rules="${formConfig.rulesName}"
    label-position="${formConfig.labelPosition}" :label-width="${formConfig.labelWidth}" 
    ${submitAttr}>
  ${!!childrenList ? childrenList.join('\n') : ''}
</Form>`

  return formTemplate
}

const genGlobalCSS = function (formConfig) {
  const globalCssTemplate =`${formConfig.cssCode}`

  return globalCssTemplate
}

const genScopedCSS = function (formConfig, vue3Flag = false) {
  //const vDeep = !!vue3Flag ? `::v-deep` : `:deep`
  const cssTemplate =
`  div.table-container {
    table.table-layout {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
      
      td.table-cell {
        display: table-cell;
        height: 36px;
        border: 1px solid #e1e2e3;
      }
    }
  }
  
  div.tab-container {
  }
  
  .label-left-align ${!!vue3Flag ? `:deep(.ivu-form-item-label)` : `::v-deep .ivu-form-item-label`} {
    text-align: left;
  }

  .label-center-align ${!!vue3Flag ? `:deep(.ivu-form-item-label)` : `::v-deep .ivu-form-item-label`} {
    text-align: center;
  }

  .label-right-align ${!!vue3Flag ? `:deep(.ivu-form-item-label)` : `::v-deep .ivu-form-item-label`} {
    text-align: right;
  }
  
  .custom-label {
  }
  
  .static-content-item {
    min-height: 20px;
    display: flex;
    align-items: center;

    ${!!vue3Flag ? `:deep(.ivu-divider-horizontal)` : `::v-deep .ivu-divider-horizontal`} {
      margin: 0;
    }
  }`

  return cssTemplate
}

export const genSFC = function (formConfig, widgetList, beautifier, vue3Flag = false) {
  const html = beautifier.html(genTemplate(formConfig, widgetList, vue3Flag), beautifierOpts.html)
  const js = beautifier.js(!!vue3Flag ? genVue3JS(formConfig, widgetList): genVue2JS(formConfig, widgetList), beautifierOpts.js)
  const globalCss = beautifier.css(genGlobalCSS(formConfig), beautifierOpts.css)
  const scopedCss = beautifier.css(genScopedCSS(formConfig, vue3Flag), beautifierOpts.css)

  return `<!-- 
Codes Generated By VForm:
http://www.vform666.com
-->

<template>
${html}
</template>

<script>
${js}
</script>

<style lang="scss">
${globalCss}
</style>

<style lang="scss" scoped>
${scopedCss}
</style>`
}
