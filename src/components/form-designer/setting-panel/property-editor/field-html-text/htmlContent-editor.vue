<template>
  <div>
    <el-form-item :label="i18nt('designer.setting.htmlContent')">
    </el-form-item>
    <el-form-item label-width="0">
      <el-input type="textarea" v-model="optionModel.htmlContent" :rows="5" class="html-content-editor"></el-input>
    </el-form-item>
  </div>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "htmlContent-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
  }
</script>

<style scoped>
  .html-content-editor {
    font-size: 13px;
  }
</style>
