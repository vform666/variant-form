<template>
  <el-form-item :label="i18nt('designer.setting.showFileList')">
    <el-switch v-model="optionModel.showFileList"></el-switch>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "showFileList-editor",
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
