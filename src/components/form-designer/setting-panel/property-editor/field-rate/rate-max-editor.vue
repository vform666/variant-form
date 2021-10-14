<template>
  <el-form-item :label="i18nt('designer.setting.maxStars')">
    <el-input-number v-model="optionModel.max" :min="1" :max="10"
                     class="hide-spin-button" style="width: 100%"></el-input-number>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n";

  export default {
    name: "rate-max-editor",
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
