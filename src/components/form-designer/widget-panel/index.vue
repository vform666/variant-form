<template>
  <el-scrollbar class="side-scroll-bar" :style="{height: scrollerHeight}">
    <div class="panel-container">

    <el-tabs v-model="firstTab" class="no-bottom-margin indent-left-margin">
      <el-tab-pane name="componentLib">
        <span slot="label"><i class="el-icon-set-up"></i> {{i18nt('designer.componentLib')}}</span>

      <el-collapse v-model="activeNames" class="widget-collapse">
        <el-collapse-item name="1" :title="i18nt('designer.containerTitle')">
          <draggable tag="ul" :list="containers" :group="{name: 'dragGroup', pull: 'clone', put: false}"
                     :clone="handleContainerWidgetClone" ghost-class="ghost" :sort="false"
                     :move="checkContainerMove" @end="onContainerDragEnd">
            <li v-for="(ctn, index) in containers" :key="index" class="container-widget-item" :title="ctn.displayName"
                @dblclick="addContainerByDbClick(ctn)">
              <span><svg-icon :icon-class="ctn.icon" class-name="color-svg-icon" />{{i18n2t(`designer.widgetLabel.${ctn.type}`, `extension.widgetLabel.${ctn.type}`)}}</span>
            </li>
          </draggable>
        </el-collapse-item>

        <el-collapse-item name="2" :title="i18nt('designer.basicFieldTitle')">
          <draggable tag="ul" :list="basicFields" :group="{name: 'dragGroup', pull: 'clone', put: false}"
                     :move="checkFieldMove"
                     :clone="handleFieldWidgetClone" ghost-class="ghost" :sort="false">
            <li v-for="(fld, index) in basicFields" :key="index" class="field-widget-item" :title="fld.displayName"
                @dblclick="addFieldByDbClick(fld)">
              <span><svg-icon :icon-class="fld.icon" class-name="color-svg-icon" />{{i18n2t(`designer.widgetLabel.${fld.type}`, `extension.widgetLabel.${fld.type}`)}}</span>
            </li>
          </draggable>
        </el-collapse-item>

        <el-collapse-item name="3" :title="i18nt('designer.advancedFieldTitle')">
          <draggable tag="ul" :list="advancedFields" :group="{name: 'dragGroup', pull: 'clone', put: false}"
                     :move="checkFieldMove"
                     :clone="handleFieldWidgetClone" ghost-class="ghost" :sort="false">
            <li v-for="(fld, index) in advancedFields" :key="index" class="field-widget-item" :title="fld.displayName"
                @dblclick="addFieldByDbClick(fld)">
              <span><svg-icon :icon-class="fld.icon" class-name="color-svg-icon" />{{i18n2t(`designer.widgetLabel.${fld.type}`, `extension.widgetLabel.${fld.type}`)}}</span>
            </li>
          </draggable>
        </el-collapse-item>

        <!-- -->
        <el-collapse-item name="4" :title="i18nt('designer.customFieldTitle')">
          <draggable tag="ul" :list="customFields" :group="{name: 'dragGroup', pull: 'clone', put: false}"
                     :move="checkFieldMove"
                     :clone="handleFieldWidgetClone" ghost-class="ghost" :sort="false">
            <li v-for="(fld, index) in customFields" :key="index" class="field-widget-item" :title="fld.displayName"
                @dblclick="addFieldByDbClick(fld)">
              <span>
                <svg-icon :icon-class="fld.icon" class-name="color-svg-icon" />{{i18n2t(`designer.widgetLabel.${fld.type}`, `extension.widgetLabel.${fld.type}`)}}</span>
            </li>
          </draggable>
        </el-collapse-item>
        <!-- -->

      </el-collapse>

      </el-tab-pane>

      <el-tab-pane v-if="showFormTemplates()" name="formLib" style="padding: 8px">
        <span slot="label"><i class="el-icon-c-scale-to-original"></i> {{i18nt('designer.formLib')}}</span>

        <template v-for="(ft, idx) in formTemplates">
          <el-card :key="idx" :bord-style="{ padding: '0' }" shadow="hover" class="ft-card">
            <el-popover placement="right" trigger="hover">
              <img slot="reference" :src="ft.imgUrl" style="width: 200px">
              <img :src="ft.imgUrl" style="height: 600px;width: 720px">
            </el-popover>
            <div class="bottom clear-fix">
              <span class="ft-title">#{{idx+1}} {{ft.title}}</span>
              <el-button type="text" class="right-button" @click="loadFormTemplate(ft.jsonUrl)">
                {{i18nt('designer.hint.loadFormTemplate')}}</el-button>
            </div>
          </el-card>
        </template>
      </el-tab-pane>

    </el-tabs>

    </div>
  </el-scrollbar>
