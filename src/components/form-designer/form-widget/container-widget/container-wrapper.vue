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
  <div class="container-wrapper" :class="[customClass]">
    <slot></slot>

    <div class="container-action" v-if="designer.selectedId === widget.id && !widget.internal">
      <i class="el-icon-back" :title="i18nt('designer.hint.selectParentWidget')"
         @click.stop="selectParentWidget(widget)"></i>
      <i class="el-icon-top" v-if="!!parentList && (parentList.length > 1)" :title="i18nt('designer.hint.moveUpWidget')"
         @click.stop="moveUpWidget()"></i>
      <i class="el-icon-bottom" v-if="!!parentList && (parentList.length > 1)" :title="i18nt('designer.hint.moveDownWidget')"
         @click.stop="moveDownWidget()"></i>
      <i v-if="widget.type === 'table'" class="iconfont icon-insertrow" :title="i18nt('designer.hint.insertRow')"
         @click.stop="appendTableRow(widget)"></i>
      <i v-if="widget.type === 'table'" class="iconfont icon-insertcolumn" :title="i18nt('designer.hint.insertColumn')"
         @click.stop="appendTableCol(widget)"></i>
      <i class="el-icon-copy-document" v-if="(widget.type === 'grid') || (widget.type === 'table')"
         :title="i18nt('designer.hint.cloneWidget')" @click.stop="cloneContainer(widget)"></i>
      <i class="el-icon-delete" :title="i18nt('designer.hint.remove')" @click.stop="removeWidget"></i>
    </div>

    <div class="drag-handler" v-if="designer.selectedId === widget.id && !widget.internal">
      <i class="el-icon-rank" :title="i18nt('designer.hint.dragHandler')"></i>
      <i>{{i18n2t(`designer.widgetLabel.${widget.type}`, `extension.widgetLabel.${widget.type}`)}}</i>
      <i v-if="widget.options.hidden === true" class="iconfont icon-hide"></i>
    </div>
  </div>
</template>

<script>
  import i18n from "@/utils/i18n";
  import containerMixin from "@/components/form-designer/form-widget/container-widget/containerMixin";

  export default {
    name: "container-wrapper",
    mixins: [i18n, containerMixin],
    props: {
      widget: Object,
      parentWidget: Object,
      parentList: Array,
      indexOfParentList: Number,
      designer: Object,
    },
    computed: {
      customClass() {
        return !!this.widget.options.customClass ? this.widget.options.customClass.join(' ') : ''
      },

    }
  }
</script>

<style lang="scss" scoped>
  .container-wrapper {
    position: relative;
    margin-bottom: 5px;

    .container-action{
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

    .drag-handler {
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
        cursor: move;
      }
    }

  }


</style>
