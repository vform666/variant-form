<template>
  <div>
    <el-form-item :label="i18nt('designer.setting.colSpanTitle')" v-if="!optionModel.responsive">
      <el-input-number v-model.number="optionModel.span" :min="1" :max="24"
                       style="width: 100%"></el-input-number>
    </el-form-item>
    <el-form-item :label="i18nt('designer.setting.colSpanTitle') + '(PC)'"
                  v-if="!!optionModel.responsive && (formConfig.layoutType === 'PC')">
      <el-input-number v-model.number="optionModel.md" :min="1" :max="24"
                       style="width: 100%"></el-input-number>
    </el-form-item>
    <el-form-item :label="i18nt('designer.setting.colSpanTitle') + '(Pad)'"
                  v-if="!!optionModel.responsive && (formConfig.layoutType === 'Pad')">
      <el-input-number v-model.number="optionModel.sm" :min="1" :max="24"
                       style="width: 100%"></el-input-number>
    </el-form-item>
    <el-form-item :label="i18nt('designer.setting.colSpanTitle') + '(H5)'"
                  v-if="!!optionModel.responsive && (formConfig.layoutType === 'H5')">
      <el-input-number v-model.number="optionModel.xs" :min="1" :max="24"
                       style="width: 100%"></el-input-number>
    </el-form-item>
  </div>
</template>

<script>
  import i18n from "@/utils/i18n";

  export default {
    name: "grid-col-span-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    computed: {
      formConfig() {
        return this.designer.formConfig
      },


    }
  }
</script>

<style scoped>

</style>
