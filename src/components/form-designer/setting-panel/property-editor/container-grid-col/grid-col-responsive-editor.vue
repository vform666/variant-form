<template>
  <el-form-item :label="i18nt('designer.setting.responsive')">
    <el-switch v-model="optionModel.responsive"></el-switch>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "grid-col-responsive-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
  }
</script>

<style lang="scss" scoped>

</style>
