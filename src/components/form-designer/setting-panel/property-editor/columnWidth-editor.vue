<template>
  <div>
    <el-form-item :label="i18nt('designer.setting.widgetColumnWidth')" v-show="!!isSubFormChildWidget()">
      <el-input type="text" v-model="optionModel.columnWidth"></el-input>
    </el-form-item>
  </div>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "columnWidth-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    inject: ['isSubFormChildWidget'],
  }
</script>

<style scoped>

</style>
