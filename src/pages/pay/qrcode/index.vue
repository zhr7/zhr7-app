<template>
	<view class="content" v-if="loading">
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
					</u-form-item>
					<u-form-item label="消费金额:" prop="name">
						<span class="totalFee">
							￥
						</span>
						<span class="input-label totalFee">{{form.totalFee}}</span>
					</u-form-item>
				</u-form>
				<u-button @click="submit" type="warning" :loading="disabled" :disabled="disabled">确认付款</u-button>
			</view>
			<u-keyboard
				ref="uKeyboard"
				mode="number"
				v-model="keyboard"
				:mask="false"
				:tooltip="false"
				:mask-close-able="false"
				:safe-area-inset-bottom="true"
				:dot-enabled="true"
				:z-index="100"
				@change="onChange"
				@backspace="onBackspace"
			></u-keyboard>
		</template>
		<template v-else>
			<u-alert-tips type="error" :show-icon="true" description="暂不支持此支付通道"></u-alert-tips>
		</template>
		<u-modal v-model="show" title="错误提示" :content="err"></u-modal>
	</view>
</template>

<script>
	// #ifdef H5
	import wx from 'weixin-js-sdk'
	// #endif
    import { parseTime }  from '@/utils'
	export default {
		data() {
			return {
				loading: false,
				name: "",
				disabled: false,
				form: {
					totalFee: ""
				},
        		operatorId: "",
				keyboard: true,
				show: false,
				err: "",
				method: "", //浏览器
				brandId: "",
				qrcodeType: "qrcode",
				code: "",
				openId: "",
			}
		},
		onLoad() {
			// this.hideOptionMenu() // 禁止分享
			this.navigator() // 识别浏览器
			if (this.$route.query.auth_code) {
				this.code = this.$route.query.auth_code
			}
			if (this.$route.query.code) {
				this.code = this.$route.query.code
			}
			if (this.$route.query.operator_id) {
				this.operatorId = this.$route.query.operator_id
			}
			if (this.code) {
				this.oauthToken()
			}
			if (this.method) {
				this.simpleInfo()
			}
		},
		mounted() {
		},
		methods: {
			simpleInfo(){
				if (!this.$route.query.user_id) {
					this.show = true;
					this.err =  "二维码错误!未找到用户信息。"
					return
				}
				this.disabled = true
				this.$u.api.institution.seller.SimpleInfo({ seller: {
					id: this.$route.query.user_id
				}}).then(res =>{
					if (res.seller) {
						this.disabled = false
						this.brandId = res.seller.brandId
						this.name = res.seller.name
					}
					if (res.config) {
						if (!res.config.status) {
							this.show = true;
							this.err =  "商户支付功能关闭。"
							return
						}
						this.qrcodeType = res.config.qrcodeType
            if (this.qrcodeType == "jsapi" && this.code == "") {
				if (res.oauth) {
					this.oauthAppId(res.oauth)
        		} else {
					this.show = true;
					this.err =  "未找到Oauth授权配置"
					return
        		}
            } else {
            	this.loading = true
            }
					}
				}).catch(err => {
					this.show = true;
					this.err =  "获取商户简讯失败。"
					console.log(err)
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
						this.payJsApi()
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
								log(JSON.stringify(data));
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
						if (typeof WeixinJSBridge !== "undefined") {
							// console.log(wechatPackage)
							wechatPackage.timeStamp = wechatPackage.timeStamp.toString()
							WeixinJSBridge.invoke(
								'getBrandWCPayRequest', wechatPackage,
								res => {
									// console.log(res)
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
						break;
					default:
						break;
				}
			},
			payJsApi() {
				if (!this.openId) {
					this.show = true
					this.err =  "获取openid失败"
				}
				this.$u.api.institution.tradeAuth.JsApi({
					userId: this.$route.query.user_id,
					brandId: this.brandId,
					bizContent: {
						method: this.method,
						title: "二维码支付C2B",
						outTradeNo: parseTime(new Date,'{y}{m}{d}{h}{i}{s}{n}') + Math.round(Math.random()*1000),
						totalFee: String(Math.round(this.form.totalFee*100)),
            			operatorId: this.operatorId,
						openId: this.openId,
					}
				}).then(res=>{
					this.disabled = false
					if (res.content.returnCode === "SUCCESS") {
						let wechatPackage = {}
						if (res.content.wechatPackage) {
							wechatPackage = JSON.parse(res.content.wechatPackage)
						}
						this.tradePay(res.content.prepayId, wechatPackage)
					} else {
						// console.log(res)
						this.show = true
						this.err =  res.content.returnMsg
					}
				}).catch(err => {
					this.show = true
					this.err =  "下单失败："+ err
					// console.log(err)
				})
			},
			payQRCode() {
				this.$u.api.institution.tradeAuth.QRCode({
					userId: this.$route.query.user_id,
					brandId: this.brandId,
					bizContent: {
						method: this.method,
						title: "二维码支付C2B",
						outTradeNo: parseTime(new Date,'{y}{m}{d}{h}{i}{s}{n}') + Math.round(Math.random()*1000),
						totalFee: String(Math.round(this.form.totalFee*100)),
            			operatorId: this.operatorId
					}
				}).then(res=>{
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
				if(this.form.totalFee.length>0){
					this.form.totalFee = this.form.totalFee.substring(0,this.form.totalFee.length-1);
				}
			},
			oauthAppId(oauth) {
				const redirect_uri = encodeURIComponent(window.location.href + "&oauth_id=" + oauth.id)
				// console.log(redirect_uri)
				// const redirect_uri = encodeURIComponent("https://wap.bichengbituo.com/pages/pay/qrcode/index?user_id="+ this.$route.query.user_id + "&oauth_id=" + oauth.id)
				switch (this.method) {
					case "alipay":
							window.location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=" +
							oauth.alipay.appId + "&scope=auth_base&redirect_uri=" + redirect_uri
						break;
					case "wechat":
							window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
							oauth.wechat.appId + "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect"
						break;
					default:
						break;
				}
			},
			oauthToken() {
				if (this.$route.query.oauth_id instanceof Array) {
					this.$route.query.oauth_id = this.$route.query.oauth_id[0]
				}
				this.$u.api.pay.oauth.Token({
					oauth: {
						id: this.$route.query.oauth_id,
					},
					method: this.method,
					code: this.code,
				}).then(res=>{
					if (res.openid) {
						this.openId = res.openid
					} else {
						this.show = true
						this.err =  "获取openid失败"
					}
				}).catch(err => {
					this.show = true
					this.err =  "获取openid失败:"+ err
					// console.log(err)
				})
			},
			navigator(){
				if (/MicroMessenger/.test(window.navigator.userAgent)) {
					this.method = "wechat"
				}
				if (/AlipayClient/.test(window.navigator.userAgent)) {
					this.method = "alipay"
				}
				if (/UnionPay/.test(window.navigator.userAgent)) {
					this.method = "unionpay"
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
	.totalFee {
		font-size: 8vw;
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

