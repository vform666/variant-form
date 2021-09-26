<template>
	<TabPane :name="'tab1'" :label="widget.label" @click.native.stop="selectWidget(widget)">
		<draggable :list="widget.widgetList" v-bind="{group:'dragGroup', ghostClass: 'ghost',animation: 200}"
			handel=".drag-handler" @end="(evt) => onTabDragEnd(evt, widget.widgetList)"
			@add="(evt) => onTabDragAdd(evt, widget.widgetList)" @update="onTabDragUpdate" :move="checkContainerMove">
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
	</TabPane>
</template>

<script>
	import Draggable from 'vuedraggable'
	import ContainerWidget from "@/components-iview/form-designer/form-widget/container-widget";
	import FieldWidget from "@/components-iview/form-designer/form-widget/field-widget";
	import i18n from "../../utils/i18n";

	export default {
		name: "VTabPane",
		mixins: [i18n],
		components: {
			Draggable,
			ContainerWidget,
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

		},
		methods: {
			selectWidget(widget) {
				//console.log('id: ' + widget.id)
				this.designer.setSelected(widget)
			},

			onTabDragEnd(obj, subList) {
				//
			},

			onTabDragAdd(evt, subList) { //重复代码，可合并
				const newIndex = evt.newIndex
				console.log(newIndex)
				if (!!subList[newIndex]) {
					this.designer.setSelected(subList[newIndex])
				}

				this.designer.emitHistoryChange()
			},

			onTabDragUpdate(evt) {
				//console.log('test', 'on drag update')
				this.designer.emitHistoryChange()
			},

			checkContainerMove(evt) {
				return this.designer.checkWidgetMove(evt)
			},

		}
	}
</script>

<style lang="scss" scoped>
	.ivu-tabs-tab {
		//padding: 0 6px 6px;
		//padding-bottom: 10px;

		::v-deep .form-widget-list {
			min-height: 28px;
		}
	}
</style>
