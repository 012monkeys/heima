import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] //  白名单
router.beforeEach(async(to, from, next) => {
  NProgress.start()

  const hasToken = getToken() // 每次路由跳转, 查找token

  if (hasToken) { // token存在
    if (to.path === '/login') {
      // 是否登录页, 跳转首页
      next({ path: '/' })
      NProgress.done()
    } else { // token存在不是访问login时
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) { // role存在
        next()
      } else {
        try {
          const hasFakeRoles = store.getters.fakeRoles && store.getters.fakeRoles.length > 0// 登录页选择的roles
          if (hasFakeRoles) {
            const roles = store.getters.fakeRoles
            console.log('fakeroles')
            store.commit('SET_ROLES', roles)
            // 形成roles的路由
            const accessRoutes = await store.dispatch('generateRoutes', roles)
            // 添加到routes中
            console.log('🚀 ~ router.beforeEach ~ accessRoutes', accessRoutes)
            router.addRoutes(accessRoutes)
          } else {
            // 向服务端获取roles
            const { roles } = await store.dispatch('getInfo')
            // 形成roles的路由
            const accessRoutes = await store.dispatch('generateRoutes', roles)
            // 添加到routes中
            router.addRoutes(accessRoutes)
          }

          // 这里还有一个小hack的地方，就是router.addRoutes之后的next()可能会失效，因为可能next()的时候
          // 这样我们就可以简单的通过next(to)巧妙的避开之前的那个问题了
          // replace: true 不会写入历史记录中
          next({ ...to, replace: true })
        } catch (error) {
          // 用户信息获取失败, 清空token, 跳转登录页
          await store.dispatch('resetToken') // 清空token
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`) // 跳转登录页
          NProgress.done()
        }
      }
    }
  } else { // token不存在
    if (whiteList.indexOf(to.path) !== -1) {
      // 是否在白名单中, 在则放行
      next()
    } else {
      // 先登陆
      Message({
        message: '需要先登陆',
        type: 'warning',
        duration: 3 * 1000
      })
      next(`/login?redirect=${to.path}`) // 配置重定向的页面路径
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
