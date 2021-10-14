<template>
  <el-form-item :label="i18nt('designer.setting.colSpanTitle')">
    <el-input-number v-model.number="optionModel.span" :min="1" :max="24"
                     style="width: 100%"></el-input-number>
  </el-form-item>
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
  }
</script>

<style scoped>

</style>
