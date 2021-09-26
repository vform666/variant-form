<template>
	<div class="container-wrapper">

		<Row v-if="widget.type === 'grid'" :key="widget.id" :gutter="widget.options.gutter" class="grid-container"
			:class="[selected ? 'selected' : '', customClass]" @click.native.stop="selectWidget(widget)">
			<template v-for="(colWidget, colIdx) in widget.cols">
				<grid-col-widget :widget="colWidget" :designer="designer" :key="colWidget.id" :parent-list="widget.cols"
					:index-of-parent-list="colIdx" :parent-widget="widget"></grid-col-widget>
			</template>

		</Row>

		<div v-else-if="widget.type === 'table'" :key="widget.id" class="table-container"
			:class="{'selected': selected}" @click.stop="selectWidget(widget)">
			<table class="table-layout">
				<tbody>
					<tr v-for="(row, rowIdx) in widget.rows" :key="row.id">
						<template v-for="(colWidget, colIdx) in row.cols">
							<table-cell-widget v-if="!colWidget.merged" :widget="colWidget" :designer="designer"
								:key="colWidget.id" :parent-list="widget.cols" :row-index="rowIdx"
								:row-length="widget.rows.length" :col-index="colIdx" :col-length="row.cols.length"
								:col-array="row.cols" :row-array="widget.rows" :parent-widget="widget">
							</table-cell-widget>
						</template>
					</tr>
				</tbody>
			</table>
		</div>

		<div v-else-if="widget.type === 'tab'" :key="widget.id" class="tab-container" :class="{'selected': selected}"
			@click.stop="selectWidget(widget)">
			<Tabs :type="widget.options.displayType" :size="widget.options.size" v-model="activeTab" @onClick="onTabClick">
				<!-- -->
				<TabPane v-for="(tab, index) in widget.tabs" :key="index" :label="tab.options.label"
					:disabled="tab.options.disabled"
					:name="tab.options.name" @click.native.stop="selectWidget(widget)">
					<draggable :list="tab.widgetList" v-bind="{group:'dragGroup', ghostClass: 'ghost',animation: 200}"
						handel=".drag-handler" @add="(evt) => onContainerDragAdd(evt, tab.widgetList)"
						@update="onContainerDragUpdate" :move="checkContainerMove">
						<transition-group name="fade" tag="div" class="form-widget-list">
							<template v-for="(subWidget, swIdx) in tab.widgetList">
								<template v-if="'container' === subWidget.category">
									<container-widget :widget="subWidget" :designer="designer" :key="subWidget.id"
										:parent-list="tab.widgetList" :index-of-parent-list="swIdx"
										:parent-widget="widget"></container-widget>
								</template>
								<template v-else>
									<field-widget :field="subWidget" :designer="designer" :key="subWidget.id"
										:parent-list="tab.widgetList" :index-of-parent-list="swIdx"
										:parent-widget="widget" :design-state="true"></field-widget>
								</template>
							</template>
						</transition-group>
					</draggable>
				</TabPane>
				<!-- -->

				<!--
      <template v-for="(tabWidget, tabIdx) in widget.tabs">
        <v-tab-pane :widget="tabWidget" :designer="designer" :key="tabIdx" :parent-list="widget.tabs"
                           :index-of-parent-list="tabIdx" :parent-widget="widget"></v-tab-pane>
      </template>
      -->
			</Tabs>
		</div>

		<div v-else-if="widget.type === 'section'" :key="widget.id" class="section-container"
			:class="{'selected': selected}" @click.stop="selectWidget(widget)">
			<draggable :list="widget.widgetList" v-bind="{group:'dragGroup', ghostClass: 'ghost', animation: 200}"
				handel=".drag-handler" @add="(evt) => onContainerDragAdd(evt, widget.widgetList)"
				@update="onContainerDragUpdate" :move="checkContainerMove">
				<transition-group name="fade" tag="div" class="form-widget-list">
					<template v-for="(subWidget, swIdx) in widget.widgetList">
						<template v-if="'container' === subWidget.category">
							<container-widget :widget="subWidget" :designer="designer" :key="subWidget.id"
								:parent-list="widget.widgetList" :index-of-parent-list="swIdx" :parent-widget="widget">
							</container-widget>
						</template>
						<template v-else>
							<field-widget :field="subWidget" :designer="designer" :key="subWidget.id"
								:parent-list="widget.widgetList" :index-of-parent-list="swIdx" :parent-widget="widget"
								:design-state="true"></field-widget>
						</template>
					</template>
				</transition-group>
			</draggable>
		</div>


		<div class="container-action" v-if="designer.selectedId === widget.id && !widget.internal">
			<i class="ivu-icon ivu-icon-md-arrow-back" :title="i18nt('designer.hint.selectParentWidget')"
				@click.stop="selectParentWidget(widget)"></i>
			<i class="ivu-icon ivu-icon-md-arrow-up" v-if="!!parentList && (parentList.length > 1)"
				:title="i18nt('designer.hint.moveUpWidget')" @click.stop="moveUpWidget(widget)"></i>
			<i class="ivu-icon ivu-icon-md-arrow-down" v-if="!!parentList && (parentList.length > 1)"
				:title="i18nt('designer.hint.moveDownWidget')" @click.stop="moveDownWidget(widget)"></i>
			<i v-if="widget.type === 'table'" class="iconfont icon-insertrow" :title="i18nt('designer.hint.insertRow')"
				@click.stop="insertTableRow(widget)"></i>
			<i v-if="widget.type === 'table'" class="iconfont icon-insertcolumn"
				:title="i18nt('designer.hint.insertColumn')" @click.stop="insertTableCol(widget)"></i>
			<i class="ivu-icon ivu-icon-ios-photos-outline" v-if="(widget.type === 'grid') || (widget.type === 'table')"
				:title="i18nt('designer.hint.cloneWidget')" @click.stop="cloneContainer(widget)"></i>
			<i class="ivu-icon ivu-icon-ios-trash" :title="i18nt('designer.hint.remove')" @click.stop="removeWidget"></i>
		</div>

		<div class="drag-handler" v-if="designer.selectedId === widget.id && !widget.internal">
			<i class="ivu-icon ivu-icon-md-move" :title="i18nt('designer.hint.dragHandler')"></i>
			<i>{{i18nt('designer.widgetLabel.' + widget.type)}}</i>
		</div>

	</div>
