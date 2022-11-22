// #ifdef APP-PLUS
const FvvUniTTS = uni.requireNativePlugin("Fvv-UniTTS");
// #endif
const state = {
  isTtsInit: false,
  // 语音播报队列
  ttsQueue: [],
  // 队列锁
  ttsLock: true,
}

const mutations = {
}

const actions = {
  init({ commit,state }) {
	// #ifdef APP-PLUS
	FvvUniTTS.init((callback) => {
		state.isTtsInit = true
		// actions.speak({ commit,state }, {text:"欢迎使用必诚付",id:"1"})
	},'com.iflytek.speechcloud');
	// #endif
	// #ifdef MP-ALIPAY
	state.isTtsInit = true
	//  #endif
	// 消费队列
	setInterval(() => {
		if (state.ttsQueue.length > 0 && state.ttsLock) {
			 // 出队
			const data = state.ttsQueue.shift()
			actions.speak({ commit,state }, data)
		}
	}, 500)
  },
  order({ commit,state },order) {
	if (new Date(order.created_at).getTime() < new Date(new Date(new Date().toLocaleDateString()).getTime())) {
	  console.log('非当天订单不播报');
	  return
	}
	if (order.total_fee) {
	  order.totalFee = order.total_fee
	}
	switch (order.method) {
	  case 'wechat':
	    order.method = '微信'
		break
	  case 'alipay':
	    order.method = '支付宝'
		break
	  case 'unionpay':
	    order.method = '银联'
		break
	  case 'digital':
	    order.method = '数字人民币'
		break
	  case 'sdykt':
	    order.method = '山东一卡通'
		break
	}
	// 替换.00为空防止播报两百点零零元
	let text = "收款"+((order.totalFee ? Number(order.totalFee) : 0)/100).toFixed(2).replace(/\.00/g, '')+"元"
	if (order.operatorName) {
	  text = order.operatorName+text
	}else{
	  text = order.method+text
	}
	// 增加队列
	state.ttsQueue.push({text:text,id:order.id})
  },
  speak({ commit,state },{text,id}) {
	if (state.isTtsInit ) {
		state.ttsLock = false //上锁
		// #ifdef APP-PLUS
		FvvUniTTS.speak({
			text: text,
			id:id,
		})
		FvvUniTTS.onDone((id) => {
			state.ttsLock = true //开锁
		})
		// #endif
		// #ifdef MP-ALIPAY
		my.showToast({
			type: 'success',
			content: text,
			duration: 10000,
		})
		my.ix.speech({
			text: text,
			success: (r) => {
				state.ttsLock = true //开锁
			},
			fail: (r) => {
				state.ttsQueue.push({text:text,id:order.id})
				state.ttsLock = true //开锁
			}
		})
		//  #endif
	}else{
		uni.showToast({
			duration: 3000,
			icon:'error',
			title: "播报未初始化",
		})
	}
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
