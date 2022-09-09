import {isEmptyStr, isNull} from "./util";

export const getRegExp = function (validatorName) {
  const commonRegExp = {
    number: '/^[-]?\\d+(\\.\\d+)?$/',
    letter: '/^[A-Za-z]+$/',
    letterAndNumber: '/^[A-Za-z0-9]+$/',
    mobilePhone: '/^[1][3-9][0-9]{9}$/',
    letterStartNumberIncluded: '/^[A-Za-z]+[A-Za-z\\d]*$/',
    noChinese: '/^[^\u4e00-\u9fa5]+$/',
    chinese: '/^[\u4e00-\u9fa5]+$/',
    email: '/^([-_A-Za-z0-9.]+)@([_A-Za-z0-9]+\\.)+[A-Za-z0-9]{2,3}$/',
    url: '/^([hH][tT]{2}[pP]:\\/\\/|[hH][tT]{2}[pP][sS]:\\/\\/)(([A-Za-z0-9-~]+)\\.)+([A-Za-z0-9-~\\/])+$/',
  }

  return commonRegExp[validatorName]
}

const validateFn = function (validatorName, rule, value, callback, defaultErrorMsg) {
  //空值不校验
  if (isNull(value) || (value.length <= 0)) {
    callback()
    return
  }

  const reg = eval(getRegExp(validatorName))

  if (!reg.test(value)) {
    let errTxt = rule.errorMsg || defaultErrorMsg
    callback(new Error(errTxt))
  } else {
    callback()
  }
}

const FormValidators = {

  /* 数字 */
  number(rule, value, callback) {
    validateFn('number', rule, value, callback, '[' + rule.label + ']包含非数字字符')
  },

  /* 字母 */
  letter(rule, value, callback) {
    validateFn('letter', rule, value, callback, '[' + rule.label + ']包含非字母字符')
  },

  /* 字母和数字 */
  letterAndNumber(rule, value, callback) {
    validateFn('letterAndNumber', rule, value, callback, '[' + rule.label + ']只能输入字母或数字')
  },

  /* 手机号码 */
  mobilePhone(rule, value, callback) {
    validateFn('mobilePhone', rule, value, callback, '[' + rule.label + ']手机号码格式有误')
  },

  /* 禁止空白字符开头 */
  noBlankStart(rule, value, callback) {
    //暂未实现
  },

  /* 禁止空白字符结尾 */
  noBlankEnd(rule, value, callback) {
    //暂未实现
  },

  /* 字母开头，仅可包含数字 */
  letterStartNumberIncluded(rule, value, callback) {
    validateFn('letterStartNumberIncluded', rule, value, callback, '[' + rule.label + ']必须以字母开头，可包含数字')
  },

  /* 禁止中文输入 */
  noChinese(rule, value, callback) {
    validateFn('noChinese', rule, value, callback, '[' + rule.label + ']不可输入中文字符')
  },

  /* 必须中文输入 */
  chinese(rule, value, callback) {
    validateFn('chinese', rule, value, callback, '[' + rule.label + ']只能输入中文字符')
  },

  /* 电子邮箱 */
  email(rule, value, callback) {
    validateFn('email', rule, value, callback, '[' + rule.label + ']邮箱格式有误')
  },

  /* URL网址 */
  url(rule, value, callback) {
    validateFn('url', rule, value, callback, '[' + rule.label + ']URL格式有误')
  },

  /*测试
  test(rule, value, callback, errorMsg) {
    //空值不校验
    if (isNull(value) || (value.length <= 0)) {
      callback()
      return
    }

    if (value < 100) {
      callback(new Error('[' + rule.label + ']不能小于100'))
    } else {
      callback()
    }
  },
  */

  regExp(rule, value, callback) {
    //空值不校验
    if (isNull(value) || (value.length <= 0)) {
      callback()
      return
    }

    const pattern = eval(rule.regExp)
    if (!pattern.test(value)) {
      let errTxt = rule.errorMsg || '[' + rule.label + ']invalid value'
      callback(new Error(errTxt))
    } else {
      callback()
    }
  },

}

export default FormValidators
