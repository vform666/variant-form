<template>
  <el-form-item :label="i18nt('designer.setting.step')">
    <el-input-number v-model="optionModel.step" class="hide-spin-button" style="width: 100%"></el-input-number>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "step-editor",
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
