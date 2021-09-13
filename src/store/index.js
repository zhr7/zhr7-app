import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import seller from './modules/seller'
import healthy from './modules/healthy'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    $u:{},
    onReachBottom:false,
  },
  mutations : {
    SET_U: (state, u) => {
      state.$u = u
    },
    ON_REACH_BOTTOM: (state, ) => {
      state.onReachBottom = !state.onReachBottom
    },
  },
  actions : {
    setU({ commit }, u) {
      commit('SET_U', u)
    },
    onReachBottom({ commit }) {
      commit('ON_REACH_BOTTOM')
    },
  },
  modules: {
    user,
    seller,
    healthy,
  },
  getters
})

export default store
