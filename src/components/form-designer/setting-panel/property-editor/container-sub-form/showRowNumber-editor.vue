<template>
  <el-form-item :label="i18nt('designer.setting.showRowNumber')">
    <el-switch v-model="optionModel.showRowNumber"></el-switch>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "showRowNumber-editor",
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
