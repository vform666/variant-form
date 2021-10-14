<template>
  <el-form-item label-width="0">
    <el-divider class="custom-divider-margin-top">{{i18nt('designer.setting.optionsSetting')}}</el-divider>
    <option-items-setting :designer="designer" :selected-widget="selectedWidget"></option-items-setting>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"
  import OptionItemsSetting from "@/components/form-designer/setting-panel/option-items-setting"

  export default {
    name: "optionItems-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    components: {
      OptionItemsSetting,
    }
  }
</script>

<style scoped>

</style>
