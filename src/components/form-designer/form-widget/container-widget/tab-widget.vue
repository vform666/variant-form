<!--
/**
 * author: vformAdmin
 * email: vdpadmin@163.com
 * website: https://www.vform666.com
 * date: 2021.08.18
 * remark: 如果要分发VForm源码，需在本文件顶部保留此文件头信息！！
 */
-->

<template>
  <container-wrapper :designer="designer" :widget="widget" :parent-widget="parentWidget" :parent-list="parentList"
                     :index-of-parent-list="indexOfParentList">

    <div :key="widget.id" class="tab-container"
         :class="{'selected': selected}" @click.stop="selectWidget(widget)">
      <el-tabs :type="widget.displayType" v-model="activeTab" @tab-click="onTabClick">

        <el-tab-pane v-for="(tab, index) in widget.tabs" :key="index" :label="tab.options.label" :name="tab.options.name"
                     @click.native.stop="selectWidget(widget)">
          <draggable :list="tab.widgetList" v-bind="{group:'dragGroup', ghostClass: 'ghost',animation: 200}"
                     handle=".drag-handler"
                     @add="(evt) => onContainerDragAdd(evt, tab.widgetList)"
                     @update="onContainerDragUpdate" :move="checkContainerMove">
            <transition-group name="fade" tag="div" class="form-widget-list">
              <template v-for="(subWidget, swIdx) in tab.widgetList">
                <template v-if="'container' === subWidget.category">
                  <component :is="subWidget.type + '-widget'" :widget="subWidget" :designer="designer" :key="subWidget.id" :parent-list="tab.widgetList"
                                    :index-of-parent-list="swIdx" :parent-widget="widget"></component>
                </template>
                <template v-else>
                  <component :is="subWidget.type + '-widget'" :field="subWidget" :designer="designer" :key="subWidget.id" :parent-list="tab.widgetList"
                                :index-of-parent-list="swIdx" :parent-widget="widget" :design-state="true"></component>
                </template>
              </template>
            </transition-group>
          </draggable>
        </el-tab-pane>

      </el-tabs>
    </div>

  </container-wrapper>
</template>

<script>
  import Draggable from 'vuedraggable'
  import i18n from "@/utils/i18n"
  import containerMixin from "@/components/form-designer/form-widget/container-widget/containerMixin"
  import ContainerWrapper from "@/components/form-designer/form-widget/container-widget/container-wrapper"
  import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'
  import refMixinDesign from "@/components/form-designer/refMixinDesign"

  export default {
    name: "tab-widget",
    componentName: 'ContainerWidget',
    mixins: [i18n, containerMixin, refMixinDesign],
    inject: ['refList'],
    components: {
      ContainerWrapper,
      Draggable,

      ...FieldComponents,
    },
    props: {
      widget: Object,
      parentWidget: Object,
      parentList: Array,
      indexOfParentList: Number,
      designer: Object,
    },
    data() {
      return {
        activeTab: 'tab1',
        //
      }
    },
    computed: {
      selected() {
        return this.widget.id === this.designer.selectedId
      },

      customClass() {
        return this.widget.options.customClass || ''
      },

    },
    watch: {
      //
    },
    created() {
      this.initRefList()
    },
    mounted() {
      //
    },
    methods: {
      onTabClick(evt) {
        let paneName = evt.paneName
        this.widget.tabs.forEach((tp) => {
          tp.options.active = tp.options.name === paneName;
        })
      },

    }
  }
</script>

<style lang="scss" scoped>
  .tab-container {
    //padding: 5px;
    margin: 2px;

    .form-widget-list {
      min-height: 28px;
    }
  }

  .tab-container.selected {
    outline: 2px solid $--color-primary !important;
  }

</style>
