<template>
	<Layout class="full-height">
		<Header class="main-header">
			<div class="float-left main-title">
				<img src="../../assets/vform-logo.png" @click="openHome">
				<span class="bold">VariantForm (iView)</span> {{i18nt('application.productTitle')}} <span class="version-span">Ver {{vFormVersion}}</span>
			</div>
			<div class="float-right external-link">
				<Dropdown @on-click="handleLanguageChanged">
					<span class="el-dropdown-link">{{curLangName}}<Icon type="ios-arrow-down"></Icon></span>
					<DropdownMenu  slot="list">
						<DropdownItem name="zh-CN">{{i18nt('application.zh-CN')}}</DropdownItem>
						<DropdownItem name="en-US">{{i18nt('application.en-US')}}</DropdownItem>
					</DropdownMenu >
				</Dropdown>
				<a href="javascript:void(0)" @click="(ev) => openUrl(ev, gitUrl)" target="_blank"><svg-icon icon-class="github" />{{i18nt('application.github')}}</a>
				<a href="javascript:void(0)" @click="(ev) => openUrl(ev, docUrl)" target="_blank"><svg-icon icon-class="document" />{{i18nt('application.document')}}</a>
				<a href="javascript:void(0)" @click="(ev) => openUrl(ev, chatUrl)" target="_blank">{{i18nt('application.qqGroup')}}</a>
				<a href="javascript:void(0)" @click="(ev) => openUrl(ev, subScribeUrl)" target="_blank">
				  {{i18nt('application.subscription')}}<i class="el-icon-top-right"></i></a>
			</div>
		</Header>

		<Layout>
			<Sider class="side-panel">
				<widget-panel :designer="designer" />
			</Sider>

			<Layout class="center-layout-container">
				<Header class="toolbar-header">
					<toolbar-panel :designer="designer"></toolbar-panel>
				</Header>
				<Content class="form-widget-main">
					<Scroll class="container-scroll-bar" :height="scrollerHeight">
						<v-form-widget :designer="designer" :form-config="designer.formConfig">
						</v-form-widget>
					</Scroll>
				</Content>
			</Layout>

			 <Sider class="setting-pannel">
				<setting-panel :designer="designer" :selected-widget="designer.selectedWidget"
					:form-config="designer.formConfig" />
			</Sider>
		</Layout>

	</Layout>
</template>

<script>
	import WidgetPanel from './widget-panel/index'
	import ToolbarPanel from './toolbar-panel/index'
	import SettingPanel from './setting-panel/index'
	import VFormWidget from './form-widget/index'
	import { createDesigner } from "@/components-iview/form-designer/designer";
	import { addWindowResizeHandler } from "@/utils/util";
	
	import {VARIANT_FORM_VERSION} from "@/utils/config";
	import i18n, { changeLocale } from "@/components-iview/utils/i18n";

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
		mounted() {
			this.initLocale()

			this.scrollerHeight = window.innerHeight - 56 -36 ;
			addWindowResizeHandler(() => {
				this.$nextTick(() => {
					this.scrollerHeight = window.innerHeight - 56-36 ;
				})
			})
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
			
			initLocale() {
				let curLocale = localStorage.getItem('v_form_locale') || 'zh-CN'
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
						modifiedFlag = this.designer.loadFormJson(JSON.parse(formJson))
					} else if (formJson.constructor === Object) {
						modifiedFlag = this.designer.loadFormJson(formJson)
					}

					if (modifiedFlag) {
						this.designer.emitHistoryChange()
					}
				}
			}
			//TODO: 增加更多方法！！

		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .ivu-layout-sider{
		background-color: initial;
	}
	/deep/ .setting-pannel{
		width: 320px!important;
		min-width: 320px!important;
		max-width: 320px!important;
		flex: 0 0 320px!important;
	}
	
	.ivu-layout.full-height {
		height: 100%;
		overflow-y: hidden;
	}

	.ivu-layout.center-layout-container {
		// min-width: 680px;
		border-left: 2px dotted #EBEEF5;
		border-right: 2px dotted #EBEEF5;
	}
	.ivu-layout-header{
		padding:0 20px;
	}

	.ivu-layout-header.main-header {
		background-color:#F5F7F9;
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

	.ivu-layout-header.toolbar-header {
		background-color:#F5F7F9;
		border-bottom: 1px dotted #CCCCCC;
		height: 42px !important;
		line-height: 42px !important;
		padding:0px 10px;
	}

	.ivu-layout-sider.side-panel {
		background-color:#F5F7F9;
		width: 260px !important;
		min-width: 260px !important;
		max-width: 260px !important;
		overflow-y: hidden;
	}

	.el-main.form-widget-main {
		padding: 0;

		position: relative;
		overflow-x: hidden;
	}

	.container-scroll-bar {

		::v-deep .el-scrollbar__wrap,
		::v-deep .el-scrollbar__view {
			overflow-x: hidden;
		}
		
		::v-deep .ivu-scroll-loader{
			display:none;
		}
	}
</style>
