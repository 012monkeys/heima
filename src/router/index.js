import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/home.vue'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')

const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')
const List = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/List.vue')
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/Add.vue')
const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/Report.vue')

Vue.use(VueRouter)
export const adminRoutes = [
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  },
  { path: '*', redirect: '/404' }
]

export const editRoutes = [
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  },
  { path: '*', redirect: '/404' }
]
export const constantRoutes = [
  { path: '/', redirect: '/home' },
  { path: '/login', component: Login },
  {
    path: '/redirect/:path(.*)',
    name: 'redirect',
    component: () => import(/* webpackChunkName: "baseUse" */ '../views/redirect.vue')
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/orders', component: Order },
      { path: '/welcome', component: Welcome },
      { path: '/reports', component: Report }
    ]
  },
  { path: '/404', component: () => import('../views/404.vue') }
]

function createRouter() {
  return new VueRouter({
    // mode: 'history', // require service support
    routes: constantRoutes
  })
}
const router = createRouter() // 创建路由
export function resetRouter() { // 重置路由
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
