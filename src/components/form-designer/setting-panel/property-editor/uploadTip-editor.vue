<template>
  <el-form-item :label="i18nt('designer.setting.uploadTip')">
    <el-input type="text" v-model="optionModel.uploadTip"></el-input>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "uploadTip-editor",
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