</template>

<script>
	import Draggable from 'vuedraggable'
	import FieldWidget from "@/components-iview/form-designer/form-widget/field-widget";
	import GridColWidget from "@/components-iview/form-designer/form-widget/grid-col-widget";
	import TableCellWidget from "@/components-iview/form-designer/form-widget/table-cell-widget";
	import VTabPane from "@/components-iview/form-designer/form-widget/tab-pane";
	import {
		deepClone,
		generateId
	} from "@/utils/util";
	import i18n from "../../utils/i18n";

	export default {
		//name: "ContainerWidget",
		name: "container-widget",
		componentName: 'ContainerWidget',
		mixins: [i18n],
		components: {
			Draggable,
			FieldWidget,
			GridColWidget,
			TableCellWidget,
			VTabPane,
		},
		props: {
			widget: Object,
			parentWidget: Object,
			parentList: Array,
			indexOfParentList: Number,
			designer: Object,
			//
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
		mounted() {
			//
		},
		methods: {
			insertTableRow(widget) {
				this.designer.insertTableRow(widget)

				this.designer.emitHistoryChange()
			},

			insertTableCol(widget) {
				this.designer.insertTableCol(widget)

				this.designer.emitHistoryChange()
			},

			onContainerDragAdd(evt, subList) {
				const newIndex = evt.newIndex
				if (!!subList[newIndex]) {
					this.designer.setSelected(subList[newIndex])
				}

				this.designer.emitHistoryChange()
			},

			onContainerDragUpdate(evt) {
				this.designer.emitHistoryChange()
			},

			checkContainerMove(evt) {
				return this.designer.checkWidgetMove(evt)
			},

			selectWidget(widget) {
				this.designer.setSelected(widget)
			},

			selectParentWidget(widget) {
				if (this.parentWidget) {
					this.designer.setSelected(this.parentWidget)
				} else {
					this.designer.clearSelected()
				}
			},

			moveUpWidget(widget) {
				this.designer.moveUpWidget(this.parentList, this.indexOfParentList, this)
				this.designer.emitHistoryChange()
			},

			moveDownWidget(widget) {
				this.designer.moveDownWidget(this.parentList, this.indexOfParentList, this)
				this.designer.emitHistoryChange()
			},

			cloneContainer(widget) {
				if (!!this.parentList) {
					let newCon = this.designer.cloneContainer(widget)
					this.parentList.splice(this.indexOfParentList + 1, 0, newCon)
					this.designer.setSelected(newCon)

					this.designer.emitHistoryChange()
				}
			},

			removeWidget() {
				if (!!this.parentList) {
					let nextSelected = null
					if (this.parentList.length === 1) {
						if (!!this.parentWidget) {
							nextSelected = this.parentWidget
						}
					} else if (this.parentList.length === (1 + this.indexOfParentList)) {
						nextSelected = this.parentList[this.indexOfParentList - 1]
					} else {
						nextSelected = this.parentList[this.indexOfParentList + 1]
					}

					this.$nextTick(() => {
						this.parentList.splice(this.indexOfParentList, 1)
						//if (!!nextSelected) {
						this.designer.setSelected(nextSelected)
						//}

						this.designer.emitHistoryChange()
					})
				}
			},

			onSubFormDragAdd(evt, subList) {
				const newIndex = evt.newIndex
				if (!!subList[newIndex]) {
					this.designer.setSelected(subList[newIndex])
				}

				this.designer.emitHistoryChange()
				console.log('test', 'onSubFormDragAdd')
				this.designer.emitEvent('field-selected', this.widget)
			},

			onSubFormDragEnd(evt) {
				console.log('sub form drag end: ', evt)
			},

			onTabClick(evt) {
				console.log('onTabClick', evt)
				let paneName = evt.name
				// let foundPane = this.widget.tabs.filter((tp) => {
				//   return tp.options.name === paneName
				// })
				this.widget.tabs.forEach((tp) => {
					tp.options.active = tp.options.name === paneName;
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	.container-wrapper {
		position: relative;
		margin-bottom: 5px;

		.container-action {
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
			left: -6px;
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

	.el-row.grid-container {
		min-height: 50px;
		//line-height: 48px;
		//padding: 6px;
		outline: 1px dashed #336699;

		.form-widget-list {
			min-height: 28px;
		}

	}

	div.table-container {
		padding: 5px;
		border: 1px dashed #336699;
		box-sizing: border-box;

		table.table-layout {
			width: 100%;
			text-align: center;
			//border: 1px solid #c8ebfb;
			border-collapse: collapse;
			table-layout: fixed;

			::v-deep td {
				height: 48px;
				border: 1px dashed #336699;
				padding: 3px;
				display: table-cell;
			}

			.form-widget-list {
				border: 1px dashed #336699;
				min-height: 36px;
			}
		}
	}

	.tab-container {
		//padding: 5px;
		margin: 2px;

		.form-widget-list {
			min-height: 28px;
		}
	}

	.grid-container.selected,
	.table-container.selected,
	.tab-container.selected,
	.sub-form-container.selected,
	.section-container.selected,
	.grid-cell.selected {
		outline: 2px solid $--color-primary !important;
	}

	//.el-tabs.selected {
	//  outline: 2px solid $&#45;&#45;color-primary;
	//}

	.section-container {
		border: 1px dashed #336699;
		border-radius: 5px;
		margin: 6px 0;
		padding: 6px;

		::v-deep .form-widget-list {
			min-height: 28px;
		}
	}

	.sub-form-container {
		//width: 100%;
		padding: 8px;
		border: 1px dashed #336699;

		::v-deep .sub-form-table {
			min-height: 68px;

			div.sub-form-table-column {
				display: inline-block;
				//width: 200px;
			}
		}

		::v-deep .ghost {
			content: '';
			font-size: 0;
			//height: 3px;
			height: 74px;
			width: 1px;
			box-sizing: border-box;
			display: inline-block;
			background: $--color-primary;
			border: 2px solid $--color-primary;
			outline-width: 0;
			padding: 0;
			margin: 0;
			overflow: hidden;
		}
	}
</style>
