<template>
  <el-form-item :label="i18nt('designer.setting.multipleSelect')">
    <el-switch v-model="optionModel.multipleSelect"></el-switch>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n";

  export default {
    name: "multipleSelect-editor",
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
