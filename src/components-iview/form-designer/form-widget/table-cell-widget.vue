<template>
	<td class="table-cell" :class="[selected ? 'selected' : '', customClass]"
		:style="{width: widget.options.cellWidth + '!important' || '', height: widget.options.cellHeight + '!important' || ''}"
		:colspan="widget.options.colspan || 1" :rowspan="widget.options.rowspan || 1"
		@click.stop="selectWidget(widget)">
		<draggable :list="widget.widgetList" class="draggable-div"
			v-bind="{group:'dragGroup', ghostClass: 'ghost',animation: 200}" handel=".drag-handler"
			@end="(evt) => onTableDragEnd(evt, widget.widgetList)"
			@add="(evt) => onTableDragAdd(evt, widget.widgetList)" @update="onTableDragUpdate"
			:move="checkContainerMove">
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

		<div class="table-cell-action" v-if="designer.selectedId === widget.id && widget.type === 'table-cell'">
			<i class="ivu-icon ivu-icon-md-arrow-round-back" :title="i18nt('designer.hint.selectParentWidget')"
				@click.stop="selectParentWidget(widget)"></i>
			<Dropdown trigger="click" @on-click="handleTableCellCommand" size="small">
				<i class="ivu-icon ivu-icon-md-menu" :title="i18nt('designer.hint.cellSetting')"></i>
				<DropdownMenu  slot="list">
					<DropdownItem name="insertLeftCol">{{i18nt('designer.setting.insertColumnToLeft')}}
					</DropdownItem>
					<DropdownItem name="insertRightCol">{{i18nt('designer.setting.insertColumnToRight')}}
					</DropdownItem>
					<DropdownItem name="insertAboveRow">{{i18nt('designer.setting.insertRowAbove')}}
					</DropdownItem>
					<DropdownItem name="insertBelowRow">{{i18nt('designer.setting.insertRowBelow')}}
					</DropdownItem>
					<DropdownItem name="mergeLeftCol" :disabled="mergeLeftColDisabled" divided>
						{{i18nt('designer.setting.mergeLeftColumn')}}</DropdownItem>
					<DropdownItem name="mergeRightCol" :disabled="mergeRightColDisabled">
						{{i18nt('designer.setting.mergeRightColumn')}}</DropdownItem>
					<DropdownItem name="mergeWholeRow" :disabled="mergeWholeRowDisabled">
						{{i18nt('designer.setting.mergeEntireRow')}}</DropdownItem>
					<DropdownItem name="mergeAboveRow" :disabled="mergeAboveRowDisabled" divided>
						{{i18nt('designer.setting.mergeRowAbove')}}</DropdownItem>
					<DropdownItem name="mergeBelowRow" :disabled="mergeBelowRowDisabled">
						{{i18nt('designer.setting.mergeRowBelow')}}</DropdownItem>
					<DropdownItem name="mergeWholeCol" :disabled="mergeWholeColDisabled">
						{{i18nt('designer.setting.mergeEntireColumn')}}</DropdownItem>
					<DropdownItem name="undoMergeRow" :disabled="undoMergeRowDisabled" divided>
						{{i18nt('designer.setting.undoMergeRow')}}</DropdownItem>
					<DropdownItem name="undoMergeCol" :disabled="undoMergeColDisabled">
						{{i18nt('designer.setting.undoMergeCol')}}</DropdownItem>
					<DropdownItem name="deleteWholeCol" :disabled="deleteWholeColDisabled" divided>
						{{i18nt('designer.setting.deleteEntireCol')}}</DropdownItem>
					<DropdownItem name="deleteWholeRow" :disabled="deleteWholeRowDisabled">
						{{i18nt('designer.setting.deleteEntireRow')}}</DropdownItem>
				</DropdownMenu >
			</Dropdown>
			<!--      <i class="el-icon-delete" :title="i18nt('designer.hint.remove')" @click.stop="removeWidget"></i>-->
		</div>

		<div class="table-cell-handler" v-if="designer.selectedId === widget.id && widget.type === 'table-cell'">
			<i>{{i18nt('designer.widgetLabel.' + widget.type)}}</i>
		</div>
	</td>
</template>

