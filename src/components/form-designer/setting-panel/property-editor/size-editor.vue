<template>
  <el-form-item :label="i18nt('designer.setting.widgetSize')">
    <el-select v-model="optionModel.size">
      <el-option v-for="item in widgetSizes" :key="item.value" :label="item.label"
                 :value="item.value">
      </el-option>
    </el-select>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "size-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    data() {
      return {
        widgetSizes: [
          {label: 'default', value: ''},
          {label: 'large', value: 'large'},
          {label: 'medium', value: 'medium'},
          {label: 'small', value: 'small'},
          {label: 'mini', value: 'mini'},
        ],
      }
    }
  }
</script>

<style scoped>

</style>
