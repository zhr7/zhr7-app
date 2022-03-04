<template>
	<view class="item">
		<view class="line">
			<span class="info" v-if="item.method==='alipay'">
				<m-icon name="zhifubao" custom-prefix="colour-icon" class="38">></m-icon><br>
				支付宝
			</span>
			<span class="info" v-if="item.method==='wechat'">
				<m-icon name="weixinzhifu" custom-prefix="colour-icon" class="38">></m-icon><br>
				微信支付
			</span>
			<span class="info" v-if="item.method==='unionpay'">
				<m-icon name="yunshanfu" custom-prefix="colour-icon" class="38"></m-icon><br>
				云闪付
			</span>
			<span class="info" v-if="item.method==='digital'">
				<m-icon name="yunshanfu" custom-prefix="colour-icon" class="38"></m-icon><br>
				数字货币
			</span>
			<view>
				<view class="totalFee">￥{{(item.totalFee/100).toFixed(2) }}</view>
				<view class="right info">订单金额</view>
			</view>
		</view>
		<u-line />
		<view class="line" v-if="item.refundFee">
			<view class="">已退款金额</view>
			<view class="refundFee">￥{{(item.refundFee/100).toFixed(2) }}</view>
		</view>	
		<view class="line">
			<u-form :model="form" ref="uForm" :border-bottom="false" label-width="150" style="width:100%">
				<u-form-item label="退款金额"><u-input v-model="form.refundFee" @click="clickInput" @blur="clickBlur" :border="true" type="digit" placeholder="请输入退款金额" /></u-form-item>
				<u-form-item label="退款原因"><u-input v-model="form.attach" :border="true" type="textarea" placeholder="可以输入退款原因" /></u-form-item>
			</u-form>
		</view>	
		<u-line />
		<view class="bottom">	
			<u-button 
				type="warning" 
				@click="refund"
			>
				确认退款
			</u-button>
		</view>	
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	import { mapState } from 'vuex'
	import { parseTime } from '@/utils'
	export default {
		computed: {
			...mapState({
				item: state => state.seller.orderInfoCache
			})
		},
		data() {
			return {
				form: {
					refundFee: "",
					attach: "",
				}
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'订单详情'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
			
		},
		mounted() {
			this.init()
		},
		methods: {
			init() {
				this.item.refundFee = this.item.refundFee?this.item.refundFee:0
				if (this.form.refundFee=="" || this.form.refundFee>((this.item.totalFee-this.item.refundFee)/100).toFixed(2)) {
					this.form.refundFee = ((this.item.totalFee-this.item.refundFee)/100).toFixed(2)
				}
			},
			isFee(fee) { // 价格是否存在不存在返回0
				return fee ? fee : 0
			},
			clickInput() {
				this.form.refundFee = ""
			},
			clickBlur() {
				this.init()
			},
			refund(item) {
				const refundFee = String(this.form.refundFee*100)
				this.$u.api.pay.tradeAuth.Refund({ 
					bizContent: {
						outTradeNo: this.item.outTradeNo,
						outRefundNo: this.item.outTradeNo + '_' + parseTime(new Date(), '{h}{i}{s}{n}'),
						refundFee: refundFee,
						attach: this.form.attach
					}
				}).then(res =>{
					if (res.content.returnCode === "SUCCESS" && res.content.status == "SUCCESS") {
						uni.showToast({
                            duration: 3000,
                            icon:'success',
                            title:'退款成功',
                        })
					} else if(res.content.returnCode === "SUCCESS" && res.content.status == "USERPAYING" ) {
						this.$refs.uToast.show({
							title: "正在退款中。",
							duration: 3000
						})
					} else {
						this.$refs.uToast.show({
							title: res.content.returnMsg,
							duration: 3000
						})
					}
					setTimeout(()=>{
						uni.navigateBack()
					},3000)
				}).catch(err => {
					console.log(err);
					this.$refs.uToast.show({
						title: "请求失败,未知状态。请返回首页查询。",
						duration: 3000
					})
					setTimeout(()=>{
						uni.navigateBack()
					},3000)
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
.item {
	background-color: #fff;
	height: 100vh;
	padding: 5vw;
	.line {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 5px;
		padding-top: 10px;
		padding-bottom: 10px;
	}
	.info {
		color: #909399;
		font-size: 10px;
	}
	.right {
		text-align: right;
	}
	.totalFee {
		font-size: 20px;
		color: #ff0000;
		text-align: right;
	}
	.refundFee {
		color: #ff0000;
	}
}
.bottom {
	margin-top: 3vh;
}
.icon{
	font-size: 38px;
}
.primary{
	color: #409EFF;
}
.info{
	color: #909399;
}
.error{
	color: #F56C6C;
}
.success{
	color: #67C23A;
}
.warning{
	color: #E6A23C;
}
</style>

