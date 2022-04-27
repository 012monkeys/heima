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

import './assets/fonts/iconfont.css'
// 字体图标
import './assets/css/global.css' // 全局样式

import filters from './filters/index'
import { axios } from './util/axios'
Vue.component('treeTable', treeTable)
Vue.use(ElementUI)
Vue.use(VueQuillEditor)
Vue.config.productionTip = false

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
new Vue({
  axios,
  router,
  render: h => h(App)
}).$mount('#app')
