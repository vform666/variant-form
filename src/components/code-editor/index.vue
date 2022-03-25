<template>
  <div class="ace-container">
    <!-- 官方文档中使用id，这里禁止使用，在后期打包后容易出现问题，使用 ref 或者 DOM 就行 -->
    <div class="ace-editor" ref="ace"></div>
  </div>
</template>

<script>
  import ace from 'ace-builds'
  /* 启用此行后webpack打包回生成很多动态加载的js文件，不便于部署，故禁用！！
     特别提示：禁用此行后，需要调用ace.config.set('basePath', 'path...')指定动态js加载URL！！
   */
  //import 'ace-builds/webpack-resolver'

  //import 'ace-builds/src-min-noconflict/theme-monokai' // 默认设置的主题
  import 'ace-builds/src-min-noconflict/theme-sqlserver' // 新设主题
  import 'ace-builds/src-min-noconflict/mode-javascript' // 默认设置的语言模式
  import 'ace-builds/src-min-noconflict/mode-json' //
  import 'ace-builds/src-min-noconflict/mode-css' //
  import 'ace-builds/src-min-noconflict/ext-language_tools'
  import {ACE_BASE_PATH} from "@/utils/config";

  export default {
    name: 'CodeEditor',
    props: {
      value: {
        type: String,
        required: true
      },
      readonly: {
        type: Boolean,
        default: false
      },
      mode: {
        type: String,
        default: 'javascript'
      },
      userWorker: {  //是否开启语法检查，默认开启
        type: Boolean,
        default: true
      },

    },
    mounted() {
      //ace.config.set('basePath', 'https://ks3-cn-beijing.ksyun.com/vform2021/ace')
      ace.config.set('basePath', ACE_BASE_PATH)

      this.addAutoCompletion(ace)  //添加自定义代码提示！！

      this.aceEditor = ace.edit(this.$refs.ace, {
        maxLines: 20, // 最大行数，超过会自动出现滚动条
        minLines: 5, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
        fontSize: 12, // 编辑器内字体大小
        theme: this.themePath, // 默认设置的主题
        mode: this.modePath, // 默认设置的语言模式
        tabSize: 2, // 制表符设置为2个空格大小
        readOnly: this.readonly,
        highlightActiveLine: true,
        value: this.codeValue
      })

      this.aceEditor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,  // 设置代码片段提示
        enableLiveAutocompletion: true,  // 设置自动提示
      })

      if (this.mode === 'json') {
        this.setJsonMode()
      } else if (this.mode === 'css') {
        this.setCssMode()
      }

      if (!this.userWorker) {
        this.aceEditor.getSession().setUseWorker(false)
      }

      //编辑时同步数据
      this.aceEditor.getSession().on('change',(ev)=>{
        //this.$emit('update:value', this.aceEditor.getValue())  // 触发更新事件, 实现.sync双向绑定！！
        this.$emit('input', this.aceEditor.getValue())
      })
    },
    data() {
      return {
        aceEditor: null,
        themePath: 'ace/theme/sqlserver', // 不导入 webpack-resolver，该模块路径会报错
        modePath: 'ace/mode/javascript', // 同上
        codeValue: this.value
      }
    },
    watch: {
      //
    },
    methods: {
      addAutoCompletion(ace) {
        let acData = [
          {meta: 'VForm API', caption: 'getWidgetRef', value: 'getWidgetRef()', score: 1},
          {meta: 'VForm API', caption: 'getFormRef', value: 'getFormRef()', score: 1},
          //TODO: 待补充！！
        ]
        let langTools = ace.require('ace/ext/language_tools')
        langTools.addCompleter({
          getCompletions: function(editor, session, pos, prefix, callback) {
            if (prefix.length === 0) {
              return callback(null, []);
            }else {
              return callback(null, acData);
            }
          }
        })
      },

      setJsonMode() {
        this.aceEditor.getSession().setMode('ace/mode/json')
      },

      setCssMode() {
        this.aceEditor.getSession().setMode('ace/mode/css')
      },

      getEditorAnnotations() {
        return this.aceEditor.getSession().getAnnotations()
      },

    }
  }
</script>

<style lang="scss" scoped>
  .ace-editor {
    min-height: 300px;
  }
</style>
