'use strict'
const defaultSettings = require('./src/setting.js')
const path = require('path')
const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const name = defaultSettings.title || 'vue control goods'
function resolve(dir) {
  return path.join(__dirname, dir)
}
const cdn = {
  css: [],
  js: [
    'https://cdn.bootcss.com/vue/2.6.11/vue.min.js',
    'https://cdn.bootcss.com/vue-router/3.0.2/vue-router.min.js',
    'https://cdn.jsdelivr.net/npm/vuex@3.1.2/dist/vuex.min.js',
    'https://cdn.bootcss.com/axios/0.19.0-beta.1/axios.min.js'
  ]
}
const externals = { // 不打包文件
  // 不打包文件
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  axios: 'axios',
  lodash: '_',
  echarts: 'echarts'
}
module.exports = {
  devServer: {
    open: true,
    port: 8877
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set preserveWhitespace 去掉元素之间的空格
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()
    // webpack打包出来代码的样子
    config.when(process.env.NODE_ENV === 'development', (config) => config.devtool('cheap-module-source-map'))

    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })

    if (IS_PRODUCTION) {
      config.plugin('html').tap((args) => {
        args[0].cdn = cdn
        return args
      })
      config.externals(externals) // 不打包文件
      config.plugin('html').tap((args) => {
        args[0].minify.minifyCSS = true // 压缩html中的css
        return args
      })
    }
  }

}
