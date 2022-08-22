<template>
  <container-item-wrapper :widget="widget">

    <div :key="widget.id" class="sub-form-container"
         v-show="!widget.options.hidden">
      <el-row class="header-row">
        <div class="action-header-column">
          <span class="action-label">{{i18nt('render.hint.subFormAction')}}</span>
          <el-button :disabled="actionDisabled" round type="primary" size="mini" class="action-button" @click="addSubFormRow"
                     :title="i18nt('render.hint.subFormAddActionHint')">
            {{i18nt('render.hint.subFormAddAction')}}<i class="el-icon-plus el-icon-right"></i></el-button>
        </div>
        <template v-for="(subWidget) in widget.widgetList">
          <div :key="subWidget.id + 'thc'" class="field-header-column"
               :class="[getLabelAlign(widget, subWidget), !!subWidget.options.required ? 'is-required' : '']"
               :style="{width: subWidget.options.columnWidth}">
            <span v-if="!!subWidget.options.labelIconClass" class="custom-label">
              <template v-if="subWidget.options.labelIconPosition === 'front'">
                <template v-if="!!subWidget.options.labelTooltip">
                  <el-tooltip :content="subWidget.options.labelTooltip" effect="light">
                    <i :class="subWidget.options.labelIconClass"></i></el-tooltip>{{subWidget.options.label}}</template>
                <template v-else>
                  <i :class="subWidget.options.labelIconClass"></i>{{subWidget.options.label}}</template>
              </template>
              <template v-else-if="subWidget.options.labelIconPosition === 'rear'">
                <template v-if="!!subWidget.options.labelTooltip">
                  {{subWidget.options.label}}<el-tooltip :content="subWidget.options.labelTooltip" effect="light">
                  <i :class="subWidget.options.labelIconClass"></i></el-tooltip></template>
                <template v-else>
                  {{subWidget.options.label}}<i :class="subWidget.options.labelIconClass"></i></template>
              </template>
            </span>
            <template v-else>
              <span :title="subWidget.options.labelTooltip">{{subWidget.options.label}}</span></template>
          </div>
        </template>
      </el-row>
      <el-row v-for="(subFormRowId, sfrIdx) in rowIdData" class="sub-form-row" :key="subFormRowId">
        <div class="sub-form-action-column hide-label">
          <div class="action-button-column">
            <el-button :disabled="actionDisabled" circle type="" icon="el-icon-circle-plus-outline" @click="insertSubFormRow(sfrIdx)"
                       :title="i18nt('render.hint.insertSubFormRow')"></el-button>
            <el-button :disabled="actionDisabled" circle type="" icon="el-icon-delete" @click="deleteSubFormRow(sfrIdx)"
                       :title="i18nt('render.hint.deleteSubFormRow')"></el-button>
            <span v-if="widget.options.showRowNumber" class="row-number-span">#{{sfrIdx+1}}</span>
          </div>
        </div>
        <template v-for="(subWidget, swIdx) in widget.widgetList">
          <div class="sub-form-table-column hide-label" :key="subWidget.id + 'tc' + subFormRowId"
               :style="{width: subWidget.options.columnWidth}">
            <component :is="subWidget.type + '-widget'" :field="fieldSchemaData[sfrIdx][swIdx]"
                          :key="fieldSchemaData[sfrIdx][swIdx].id" :parent-list="widget.widgetList"
                          :index-of-parent-list="swIdx" :parent-widget="widget"
                          :sub-form-row-id="subFormRowId"
                          :sub-form-row-index="sfrIdx" :sub-form-col-index="swIdx">
              <!-- 子表单暂不支持插槽！！！ -->
            </component>
          </div>
        </template>
      </el-row>
    </div>

  </container-item-wrapper>
</template>

