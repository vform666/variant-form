<template>
  <el-form-item :label="i18nt('designer.setting.showPassword')" v-if="optionModel.type === 'password'">
    <el-switch v-model="optionModel.showPassword"></el-switch>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n";

  export default {
    name: "showPassword-editor",
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
