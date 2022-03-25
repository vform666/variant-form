<template>
  <static-content-wrapper :designer="designer" :field="field" :design-state="designState"
                          :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList"
                          :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <div :class="[!!designState ? 'slot-wrapper-design' : 'slot-wrapper-render']">
      <!-- -->
      <slot :name="field.options.name" v-bind:formModel="formModel"></slot>
      <!-- -->
      <!-- slot :name="field.options.name"></slot -->
      <div v-if="!!designState" class="slot-title">{{field.options.label}}</div>
    </div>
  </static-content-wrapper>
</template>

<script>
  import StaticContentWrapper from './static-content-wrapper'
  import emitter from '@/utils/emitter'
  import i18n, {translate} from "@/utils/i18n";
  import fieldMixin from "@/components/form-designer/form-widget/field-widget/fieldMixin";

  export default {
    name: "slot-widget",
    componentName: 'FieldWidget',  //必须固定为FieldWidget，用于接收父级组件的broadcast事件
    mixins: [emitter, fieldMixin, i18n],
    props: {
      field: Object,
      parentWidget: Object,
      parentList: Array,
      indexOfParentList: Number,
      designer: Object,

      designState: {
        type: Boolean,
        default: false
      },

      subFormRowIndex: { /* 子表单组件行索引，从0开始计数 */
        type: Number,
        default: -1
      },
      subFormColIndex: { /* 子表单组件列索引，从0开始计数 */
        type: Number,
        default: -1
      },
      subFormRowId: { /* 子表单组件行Id，唯一id且不可变 */
        type: String,
        default: ''
      },

    },
    components: {
      StaticContentWrapper,
    },
    computed: {

    },
    beforeCreate() {
      /* 这里不能访问方法和属性！！ */
    },

    created() {
      /* 注意：子组件mounted在父组件created之后、父组件mounted之前触发，故子组件mounted需要用到的prop
         需要在父组件created中初始化！！ */
      this.registerToRefList()
      this.initEventHandler()

      this.handleOnCreated()
    },

    mounted() {
      this.handleOnMounted()
    },

    beforeDestroy() {
      this.unregisterFromRefList()
    },

    methods: {

    }

  }
</script>

<style lang="scss" scoped>
  .slot-wrapper-design {
    width: 100%;
    min-height: 26px;
    background: linear-gradient(45deg, #ccc 25%, #eee 0, #eee 50%, #ccc 0, #ccc 75%, #eee 0);
    background-size: 20px 20px;
    text-align: center;

    .slot-title {
      font-size: 13px;
    }
  }

  .slot-wrapper-render {

  }

</style>
