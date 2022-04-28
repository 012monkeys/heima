import request from '@/utils/request'

export function login(data) { // 登陆
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) { // 获取用户信息
  const data = {
    data: {
      roles: ['edit'],
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: 'Normal Editor'
    },
    meta: {
      msg: '获取用户信息成功',
      status: 200
    }
  }
  return Promise.resolve(data)
}

export function logout(token) { // 登出
  // return request({ // 没有这个接口
  //   url: '/vue-element-admin/user/logout',
  //   method: 'post'
  // })
  return Promise.resolve()
}
