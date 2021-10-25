<template>
  <container-item-wrapper>
    <el-card :key="widget.id" class="card-container" :class="[customClass]"
             :shadow="widget.options.shadow" :style="{width: widget.options.cardWidth + '!important' || ''}"
             :ref="widget.id" v-show="!widget.options.hidden">
      <div slot="header"><span>{{widget.options.label}}</span></div>
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
    </el-card>
  </container-item-wrapper>
</template>

<script>
  import emitter from 'element-ui/lib/mixins/emitter'
  import i18n from "@/utils/i18n"
  import refMixin from "@/components/form-render/refMixin"
  import ContainerItemWrapper from '@/components/form-render/container-item/container-item-wrapper'
  import containerItemMixin from "@/components/form-render/container-item/containerItemMixin"
  import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'

  export default {
    name: "card-item",
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
    computed: {
      customClass() {
        return this.widget.options.customClass || ''
      },

    },
    created() {
      this.initRefList()
    },
    beforeDestroy() {
      this.unregisterFromRefList()
    },
    methods: {

    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-card__header {
    padding: 10px 12px;
  }

</style>
