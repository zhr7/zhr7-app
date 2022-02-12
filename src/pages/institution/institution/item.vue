<template>
	<view class="item">
		<view class="line">
			<span v-if="item.brandId===item.id" class="info">
				<u-icon name="brand" custom-prefix="colour-icon" class="icon"></u-icon><br>
				品牌
			</span>
			<span v-else class="info">
				<u-icon name="seller" custom-prefix="colour-icon" class="icon"></u-icon><br>
				门店
			</span>
			<view>
				<view class="right name">{{item.name}}</view>
				<view class="right info">{{item.username}}</view>
				<view class="right info">{{item.mobile}}</view>
			</view>
		</view>
		<u-line />
		<view class="line">
			<u-grid
                :border="false"
                col="3"
			>
				<u-grid-item>
					<u-icon
						:customStyle="{paddingTop:20+'rpx'}"
						name="seller" 
						custom-prefix="colour-icon" 
						:size="100"
						@click="handler('seller')"
					></u-icon>
					<text class="grid-text">商家门店</text>
				</u-grid-item>
				<u-grid-item>
					<u-icon
						:customStyle="{paddingTop:20+'rpx'}"
						name="order"
						:size="100"
						class="order"
						@click="handler('order')"
					></u-icon>
					<text class="grid-text">交易明细</text>
				</u-grid-item>
				<u-grid-item>
					<u-icon
						:customStyle="{paddingTop:20+'rpx'}"
						name="edit-pen"
						:size="100"
						class="report"
						@click="handler('report')"
					></u-icon>
					<text class="grid-text">日结报表</text>
				</u-grid-item>
				<u-grid-item>
					<u-icon
						:customStyle="{paddingTop:20+'rpx'}"
						name="rmb-circle"
						:size="100"
						class="pay"
						@click="handler('pay')"
					></u-icon>
					<text class="grid-text">支付配置</text>
				</u-grid-item>
				<u-grid-item>
					<u-icon
						:customStyle="{paddingTop:20+'rpx'}"
						name="setting"
						:size="100"
						class="setting"
						@click="handler('setting')"
					></u-icon>
					<text class="grid-text">商家配置</text>
				</u-grid-item>
				<u-grid-item>
					<u-icon
						:customStyle="{paddingTop:20+'rpx'}"
						name="eye-off"
						:size="100"
						class="password"
						@click="handler('password')"
					></u-icon>
					<text class="grid-text">密码重置</text>
				</u-grid-item>
			</u-grid>
		</view>	
		<!-- <u-line />
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
		<view class="bottom" v-if="isNumber(item.status)===1">
			<u-button 
				v-if="isNumber(item.totalFee)>0 && (isNumber(item.refundFee) < isNumber(item.totalFee))"
				type="warning" 
				@click="refund"
			>
				订单退款
			</u-button>
		</view>	 -->
	</view>
</template>
<script>
	import { RouteParams } from '@/utils'
	export default {
		computed: {
		},
		data() {
			return {
				item: {

				}
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'商家详情'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
		},
		mounted() {
			this.item = RouteParams()
		},
		onShow() {
		},
		methods: {
			isNumber(fee) { // 价格是否存在不存在返回0
				return fee ? Number(fee) : 0
			},
			replaceTime(time){
				time = time.replace("T", " ")
				return time.replace("+08:00", "")
			},
			refund() {
				this.$u.route({
					type: 'to',
					url: '/pages/seller/order/refund', 
				})
			},
			handler(path){
				console.log(path)
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
	.name {
		font-size: 20px;
		color: #ff0000;
	}
}
.icon{
	font-size: 38px;
}
.info{
	color: #909399;
	text-align: center;
}
.grid-text {
    font-size: 14px;
    color: #909399;
    padding: 10rpx 0 20rpx 0rpx;
    /* #ifndef APP-PLUS */
    box-sizing: border-box;
    /* #endif */
}
.order{
	color: #409EFF;
}
.report{
	color: #19be6b;
}
.pay{
	color: #67C23A;
}
.setting {
	color: #F56C6C;
}
.password {
	color: #E6A23C;
}
</style>

