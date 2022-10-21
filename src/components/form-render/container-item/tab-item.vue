<template>
  <container-item-wrapper :widget="widget">

    <div :key="widget.id" class="tab-container"
         v-show="!widget.options.hidden">
      <el-tabs v-model="activeTabName" :type="widget.displayType" :ref="widget.id" :class="[customClass]">
        <el-tab-pane v-for="(tab, index) in visibleTabs" :key="index" :label="tab.options.label"
                     :disabled="tab.options.disabled" :name="tab.options.name">
          <template v-for="(subWidget, swIdx) in tab.widgetList">
            <template v-if="'container' === subWidget.category">
              <component :is="getComponentByContainer(subWidget)" :widget="subWidget" :key="swIdx" :parent-list="tab.widgetList"
                              :index-of-parent-list="swIdx" :parent-widget="widget">
                <!-- 递归传递插槽！！！ -->
                <template v-for="slot in Object.keys($scopedSlots)" v-slot:[slot]="scope">
                  <slot :name="slot" v-bind="scope"/>
                </template>
              </component>
            </template>
            <template v-else>
              <component :is="subWidget.type + '-widget'" :field="subWidget" :key="swIdx" :parent-list="tab.widgetList"
                            :index-of-parent-list="swIdx" :parent-widget="widget">
                <!-- 递归传递插槽！！！ -->
                <template v-for="slot in Object.keys($scopedSlots)" v-slot:[slot]="scope">
                  <slot :name="slot" v-bind="scope"/>
                </template>
              </component>
            </template>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

  </container-item-wrapper>
</template>

<script>
  import emitter from '@/utils/emitter'
  import i18n from "../../../utils/i18n"
  import refMixin from "../../../components/form-render/refMixin"
  import ContainerItemWrapper from './container-item-wrapper'
  import containerItemMixin from "./containerItemMixin";
  import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'

  export default {
    name: "tab-item",
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
        activeTabName: '',
      }
    },
    computed: {
      visibleTabs() {
        return this.widget.tabs.filter(tp => {
          return !tp.options.hidden
        })
      },

    },
    created() {
      this.initRefList()
    },
    mounted() {
      this.initActiveTab()
    },
    beforeDestroy() {
      this.unregisterFromRefList()
    },
    methods: {
      initActiveTab() {
        if ((this.widget.type === 'tab') && (this.widget.tabs.length > 0)) {
          let activePanes = this.widget.tabs.filter((tp) => {
            return tp.options.active === true
          })
          if (activePanes.length > 0) {
            this.activeTabName = activePanes[0].options.name
          } else {
            this.activeTabName = this.widget.tabs[0].options.name
          }
        }
      },

    },
  }
</script>

<style lang="scss" scoped>


</style>
