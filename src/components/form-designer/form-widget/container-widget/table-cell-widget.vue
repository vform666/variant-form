<template>
  <td class="table-cell" :class="[selected ? 'selected' : '', customClass]"
      :style="{width: widget.options.cellWidth + '!important' || '', height: widget.options.cellHeight + '!important' || '', 'word-break': !!widget.options.wordBreak ? 'break-all' : 'normal'}"
      :colspan="widget.options.colspan || 1" :rowspan="widget.options.rowspan || 1"
      @click.stop="selectWidget(widget)">
    <draggable :list="widget.widgetList" class="draggable-div" v-bind="{group:'dragGroup', ghostClass: 'ghost',animation: 200}"
               handle=".drag-handler" @end="(evt) => onTableDragEnd(evt, widget.widgetList)"
               @add="(evt) => onTableDragAdd(evt, widget.widgetList)"
               @update="onTableDragUpdate" :move="checkContainerMove">
      <transition-group name="fade" tag="div" class="form-widget-list">
        <template v-for="(subWidget, swIdx) in widget.widgetList">
          <template v-if="'container' === subWidget.category">
            <component :is="subWidget.type + '-widget'" :widget="subWidget" :designer="designer" :key="subWidget.id" :parent-list="widget.widgetList"
                              :index-of-parent-list="swIdx" :parent-widget="widget"></component>
          </template>
          <template v-else>
            <component :is="subWidget.type + '-widget'" :field="subWidget" :designer="designer" :key="subWidget.id" :parent-list="widget.widgetList"
                          :index-of-parent-list="swIdx" :parent-widget="widget" :design-state="true"></component>
          </template>
        </template>
      </transition-group>
    </draggable>

    <div class="table-cell-action" v-if="designer.selectedId === widget.id && widget.type === 'table-cell'">
      <i class="el-icon-back" :title="i18nt('designer.hint.selectParentWidget')"
         @click.stop="selectParentWidget()"></i>
      <el-dropdown trigger="click" @command="handleTableCellCommand" size="small">
        <i class="el-icon-menu" :title="i18nt('designer.hint.cellSetting')"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="insertLeftCol">{{i18nt('designer.setting.insertColumnToLeft')}}</el-dropdown-item>
          <el-dropdown-item command="insertRightCol">{{i18nt('designer.setting.insertColumnToRight')}}</el-dropdown-item>
          <el-dropdown-item command="insertAboveRow">{{i18nt('designer.setting.insertRowAbove')}}</el-dropdown-item>
          <el-dropdown-item command="insertBelowRow">{{i18nt('designer.setting.insertRowBelow')}}</el-dropdown-item>
          <el-dropdown-item command="mergeLeftCol" :disabled="mergeLeftColDisabled" divided>{{i18nt('designer.setting.mergeLeftColumn')}}</el-dropdown-item>
          <el-dropdown-item command="mergeRightCol" :disabled="mergeRightColDisabled">{{i18nt('designer.setting.mergeRightColumn')}}</el-dropdown-item>
          <el-dropdown-item command="mergeWholeRow" :disabled="mergeWholeRowDisabled">{{i18nt('designer.setting.mergeEntireRow')}}</el-dropdown-item>
          <el-dropdown-item command="mergeAboveRow" :disabled="mergeAboveRowDisabled" divided>{{i18nt('designer.setting.mergeRowAbove')}}</el-dropdown-item>
          <el-dropdown-item command="mergeBelowRow" :disabled="mergeBelowRowDisabled">{{i18nt('designer.setting.mergeRowBelow')}}</el-dropdown-item>
          <el-dropdown-item command="mergeWholeCol" :disabled="mergeWholeColDisabled">{{i18nt('designer.setting.mergeEntireColumn')}}</el-dropdown-item>
          <el-dropdown-item command="undoMergeRow" :disabled="undoMergeRowDisabled" divided>{{i18nt('designer.setting.undoMergeRow')}}</el-dropdown-item>
          <el-dropdown-item command="undoMergeCol" :disabled="undoMergeColDisabled">{{i18nt('designer.setting.undoMergeCol')}}</el-dropdown-item>
          <el-dropdown-item command="deleteWholeCol" :disabled="deleteWholeColDisabled" divided>{{i18nt('designer.setting.deleteEntireCol')}}</el-dropdown-item>
          <el-dropdown-item command="deleteWholeRow" :disabled="deleteWholeRowDisabled">{{i18nt('designer.setting.deleteEntireRow')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div class="table-cell-handler" v-if="designer.selectedId === widget.id && widget.type === 'table-cell'">
      <i>{{i18nt('designer.widgetLabel.' + widget.type)}}</i>
    </div>
  </td>
</template>

<script>
  import Draggable from 'vuedraggable'
  import i18n from "@/utils/i18n"
  import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'
  import refMixinDesign from "@/components/form-designer/refMixinDesign"

  export default {
    name: "TableCellWidget",
    componentName: "TableCellWidget",
    mixins: [i18n, refMixinDesign],
    inject: ['refList'],
    components: {
      Draggable,
      ...FieldComponents,
    },
    props: {
      widget: Object,
      parentWidget: Object,
      parentList: Array,

      rowIndex: Number,
      colIndex: Number,
      rowLength: Number,
      colLength: Number,
      colArray: Array,
      rowArray: Array,

      designer: Object,
    },
    computed: {
      selected() {
        return this.widget.id === this.designer.selectedId
      },

      customClass() {
        return this.widget.options.customClass || ''
      },

      mergeLeftColDisabled() {
        return (this.colIndex <= 0) || (this.colArray[this.colIndex - 1].options.rowspan !== this.widget.options.rowspan)
      },

      mergeRightColDisabled() {
        let rightColIndex = this.colIndex + this.widget.options.colspan
        return (this.colIndex >= this.colLength - 1) || (rightColIndex > this.colLength -1)
            || (this.colArray[rightColIndex].options.rowspan !== this.widget.options.rowspan)
      },

      mergeWholeRowDisabled() {
        return (this.colLength <= 1) || (this.colLength === this.widget.options.colspan)
      },

      mergeAboveRowDisabled() {
        return (this.rowIndex <= 0) || (this.rowArray[this.rowIndex - 1].cols[this.colIndex].options.colspan
            !== this.widget.options.colspan)

        //return this.rowIndex <= 0
        //return (this.rowIndex <= 0) || (this.widget.options.colspan !== this.rowArray) //TODO
      },

      mergeBelowRowDisabled() {
        let belowRowIndex = this.rowIndex + this.widget.options.rowspan
        return (this.rowIndex >= this.rowLength - 1) || (belowRowIndex > this.rowLength -1)
            || (this.rowArray[belowRowIndex].cols[this.colIndex].options.colspan !== this.widget.options.colspan)
      },

      mergeWholeColDisabled() {
        return (this.rowLength <= 1) || (this.rowLength === this.widget.options.rowspan)
      },

      undoMergeColDisabled() {
        return this.widget.merged || (this.widget.options.colspan <= 1)
      },

      undoMergeRowDisabled() {
        return this.widget.merged || (this.widget.options.rowspan <= 1)
      },

      deleteWholeColDisabled() {
        //return this.colLength === 1
        return (this.colLength === 1) || (this.widget.options.colspan === this.colLength)
      },

      deleteWholeRowDisabled() {
        return (this.rowLength === 1) || (this.widget.options.rowspan === this.rowLength)
      },

    },
    watch: {
      //
    },
    created() {
      this.initRefList()
    },
    methods: {
      selectWidget(widget) {
        this.designer.setSelected(widget)
      },

      checkContainerMove(evt) {
        return this.designer.checkWidgetMove(evt)
      },

      onTableDragEnd(obj, subList) {
        //
      },

      onTableDragAdd(evt, subList) { //重复代码，可合并
        const newIndex = evt.newIndex
        if (!!subList[newIndex]) {
          this.designer.setSelected( subList[newIndex] )
        }

        this.designer.emitHistoryChange()
        this.designer.emitEvent('field-selected', this.widget)
      },

      onTableDragUpdate() {
        this.designer.emitHistoryChange()
      },

      selectParentWidget() {
        if (this.parentWidget) {
          this.designer.setSelected(this.parentWidget)
        } else {
          this.designer.clearSelected()
        }
      },

      handleTableCellCommand(command) {
        if (command === 'insertLeftCol') {
          this.insertLeftCol()
        } else if (command === 'insertRightCol') {
          this.insertRightCol()
        } else if (command === 'insertAboveRow') {
          this.insertAboveRow()
        } else if (command === 'insertBelowRow') {
          this.insertBelowRow()
        } else if (command === 'mergeLeftCol') {
          this.mergeLeftCol()
        } else if (command === 'mergeRightCol') {
          this.mergeRightCol()
        } else if (command === 'mergeWholeCol') {
          this.mergeWholeCol()
        } else if (command === 'mergeAboveRow') {
          this.mergeAboveRow()
        } else if (command === 'mergeBelowRow') {
          this.mergeBelowRow()
        } else if (command === 'mergeWholeRow') {
          this.mergeWholeRow()
        } else if (command === 'undoMergeCol') {
          this.undoMergeCol()
        } else if (command === 'undoMergeRow') {
          this.undoMergeRow()
        } else if (command === 'deleteWholeCol') {
          this.deleteWholeCol()
        } else if (command === 'deleteWholeRow') {
          this.deleteWholeRow()
        }
      },

      insertLeftCol() {
        this.designer.insertTableCol(this.parentWidget, this.colIndex, this.rowIndex, true)
      },

      insertRightCol() {
        this.designer.insertTableCol(this.parentWidget, this.colIndex, this.rowIndex, false)
      },

      insertAboveRow() {
        this.designer.insertTableRow(this.parentWidget, this.rowIndex, this.rowIndex, this.colIndex, true)
      },

      insertBelowRow() {
        this.designer.insertTableRow(this.parentWidget, this.rowIndex, this.rowIndex, this.colIndex, false)
      },

      mergeLeftCol() {
        //this.designer.mergeTableColumn(this.colArray, this.colIndex, true)
        this.designer.mergeTableCol(this.rowArray, this.colArray, this.rowIndex, this.colIndex, true, this.widget)
      },

      mergeRightCol() {
        //this.designer.mergeTableColumn(this.colArray, this.colIndex, false)
        this.designer.mergeTableCol(this.rowArray, this.colArray, this.rowIndex, this.colIndex, false, this.widget)
      },

      mergeWholeRow() {
        this.designer.mergeTableWholeRow(this.rowArray, this.colArray, this.rowIndex, this.colIndex)
      },

      mergeAboveRow() {
        this.designer.mergeTableRow(this.rowArray, this.rowIndex, this.colIndex, true, this.widget)
      },

      mergeBelowRow() {
        this.designer.mergeTableRow(this.rowArray, this.rowIndex, this.colIndex, false, this.widget)
      },

      mergeWholeCol() {
        this.designer.mergeTableWholeCol(this.rowArray, this.colArray, this.rowIndex, this.colIndex)
      },

      undoMergeCol() {
        this.designer.undoMergeTableCol(this.rowArray, this.rowIndex, this.colIndex,
            this.widget.options.colspan, this.widget.options.rowspan)
      },

      undoMergeRow() {
        this.designer.undoMergeTableRow(this.rowArray, this.rowIndex, this.colIndex,
            this.widget.options.colspan, this.widget.options.rowspan)
      },

      deleteWholeCol() {
        this.designer.deleteTableWholeCol(this.rowArray, this.colIndex)
      },

      deleteWholeRow() {
        this.designer.deleteTableWholeRow(this.rowArray, this.rowIndex)
      },

    }
  }
</script>

<style lang="scss" scoped>
  .table-cell {
    //padding: 3px;
    border: 1px dashed #336699;
    display: table-cell;
    position: relative;

    .draggable-div {
      position: relative;
      height: 100%;
    }

    .form-widget-list {
      border: 1px dashed #336699;
      margin: 3px;

      //min-height: 36px;
      height: 100%;

      /*position: absolute;*/
      /*top: 0;*/
      /*right: 0;*/
      /*bottom: 0;*/
      /*left: 0;*/
    }

    .table-cell-action{
      position: absolute;
      //bottom: -30px;
      bottom: 0;
      right: -2px;
      height: 28px;
      line-height: 28px;
      background: $--color-primary;
      z-index: 999;

      i {
        font-size: 14px;
        color: #fff;
        margin: 0 5px;
        cursor: pointer;
      }
    }

    .table-cell-handler {
      position: absolute;
      top: -2px;
      //bottom: -24px;  /* 拖拽手柄位于组件下方，有时无法正常拖动，原因未明？？ */
      left: -2px;
      height: 22px;
      line-height: 22px;
      background: $--color-primary;
      z-index: 9;

      i {
        font-size: 14px;
        font-style: normal;
        color: #fff;
        margin: 4px;
        cursor: default;  //cursor: move;
      }
    }

  }

  .table-cell.selected {
    outline: 2px solid $--color-primary !important;
  }
</style>
