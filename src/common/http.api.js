// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)

// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
	// 此处使用了传入的params参数，一切自定义即可
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = { 
		user: {
			order: {
				List: (params = {}) => vm.$u.post('/user-api/orders/list', params),	// 
				Get: (params = {}) => vm.$u.post('/user-api/orders/get', params),
			},
			config: {
				Get: (params = {}) => vm.$u.post('/user-api/configs/get', params)
			},
			auth: {
				Auth: (params = {}) => vm.$u.post('/user-api/auth/auth', params),
				MobileAuth: (params = {}) => vm.$u.post('/user-api/auth/mobile', params),
			},
			user: {
				Exist: (params = {}) => vm.$u.post('/user-api/users/exist', params),
				UserInfo: (params = {}) => vm.$u.post('/user-api/users/info', params),
				UserSelfUpdate: (params = {}) => vm.$u.post('/user-api/users/selfUpdate', params),
				SelfUpdate: (params = {}) => vm.$u.post('/user-api/users/selfUpdate', params),
			},
			secretKey: {
				SelfGet: (params = {}) => vm.$u.post('/user-api/secret-keys/self-get', params),
				SelfUpdate: (params = {}) => vm.$u.post('/user-api/secret-keys/self-update', params)
			}
		},
		institution: {
			apply: {	//  进件
				List: (params = {}) => vm.$u.post('/institution-api/applys/list', params),	// 
				Create: (params = {}) => vm.$u.post('/institution-api/applys/create', params),	// 
				Update: (params = {}) => vm.$u.post('/institution-api/applys/update', params),
				Delete: (params = {}) => vm.$u.post('/institution-api/applys/delete', params),	// 
				Get: (params = {}) => vm.$u.post('/institution-api/applys/get', params),
			},
			trade: {
				SimpleInfo: (params = {}) => vm.$u.post('/institution-api/trades/simpleInfo', params),
			},
			tradeAuth: {
				QRCode: (params = {}) => vm.$u.post('/institution-api/TradeAuth/QRCode', params),
				JsApi: (params = {}) => vm.$u.post('/institution-api/TradeAuth/JsApi', params),
			},
			institution: {
				Password: (params = {}) => vm.$u.post('/institution-api/institutions/password', params),
				SimpleInfo: (params = {}) => vm.$u.post('/institution-api/institutions/simpleInfo', params),	// 
				Create: (params = {}) => vm.$u.post('/institution-api/institutions/create', params),	// 
				Get: (params = {}) => vm.$u.post('/institution-api/institutions/get', params),	// 
				List: (params = {}) => vm.$u.post('/institution-api/institutions/list', params),	// 
				Update: (params = {}) => vm.$u.post('/institution-api/institutions/update', params),	// 
				Delete: (params = {}) => vm.$u.post('/institution-api/institutions/delete', params),	// 
				SelfChildren: (params = {}) => vm.$u.post('/institution-api/institutions/selfChildren', params),
				SelfInfo: (params = {}) => vm.$u.post('/institution-api/institutions/selfInfo', params),
			},
			seller: {
				SimpleInfo: (params = {}) => vm.$u.post('/institution-api/sellers/simpleInfo', params),	// 获取商户简讯
				List: (params = {}) => vm.$u.post('/institution-api/sellers/list', params),	// 
				Password: (params = {}) => vm.$u.post('/institution-api/sellers/password', params),
				Create: (params = {}) => vm.$u.post('/institution-api/sellers/create', params),	// 
				Update: (params = {}) => vm.$u.post('/institution-api/sellers/update', params),
				Delete: (params = {}) => vm.$u.post('/institution-api/sellers/delete', params),	// 
				Get: (params = {}) => vm.$u.post('/institution-api/sellers/get', params),
				SimpleList: (params = {}) => vm.$u.post('/institution-api/sellers/simpleList', params),	// 
			},
			order: {
				Amount: (params = {}) => vm.$u.post('/institution-api/orders/amount', params),
				List: (params = {}) => vm.$u.post('/institution-api/orders/list', params),	
			},
			provider: {
				SimpleInfo: (params = {}) => vm.$u.post('/institution-api/providers/simpleInfo', params),	// 
			},
			device: {
				List: (params = {}) => vm.$u.post('/institution-api/devices/list', params),	
				Update: (params = {}) => vm.$u.post('/institution-api/devices/update', params),
				Create: (params = {}) => vm.$u.post('/institution-api/devices/create', params),
				Delete: (params = {}) => vm.$u.post('/institution-api/devices/delete', params),
			},
			qrcode: {
				List: (params = {}) => vm.$u.post('/institution-api/qrcodes/list', params),	
				Update: (params = {}) => vm.$u.post('/institution-api/qrcodes/update', params),
				Create: (params = {}) => vm.$u.post('/institution-api/qrcodes/create', params),
				Delete: (params = {}) => vm.$u.post('/institution-api/qrcodes/delete', params),
				SimpleInfo: (params = {}) => vm.$u.post('/institution-api/qrcodes/simpleInfo', params),
			},
			sellerReport: {
				Amount: (params = {}) => vm.$u.post('/institution-api/sellerReports/amount', params), // 报表统计
				List: (params = {}) => vm.$u.post('/institution-api/sellerReports/list', params) // 报表统计
			},
			institutionReport: {
				Amount: (params = {}) => vm.$u.post('/institution-api/institutionReports/amount', params), // 报表统计
				List: (params = {}) => vm.$u.post('/institution-api/institutionReports/list', params) // 报表统计
			}
		},
		pay: {
			balance: {
				Deposit: (params = {}) => vm.$u.post('/pay-api/balances/deposit', params),	//
				Token: (params = {}) => vm.$u.post('/pay-api/balances/token', params),	//
			},
			tradeAuth: {
				AopF2F: (params = {}) => vm.$u.post('/pay-api/TradeAuth/aopF2F', params),  // 下单
				Query: (params = {}) => vm.$u.post('/pay-api/TradeAuth/query', params),  // 查询
				Refund: (params = {}) => vm.$u.post('/pay-api/TradeAuth/refund', params),  // 退款
				RefundQuery: (params = {}) => vm.$u.post('/pay-api/TradeAuth/refundQuery', params),  // 退款查询
				QRCode: (params = {}) => vm.$u.post('/pay-api/TradeAuth/QRCode', params),
				JsApi: (params = {}) => vm.$u.post('/pay-api/TradeAuth/JsApi', params),
				OauthAppId: (params = {}) => vm.$u.post('/pay-api/TradeAuth/oauthAppId', params),
				OauthToken: (params = {}) => vm.$u.post('/pay-api/TradeAuth/oauthToken', params),
			},
			oauth: {
				Token: (params = {}) => vm.$u.post('/pay-api/oauths/token', params),
				List: (params = {}) => vm.$u.post('/pay-api/oauths/list', params),
				Update: (params = {}) => vm.$u.post('/pay-api/oauths/update', params),
				Create: (params = {}) => vm.$u.post('/pay-api/oauths/create', params),
				Delete: (params = {}) => vm.$u.post('/pay-api/oauths/delete', params),
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
		},
		message: {
			device: {
				List: (params = {}) => vm.$u.post('/message-api/devices/list', params),
				Update: (params = {}) => vm.$u.post('/message-api/devices/update', params),
				Create: (params = {}) => vm.$u.post('/message-api/devices/create', params),
				Delete: (params = {}) => vm.$u.post('/message-api/devices/delete', params),
			}
		},
		storage: {
			file: {
				Token: (params = {}) => vm.$u.post('/storage-api/files/token', params),
				PrivateURL: (params = {}) => vm.$u.post('/storage-api/files/privateURL', params)
			}
		},
		icbcjft: {
			register: {
				H5Register: (params = {}) => vm.$u.post('/icbcjft/registers/h5Register', params)
			}
		},
	};
}

export default {
	install
}