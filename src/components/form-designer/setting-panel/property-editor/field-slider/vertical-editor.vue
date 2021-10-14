<template>
  <el-form-item :label="i18nt('designer.setting.vertical')">
    <el-checkbox v-model="optionModel.vertical"></el-checkbox>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "vertical-editor",
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
