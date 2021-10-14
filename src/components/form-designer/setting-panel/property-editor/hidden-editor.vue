<template>
  <el-form-item :label="i18nt('designer.setting.hidden')">
    <el-checkbox v-model="optionModel.hidden"></el-checkbox>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "hidden-editor",
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
