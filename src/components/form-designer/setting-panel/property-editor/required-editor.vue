<template>
  <el-form-item :label="i18nt('designer.setting.required')">
    <el-checkbox v-model="optionModel.required"></el-checkbox>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "required-editor",
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
