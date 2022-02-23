const state = {
    orderInfoCache: "", // 订单信息缓存
}

const mutations = {
    SER_ORDER_INFO_CACHE: (state, item) => {
        state.orderInfoCache = item
    },
}

const actions = {
    setOrderInfoCache({ commit }, item) {
        commit('SER_ORDER_INFO_CACHE', item)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
