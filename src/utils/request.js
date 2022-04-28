import axios from 'axios'
import store from '@/store'
import get from 'lodash/get'
import { Message } from 'element-ui'

const service = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) { // 每次请求把token放入header
      config.headers.Authorization = store.getters.token
    }
    return config
  },
  error => { // 请求超时进入
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    console.log('dddd')
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.meta.status !== 200) {
      Message({
        message: res.meta.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      return Promise.reject(new Error(res.meta.msg || 'Error'))
    } else {
      return res
    }
  },
  error => { // 400 和 500 进入 和网络错误时
    console.log('err' + error) // for debug
    return errorHandler(error)
  }
)

// 异常拦截处理器
function errorHandler(error) {
  const status = get(error, 'response.status')
  console.log('🚀 ~ errorHandler ~ status', status)
  switch (status) {
    /* eslint-disable no-param-reassign */
    case 400: error.message = '请求错误'; break
    case 401: error.message = '未授权，请登录'; break
    case 403: error.message = '拒绝访问'; break
    case 404: error.message = `请求地址出错: ${error.response.config.url}`; break
    case 408: error.message = '请求超时'; break
    case 500: error.message = '服务器内部错误'; break
    case 501: error.message = '服务未实现'; break
    case 502: error.message = '网关错误'; break
    case 503: error.message = '服务不可用'; break
    case 504: error.message = '网关超时'; break
    case 505: error.message = 'HTTP版本不受支持'; break
    default: break
    /* eslint-disabled */
  }
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
}
export default service
