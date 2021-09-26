<template>
	<Col v-else-if="widget.type === 'grid-col'" class="grid-cell" :span="widget.options.span || 12"
		:class="[selected ? 'selected' : '', customClass]" :key="widget.id" @click.native.stop="selectWidget(widget)">
		<draggable :list="widget.widgetList" v-bind="{group:'dragGroup', ghostClass: 'ghost',animation: 200}"
			handel=".drag-handler" @end="(evt) => onGridDragEnd(evt, widget.widgetList)"
			@add="(evt) => onGridDragAdd(evt, widget.widgetList)" @update="onGridDragUpdate" :move="checkContainerMove">
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

		<div class="grid-col-action" v-if="designer.selectedId === widget.id && widget.type === 'grid-col'">
			<i class="ivu-icon ivu-icon-md-arrow-back" :title="i18nt('designer.hint.selectParentWidget')"
				@click.stop="selectParentWidget(widget)"></i>
			<i class="ivu-icon ivu-icon-md-arrow-up" v-if="!!parentList && (parentList.length > 1)"
				:title="i18nt('designer.hint.moveUpWidget')" @click.stop="moveUpWidget(widget)"></i>
			<i class="ivu-icon ivu-icon-md-arrow-down" v-if="!!parentList && (parentList.length > 1)"
				:title="i18nt('designer.hint.moveDownWidget')" @click.stop="moveDownWidget(widget)"></i>
			<i class="ivu-icon ivu-icon-ios-photos-outline" :title="i18nt('designer.hint.cloneWidget')"
				@click.stop="cloneGridCol(widget)"></i>
			<i class="ivu-icon ivu-icon-ios-trash" :title="i18nt('designer.hint.remove')" @click.stop="removeWidget"></i>
		</div>

		<div class="grid-col-handler" v-if="designer.selectedId === widget.id && widget.type === 'grid-col'">
			<i>{{i18nt('designer.widgetLabel.' + widget.type)}}</i>
		</div>
	</Col>
</template>

<script>
	import Draggable from 'vuedraggable'
	//import ContainerWidget from "@/components/form-designer/form-widget/container-widget";
	import FieldWidget from "@/components-iview/form-designer/form-widget/field-widget";
	import i18n from "../../utils/i18n";

	export default {
		name: "GridColWidget",
		componentName: "GridColWidget",
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
			indexOfParentList: Number,
			designer: Object,
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
		methods: {
			onGridDragEnd(evt, subList) {
				//console.log('drag end1111', evt)
			},

			onGridDragAdd(evt, subList) {
				const newIndex = evt.newIndex
				if (!!subList[newIndex]) {
					this.designer.setSelected(subList[newIndex])
				}

				this.designer.emitHistoryChange()
			},

			onGridDragUpdate(evt) {
				this.designer.emitHistoryChange()
			},

			selectWidget(widget) {
				console.log('id: ' + widget.id)
				this.designer.setSelected(widget)
			},

			checkContainerMove(evt) {
				return this.designer.checkWidgetMove(evt)
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
			},

			moveDownWidget(widget) {
				this.designer.moveDownWidget(this.parentList, this.indexOfParentList, this)
			},

			cloneGridCol(widget) {
				this.designer.cloneGridCol(widget, this.parentWidget)
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

		}
	}
</script>

<style lang="scss" scoped>
	.grid-cell {
		min-height: 38px;
		//line-height: 36px;
		margin: 6px 0;
		padding: 3px;
		//min-height: 300px;
		//border-right: 1px dotted #cccccc;
		outline: 1px dashed #336699;
		position: relative;

		.form-widget-list {
			min-height: 28px;
		}

		.grid-col-action {
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

		.grid-col-handler {
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
