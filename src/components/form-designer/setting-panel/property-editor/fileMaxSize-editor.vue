<template>
  <el-form-item :label="i18nt('designer.setting.fileMaxSize')">
    <el-input-number v-model="optionModel.fileMaxSize" :min="1" class="hide-spin-button" style="width: 100%"></el-input-number>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "fileMaxSize-editor",
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
