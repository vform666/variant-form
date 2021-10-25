<template>
  <td class="table-cell" :class="[customClass]"
      :colspan="widget.options.colspan || 1" :rowspan="widget.options.rowspan || 1"
      :style="{width: widget.options.cellWidth + ' !important' || '', height: widget.options.cellHeight + ' !important' || ''}">
    <template v-for="(subWidget, swIdx) in widget.widgetList">
      <template v-if="'container' === subWidget.category">
        <component :is="subWidget.type + '-item'" :widget="subWidget" :key="swIdx" :parent-list="widget.widgetList"
                        :index-of-parent-list="swIdx" :parent-widget="widget"></component>
      </template>
      <template v-else>
        <component :is="subWidget.type + '-widget'" :field="subWidget" :key="swIdx" :parent-list="widget.widgetList"
                      :index-of-parent-list="swIdx" :parent-widget="widget"></component>
      </template>
    </template>
  </td>
</template>

<script>
  import i18n from "../../../utils/i18n"
  import refMixin from "../../../components/form-render/refMixin"
  import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'

  export default {
    name: "TableCellItem",
    componentName: "ContainerItem",
    mixins: [i18n, refMixin],
    components: {
      ...FieldComponents,
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
      /* tableCell不生成组件引用，故无须调用initRefList！！ */
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
