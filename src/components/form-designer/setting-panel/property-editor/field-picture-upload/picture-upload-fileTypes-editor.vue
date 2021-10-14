<template>
  <el-form-item>
    <span slot="label">{{i18nt('designer.setting.fileTypes')}}
      <el-tooltip effect="light" :content="i18nt('designer.setting.fileTypesHelp')">
        <i class="el-icon-info"></i></el-tooltip>
    </span>
    <el-select multiple allow-create filterable default-first-option
               v-model="optionModel.fileTypes" style="width: 100%">
      <el-option v-for="(ft, ftIdx) in uploadPictureTypes"
                 :key="ftIdx"
                 :label="ft.label"
                 :value="ft.value">
      </el-option>
    </el-select>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "fileTypes-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    data() {
      return {
        uploadPictureTypes: [
          {value: 'jpeg', label: 'JPG'},
          {value: 'png', label: 'PNG'},
          {value: 'gif', label: 'GIF'},
        ],
      }
    }
  }
</script>

<style scoped>

</style>
