<template>
	<view class="content">
		<view v-if="loading">
			<template v-if="method">
				<view class="pay">
					<u-form :model="form" ref="uForm" label-width="190">
						<u-form-item>
							<span class="top">
								<u-icon name="home"></u-icon>
							</span>
							<span class="top-name">
								{{name}}
							</span>
							<span v-if="operatorName" class="top-operatorName">
								{{operatorName}}
							</span>
						</u-form-item>
						<u-form-item label="消费金额:" prop="name">
							<view v-bind:class="outTradeNo?'disabledTotalFee':''">
								<span class="totalFee">
									￥
								</span>
								<span class="totalFee" v-bind:class="outTradeNo?'':'input-label'">{{form.totalFee}}</span>
							</view>
						</u-form-item>
						<u-form-item label="备注信息:" prop="remark" v-show="!outTradeNo">
							<u-input v-model="remark" type="text" :border="true" placeholder="可输入备注信息"/>
						</u-form-item>
					</u-form>
					<!-- <u-button @click="submit" type="warning" :loading="disabled" :disabled="disabled">确认付款</u-button> -->
				</view>
				<view class="k-bottom" v-show="!isJsapi2">
					<u-keyboard
						ref="uKeyboard" 
						mode="number" 
						class="safe-area-inset-bottom"
						:v-model="true"
						:dot-enabled="true" 
						:tooltip="false"
						confirmText="付款"
						@change="onChange"
						@confirm="submit"
						@backspace="onBackspace"
					></u-keyboard>
				</view>
			</template>
			<template v-else>
				<u-alert-tips type="error" :show-icon="true" description="暂不支持此支付通道"></u-alert-tips>
			</template>
		</view>
		<view v-else>
			<u-alert-tips type="error" :show-icon="true" :description="err"></u-alert-tips>
		</view>
		<u-modal v-model="show" title="错误提示" :content="err"></u-modal>
	</view>
</template>

