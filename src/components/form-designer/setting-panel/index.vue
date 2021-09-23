<template>
  <el-container class="panel-container">
    <el-tabs :active-name="activeTab" style="height: 100%; overflow: hidden">
      <el-tab-pane :label="i18nt('designer.hint.widgetSetting')" name="1">
        <el-scrollbar class="setting-scrollbar" :style="{height: scrollerHeight}">
        <template v-if="!!designer.selectedWidget && !designer.selectedWidget.category">
          <el-form :model="optionModel" size="mini" label-position="left" label-width="120px" class="setting-form">
            <el-collapse v-model="widgetActiveCollapseNames" class="setting-collapse">
              <el-collapse-item name="1" :title="i18nt('designer.setting.commonSetting')">
                <el-form-item :label="i18nt('designer.setting.fieldName')" v-if="hasConfig('name')"
                              :rules="nameRequiredRule">
                  <el-input type="text" v-model="optionModel.name" @change="updateWidgetNameAndRef"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.label')" v-if="hasConfig('label') && !noLabelSetting">
                  <el-input type="text" v-model="optionModel.label"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.labelAlign')" v-if="hasConfig('label') && !noLabelSetting && (selectedWidget.type !== 'button')">
                  <el-radio-group v-model="optionModel.labelAlign" class="radio-group-custom">
                    <el-radio-button label="label-left-align">
                      {{i18nt('designer.setting.leftAlign')}}</el-radio-button>
                    <el-radio-button label="label-center-align">
                      {{i18nt('designer.setting.centerAlign')}}</el-radio-button>
                    <el-radio-button label="label-right-align">
                      {{i18nt('designer.setting.rightAlign')}}</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.displayType')" v-if="hasConfig('type')">
                  <el-select v-if="(selectedWidget.type === 'input')"
                             v-model="optionModel.type">
                    <el-option label="text" value="text"></el-option>
                    <!-- 当input的type设置为number时，如果输入非数字字符，则v-model拿到的值为空字符串，无法实现输入校验！故屏蔽之！！ -->
                    <el-option label="number" value="number"></el-option>
                    <el-option label="password" value="password"></el-option>
                  </el-select>
                  <el-select v-if="(selectedWidget.type === 'date')"
                             v-model="optionModel.type">
                    <el-option label="datetime" value="datetime"></el-option>
                    <el-option label="date" value="date"></el-option>
                    <el-option label="dates" value="dates"></el-option>
                    <el-option label="year" value="year"></el-option>
                    <el-option label="month" value="month"></el-option>
                    <el-option label="week" value="week"></el-option>
                  </el-select>
                  <el-select v-else-if="(selectedWidget.type === 'date-range')"
                             v-model="optionModel.type">
                    <el-option label="daterange" value="daterange"></el-option>
                    <el-option label="datetimerange" value="datetimerange"></el-option>
                    <el-option label="monthrange" value="monthrange"></el-option>
                  </el-select>
                <el-select v-else-if="(selectedWidget.type === 'button')"
                           v-model="optionModel.type">
                  <el-option label="default" value=""></el-option>
                  <el-option label="primary" value="primary"></el-option>
                  <el-option label="success" value="success"></el-option>
                  <el-option label="warning" value="warning"></el-option>
                  <el-option label="danger" value="danger"></el-option>
                  <el-option label="info" value="info"></el-option>
                  <el-option label="text" value="text"></el-option>
                </el-select>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.defaultValue')"
                              v-if="hasConfig('defaultValue') && !hasConfig('optionItems')">
                  <el-time-picker v-if="(selectedWidget.type === 'time')"
                                  v-model="optionModel.defaultValue" @change="emitDefaultValueChange"
                                  :format="optionModel.format" value-format="HH:mm:ss" style="width: 100%">
                  </el-time-picker>
                  <el-time-picker v-else-if="(selectedWidget.type === 'time-range')"
                                  v-model="optionModel.defaultValue" is-range @change="emitDefaultValueChange"
                                  :format="optionModel.format" value-format="HH:mm:ss" style="width: 100%">
                  </el-time-picker>
                  <el-date-picker v-else-if="(selectedWidget.type === 'date') || (selectedWidget.type === 'date-range')"
                                  :type="optionModel.type" v-model="optionModel.defaultValue" @change="emitDefaultValueChange"
                                  :format="optionModel.format" :value-format="optionModel.valueFormat" style="width: 100%">
                  </el-date-picker>
                  <el-switch v-else-if="(selectedWidget.type === 'switch')"
                             v-model="optionModel.defaultValue" @change="emitDefaultValueChange"
                             active-text="true" inactive-text="false"></el-switch>
                  <el-input-number v-else-if="(selectedWidget.type === 'rate')" v-model="optionModel.defaultValue"
                                   :min="0" :max="optionModel.max" style="width: 100%"
                                   @change="emitDefaultValueChange">
                  </el-input-number>
                  <el-color-picker v-else-if="(selectedWidget.type === 'color')" v-model="optionModel.defaultValue"
                                   @change="emitDefaultValueChange">
                  </el-color-picker>
                  <el-input v-else type="text"
                            v-model="optionModel.defaultValue" @change="emitDefaultValueChange"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.placeholder')" v-if="hasConfig('placeholder')">
                  <el-input type="text" v-model="optionModel.placeholder"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.startPlaceholder')" v-if="hasConfig('startPlaceholder')">
                  <el-input type="text" v-model="optionModel.startPlaceholder"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.endPlaceholder')" v-if="hasConfig('endPlaceholder')">
                  <el-input type="text" v-model="optionModel.endPlaceholder"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.widgetColumnWidth')" v-if="hasConfig('columnWidth') && !!subFormChildWidgetFlag">
                  <el-input type="text" v-model="optionModel.columnWidth"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.widgetSize')" v-if="hasConfig('size')">
                  <el-select v-model="optionModel.size">
                    <el-option v-for="item in widgetSizes" :key="item.value" :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.displayStyle')" v-if="hasConfig('displayStyle')">
                  <el-radio-group v-model="optionModel.displayStyle">
                    <el-radio label="inline">{{i18nt('designer.setting.inlineLayout')}}</el-radio>
                    <el-radio label="block">{{i18nt('designer.setting.blockLayout')}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.buttonStyle')" v-if="hasConfig('buttonStyle')">
                  <el-checkbox v-model="optionModel.buttonStyle"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.border')" v-if="hasConfig('border')">
                  <el-checkbox v-model="optionModel.border"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.labelWidth')" v-if="hasConfig('labelWidth')">
                  <el-input type="number" v-model="optionModel.labelWidth" @input.native="inputNumberHandler"
                            min="0" class="hide-spin-button"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.rows')" v-if="hasConfig('rows')">
                  <el-input-number v-model="optionModel.rows" style="width: 100%"></el-input-number>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.labelHidden')" v-if="hasConfig('labelHidden')">
                  <el-checkbox v-model="optionModel.labelHidden"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.required')" v-if="hasConfig('required')">
                  <el-checkbox v-model="optionModel.required"></el-checkbox>
                </el-form-item>
                <el-form-item v-if="hasConfig('validation')">
                  <span slot="label">{{i18nt('designer.setting.validation')}}
                    <el-tooltip effect="light" :content="i18nt('designer.setting.validationHelp')">
                      <i class="el-icon-info"></i></el-tooltip>
                  </span>
                  <el-select v-model="optionModel.validation" filterable allow-create default-first-option>
                    <el-option v-for="(fv, fvIdx) in fieldValidators"
                               :key="fvIdx"
                               :label="fv.label"
                               :value="fv.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.validationHint')" v-if="hasConfig('validationHint')">
                  <el-input type="text" v-model="optionModel.validationHint"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.readonly')" v-if="hasConfig('readonly')">
                  <el-checkbox v-model="optionModel.readonly"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.disabled')" v-if="hasConfig('disabled')">
                  <el-checkbox v-model="optionModel.disabled"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.hidden')" v-if="hasConfig('hidden')">
                  <el-checkbox v-model="optionModel.hidden"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.textContent')" v-if="hasConfig('textContent')">
                  <el-input v-model="optionModel.textContent"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.htmlContent')" v-if="hasConfig('htmlContent')">
                  <el-input v-model="optionModel.htmlContent"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.clearable')" v-if="hasConfig('clearable')">
                  <el-checkbox v-model="optionModel.clearable"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.editable')" v-if="hasConfig('editable')">
                  <el-checkbox v-model="optionModel.editable"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.format')" v-if="hasConfig('format')">
                  <el-select v-if="(selectedWidget.type === 'time') || (selectedWidget.type === 'time-range')"
                             v-model="optionModel.format" filterable allow-create>
                    <el-option label="HH:mm:ss" value="HH:mm:ss"></el-option>
                    <el-option label="HH时mm分ss秒" value="HH时mm分ss秒"></el-option>
                    <el-option label="hh:mm:ss" value="hh:mm:ss"></el-option>
                  </el-select>
                  <el-select v-if="(selectedWidget.type === 'date') || (selectedWidget.type === 'date-range')"
                             v-model="optionModel.format" filterable allow-create>
                    <el-option label="yyyy-MM-dd" value="yyyy-MM-dd"></el-option>
                    <el-option label="yyyy/MM/dd" value="yyyy/MM/dd"></el-option>
                    <el-option label="yyyy年MM月dd日" value="yyyy年MM月dd日"></el-option>
                    <el-option label="yyyy-MM-dd HH:mm:ss" value="yyyy-MM-dd HH:mm:ss"></el-option>
                    <el-option label="yyyy-MM-dd hh:mm:ss" value="yyyy-MM-dd hh:mm:ss"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.valueFormat')" v-if="hasConfig('valueFormat')">
                  <el-select v-if="(selectedWidget.type === 'date') || (selectedWidget.type === 'date-range')"
                             v-model="optionModel.valueFormat" filterable allow-create>
                    <el-option label="yyyy-MM-dd" value="yyyy-MM-dd"></el-option>
                    <el-option label="yyyy-MM-dd HH:mm:ss" value="yyyy-MM-dd HH:mm:ss"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.showPassword')"
                              v-if="hasConfig('showPassword') && (optionModel.type === 'password')">
                  <el-checkbox v-model="optionModel.showPassword"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.filterable')" v-if="hasConfig('filterable')">
                  <el-checkbox v-model="optionModel.filterable"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.allowCreate')" v-if="hasConfig('allowCreate')">
                  <el-checkbox v-model="optionModel.allowCreate"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.remote')" v-if="hasConfig('remote')">
                  <el-checkbox v-model="optionModel.remote" @change="onRemoteChange"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.automaticDropdown')" v-if="hasConfig('automaticDropdown')">
                  <el-checkbox v-model="optionModel.automaticDropdown"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.multiple')" v-if="hasConfig('multiple')">
                  <el-checkbox v-model="optionModel.multiple" @change="onMultipleSelected"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.multipleLimit')" v-if="hasConfig('multipleLimit')">
                  <el-input-number v-model="optionModel.multipleLimit" :min="0"
                                   class="hide-spin-button" style="width: 100%"></el-input-number>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.contentPosition')" v-if="hasConfig('contentPosition')">
                  <el-select v-model="optionModel.contentPosition">
                    <el-option label="center" value="center"></el-option>
                    <el-option label="left" value="left"></el-option>
                    <el-option label="right" value="right"></el-option>
                  </el-select>
                </el-form-item>
                <!-- -->
                <el-form-item label-width="0" v-if="hasConfig('optionItems')">
                  <el-divider class="custom-divider-margin-top">{{i18nt('designer.setting.optionsSetting')}}</el-divider>
                  <option-items-setting :designer="designer" :selected-widget="designer.selectedWidget"></option-items-setting>
                </el-form-item>
                <!-- -->
                <el-form-item label-width="0" v-if="hasConfig('uploadURL')">
                  <el-divider class="custom-divider">{{i18nt('designer.setting.uploadSetting')}}</el-divider>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.uploadURL')" v-if="hasConfig('uploadURL')">
                  <el-input type="text" v-model="optionModel.uploadURL"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.uploadTip')" v-if="hasConfig('uploadTip')">
                  <el-input type="text" v-model="optionModel.uploadTip"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.withCredentials')" v-if="hasConfig('withCredentials')">
                  <el-checkbox v-model="optionModel.withCredentials"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.multipleSelect')" v-if="hasConfig('multipleSelect')">
                  <el-checkbox v-model="optionModel.multipleSelect"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.showFileList')" v-if="hasConfig('showFileList')">
                  <el-checkbox v-model="optionModel.showFileList"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.limit')" v-if="hasConfig('limit')">
                  <el-input-number v-model="optionModel.limit" :min="1" class="hide-spin-button" style="width: 100%"></el-input-number>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.fileMaxSize')" v-if="hasConfig('fileMaxSize')">
                  <el-input-number v-model="optionModel.fileMaxSize" :min="1" class="hide-spin-button" style="width: 100%"></el-input-number>
                </el-form-item>
                <el-form-item v-if="hasConfig('fileTypes') && (selectedWidget.type === 'picture-upload')">
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
                <el-form-item v-if="hasConfig('fileTypes') && (selectedWidget.type === 'file-upload')">
                  <span slot="label">{{i18nt('designer.setting.fileTypes')}}
                    <el-tooltip effect="light" :content="i18nt('designer.setting.fileTypesHelp')">
                      <i class="el-icon-info"></i></el-tooltip>
                  </span>
                  <el-select multiple allow-create filterable default-first-option
                             v-model="optionModel.fileTypes" style="width: 100%">
                    <el-option v-for="(ft, ftIdx) in uploadFileTypes"
                               :key="ftIdx"
                               :label="ft.label"
                               :value="ft.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-collapse-item>

              <el-collapse-item name="2" :title="i18nt('designer.setting.advancedSetting')">
                <el-form-item :label="i18nt('designer.setting.minValue')" v-if="hasConfig('min')">
                  <el-input-number v-model="minValue" class="hide-spin-button" style="width: 100%"></el-input-number>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.maxValue')" v-if="hasConfig('max') && (selectedWidget.type !== 'rate')">
                  <el-input-number v-model="maxValue" class="hide-spin-button" style="width: 100%"></el-input-number>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.precision')" v-if="hasConfig('precision')">
                  <el-input-number v-model="optionModel.precision" :min="0" class="hide-spin-button" style="width: 100%"></el-input-number>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.step')" v-if="hasConfig('step')">
                  <el-input-number v-model="optionModel.step" class="hide-spin-button" style="width: 100%"></el-input-number>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.controlsPosition')" v-if="hasConfig('controlsPosition')">
                  <el-select v-model="optionModel.controlsPosition">
                    <el-option label="default" value=""></el-option>
                    <el-option label="right" value="right"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.minLength')" v-if="hasConfig('minLength')">
                  <el-input type="number" @input.native="inputNumberHandler" class="hide-spin-button"
                            min="0" v-model="minLength" style="width: 100%"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.maxLength')" v-if="hasConfig('maxLength')">
                  <el-input type="number" @input.native="inputNumberHandler" class="hide-spin-button"
                            min="1" v-model="maxLength" style="width: 100%"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.showWordLimit')" v-if="hasConfig('showWordLimit')">
                  <el-checkbox v-model="optionModel.showWordLimit"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.prefixIcon')" v-if="hasConfig('prefixIcon')">
                  <el-input type="text" v-model="optionModel.prefixIcon"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.suffixIcon')" v-if="hasConfig('suffixIcon')">
                  <el-input type="text" v-model="optionModel.suffixIcon"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.switchWidth')" v-if="hasConfig('switchWidth')">
                  <el-input-number v-model="optionModel.switchWidth" style="width: 100%"></el-input-number>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.activeText')" v-if="hasConfig('activeText')">
                  <el-input type="text" v-model="optionModel.activeText"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.inactiveText')" v-if="hasConfig('inactiveText')">
                  <el-input type="text" v-model="optionModel.inactiveText"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.activeColor')" v-if="hasConfig('activeColor')">
                  <el-color-picker v-model="optionModel.activeColor"></el-color-picker>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.inactiveColor')" v-if="hasConfig('inactiveColor')">
                  <el-color-picker v-model="optionModel.inactiveColor"></el-color-picker>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.maxStars')" v-if="hasConfig('max') && (selectedWidget.type === 'rate')">
                  <el-input-number v-model="optionModel.max" :min="1" :max="10"
                                   class="hide-spin-button" style="width: 100%"></el-input-number>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.lowThreshold')" v-if="hasConfig('lowThreshold')">
                  <el-input-number v-model="optionModel.lowThreshold" :min="1" :max="optionModel.highThreshold"
                                   class="hide-spin-button" style="width: 100%"></el-input-number>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.highThreshold')" v-if="hasConfig('highThreshold')">
                  <el-input-number v-model="optionModel.highThreshold" :min="optionModel.lowThreshold" :max="optionModel.max"
                                   class="hide-spin-button" style="width: 100%"></el-input-number>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.allowHalf')" v-if="hasConfig('allowHalf')">
                  <el-checkbox v-model="optionModel.allowHalf"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.showText')" v-if="hasConfig('showText')">
                  <el-checkbox v-model="optionModel.showText"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.showScore')" v-if="hasConfig('showScore')">
                  <el-checkbox v-model="optionModel.showScore"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.range')" v-if="hasConfig('range')">
                  <el-checkbox v-model="optionModel.range"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.vertical')" v-if="hasConfig('vertical')">
                  <el-checkbox v-model="optionModel.vertical"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.plain')" v-if="hasConfig('plain')">
                  <el-checkbox v-model="optionModel.plain"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.round')" v-if="hasConfig('round')">
                  <el-checkbox v-model="optionModel.round"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.circle')" v-if="hasConfig('circle')">
                  <el-checkbox v-model="optionModel.circle"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.buttonIcon')" v-if="hasConfig('icon')">
                  <el-input type="text" v-model="optionModel.icon"></el-input>
                </el-form-item>
                <!-- -->
                <el-form-item :label="i18nt('designer.setting.customClass')" v-if="!!selectedWidget.options">
                  <el-select v-model="optionModel.customClass" multiple filterable allow-create
                             default-first-option>
                    <el-option v-for="(item, idx) in cssClassList" :key="idx" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
                <!-- -->
                <el-form-item label-width="0" v-if="hasConfig('labelIconClass')">
                  <el-divider class="custom-divider">{{i18nt('designer.setting.customLabelIcon')}}</el-divider>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.labelIconClass')" v-if="hasConfig('labelIconClass')">
                  <el-input type="text" v-model="optionModel.labelIconClass"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.labelIconPosition')" v-if="hasConfig('labelIconPosition')">
                  <el-select v-model="optionModel.labelIconPosition">
                    <el-option v-for="item in labelIconPosition" :key="item.value" :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.labelTooltip')" v-if="hasConfig('labelTooltip')">
                  <el-input type="text" v-model="optionModel.labelTooltip"></el-input>
                </el-form-item>

                <el-form-item label-width="0" v-if="hasConfig('appendButton')">
                  <el-divider class="custom-divider">{{i18nt('designer.setting.inputButton')}}</el-divider>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.appendButton')" v-if="hasConfig('appendButton')">
                  <el-checkbox v-model="optionModel.appendButton"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.appendButtonDisabled')" v-if="hasConfig('appendButtonDisabled')">
                  <el-checkbox v-model="optionModel.appendButtonDisabled"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.buttonIcon')" v-if="hasConfig('buttonIcon')">
                  <el-input type="text" v-model="optionModel.buttonIcon"></el-input>
                </el-form-item>
              </el-collapse-item>

              <el-collapse-item name="3" :title="i18nt('designer.setting.eventSetting')">
                <el-form-item label="onCreated" v-if="hasConfig('onCreated')">
                  <el-button type="info" icon="el-icon-edit" plain round @click="editEventHandler('onCreated')">
                    {{i18nt('designer.setting.addEventHandler')}}</el-button>
                </el-form-item>
                <el-form-item label="onMounted" v-if="hasConfig('onMounted')">
                  <el-button type="info" icon="el-icon-edit" plain round @click="editEventHandler('onMounted')">
                    {{i18nt('designer.setting.addEventHandler')}}</el-button>
                </el-form-item>
                <el-form-item label="onClick" v-if="hasConfig('onClick')">
                  <el-button type="info" icon="el-icon-edit" plain round @click="editEventHandler('onClick')">
                    {{i18nt('designer.setting.addEventHandler')}}</el-button>
                </el-form-item>
                <el-form-item label="onRemoteQuery" v-if="hasConfig('onRemoteQuery')">
                  <el-button type="info" icon="el-icon-edit" plain round @click="editEventHandler('onRemoteQuery')">
                    {{i18nt('designer.setting.addEventHandler')}}</el-button>
                </el-form-item>
                <el-form-item label="onInput" v-if="hasConfig('onInput')">
                  <el-button type="info" icon="el-icon-edit" plain round @click="editEventHandler('onInput')">
                    {{i18nt('designer.setting.addEventHandler')}}</el-button>
                </el-form-item>
                <el-form-item label="onChange" v-if="hasConfig('onChange')">
                  <el-button type="info" icon="el-icon-edit" plain round @click="editEventHandler('onChange')">
                    {{i18nt('designer.setting.addEventHandler')}}</el-button>
                </el-form-item>
                <el-form-item label="onFocus" v-if="hasConfig('onFocus')">
                  <el-button type="info" icon="el-icon-edit" plain round @click="editEventHandler('onFocus')">
                    {{i18nt('designer.setting.addEventHandler')}}</el-button>
                </el-form-item>
                <el-form-item label="onBlur" v-if="hasConfig('onBlur')">
                  <el-button type="info" icon="el-icon-edit" plain round @click="editEventHandler('onBlur')">
                    {{i18nt('designer.setting.addEventHandler')}}</el-button>
                </el-form-item>
                <el-form-item label="onBeforeUpload" v-if="hasConfig('onBeforeUpload')">
                  <el-button type="info" icon="el-icon-edit" plain round @click="editEventHandler('onBeforeUpload')">
                    {{i18nt('designer.setting.addEventHandler')}}</el-button>
                </el-form-item>
                <el-form-item label="onUploadSuccess" v-if="hasConfig('onUploadSuccess')">
                  <el-button type="info" icon="el-icon-edit" plain round @click="editEventHandler('onUploadSuccess')">
                    {{i18nt('designer.setting.addEventHandler')}}</el-button>
                </el-form-item>
                <el-form-item label="onUploadError" v-if="hasConfig('onUploadError')">
                  <el-button type="info" icon="el-icon-edit" plain round @click="editEventHandler('onUploadError')">
                    {{i18nt('designer.setting.addEventHandler')}}</el-button>
                </el-form-item>
                <el-form-item label="onValidate" v-if="hasConfig('onValidate')">
                  <el-button type="info" icon="el-icon-edit" plain round @click="editEventHandler('onValidate')">
                    {{i18nt('designer.setting.addEventHandler')}}</el-button>
                </el-form-item>
              </el-collapse-item>
            </el-collapse>

          </el-form>
        </template>

        <template v-if="(!!designer.selectedWidget && !!designer.selectedWidget.category)">

          <el-collapse v-model="widgetActiveCollapseNames" class="setting-collapse">
            <el-collapse-item name="1" :title="i18nt('designer.setting.commonSetting')">
              <el-form :model="optionModel" size="mini" label-position="left" label-width="120px" class="setting-form">
                <el-form-item :label="i18nt('designer.setting.widgetName')" v-if="hasConfig('name')">
                  <el-input type="text" v-model="optionModel.name"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.labelAlign')" v-if="hasConfig('labelAlign')">
                  <el-radio-group v-model="optionModel.labelAlign" class="radio-group-custom">
                    <el-radio-button label="label-left-align">
                      {{i18nt('designer.setting.leftAlign')}}</el-radio-button>
                    <el-radio-button label="label-center-align">
                      {{i18nt('designer.setting.centerAlign')}}</el-radio-button>
                    <el-radio-button label="label-right-align">
                      {{i18nt('designer.setting.rightAlign')}}</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.showBlankRow')" v-if="hasConfig('showBlankRow')">
                  <el-checkbox v-model="optionModel.showBlankRow"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.showRowNumber')" v-if="hasConfig('showRowNumber')">
                  <el-checkbox v-model="optionModel.showRowNumber"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.hidden')" v-if="hasConfig('hidden')">
                  <el-checkbox v-model="optionModel.hidden"></el-checkbox>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.cellWidth')" v-if="hasConfig('cellWidth')">
                  <el-input type="text" v-model="optionModel.cellWidth"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.cellHeight')" v-if="hasConfig('cellHeight')">
                  <el-input type="text" v-model="optionModel.cellHeight"></el-input>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.customClass')" v-if="!!selectedWidget.options">
                  <el-select v-model="optionModel.customClass" multiple filterable allow-create
                             default-first-option>
                    <el-option v-for="(item, idx) in cssClassList" :key="idx" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label-width="0" v-if="hasConfig('gutter')">
                  <el-divider class="custom-divider">{{i18nt('designer.setting.columnSetting')}}</el-divider>
                </el-form-item>
                <el-form-item :label="i18nt('designer.setting.gutter')" v-if="hasConfig('gutter')">
                  <el-input-number v-model="optionModel.gutter" style="width: 100%"></el-input-number>
                </el-form-item>
              </el-form>

              <el-form :model="optionModel" size="mini" v-if="selectedWidget.type === 'grid'"
                       label-position="top" class="setting-form">
                <el-form-item :label="i18nt('designer.setting.colsOfGrid')">
                  <li v-for="(colItem, colIdx) in selectedWidget.cols" :key="colIdx" class="col-item">
                    <span class="col-span-title">{{i18nt('designer.setting.colSpanTitle')}}{{colIdx + 1}}</span>
                    <el-input-number v-model.number="colItem.options.span" :min="1" :max="24"
                                     @change="(newValue, oldValue) => spanChanged(selectedWidget, colItem, colIdx, newValue, oldValue)"
                                     class="cell-span-input"></el-input-number>
                    <el-button circle plain size="mini" type="danger" @click="deleteCol(selectedWidget, colIdx)"
                               icon="el-icon-minus" class="col-delete-button"></el-button>
                  </li>
                  <div>
                    <el-button type="text" @click="addNewCol(selectedWidget)">{{i18nt('designer.setting.addColumn')}}</el-button>
                  </div>
                </el-form-item>
              </el-form>

              <el-form :model="optionModel" size="mini" v-if="selectedWidget.type === 'grid-col'"
                       label-position="left" label-width="120px" class="setting-form">
                <el-form-item :label="i18nt('designer.setting.colSpanTitle')">
                  <el-input-number v-model.number="optionModel.span" :min="1" :max="24"
                                   style="width: 100%"></el-input-number>
                </el-form-item>
              </el-form>

              <el-form :model="optionModel" size="mini" v-if="selectedWidget.type === 'tab'"
                       label-position="top" class="setting-form panes-setting">
                <el-form-item :label="i18nt('designer.setting.tabPaneSetting')">
                  <draggable tag="ul" :list="selectedWidget.tabs"
                             v-bind="{group:'panesGroup', ghostClass: 'ghost', handle: '.drag-option'}">
                    <li v-for="(tpItem, tpIdx) in selectedWidget.tabs" :key="tpIdx" class="col-item">
                      <!-- span style="margin-right: 12px">{{tpIdx + 1}}</span -->
                      <el-checkbox v-model="tpItem.options.active" disabled @change="(evt) => onTabPaneActiveChange(evt, tpItem)"
                                   style="margin-right: 8px">{{i18nt('designer.setting.paneActive')}}</el-checkbox>
                      <el-input type="text" v-model="tpItem.options.label" style="width: 155px"></el-input>
                      <i class="iconfont icon-drag drag-option"></i>
                      <el-button circle plain size="mini" type="danger" @click="deleteTabPane(selectedWidget, tpIdx)"
                                 icon="el-icon-minus" class="col-delete-button"></el-button>
                    </li>
                    <div>
                      <el-button type="text" @click="addTabPane(selectedWidget)">{{i18nt('designer.setting.addTabPane')}}</el-button>
                    </div>
                  </draggable>
                </el-form-item>
              </el-form>
            </el-collapse-item>

            <el-collapse-item name="3" :title="i18nt('designer.setting.eventSetting')">
              <el-form :model="optionModel" size="mini" label-position="left" label-width="150px" class="setting-form">
                <el-form-item label="onSubFormRowAdd" v-if="hasConfig('onSubFormRowAdd')">
                  <el-button type="info" icon="el-icon-edit" plain round @click="editEventHandler('onSubFormRowAdd')">
                    {{i18nt('designer.setting.addEventHandler')}}</el-button>
                </el-form-item>
                <el-form-item label="onSubFormRowInsert" v-if="hasConfig('onSubFormRowInsert')">
                  <el-button type="info" icon="el-icon-edit" plain round @click="editEventHandler('onSubFormRowInsert')">
                    {{i18nt('designer.setting.addEventHandler')}}</el-button>
                </el-form-item>
                <el-form-item label="onSubFormRowDelete" v-if="hasConfig('onSubFormRowDelete')">
                  <el-button type="info" icon="el-icon-edit" plain round @click="editEventHandler('onSubFormRowDelete')">
                    {{i18nt('designer.setting.addEventHandler')}}</el-button>
                </el-form-item>
                <el-form-item label="onSubFormRowChange" v-if="hasConfig('onSubFormRowChange')">
                  <el-button type="info" icon="el-icon-edit" plain round @click="editEventHandler('onSubFormRowChange')">
                    {{i18nt('designer.setting.addEventHandler')}}</el-button>
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>

        </template>

      </el-scrollbar>
      </el-tab-pane>

      <el-tab-pane v-if="!!designer" :label="i18nt('designer.hint.formSetting')" name="2">
        <el-scrollbar class="setting-scrollbar" :style="{height: scrollerHeight}">
        <el-form :model="formConfig" size="mini" label-position="left" label-width="120px"
                 class="setting-form">
          <el-collapse v-model="formActiveCollapseNames" class="setting-collapse">
            <el-collapse-item name="1" :title="i18nt('designer.setting.basicSetting')">
              <el-form-item :label="i18nt('designer.setting.formSize')">
                <el-select v-model="formConfig.size">
                  <el-option v-for="item in formSizes" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="i18nt('designer.setting.labelPosition')">
                <el-radio-group v-model="formConfig.labelPosition" class="radio-group-custom">
                  <el-radio-button label="left">{{i18nt('designer.setting.leftPosition')}}</el-radio-button>
                  <el-radio-button label="top">{{i18nt('designer.setting.topPosition')}}</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="i18nt('designer.setting.labelAlign')">
                <el-radio-group v-model="formConfig.labelAlign" class="radio-group-custom">
                  <el-radio-button label="label-left-align">{{i18nt('designer.setting.leftAlign')}}</el-radio-button>
                  <el-radio-button label="label-center-align">{{i18nt('designer.setting.centerAlign')}}</el-radio-button>
                  <el-radio-button label="label-right-align">{{i18nt('designer.setting.rightAlign')}}</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="i18nt('designer.setting.labelWidth')">
                <el-input-number v-model="formConfig.labelWidth" :min="0" style="width: 100%"></el-input-number>
              </el-form-item>
              <el-form-item :label="i18nt('designer.setting.formCss')">
                <el-button type="info" icon="el-icon-edit" plain round @click="editFormCss">{{i18nt('designer.setting.addCss')}}</el-button>
              </el-form-item>
              <!-- -->
              <el-form-item :label="i18nt('designer.setting.customClass')">
                <el-select v-model="formConfig.customClass" multiple filterable allow-create
                           default-first-option>
                  <el-option v-for="(item, idx) in cssClassList" :key="idx" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <!-- -->
              <el-form-item :label="i18nt('designer.setting.globalFunctions')">
                <el-button type="info" icon="el-icon-edit" plain round @click="editGlobalFunctions">{{i18nt('designer.setting.addEventHandler')}}</el-button>
              </el-form-item>
              <el-form-item label-width="0">
                <el-divider class="custom-divider">{{i18nt('designer.setting.formSFCSetting')}}</el-divider>
              </el-form-item>
              <el-form-item :label="i18nt('designer.setting.formModelName')">
                <el-input type="text" v-model="formConfig.modelName"></el-input>
              </el-form-item>
              <el-form-item :label="i18nt('designer.setting.formRefName')">
                <el-input type="text" v-model="formConfig.refName"></el-input>
              </el-form-item>
              <el-form-item :label="i18nt('designer.setting.formRulesName')">
                <el-input type="text" v-model="formConfig.rulesName"></el-input>
              </el-form-item>
            </el-collapse-item>

            <el-collapse-item name="2" :title="i18nt('designer.setting.eventSetting')">
              <el-form-item label="onFormCreated">
                <el-button type="info" icon="el-icon-edit" plain round @click="editFormEventHandler('onFormCreated')">
                  {{i18nt('designer.setting.addEventHandler')}}</el-button>
              </el-form-item>
              <el-form-item label="onFormMounted">
                <el-button type="info" icon="el-icon-edit" plain round @click="editFormEventHandler('onFormMounted')">
                  {{i18nt('designer.setting.addEventHandler')}}</el-button>
              </el-form-item>
              <!-- -->
              <el-form-item label="onFormDataChange">
                <el-button type="info" icon="el-icon-edit" plain round @click="editFormEventHandler('onFormDataChange')">
                    {{i18nt('designer.setting.addEventHandler')}}</el-button>
              </el-form-item>
              <!-- -->
              <!--
              <el-form-item label="onFormValidate">
                <el-button type="info" icon="el-icon-edit" plain round @click="editFormEventHandler('onFormValidate')">
                  {{i18nt('designer.setting.addEventHandler')}}</el-button>
              </el-form-item>
              -->
            </el-collapse-item>
          </el-collapse>
        </el-form>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="i18nt('designer.setting.editWidgetEventHandler')" :visible.sync="showWidgetEventDialogFlag"
               v-if="showWidgetEventDialogFlag" :show-close="true" class="small-padding-dialog" v-dialog-drag
               :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true">
      <el-alert type="info" :closable="false" :title="optionModel.name + '.' + eventParamsMap[curEventName]"></el-alert>
      <code-editor :mode="'javascript'" :readonly="false" v-model="eventHandlerCode"></code-editor>
      <el-alert type="info" :closable="false" title="}"></el-alert>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showWidgetEventDialogFlag = false">
          {{i18nt('designer.hint.cancel')}}</el-button>
        <el-button type="primary" @click="saveEventHandler">
          {{i18nt('designer.hint.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="i18nt('designer.setting.editFormEventHandler')" :visible.sync="showFormEventDialogFlag"
               v-if="showFormEventDialogFlag" :show-close="true" class="small-padding-dialog"
               :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true">
      <el-alert type="info" :closable="false" :title="'form.' + eventParamsMap[curEventName]"></el-alert>
      <code-editor :mode="'javascript'" :readonly="false" v-model="formEventHandlerCode"></code-editor>
      <el-alert type="info" :closable="false" title="}"></el-alert>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showFormEventDialogFlag = false">
          {{i18nt('designer.hint.cancel')}}</el-button>
        <el-button type="primary" @click="saveFormEventHandler">
          {{i18nt('designer.hint.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="i18nt('designer.setting.formCss')" :visible.sync="showEditFormCssDialogFlag"
               v-if="showEditFormCssDialogFlag" :show-close="true" class="small-padding-dialog" v-dialog-drag
               :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true">
      <code-editor :mode="'css'" :readonly="false" v-model="formCssCode"></code-editor>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditFormCssDialogFlag = false">
          {{i18nt('designer.hint.cancel')}}</el-button>
        <el-button type="primary" @click="saveFormCss">
          {{i18nt('designer.hint.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="i18nt('designer.setting.globalFunctions')" :visible.sync="showEditFunctionsDialogFlag"
               v-if="showEditFunctionsDialogFlag" :show-close="true" class="small-padding-dialog" v-dialog-drag
               :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true">
      <code-editor :mode="'javascript'" :readonly="false" v-model="functionsCode"></code-editor>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditFunctionsDialogFlag = false">
          {{i18nt('designer.hint.cancel')}}</el-button>
        <el-button type="primary" @click="saveGlobalFunctions">
          {{i18nt('designer.hint.confirm')}}</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
  import Draggable from 'vuedraggable'
  import CodeEditor from '@/components/code-editor/index'
  import OptionItemsSetting from "@/components/form-designer/setting-panel/option-items-setting";
  import {
    addWindowResizeHandler,
    insertCustomCssToHead,
    insertGlobalFunctionsToHtml,
    isEmptyStr
  } from "@/utils/util";
  import i18n from "@/utils/i18n";

  export default {
    name: "SettingPanel",
    componentName: "SettingPanel",
    mixins: [i18n],
    components: {
      Draggable,
      OptionItemsSetting,
      //CodeEditor: () => import('@/components/code-editor/index'),
      CodeEditor,
    },
    props: {
      designer: Object,
      selectedWidget: Object,
      formConfig: Object,
    },
    data() {
      return {
        scrollerHeight: 0,

        nameRequiredRule: [{required: true, message: 'name required'}],

        activeTab: "2",
        widgetActiveCollapseNames: ['1', '3'], //['1', '2', '3'],
        formActiveCollapseNames: ['1', '2'],
        displayTypes: [
          {label: 'text', value: 'text'},
          {label: 'number', value: 'number'},
          {label: 'password', value: 'password'},
        ],
        widgetSizes: [
          {label: 'default', value: ''},
          {label: 'large', value: 'large'},
          {label: 'medium', value: 'medium'},
          {label: 'small', value: 'small'},
          {label: 'mini', value: 'mini'},
        ],
        formSizes: [
          {label: 'default', value: ''},
          {label: 'large', value: 'large'},
          {label: 'medium', value: 'medium'},
          {label: 'small', value: 'small'},
          {label: 'mini', value: 'mini'},
        ],

        labelIconPosition: [
          {label: 'front', value: 'front'},
          {label: 'rear', value: 'rear'},
        ],

        uploadPictureTypes: [
          {value: 'jpeg', label: 'JPG'},
          {value: 'png', label: 'PNG'},
          {value: 'gif', label: 'GIF'},
        ],

        uploadFileTypes: [
          {value: 'doc', label: 'doc'},
          {value: 'xls', label: 'xls'},
          {value: 'docx', label: 'docx'},
          {value: 'xlsx', label: 'xlsx'},
        ],

        fieldValidators: [
          {value: 'number', label: this.i18nt('designer.hint.numberValidator')},
          {value: 'letter', label: this.i18nt('designer.hint.letterValidator')},
          {value: 'letterAndNumber', label: this.i18nt('designer.hint.letterAndNumberValidator')},
          {value: 'mobilePhone', label: this.i18nt('designer.hint.mobilePhoneValidator')},
          {value: 'email', label: this.i18nt('designer.hint.emailValidator')},
          {value: 'url', label: this.i18nt('designer.hint.urlValidator')},
          {value: 'noChinese', label: this.i18nt('designer.hint.noChineseValidator')},
          {value: 'chinese', label: this.i18nt('designer.hint.chineseValidator')},
        ],

        showEditFormCssDialogFlag: false,
        formCssCode: '',
        cssClassList: [],

        showEditFunctionsDialogFlag: false,
        functionsCode: '',

        showWidgetEventDialogFlag: false,
        showFormEventDialogFlag: false,
        eventParamsMap: {
          'onCreated':          'onCreated() {',
          'onMounted':          'onMounted() {',
          'onClick':            'onClick() {',
          'onInput':            'onInput(value) {',
          'onChange':           'onChange(value, oldValue, subFormData, rowId) {',
          'onFocus':            'onFocus(event)',
          'onBlur':             'onBlur(event)',
          'onRemoteQuery':      'onRemoteQuery(keyword) {',
          'onBeforeUpload':     'onBeforeUpload(file) {',
          'onUploadSuccess':    'onUploadSuccess(result, file, fileList) {',
          'onUploadError':      'onUploadError(error, file, fileList) {',
          'onValidate':         'onValidate(rule, value, callback)',

          'onFormCreated':      'onFormCreated() {',
          'onFormMounted':      'onFormMounted() {',
          'onFormDataChange':   'onFormDataChange(fieldName, newValue, oldValue, formModel, subFormName, subFormRowIndex) {',
          //'onFormValidate':     'onFormValidate() {',

          'onSubFormRowAdd':      'onSubFormRowAdd(subFormData, newRowId) {',
          'onSubFormRowInsert':   'onSubFormRowInsert(subFormData, newRowId) {',
          'onSubFormRowDelete':   'onSubFormRowDelete(subFormData, deletedDataRow) {',
          'onSubFormRowChange':  'onSubFormRowChange(subFormData) {',
        },
        eventHandlerCode: '',
        formEventHandlerCode: '',
        curEventName: '',

        subFormChildWidgetFlag: false,
      }
    },
    computed: {
      optionModel: {
        get() {
          return this.selectedWidget.options
        },

        set(newValue) {
          this.selectedWidget.options = newValue
        }
      },

      minValue: {
        get() {
          return this.optionModel['min']
        },

        set(newValue) {
          //if ((!newValue && (newValue !== 0)) || isNaN(newValue)) {
          if ((newValue === undefined) || (newValue === null) || isNaN(newValue)) {
            this.optionModel.min = null
          } else {
            this.optionModel.min = Number(newValue)
          }
        }
      },

      maxValue: {
        get() {
          return this.optionModel['max']
        },

        set(newValue) {
          if (!newValue || isNaN(newValue)) {
            this.optionModel.max = null
          } else {
            this.optionModel.max = Number(newValue)
          }
        }
      },

      minLength: {
        get() {
          return this.optionModel['minLength']
        },

        set(newValue) {
          if (!newValue || isNaN(newValue)) {
            this.optionModel.minLength = null
          } else {
            this.optionModel.minLength = Number(newValue)
          }
        }
      },

      maxLength: {
        get() {
          return this.optionModel['maxLength']
        },

        set(newValue) {
          if (!newValue || isNaN(newValue)) {
            this.optionModel.maxLength = null
          } else {
            this.optionModel.maxLength = Number(newValue)
          }
        }
      },

      noLabelSetting() {
        return (this.selectedWidget.type === 'static-text') || (this.selectedWidget.type === 'html-text')
            //|| (this.selectedWidget.type === 'divider')
      },

    },
    watch: {
      'designer.selectedWidget': {
        handler(val) {
          if (!!val) {
            this.activeTab = "1"
          }
        }
      },

      'selectedWidget.options': {  //组件属性变动后，立即保存表单JSON！！
        deep: true,
        handler() {
          this.designer.saveCurrentHistoryStep()
        }
      },

      formConfig: {
        deep: true,
        handler() {
          this.designer.saveCurrentHistoryStep()
        }
      },

    },
    mounted() {
      if (!this.designer.selectedWidget) {
        this.activeTab = "2"
      } else {
        this.activeTab = "1"
      }

      this.scrollerHeight = window.innerHeight - 56 - 48 + 'px'
      addWindowResizeHandler(() => {
        this.$nextTick(() => {
          this.scrollerHeight = window.innerHeight - 56 - 48 + 'px'
          //console.log(this.scrollerHeight)
        })
      })

      this.designer.handleEvent('field-selected', (parentWidget) => {
        this.subFormChildWidgetFlag = !!parentWidget && (parentWidget.type === 'sub-form');
      })

      /* SettingPanel和FormWidget为兄弟组件, 在FormWidget加载formConfig时，
         此处SettingPanel可能无法获取到formConfig.cssCode, 故加个延时函数！ */
      setTimeout(() => {
        this.formCssCode = this.formConfig.cssCode
        insertCustomCssToHead(this.formCssCode)
        this.extractCssClass()
      }, 1200)
    },
    methods: {
      updateWidgetNameAndRef(newName) {
        let oldName = this.designer.selectedWidgetName
        if (isEmptyStr(newName)) {
          this.selectedWidget.options.name = oldName
          this.$message.info(this.i18nt('designer.hint.nameRequired'))
          return
        }

        if (!!this.designer.formWidget) {
          //检查newName是否已存在！！
          let foundRef = this.designer.formWidget.getWidgetRef(newName)
          if (!!foundRef) {
            this.selectedWidget.options.name = oldName
            this.$message.info(this.i18nt('designer.hint.duplicateName') + newName)
            return
          }

          let fieldWidget = this.designer.formWidget.getWidgetRef(oldName)
          if (!!fieldWidget && !!fieldWidget.registerToRefList) {
            fieldWidget.registerToRefList(oldName)
            this.designer.updateSelectedWidgetNameAndRef(this.selectedWidget, newName)
          }
        }
      },

      spanChanged (curGrid) {
        let spanSum = 0
        curGrid.cols.forEach((colItem) => {
          spanSum += colItem.options.span
        })
        if (spanSum > 24) {
          //this.$message.info('列栅格之和超出24')
          console.log('列栅格之和超出24')
          //TODO: 语言字符串资源化
        }

        this.updateCurrentHistoryStep()
      },

      updateCurrentHistoryStep() {
        this.designer.saveCurrentHistoryStep()
      },

      deleteCol(curGrid, colIdx) {
        this.designer.deleteColOfGrid(curGrid, colIdx)
        this.designer.emitHistoryChange()
      },

      addNewCol(curGrid) {
        this.designer.addNewColOfGrid(curGrid)
        this.designer.emitHistoryChange()
      },

      hasConfig(configName) {
        if (!this.designer || !this.designer.selectedWidget) {
          return false
        }

        return this.designer.hasConfig(this.selectedWidget, configName)
      },

      inputNumberHandler({target}) {
        target.value = target.value.replace(/[^0-9]/gi, '')
        // if (target.value === '') {
        //   target.value = null
        // } else {
        //   target.value = Number(target.value) //TODO: 为什么还是转化为字符串？？
        // }
      },

      emitDefaultValueChange() {
        if (!!this.designer) {
          if (!!this.designer.formWidget) {
            let fieldWidget = this.designer.formWidget.getWidgetRef(this.designer.selectedWidget.options.name)
            if (!!fieldWidget && !!fieldWidget.refreshDefaultValue) {
              fieldWidget.refreshDefaultValue()
            }
          }
        }
      },

      addTabPane(curTabs) {
        this.designer.addTabPaneOfTabs(curTabs)
        this.designer.emitHistoryChange()
      },

      deleteTabPane(curTabs, tpIdx) {
        if (curTabs.tabs.length === 1) {
          this.$message.info(this.i18nt('designer.hint.lastPaneCannotBeDeleted'))
          return
        }

        this.designer.deleteTabPaneOfTabs(curTabs, tpIdx)
        this.designer.emitHistoryChange()
      },

      onTabPaneActiveChange(evt, tpItem) {
        //TODO: !!!
      },

      onMultipleSelected(val) {
        if (val) {
          this.optionModel.defaultValue = []  //清空原默认值!!
        } else {
          if (!!this.optionModel.defaultValue && (this.optionModel.defaultValue.length > 0)) {
            this.optionModel.defaultValue = this.optionModel.defaultValue[0]
          } else {
            this.optionModel.defaultValue = ''
          }
        }
      },

      onRemoteChange(val) {
        if (!!val) {
          this.optionModel.filterable = true
          this.optionModel.allowCreate = false
        }
      },

      editFormCss() {
        this.formCssCode = this.designer.formConfig.cssCode
        this.showEditFormCssDialogFlag = true
      },

      extractCssClass() {
        let regExp = /\..*{/g
        let result = this.formCssCode.match(regExp)
        //this.cssClassList.length = 0
        this.cssClassList.splice(0, this.cssClassList.length)  //清除数组必须用splice，length=0不会响应式更新！！
        if (!!result && result.length > 0) {
          result.forEach((rItem) => {
            let classArray = rItem.split(',')  //切分逗号分割的多个class
            if (classArray.length > 0) {
              classArray.forEach((cItem) => {
                let caItem = cItem.trim()
                if (caItem.indexOf('.', 1) !== -1) {  //查找第二个.位置
                  let newClass = caItem.substring(caItem.indexOf('.') + 1, caItem.indexOf('.', 1))  //仅截取第一、二个.号之间的class
                  if (!!newClass) {
                    this.cssClassList.push(newClass.trim())
                  }
                } else if (caItem.indexOf(' ') !== -1) {  //查找第一个空格位置
                  let newClass = caItem.substring(caItem.indexOf('.') + 1, caItem.indexOf(' '))  //仅截取第一、二个.号之间的class
                  if (!!newClass) {
                    this.cssClassList.push(newClass.trim())
                  }
                } else {
                  if (caItem.indexOf('{') !== -1) {  //查找第一个{位置
                    let newClass = caItem.substring(caItem.indexOf('.') + 1, caItem.indexOf('{'))
                    this.cssClassList.push( newClass.trim() )
                  } else {
                    let newClass = caItem.substring(caItem.indexOf('.') + 1)
                    this.cssClassList.push( newClass.trim() )
                  }
                }
              })
            }
          })
        }
      },

      saveFormCss() {
        this.extractCssClass()
        this.designer.formConfig.cssCode = this.formCssCode
        insertCustomCssToHead(this.formCssCode)
        this.showEditFormCssDialogFlag = false
      },

      editGlobalFunctions() {
        this.functionsCode = this.designer.formConfig.functions
        this.showEditFunctionsDialogFlag = true
      },

      saveGlobalFunctions() {
        this.designer.formConfig.functions = this.functionsCode
        insertGlobalFunctionsToHtml(this.functionsCode)
        this.showEditFunctionsDialogFlag = false
      },

      editEventHandler(eventName) {
        this.curEventName = eventName
        this.eventHandlerCode = this.selectedWidget.options[eventName] || ''

        // 设置字段校验函数示例代码
        if ((eventName === 'onValidate') && (!this.optionModel['onValidate'])) {
          this.eventHandlerCode = "  /* sample code */\n  /*\n  if ((value > 100) || (value < 0)) {\n    callback(new Error('error message'))  //fail\n  } else {\n    callback();  //pass\n  }\n  */"
        }

        this.showWidgetEventDialogFlag = true
      },

      saveEventHandler() {
        this.selectedWidget.options[this.curEventName] = this.eventHandlerCode
        this.showWidgetEventDialogFlag = false
      },

      editFormEventHandler(eventName) {
        this.curEventName = eventName
        this.formEventHandlerCode = this.formConfig[eventName]
        this.showFormEventDialogFlag = true
      },

      saveFormEventHandler() {
        this.formConfig[this.curEventName] = this.formEventHandlerCode
        this.showFormEventDialogFlag = false
      },

    }
  }
</script>

<style lang="scss" scoped>
  .panel-container {
    padding: 0 8px;
  }

  .setting-scrollbar {
    ::v-deep .el-scrollbar__wrap {
      overflow-x: hidden; /* IE浏览器隐藏水平滚动条箭头！！ */
    }
  }

  .setting-collapse {
    ::v-deep .el-collapse-item__content {
      padding-bottom: 6px;
    }

    ::v-deep .el-collapse-item__header {
      font-style: italic;
      font-weight: bold;
    }
  }

  .setting-form {
    ::v-deep .el-form-item__label {
      font-size: 13px;
      //text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    ::v-deep .el-form-item--mini.el-form-item {
      margin-bottom: 6px;
    }

    .radio-group-custom {
      ::v-deep .el-radio-button__inner {
        padding-left: 12px;
        padding-right: 12px;
      }
    }
  }

  li.col-item {
    list-style: none;

    span.col-span-title {
      display: inline-block;
      font-size: 13px;
      width: 120px;
    }

    .col-delete-button {
      margin-left: 6px;
    }
  }

  /* 隐藏Chrome浏览器中el-input数字输入框右侧的上下调整小箭头 */
  ::v-deep .hide-spin-button input::-webkit-outer-spin-button,
  ::v-deep .hide-spin-button input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }

  /* 隐藏Firefox浏览器中el-input数字输入框右侧的上下调整小箭头 */
  ::v-deep .hide-spin-button input[type="number"] {
    -moz-appearance: textfield;
  }

  .custom-divider.el-divider--horizontal {
    margin: 10px 0;
  }

  .custom-divider-margin-top.el-divider--horizontal {
    margin: 20px 0;
  }

  .small-padding-dialog {
    ::v-deep .el-dialog__body {
      padding: 6px 15px 12px 15px;
    }
  }

  .panes-setting {
    ul {
      padding-inline-start: 0;
      padding-left: 0; /* 重置IE11默认样式 */
      margin: 0;
    }

    .drag-option {
      cursor: move;
    }

    li.ghost {
      background: #fff;
      border: 2px dotted $--color-primary;
    }
  }


</style>
