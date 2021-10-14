<template>
  <el-form-item :label="i18nt('designer.setting.displayStyle')">
    <el-radio-group v-model="optionModel.displayStyle">
      <el-radio label="inline">{{i18nt('designer.setting.inlineLayout')}}</el-radio>
      <el-radio label="block">{{i18nt('designer.setting.blockLayout')}}</el-radio>
    </el-radio-group>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "displayStyle-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
  }
</script>

<style scoped>

</style>
