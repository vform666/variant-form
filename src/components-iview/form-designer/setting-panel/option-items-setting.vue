<template>
	<div class="option-items-pane">
		<RadioGroup
			v-if="(selectedWidget.type === 'radio') || ((selectedWidget.type === 'select') && !selectedWidget.options.multiple)"
			v-model="optionModel.defaultValue" @on-change="emitDefaultValueChange">
			<draggable tag="ul" :list="optionModel.optionItems"
				v-bind="{group:'optionsGroup', ghostClass: 'ghost', handle: '.drag-option'}">
				<li v-for="(option, idx) in optionModel.optionItems" :key="idx">
					<Radio :label="option.value">
						<Input v-model="option.value" placeholder="Value" size="small" style="width: 100px"></Input>
						<Input v-model="option.label" placeholder="Label" size="small" style="width: 100px"></Input>
						<i class="iconfont icon-drag drag-option"></i>
						<Button 
							shape="circle" 
							size="small" 
							type="warning" 
							@click="deleteOption(option, idx)"
							icon="md-remove" 
							class="col-delete-button">
						</Button>
					</Radio>
				</li>
			</draggable>
		</RadioGroup>
		<CheckboxGroup
			v-else-if="(selectedWidget.type === 'checkbox') || ((selectedWidget.type === 'select') && selectedWidget.options.multiple)"
			v-model="optionModel.defaultValue" @on-change="emitDefaultValueChange">
			<draggable tag="ul" :list="optionModel.optionItems"
				v-bind="{group:'optionsGroup', ghostClass: 'ghost', handle: '.drag-option'}">
				<li v-for="(option, idx) in optionModel.optionItems" :key="idx">
					<Checkbox :label="option.value">
						<Input v-model="option.value" placeholder="Value" size="small" style="width: 95px"></Input>
						<Input v-model="option.label" placeholder="Label" size="small" style="width: 95px"></Input>
						<i class="iconfont icon-drag drag-option"></i>
						<Button 
							shape="circle" 
							size="small" 
							type="warning" 
							@click="deleteOption(option, idx)"
							icon="md-remove" 
							class="col-delete-button">
						</Button>
					</Checkbox>
				</li>
			</draggable>
		</CheckboxGroup>
		<Cascader 
			v-else-if="(selectedWidget.type === 'cascader')" 
			v-model="optionModel.defaultValue"
			:data="optionModel.optionItems" 
			:placeholder="i18nt('designer.hint.selectPlaceholder')" 
			@on-change="emitDefaultValueChange"
			style="width: 100%">
		</Cascader>
		<div v-if="(selectedWidget.type === 'cascader')">
			<Button type="text" @click="importCascaderOptions">{{i18nt('designer.setting.importOptions')}}
			</Button>
			<Button type="text" @click="resetDefault">{{i18nt('designer.setting.resetDefault')}}</Button>
		</div>

		<div
			v-if="(selectedWidget.type === 'radio') || (selectedWidget.type === 'checkbox') || (selectedWidget.type === 'select')">
			<Button type="text" @click="addOption">{{i18nt('designer.setting.addOption')}}</Button>
			<Button type="text" @click="importOptions">{{i18nt('designer.setting.importOptions')}}</Button>
			<Button type="text" @click="resetDefault">{{i18nt('designer.setting.resetDefault')}}</Button>
		</div>

		<Modal :title="i18nt('designer.setting.importOptions')"
			v-model="showImportDialogFlag" :closable="true" class="small-padding-dialog" draggable
			:mask-closable="false" >
			<FormItem :label-width="0">
				<Input type="textarea" :rows="10" v-model="optionLines"></Input>
			</FormItem>
			<div slot="footer" class="dialog-footer">
				<Button size="default" type="primary" @click="saveOptions">{{i18nt('designer.hint.confirm')}}
				</Button>
				<Button size="default" type="default" @click="showImportDialogFlag = false">{{i18nt('designer.hint.cancel')}}
				</Button>
			</div>
		</Modal>

		<Modal :title="i18nt('designer.setting.importOptions')"
			v-model="showImportCascaderDialogFlag" :closable="true" class="small-padding-dialog" draggable
			:mask-closable="false" >
			<code-editor v-model="cascaderOptions" mode="json" :readonly="false"></code-editor>
			<div slot="footer" class="dialog-footer">
				<Button size="default" type="primary" @click="saveCascaderOptions">{{i18nt('designer.hint.confirm')}}
				</Button>
				<Button size="default" type="default" @click="showImportCascaderDialogFlag = false">
					{{i18nt('designer.hint.cancel')}}</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import Draggable from 'vuedraggable'
	import CodeEditor from '@/components-iview/code-editor/index'
	import i18n from "../../utils/i18n";

	export default {
		name: "OptionItemsSetting",
		mixins: [i18n],
		components: {
			Draggable,
			//CodeEditor: () => import('@/components/code-editor/index'),
			CodeEditor,
		},
		props: {
			designer: Object,
			selectedWidget: Object,
		},
		data() {
			return {
				showImportDialogFlag: false,
				optionLines: '',

				cascaderOptions: '',
				showImportCascaderDialogFlag: false,

				//separator: '||',
				separator: ',',
			}
		},
		computed: {
			optionModel() {
				return this.selectedWidget.options
			},

		},
		watch: {
			'selectedWidget.options': {
				deep: true,
				handler(val) {
					//console.log('888888', 'Options change!')
				}
			},
		},
		methods: {
			emitDefaultValueChange() {
				if (!!this.designer) {
					/* 组件过多时，事件处理效率不高！！ */
					//this.designer.emitEvent('defaultValueChanged', this.selectedWidget.id)

					// if (!!this.designer.selectedFieldWrapper && this.designer.selectedFieldWrapper.refreshDefaultValue) {
					//   console.log('aaaa', '123456')
					//   this.designer.selectedFieldWrapper.refreshDefaultValue()
					// }

					if (!!this.designer.formWidget) {
						let fieldWidget = this.designer.formWidget.getWidgetRef(this.selectedWidget.options.name)
						if (!!fieldWidget && !!fieldWidget.refreshDefaultValue) {
							fieldWidget.refreshDefaultValue()
						}
					}
				}
			},

			deleteOption(option, index) {
				this.optionModel.optionItems.splice(index, 1)
			},

			addOption() {
				let newValue = this.optionModel.optionItems.length + 1
				this.optionModel.optionItems.push({
					value: newValue,
					label: 'new option'
				})
			},

			importOptions() {
				this.optionLines = ''
				if (this.optionModel.optionItems.length > 0) {
					this.optionModel.optionItems.forEach((opt) => {
						if (opt.value === opt.label) {
							this.optionLines += opt.value + '\n'
						} else {
							this.optionLines += opt.value + this.separator + opt.label + '\n'
						}
					})
				}

				this.showImportDialogFlag = true
			},

			saveOptions() {
				let lineArray = this.optionLines.split('\n')
				//console.log('test', lineArray)
				if (lineArray.length > 0) {
					this.optionModel.optionItems = []
					lineArray.forEach((optLine) => {
						if (!!optLine && !!optLine.trim()) {
							if (optLine.indexOf(this.separator) !== -1) {
								this.optionModel.optionItems.push({
									value: optLine.split(this.separator)[0],
									label: optLine.split(this.separator)[1]
								})
							} else {
								this.optionModel.optionItems.push({
									value: optLine,
									label: optLine
								})
							}
						}
					})
				} else {
					this.optionModel.optionItems = []
				}

				this.showImportDialogFlag = false
			},

			resetDefault() {
				if ((this.selectedWidget.type === 'checkbox') ||
					((this.selectedWidget.type === 'select') && this.selectedWidget.options.multiple)) {
					this.optionModel.defaultValue = []
				} else {
					this.optionModel.defaultValue = ''
				}

				this.emitDefaultValueChange()
			},

			importCascaderOptions() {
				this.cascaderOptions = JSON.stringify(this.optionModel.optionItems, null, '  ')
				this.showImportCascaderDialogFlag = true
			},

			saveCascaderOptions() {
				try {
					let newOptions = JSON.parse(this.cascaderOptions)
					this.optionModel.optionItems = newOptions
					//TODO: 是否需要重置选项默认值？？

					this.showImportCascaderDialogFlag = false
				} catch (ex) {
					this.$Message.error(this.i18nt('designer.hint.invalidOptionsData') + ex.message)
				}
			},

		}
	}
</script>

<style lang="scss" scoped>
	.option-items-pane ul {
		padding-inline-start: 6px;
		padding-left: 6px;
		/* 重置IE11默认样式 */
	}
	
	.option-items-pane ::v-deep ul>li {
		list-style: none;
	}

	li.ghost {
		background: #fff;
		border: 2px dotted $--color-primary;
	}

	.drag-option {
		cursor: move;
	}

	.small-padding-dialog ::v-deep .el-dialog__body {
		padding: 10px 15px;
	}

	.dialog-footer .el-button {
		width: 100px;
	}
</style>
