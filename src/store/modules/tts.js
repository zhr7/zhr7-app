// #ifdef APP-PLUS
const FvvUniTTS = uni.requireNativePlugin("Fvv-UniTTS");
// #endif
const state = {
  isTtsInit: false,
}

const mutations = {
}

const actions = {
  init({ commit,state }) {
	FvvUniTTS.init((callback) => {
		state.isTtsInit = true
		// actions.speak({ commit,state }, {text:"欢迎使用必诚付",id:"1"})
	},'com.iflytek.speechcloud');
  },
  order({ commit,state },order) {
	if (new Date(order.created_at).getTime() < new Date(new Date(new Date().toLocaleDateString()).getTime())) {
	  console.log('非当天订单不播报');
	  return
	}
	if (order.total_fee) {
	  order.totalFee = order.total_fee
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
	actions.speak({ commit,state }, {text:text,id:order.id})
  },
  speak({ commit,state },{text,id}) {
	if (state.isTtsInit ) {
		FvvUniTTS.speak({
			text: text,
			id:id,
		})
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
