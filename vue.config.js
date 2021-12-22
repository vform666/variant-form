'use strict'

const path = require('path')
const IS_PROD = process.env.NODE_ENV === 'production'

function resolve (dir) {
  return path.join(__dirname, dir)
}

const npmConfigArgv = (process.env.npm_config_argv === undefined) ? null : JSON.parse(process.env.npm_config_argv)
/*
console.log('npm config: ', npmConfigArgv)
const procArgv = process.argv
console.log('npm config: ', procArgv)
*/
let buildProdFlag = false
if (!!npmConfigArgv) {
  npmConfigArgv.original.forEach(cItem => {
    if (cItem === 'build') {
      buildProdFlag = true
    }
  })
}

const mvdir = require('mvdir');
if (IS_PROD && buildProdFlag) {
  mvdir('index_template/index_prod.html', 'public/index.html', { copy: true });
} else {
  mvdir('index_template/index_dev.html', 'public/index.html', { copy: true });
}


module.exports = {
  publicPath: './',
  assetsDir: './',

  /* 开启vue运行时模板编译功能！！ */
  runtimeCompiler: true,

  lintOnSave: false,

  productionSourceMap: false,

  /* 指定node_modules目录中需要做babel转译的依赖库 */
  transpileDependencies: [
    'element-ui', 'vuedraggable',
  ],

  css: {
    loaderOptions: {
      scss: {
        /* 自动引入全局scss文件 */
        prependData: `
          @import "./src/styles/global.scss";
        `
      }
    }
  },

  configureWebpack: (config) => {
    config.devtool = 'source-map'
    config.output.libraryExport = 'default'  /* 解决import UMD打包文件时, 组件install方法执行报错的问题！！ */

    if (IS_PROD && buildProdFlag) { /* 仅生产环境使用 */
      /* CDN打包，需要修改index.html加入CDN资源 */
      config.externals = {
        'vue': 'Vue',
        'element-ui': 'ELEMENT',
        //'quill': 'Quill',
      }
    }
  },

  chainWebpack: config => {
    /* 配置svg图标自动加载 begin */
    config.module
        .rule('svg')
        .exclude.add(resolve('src/icons'))
        .end()
    config.module
        .rule('icons')
        .test(/\.svg$/)
        .include.add(resolve('src/icons'))
        .end()
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .options({
          symbolId: 'icon-[name]'
        })
    /* 配置svg图标自动加载 end */
  },

}