<script>
  import emitter from '@/utils/emitter'
  import i18n from "../../../utils/i18n"
  import {deepClone, generateId} from "../../../utils/util"
  import refMixin from "../../../components/form-render/refMixin"
  import ContainerItemWrapper from './container-item-wrapper'
  import containerItemMixin from "./containerItemMixin";
  import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'

  export default {
    name: "sub-form-item",
    componentName: 'ContainerItem',
    mixins: [emitter, i18n, refMixin, containerItemMixin],
    components: {
      ContainerItemWrapper,
      ...FieldComponents,
    },
    props: {
      widget: Object,
    },
    inject: ['refList', 'sfRefList', 'globalModel'],
    data() {
      return {
        rowIdData: [],
        fieldSchemaData: [],
        actionDisabled: false,
      }
    },
    created() {
      this.initRefList()
      this.registerSubFormToRefList()
      this.initRowIdData(true)
      this.initFieldSchemaData()
      this.initEventHandler()
    },
    mounted() {
      this.handleSubFormFirstRowAdd()  //默认添加首行后，主动触发相关事件！！
    },
    beforeDestroy() {
      this.unregisterFromRefList()
    },
    methods: {
      getLabelAlign(widget, subWidget) {
        return subWidget.options.labelAlign || widget.options.labelAlign
      },

      registerSubFormToRefList() {
        if (this.widget.type === 'sub-form') {
          this.sfRefList[this.widget.options.name] = this
        }
      },

      initRowIdData(initFlag) {
        if (this.widget.type === 'sub-form') {
          this.rowIdData.splice(0, this.rowIdData.length)  //清除数组必须用splice，length=0不会响应式更新！！
          let subFormModel = this.formModel[this.widget.options.name]
          if (!!subFormModel && (subFormModel.length > 0)) {
            subFormModel.forEach(() => {
              this.rowIdData.push('id' + generateId())
            })

            if (!!initFlag) {
              //注意：事件触发需延期执行，SumFormDataChange事件处理代码中可能存在尚未创建完成的组件！！
              setTimeout(() => {
                this.handleSubFormRowChange(subFormModel)
              }, 800)
            }
          }
        }
      },

      addToRowIdData() {
        this.rowIdData.push('id' + generateId())
      },

      insertToRowIdData(rowIndex) {
        this.rowIdData.splice(rowIndex, 0, 'id' + generateId())
      },

      deleteFromRowIdData(rowIndex) {
        this.rowIdData.splice(rowIndex, 1)
      },

      getRowIdData() {
        return this.rowIdData
      },

      getWidgetRefOfSubForm(widgetName, rowIndex) {
        let realWidgetName = widgetName + '@row' + this.rowIdData[rowIndex]
        return this.getWidgetRef(realWidgetName)
      },

      initFieldSchemaData() {  //初始化fieldSchemaData！！！
        if (this.widget.type !== 'sub-form') {
          return
        }

        let rowLength = this.rowIdData.length
        this.fieldSchemaData.splice(0, this.fieldSchemaData.length)  //清除数组必须用splice，length=0不会响应式更新！！
        if (rowLength > 0) {
          for (let i = 0; i < rowLength; i++) {
            let fieldSchemas = []
            this.widget.widgetList.forEach(swItem => {
              fieldSchemas.push( this.cloneFieldSchema(swItem) )
            })
            this.fieldSchemaData.push(fieldSchemas)
          }
        }
      },

      addToFieldSchemaData(rowIndex) {
        let fieldSchemas = []
        this.widget.widgetList.forEach(swItem => {
          fieldSchemas.push( this.cloneFieldSchema(swItem) )
        })

        if (rowIndex === undefined) {
          this.fieldSchemaData.push(fieldSchemas)
        } else {
          this.fieldSchemaData.splice(rowIndex, 0, fieldSchemas)
        }
      },

      deleteFromFieldSchemaData(rowIndex) {
        this.fieldSchemaData.splice(rowIndex, 1)
      },

      cloneFieldSchema(fieldWidget) {
        let newFieldSchema = deepClone(fieldWidget)
        newFieldSchema.id = fieldWidget.type + generateId()
        return newFieldSchema
      },

      initEventHandler() {
        if (this.widget.type !== 'sub-form') {
          return
        }

        this.$on('setFormData', (newFormData) => {
          this.initRowIdData(false)
          this.initFieldSchemaData()

          let subFormData = newFormData[this.widget.options.name] || []
          setTimeout(() => {  //延时触发SubFormRowChange事件, 便于更新计算字段！！
            this.handleSubFormRowChange(subFormData)
          }, 800)
        })
      },

      handleSubFormFirstRowAdd() {
        if (this.widget.type !== 'sub-form') {
          return
        }

        if (!!this.widget.options.showBlankRow && (this.rowIdData.length === 1)) {
          let oldSubFormData = this.formModel[this.widget.options.name] || []
          this.handleSubFormRowAdd(oldSubFormData, this.rowIdData[0])
          this.handleSubFormRowChange(oldSubFormData)
        }
      },

      addSubFormRow() {
        let newSubFormDataRow = {}
        this.widget.widgetList.forEach(subFormItem => {
          if (!!subFormItem.formItemFlag) {
            newSubFormDataRow[subFormItem.options.name] = subFormItem.options.defaultValue
          }
        })

        let oldSubFormData = this.formModel[this.widget.options.name] || []
        oldSubFormData.push(newSubFormDataRow)
        this.addToRowIdData()
        this.addToFieldSchemaData()

        this.handleSubFormRowAdd(oldSubFormData, this.rowIdData[oldSubFormData.length - 1])
        this.handleSubFormRowChange(oldSubFormData)
      },

      insertSubFormRow(beforeFormRowIndex) {
        let newSubFormDataRow = {}
        this.widget.widgetList.forEach(subFormItem => {
          if (!!subFormItem.formItemFlag) {
            newSubFormDataRow[subFormItem.options.name] = subFormItem.options.defaultValue
          }
        })

        let oldSubFormData = this.formModel[this.widget.options.name] || []
        oldSubFormData.splice(beforeFormRowIndex, 0, newSubFormDataRow)
        this.insertToRowIdData(beforeFormRowIndex)
        this.addToFieldSchemaData(beforeFormRowIndex)

        this.handleSubFormRowInsert(oldSubFormData, this.rowIdData[beforeFormRowIndex])
        this.handleSubFormRowChange(oldSubFormData)
      },

      deleteSubFormRow(formRowIndex) {
        this.$confirm(this.i18nt('render.hint.deleteSubFormRow') + '?', this.i18nt('render.hint.prompt'), {
          confirmButtonText: this.i18nt('render.hint.confirm'),
          cancelButtonText: this.i18nt('render.hint.cancel')
        }).then(() => {
          let oldSubFormData = this.formModel[this.widget.options.name] || []
          let deletedDataRow = deepClone(oldSubFormData[formRowIndex])
          oldSubFormData.splice(formRowIndex, 1)
          this.deleteFromRowIdData(formRowIndex)
          this.deleteFromFieldSchemaData(formRowIndex)

          this.handleSubFormRowDelete(oldSubFormData, deletedDataRow)
          this.handleSubFormRowChange(oldSubFormData)
        }).catch(() => {
          //
        })
      },

      handleSubFormRowChange(subFormData) {
        if (!!this.widget.options.onSubFormRowChange) {
          let customFunc = new Function('subFormData', this.widget.options.onSubFormRowChange)
          customFunc.call(this, subFormData)
        }
      },

      handleSubFormRowAdd(subFormData, newRowId) {
        if (!!this.widget.options.onSubFormRowAdd) {
          let customFunc = new Function('subFormData', 'newRowId', this.widget.options.onSubFormRowAdd)
          customFunc.call(this, subFormData, newRowId)
        }
      },

      handleSubFormRowInsert(subFormData, newRowId) {
        if (!!this.widget.options.onSubFormRowInsert) {
          let customFunc = new Function('subFormData', 'newRowId', this.widget.options.onSubFormRowInsert)
          customFunc.call(this, subFormData, newRowId)
        }
      },

      handleSubFormRowDelete(subFormData, deletedDataRow) {
        if (!!this.widget.options.onSubFormRowDelete) {
          let customFunc = new Function('subFormData', 'deletedDataRow', this.widget.options.onSubFormRowDelete)
          customFunc.call(this, subFormData, deletedDataRow)
        }
      },

    },
  }
