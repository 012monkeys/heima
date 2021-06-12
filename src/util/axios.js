import Vue from 'vue'

// 设置基本base路由地址
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

// 请求拦截器预处理
axios.interceptors.request.use(config => { // 每次发送请求, 把token放在headers中
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

export {
  axios
}
