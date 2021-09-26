<template>
	<Scroll class="side-scroll-bar" :height="scrollerHeight">
		<div class="panel-container">

			<Collapse v-model="activeNames" class="widget-collapse">
				<Panel name="1" :title="i18nt('designer.containerTitle')">
					{{i18nt('designer.containerTitle')}}
					<div slot="content">
					<draggable tag="ul" :list="containers" :group="{name: 'dragGroup', pull: 'clone', put: false}"
						:clone="handleContainerWidgetClone" ghost-class="ghost" :sort="false" :move="checkContainerMove"
						@end="onContainerDragEnd">
						<li v-for="(ctn, index) in containers" :key="index" class="container-widget-item"
							:title="ctn.displayName" @dblclick="addContainerByDbClick(ctn)">
							<span>
								<svg-icon :icon-class="ctn.icon" />{{i18nt(`designer.widgetLabel.${ctn.type}`)}}
							</span>
						</li>
					</draggable>
					</div>
				</Panel>

				<Panel name="2" :title="i18nt('designer.basicFieldTitle')">
					{{i18nt('designer.basicFieldTitle')}}
					<div slot="content">
					<draggable tag="ul" :list="basicFields" :group="{name: 'dragGroup', pull: 'clone', put: false}"
						:clone="handleFieldWidgetClone" ghost-class="ghost" :sort="false">
						<li v-for="(fld, index) in basicFields" :key="index" class="field-widget-item"
							:title="fld.displayName" @dblclick="addFieldByDbClick(fld)">
							<span>
								<svg-icon :icon-class="fld.icon" />{{i18nt(`designer.widgetLabel.${fld.type}`)}}
							</span>
						</li>
					</draggable>
					</div>
				</Panel>

				<Panel name="3" :title="i18nt('designer.advancedFieldTitle')">
					{{i18nt('designer.advancedFieldTitle')}}
					<div slot="content">
					<draggable tag="ul" :list="advancedFields" :group="{name: 'dragGroup', pull: 'clone', put: false}"
						:clone="handleFieldWidgetClone" ghost-class="ghost" :sort="false">
						<li v-for="(fld, index) in advancedFields" :key="index" class="field-widget-item"
							:title="fld.displayName" @dblclick="addFieldByDbClick(fld)">
							<span>
								<svg-icon :icon-class="fld.icon" />{{i18nt(`designer.widgetLabel.${fld.type}`)}}
							</span>
						</li>
					</draggable>
					</div>
				</Panel>

				<!--
        <el-collapse-item name="4" :title="i18nt('designer.customFieldTitle')">
          <draggable tag="ul" :list="customFields" :group="{name: 'dragGroup', pull: 'clone', put: false}"
                     :clone="handleFieldWidgetClone" ghost-class="ghost" :sort="false">
            <li v-for="(fld, index) in customFields" :key="index" class="field-widget-item" :title="fld.displayName"
                @dblclick="addFieldByDbClick(fld)">
              <span :title="fld.displayName"><svg-icon :icon-class="fld.icon" />{{i18nt(`designer.widgetLabel.${fld.type}`)}}</span>
            </li>
          </draggable>
        </el-collapse-item>
        -->

			</Collapse>

		</div>
	</Scroll>
</template>

<script>
	import Draggable from 'vuedraggable'
	import {
		containers,
		basicFields,
		advancedFields,
		customFields
	} from "./widgetsConfig";
	import {
		generateId,
		deepClone,
		addWindowResizeHandler
	} from "@/utils/util";
	import i18n from "../../utils/i18n.js";

	export default {
		name: "FieldPanel",
		mixins: [i18n],
		components: {
			Draggable,
		},
		props: {
			designer: Object,
		},
		data() {
			return {
				scrollerHeight: 0,

				activeNames: ['1', '2', '3', '4'],

				containers,
				basicFields,
				advancedFields,
				customFields,

				allContainers: [],
			}
		},
		computed: {
			//
		},
		mounted() {
			this.loadWidgets()

			this.scrollerHeight = window.innerHeight - 56
			addWindowResizeHandler(() => {
				this.$nextTick(() => {
					this.scrollerHeight = window.innerHeight - 56
					//console.log(this.scrollerHeight)
				})
			})
		},
		methods: {
			loadWidgets() {
				//this.allContainers = deepClone(this.containers)

				this.containers = this.containers.map(con => {
					return {
						...con,
						//category: 'container',
						displayName: this.i18nt(`designer.widgetLabel.${con.type}`)
					}
				}).filter(con => {
					return !con.internal
				})

				this.basicFields = this.basicFields.map(fld => {
					return {
						...fld,
						displayName: this.i18nt(`designer.widgetLabel.${fld.type}`)
					}
				})

				this.advancedFields = this.advancedFields.map(fld => {
					return {
						...fld,
						displayName: this.i18nt(`designer.widgetLabel.${fld.type}`)
					}
				})

				///*
				this.customFields = this.customFields.map(fld => {
					return {
						...fld,
						displayName: this.i18nt(`designer.widgetLabel.${fld.type}`)
					}
				})
				//*/
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

			onContainerDragEnd(evt) {
				//console.log('Drag end of container: ')
				//console.log(evt)
			},

			addContainerByDbClick(container) {
				this.designer.addContainerByDbClick(container)
			},

			addFieldByDbClick(widget) {
				//console.log('addWidgetByDbClick')
				this.designer.addFieldByDbClick(widget)
			},

		}

	}
</script>

<style lang="scss" scoped>
	.side-scroll-bar {
		//height: calc(100% - 56px);
		//height: 100%;

		::v-deep .el-scrollbar__wrap {
			overflow-x: hidden;
		}
		/deep/ .ivu-scroll-loader{
			display:none;
		}
	}

	div.panel-container {
		//height: calc(100% - 48px);
		//height: 100%;
		//overflow-y: hidden;
		padding-bottom: 10px;
	}

	.ivu-collapse-item ::v-deep ul>li {
		list-style: none;
	}

	.widget-collapse {
		::v-deep .el-collapse-item__header {
			padding-left: 8px;
			// font-style: italic;
			font-weight: bold;
		}

		::v-deep .ivu-collapse-content {
			padding:0px;
			padding-bottom: 6px;

			ul {
				padding-left: 10px;
				/* 重置IE11默认样式 */
				margin: 0;
				/* 重置IE11默认样式 */
				margin-block-start: 0;
				margin-block-end: 0.25em;
				padding-inline-start: 10px;

				&:after {
					content: "";
					display: block;
					clear: both;
				}

				.container-widget-item,
				.field-widget-item {
					display: inline-block;
					height: 28px;
					line-height: 28px;
					width: 112px;
					float: left;
					margin: 2px 6px 6px 0;
					cursor: move;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					background: #f1f2f3;
				}

				.container-widget-item:hover,
				.field-widget-item:hover {
					background: #EBEEF5;
					outline: 1px solid $--color-primary;
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
</style>
