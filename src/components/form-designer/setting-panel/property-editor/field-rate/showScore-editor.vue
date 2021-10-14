<template>
  <el-form-item :label="i18nt('designer.setting.showScore')">
    <el-checkbox v-model="optionModel.showScore"></el-checkbox>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "showScore-editor",
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
