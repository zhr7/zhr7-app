<template>
	<view class="">
		<view class="top">
			<view class="line">
				<view class="title">
					今日交易统计
				</view>
			</view>
			<u-line/>
			<view class="line">
				<view class="left">
					交易额
				</view>
				<view class="right totalFee">
					￥{{(amount.totalFee/100).toFixed(2)}}
				</view>
			</view>
			<view class="line">
				<view class="left">
					交易笔数
				</view>
				<view class="right">
					{{amount.count-amount.refundCount}}
				</view>
			</view>
			<view class="line">
				<view class="left">
					手续费
				</view>
				<view class="right">
					￥{{(amount.fee/100).toFixed(2)}}
				</view>
			</view>
			<view class="line">
				<view class="left">
					结算金额
				</view>
				<view class="right">
					￥{{((amount.totalFee-amount.fee)/100).toFixed(2)}}
				</view>
			</view>
			<view class="line">
				<view class="left">
					退款金额
				</view>
				<view class="right">
					￥{{(amount.refundFee/100).toFixed(2)}}
				</view>
			</view>
			<view class="line">
				<view class="left">
					退款笔数
				</view>
				<view class="right">
					{{amount.refundCount}}
				</view>
			</view>
			<u-line/>
		</view>
	</view>
</template>
<script>
	import { parseTime } from '@/utils'
	export default {
		data() {
			return {
				query: {
					date: [
						new Date(new Date(new Date().toLocaleDateString()).getTime() - 10 * 24 * 60 * 60 * 1000 - 1000),
						new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1000)
					]
				},
				amount: {
					totalFee: 0,
					fee: 0,
					buyerPayFee: 0,
					rebate: 0,
					count: 0,
					refundFee: 0,
					refundCount: 0
				},
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title: '首页'
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
				this.query = {
					date: [
						new Date(new Date(new Date().toLocaleDateString()).getTime()),
						new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1000)
					]
				}
				this.getAmount()
			},
			getAmount() {
				let where = ' true'
				if (this.query.date) {
					if (this.query.date[1] - this.query.date[0] > 31 * 24 * 60 * 60 * 1000) {
						uni.showToast({
                            duration: 3000,
                            icon:'error',
                            title:'查询时间范围不允许大于31天',
                        })
						return
					}
					const start = parseTime(this.query.date[0])
					const end = parseTime(new Date(this.query.date[1].getTime() + 1000))
					where = where + " And created_at >= '" + start + "' And created_at < '" + end + "'"
				}
				this.$u.api.Amount({
					list_query: {
						where: where
					}
				}).then(res => {
					if (res.amount) {
					const amount = res.amount
					if (amount.count) {
						this.amount.count = amount.count
					}
					if (amount.totalFee) {
						this.amount.totalFee = amount.totalFee
					}
					if (amount.fee) {
						this.amount.fee = amount.fee
					}
					if (amount.refundFee) {
						this.amount.refundFee = amount.refundFee
					}
					if (amount.count) {
						this.amount.count = amount.count
					}
					if (amount.refundCount) {
						this.amount.refundCount = amount.refundCount
					}
					if (amount.buyerPayFee) {
						this.amount.buyerPayFee = amount.buyerPayFee
					}
					}
				})
			},
		}
	}
</script>
<style lang="scss" scoped>
.top {
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
		.title {
			font-size: 16px;
			font-weight: 500;
		}
		.right {
			text-align: right;
			font-weight: 900;
			color: #7d33ff;
		}
		.totalFee {
			font-size: 27px;
			color: #F56C6C;
		}
	}
}
</style>