</script>

<style lang="scss" scoped>
  .sub-form-container {
    margin-bottom: 8px;
    text-align: left; //IE浏览器强制居左对齐

    ::v-deep .el-row.header-row {
      padding-bottom: 0;
    }

    ::v-deep .el-row.sub-form-row {
      padding-top: 3px;
      padding-bottom: 3px;

      .row-number-span {
        margin-left: 16px;
      }
    }
  }

  div.action-header-column {
    display: inline-block;
    width: 120px;

    .action-label {
      margin-right: 12px;
    }

    .action-button {
      padding-left: 8px;
      padding-right: 8px;
    }
  }

  div.field-header-column {
    display: inline-block;
    //overflow: hidden;
    //white-space: nowrap;  //文字超出长度不自动换行
    //text-overflow: ellipsis;  //文字超出长度显示省略号

    span.custom-label i {
      margin: 0 3px;
    }
  }

  div.field-header-column.is-required:before {
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }

  div.label-center-left {
    text-align: left;
  }

  div.label-center-align {
    text-align: center;
  }

  div.label-right-align {
    text-align: right;
  }

  div.sub-form-action-column {
    display: inline-block;
    width: 120px;

    ::v-deep .el-form-item {
      margin-bottom: 0;
    }

    ::v-deep .el-button {
      font-size: 18px;
      padding: 0;
      background: #DCDFE6;
      border: 4px solid #DCDFE6;
    }

  }

  div.sub-form-action-column.hide-label {
    ::v-deep .el-form-item__label {
      display: none;
    }
  }

  div.sub-form-table-column {
    display: inline-block;
    //width: 200px;

    ::v-deep .el-form-item {
      margin-left: 4px;
      margin-right: 4px;
      margin-bottom: 0;
    }

    ::v-deep .el-form-item__content {
      margin-left: 0 !important;
    }
  }

  div.sub-form-table-column.hide-label {
    ::v-deep .el-form-item__label {
      display: none;
    }
  }

</style>
