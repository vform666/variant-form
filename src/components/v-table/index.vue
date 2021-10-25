<template>
  <el-container id="commonTable">
    <el-main>
      <el-table :data="data" :height="height" :max-height="maxHeight" border stripe tooltip-effect="light"
                @selection-change="handleSelectionChange" :size="tableSize" :style="{width: tableWidth}">
        <el-table-column v-if="showCheckBox" type="selection" width="45"></el-table-column>
        <template v-for="(item, index) in columns">
          <el-table-column
                  v-if="item.show !== false"
                  :key="index"
                  :fixed="item.fixed"
                  :prop="item.prop"
                  :label="item.label"
                  :align="item.align ? item.align:'center'"
                  :width="item.width"
                  :show-overflow-tooltip="true"
                  :formatter="item.formatter ? item.formatter : formatterValue">
          </el-table-column>
        </template>
        <slot name="table_operation"/>
      </el-table>
    </el-main>

    <el-footer id="simpleTableFooter" v-if="showPager" style="height: 42px;padding-top: 6px; background: white">
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              style="text-align: right;margin:0;"
              :current-page="pagination.pageNo"
              :page-size="pagination.limit"
              :page-sizes="pagination.sizes"
              :total="pagination.total"
              layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </el-footer>
  </el-container>
</template>

<script>
  export default {
    name: 'VTable',
    props: {
      tableWidth: [String, Number],
      columns: Array,
      data: Array,
      showPager: {
        type: Boolean,
        default: true
      },
      showCheckBox: {
        type: Boolean,
        default: false
      },
      pagination: Object,
      height: {
        type: String,
        default: "100%"
      },
      maxHeight: {
        type: Number,
        default: 2000
      },
      tableSize: {
        type: String,
        default: 'medium'
      },
    },
    methods: {
      handleSelectionChange(val) {
        this.$emit('handleSelectionChange', val);
      },
      handleSizeChange(val) {
        this.$emit('handleSizeChange', val);
      },
      handleCurrentChange(val) {
        this.$emit('handleCurrentChange', val);
      },
      formatterValue(row, column, cellValue) {
        return cellValue;
      }
    }
  }
</script>

<style lang="scss" scoped>

  .el-table {
    // 解决table组件内容滚动时页面滚动条同步滚动
    overflow: auto;
    // 必须设置
    position: relative;

    ::v-deep .el-table__fixed-header-wrapper thead th > .cell {
      white-space: nowrap !important;  /* 禁止表头换行 */
    }

    ::v-deep .el-table__header-wrapper thead th > .cell {
      white-space: nowrap !important;  /* 禁止表头换行 */
    }

    ::v-deep .el-table__body-wrapper {
      //height: 100% !important;
    }
  }

</style>
