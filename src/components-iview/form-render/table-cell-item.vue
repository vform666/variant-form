<template>
  <td class="table-cell" :class="[customClass]"
      :colspan="widget.options.colspan || 1" :rowspan="widget.options.rowspan || 1"
      :style="{width: widget.options.cellWidth + '!important' || '', height: widget.options.cellHeight + '!important' || ''}">
    <template v-for="(subWidget, swIdx) in widget.widgetList">
      <template v-if="'container' === subWidget.category">
        <container-item :widget="subWidget" :key="swIdx" :parent-list="widget.widgetList"
                          :index-of-parent-list="swIdx" :parent-widget="widget"></container-item>
      </template>
      <template v-else>
        <field-widget :field="subWidget" :key="swIdx" :parent-list="widget.widgetList"
                      :index-of-parent-list="swIdx" :parent-widget="widget"></field-widget>
      </template>
    </template>
  </td>
</template>

<script>
  import FieldWidget from "../form-designer/form-widget/field-widget";
  import i18n from "../utils/i18n";
  import refMixin from "./refMixin";

  export default {
    name: "TableCellItem",
    componentName: "TableCellItem",
    mixins: [i18n, refMixin],
    components: {
      FieldWidget,
      //'container-item': ContainerItem,  /* 递归组件必须使用这种写法！！ */
    },
    props: {
      widget: Object,

      rowIndex: Number,
      colIndex: Number,
    },
    inject: ['refList', 'globalModel'],
    computed: {
      customClass() {
        return this.widget.options.customClass || ''
      },

    },
    created() {
      /* tableCell不生成组件引用！！ */
      //this.initRefList()
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  td.table-cell {
    display: table-cell;
    height: 36px;
    border: 1px dashed #336699;
  }

</style>
