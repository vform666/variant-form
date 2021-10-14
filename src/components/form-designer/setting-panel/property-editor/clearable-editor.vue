<template>
  <el-form-item :label="i18nt('designer.setting.clearable')">
    <el-checkbox v-model="optionModel.clearable"></el-checkbox>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "clearable-editor",
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
