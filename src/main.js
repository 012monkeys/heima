import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import treeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor' // 导入富文本编辑器
import 'element-ui/lib/theme-chalk/index.css'

// require 导入富文本编辑器styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import './assets/fonts/iconfont.css'// 字体图标
import './assets/css/global.css' // 全局样式

import { axios } from './util/axios'

Vue.component('treeTable', treeTable)
Vue.use(ElementUI)
Vue.use(VueQuillEditor)
Vue.config.productionTip = false

Vue.filter('dateFormat', function(originVal) { // 注册全局过滤器 时间格式化
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  axios,
  router,
  render: h => h(App)
}).$mount('#app')
