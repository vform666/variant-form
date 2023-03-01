<template>
  <el-form-item :label="i18nt('designer.setting.textAlign')" v-if="(selectedWidget.type === 'static-text')">
    <el-radio-group v-model="optionModel.textAlign" class="radio-group-custom">
      <el-radio-button label="left">
        {{i18nt('designer.setting.leftAlign')}}</el-radio-button>
      <el-radio-button label="center">
        {{i18nt('designer.setting.centerAlign')}}</el-radio-button>
      <el-radio-button label="right">
        {{i18nt('designer.setting.rightAlign')}}</el-radio-button>
    </el-radio-group>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "textAlign-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
  }
</script>

<style lang="scss" scoped>
  .radio-group-custom {
    ::v-deep .el-radio-button__inner {
      padding-left: 12px;
      padding-right: 12px;
    }
  }
</style>
