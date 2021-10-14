<template>
  <el-form-item label="onInput" label-width="150px">
    <el-button type="info" icon="el-icon-edit" plain round @click="editEventHandler('onInput', eventParams)">
      {{i18nt('designer.setting.addEventHandler')}}</el-button>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"
  import eventMixin from "@/components/form-designer/setting-panel/property-editor/event-handler/eventMixin"

  export default {
    name: "onInput-editor",
    mixins: [i18n, eventMixin],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    data() {
      return {
        eventParams: ['value'],
      }
    }
  }
</script>

<style scoped>

</style>
