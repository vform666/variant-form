<template>

	<container-item-wrapper v-show="!widget.options.hidden" :widget="widget">

			<el-table ref="dataTable" :data="widget.options.tableData"
								:height="widget.options.tableHeight" :style="{'width': widget.options.tableWidth}"
								:border="widget.options.border" :show-summary="widget.options.showSummary"
								:size="widget.options.tableSize" :stripe="widget.options.stripe"
								@selection-change="handleSelectionChange"
								@sort-change="handleSortChange"
								:cell-style="{padding: widget.options.rowSpacing + 'px 0'}" >

				<el-table-column v-if="widget.options.showIndex" type="index" width="50" fixed="left"></el-table-column>
				<el-table-column v-if="widget.options.showCheckBox" type="selection"
												 :width="!widget.options.showSummary ? 42: 53"  fixed="left"></el-table-column>

				<el-table-column v-for="(item,index) in widget.options.tableColumns"
												 v-if="item.show !== false"
											 	 :key="index"
											 	 :prop="item.prop"
												 :label="item.label"
												 :sortable="item.sortable"
												 :fixed="item.fixed"
												 :align="item.align ? item.align:'center'"
												 :render-header="renderHeader"
												 :formatter="formatterValue"
												 :format="item.format"
												 :show-overflow-tooltip="true"
												 :width="item.width">
				</el-table-column>
			</el-table>
			<el-pagination v-if="widget.options.showPagination"
										 :small="widget.options.smallPagination"
										 :current-page="widget.options.pagination.currentPage"
										 :page-sizes="widget.options.pagination.pageSizes"
										 :page-size="widget.options.pagination.pageSize"
										 :layout="paginationLayout"
										 :total="widget.options.pagination.total"
										 @size-change="handlePageSizeChange"
										 @current-change="handleCurrentPageChange"
			>
			</el-pagination>

	</container-item-wrapper>
