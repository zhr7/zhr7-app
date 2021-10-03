
import store from '@/store'
const state = {
  token: uni.getStorageSync('token'),
  username: '',
  name: '匿名',
  userId: '',
  loginTime: new Date(),
  avatar: '',
  roles: [],
  front_permits: [],
  provider:'h5'
}

const mutations = {
  SET_TOKEN: (state, token) => {
    setToken(token)
    state.token = token
  },
  REMOVE_TOKEN: (state) => {
      uni.removeStorageSync("token")
      state.token = ''
  },
  INIT_USER: (state) => {
    state.username = ''
    state.name = ''
    state.userId = ''
    state.avatar = ''
    state.roles = []
    state.front_permits = []
  },
  SET_USERNAME: (state, username) => {
    if (username) {
      state.username = username
    }
  },
  SET_NAME: (state, name) => {
    if (name) {
      state.name = name
    }
  },
  SET_USER_ID: (state, userId) => {
    if (userId) {
      state.userId = userId
    }
  },
  SET_LOGINTIME: (state, time) => {
    if (time) {
      state.loginTime = time
    }
  },
  SET_AVATAR: (state, avatar) => {
    if (avatar) {
      state.avatar = avatar
    }
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_FRONT_PEIMITS: (state, front_permits) => {
    state.front_permits = front_permits
  },
  SET_PROVIDER: (state, provider) => {
    state.provider = provider
  }
}

const actions = {
  // // user login
  login({ commit, state }, obj) {
    return new Promise((resolve, reject) => {
      const login = require('@/utils/login').default
      switch (obj.type) {
        case 'username':
          login.Auth(obj.user).then(res=>{
            resolve(res)
          }).catch(err => {
            reject(err)
          })
          break;
      
        default:
          // #ifdef MP-WEIXIN
          login.MpWechat().then(res=>{
            resolve(res)
          }).catch(err => {
            reject(err)
          })
          // #endif
          break;
      }
    })
  },
  mobileLogin({ commit, state }, options) {
    return new Promise((resolve, reject) => {
      // const login = require('@/utils/login').default
      // login.Mobile(options.mobile, options.captcha).then(res=>{
      //   resolve(res)
      // }).catch(err => {
      //   reject(err)
      // })
    })
  },
  register({ commit, state },options){
    return new Promise((resolve, reject) => {
      // const login = require('@/utils/login').default
      // // #ifdef MP-WEIXIN
      // login.socialitesRegister('miniprogram_wechat', options.mobile, options.captcha).then(res => {
      //   resolve(res)
      // }).catch(err => {
      //   reject(err)
      // })
      // // #endif
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const Api = store.state.$u.api
      Api.user.user.UserInfo().then(res => {
        // 用户相关信息设置
        const { username, name, avatar, id } = res.user
        commit('SET_NAME', name)
        commit('SET_USERNAME', username)
        commit('SET_USER_ID', id)
        commit('SET_AVATAR', avatar)
        // 角色相关信息设置
        let roles = [] 
        if ('roles' in res) {
          roles = res.roles
        }
        commit('SET_ROLES', roles)
        // 前端权限相关设置
        let front_permits = []
        if ('front_permits' in res) {
          front_permits = res.front_permits
        }
        commit('SET_FRONT_PEIMITS', front_permits)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('REMOVE_TOKEN')
      commit('INIT_USER')
      uni.redirectTo({
        url: 'pages/index/index'
      });
      resolve()
    })
  },
  
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('REMOVE_TOKEN')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
