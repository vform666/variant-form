<template>
	<Layout class="panel-container">
		<Tabs :active-name="activeTab" style="height: 100%; overflow: hidden">
			<TabPane :label="i18nt('designer.hint.widgetSetting')" name="1">
				<Scroll class="setting-scrollbar" :height="scrollerHeight">
					<template v-if="!!designer.selectedWidget && !designer.selectedWidget.category">
						<Form :model="optionModel" size="mini" label-position="left" :labelWidth="120"
							class="setting-form" @submit.native.prevent>
							<Collapse v-model="widgetActiveCollapseNames" class="setting-collapse">
								<Panel name="1">
									{{i18nt('designer.setting.commonSetting')}}
									<div slot="content">
										<FormItem :label="i18nt('designer.setting.fieldName')" v-if="hasConfig('name')" :rules="nameRequiredRule">
											<Input type="text" v-model="optionModel.name" @change="updateWidgetNameAndRef" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.label')"
											v-if="hasConfig('label') && !noLabelSetting">
											<Input type="text" v-model="optionModel.label" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.labelAlign')"
											v-if="hasConfig('label') && !noLabelSetting && (selectedWidget.type !== 'button')">
											<RadioGroup v-model="optionModel.labelAlign" class="radio-group-custom" type="button" button-style="solid">
												<Radio label="label-left-align">
													{{i18nt('designer.setting.leftAlign')}}
												</Radio>
												<Radio label="label-center-align">
													{{i18nt('designer.setting.centerAlign')}}
												</Radio>
												<Radio label="label-right-align">
													{{i18nt('designer.setting.rightAlign')}}
												</Radio>
											</RadioGroup>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.displayType')"
											v-if="hasConfig('type')">
											<Select v-if="(selectedWidget.type === 'input')" v-model="optionModel.type">
												<Option label="text" value="text"></Option>
												<!-- 当input的type设置为number时，如果输入非数字字符，则v-model拿到的值为空字符串，无法实现输入校验！故屏蔽之！！ -->
												<Option label="number" value="number"></Option>
												<Option label="password" value="password"></Option>
												<Option label="url" value="url"></Option>
												<Option label="email" value="email"></Option>
												<Option label="date" value="date"></Option>
												<Option label="tel" value="tel"></Option>
											</Select>
											<Select v-if="(selectedWidget.type === 'date')" v-model="optionModel.type">
												<Option label="datetime" value="datetime"></Option>
												<Option label="date" value="date"></Option>
												<!-- <Option label="dates" value="dates"></Option> -->
												<Option label="year" value="year"></Option>
												<Option label="month" value="month"></Option>
												<!-- <Option label="week" value="week"></Option> -->
											</Select>
											<Select v-else-if="(selectedWidget.type === 'date-range')"
												v-model="optionModel.type">
												<Option label="daterange" value="daterange"></Option>
												<Option label="datetimerange" value="datetimerange"></Option>
												<!-- <Option label="monthrange" value="monthrange"></Option> -->
											</Select>
											<Select v-else-if="(selectedWidget.type === 'button')"
												v-model="optionModel.type">
												<Option :label="item.label" :value="item.value"  v-for="(item,index) in buttonDisplayTypes" :key="index"></Option>
											</Select>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.defaultValue')"
											v-if="hasConfig('defaultValue') && !hasConfig('optionItems')">
											<TimePicker v-if="(selectedWidget.type === 'time')"
												v-model="optionModel.defaultValue" @change="emitDefaultValueChange"
												:format="optionModel.format" value-format="HH:mm:ss"
												style="width: 100%">
											</TimePicker>
											<TimePicker v-else-if="(selectedWidget.type === 'time-range')"
												v-model="optionModel.defaultValue" is-range
												@change="emitDefaultValueChange" :format="optionModel.format"
												value-format="HH:mm:ss" style="width: 100%">
											</TimePicker>
											<DatePicker
												v-else-if="(selectedWidget.type === 'date') || (selectedWidget.type === 'date-range')"
												:type="optionModel.type" v-model="optionModel.defaultValue"
												@change="emitDefaultValueChange" :format="optionModel.format"
												:value-format="optionModel.valueFormat" style="width: 100%">
											</DatePicker>
											<iSwitch v-else-if="(selectedWidget.type === 'switch')"
												v-model="optionModel.defaultValue" @change="emitDefaultValueChange"
												active-text="true" inactive-text="false" />
											<Input type="number" v-else-if="(selectedWidget.type === 'rate')"
												v-model="optionModel.defaultValue" :min="0" :max="optionModel.max"
												style="width: 100%" @change="emitDefaultValueChange" />
											<ColorPicker v-else-if="(selectedWidget.type === 'color')"
												v-model="optionModel.defaultValue" @change="emitDefaultValueChange" />
											<Input v-else type="text" v-model="optionModel.defaultValue"
												@change="emitDefaultValueChange" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.placeholder')"
											v-if="hasConfig('placeholder')">
											<Input type="text" v-model="optionModel.placeholder" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.startPlaceholder')"
											v-if="hasConfig('startPlaceholder')">
											<Input type="text" v-model="optionModel.startPlaceholder" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.endPlaceholder')"
											v-if="hasConfig('endPlaceholder')">
											<Input type="text" v-model="optionModel.endPlaceholder" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.widgetColumnWidth')"
											v-if="hasConfig('columnWidth') && !!subFormChildWidgetFlag">
											<Input type="text" v-model="optionModel.columnWidth" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.widgetSize')"
											v-if="hasConfig('size')">
											<Select v-model="optionModel.size">
												<Option v-for="item in widgetSizes" :key="item.value"
													:label="item.label" :value="item.value">
												</Option>
											</Select>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.displayStyle')"
											v-if="hasConfig('displayStyle')">
											<RadioGroup v-model="optionModel.displayStyle">
												<Radio label="inline">{{i18nt('designer.setting.inlineLayout')}}
												</Radio>
												<Radio label="block">{{i18nt('designer.setting.blockLayout')}}</Radio>
											</RadioGroup>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.labelWidth')"
											v-if="hasConfig('labelWidth')">
											<Input type="number" v-model="optionModel.labelWidth"
												@input.native="inputNumberHandler" min="0" class="hide-spin-button" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.rows')" v-if="hasConfig('rows')">
											<Input type="number" v-model="optionModel.rows" style="width: 100%" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.labelHidden')"
											v-if="hasConfig('labelHidden')">
											<Checkbox v-model="optionModel.labelHidden"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.required')"
											v-if="hasConfig('required')">
											<Checkbox v-model="optionModel.required"></Checkbox>
										</FormItem>
										<FormItem v-if="hasConfig('validation')">
											<span slot="label">{{i18nt('designer.setting.validation')}}
												<Tooltip effect="light"
													:content="i18nt('designer.setting.validationHelp')">
													<i class="ivu-icon ivu-icon-md-information-circle"></i>
												</Tooltip>
											</span>
											<Select v-model="optionModel.validation" filterable allow-create
												default-first-option>
												<Option v-for="(fv, fvIdx) in fieldValidators" :key="fvIdx"
													:label="fv.label" :value="fv.value">
												</Option>
											</Select>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.validationHint')"
											v-if="hasConfig('validationHint')">
											<Input type="text" v-model="optionModel.validationHint" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.readonly')"
											v-if="hasConfig('readonly')">
											<Checkbox v-model="optionModel.readonly"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.disabled')"
											v-if="hasConfig('disabled')">
											<Checkbox v-model="optionModel.disabled"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.hidden')" v-if="hasConfig('hidden')">
											<Checkbox v-model="optionModel.hidden"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.textContent')"
											v-if="hasConfig('textContent')">
											<Input v-model="optionModel.textContent" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.htmlContent')"
											v-if="hasConfig('htmlContent')">
											<Input v-model="optionModel.htmlContent" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.clearable')"
											v-if="hasConfig('clearable')">
											<Checkbox v-model="optionModel.clearable"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.editable')"
											v-if="hasConfig('editable')">
											<Checkbox v-model="optionModel.editable"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.format')" v-if="hasConfig('format')">
											<Select
												v-if="(selectedWidget.type === 'time') || (selectedWidget.type === 'time-range')"
												v-model="optionModel.format" filterable allow-create>
												<Option label="HH:mm" value="HH:mm"></Option>
												<Option label="HH:mm:ss" value="HH:mm:ss"></Option>
												<Option label="HH时mm分ss秒" value="HH时mm分ss秒"></Option>
												<Option label="hh:mm:ss" value="hh:mm:ss"></Option>
											</Select>
											<Select
												v-if="(selectedWidget.type === 'date') || (selectedWidget.type === 'date-range')"
												v-model="optionModel.format" filterable allow-create>
												<Option label="yyyy" value="yyyy"></Option>
												<Option label="yyyy/MM" value="yyyy/MM"></Option>
												<Option label="yyyy/MM/dd" value="yyyy/MM/dd"></Option>
												<Option label="yyyy-MM" value="yyyy-MM"></Option>
												<Option label="yyyy-MM-dd" value="yyyy-MM-dd"></Option>												
												<Option label="MM" value="MM"></Option>
												<Option label="yyyy年" value="yyyy年"></Option>
												<Option label="yyyy年MM月" value="yyyy年MM月"></Option>
												<Option label="MM月" value="MM月"></Option>
												<Option label="yyyy年MM月dd日" value="yyyy年MM月dd日"></Option>
												<Option label="yyyy年MM月dd日 HH时mm分" value="yyyy年MM月dd日 HH时mm分"></Option>
												<Option label="yyyy年MM月dd日 HH时mm分ss秒" value="yyyy年MM月dd日 HH时mm分ss秒"></Option>
												<Option label="yyyy-MM-dd HH:mm" value="yyyy-MM-dd HH:mm"></Option>
												<Option label="yyyy-MM-dd HH:mm" value="yyyy-MM-dd HH:mm"></Option>
												<Option label="yyyy-MM-dd hh:mm:ss" value="yyyy-MM-dd hh:mm:ss"></Option>
											</Select>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.valueFormat')"
											v-if="hasConfig('valueFormat')">
											<Select
												v-if="(selectedWidget.type === 'date') || (selectedWidget.type === 'date-range')"
												v-model="optionModel.valueFormat" filterable allow-create>
												<Option label="yyyy-MM-dd" value="yyyy-MM-dd"></Option>
												<Option label="yyyy-MM-dd HH:mm:ss" value="yyyy-MM-dd HH:mm:ss">
												</Option>
											</Select>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.showPassword')"
											v-if="hasConfig('showPassword') && (optionModel.type === 'password')">
											<Checkbox v-model="optionModel.showPassword"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.filterable')"
											v-if="hasConfig('filterable')">
											<Checkbox v-model="optionModel.filterable"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.allowCreate')"
											v-if="hasConfig('allowCreate')">
											<Checkbox v-model="optionModel.allowCreate"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.remote')" v-if="hasConfig('remote')">
											<Checkbox v-model="optionModel.remote" @change="onRemoteChange">
											</Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.automaticDropdown')"
											v-if="hasConfig('automaticDropdown')">
											<Checkbox v-model="optionModel.automaticDropdown"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.multiple')"
											v-if="hasConfig('multiple')">
											<Checkbox v-model="optionModel.multiple" @change="onMultipleSelected">
											</Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.multipleLimit')"
											v-if="hasConfig('multipleLimit')">
											<Input type="number" v-model="optionModel.multipleLimit" :min="0"
												class="hide-spin-button" style="width: 100%" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.contentPosition')"
											v-if="hasConfig('contentPosition')">
											<Select v-model="optionModel.contentPosition">
												<Option label="center" value="center"></Option>
												<Option label="left" value="left"></Option>
												<Option label="right" value="right"></Option>
											</Select>
										</FormItem>
										
										<FormItem :label-width="0" v-if="hasConfig('optionItems')">
											<Divider size="small" class="custom-divider-margin-top">
												{{i18nt('designer.setting.optionsSetting')}}
											</Divider>
											<option-items-setting :designer="designer"
												:selected-widget="designer.selectedWidget"></option-items-setting>
										</FormItem>
										
										<FormItem :label-width="0" v-if="hasConfig('uploadURL')">
											<Divider size="small" class="custom-divider">{{i18nt('designer.setting.uploadSetting')}}
											</Divider>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.uploadURL')"
											v-if="hasConfig('uploadURL')">
											<Input type="text" v-model="optionModel.uploadURL" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.uploadTip')"
											v-if="hasConfig('uploadTip')">
											<Input type="text" v-model="optionModel.uploadTip" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.withCredentials')"
											v-if="hasConfig('withCredentials')">
											<Checkbox v-model="optionModel.withCredentials"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.multipleSelect')"
											v-if="hasConfig('multipleSelect')">
											<Checkbox v-model="optionModel.multipleSelect"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.showFileList')"
											v-if="hasConfig('showFileList')">
											<Checkbox v-model="optionModel.showFileList"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.limit')" v-if="hasConfig('limit')">
											<Input type="number" v-model="optionModel.limit" :min="1"
												class="hide-spin-button" style="width: 100%" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.fileMaxSize')"
											v-if="hasConfig('fileMaxSize')">
											<Input type="number" v-model="optionModel.fileMaxSize" :min="1"
												class="hide-spin-button" style="width: 100%" />
										</FormItem>
										<FormItem
											v-if="hasConfig('fileAccept') && (selectedWidget.type === 'picture-upload')">
											<span slot="label">{{i18nt('designer.setting.fileAccept')}}
												<Tooltip
													:content="i18nt('designer.setting.fileTypesHelp')">
													<i class="ivu-icon ivu-icon-md-information-circle"></i>
												</Tooltip>
											</span>
											<Select multiple allow-create filterable default-first-option
												v-model="optionModel.fileAccept" style="width: 100%">
												<Option v-for="(ft, ftIdx) in uploadPictureAccept" :key="ftIdx"
													:label="ft.label" :value="ft.value">
												</Option>
											</Select>
										</FormItem>
										<FormItem
											v-if="hasConfig('fileTypes') && (selectedWidget.type === 'picture-upload')">
											<span slot="label">{{i18nt('designer.setting.fileTypes')}}
												<Tooltip
													:content="i18nt('designer.setting.fileTypesHelp')">
													<i class="ivu-icon ivu-icon-md-information-circle"></i>
												</Tooltip>
											</span>
											<Select multiple allow-create filterable default-first-option
												v-model="optionModel.fileTypes" style="width: 100%">
												<Option v-for="(ft, ftIdx) in uploadPictureTypes" :key="ftIdx"
													:label="ft.label" :value="ft.value">
												</Option>
											</Select>
										</FormItem>
										<FormItem
											v-if="hasConfig('fileAccept') && (selectedWidget.type === 'file-upload')">
											<span slot="label">{{i18nt('designer.setting.fileAccept')}}
												<Tooltip
													:content="i18nt('designer.setting.fileTypesHelp')">
													<i class="ivu-icon ivu-icon-md-information-circle"></i>
												</Tooltip>
											</span>
											<Select multiple allow-create filterable default-first-option
												v-model="optionModel.fileAccept" style="width: 100%">
												<Option v-for="(ft, ftIdx) in uploadFileAccept" :key="ftIdx"
													:label="ft.label" :value="ft.value">
												</Option>
											</Select>
										</FormItem>
										<FormItem
											v-if="hasConfig('fileTypes') && (selectedWidget.type === 'file-upload')">
											<span slot="label">{{i18nt('designer.setting.fileTypes')}}
												<Tooltip
													:content="i18nt('designer.setting.fileTypesHelp')">
													<i class="ivu-icon ivu-icon-md-information-circle"></i>
												</Tooltip>
											</span>
											<Select multiple allow-create filterable default-first-option
												v-model="optionModel.fileTypes" style="width: 100%">
												<Option v-for="(ft, ftIdx) in uploadFileTypes" :key="ftIdx"
													:label="ft.label" :value="ft.value">
												</Option>
											</Select>
										</FormItem>
									</div>
								</Panel>

								<Panel name="2">
									{{i18nt('designer.setting.advancedSetting')}}
									<div slot="content">
										<FormItem :label="i18nt('designer.setting.minValue')" v-if="hasConfig('min')">
											<Input type="number" v-model="minValue" class="hide-spin-button"
												style="width: 100%" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.maxValue')"
											v-if="hasConfig('max') && (selectedWidget.type !== 'rate')">
											<Input type="number" v-model="maxValue" class="hide-spin-button"
												style="width: 100%" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.precision')"
											v-if="hasConfig('precision')">
											<Input type="number" v-model="optionModel.precision" :min="0"
												class="hide-spin-button" style="width: 100%" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.formatter')"
											v-if="hasConfig('formatter')">
											<Input type="text" v-model="optionModel.formatter"
												class="hide-spin-button" style="width: 100%" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.step')" v-if="hasConfig('step')">
											<Input type="number" v-model="optionModel.step" class="hide-spin-button"
												style="width: 100%" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.controlsPosition')"
											v-if="hasConfig('controlsPosition')">
											<Select v-model="optionModel.controlsPosition">
												<Option label="default" value="default"></Option>
												<Option label="right" value="right"></Option>
											</Select>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.minLength')"
											v-if="hasConfig('minLength')">
											<Input type="number" @input.native="inputNumberHandler"
												class="hide-spin-button" min="0" v-model="minLength"
												style="width: 100%" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.maxLength')"
											v-if="hasConfig('maxLength')">
											<Input type="number" @input.native="inputNumberHandler"
												class="hide-spin-button" min="1" v-model="maxLength"
												style="width: 100%" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.showWordLimit')"
											v-if="hasConfig('showWordLimit')">
											<Checkbox v-model="optionModel.showWordLimit"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.prefixIcon')"
											v-if="hasConfig('prefixIcon')">
											<Input type="text" v-model="optionModel.prefixIcon" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.suffixIcon')"
											v-if="hasConfig('suffixIcon')">
											<Input type="text" v-model="optionModel.suffixIcon" />
										</FormItem>
										
																				
										<FormItem :label="i18nt('designer.setting.activeText')"
											v-if="hasConfig('activeText')">
											<Input type="text" v-model="optionModel.activeText" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.inactiveText')"
											v-if="hasConfig('inactiveText')">
											<Input type="text" v-model="optionModel.inactiveText" />
										</FormItem>
										
										
										
										<FormItem :label="i18nt('designer.setting.activeText')"
											v-if="hasConfig('activeText')">
											<Input type="text" v-model="optionModel.activeText" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.inactiveText')"
											v-if="hasConfig('inactiveText')">
											<Input type="text" v-model="optionModel.inactiveText" />
										</FormItem>
										
										
										
										<FormItem :label="i18nt('designer.setting.activeColor')"
											v-if="hasConfig('activeColor')">
											<ColorPicker  v-model="optionModel.activeColor"></ColorPicker >
										</FormItem>
										<FormItem :label="i18nt('designer.setting.inactiveColor')"
											v-if="hasConfig('inactiveColor')">
											<ColorPicker  v-model="optionModel.inactiveColor"></ColorPicker >
										</FormItem>
										<FormItem :label="i18nt('designer.setting.maxStars')"
											v-if="hasConfig('max') && (selectedWidget.type === 'rate')">
											<Input type="number" v-model="optionModel.max" :min="1" :max="10"
												class="hide-spin-button" style="width: 100%" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.lowThreshold')"
											v-if="hasConfig('lowThreshold')">
											<Input type="number" v-model="optionModel.lowThreshold" :min="1"
												:max="optionModel.highThreshold" class="hide-spin-button"
												style="width: 100%" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.highThreshold')"
											v-if="hasConfig('highThreshold')">
											<Input type="number" v-model="optionModel.highThreshold"
												:min="optionModel.lowThreshold" :max="optionModel.max"
												class="hide-spin-button" style="width: 100%" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.allowHalf')"
											v-if="hasConfig('allowHalf')">
											<Checkbox v-model="optionModel.allowHalf"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.showText')"
											v-if="hasConfig('showText')">
											<Checkbox v-model="optionModel.showText"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.showScore')"
											v-if="hasConfig('showScore')">
											<Checkbox v-model="optionModel.showScore"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.showScore')"
											v-if="hasConfig('showScore')">
											<Checkbox v-model="optionModel.showScore"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.showScore')"
											v-if="hasConfig('showScore')">
											<Checkbox v-model="optionModel.showScore"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.range')" v-if="hasConfig('range')">
											<Checkbox v-model="optionModel.range"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.direction')"
											v-if="hasConfig('direction')">
											<Checkbox v-model="optionModel.direction" true-value="horizontal" false-value="vertical"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.plain')" v-if="hasConfig('plain')">
											<Checkbox v-model="optionModel.plain"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.round')" v-if="hasConfig('round')">
											<Checkbox v-model="optionModel.round"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.circle')" v-if="hasConfig('circle')">
											<Checkbox v-model="optionModel.circle"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.buttonIcon')"
											v-if="hasConfig('icon')">
											<Input type="text" v-model="optionModel.icon" />
										</FormItem>
										
										<FormItem :label="i18nt('designer.setting.customClass')"
											v-if="!!selectedWidget.options">
											<Select v-model="optionModel.customClass" multiple filterable allow-create
												default-first-option>
												<Option v-for="(item, idx) in cssClassList" :key="idx" :label="item"
													:value="item"></Option>
											</Select>
										</FormItem>
										
										<FormItem :label-width="0" v-if="hasConfig('labelIconClass')">
											<Divider size="small" class="custom-divider">
												{{i18nt('designer.setting.customLabelIcon')}}
											</Divider>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.labelIconClass')"
											v-if="hasConfig('labelIconClass')">
											<Input type="text" v-model="optionModel.labelIconClass" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.labelIconPosition')"
											v-if="hasConfig('labelIconPosition')">
											<Select v-model="optionModel.labelIconPosition">
												<Option v-for="item in labelIconPosition" :key="item.value"
													:label="item.label" :value="item.value">
												</Option>
											</Select>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.labelTooltip')"
											v-if="hasConfig('labelTooltip')">
											<Input type="text" v-model="optionModel.labelTooltip" />
										</FormItem>
									
										<FormItem :label="i18nt('designer.setting.appendControlText')" v-if="hasConfig('appendControlText')">
											<Input type="text" v-model="optionModel.appendControlText" />
										</FormItem>
										
										<FormItem :label="i18nt('designer.setting.appendButtonText')"
											v-if="hasConfig('appendButtonText')">
											<Input type="text" v-model="optionModel.appendButtonText" />
										</FormItem>
										
										<!-- 按钮跳转模式 -->
										<FormItem :label="i18nt('designer.setting.to')" v-if="hasConfig('to')">
											<Input type="text" v-model="optionModel.to" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.target')" v-if="hasConfig('target')">
											<Input type="text" v-model="optionModel.target" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.replace')" v-if="hasConfig('replace')">
											<Checkbox v-model="optionModel.replace"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.append')" v-if="hasConfig('append')">
											<Checkbox v-model="optionModel.append"></Checkbox>
										</FormItem>
									</div>
								</Panel>

								<Panel name="3">
									{{i18nt('designer.setting.eventSetting')}}
									<div slot="content">
										<FormItem label="onCreated" :labelWidth="180" v-if="hasConfig('onCreated')">
											<Button type="info" icon="md-create" plain round
												@click="editEventHandler('onCreated')">
												{{i18nt('designer.setting.addEventHandler')}}
											</Button>
										</FormItem>
										<FormItem label="onMounted" :labelWidth="180" v-if="hasConfig('onMounted')">
											<Button type="info" icon="md-create" plain round
												@click="editEventHandler('onMounted')">
												{{i18nt('designer.setting.addEventHandler')}}
											</Button>
										</FormItem>
										<FormItem label="onClick" :labelWidth="180" v-if="hasConfig('onClick')">
											<Button type="info" icon="md-create" plain round
												@click="editEventHandler('onClick')">
												{{i18nt('designer.setting.addEventHandler')}}
											</Button>
										</FormItem>
										<FormItem label="onRemoteQuery" :labelWidth="180" v-if="hasConfig('onRemoteQuery')">
											<Button type="info" icon="md-create" plain round
												@click="editEventHandler('onRemoteQuery')">
												{{i18nt('designer.setting.addEventHandler')}}
											</Button>
										</FormItem>
										<FormItem label="onInput" :labelWidth="180" v-if="hasConfig('onInput')">
											<Button type="info" icon="md-create" plain round
												@click="editEventHandler('onInput')">
												{{i18nt('designer.setting.addEventHandler')}}
											</Button>
										</FormItem>
										<FormItem label="onChange" :labelWidth="180" v-if="hasConfig('onChange')">
											<Button type="info" icon="md-create" plain round
												@click="editEventHandler('onChange')">
												{{i18nt('designer.setting.addEventHandler')}}
											</Button>
										</FormItem>
										<FormItem label="onFocus" :labelWidth="180" v-if="hasConfig('onFocus')">
											<Button type="info" icon="md-create" plain round
												@click="editEventHandler('onFocus')">
												{{i18nt('designer.setting.addEventHandler')}}
											</Button>
										</FormItem>
										<FormItem label="onBlur" :labelWidth="180" v-if="hasConfig('onBlur')">
											<Button type="info" icon="md-create" plain round
												@click="editEventHandler('onBlur')">
												{{i18nt('designer.setting.addEventHandler')}}
											</Button>
										</FormItem>
										<FormItem label="onBeforeUpload" :labelWidth="180" v-if="hasConfig('onBeforeUpload')">
											<Button type="info" icon="md-create" plain round
												@click="editEventHandler('onBeforeUpload')">
												{{i18nt('designer.setting.addEventHandler')}}
											</Button>
										</FormItem>
										<FormItem label="onUploadSuccess" :labelWidth="180" v-if="hasConfig('onUploadSuccess')">
											<Button type="info" icon="md-create" plain round
												@click="editEventHandler('onUploadSuccess')">
												{{i18nt('designer.setting.addEventHandler')}}
											</Button>
										</FormItem>
										<FormItem label="onUploadError" :labelWidth="180" v-if="hasConfig('onUploadError')">
											<Button type="info" icon="md-create" plain round
												@click="editEventHandler('onUploadError')">
												{{i18nt('designer.setting.addEventHandler')}}
											</Button>
										</FormItem>
										<FormItem label="onUploadPreview" :labelWidth="180" v-if="hasConfig('onUploadPreview')">
											<Button type="info" icon="md-create" plain round
												@click="editEventHandler('onUploadPreview')">
												{{i18nt('designer.setting.addEventHandler')}}
											</Button>
										</FormItem>
										<FormItem label="onUploadProgress" :labelWidth="180" v-if="hasConfig('onUploadProgress')">
											<Button type="info" icon="md-create" plain round
												@click="editEventHandler('onUploadProgress')">
												{{i18nt('designer.setting.addEventHandler')}}
											</Button>
										</FormItem>
										<FormItem label="onValidate" :labelWidth="180" v-if="hasConfig('onValidate')">
											<Button type="info" icon="md-create" plain round
												@click="editEventHandler('onValidate')">
												{{i18nt('designer.setting.addEventHandler')}}
											</Button>
										</FormItem>
									</div>
								</Panel>
							
							</Collapse>
						</Form>
					</template>

					<template v-if="(!!designer.selectedWidget && !!designer.selectedWidget.category)">

						<Collapse v-model="widgetActiveCollapseNames" class="setting-collapse">
							<Panel name="1">
								{{i18nt('designer.setting.commonSetting')}}
								<div slot="content">
									<Form :model="optionModel" size="mini" label-position="left" :labelWidth="120"
										class="setting-form" @submit.native.prevent>
										<FormItem :label="i18nt('designer.setting.widgetName')"
											v-if="hasConfig('name')">
											<Input type="text" v-model="optionModel.name" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.labelAlign')"
											v-if="hasConfig('labelAlign')">
											<RadioGroup v-model="optionModel.labelAlign" class="radio-group-custom" type="button" button-style="solid">
												<Radio label="label-left-align">
													{{i18nt('designer.setting.leftAlign')}}
												</Radio>
												<Radio label="label-center-align">
													{{i18nt('designer.setting.centerAlign')}}
												</Radio>
												<Radio label="label-right-align">
													{{i18nt('designer.setting.rightAlign')}}
												</Radio>
											</RadioGroup>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.showBlankRow')"
											v-if="hasConfig('showBlankRow')">
											<Checkbox v-model="optionModel.showBlankRow"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.showRowNumber')"
											v-if="hasConfig('showRowNumber')">
											<Checkbox v-model="optionModel.showRowNumber"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.hidden')" v-if="hasConfig('hidden')">
											<Checkbox v-model="optionModel.hidden"></Checkbox>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.cellWidth')"
											v-if="hasConfig('cellWidth')">
											<Input type="text" v-model="optionModel.cellWidth" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.cellHeight')"
											v-if="hasConfig('cellHeight')">
											<Input type="text" v-model="optionModel.cellHeight" />
										</FormItem>
										<FormItem :label="i18nt('designer.setting.customClass')"
											v-if="!!selectedWidget.options">
											<Select v-model="optionModel.customClass" multiple filterable allow-create
												default-first-option>
												<Option v-for="(item, idx) in cssClassList" :key="idx" :label="item"
													:value="item"></Option>
											</Select>
										</FormItem>
										<FormItem :label-width="0" v-if="hasConfig('gutter')">
											<Divider size="small" class="custom-divider">{{i18nt('designer.setting.columnSetting')}}
											</Divider>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.gutter')" v-if="hasConfig('gutter')">
											<Input type="number" v-model="optionModel.gutter" style="width: 100%" />
										</FormItem>
									</Form>

									<Form :model="optionModel" size="mini" v-if="selectedWidget.type === 'grid'"
										label-position="top" class="setting-form" @submit.native.prevent>
										<FormItem :label="i18nt('designer.setting.colsOfGrid')">
											<li v-for="(colItem, colIdx) in selectedWidget.cols" :key="colIdx"
												class="col-item">
												<span
													class="col-span-title">{{i18nt('designer.setting.colSpanTitle')}}{{colIdx + 1}}</span>
												<Input type="number" v-model.number="colItem.options.span" :min="1"
													:max="24"
													@change="(newValue, oldValue) => spanChanged(selectedWidget, colItem, colIdx, newValue, oldValue)"
													class="cell-span-input" />
												<Button shape="circle" type="warning"
													@click="deleteCol(selectedWidget, colIdx)" icon="md-close"
													class="col-delete-button"></Button>
											</li>
											<div>
												<Button type="default" @click="addNewCol(selectedWidget)">
													{{i18nt('designer.setting.addColumn')}}
												</Button>
											</div>
										</FormItem>
									</Form>

									<Form :model="optionModel" size="small" v-if="selectedWidget.type === 'grid-col'"
										label-position="left" :labelWidth="120" class="setting-form" @submit.native.prevent>
										<FormItem :label="i18nt('designer.setting.colSpanTitle')">
											<Input type="number" v-model.number="optionModel.span" :min="1" :max="24"
												style="width: 100%" />
										</FormItem>
									</Form>
									<Form :model="optionModel" size="small" v-if="selectedWidget.type === 'tab'" 
										label-position="left" :labelWidth="120" 
										class="setting-form panes-setting" @submit.native.prevent>
										<FormItem :label="i18nt('designer.setting.tabPaneType')" v-if="hasConfig('displayType')">
											<Select v-model="optionModel.displayType">
												<Option v-for="item in tabPaneType" :key="item.value"
													:label="item.label" :value="item.value">
												</Option>
											</Select>
										</FormItem>
										<FormItem :label="i18nt('designer.setting.widgetSize')" v-if="hasConfig('size')&&optionModel.displayType=='line'">
											<Select v-model="optionModel.size">
												<Option v-for="item in widgetSizes2" :key="item.value"
													:label="item.label" :value="item.value">
												</Option>
											</Select>
										</FormItem>
										<FormItem :label-width="0">
										<Divider size="small" class="custom-divider-margin-top">
											{{i18nt('designer.setting.tabPaneSetting')}}
										</Divider>
										</FormItem>
										<FormItem :label-width="0">
											<draggable tag="ul" :list="selectedWidget.tabs"
												v-bind="{group:'panesGroup', ghostClass: 'ghost', handle: '.drag-option'}">
												<li v-for="(tpItem, tpIdx) in selectedWidget.tabs" :key="tpIdx"
													class="col-item">
													<!-- <span style="margin-right: 12px">{{tpIdx + 1}}</span> -->
													<Checkbox v-model="tpItem.options.disabled"
														@change="(evt) => onTabPaneActiveChange(evt, tpItem)"
														style="margin-right: 8px">
														{{i18nt('designer.setting.paneDisabled')}}
													</Checkbox>
													<Input type="text" v-model="tpItem.options.label" style="width: 155px" />
													<i class="iconfont icon-drag drag-option"></i>
													<Button shape='circle' size="small" type="warning"
														@click="deleteTabPane(selectedWidget, tpIdx)"
														icon="md-remove" class="col-delete-button"></Button>
												</li>
												<div>
													<Button type="text" @click="addTabPane(selectedWidget)" icon="md-add">
														{{i18nt('designer.setting.addTabPane')}}
													</Button>
												</div>
											</draggable>
										</FormItem>
									</Form>
								</div>
							</Panel>

							<Panel name="3">
								{{i18nt('designer.setting.eventSetting')}}
								<div slot="content">
									<Form :model="optionModel" size="mini" label-position="left" :labelWidth="150"
										class="setting-form" @submit.native.prevent>
										<FormItem label="onSubFormRowAdd" :labelWidth="180" v-if="hasConfig('onSubFormRowAdd')">
											<Button type="info" icon="el-icon-edit" plain round
												@click="editEventHandler('onSubFormRowAdd')">
												{{i18nt('designer.setting.addEventHandler')}}
											</Button>
										</FormItem>
										<FormItem label="onSubFormRowInsert" :labelWidth="180" v-if="hasConfig('onSubFormRowInsert')">
											<Button type="info" icon="el-icon-edit" plain round
												@click="editEventHandler('onSubFormRowInsert')">
												{{i18nt('designer.setting.addEventHandler')}}
											</Button>
										</FormItem>
										<FormItem label="onSubFormRowDelete" :labelWidth="180" v-if="hasConfig('onSubFormRowDelete')">
											<Button type="info" icon="el-icon-edit" plain round
												@click="editEventHandler('onSubFormRowDelete')">
												{{i18nt('designer.setting.addEventHandler')}}
											</Button>
										</FormItem>
										<FormItem label="onSubFormRowChange" :labelWidth="180" v-if="hasConfig('onSubFormRowChange')">
											<Button type="info" icon="el-icon-edit" plain round
												@click="editEventHandler('onSubFormRowChange')">
												{{i18nt('designer.setting.addEventHandler')}}
											</Button>
										</FormItem>
									</Form>
								</div>
							</Panel>
						</Collapse>

					</template>

				</Scroll>
			</TabPane>

			<TabPane v-if="!!designer" :label="i18nt('designer.hint.formSetting')" name="2">
				<Form :model="formConfig" size="mini" label-position="left" :labelWidth="120" class="setting-form" @submit.native.prevent>
					<Collapse v-model="formActiveCollapseNames" class="setting-collapse">
						<Panel name="1">
							{{i18nt('designer.setting.basicSetting')}}
							<div slot="content">
								<FormItem :label="i18nt('designer.setting.formSize')">
									<Select v-model="formConfig.size">
										<Option v-for="item in formSizes" :key="item.value" :label="item.label"
											:value="item.value">
										</Option>
									</Select>
								</FormItem>
								<FormItem :label="i18nt('designer.setting.labelPosition')">
									<RadioGroup v-model="formConfig.labelPosition" class="radio-group-custom" type="button" button-style="solid">
										<Radio label="left">{{i18nt('designer.setting.leftPosition')}}
										</Radio>
										<Radio label="top">{{i18nt('designer.setting.topPosition')}}
										</Radio>
									</RadioGroup>
								</FormItem>
								<FormItem :label="i18nt('designer.setting.labelAlign')">
									<RadioGroup v-model="formConfig.labelAlign" class="radio-group-custom" type="button" button-style="solid">
										<Radio label="label-left-align">{{i18nt('designer.setting.leftAlign')}}
										</Radio>
										<Radio label="label-center-align">
											{{i18nt('designer.setting.centerAlign')}}
										</Radio>
										<Radio label="label-right-align">{{i18nt('designer.setting.rightAlign')}}
										</Radio>
									</RadioGroup>
								</FormItem>
								<FormItem :label="i18nt('designer.setting.labelWidth')">
									<Input type="number" v-model="formConfig.labelWidth" :min="0" style="width: 100%" />
								</FormItem>
								<FormItem :label="i18nt('designer.setting.formCss')" :labelWidth="180">
									<Button type="info" icon="md-create" @click="editFormCss">
										{{i18nt('designer.setting.addCss')}}
									</Button>
								</FormItem>
								<!-- -->
								<FormItem :label="i18nt('designer.setting.customClass')">
									<Select v-model="formConfig.customClass" multiple filterable allow-create
										default-first-option>
										<Option v-for="(item, idx) in cssClassList" :key="idx" :label="item"
											:value="item"></Option>
									</Select>
								</FormItem>
								<!-- -->
								<FormItem :label="i18nt('designer.setting.globalFunctions')" :labelWidth="180">
									<Button type="info" icon="md-create" @click="editGlobalFunctions">
										{{i18nt('designer.setting.addEventHandler')}}
									</Button>
								</FormItem>
							</div>
						</Panel>

						<Panel name="2" :title="i18nt('designer.setting.eventSetting')">
							{{i18nt('designer.setting.eventSetting')}}
							<div slot="content">
								<FormItem label="onFormCreated" :labelWidth="180">
									<Button type="info" icon="md-create"
										@click="editFormEventHandler('onFormCreated')">
										{{i18nt('designer.setting.addEventHandler')}}
									</Button>
								</FormItem>
								<FormItem label="onFormMounted" :labelWidth="180">
									<Button type="info" icon="md-create" 
										@click="editFormEventHandler('onFormMounted')">
										{{i18nt('designer.setting.addEventHandler')}}
									</Button>
								</FormItem>
								<!-- -->
								<FormItem label="onFormDataChange" :labelWidth="180">
									<Button type="info" icon="md-create" 
										@click="editFormEventHandler('onFormDataChange')">
										{{i18nt('designer.setting.addEventHandler')}}
									</Button>
								</FormItem>
								<!-- -->
								<!--
              <FormItem label="onFormValidate">
                <Button type="info" icon="el-icon-edit" plain round @click="editFormEventHandler('onFormValidate')">
                  {{i18nt('designer.setting.addEventHandler')}}</Button>
              </FormItem>
              -->
							</div>
						</Panel>
					</Collapse>
				</Form>
			</TabPane>
		</Tabs>

		<Modal :title="i18nt('designer.setting.editWidgetEventHandler')" v-model="showWidgetEventDialogFlag" :closable="true" 
			width="800" class="small-padding-dialog" draggable :mask-closable="false">
			<!-- <Alert :closable="false">{{(optionModel?optionModel.name:'') + '.' + eventParamsMap[curEventName]}}</Alert> -->
			<div class="codeEditTip">{{(optionModel?optionModel.name:'') + '.' + eventParamsMap[curEventName]}}</div>
			<code-editor v-if="showWidgetEventDialogFlag" :mode="'javascript'" :readonly="false" v-model="eventHandlerCode"></code-editor>
			<div class="codeEditTip">}</div>
			<div slot="footer" class="dialog-footer">
				<Button size="default" @click="showWidgetEventDialogFlag = false">
					{{i18nt('designer.hint.cancel')}}
				</Button>
				<Button size="default" type="primary" @click="saveEventHandler">
					{{i18nt('designer.hint.confirm')}}
				</Button>
			</div>
		</Modal>

		<Modal :title="i18nt('designer.setting.editFormEventHandler')"
			v-model="showFormEventDialogFlag" :closable="true" class="small-padding-dialog" width="800" draggable
			:mask-closable="false">
			<div class="codeEditTip">{{'form.' + eventParamsMap[curEventName]}}</div>
			<code-editor v-if="showFormEventDialogFlag" :mode="'javascript'" :readonly="false" v-model="formEventHandlerCode"></code-editor>
			<div class="codeEditTip">}</div>
			<div slot="footer" class="dialog-footer">
				<Button size="default" @click="showFormEventDialogFlag = false">
					{{i18nt('designer.hint.cancel')}}
				</Button>
				<Button size="default" type="primary" @click="saveFormEventHandler">
					{{i18nt('designer.hint.confirm')}}
				</Button>
			</div>
		</Modal>

		<Modal :title="i18nt('designer.setting.formCss')"
			v-model="showEditFormCssDialogFlag" :closable="true" class="small-padding-dialog" width="800" draggable
			:mask-closable="false">
			<code-editor v-if="showEditFormCssDialogFlag" :mode="'css'" :readonly="false" v-model="formCssCode"></code-editor>
			<div slot="footer" class="dialog-footer">
				<Button size="default" @click="showEditFormCssDialogFlag = false">
					{{i18nt('designer.hint.cancel')}}
				</Button>
				<Button size="default" type="primary" @click="saveFormCss">
					{{i18nt('designer.hint.confirm')}}
				</Button>
			</div>
		</Modal>

		<Modal :title="i18nt('designer.setting.globalFunctions')"
			v-model="showEditFunctionsDialogFlag" :closable="true" class="small-padding-dialog" width="800" draggable
			:mask-closable="false">
			<code-editor v-if="showEditFunctionsDialogFlag" :mode="'javascript'" :readonly="false" v-model="functionsCode"></code-editor>
			<div slot="footer" class="dialog-footer">
				<Button size="default" @click="showEditFunctionsDialogFlag = false">
					{{i18nt('designer.hint.cancel')}}
				</Button>
				<Button size="default" type="primary" @click="saveGlobalFunctions">
					{{i18nt('designer.hint.confirm')}}
				</Button>
			</div>
		</Modal>
	</Layout>