</template>
<script>
	import ContainerItemWrapper from '@/components/form-render/container-item/container-item-wrapper'
  import emitter from 'element-ui/lib/mixins/emitter'
  import i18n from "@/utils/i18n"
	import {formatDate1, formatDate2, formatDate3, formatDate4, formatDate5,
					formatNumber1, formatNumber2, formatNumber3, formatNumber4,
					formatNumber5, formatNumber6, formatNumber7} from "@/utils/format"
	import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'
	import refMixin from "@/components/form-render/refMixin"
	import containerItemMixin from "@/components/form-render/container-item/containerItemMixin"

  export default {
    name: "DataTableItem",
    componentName: 'ContainerItem',  //必须固定为ContainerItem，用于接收父级组件的broadcast事件
    mixins: [emitter, i18n, refMixin, containerItemMixin],
		components: {
		  ContainerItemWrapper,
		  ...FieldComponents,
		},
		props: {
			widget: Object,
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
		inject: ['refList', 'sfRefList', 'globalModel'],
		data() {
			return {
				tableData: [{
					date: '2016-05-02',
					name: '王小虎1',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '2016-05-04',
					name: '王小虎2',
					address: '上海市普陀区金沙江路 1517 弄'
				}, {
					date: '2016-05-01',
					name: '王小虎3',
					address: '上海市普陀区金沙江路 1519 弄'
				}, {
					date: '2016-05-03',
					name: '王小虎4',
					address: '上海市普陀区金沙江路 1516 弄'
				}],

				//rowSelection: [],
				selectionIndex: [],
				pageSize: this.widget.options.pagination.pageSize,
				currentPage: this.widget.options.pagination.currentPage,

			}
		},
		created() {
			this.initRefList()
		},
		mounted() {
			// this.handleOnMounted()
		},
		beforeDestroy() {
			this.unregisterFromRefList()
		},
		computed: {
			paginationLayout() {
				return !!this.widget.options.smallPagination ? 'prev, pager, next' : 'total, sizes, prev, pager, next, jumper'
			},

		  customClass() {
		    return !!this.widget.options.customClass ? this.widget.options.customClass.join(' ') : ''
		  },

		},
    methods: {
			selectWidget(widget) {
				this.designer.setSelected(widget)
			},

			renderHeader(h, { column, $index }) {//debugger
				let colCount = 0;
				if(this.widget.options.showIndex){
					colCount++;
				}
				if(this.widget.options.showCheckBox){
					colCount++;
				}

				this.$set(column, "formatS", this.widget.options.tableColumns[$index-colCount].formatS)
			  return column.label;
			},

			formatter(row, column, cellValue) {
			  return cellValue;
			},

			formatterValue(row, column, cellValue) {
				if(!!column.formatS) {
					switch(column.formatS) {
						case 'd1':
								return formatDate1(cellValue);
								break;
						case 'd2':
								return formatDate2(cellValue);
								break;
						case 'd3':
								return formatDate3(cellValue);
								break;
						case 'd4':
								return formatDate4(cellValue);
								break;
						case 'd5':
								return formatDate5(cellValue);
								break;
						case 'n1':
								return formatNumber1(cellValue);
								break;
						case 'n2':
								return formatNumber2(cellValue);
								break;
						case 'n3':
								return formatNumber3(cellValue);
								break;
						case 'n4':
								return formatNumber4(cellValue);
								break;
						case 'n5':
								return formatNumber5(cellValue);
								break;
						case 'n6':
								return formatNumber6(cellValue);
								break;
						case 'n7':
								return formatNumber7(cellValue);
								break;
					}
				}
			  return cellValue;
			},

			getRowIndex(row) {
				return this.widget.options.tableData.lastIndexOf(row)
			},

			handleSelectionChange(val) {
				//this.rowSelection = val

				this.selectionIndex.length = 0
				val.map((row) => {
					let rowIndex = this.getRowIndex(row)
					if (rowIndex >= 0) {
						this.selectionIndex.push(rowIndex)
					}
				})

				/* 必须调用mixins中的dispatch方法逐级向父组件发送消息！！ */
				this.dispatch('VFormRender', 'dataTableSelectionChange',
								[this, val, this.selectionIndex])
			},

			handleSortChange({column, prop, order}) {
				// this.dispatch('VFormRender', 'dataTableSortChange',
				// 				[this, column, prop, order, this.pageSize, this.currentPage])
				//
				// console.log('test====', prop)
			},

			handlePageSizeChange(pageSize) {
				this.pageSize = pageSize
				this.dispatch('VFormRender', 'dataTablePageSizeChange',
								[this, pageSize, this.currentPage])

				//console.log('test====', this.currentPage)
			},

			handleCurrentPageChange(currentPage) {
				this.currentPage = currentPage
				this.dispatch('VFormRender', 'dataTablePageChange',
								[this, this.pageSize, currentPage])

				//console.log('test====', this.pageSize)
			},

			//--------------------- 以下为组件支持外部调用的API方法 begin ------------------//
			/* 提示：用户可自行扩充这些方法！！！ */

			/**
			 * 设置表格数据
			 * @param tableData
			 */
			setTableData(tableData) {
				this.widget.options.tableData = tableData
			},

			/**
			 * 设置表格分页
			 * @param pagination
			 */
			setPagination(pagination) {
				if (pagination.currentPage !== undefined) {
					this.widget.options.pagination.currentPage = pagination.currentPage
				}
				if (pagination.pageSize !== undefined) {
					this.widget.options.pagination.pageSize = pagination.pageSize
				}
				if (pagination.total !== undefined) {
					this.widget.options.pagination.total = pagination.total
				}
			},

			/**
			 * 获取选中行数据，格式为对象数组
			 * @returns {[]}
			 */
			getSelectedRow() {
				return this.$refs.dataTable.selection
				//return this.rowSelection
			},

			/**
			 * 获取选中行索引，格式为数组
			 * @returns {[]}
			 */
			getSelectedIndex() {
				return this.selectionIndex
			},

			//--------------------- 以上为组件支持外部调用的API方法 end ------------------//

    }
  }
</script>

<style lang="scss" scoped>
	.collapse-container {
	  margin: 2px;

	  .form-widget-list {
	    min-height: 28px;
	  }
	}

	::v-deep .el-collapsed__header {
	  padding: 10px 12px;
	}
</style>
