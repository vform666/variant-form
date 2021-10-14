<!--
  因tabs属性并不包含于options属性之中，故只能跟其他options属性之内的属性值合并设置，此处选择与customClass合并！！
-->

<template>
  <div>
    <el-form-item :label="i18nt('designer.setting.customClass')">
      <el-select v-model="optionModel.customClass" multiple filterable allow-create
                 default-first-option>
        <el-option v-for="(item, idx) in cssClassList" :key="idx" :label="item" :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="i18nt('designer.setting.tabPaneSetting')"></el-form-item>
    <el-form-item label-width="0" class="panes-setting">
      <draggable tag="ul" :list="selectedWidget.tabs"
                 v-bind="{group:'panesGroup', ghostClass: 'ghost', handle: '.drag-option'}">
        <li v-for="(tpItem, tpIdx) in selectedWidget.tabs" :key="tpIdx" class="col-item">
          <!-- span style="margin-right: 12px">{{tpIdx + 1}}</span -->
          <el-checkbox v-model="tpItem.options.active" disabled @change="(evt) => onTabPaneActiveChange(evt, tpItem)"
                       style="margin-right: 8px">{{i18nt('designer.setting.paneActive')}}</el-checkbox>
          <el-input type="text" v-model="tpItem.options.label" style="width: 155px"></el-input>
          <i class="iconfont icon-drag drag-option"></i>
          <el-button circle plain size="mini" type="danger" @click="deleteTabPane(selectedWidget, tpIdx)"
                     icon="el-icon-minus" class="col-delete-button"></el-button>
        </li>
        <div>
          <el-button type="text" @click="addTabPane(selectedWidget)">{{i18nt('designer.setting.addTabPane')}}</el-button>
        </div>
      </draggable>
    </el-form-item>
  </div>
</template>

<script>
  import i18n from "@/utils/i18n"
  import Draggable from 'vuedraggable'
  import {deepClone} from "@/utils/util";

  export default {
    name: "tab-customClass-editor",
    componentName: 'PropertyEditor',
    mixins: [i18n],
    components: {
      Draggable,
    },
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    data() {
      return {
        cssClassList: [],
      }
    },
    created() {
      this.cssClassList = deepClone(this.designer.getCssClassList())
      //监听表单css代码改动事件并重新加载！
      this.designer.handleEvent('form-css-updated', (cssClassList) => {
        this.cssClassList = cssClassList
      })
    },
    methods: {
      onTabPaneActiveChange(evt, tpItem) {
        //TODO: !!!
      },

      addTabPane(curTabs) {
        this.designer.addTabPaneOfTabs(curTabs)
        this.designer.emitHistoryChange()
      },

      deleteTabPane(curTabs, tpIdx) {
        if (curTabs.tabs.length === 1) {
          this.$message.info(this.i18nt('designer.hint.lastPaneCannotBeDeleted'))
          return
        }

        this.designer.deleteTabPaneOfTabs(curTabs, tpIdx)
        this.designer.emitHistoryChange()
      },

    }
  }
</script>

<style lang="scss" scoped>
  li.col-item {
    list-style: none;

    span.col-span-title {
      display: inline-block;
      font-size: 13px;
      width: 120px;
    }

    .col-delete-button {
      margin-left: 6px;
    }
  }

  .panes-setting {
    ul {
      padding-inline-start: 0;
      padding-left: 0; /* 重置IE11默认样式 */
      margin: 0;
    }

    .drag-option {
      cursor: move;
    }

    li.ghost {
      background: #fff;
      border: 2px dotted $--color-primary;
    }
  }

</style>