<script>
	import Draggable from 'vuedraggable'
	//import ContainerWidget from "@/components/form-designer/form-widget/container-widget";
	import FieldWidget from "@/components-iview/form-designer/form-widget/field-widget";
	import i18n from "../../utils/i18n";

	export default {
		name: "TableCellWidget",
		componentName: "TableCellWidget",
		mixins: [i18n],
		components: {
			Draggable,
			//'container-widget': ContainerWidget,  /* 递归组件必须使用这种写法！！ */
			FieldWidget,
		},
		props: {
			widget: Object,
			parentWidget: Object,
			parentList: Array,
			//indexOfParentList: Number,

			rowIndex: Number,
			colIndex: Number,
			rowLength: Number,
			colLength: Number,
			colArray: Array,
			rowArray: Array,

			designer: Object,
		},
		computed: {
			selected() {
				return this.widget.id === this.designer.selectedId
			},

			customClass() {
				return this.widget.options.customClass || ''
			},

			mergeLeftColDisabled() {
				return (this.colIndex <= 0) || (this.colArray[this.colIndex - 1].options.rowspan !== this.widget.options
					.rowspan)
			},

			mergeRightColDisabled() {
				let rightColIndex = this.colIndex + this.widget.options.colspan
				return (this.colIndex >= this.colLength - 1) || (rightColIndex > this.colLength - 1) ||
					(this.colArray[rightColIndex].options.rowspan !== this.widget.options.rowspan)
			},

			mergeWholeRowDisabled() {
				return (this.colLength <= 1) || (this.colLength === this.widget.options.colspan)
			},

			mergeAboveRowDisabled() {
				return (this.rowIndex <= 0) || (this.rowArray[this.rowIndex - 1].cols[this.colIndex].options.colspan !==
					this.widget.options.colspan)

				//return this.rowIndex <= 0
				//return (this.rowIndex <= 0) || (this.widget.options.colspan !== this.rowArray) //TODO
			},

			mergeBelowRowDisabled() {
				let belowRowIndex = this.rowIndex + this.widget.options.rowspan
				return (this.rowIndex >= this.rowLength - 1) || (belowRowIndex > this.rowLength - 1) ||
					(this.rowArray[belowRowIndex].cols[this.colIndex].options.colspan !== this.widget.options.colspan)

				//return this.rowIndex >= this.rowLength - 1
			},

			mergeWholeColDisabled() {
				return (this.rowLength <= 1) || (this.rowLength === this.widget.options.rowspan)
			},

			undoMergeColDisabled() {
				return this.widget.merged || (this.widget.options.colspan <= 1)
			},

			undoMergeRowDisabled() {
				return this.widget.merged || (this.widget.options.rowspan <= 1)
			},

			deleteWholeColDisabled() {
				//return this.colLength === 1
				return (this.rowLength === 1) || (this.widget.options.colspan === this.colLength)
			},

			deleteWholeRowDisabled() {
				return (this.rowLength === 1) || (this.widget.options.rowspan === this.rowLength)
			},

		},
		watch: {
			//
		},
		methods: {
			selectWidget(widget) {
				this.designer.setSelected(widget)
			},

			checkContainerMove(evt) {
				return this.designer.checkWidgetMove(evt)
			},

			onTableDragEnd(obj, subList) {
				//console.log('test', 'drag end22222')
			},

			onTableDragAdd(evt, subList) { //重复代码，可合并
				const newIndex = evt.newIndex
				if (!!subList[newIndex]) {
					this.designer.setSelected(subList[newIndex])
				}

				this.designer.emitHistoryChange()
			},

			onTableDragUpdate(evt) {
				this.designer.emitHistoryChange()
			},

			selectParentWidget(widget) {
				if (this.parentWidget) {
					this.designer.setSelected(this.parentWidget)
				} else {
					this.designer.clearSelected()
				}
			},

			handleTableCellCommand(command) {
				if (command === 'insertLeftCol') {
					this.insertLeftCol()
				} else if (command === 'insertRightCol') {
					this.insertRightCol()
				} else if (command === 'insertAboveRow') {
					this.insertAboveRow()
				} else if (command === 'insertBelowRow') {
					this.insertBelowRow()
				} else if (command === 'mergeLeftCol') {
					this.mergeLeftCol()
				} else if (command === 'mergeRightCol') {
					this.mergeRightCol()
				} else if (command === 'mergeWholeCol') {
					this.mergeWholeCol()
				} else if (command === 'mergeAboveRow') {
					this.mergeAboveRow()
				} else if (command === 'mergeBelowRow') {
					this.mergeBelowRow()
				} else if (command === 'mergeWholeRow') {
					this.mergeWholeRow()
				} else if (command === 'undoMergeCol') {
					this.undoMergeCol()
				} else if (command === 'undoMergeRow') {
					this.undoMergeRow()
				} else if (command === 'deleteWholeCol') {
					this.deleteWholeCol()
				} else if (command === 'deleteWholeRow') {
					this.deleteWholeRow()
				}
			},

			insertLeftCol() {
				this.designer.insertTableCol(this.parentWidget, this.colIndex)
			},

			insertRightCol() {
				this.designer.insertTableCol(this.parentWidget, this.colIndex + 1)
			},

			insertAboveRow() {
				this.designer.insertTableRow(this.parentWidget, this.rowIndex, this.rowIndex)
			},

			insertBelowRow() {
				this.designer.insertTableRow(this.parentWidget, this.rowIndex + 1, this.rowIndex)
			},

			mergeLeftCol() {
				//this.designer.mergeTableColumn(this.colArray, this.colIndex, true)
				this.designer.mergeTableCol(this.rowArray, this.colArray, this.rowIndex, this.colIndex, true, this.widget)
			},

			mergeRightCol() {
				//this.designer.mergeTableColumn(this.colArray, this.colIndex, false)
				this.designer.mergeTableCol(this.rowArray, this.colArray, this.rowIndex, this.colIndex, false, this.widget)
			},

			mergeWholeRow() {
				this.designer.mergeTableWholeRow(this.rowArray, this.colArray, this.rowIndex, this.colIndex)
			},

			mergeAboveRow() {
				this.designer.mergeTableRow(this.rowArray, this.rowIndex, this.colIndex, true, this.widget)
			},

			mergeBelowRow() {
				this.designer.mergeTableRow(this.rowArray, this.rowIndex, this.colIndex, false, this.widget)
			},

			mergeWholeCol() {
				this.designer.mergeTableWholeCol(this.rowArray, this.colArray, this.rowIndex, this.colIndex)
			},

			undoMergeCol() {
				this.designer.undoMergeTableCol(this.rowArray, this.rowIndex, this.colIndex,
					this.widget.options.colspan, this.widget.options.rowspan)
			},

			undoMergeRow() {
				this.designer.undoMergeTableRow(this.rowArray, this.rowIndex, this.colIndex,
					this.widget.options.colspan, this.widget.options.rowspan)
			},

			deleteWholeCol() {
				this.designer.deleteTableWholeCol(this.rowArray, this.colIndex)
			},

			deleteWholeRow() {
				this.designer.deleteTableWholeRow(this.rowArray, this.rowIndex)
			},

			// removeWidget() {
			//   if (!!this.parentList) {
			//     let nextSelected = null
			//     if (this.parentList.length === 1) {
			//       if (!!this.parentWidget) {
			//         nextSelected = this.parentWidget
			//       }
			//     } else if (this.parentList.length === (1 + this.indexOfParentList)) {
			//       nextSelected = this.parentList[this.indexOfParentList - 1]
			//     } else {
			//       nextSelected = this.parentList[this.indexOfParentList + 1]
			//     }
			//
			//     this.$nextTick(() => {
			//       this.parentList.splice(this.indexOfParentList, 1)
			//       //if (!!nextSelected) {
			//       this.designer.setSelected(nextSelected)
			//       //}
			//     })
			//   }
			// },

		}
	}
</script>

<style lang="scss" scoped>
	.table-cell {
		//padding: 3px;
		border: 1px dashed #336699;
		display: table-cell;
		position: relative;

		.draggable-div {
			position: relative;
			height: 100%;
		}

		.form-widget-list {
			border: 1px dashed #336699;
			margin: 3px;
			//min-height: 36px;

			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
		}

		.table-cell-action {
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

		.table-cell-handler {
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

	.table-cell.selected {
		outline: 2px solid $--color-primary !important;
	}
</style>
