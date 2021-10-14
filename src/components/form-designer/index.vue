<!--
/**
 * author: vformAdmin
 * email: vdpadmin@163.com
 * website: http://www.vform666.com
 * date: 2021.08.18
 * remark: 如果要分发VForm源码，需在本文件顶部保留此文件头信息！！
 */
-->

<template>
  <el-container class="full-height">
    <el-header class="main-header">
      <div class="float-left main-title">
        <img src="../../assets/vform-logo.png" @click="openHome">
        <span class="bold">VariantForm</span> {{i18nt('application.productTitle')}} <span class="version-span">Ver {{vFormVersion}}</span></div>
      <div class="float-right external-link">
        <el-dropdown @command="handleLanguageChanged">
          <span class="el-dropdown-link">{{curLangName}}<i class="el-icon-arrow-down el-icon--right"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="zh-CN">{{i18nt('application.zh-CN')}}</el-dropdown-item>
            <el-dropdown-item command="en-US">{{i18nt('application.en-US')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <a href="javascript:void(0)" @click="(ev) => openUrl(ev, gitUrl)" target="_blank"><svg-icon icon-class="github" />{{i18nt('application.github')}}</a>
        <a href="javascript:void(0)" @click="(ev) => openUrl(ev, docUrl)" target="_blank"><svg-icon icon-class="document" />{{i18nt('application.document')}}</a>
        <a href="javascript:void(0)" @click="(ev) => openUrl(ev, chatUrl)" target="_blank">{{i18nt('application.qqGroup')}}</a>
        <a href="javascript:void(0)" @click="(ev) => openUrl(ev, subScribeUrl)" target="_blank">
          {{i18nt('application.subscription')}}<i class="el-icon-top-right"></i></a>
      </div>
    </el-header>

    <el-container>
      <el-aside class="side-panel">
        <widget-panel :designer="designer" />
      </el-aside>

      <el-container class="center-layout-container">
        <el-header class="toolbar-header">
          <toolbar-panel :designer="designer"></toolbar-panel>
        </el-header>
        <el-main class="form-widget-main">
          <el-scrollbar class="container-scroll-bar" :style="{height: scrollerHeight}">
            <v-form-widget :designer="designer" :form-config="designer.formConfig">
            </v-form-widget>
          </el-scrollbar>
        </el-main>
      </el-container>

      <el-aside>
        <setting-panel :designer="designer" :selected-widget="designer.selectedWidget" :form-config="designer.formConfig" />
      </el-aside>
    </el-container>

  </el-container>
</template>

<script>
  import WidgetPanel from './widget-panel/index'
  import ToolbarPanel from './toolbar-panel/index'
  import SettingPanel from './setting-panel/index'
  import VFormWidget from './form-widget/index'
  import {createDesigner} from "@/components/form-designer/designer";
  import {addWindowResizeHandler, getQueryParam} from "@/utils/util";
  import {MOCK_CASE_URL, VARIANT_FORM_VERSION} from "@/utils/config";
  import i18n, { changeLocale } from "@/utils/i18n";

  export default {
    name: "VFormDesigner",
    componentName: "VFormDesigner",
    mixins: [i18n],
    components: {
      WidgetPanel,
      ToolbarPanel,
      SettingPanel,
      VFormWidget,
    },
    data() {
      return {
        vFormVersion: VARIANT_FORM_VERSION,
        curLangName: '',

        vsCodeFlag: false,
        caseName: '',

        docUrl: 'http://www.vform666.com/document.html',
        gitUrl: 'https://github.com/vform666/variant-form',
        chatUrl: 'http://www.vform666.com/chat-group.html',
        subScribeUrl: 'http://www.vform666.com/subscribe.html',

        scrollerHeight: 0,

        designer: createDesigner(this),
      }
    },
    provide() {
      return {
        //
      }
    },
    created() {
      this.vsCodeFlag = getQueryParam('vscode') == 1
      this.caseName = getQueryParam('case')
    },
    mounted() {
      this.initLocale()

      this.scrollerHeight = window.innerHeight - 56 - 36 + 'px'
      addWindowResizeHandler(() => {
        this.$nextTick(() => {
          this.scrollerHeight = window.innerHeight - 56 - 36 + 'px'
        })
      })

      this.loadCase()
    },
    methods: {
      openHome() {
        if (!!this.vsCodeFlag) {
          const msgObj = {
            cmd: 'openUrl',
            data: {
              url: 'http://www.vform666.com/'
            }
          }
          window.parent.postMessage(msgObj, '*')
        }
      },

      openUrl(event, url) {
        if (!!this.vsCodeFlag) {
          const msgObj = {
            cmd: 'openUrl',
            data: {
              url
            }
          }
          window.parent.postMessage(msgObj, '*')
        } else {
          let aDom = event.currentTarget
          aDom.href = url
          //window.open(url, '_blank') //直接打开新窗口，会被浏览器拦截
        }
      },

      loadCase() {
        if (!this.caseName) {
          return
        }

        axios.get(MOCK_CASE_URL + this.caseName).then(res => {
          if (!!res.data.code) {
            this.$message.error(this.i18nt('designer.hint.sampleLoadedFail'))
            return
          }

          this.setFormJson(res.data)
          this.$message.success(this.i18nt('designer.hint.sampleLoadedSuccess'))
        }).catch(error => {
          this.$message.error(this.i18nt('designer.hint.sampleLoadedFail') + ':' +error)
        })
      },

      initLocale() {
        let curLocale = localStorage.getItem('v_form_locale')
        if (!!this.vsCodeFlag) {
          curLocale = curLocale || 'en-US'
        } else {
          curLocale = curLocale || 'zh-CN'
        }
        this.curLangName = this.i18nt('application.' + curLocale)
        this.changeLanguage(curLocale)
      },

      handleLanguageChanged(command) {
        this.changeLanguage(command)
        this.curLangName = this.i18nt('application.' + command)
      },

      changeLanguage(langName) {
        changeLocale(langName)
      },

      setFormJson(formJson) {
        let modifiedFlag = false
        if (!!formJson) {
          if (typeof formJson === 'string') {
            modifiedFlag = this.designer.loadFormJson( JSON.parse(formJson) )
          } else if (formJson.constructor === Object) {
            modifiedFlag = this.designer.loadFormJson(formJson)
          }

          if (modifiedFlag) {
            this.designer.emitHistoryChange()
          }
        }
      },

      //TODO: 增加更多方法！！

    }
  }
</script>

<style lang="scss" scoped>
  .el-container.full-height {
    height: 100%;
    overflow-y: hidden;
  }

  .el-container.center-layout-container {
    min-width: 680px;
    border-left: 2px dotted #EBEEF5;
    border-right: 2px dotted #EBEEF5;
  }

  .el-header.main-header {
    border-bottom: 2px dotted #EBEEF5;
    height: 48px !important;
    line-height: 48px !important;
  }

  div.main-title {
    font-size: 18px;
    color: #242424;
    display: flex;
    align-items: center;
    justify-items: center;

    img {
      cursor: pointer;
      width: 36px;
      height: 36px;
    }

    span.bold {
      font-size: 20px;
      font-weight: bold;
      margin: 0 6px 0 6px;
    }

    span.version-span {
      font-size: 14px;
      color: #101F1C;
      margin-left: 6px;
    }
  }

  .float-left {
    float: left;
  }

  .float-right {
    float: right;
  }

  .el-dropdown-link {
    margin-right: 12px;
    cursor: pointer;
  }

  div.external-link a {
    font-size: 13px;
    text-decoration: none;
    margin-right: 10px;
    color: #606266;
  }

  .el-header.toolbar-header {
    border-bottom: 1px dotted #CCCCCC;
    height: 42px !important;
    line-height: 42px !important;
  }

  .el-aside.side-panel {
    width: 260px !important;
    overflow-y: hidden;
  }

  .el-main.form-widget-main {
    padding: 0;

    position: relative;
    overflow-x: hidden;
  }

  .container-scroll-bar {
    ::v-deep .el-scrollbar__wrap, ::v-deep .el-scrollbar__view {
      overflow-x: hidden;
    }
  }
</style>
