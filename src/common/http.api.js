// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)

// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
	// 此处使用了传入的params参数，一切自定义即可
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = { 
		user: {
			auth: {
				Auth: (params = {}) => vm.$u.post('/user-api/auth/auth', params),
				MobileAuth: (params = {}) => vm.$u.post('/user-api/auth/mobile', params),
			},
			user: {
				UserInfo: (params = {}) => vm.$u.post('/user-api/users/info', params),
				UserSelfUpdate: (params = {}) => vm.$u.post('/user-api/users/selfUpdate', params),
				SelfUpdate: (params = {}) => vm.$u.post('/user-api/users/selfUpdate', params),
			}
		},
		institution: {
			seller: {
				SimpleInfo: (params = {}) => vm.$u.post('/institution-api/sellers/simpleInfo', params),	// 获取商户简讯
			},
		},
		pay: {
			tradeAuth: {
				AopF2F: (params = {}) => vm.$u.post('/pay-api/TradeAuth/aopF2F', params),  // 下单
				Query: (params = {}) => vm.$u.post('/pay-api/TradeAuth/query', params),  // 查询
				Refund: (params = {}) => vm.$u.post('/pay-api/TradeAuth/refund', params),  // 退款
				RefundQuery: (params = {}) => vm.$u.post('/pay-api/TradeAuth/refundQuery', params),  // 退款查询
				QRCode: (params = {}) => vm.$u.post('/pay-api/TradeAuth/QRCode', params),
			},
			order: {
				Amount: (params = {}) => vm.$u.post('/pay-api/orders/amount', params),
				List: (params = {}) => vm.$u.post('/pay-api/orders/list', params),
			},
			config: {
				SimpleInfo: (params = {}) => vm.$u.post('/pay-api/configs/simpleInfo', params),	// 获取商户简讯
			},
			report: { // 报表
				Amount: (params = {}) => vm.$u.post('/pay-api/reports/amount', params) // 报表统计
			},
		}
	};
}

export default {
	install
}