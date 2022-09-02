<template>
	<view class="item">
        <view class="top">
			<span class="totalFee">
				充值金额
			</span>
			<span class="input-label">{{totalFee}}</span>
		</view>
		<view class="content">
		</view>
		<view class="k-bottom">
			<u-keyboard 
				ref="uKeyboard" 
				mode="number" 
				class="safe-area-inset-bottom"
				:v-model="true"
				:dot-enabled="true" 
				:tooltip="false"
				confirmText="收款"
				@change="onChange"
				@confirm="onConfirm"
				@backspace="onBackspace"
			>
			</u-keyboard>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
    import uKeyboard from '@/components/uview-ui/components/u-keyboard/u-keyboard.vue'
	import { mapGetters } from 'vuex'
	export default {
		components: { 
			uKeyboard
		},
		computed: {
            ...mapGetters([
				'openid',
				'appid',
			])
		},
		data() {
			return {
                totalFee: "",
                method: "",
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'充值'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
		},
		onLoad(options) {
			// this.$store.dispatch('user/getOpenid')
		},
		mounted() {
            this.init()
		},
		onPullDownRefresh() {
		},
		methods: {
            init() {
                // #ifdef MP-WEIXIN  
                this.method = "wechat"
                // #endif
                // #ifdef MP-ALIPAY  
                this.method = "alipay"
                // #endif
                // #ifdef H5  
                this.navigator()
                // #endif
            },
			onChange(val){
				uni.vibrateShort() // 震动
				if (Number(this.totalFee + val)<1000000) {
					if (this.totalFee === "0" && val != ".") {
						return
					}
					this.totalFee += val;
					this.totalFee = this.totalFee.match(/^\d+(?:\.\d{0,2})?/)[0]
				} else {
					this.totalFee = "1000000"
					this.$refs.uToast.show({
						title: "最大金额不能大于1000000"
					})
				}
			},
            onBackspace(){
				uni.vibrateShort() // 震动
				if(this.totalFee.length>0){
					this.totalFee = this.totalFee.substring(0,this.totalFee.length-1);
				}
			},
            onConfirm(){
				uni.vibrateShort()
				this.$u.api.pay.balance.Deposit({
					bizContent: {
                        method: this.method,
						totalFee: String(Math.round(this.totalFee * 100)),
						openId: this.openid,
						appId: this.appid
					}
				}).then(res=>{
					if (res.content.returnCode === "SUCCESS") {
						const wechatPackage = JSON.parse(res.content.wechatPackage)
						wx.requestPayment({
							"timeStamp": String(wechatPackage.timeStamp),
							"nonceStr":  wechatPackage.nonceStr,
							"package":  wechatPackage.package,
							"signType":  wechatPackage.signType,
							"paySign":  wechatPackage.paySign,
							"success": (res) => {
								uni.showToast({
									duration: 5000,
									icon:'success',
									title:'充值成功',
								})
								this.$store.dispatch('user/getInfo')
							},
							"fail": (res) => {
								console.log(res)
								uni.showToast({
									duration: 5000,
									icon:'error',
									title:'充值失败',
								})
							}
						})
					}else{
						this.$refs.uToast.show({
							title: res.content.returnMsg
						})
					}
				}).catch(err => {
                    console.log(err)
					uni.showToast({
                        duration: 5000,
                        icon:'error',
                        title:'充值失败',
                    })
				})
                this.totalFee = ""
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
		},
        // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
        onReady() {
        }
	}
</script>

<style lang="scss" scoped>
	@import "uview-ui/libs/css/style.components.scss";
	.top {
		background-color: #fff;
		padding: 5vw;
		font-size: 8vw;
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 5vw;
		.success{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.icon {
				color: #67C23A;
				font-size: 60px;
			}
			.title{
				color: #67C23A;
				font-size: 20px;
				margin: 10px;
			}
			.fee{
				font-size: 30px;
			}
		}
	}
	.k-bottom{
		@include vue-flex;
		position: relative;
		position: fixed;
		bottom: 0px;
		// #ifdef MP-ALIPAY
		bottom: 30px;
		// #endif
		left: 0;
	}
</style>

<style scoped>
	.input-label {
		float: right;
	}
	.input-label::before {
		float: right;
		content: " ";
		background-color: #909399;
		letter-spacing: 0.88px;
		margin-left: 2px;
		margin-top: 3px;
		width: 1px;
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