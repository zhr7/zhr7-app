import { Base64 } from 'js-base64'

const state = {
  token: uni.getStorageSync('token'),
  open: false,
  msgQueue: [],
  event: {}
}

const mutations = {
}

const actions = {
  // sendSocketMessage({ commit, state }, {msg}) {
  //   console.log(state,msg,commit);
  //   if (state.open) {
  //     uni.sendSocketMessage({
  //       data: msg
  //     });
  //   } else {
  //     state.msgQueue.push(msg);
  //   }
  // },
  webSocket({ commit, state }) {
    uni.connectSocket({
      url: 'ws://127.0.0.1:8082/ws',
      data() {
        return {
          deviceInfo:"TXAP12107000994ND002113",
          service:'user-api',
          method:'Auth.Auth',
          request:{
              user: {
                  username: "admin", 
                  password: "admin123"
              },
          },
        };
      },
      header: {
        'content-type': 'application/json'
      },
    })
    uni.onSocketOpen((res) => {
      console.log('WebSocket连接已打开！');
      uni.sendSocketMessage({
        data: JSON.stringify({
          token: state.token,
          service:'user-api',
          method:'Users.Info',
          request: {}
        })
      })
    })
    uni.onSocketError((res) => {
      console.log('WebSocket连接打开失败，请检查！');
    });
    uni.onSocketMessage((res) => {
      const event = JSON.parse(res.data)
      event.data = JSON.parse(Base64.decode(event.data))
      state.event = event
      console.log( state);
    });
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
