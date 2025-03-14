
// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)

// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const V3 = "https://www.bichengbituo.com/api"
// const V3 = "http://127.0.0.1:8081"
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

				AopF2F: (params = {}) => vm.$u.post('/institution-api/TradeAuth/aopF2F', params),  // 下单
				Query: (params = {}) => vm.$u.post('/institution-api/TradeAuth/query', params),  // 查询
				Refund: (params = {}) => vm.$u.post('/institution-api/TradeAuth/refund', params),  // 退款
				RefundQuery: (params = {}) => vm.$u.post('/institution-api/TradeAuth/refundQuery', params),  // 退款查询
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
				// List: (params = {}) => vm.$u.post('/api/order/order/search', params),
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
				// List: (params = {}) => vm.$u.post('/api/report/report/reportSearch', params) // 报表统计
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
		v3: {
			user: {
				auth: {
					GetRsaPublicKey: (params = {}) => vm.$u.post(V3+'/user/auth/getRsaPublicKey', params),
					Auth: (params = {}) => vm.$u.post(V3+'/user/auth/login', params),
					UserInfo: (params = {}) => vm.$u.post(V3+'/user/auth/userInfo', params),
				},
				order: {
					Search: (params = {}) => vm.$u.post(V3+'/user/order/search', params),
				},
			},
			profit: {
				my: {
					ProfitList: (params = {}) => vm.$u.post(V3+'/profit/my/search', params), // 报表统计
					CashList: (params = {}) => vm.$u.post(V3+'/profit/my/cashSearch', params), // 
					ProfitSumSearch: (params = {}) => vm.$u.post(V3+'/profit/my/sumSearch', params), // 
					ProfitAffirm: (params = {}) => vm.$u.post(V3+'/profit/my/affirm', params), // 
				},
				account: {
					AccountCreateOrUpdate: (params = {}) => vm.$u.post(V3+'/profit/account/createOrUpdate', params), // 报表统计
					AccountGetByUserId: (params = {}) => vm.$u.post(V3+'/profit/account/getByUserId', params), // 
				}
			},
			order: {
				order: {
					Search: (params = {}) => vm.$u.post(V3+'/order/order/search', params), // 
					Amount: (params = {}) => vm.$u.post(V3+'/order/order/amount', params), // 
				}
			},
			wechat: {
			    Code2openid: (params = {}) => vm.$u.post(V3+'/wechat/appid/code2openid', params), // 
				GetByAppid: (params = {}) => vm.$u.post(V3+'/wechat/appid/getByAppid', params), // 
			},
			message: {
				Build: (params = {}) => vm.$u.post(V3+'/message/message/build', params), // 
				Unbuild: (params = {}) => vm.$u.post(V3+'/message/message/unbuild', params), // 
				Search: (params = {}) => vm.$u.post(V3+'/message/message/search', params), // 
			},
			trade: {
				public: {
					SimpleInfo: (params = {}) => vm.$u.post(V3+'/trade/public/simpleInfo', params), // 
					JsApi: (params = {}) => vm.$u.post(V3+'/trade/public/jsApi', params), // 
					QRCode: (params = {}) => vm.$u.post(V3+'/trade/public/qrCode', params), // 	
				},
				auth: {
					QRCode: (params = {}) => vm.$u.post(V3+'/trade/auth/qrCode', params),
					JsApi: (params = {}) => vm.$u.post(V3+'/trade/auth/jsApi', params),
	
					AopF2F: (params = {}) => vm.$u.post(V3+'/trade/auth/aopF2F', params),  // 下单
					Query: (params = {}) => vm.$u.post(V3+'/trade/auth/query', params),  // 查询
					Refund: (params = {}) => vm.$u.post(V3+'/trade/auth/refund', params),  // 退款
					RefundQuery: (params = {}) => vm.$u.post(V3+'/trade/auth/refundQuery', params),  // 退款查询

					BalanceDeposit: (params = {}) => vm.$u.post(V3+'/trade/auth/balanceDeposit', params),	//
				},
			},
			report: {
				report: {
				    ReportSearch: (params = {}) => vm.$u.post(V3+'/report/report/reportSearch', params), //
					ReportAmount: (params = {}) => vm.$u.post(V3+'/report/report/reportAmount', params), //
					ReportInstitutionSearch: (params = {}) => vm.$u.post(V3+'/report/report/reportInstitutionSearch', params),  
					ReportInstitutionAmount: (params = {}) => vm.$u.post(V3+'/report/report/reportInstitutionAmount', params), //
				}
			},
			institution: {
			    institution: {
					Search: (params = {}) => vm.$u.post(V3+'/institution/institution/search', params), // 
					Password: (params = {}) => vm.$u.post(V3+'/institution/institution/password', params), //
				},
				apply: {	//  进件
					List: (params = {}) => vm.$u.post(V3+'/application/application/search', params),	// 
					Create: (params = {}) => vm.$u.post(V3+'/application/application/create', params),	// 
					Update: (params = {}) => vm.$u.post(V3+'/application/application/update', params),
					Delete: (params = {}) => vm.$u.post(V3+'/application/application/delete', params),	// 
					Get: (params = {}) => vm.$u.post(V3+'/application/application/get', params),
					SearchBankInfo: (params = {}) => vm.$u.post(V3+'/application/bankInfo/searchBankInfo', params),	//
					// GetUploadImage: (params = {}) => vm.$u.post(V3+'/storage/file/getUploadImage', params),	//
					//添加通道接口
					CommonSimpleList: (params = {}) => vm.$u.post(V3+'/channel/common/simpleList', params),	
					// CommonCreate: (params = {}) => vm.$u.post(V3+'/channel/common/create', params),	
					// CommonDelete: (params = {}) => vm.$u.post(V3+'/channel/common/delete', params),	
					// CommonUpdate: (params = {}) => vm.$u.post(V3+'/channel/common/update', params),	
					// CommonList: (params = {}) => vm.$u.post(V3+'/channel/common/search', params),	
					ChannelCreate: (params = {}) => vm.$u.post(V3+'/application/channel/create', params),	
					ChannelDelete: (params = {}) => vm.$u.post(V3+'/application/channel/delete', params),	
					ChannelUpdate: (params = {}) => vm.$u.post(V3+'/application/channel/update', params),
					ChannelGet: (params = {}) => vm.$u.post(V3+'/application/channel/get', params), //进件查询
					ChannelSearch: (params = {}) => vm.$u.post(V3+'/application/channel/search', params),	//进件内通道列表
					ContractQuery: (params = {}) => vm.$u.post(V3+'/application/applyment/contractQuery', params),	//进件内合同查询
					ApplymentRealNameQuery: (params = {}) => vm.$u.post(V3+'/application/applyment/applymentRealNameQuery', params),	//进件内实名认证
					ConfigQuery: (params = {}) => vm.$u.post(V3+'/application/wechat/configQuery', params),    //微信配置
					SubAppidConfig: (params = {}) => vm.$u.post(V3+'/application/wechat/subAppidConfig', params),
					JsapiPathConfig: (params = {}) => vm.$u.post(V3+'/application/wechat/jsapiPathConfig', params),
					BankQuery: (params = {}) => vm.$u.post(V3+'/application/bank/bankQuery', params),	//银行信息查询
					BankChange: (params = {}) => vm.$u.post(V3+'/application/bank/bankChange', params),	//银行信息修改
					FeeChange: (params = {}) => vm.$u.post(V3+'/application/fee/feeChange', params),	//费率修改
					FeeSearch: (params = {}) => vm.$u.post(V3+'/application/fee/search', params),	//费率变更记录查询
					FeeQuery: (params = {}) => vm.$u.post(V3+'/application/fee/feeQuery', params),	//费率查询
				},
				tradeAuth: {
					QRCode: (params = {}) => vm.$u.post(V3+'/trade/auth/qrCode', params),
					JsApi: (params = {}) => vm.$u.post(V3+'/trade/auth/jsApi', params),
					AopF2F: (params = {}) => vm.$u.post(V3+'/trade/auth/aopF2F', params),  // 下单
					Query: (params = {}) => vm.$u.post(V3+'/trade/auth/query', params),  // 查询
					Refund: (params = {}) => vm.$u.post(V3+'/trade/auth/refund', params),  // 退款
					RefundQuery: (params = {}) => vm.$u.post(V3+'/trade/auth/refundQuery', params),  // 退款查询
				},
				seller: {
				    SellerSimpleList: (params = {}) => vm.$u.post(V3+'/seller/seller/simpleList', params),  // 获取平台商家信息
					InstitutionSimpleList: (params = {}) => vm.$u.post(V3+'/institution/institution/simpleList', params),  // 获取机构信息
					ProviderSimpleList: (params = {}) => vm.$u.post(V3+'/provider/provider/search', params), //获取软件服务商信息
					Activate: (params = {}) => vm.$u.post(V3+'/qrcode/qrcode/activate', params), //激活付款码
				}

			},
			seller: {
				seller: {
					Search: (params = {}) => vm.$u.post(V3+'/seller/seller/search', params), // 
					Password: (params = {}) => vm.$u.post(V3+'/seller/seller/password', params), //
				}
			},
			storage: {
				file: {
					GetUploadToken: (params = {}) => vm.$u.post(V3+'/storage/file/getUploadToken', params),
					PrivateURL: (params = {}) => vm.$u.post(V3+'/storage/files/getUploadImage', params),
					GetUploadImage: (params = {}) => vm.$u.post(V3+'/storage/file/getUploadImage', params),
					BizLicenseOCR: (params = {}) => vm.$u.post(V3+'/aggregator/ocr/bizLicenseOCR', params),
					IDCardOCR: (params = {}) => vm.$u.post(V3+'/aggregator/ocr/iDCardOCR', params),
					BankCardOCR: (params = {}) => vm.$u.post(V3+'/aggregator/ocr/bankCardOCR', params),
				}
			},

		},
	};
}

export default {
	install
}