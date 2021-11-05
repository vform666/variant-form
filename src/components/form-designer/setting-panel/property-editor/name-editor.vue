<template>
  <el-form-item :label="i18nt('designer.setting.uniqueName')" :rules="nameRequiredRule">
    <template v-if="!!selectedWidget.category">
      <el-input type="text" v-model="optionModel.name" @change="updateWidgetNameAndRef"></el-input>
    </template>
    <template v-else>
      <el-select v-model="optionModel.name" allow-create filterable @change="updateWidgetNameAndRef">
        <el-option v-for="(sf, sfIdx) in serverFieldList" :key="sfIdx" :label="sf.label" :value="sf.name"></el-option>
      </el-select>
    </template>
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
    inject: ['serverFieldList'],
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
            fieldWidget.registerToRefList(oldName)  //注册组件新的ref名称并删除老的ref！！
            let newLabel = this.getLabelByFieldName(newName)
            this.designer.updateSelectedWidgetNameAndRef(this.selectedWidget, newName, newLabel)
          }
        }
      },

      getLabelByFieldName(fieldName) {
        for (let i = 0; i < this.serverFieldList.length; i++) {
          if (this.serverFieldList[i].name === fieldName) {
            return this.serverFieldList[i].label
          }
        }

        return null
      },

    }
  }
</script>

<style lang="scss" scoped>

</style>
