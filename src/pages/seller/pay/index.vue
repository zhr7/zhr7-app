<template>
	<view>
		<view class="top">
			<span class="totalFee">
				收款金额
			</span>
			<span class="input-label">{{totalFee}}</span>
		</view>
		<view class="content">
			<u-button size="medium" v-if="cancel!==0&&successTotalFee===0" @click="cancel=-1">取消收款</u-button>
			<view v-if="successTotalFee" class="success">
				<u-icon class="icon" name="checkbox-mark"></u-icon>
				<view class="title">支付成功</view>
				<view class="fee">￥{{successTotalFee}}</view>
			</view>	
			<view>	
				设备ID: {{ deviceId }}
			</view>	
		</view>
		<u-keyboard 
			ref="uKeyboard" 
			mode="number" 
			class="bottom safe-area-inset-bottom"
			:v-model="true"
			:dot-enabled="true" 
			:tooltip="false"
			confirmText="收款"
			@change="onChange"
			@confirm="onConfirm"
			@backspace="onBackspace"
		>
		</u-keyboard>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	import uKeyboard from '@/components/uview-ui/components/u-keyboard/u-keyboard.vue'
	import { parseTime }  from '@/utils'
	export default {
		components: { 
			uKeyboard
		},
		data() {
			return {
				totalFee: "",
				cancel: 0,
				successTotalFee: 0,
				deviceId: "",
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'收银'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
		},
		mounted() {
			uni.getSystemInfo({
				success:(res) => {
					this.deviceId = res.deviceId
				}
			})
		},
		methods: {
			onChange(val){
				this.cancel = 0
				this.successTotalFee = 0
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
				this.cancel = 0
				this.successTotalFee = 0
				uni.vibrateShort()
				if(this.totalFee.length>0){
					this.totalFee = this.totalFee.substring(0,this.totalFee.length-1);
				}
			},
			onConfirm(){
				this.cancel = 0
				this.successTotalFee = 0
				uni.vibrateShort()
				this.disabled = true
				uni.scanCode({
					scanType: ['qrCode'],
					onlyFromCamera: true,
					success:(res) =>{
						this.aopF2F(res.result, Math.round(this.totalFee * 100))
					}
				})
			},
			aopF2F(code, totalFee) {
				this.cancel = 1
				uni.showLoading({
					title:'收款下单中'
				})
				const order = {
					bizContent: {
						authCode: code,
						outTradeNo: parseTime(new Date,'{y}{m}{d}{h}{i}{s}{n}') + Math.round(Math.random()*1000),
						title: "二维码收款B2C",
						totalFee: String(totalFee),
						terminalId: this.deviceId,
					}
				}
				this.$u.api.pay.tradeAuth.AopF2F(order).then(res=>{
					if (res.content.returnCode === 'SUCCESS' && res.content.status === 'SUCCESS') {
						uni.showToast({
                            duration: 5000,
                            icon:'success',
                            title:'收款成功',
                        })
						this.successTotalFee = this.totalFee
						this.totalFee = ""
					} else {
						this.Query(order)
					}
				}).catch(err => {
					this.Query(order)
				})
			},
			Query(order){
				if (this.cancel==-1) {
					uni.showToast({
                        duration: 3000,
                        icon:'success',
                        title:'已取消收款',
                    })
					return
				}
				uni.showLoading({
					title:'收款查询中'
				})
				this.$u.api.pay.tradeAuth.Query(order).then(res => {
					if (res.content.returnCode === 'SUCCESS') {
						switch (res.content.status) {
							case 'SUCCESS':
								uni.showToast({
                                    duration: 10000,
                                    icon:'success',
                                    title:'收款成功',
                                })
								this.totalFee = ""
								break;
							case 'USERPAYING':
								uni.showToast({
                                    duration: 5000,
                                    icon:'loading',
                                    title:'等待用户付款',
                                })
								setTimeout(() => {
									this.Query(order)
								}, 3000)
								break;
							case 'WAITING':
								uni.showToast({
                                    duration: 5000,
                                    icon:'loading',
                                    title:'系统方繁忙稍后查询',
                                })
								setTimeout(() => {
									this.Query(order)
								}, 3000)
							case 'CLOSED':
								uni.showToast({
                                    duration: 5000,
                                    icon:'error',
                                    title:'订单已关闭',
                                })
								break;
							default:
								break;
						}
					}

				}).catch(error => {
					uni.showToast({
                        duration: 5000,
						icon:'error',
						title:'查询失败!请到流水里面查询'
					})
				})
			}
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
	.bottom{
		@include vue-flex;
		position: relative;
		position: fixed;
		bottom: 50px;
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