</template>

<script>
  import Draggable from 'vuedraggable'
  import {containers, basicFields, advancedFields, customFields} from "./widgetsConfig"
  import {formTemplates} from './templatesConfig'
  import {addWindowResizeHandler} from "@/utils/util"
  import i18n from "@/utils/i18n"
  import axios from "axios"
  import SvgIcon from '@/components/svg-icon'

  // import ftImg1 from '@/assets/ft-images/t1.png'
  // import ftImg2 from '@/assets/ft-images/t2.png'
  // import ftImg3 from '@/assets/ft-images/t3.png'
  // import ftImg4 from '@/assets/ft-images/t4.png'
  // import ftImg5 from '@/assets/ft-images/t5.png'
  // import ftImg6 from '@/assets/ft-images/t6.png'
  // import ftImg7 from '@/assets/ft-images/t7.png'
  // import ftImg8 from '@/assets/ft-images/t8.png'

  export default {
    name: "FieldPanel",
    mixins: [i18n],
    components: {
      Draggable,
      SvgIcon,
    },
    props: {
      designer: Object,
    },
    inject: ['getBannedWidgets', 'getDesignerConfig'],
    data() {
      return {
        designerConfig: this.getDesignerConfig(),

        firstTab: 'componentLib',

        scrollerHeight: 0,

        activeNames: ['1', '2', '3', '4'],

        containers,
        basicFields,
        advancedFields,
        customFields,

        formTemplates: formTemplates,
        // ftImages: [
        //   {imgUrl: ftImg1},
        //   {imgUrl: ftImg2},
        //   {imgUrl: ftImg3},
        //   {imgUrl: ftImg4},
        //   {imgUrl: ftImg5},
        //   {imgUrl: ftImg6},
        //   {imgUrl: ftImg7},
        //   {imgUrl: ftImg8},
        // ]
      }
    },
    computed: {
      //
    },
    mounted() {
      this.loadWidgets()

      this.scrollerHeight = window.innerHeight - 56 + 'px'
      addWindowResizeHandler(() => {
        this.$nextTick(() => {
          this.scrollerHeight = window.innerHeight - 56 + 'px'
          //console.log(this.scrollerHeight)
        })
      })
    },
    methods: {
      isBanned(wName) {
        return this.getBannedWidgets().indexOf(wName) > -1
      },

      showFormTemplates() {
        if (this.designerConfig['formTemplates'] === undefined) {
          return true
        }

        return !!this.designerConfig['formTemplates']
      },

      loadWidgets() {
        this.containers = this.containers.map(con => {
          return {
            ...con,
            displayName: this.i18n2t(`designer.widgetLabel.${con.type}`, `extension.widgetLabel.${con.type}`)
          }
        }).filter(con => {
          return !con.internal && !this.isBanned(con.type)
        })

        this.basicFields = this.basicFields.map(fld => {
          return {
            ...fld,
            displayName: this.i18n2t(`designer.widgetLabel.${fld.type}`, `extension.widgetLabel.${fld.type}`)
          }
        }).filter(fld => {
          return !this.isBanned(fld.type)
        })

        this.advancedFields = this.advancedFields.map(fld => {
          return {
            ...fld,
            displayName: this.i18n2t(`designer.widgetLabel.${fld.type}`, `extension.widgetLabel.${fld.type}`)
          }
        }).filter(fld => {
          return !this.isBanned(fld.type)
        })

        this.customFields = this.customFields.map(fld => {
          return {
            ...fld,
            displayName: this.i18n2t(`designer.widgetLabel.${fld.type}`, `extension.widgetLabel.${fld.type}`)
          }
        }).filter(fld => {
          return !this.isBanned(fld.type)
        })
      },

      handleContainerWidgetClone(origin) {
        return this.designer.copyNewContainerWidget(origin)
      },

      handleFieldWidgetClone(origin) {
        return this.designer.copyNewFieldWidget(origin)
      },

      checkContainerMove(evt) {
        return this.designer.checkWidgetMove(evt)
      },

      checkFieldMove(evt) {
        return this.designer.checkFieldMove(evt)
      },

      onContainerDragEnd(evt) {
        //console.log('Drag end of container: ')
        //console.log(evt)
      },

      addContainerByDbClick(container) {
        this.designer.addContainerByDbClick(container)
      },

      addFieldByDbClick(widget) {
        this.designer.addFieldByDbClick(widget)
      },

      loadFormTemplate(jsonUrl) {
        this.$confirm(this.i18nt('designer.hint.loadFormTemplateHint'), this.i18nt('render.hint.prompt'), {
          confirmButtonText: this.i18nt('render.hint.confirm'),
          cancelButtonText: this.i18nt('render.hint.cancel')
        }).then(() => {
          axios.get(jsonUrl).then(res => {
            let modifiedFlag = false
            if (typeof res.data === 'string') {
              modifiedFlag = this.designer.loadFormJson( JSON.parse(res.data) )
            } else if (res.data.constructor === Object) {
              modifiedFlag = this.designer.loadFormJson(res.data)
            }
            if (modifiedFlag) {
              this.designer.emitHistoryChange()
            }

            this.$message.success(this.i18nt('designer.hint.loadFormTemplateSuccess'))
          }).catch(error => {
            this.$message.error(this.i18nt('designer.hint.loadFormTemplateFailed') + ':' + error)
          })
        }).catch(error => {
          console.error(error)
        })
      }

    }

  }
