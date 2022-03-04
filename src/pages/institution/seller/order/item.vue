<template>
	<view class="item">
		<view class="line">
			<span class="info" v-if="item.method==='alipay'">
				<m-icon name="zhifubao" custom-prefix="colour-icon" size="38">></m-icon><br>
				支付宝
			</span>
			<span class="info" v-if="item.method==='wechat'">
				<m-icon name="weixinzhifu" custom-prefix="colour-icon" size="38">></m-icon><br>
				微信支付
			</span>
			<span class="info" v-if="item.method==='unionpay'">
				<m-icon name="yunshanfu" custom-prefix="colour-icon" size="38"></m-icon><br>
				云闪付
			</span>
			<span class="info" v-if="item.method==='digital'">
				<m-icon name="yunshanfu" custom-prefix="colour-icon" size="38"></m-icon><br>
				数字货币
			</span>
			<view>
				<view class="totalFee">￥{{(item.totalFee/100).toFixed(2) }}</view>
				<view class="right info">订单金额</view>
			</view>
		</view>
		<u-line />
		<view class="line" v-if="item.refundFee>0">
			<view class="">已退款金额</view>
			<view class="refundFee">￥{{(item.refundFee/100).toFixed(2) }}</view>
		</view>	
		<u-line />
		<view class="line" v-if="item.buyerPayFee">
			<view class="">买家支付金额</view>
			<view>￥{{(item.buyerPayFee/100).toFixed(2) }}</view>
		</view>	
		<u-line />
		<view class="line" v-if="item.outTradeNo">
			<view class="">订单编号</view>
			<view>{{ item.outTradeNo }}</view>
		</view>	
		<view class="line" v-if="item.tradeNo">
			<view class="">凭证号</view>
			<view>{{ item.tradeNo }}</view>
		</view>	
		<view class="line" v-if="item.bankTradeNo">
			<view class="">银行单号</view>
			<view>{{ item.bankTradeNo }}</view>
		</view>	
		<view class="line" v-if="item.title">
			<view class="">订单名称</view>
			<view>{{ item.title }}</view>
		</view>	
		<view class="line">
			<view class="">订单状态</view>
			<view class="warning"  v-if="(isNumber(item.status)===0)&&isNumber(item.totalFee)>0">
				等付款
			</view>
			<view class="warning"  v-if="(isNumber(item.status)===0)&&isNumber(item.totalFee)<0">
				等退款
			</view>
			<view class="error" v-if="isNumber(item.status)===-1">
				已关闭
			</view>
			<view v-if="isNumber(item.status)===1">
				<view v-if="isNumber(item.totalFee)>0">
					<view class="primary" v-if="isNumber(item.refundFee) < isNumber(item.totalFee) && isNumber(item.refundFee)!==0">
						转入退款
					</view>
					<view class="warning" v-if="isNumber(item.refundFee) === isNumber(item.totalFee)">
						全额退款
					</view>
					<view class="success">
						支付成功
					</view>
				</view>
				<view class="success" v-if="isNumber(item.totalFee)<0">
					退款成功
				</view>
			</view>
		</view>	
		<view class="line" v-if="item.attach">
			<view class="">备注</view>
			<view>{{item.attach}}</view>
		</view>	
		<view class="line" v-if="item.date">
			<view class="">账单日期</view>
			<view>{{item.date}}</view>
		</view>	
		<view class="line" v-if="item.createdAt">
			<view class="">订单时间</view>
			<view>{{replaceTime(item.createdAt)}}</view>
		</view>	
		<u-line />
	</view>
</template>
<script>
	import { mapState } from 'vuex'
	export default {
		computed: {
			...mapState({
				item: state => state.institution.orderInfoCache
			})
		},
		data() {
			return {
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
		onPullDownRefresh() {
			this.init()
		},
		methods: {
			init() {	//  初始化加载查询
				if (this.item.totalFee>0) {
					this.$u.api.pay.tradeAuth.Query({
						bizContent: {
							outTradeNo: this.item.outTradeNo
						}
					}).then(res => {
						if (res.content.totalFee) {
							this.$set(this.item,'totalFee', res.content.totalFee)
						}
						if (res.content.refundFee) {
							this.$set(this.item,'refundFee', res.content.refundFee)
						}
						if (res.content.status) {
							switch (res.content.status) {
								case "SUCCESS":
									this.$set(this.item,'status', "1")
									break;
								case "USERPAYING":
									this.item.status = 0
									this.$set(this.item,'status', "0")
									break;
								case "WAITING":
									this.$set(this.item,'status', "0")
									break;
								case "CLOSED":
									this.$set(this.item,'status', "-1")
									break;
							}
						}
						uni.stopPullDownRefresh()
					}).catch(err =>{
						console.log(err)
						uni.showToast({
							duration: 3000,
							icon:'error',
							title:'加载商品信息失败',
						})
						uni.stopPullDownRefresh()
					})
				} else {
					this.$u.api.pay.tradeAuth.RefundQuery({
						bizContent: {
							outRefundNo: this.item.outTradeNo
						}
					}).then(res => {
						if (res.content.status) {
							switch (res.content.status) {
								case "SUCCESS":
									this.$set(this.item,'status', "1")
									break;
								case "USERPAYING":
									this.item.status = 0
									this.$set(this.item,'status', "0")
									break;
								case "WAITING":
									this.$set(this.item,'status', "0")
									break;
								case "CLOSED":
									this.$set(this.item,'status', "-1")
									break;
							}
						}
						uni.stopPullDownRefresh()
					}).catch(err =>{
						console.log(err)
						uni.showToast({
							duration: 3000,
							icon:'error',
							title:'加载商品信息失败',
						})
						uni.stopPullDownRefresh()
					})
				}
			},
			isNumber(fee) { // 价格是否存在不存在返回0
				return fee ? Number(fee) : 0
			},
			replaceTime(time){
				time = time.replace("T", " ")
				return time.replace("+08:00", "")
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
	text-align: center;
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

