export const generateCode = function(formJson, codeType= 'vue') {
  let formJsonStr = JSON.stringify(formJson)

  if (codeType === 'html') {
    return `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
	<title>VForm Demo</title>
	<link rel="stylesheet" href="https://cdn.staticfile.org/element-ui/2.15.7/theme-chalk/index.min.css">
	<link rel="stylesheet" href="https://ks3-cn-beijing.ksyun.com/vform2021/VFormRender.css?t=20210720">
	<style type="text/css">
	</style>
</head>
<body>

  <div id="app">
	  <v-form-render :form-json="formJson" :form-data="formData" :option-data="optionData" ref="vFormRef">
    </v-form-render>
	  <el-button type="primary" @click="submitForm">Submit</el-button>
  </div>

<script type="text/javascript">
  if (!!window.ActiveXObject || "ActiveXObject" in window) { //IE load polyfill.js for Promise
    var scriptEle = document.createElement("script");
    scriptEle.type = "text/javascript";
    scriptEle.src = "https://cdn.bootcss.com/babel-polyfill/6.23.0/polyfill.min.js"
    document.body.appendChild(scriptEle)
  }
</script>
<script src="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/2.6.14/vue.min.js"></script>
<script src="https://cdn.staticfile.org/element-ui/2.15.7/index.min.js"></script>
<script src="https://ks3-cn-beijing.ksyun.com/vform2021/VFormRender.umd.min.js?t=20210720"></script>
<script>
	new Vue({
      el: '#app',
      data: {
        formJson: ${formJsonStr},
        formData: {},
        optionData: {}
      },
      methods: {
        submitForm() {
          this.$refs.vFormRef.getFormData().then( function(formData) {
            // Form Validation OK
            alert( JSON.stringify(formData) )
          }).catch( function(error) {
            // Form Validation Failed
            alert(error)
          })
        }
      }
	});
</script>
</body>
</html>`

  } else {
    return `<template>
  <div>
    <v-form-render :form-json="formJson" :form-data="formData" :option-data="optionData" ref="vFormRef">
    </v-form-render>
    <el-button type="primary" @click="submitForm">Submit</el-button>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        formJson: ${formJsonStr},
        formData: {},
        optionData: {}
      }
    },
    methods: {
      submitForm() {
        this.$refs.vFormRef.getFormData().then(formData => {
          // Form Validation OK
          alert( JSON.stringify(formData) )
        }).catch(error => {
          // Form Validation failed
          this.$message.error(error)
        })
      }
    }
  }
</script>`

  }
}
