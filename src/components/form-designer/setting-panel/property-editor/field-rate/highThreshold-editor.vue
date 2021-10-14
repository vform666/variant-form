<template>
  <el-form-item :label="i18nt('designer.setting.highThreshold')">
    <el-input-number v-model="optionModel.highThreshold" :min="optionModel.lowThreshold" :max="optionModel.max"
                     class="hide-spin-button" style="width: 100%"></el-input-number>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "highThreshold-editor",
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
