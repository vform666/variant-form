<template>
  <el-form-item :label="i18nt('designer.setting.uniqueName')" :rules="nameRequiredRule">
    <el-input type="text" v-model="optionModel.name" @change="updateWidgetNameAndRef"></el-input>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"
  import {isEmptyStr} from "@/utils/util"

  export default {
    name: "name-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    data() {
      return {
        nameRequiredRule: [{required: true, message: 'name required'}],
      }
    },
    methods: {
      updateWidgetNameAndRef(newName) {
        let oldName = this.designer.selectedWidgetName
        if (isEmptyStr(newName)) {
          this.selectedWidget.options.name = oldName
          this.$message.info(this.i18nt('designer.hint.nameRequired'))
          return
        }

        if (!!this.designer.formWidget) {
          //检查newName是否已存在！！
          let foundRef = this.designer.formWidget.getWidgetRef(newName)
          if (!!foundRef) {
            this.selectedWidget.options.name = oldName
            this.$message.info(this.i18nt('designer.hint.duplicateName') + newName)
            return
          }

          let fieldWidget = this.designer.formWidget.getWidgetRef(oldName)
          if (!!fieldWidget && !!fieldWidget.registerToRefList) {
            fieldWidget.registerToRefList(oldName)
            this.designer.updateSelectedWidgetNameAndRef(this.selectedWidget, newName)
          }
        }
      },


    }
  }
</script>

<style lang="scss" scoped>

</style>