</script>

<style lang="scss" scoped>
  .color-svg-icon {
    -webkit-font-smoothing: antialiased;
    color: #7c7d82;
  }

  .side-scroll-bar {
    ::v-deep .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }

  div.panel-container {
    padding-bottom: 10px;
  }

  .no-bottom-margin ::v-deep .el-tabs__header {
    margin-bottom: 0;
  }

  .indent-left-margin {
    ::v-deep .el-tabs__nav {
      margin-left: 20px;
    }
  }

  .el-collapse-item ::v-deep ul > li {
    list-style: none;
  }

  .widget-collapse {
    border-top-width: 0;

    ::v-deep .el-collapse-item__header {
      margin-left: 8px;
      font-style: italic;
      font-weight: bold;
    }

    ::v-deep .el-collapse-item__content {
      padding-bottom: 6px;

      ul {
        padding-left: 10px;  /* 重置IE11默认样式 */
        margin: 0;  /* 重置IE11默认样式 */
        margin-block-start: 0;
        margin-block-end: 0.25em;
        padding-inline-start: 10px;

        &:after {
          content: "";
          display: block;
          clear: both;
        }

        .container-widget-item, .field-widget-item {
          display: inline-block;
          height: 32px;
          line-height: 32px;
          width: 98px;
          float: left;
          margin: 2px 6px 6px 0;
          cursor: move;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          background: #fff;
          border: 1px solid #e8e9eb;
          border-radius: 4px;
          padding: 0 8px;
        }

        .container-widget-item:hover, .field-widget-item:hover {
          background: #F1F2F3;
          border-color: $--color-primary;

          .color-svg-icon {
            color: $--color-primary;
          }
        }

        .drag-handler {
          position: absolute;
          top: 0;
          left: 160px;
          background-color: #dddddd;
          border-radius: 5px;
          padding-right: 5px;
          font-size: 11px;
          color: #666666;
        }
      }
    }
  }

  .el-card.ft-card {
    border: 1px solid #8896B3;
  }

  .ft-card {
    margin-bottom: 10px;

    .bottom {
      margin-top: 10px;
      line-height: 12px;
    }

    .ft-title {
      font-size: 13px;
      font-weight: bold;
    }

    .right-button {
      padding: 0;
      float: right;
    }

    .clear-fix:before, .clear-fix:after {
      display: table;
      content: "";
    }

    .clear-fix:after {
      clear: both;
    }

  }

</style>
