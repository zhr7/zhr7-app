import store from '@/store'
const state = {
  versionCode: '',
  version: '',
  icpBeiAn: '',
  payQrcodeUrl: '',
  sysName: '',
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  initConfig({ commit }) {
    const Api = store.state.$u.api
    // Api.user.config.Get({
    //   config:{
    //     id: 'SYS_ICP_BEI_AN'
    //   }
    // }).then(res => {
    //   commit('CHANGE_SETTING', {
    //     key: 'icpBeiAn',
    //     value: res.config.value
    //   })
    // })
    Api.user.config.Get({
      config:{
        id: 'SYS_PAY_CODE_URL'
      }
    }).then(res => {
      commit('CHANGE_SETTING', {
        key: 'payQrcodeUrl',
        value: res.config.value
      })
    })
    // Api.user.config.Get({
    //   config:{
    //     id: 'SYS_NAME'
    //   }
    // }).then(res => {
    //   commit('CHANGE_SETTING', {
    //     key: 'sysName',
    //     value: res.config.value
    //   })
    // })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
