<template>
  <el-form-item>
    <span slot="label">{{i18nt('designer.setting.validation')}}
      <el-tooltip effect="light" :content="i18nt('designer.setting.validationHelp')">
        <i class="el-icon-info"></i></el-tooltip>
    </span>
    <el-select v-model="optionModel.validation" filterable clearable allow-create default-first-option>
      <el-option v-for="(fv, fvIdx) in fieldValidators"
                 :key="fvIdx"
                 :label="fv.label"
                 :value="fv.value">
      </el-option>
    </el-select>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "validation-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    data() {
      return {
        fieldValidators: [
          {value: 'number', label: this.i18nt('designer.hint.numberValidator')},
          {value: 'letter', label: this.i18nt('designer.hint.letterValidator')},
          {value: 'letterAndNumber', label: this.i18nt('designer.hint.letterAndNumberValidator')},
          {value: 'mobilePhone', label: this.i18nt('designer.hint.mobilePhoneValidator')},
          {value: 'email', label: this.i18nt('designer.hint.emailValidator')},
          {value: 'url', label: this.i18nt('designer.hint.urlValidator')},
          {value: 'noChinese', label: this.i18nt('designer.hint.noChineseValidator')},
          {value: 'chinese', label: this.i18nt('designer.hint.chineseValidator')},
        ],
      }
    },

  }
</script>

<style scoped>

</style>