</template>

<script>
	import Draggable from 'vuedraggable'
	import CodeEditor from '../../code-editor/index'
	import OptionItemsSetting from "../setting-panel/option-items-setting";
	import {
		addWindowResizeHandler,
		deepClone,
		insertCustomCssToHead,
		insertGlobalFunctionsToHtml,
		isEmptyStr
	} from "@/utils/util";
	import i18n from "../../utils/i18n.js";

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

				nameRequiredRule: [{
					required: true,
					message: 'name required'
				}],

				activeTab: "2",
				widgetActiveCollapseNames: ['1', '3'], //['1', '2', '3'],
				formActiveCollapseNames: ['1', '2'],
				displayTypes: [{
						label: 'text',
						value: 'text'
					},
					{
						label: 'number',
						value: 'number'
					},
					{
						label: 'password',
						value: 'password'
					},
					{
						label: 'url',
						value: 'url'
					},
					{
						label: 'email',
						value: 'email'
					},
					{
						label: 'date',
						value: 'date'
					},
					{
						label: 'tel',
						value: 'tel'
					}
				],
				widgetSizes: [{
						label: 'default',
						value: '',
					},
					{
						label: 'large',
						value: 'large'
					},
					{
						label: 'small',
						value: 'small'
					}
				],
				widgetSizes2: [{
						label: 'default',
						value: 'default',
					},
					{
						label: 'small',
						value: 'small'
					}
				],
				tabPaneType:[{
						label: 'card',
						value: 'card',
					},
					{
						label: 'line',
						value: 'line'
					}
				],
				formSizes: [{
						label: 'default',
						value: ''
					},
					{
						label: 'large',
						value: 'large'
					},
					{
						label: 'small',
						value: 'small'
					}
				],
				inputControlType:[
					{
						label:'按钮',
						value:'button'
					},
					// {
					// 	label:'下拉框',
					// 	value:'select'
					// },
					{
						label:'文本',
						value:'div'
					},
				],
				buttonDisplayTypes:[{
					label:'primary',
					value:'primary'
				},{
					label:'default',
					value:'default'
				},{
					label:'success',
					value:'success'
				},{
					label:'warning',
					value:'warning'
				},{
					label:'error',
					value:'error'
				},{
					label:'dashed',
					value:'dashed'
				},{
					label:'info',
					value:'info'
				},{
					label:'text',
					value:'text'
				}],
				labelIconPosition: [{
						label: 'front',
						value: 'front'
					},
					{
						label: 'rear',
						value: 'rear'
					},
				],

				uploadPictureAccept: [
					{
						label: 'JPG',
						value: 'image/jpg,image/jpeg'
					},
					{
						label: 'PNG',
						value: 'image/png'
					},
					{
						label: 'GIF',
						value: 'image/gif'
					},
					{
						label: 'BMP',
						value: 'image/bmp'
					},
					{
						label: 'WEBP',
						value: 'image/webp'
					},
				],
				uploadPictureTypes: [
					{
						value: 'jpeg',
						label: 'JPG'
					},
					{
						value: 'png',
						label: 'PNG'
					},
					{
						value: 'gif',
						label: 'GIF'
					},
					{
						value: 'bmp',
						label: 'BMP'
					},
					{
						value: 'webp',
						label: 'WEBP'
					},
				],
				uploadFileAccept: [
					{
						label: '图片文件',
						value: '.jpg,.jpeg,.png,.gif,image/bmp,image/webp'
					},
					{
						label: '压缩文件',
						value: '.zip,.rar,.7z,.gz,.tar'
					},
					{
						label: 'WORD文档',
						value: '.doc,.docx'
					},
					{
						label: 'EXCEL文档',
						value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
					},
					{
						label: 'PPT文档',
						value: '.ppt,.pptx'
					}
				],
				uploadFileTypes: [
					{
						value: 'jpeg',
						label: 'JPG'
					},
					{
						value: 'png',
						label: 'PNG'
					},
					{
						value: 'gif',
						label: 'GIF'
					},
					{
						value: 'bmp',
						label: 'BMP'
					},
					{
						value: 'webp',
						label: 'WEBP'
					},
					{
						value: 'doc',
						label: 'doc'
					},
					{
						value: 'xls',
						label: 'xls'
					},
					{
						value: 'docx',
						label: 'docx'
					},
					{
						value: 'xlsx',
						label: 'xlsx'
					},
					{
						value: 'ppt',
						label: 'ppt'
					},
					{
						value: 'pptx',
						label: 'pptx'
					},
					{
						value: 'zip',
						label: 'zip'
					},
					{
						value: 'rar',
						label: 'rar'
					},
					{
						value: '7z',
						label: '7z'
					},
					{
						value: 'gz',
						label: 'gz'
					},
					{
						value: 'tar',
						label: 'tar'
					},
				],

				fieldValidators: [{
						value: 'number',
						label: this.i18nt('designer.hint.numberValidator')
					},
					{
						value: 'letter',
						label: this.i18nt('designer.hint.letterValidator')
					},
					{
						value: 'letterAndNumber',
						label: this.i18nt('designer.hint.letterAndNumberValidator')
					},
					{
						value: 'mobilePhone',
						label: this.i18nt('designer.hint.mobilePhoneValidator')
					},
					{
						value: 'email',
						label: this.i18nt('designer.hint.emailValidator')
					},
					{
						value: 'url',
						label: this.i18nt('designer.hint.urlValidator')
					},
					{
						value: 'noChinese',
						label: this.i18nt('designer.hint.noChineseValidator')
					},
					{
						value: 'chinese',
						label: this.i18nt('designer.hint.chineseValidator')
					},
				],

				showEditFormCssDialogFlag: false,
				formCssCode: '',
				cssClassList: [],

				showEditFunctionsDialogFlag: false,
				functionsCode: '',

				showWidgetEventDialogFlag: false,
				showFormEventDialogFlag: false,
				eventParamsMap: {
					'onCreated': 'onCreated() {',
					'onMounted': 'onMounted() {',
					'onClick': 'onClick() {',
					'onInput': 'onInput(value) {',
					'onChange': 'onChange(value, oldValue, subFormData, rowId) {',
					'onFocus': 'onFocus(event)',
					'onBlur': 'onBlur(event)',
					'onRemoteQuery': 'onRemoteQuery(keyword) {',
					'onBeforeUpload': 'onBeforeUpload(file) {',
					'onUploadSuccess': 'onUploadSuccess(result, file, fileList) {',
					'onUploadError': 'onUploadError(error, file, fileList) {',
					'onUploadPreview': 'onUploadPreview(error, file, fileList) {',
					'onUploadProgress': 'onUploadProgress(error, file, fileList) {',
					'onValidate': 'onValidate(rule, value, callback)',
					
					

					'onFormCreated': 'onFormCreated() {',
					'onFormMounted': 'onFormMounted() {',
					'onFormDataChange': 'onFormDataChange(fieldName, newValue, oldValue, formModel, subFormName, subFormRowIndex) {',
					//'onFormValidate':     'onFormValidate() {',

					'onSubFormRowAdd': 'onSubFormRowAdd(subFormData, newRowIndex) {',
					'onSubFormRowInsert': 'onSubFormRowInsert(subFormData, newRowIndex) {',
					'onSubFormRowDelete': 'onSubFormRowDelete(subFormData, deletedDataRow) {',
					'onSubFormRowChange': 'onSubFormRowChange(subFormData) {',
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
					if(this.selectedWidget)
						return this.selectedWidget.options
					else
						return null;
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

			'selectedWidget.options': { //组件属性变动后，立即保存表单JSON！！
				deep: true,
				handler(val) {
					this.designer.saveCurrentHistoryStep()
				}
			},

			formConfig: {
				deep: true,
				handler(val) {
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

			this.scrollerHeight = window.innerHeight - 56 - 48 // + 'px'
			addWindowResizeHandler(() => {
				this.$nextTick(() => {
					this.scrollerHeight = window.innerHeight - 56 - 48 // + 'px'
					//console.log(this.scrollerHeight)
				})
			})

			this.designer.handleEvent('field-selected', (parentWidget) => {
				this.subFormChildWidgetFlag = !!parentWidget && (parentWidget.type === 'sub-form');
			})

			//console.log('mounted--', this.formConfig.cssCode)
			/*
			this.formCssCode = this.formConfig.cssCode
			insertCustomCssToHead(this.formCssCode)
			this.extractCssClass()
			*/
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
					this.$Message.info(this.i18nt('designer.hint.nameRequired'))
					return
				}

				if (!!this.designer.formWidget) {
					//检查newName是否已存在！！
					let foundRef = this.designer.formWidget.getWidgetRef(newName)
					if (!!foundRef) {
						this.selectedWidget.options.name = oldName
						this.$Message.info(this.i18nt('designer.hint.duplicateName') + newName)
						return
					}

					let fieldWidget = this.designer.formWidget.getWidgetRef(oldName)
					if (!!fieldWidget && !!fieldWidget.registerToRefList) {
						fieldWidget.registerToRefList(oldName)
						this.designer.updateSelectedWidgetNameAndRef(this.selectedWidget, newName)
					}
				}
			},

			spanChanged(curGrid, col, colIdx, newValue, oldValue) {
				let spanSum = 0
				curGrid.cols.forEach((colItem, idx) => {
					spanSum += colItem.options.span
				})
				if (spanSum > 24) {
					//this.$Message.info('列栅格之和超出24')
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

			inputNumberHandler({})
			{
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
					this.$Message.info(this.i18nt('designer.hint.lastPaneCannotBeDeleted'))
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
					this.optionModel.defaultValue = [] //清空原默认值!!
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
				this.cssClassList.splice(0, this.cssClassList.length) //清除数组必须用splice，length=0不会响应式更新！！
				if (!!result && result.length > 0) {
					result.forEach((rItem, rIdx) => {
						let classArray = rItem.split(',') //切分逗号分割的多个class
						if (classArray.length > 0) {
							classArray.forEach((cItem, cIdx) => {
								let caItem = cItem.trim()
								if (caItem.indexOf('.', 1) !== -1) { //查找第二个.位置
									let newClass = caItem.substring(caItem.indexOf('.') + 1, caItem
										.indexOf('.', 1)) //仅截取第一、二个.号之间的class
									if (!!newClass) {
										this.cssClassList.push(newClass.trim())
									}
								} else if (caItem.indexOf(' ') !== -1) { //查找第一个空格位置
									let newClass = caItem.substring(caItem.indexOf('.') + 1, caItem
										.indexOf(' ')) //仅截取第一、二个.号之间的class
									if (!!newClass) {
										this.cssClassList.push(newClass.trim())
									}
								} else {
									if (caItem.indexOf('{') !== -1) { //查找第一个{位置
										let newClass = caItem.substring(caItem.indexOf('.') + 1, caItem
											.indexOf('{'))
										this.cssClassList.push(newClass.trim())
									} else {
										let newClass = caItem.substring(caItem.indexOf('.') + 1)
										this.cssClassList.push(newClass.trim())
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
					this.eventHandlerCode =
						"  /* sample code */\n  /*\n  if ((value > 100) || (value < 0)) {\n    callback(new Error('error message'))  //fail\n  } else {\n    callback();  //pass\n  }\n  */"
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
			updateFormView(){
				console.log("Upload Form View");
				let $this=this;
				this.$nextTick(() => {
					$this.$forceUpdate();
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.panel-container {
		padding: 0 8px;
		
	}
		::v-deep .ivu-tabs-bar{
			margin-bottom: 7px;
		}
		::v-deep .ivu-scroll-loader{
			display:none;
		}

	.setting-scrollbar {
		::v-deep .el-scrollbar__wrap {
			overflow-x: hidden;
			/* IE浏览器隐藏水平滚动条箭头！！ */
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
		::v-deep .FormItem__label {
			font-size: 13px;
			//text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}

		::v-deep .FormItem--mini.FormItem {
			margin-bottom: 6px;
		}

		.radio-group-custom {
			::v-deep .Radio__inner {
				padding-left: 12px;
				padding-right: 12px;
			}

			::v-deep .ivu-radio-wrapper {
				padding: 0 7px;
			}
		}
		
		/deep/ .ivu-form-item{
			margin-bottom: 5px;
		}
	}

	li.col-item {
		list-style: none;
		display: flex;
		align-items: center;

		span.col-span-title {
			display: inline-block;
			font-size: 13px;
			width: 120px;
			flex-shrink: 0;
		}

		.col-delete-button {
			margin-left: 6px;
			padding-top:1px;
			flex-shrink: 0;
		}
	}
	.codeEditTip{
		color:#909399;
		background-color: #f4f4f5;
		padding-left:20px;
		line-height:30px;
		font-size: 14px;
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
			padding-left: 0;
			/* 重置IE11默认样式 */
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
