<template>
  <el-form-item :label="i18nt('designer.setting.label')" v-if="!noLabelSetting">
    <el-input type="text" v-model="optionModel.label"></el-input>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "label-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    computed: {
      noLabelSetting() {
        return (this.selectedWidget.type === 'static-text') || (this.selectedWidget.type === 'html-text')
        //|| (this.selectedWidget.type === 'divider')
      },

    }
  }
</script>

<style lang="scss" scoped>

</style>
