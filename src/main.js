import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import treeTable from 'vue-table-with-tree-grid'
import 'element-ui/lib/theme-chalk/index.css'

import { axios } from './util/axios'
// 字体图标
import './assets/fonts/iconfont.css'
import './assets/css/global.css'

Vue.component('treeTable', treeTable)
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  axios,
  router,
  render: h => h(App)
}).$mount('#app')
