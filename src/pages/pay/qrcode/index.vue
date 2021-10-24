<template>
	<view class="content">
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
					<u-form-item>
						设备ID: {{ deviceId }}
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
				name: "",
				disabled: false,
				form: {
					totalFee: ""
				},
				deviceId: "",
				keyboard: true,
				show: false,
				err: "",
				method: "alipay", //浏览器
				alipayUserId: "",
				brandId: "",
			}
		},
		onLoad() {
		},
		mounted() {
			this.hideOptionMenu() // 禁止分享
			this.navigator()
			if (this.$route.query.auth_code) {
				this.oauthToken()
			}else{
				this.oauthAppId()
			}
			if (this.method) {
				this.simpleInfo()
			}
			uni.getSystemInfo({
				success:(res) => {
					this.deviceId = res.deviceId
				}
			})
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
				if (this.alipayUserId) {
					this.payJsApi()
				} else {
					this.payQRCode()
				}
			},
			tradePay(prepayId) {
				if (window.AlipayJSBridge) { 
					window.AlipayJSBridge.call("tradePay", {
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
			},
			payJsApi() {
				console.log(123);
				let openId = ""
				if (this.alipayUserId) {
					openId = this.alipayUserId
				}
				this.$u.api.pay.tradeAuth.JsApi({
					userId: this.$route.query.user_id,
					brandId: this.brandId,
					bizContent: {
						method: this.method,
						title: "二维码支付C2B",
						outTradeNo: parseTime(new Date,'{y}{m}{d}{h}{i}{s}{n}') + Math.round(Math.random()*1000),
						totalFee: String(Math.round(this.form.totalFee*100)),
						terminalId: this.deviceId,
						openId: openId,
					}
				}).then(res=>{
					this.disabled = false
					if (res.content.prepayId) {
						this.tradePay(res.content.prepayId)
					}
				}).catch(err => {
					this.show = true
					this.err =  "下单失败："+ err
					console.log(err);
				})
			},
			payQRCode() {
				this.$u.api.pay.tradeAuth.QRCode({
					userId: this.$route.query.user_id,
					brandId: this.brandId,
					bizContent: {
						method: this.method,
						title: "二维码支付C2B",
						outTradeNo: parseTime(new Date,'{y}{m}{d}{h}{i}{s}{n}') + Math.round(Math.random()*1000),
						totalFee: String(Math.round(this.form.totalFee*100)),
						terminalId: this.deviceId
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
					console.log(err);
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
			oauthAppId() {
				this.$u.api.pay.tradeAuth.OauthAppId({
					userId: this.$route.query.user_id,
					bizContent: {
						method: this.method,
					}
				}).then(res=>{
					if (res.content.oauthAppId) {
						const redirect_uri = encodeURIComponent(window.location.href)
						window.location.href = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=" +
						res.content.oauthAppId + "&scope=auth_base&redirect_uri=" + redirect_uri
						
					}
				}).catch(err => {
					this.show = true
					this.err =  "下单失败："+ err
					console.log(err);
				})
			},
			oauthToken() {
				this.$u.api.pay.tradeAuth.OauthToken({
					userId: this.$route.query.user_id,
					bizContent: {
						method: this.method,
						oauthCode: this.$route.query.auth_code,
					}
				}).then(res=>{
					if (res.content.alipayUserId) {
						this.alipayUserId = res.content.alipayUserId
					}
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