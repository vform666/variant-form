<template>
  <td class="table-cell" :class="[customClass]"
      :colspan="widget.options.colspan || 1" :rowspan="widget.options.rowspan || 1"
      :style="{width: widget.options.cellWidth + ' !important' || '', height: widget.options.cellHeight + ' !important' || '', 'word-break': !!widget.options.wordBreak ? 'break-all' : 'normal'}">
    <template v-for="(subWidget, swIdx) in widget.widgetList">
      <template v-if="'container' === subWidget.category">
        <component :is="getComponentByContainer(subWidget)" :widget="subWidget" :key="swIdx" :parent-list="widget.widgetList"
                        :index-of-parent-list="swIdx" :parent-widget="widget">
          <!-- 递归传递插槽！！！ -->
          <template v-for="slot in Object.keys($scopedSlots)" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope"/>
          </template>
        </component>
      </template>
      <template v-else>
        <component :is="subWidget.type + '-widget'" :field="subWidget" :key="swIdx" :parent-list="widget.widgetList"
                      :index-of-parent-list="swIdx" :parent-widget="widget">
          <!-- 递归传递插槽！！！ -->
          <template v-for="slot in Object.keys($scopedSlots)" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope"/>
          </template>
        </component>
      </template>
    </template>
  </td>
</template>

<script>
  import emitter from '@/utils/emitter'
  import i18n from "../../../utils/i18n"
  import refMixin from "../../../components/form-render/refMixin"
  import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'

  export default {
    name: "TableCellItem",
    componentName: "ContainerItem",
    mixins: [emitter, i18n, refMixin],
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
    //border: 1px dashed #336699;
    border: 1px solid #e5e5e5;
  }

</style>
