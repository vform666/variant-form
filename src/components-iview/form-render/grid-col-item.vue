<template>
  <Col class="grid-cell" :span="widget.options.span" :class="[customClass]"
          :key="widget.id" v-show="!widget.options.hidden">
    <template v-if="!!widget.widgetList && (widget.widgetList.length > 0)">
      <template v-for="(subWidget, swIdx) in widget.widgetList">
        <template v-if="'container' === subWidget.category">
          <container-item :widget="subWidget" :key="swIdx" :parent-list="widget.widgetList"
                          :index-of-parent-list="swIdx" :parent-widget="widget"></container-item>
        </template>
        <template v-else>
          <field-widget :field="subWidget" :designer="null" :key="swIdx" :parent-list="widget.widgetList"
                        :index-of-parent-list="swIdx" :parent-widget="widget"></field-widget>
        </template>
      </template>
    </template>
    <template v-else>
      <Col>
        <div class="blank-cell"><span class="invisible-content">{{i18nt('render.hint.blankCellContent')}}</span></div>
      </Col>
    </template>
  </Col>
</template>

<script>
  //import ContainerItem from "./container-item";
  import FieldWidget from "../form-designer/form-widget/field-widget";
  import i18n from "../utils/i18n";
  import refMixin from "./refMixin";

  export default {
    name: "GridColItem",
    componentName: 'GridColItem',
    mixins: [i18n, refMixin],
    components: {
      FieldWidget,
      //'container-item': ContainerItem,  /* 递归组件必须使用这种写法！！ */
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
