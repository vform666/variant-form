<template>
  <el-form-item :label="i18nt('designer.setting.defaultValue')">
    <el-date-picker :type="optionModel.type" v-model="optionModel.defaultValue" @change="emitDefaultValueChange"
                    :format="optionModel.format" :value-format="optionModel.valueFormat" style="width: 100%">
    </el-date-picker>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"
  import propertyMixin from "@/components/form-designer/setting-panel/property-editor/propertyMixin"

  export default {
    name: "date-defaultValue-editor",
    mixins: [i18n, propertyMixin],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
  }
</script>

<style scoped>

</style>
