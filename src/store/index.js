import Vue from 'vue'
import Vuex from 'vuex'
import { getToken, setToken, clearStorage, removeToken } from '@/utils/auth'
import { login, logout, getInfo } from '@/api/user'
import { constantRoutes, editRoutes, adminRoutes, resetRouter } from '@/router/index'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    routes: [],
    addRoutes: [],
    fakeRoles: []// 登录页选择的用户权限
  },
  mutations: {
    SET_TOKEN: (state, token) => { // 保存token
      state.token = token
    },
    SET_NAME: (state, name) => { // 保存名字
      state.name = name
    },
    SET_AVATAR: (state, avatar) => { // 保存头像
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => { // 保存用户角色
      state.roles = roles
    },
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_FAKE_ROLES: (state, roles) => { // 保存登录页选择的用户权限
      state.fakeRoles = roles
    }
  },
  actions: {
    // user login
    login({ commit }, userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        login({ username: username.trim(), password: password }).then(response => {
          const { data } = response
          commit('SET_TOKEN', data.token) // 保存state中
          setToken(data.token) // 保存在localStorage
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获得用户信息
    getInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const { data } = response

          if (!data) {
            reject(new Error('Verification failed, please Login again.'))
          }

          const { roles, name, avatar } = data

          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject(new Error('没有角色信息'))
          }

          commit('SET_ROLES', roles)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // user logout
    logout({ commit, state, dispatch }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '') // token清除
          commit('SET_ROLES', []) // 用户角色清除
          clearStorage() // 清除本地
          resetRouter() // 重置Router

          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // remove token
    resetToken({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },

    async changeRoles({ commit, dispatch }, role) {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      // const { roles } = await dispatch('getInfo')

      // resetRouter()

      // generate accessible routes map based on roles
      // const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
      // dynamically add accessible routes
      // router.addRoutes(accessRoutes)

      // reset visited views and cached views
      // dispatch('tagsView/delAllViews', null, { root: true })
    },
    generateRoutes({ commit }, roles) { // 根据roles生成路由
      return new Promise(resolve => {
        let accessedRoutes = []
        if (roles.indexOf('admin') > -1) {
          accessedRoutes = adminRoutes
          commit('SET_ROUTES', adminRoutes)
        } else {
          accessedRoutes = editRoutes
        }
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    }

  },
  getters: {
    token: state => state.token,
    roles: state => state.roles,
    fakeRoles: state => state.fakeRoles
  }
})
