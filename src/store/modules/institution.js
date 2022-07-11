import store from '@/store'
const state = {
    initCache: false,
    orderInfoCache: "", // 订单信息缓存
    sellerBrandId: "",
}

const mutations = {
    SER_ORDER_INFO_CACHE: (state, item) => {
        state.orderInfoCache = item
    },
    CHANGE_INIT_CACHE: (state) => {
        state.initCache = !state.initCache
    },
    CHANGE_SELLER_BRANDID: (state, v) => {
        state.sellerBrandId = v
    },
}

const actions = {
    setOrderInfoCache({ commit }, item) {
        commit('SER_ORDER_INFO_CACHE', item)
    },
    changeInitCache({ commit }) {
        commit('CHANGE_INIT_CACHE')
    },
    sellerSimpleInfo({ commit }) {
        store.state.$u.api.institution.seller.SimpleInfo({ seller: {
            id: store.getters.userId
        }}).then(res =>{
            if (res.seller) {
                commit('CHANGE_SELLER_BRANDID', res.seller.brandId)
            }
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
