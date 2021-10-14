<template>
  <el-form-item :label="i18nt('designer.setting.buttonStyle')">
    <el-checkbox v-model="optionModel.buttonStyle"></el-checkbox>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "buttonStyle-editor",
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
