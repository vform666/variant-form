<template>
  <el-form-item :label="i18nt('designer.setting.showStops')">
    <el-checkbox v-model="optionModel.showStops"></el-checkbox>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "showStops-editor",
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
