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
			<view class="k-bottom" v-show="isJsapi2">
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
		<u-modal v-model="show" title="错误提示" :content="err"></u-modal>
	</view>
</template>

<script>
	import uKeyboard from '@/components/uview-ui/components/u-keyboard/u-keyboard.vue'
	// #ifdef H5
	import wx from 'weixin-js-sdk'
	// #endif
    import { parseTime }  from '@/utils'
	export default {
		components: { 
			uKeyboard
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
				method: "wechat", //浏览器
				brandId: "",
				qrcodeType: "qrcode",
				code: "",
				openId: "",
				remark: "",
				userId:"",
				outTradeNo: "", // 订单编号
			}
		},
		computed: {
			isJsapi2() {
				return this.code!=""&&this.outTradeNo!=""
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
			if (this.method) {
				this.simpleInfo()
			}
			if (this.code) {
				this.oauthToken()
			}
		},
		mounted() {
		},
		methods: {
			simpleInfo(){
				this.disabled = true
				this.$u.api.institution.trade.SimpleInfo({ 
					userId: this.$route.query.user_id,
					orderId: this.$route.query.order_id,
					qrcodeId: this.$route.query.operator_id,
				}).then(res=>{
					this.disabled = false
					this.brandId = res.brandId
					this.name = res.sellerName
					this.operatorName = res.qrcodeName
					this.userId = res.userId
					if (!res.configStatus) {
						this.show = true;
						this.err =  "商户支付功能关闭。"
						return
					}
					this.qrcodeType = res.configQrcodeType
					this.outTradeNo = res.outTradeNo
					this.form.totalFee = res.totalFee?(res.totalFee/100).toFixed(2):""
					if (this.outTradeNo) { // 若果有订单编号，则使用jsapi方式支付
						this.qrcodeType = "jsapi"
					}
					if (this.qrcodeType == "jsapi") {
						if (this.code == "") {
							if (res.oauthId) {
								this.oauthAppId(res)
							} else {
								this.show = true;
								this.err =  "未找到Oauth授权配置"
								return
							}
						}else{
							this.loading = true
						}
					} else {
						this.loading = true
					}
				}).catch(err=>{
					this.err =  "获取简讯失败。"
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
									console.log(res)
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
				const req = {
					userId: this.userId,
					brandId: this.brandId,
					bizContent: {
						method: this.method,
						title: this.getTitle(),
						outTradeNo: this.outTradeNo?this.outTradeNo:parseTime(new Date,'{y}{m}{d}{h}{i}{s}{n}') + Math.round(Math.random()*1000),
						totalFee: String(Math.round(this.form.totalFee*100)),
            			operatorId: this.operatorId,
						openId: this.openId,
					}
				}
				this.$u.api.institution.tradeAuth.JsApi(req).then(res=>{
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
				const req = {
					userId: this.userId,
					brandId: this.brandId,
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
			oauthAppId(res) {
				const redirect_uri = encodeURIComponent(window.location.href + "&oauth_id=" + res.oauthId)
				// console.log(redirect_uri)
				// const redirect_uri = encodeURIComponent("https://wap.bichengbituo.com/pages/pay/qrcode/index?"+ window.location.href.split("?")[1]+ "&oauth_id=" + res.oauthId)
				
				switch (this.method) {
					case "alipay":
							window.location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=" +
							res.oauthAlipayAppid + "&scope=auth_base&redirect_uri=" + redirect_uri
						break;
					case "wechat":
							window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
							res.oauthWechatAppid + "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect"
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
						if (this.outTradeNo) { // 订单聚合时直接拉起支付
							this.payJsApi()
						}
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

