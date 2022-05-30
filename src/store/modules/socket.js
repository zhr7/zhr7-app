import { Base64 } from 'js-base64'
import { baseWSUrl } from '@/settings.js'
import store from '@/store'
const state = {
  token: uni.getStorageSync('token'),
  palyOrder: uni.getStorageSync('socket.palyOrder'),
  event: {},
  deviceId: '',
  status: false,
  timer: null,
  order: null,
}

const mutations = {
  INIT: (state, deviceId) => {
    state.deviceId = deviceId
    uni.connectSocket({
      url: baseWSUrl,
      header: {
        'content-type': 'application/json',
        'deviceInfo': deviceId,
        'token': state.token
      },
    })
  },
  PUSH_ORDER: (state, data) => {
    const order = JSON.parse(Base64.decode(data))
    if (state.palyOrder) {
      store.dispatch('tts/order', order) // 语音播报
    }
  }
}

const actions = {
  setPalyOrder({ commit, state }) {
    state.palyOrder = !state.palyOrder
    if (state.palyOrder) {
      store.dispatch('tts/speak', {text:"开启语音播报成功",id:0}) // 语音播报
    }
    uni.setStorageSync('socket.palyOrder', state.palyOrder)
  },
  webSocket({ commit, state }, deviceId) {
    commit('INIT', deviceId) // 初始化
    uni.onSocketOpen((res) => {
      console.log('WebSocket连接已打开！');
      state.status = true
      clearInterval(state.timer); //再次清空定时器，防止重复注册定时器
      state.timer = null
    })
    // 监听WebSocket接受到的消息
    uni.onSocketError((res) => {
      state.status = false
      console.log('WebSocket连接报错:', JSON.stringify(res));
      // 每隔3秒执行一次
      clearInterval(state.timer); //再次清空定时器，防止重复注册定时器
      state.timer = null
      state.timer = setInterval(() => {
        if (!state.status) {
          console.log('WebSocket正在尝试连接！');
          commit('INIT', deviceId)
        }
      }, 5000)
    });
    uni.onSocketClose((res) => {  
      state.status = false
      console.log('WebSocket连接断开，请检查！');
      // 每隔3秒执行一次
      clearInterval(state.timer); //再次清空定时器，防止重复注册定时器
      state.timer = null
      state.timer = setInterval(() => {
        if (!state.status) {
          console.log('WebSocket正在尝试连接！');
          commit('INIT', deviceId)
        }
      }, 5000)                   
    });
    uni.onSocketMessage((res) => {
      if (res.data) {
        const event = JSON.parse(res.data)
        switch (event.topic) {
          case "message.drive.SuccessOrder":
            commit('PUSH_ORDER', event.data)
            break;
          case "pay.trade.SuccessOrder":
              commit('PUSH_ORDER', event.data)
              break;
          default:
            break;
        }
      }
    });
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
