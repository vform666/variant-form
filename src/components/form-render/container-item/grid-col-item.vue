<template>
  <el-col class="grid-cell" :span="widget.options.span" :class="[customClass]"
          :key="widget.id" v-show="!widget.options.hidden">
    <template v-if="!!widget.widgetList && (widget.widgetList.length > 0)">
      <template v-for="(subWidget, swIdx) in widget.widgetList">
        <template v-if="'container' === subWidget.category">
          <component :is="subWidget.type + '-item'" :widget="subWidget" :key="swIdx" :parent-list="widget.widgetList"
                          :index-of-parent-list="swIdx" :parent-widget="widget"></component>
        </template>
        <template v-else>
          <component :is="subWidget.type + '-widget'" :field="subWidget" :designer="null" :key="swIdx" :parent-list="widget.widgetList"
                        :index-of-parent-list="swIdx" :parent-widget="widget"></component>
        </template>
      </template>
    </template>
    <template v-else>
      <el-col>
        <div class="blank-cell"><span class="invisible-content">{{i18nt('render.hint.blankCellContent')}}</span></div>
      </el-col>
    </template>
  </el-col>
</template>

<script>
  import i18n from "../../../utils/i18n"
  import refMixin from "../../../components/form-render/refMixin"
  import ContainerItems from './index'
  import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'

  export default {
    name: "GridColItem",
    componentName: 'GridColItem',
    mixins: [i18n, refMixin],
    components: {
      ...ContainerItems,
      ...FieldComponents,
    },
    props: {
      widget: Object,
      parentWidget: Object,
      parentList: Array,
      indexOfParentList: Number,
    },
    inject: ['refList', 'globalModel'],
    computed: {
      customClass() {
        return this.widget.options.customClass || ''
      },

    },
    created() {
      this.initRefList()
    },
  }
</script>

<style lang="scss" scoped>
  .blank-cell {
    font-style: italic;
    color: #cccccc;

    span.invisible-content {
      opacity: 0;
    }
  }
</style>
