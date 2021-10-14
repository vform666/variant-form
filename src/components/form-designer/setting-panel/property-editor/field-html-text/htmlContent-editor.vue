<template>
  <el-form-item :label="i18nt('designer.setting.htmlContent')">
    <el-input v-model="optionModel.htmlContent"></el-input>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "htmlContent-editor",
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
