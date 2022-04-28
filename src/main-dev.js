import Vue from 'vue'
import App from '@/App.vue'
import treeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor' // 导入富文本编辑器
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import store from './store'
import router from './router'
import './permission' // 路由守卫

// require 导入富文本编辑器styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import './assets/fonts/iconfont.css'
// 字体图标
import './style/global.css' // 全局样式

import filters from './filters/index'
import './utils/axios'

Vue.component('treeTable', treeTable)
Vue.use(ElementUI)
Vue.use(filters)
Vue.use(VueQuillEditor)
Vue.config.productionTip = false

// this.$store.state.name

// register global utility filters

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
