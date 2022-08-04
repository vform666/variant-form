import {isNotNull, traverseContainerWidgets, traverseFieldWidgets} from "@/utils/util";
import {translate} from "@/utils/i18n";
import FormValidators, {getRegExp} from "@/utils/validators";

export function buildDefaultValueListFn(formConfig, widgetList, resultList) {
  return function(fieldWidget) {
    const fop = fieldWidget.options
    const fd = fop.defaultValue
    if (isNotNull(fd)) {
      resultList.push(`${fop.name}: ${JSON.stringify(fd)},`)
    } else {
      resultList.push(`${fop.name}: null,`)
    }
  }
}

export function buildRulesListFn(formConfig, widgetList, resultList) {
  return function(fieldWidget) {
    const fop = fieldWidget.options
    let fieldRules = []
    if (!!fop.required) {
      fieldRules.push(`{
        required: true,
        message: '${translate('render.hint.fieldRequired')}',
      }`)
    }

    if (!!fop.validation) {
      let vldName = fop.validation
      if (!!FormValidators[vldName]) {
        fieldRules.push(`{
          pattern: ${eval( getRegExp(vldName) )},
          trigger: ['blur', 'change'],
          message: '${fop.validationHint}'
        }`)
      } else {
        fieldRules.push(`{
          pattern: '${eval(vldName)}',
          trigger: ['blur', 'change'],
          message: '${fop.validationHint}'
        }`)
      }
    }

    //TODO: 自定义校验函数

    fieldRules.length > 0 && resultList.push(`${fop.name}: [${fieldRules.join(',')}],`)
  }
}

export function buildFieldOptionsFn(formConfig, widgetList, resultList) {
  return function(fieldWidget) {
    const fop = fieldWidget.options
    const ft = fieldWidget.type
    if ((ft === 'radio') || (ft === 'checkbox') || (ft === 'select') || (ft === 'cascader')) {
      resultList.push(`${fop.name}Options: ${JSON.stringify(fop.optionItems)},`)
    }
  }
}

export function buildUploadDataFn(formConfig, widgetList, resultList) {
  return function(fieldWidget) {
    const fop = fieldWidget.options
    const ft = fieldWidget.type
    if ((ft === 'picture-upload') || (ft === 'file-upload')) {
      resultList.push(`${fop.name}FileList: [],`)
      resultList.push(`${fop.name}UploadHeaders: {},`)
      resultList.push(`${fop.name}UploadData: {},`)
    }
  }
}

export function buildActiveTabs(formConfig, widgetList) {
  let resultList = []
  const handlerFn = function (cw) {
    const cop = cw.options
    const ct = cw.type
    if (ct === 'tab') {
      cw.tabs.length > 0 && resultList.push(`'${cop.name}ActiveTab': '${cw.tabs[0].options.name}',`)
    }
  }
  traverseContainerWidgets(widgetList, handlerFn)

  return resultList
}

export const genVue2JS = function (formConfig, widgetList) {
  let defaultValueList = []
  let rulesList = []
  let fieldOptions = []
  let uploadData = []
  traverseFieldWidgets(widgetList, (widget) => {
    buildDefaultValueListFn(formConfig, widgetList, defaultValueList)(widget)
    buildRulesListFn(formConfig, widgetList, rulesList)(widget)
    buildFieldOptionsFn(formConfig, widgetList, fieldOptions)(widget)
    buildUploadDataFn(formConfig, widgetList, uploadData)(widget)
  })

  const activeTabs = buildActiveTabs(formConfig, widgetList)

  const v2JSTemplate =
`  export default {
    components: {},
    props: {},
    data() {
      return {
        ${formConfig.modelName}: {
          ${defaultValueList.join('\n')}
        },
        
        ${formConfig.rulesName}: {
          ${rulesList.join('\n')}
        },
        
        ${activeTabs.join('\n')}
        
        ${fieldOptions.join('\n')}
        
        ${uploadData.join('\n')}
      }
    },
    computed: {},
    watch: {},
    created() {
    },
    mounted() {
    },
    methods: {
      submitForm() {
        this.$refs['vForm'].validate(valid => {
          if (!valid) return
          
          //TODO: 提交表单
        })
      },
      
      resetForm() {
        this.$refs['vForm'].resetFields()
      }
    }
  }`

  return v2JSTemplate
}