<script>
	import uKeyboard from '@/components/uview-ui/components/u-keyboard/u-keyboard.vue'
    import { parseTime }  from '@/utils'
	export default {
		components: { 
			uKeyboard
		},
		computed: {
			isJsapi2() {
				return this.orderId!=""&&this.code!=""
			}
		},
		data() {
			return {
				loading: false,
				name: "",
				disabled: false,
				form: {
					totalFee: ""
				},
        		operatorId: "",
				operatorName: "", // 收款码明显
				keyboard: true,
				show: false,
				err: "",
				method: "", //浏览器
				brandId: "",
				qrcodeType: "qrcode",
				code: "",
				auth_code: "",
				wechatAppid: uni.getAccountInfoSync?uni.getAccountInfoSync().miniProgram.appId:'',
				openid: "",
				remark: "",
				userId:"",
				orderId:"",
				outTradeNo: "", // 订单编号
			}
		},
		onLoad(options) {
			// uni.setNavigationBarTitle({
			// 	title: "扫码支付",
			// 	transparentTitle: "always"
			// });
			options.user_id = "c6d0c1ba-c37d-4632-8f3b-8a070635f41b"
			// this.hideOptionMenu() // 禁止分享
			this.navigator() // 识别浏览器
			if (options.auth_code) {
				this.auth_code = options.auth_code
			}
			if (options.code) {
				this.code = options.code
			}
			if (options.order_id) {
				this.orderId = options.order_id
			}
			if (options.user_id) {
				this.userId = options.user_id
			}
			if (options.operator_id) {
				this.operatorId = options.operator_id
			}
			if (options.wechat_appid) {
				this.wechatAppid = options.wechat_appid
			}
			
			if (this.method) {
				this.simpleInfo()
			}

			if (this.code && this.wechatAppid) {
				this.wechatOpenid()
			}
			if (this.auth_code) {
				if (options.app_id) {
					this.alipayAppid = options.app_id
				}
				this.err =  JSON.stringify(options)
				this.show = true
				this.alipayOpenid()
			}
		},
		mounted() {
		},
		methods: {
			simpleInfo(){
				this.disabled = true
				this.$u.api.v3.trade.SimpleInfo({ 
					userId: this.userId,
					orderId: this.orderId,
					qrcodeId: this.operatorId,
				}).then(res=>{
					this.disabled = false
					if (!res.channel.status) {
						this.show = true;
						this.err =  "商户支付功能关闭。"
						return
					}
					this.qrcodeType = res.channel.qrcodeType
					this.name = res.seller.name
					this.operatorName = res.qrocde.name
					// uni.setNavigationBarTitle({
					// 	title: this.operatorName+this.name,
					// 	transparentTitle: "always"
					// });
					// #ifdef MP-WEIXIN  
					// 如果是小程序支付则获取openid
					if (this.qrcodeType == "miniprogram") {
						this.wechatMiniProgramOpenid()
					}
					// #endif
					if (this.qrcodeType == "jsapi" && this.code == "") {
						if (this.method == "wechat") {
							this.oauthWechatAppId(res)
						}
					}
					// #ifdef H5
					if (this.method == "alipay") {
						this.oauthAlipayAppId(res)
					}
					// #endif
					// switch (res.order.status) {
					// 	case "CLOSED":
					// 		this.show = true;
					// 		this.err =  "订单已关闭不允许支付"
					// 		return
					// 	case "SUCCESS":
					// 		this.show = true;
					// 		this.err =  "不允许重复支付"
					// 		return
					// }
					// this.outTradeNo = res.order.outTradeNo
					// this.form.totalFee = res.order.totalFee?(res.order.totalFee/100).toFixed(2):""
					// if (this.outTradeNo) { // 若果有订单编号，则使用jsapi方式支付
					// 	this.qrcodeType = "jsapi"
					// }
				
					this.loading = true
				}).catch(err=>{
					console.error(err);
					this.err =  "获取简讯失败。" + JSON.stringify(err)
					this.show = true
				})
			},
			submit() {
				uni.vibrateShort() // 震动
				if (Math.round(this.form.totalFee*100)<=0) {
					this.show = true
					this.err =  "请输入下单金额"
					return
				}
				this.disabled = true
				switch (this.qrcodeType) {
					case "jsapi":
						this.payJsApi("jsapi")
						break;
					case "miniprogram":
						this.payJsApi("miniprogram")
						break;
					case "qrcode":
						this.payQRCode()
						break;
					default:
						this.show = true;
						this.err =  "未知支付方式"
						break;
				}
			},
			tradePay(prepayId, wechatPackage) {
				switch (this.method) {
					case "alipay":
						if (typeof AlipayJSBridge !== "undefined") {
							AlipayJSBridge.call("tradePay", {
								tradeNO: prepayId
							}, (data) => {
								if ("9000" == data.resultCode) {
									uni.showToast({
										duration: 10000,
										icon:'success',
										title:'支付成功',
									})
								}
							})
						}else{
							this.show = true
							this.err =  "未找到AlipayJSBridge请用支付宝扫码"
						}
						break;
					case "wechat":
						wechatPackage.timeStamp = wechatPackage.timeStamp.toString()
						if (this.qrcodeType == "jsapi") {
							if (typeof WeixinJSBridge !== "undefined") {
								WeixinJSBridge.invoke(
									'getBrandWCPayRequest', wechatPackage,
									res => {
										if(res.err_msg == "get_brand_wcpay_request:ok" ){
											uni.showToast({
												duration: 10000,
												icon:'success',
												title:'支付成功',
											})
										}
									}
								)
							}else{
								this.show = true
								this.err =  "未找到WeixinJSBridge请用微信扫码"
							}
						}
						if (this.qrcodeType == "miniprogram") {
							wx.requestPayment({
								"timeStamp": String(wechatPackage.timeStamp),
								"nonceStr":  wechatPackage.nonceStr,
								"package":  wechatPackage.package,
								"signType":  wechatPackage.signType,
								"paySign":  wechatPackage.paySign,
								"success": (res) => {
									uni.showToast({
										duration: 10000,
										icon:'success',
										title:'支付成功',
									})
								},
								"fail": (res) => {
									uni.showToast({
										duration: 10000,
										icon:'error',
										title:'支付失败',
									})
								}
							})
						}
						break;
					default:
						break;
				}
			},
			payJsApi(tradeType) {
				this.$u.api.v3.trade.JsApi({
					userId: this.userId,
					bizContent: {
						method: this.method,
						title: this.getTitle(),
						outTradeNo: this.outTradeNo?this.outTradeNo:parseTime(new Date,'{y}{m}{d}{h}{i}{s}{n}') + Math.round(Math.random()*1000),
						totalFee: String(Math.round(this.form.totalFee*100)),
            			operatorId: this.operatorId,
						openId: this.openid,
						appId: this.wechatAppid,
						tradeType: tradeType,
					}
				}).then(res=>{
					this.disabled = false
					if (res.returnCode === "SUCCESS") {
						let wechatPackage = {}
						if (res.wechatPackage) {
							wechatPackage = JSON.parse(res.wechatPackage)
							this.tradePay(res.prepayId, wechatPackage)
						}else{
							this.show = true
							this.err =  res.returnMsg
						}
					} else {
						// console.log(res)
						this.show = true
						this.err =  res.returnMsg
					}
				}).catch(err => {
					this.show = true
					this.err =  "下单失败："+ err
					// console.log(err)
				})
			},
			payQRCode() {
				const req = {
					userId: this.userId,
					bizContent: {
						method: this.method,
						title: this.getTitle(),
						outTradeNo: parseTime(new Date,'{y}{m}{d}{h}{i}{s}{n}') + Math.round(Math.random()*1000),
						totalFee: String(Math.round(this.form.totalFee*100)),
            			operatorId: this.operatorId
					}
				}
				this.$u.api.institution.tradeAuth.QRCode(req).then(res=>{
					this.disabled = false
					if (res.content.returnCode === "SUCCESS") {
						if (res.content.qrcode) {
							window.location.href = res.content.qrcode
						} else {
							console.log(res)
						}
					} else {
						console.log(res)
						this.show = true
						this.err =  res.content.returnMsg
					}
				}).catch(err => {
					this.show = true
					this.err =  "下单失败："+ err
					// console.log(err)
				})
			},
			hideOptionMenu(){
				// #ifdef H5
				wx.hideOptionMenu()
				// #endif
			},
			onChange(val){
				uni.vibrateShort() // 震动
				if (this.outTradeNo) { // 如果有订单号，则不能改变订单金额
					return
				}
				if (Number(this.form.totalFee + val)<1000000) {
					if (this.form.totalFee === "0" && val != ".") {
						return
					}
					this.form.totalFee += val;
					this.form.totalFee = this.form.totalFee.match(/^\d+(?:\.\d{0,2})?/)[0]
				}
			},
			onBackspace(e){
				uni.vibrateShort() // 震动
				if (this.outTradeNo) { // 如果有订单号，则不能删除
					return
				}
				if(this.form.totalFee.length>0){
					this.form.totalFee = this.form.totalFee.substring(0,this.form.totalFee.length-1);
				}
			},
			oauthWechatAppId(res) {
				const redirect_uri = encodeURIComponent("https://wap.bichengbituo.com/pages/pay/qrcode/mp/index?user_id="+this.userId+"&operator_id="+this.operatorId+"&order_id="+this.orderId+"&wechat_appid=" + res.channel.oauthWechatAppid)
				this.locationHref = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + res.channel.oauthWechatAppid + "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect"
				window.location.href = 	this.locationHref
				console.log(this.locationHref);
			},
			oauthAlipayAppId(res) {
				const redirect_uri = encodeURIComponent("https://wap.bichengbituo.com/pages/pay/qrcode/mp/index?user_id="+this.userId+"&operator_id="+this.operatorId+"&order_id="+this.orderId)
				window.location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=" +
							res.channel.oauthAlipayAppid + "&scope=auth_base&redirect_uri=" + redirect_uri
				
			},
			wechatMiniProgramOpenid() {
				uni.login({
					provider: 'weixin',
					success: res => {
						if (res.errMsg === "login:ok") {
							this.code = res.code
							this.wechatOpenid()
						}
					}
				})
			},
			wechatOpenid() {
				if (this.wechatAppid) {
					this.$u.api.v3.wechat.Code2openid({
					code: this.code,
					appid: this.wechatAppid
				}).then(res=>{
					if (res.openid) {
						this.openid = res.openid
					}else{
					uni.showToast({
						duration: 5000,
						icon:'error',
						title:'未能获取openid',
					})
					}
				}).catch(err => {
					console.error(err)
					uni.showToast({
						duration: 5000,
						icon:'error',
						title: err.data,
					})
				})
				}else{
					this.show = true
					this.err =  "微信Appid为空"
				}
			},
			alipayOpenid() {
				console.log(122112);
			},
			navigator(){
				// #ifndef MP-WEIXIN  
					if (/MicroMessenger/.test(window.navigator.userAgent)) {
						this.method = "wechat"
					}
					if (/AlipayClient/.test(window.navigator.userAgent)) {
						this.method = "alipay"
					}
					if (/UnionPay/.test(window.navigator.userAgent)) {
						this.method = "unionpay"
					}
				// #endif
				// #ifdef MP-WEIXIN  
					this.method = "wechat"
				// #endif
			},
			getTitle() {
				if (this.remark) {
					return this.operatorName?"C2B-"+this.operatorName+"-"+this.remark:"C2B-"+this.remark
				}else{
					return this.operatorName?"C2B-"+this.operatorName:"C2B二维码支付"
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 5vw;
	}

	.pay{
		width: 95vw;
		border-radius: 5px;
		border: 1px solid #c8c9cc;
		box-shadow: 5px 5px 2px #c8c9cc;
		padding: 5vw;
		background-color: #fff;
		padding-bottom: 10vw;
		z-index:200
	}
	.top{
		font-size: 6vw;
		color:#2b85e4;
	}
	.top-name{
		padding-left: 3vw;
		font-size: 5vw;
		font-weight: 900;
	}
	.top-operatorName{
		padding-left: 3vw;
		font-weight: 900;
		font-size: 3vw;
		color: #909399;
	}
	.totalFee {
		font-size: 8vw;
	}
	.k-bottom{
		position: relative;
		position: fixed;
		bottom: 0px;
		left: 0;
	}
	.disabledTotalFee{
		color: #909399;
	}
</style>
<style scoped>
	.input-label::before {
		float: right;
		content: " ";
		background-color: #ff9900;
		letter-spacing: 0.88px;
		width: 2px;
		height: 9vw;
		animation: cursor-blinks 1.5s infinite steps(1, start);
	}

	@keyframes cursor-blinks {
		0% {
			opacity: 1;
			display: block;
		}
		50% {
			opacity: 0;
			display: none;
		}
		100% {
			opacity: 1;
			display: block;
		}
	}
</style>

