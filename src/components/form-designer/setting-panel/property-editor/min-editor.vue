<template>
  <el-form-item :label="i18nt('designer.setting.minValue')">
    <el-input-number v-model="minValue" class="hide-spin-button" style="width: 100%"></el-input-number>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "min-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    computed: {
      minValue: {
        get() {
          return this.optionModel['min']
        },

        set(newValue) {
          //if ((!newValue && (newValue !== 0)) || isNaN(newValue)) {
          if ((newValue === undefined) || (newValue === null) || isNaN(newValue)) {
            this.optionModel.min = null
          } else {
            this.optionModel.min = Number(newValue)
          }
        }
      },

    },
  }
</script>

<style scoped>

</style>
