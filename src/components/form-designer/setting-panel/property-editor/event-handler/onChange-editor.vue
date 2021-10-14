<template>
  <el-form-item label="onChange" label-width="150px">
    <el-button type="info" icon="el-icon-edit" plain round @click="editEventHandler('onChange', eventParams)">
      {{i18nt('designer.setting.addEventHandler')}}</el-button>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"
  import eventMixin from "@/components/form-designer/setting-panel/property-editor/event-handler/eventMixin"

  export default {
    name: "onChange-editor",
    mixins: [i18n, eventMixin],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    data() {
      return {
        eventParams: ['value', 'oldValue', 'subFormData', 'rowId'],
      }
    }
  }
</script>

<style scoped>

</style>
