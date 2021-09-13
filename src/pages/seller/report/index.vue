<template>
	<view class="report">
		<view class="top-time">
			<view class="left">选择时间</view>
			<view class="right">
				{{
					dateRange.length===0? 
					parseTime(date,'{y}年{m}月{d}日'): 
					parseTime(dateRange[0],'{y}年{m}月{d}日')+" 至 "+  parseTime(dateRange[1],'{y}年{m}月{d}日')
				}}
			</view>
		</view>
		<view class="top-select">
			<view 
				class="date" 
				:class="[index===dateSelected?'selected':'']" 
				v-for="(item,index) in dates" 
				:key="index" 
				@click="clickDate(index)"
			>
				<view class="week">
					周{{parseTime(item,'{a}')}}
				</view>
				<view class="day">
					{{ index===0? '昨天': parseTime(item,'{d}') }}
				</view>
				<view class="month">
					{{parseTime(item,'{m}月{d}日')}}
				</view>
			</view>
			<view 
				class="date" 
				:class="[5===dateSelected?'selected':'']" 
				@click="clickDate(5)"
			>
				<view class="more">
					更多
				</view>
			</view>
		</view>
		<view class="totalFee">
			<view class="tf_top">
				<view class="tf_left">
					<view class="tfl_top">
						<view class="tfl_one">|</view>
						<view class="tfl_title">营业额<u-icon class="icon" name="question-circle"></u-icon></view>
					</view>
					<view class="tf_bottom">
						{{ fee(report.totalFee) }}
					</view>
				</view>
				<view class="right">
					
				</view>
			</view>
			<u-line />
			<view class="bottom">
				<view class="item">
					<view class="top">交易笔数</view>
					<view class="bottom">{{ isNumber(report.count) }}</view>
				</view>
				<view class="item">
					<view class="top">实收笔数<u-icon name="question-circle"></u-icon></view>
					<view class="bottom">{{ isNumber(report.count)-isNumber(report.refundCount)  }}</view>
				</view>
				<view class="item">
					<view class="top">退款金额</view>
					<view class="bottom">{{ fee(report.refundFee)  }}</view>
				</view>
				<view class="item">
					<view class="top">退款笔数</view>
					<view class="bottom">{{ isNumber(report.refundCount)  }}</view>
				</view>
				<view class="item">
					<view class="top">手续费</view>
					<view class="bottom">{{ fee(report.fee) }}</view>
				</view>
				<view class="item">
					<view class="top">结算金额</view>
					<view class="bottom">{{ fee(isNumber(report.totalFee)-isNumber(report.fee)) }}</view>
				</view>
			</view>
		</view>
		<view class="method">
			<view class="head_top">
				<view class="head_one">|</view>
				<view class="head_title"> 支付方式统计 </view>
			</view>
			<u-line />
			<view class="center">
				<u-icon name="weixinzhifu" custom-prefix="colour-icon" class="icon">></u-icon>
				<span>微信支付</span>
			</view>
			<view class="bottom">
				<view class="item">
					<view class="top">交易额</view>
					<view class="bottom">{{ fee(report.wechatTotalFee) }}</view>
				</view>
				<view class="item">
					<view class="top">实收笔数<u-icon name="question-circle"></u-icon></view>
					<view class="bottom">{{ isNumber(report.wechatCount)-isNumber(report.wechatRefundCount)  }}</view>
				</view>
				<view class="item">
					<view class="top">手续费</view>
					<view class="bottom">{{ fee(report.wechatFee) }}</view>
				</view>
				<view class="item">
					<view class="top">退款金额</view>
					<view class="bottom">{{ fee(report.wechatRefundFee)  }}</view>
				</view>
				<view class="item">
					<view class="top">退款笔数</view>
					<view class="bottom">{{ isNumber(report.wechatRefundCount)  }}</view>
				</view>
				<view class="item">
					<view class="top">结算金额</view>
					<view class="bottom">{{ fee(isNumber(report.wechatTotalFee)-isNumber(report.wechatFee)) }}</view>
				</view>
			</view>
			<u-line />
			<view class="center">
				<u-icon name="zhifubao" custom-prefix="colour-icon" class="icon">></u-icon>
				<span>支付宝支付</span>
			</view>
			<view class="bottom">
				<view class="item">
					<view class="top">交易额</view>
					<view class="bottom">{{ fee(report.alipayTotalFee) }}</view>
				</view>
				<view class="item">
					<view class="top">实收笔数<u-icon name="question-circle"></u-icon></view>
					<view class="bottom">{{ isNumber(report.alipayCount)-isNumber(report.alipayRefundCount)  }}</view>
				</view>
				<view class="item">
					<view class="top">手续费</view>
					<view class="bottom">{{ fee(report.alipayFee) }}</view>
				</view>
				<view class="item">
					<view class="top">退款金额</view>
					<view class="bottom">{{ fee(report.alipayRefundFee)  }}</view>
				</view>
				<view class="item">
					<view class="top">退款笔数</view>
					<view class="bottom">{{ isNumber(report.alipayRefundCount)  }}</view>
				</view>
				<view class="item">
					<view class="top">结算金额</view>
					<view class="bottom">{{ fee(isNumber(report.alipayTotalFee)-isNumber(report.alipayFee)) }}</view>
				</view>
			</view>
			<u-line />
			<view class="center">
				<u-icon name="yunshanfu" custom-prefix="colour-icon" class="icon">></u-icon>
				<span>银联支付</span>
			</view>
			<view class="bottom">
				<view class="item">
					<view class="top">交易额</view>
					<view class="bottom">{{ fee(report.unionpayTotalFee) }}</view>
				</view>
				<view class="item">
					<view class="top">实收笔数<u-icon name="question-circle"></u-icon></view>
					<view class="bottom">{{ isNumber(report.unionpayCount)-isNumber(report.unionpayRefundCount)  }}</view>
				</view>
				<view class="item">
					<view class="top">手续费</view>
					<view class="bottom">{{ fee(report.unionpayFee) }}</view>
				</view>
				<view class="item">
					<view class="top">退款金额</view>
					<view class="bottom">{{ fee(report.unionpayRefundFee)  }}</view>
				</view>
				<view class="item">
					<view class="top">退款笔数</view>
					<view class="bottom">{{ isNumber(report.unionpayRefundCount)  }}</view>
				</view>
				<view class="item">
					<view class="top">结算金额</view>
					<view class="bottom">{{ fee(isNumber(report.unionpayTotalFee)-isNumber(report.unionpayFee)) }}</view>
				</view>
			</view>
			<u-line />
			<view class="center">
				<u-icon name="xinyongka" custom-prefix="colour-icon" class="icon">></u-icon>
				<span>信用卡刷卡</span>
			</view>
			<view class="bottom">
				<view class="item">
					<view class="top">交易额</view>
					<view class="bottom">{{ fee(report.creditTotalFee) }}</view>
				</view>
				<view class="item">
					<view class="top">实收笔数<u-icon name="question-circle"></u-icon></view>
					<view class="bottom">{{ isNumber(report.creditCount)-isNumber(report.creditRefundCount)  }}</view>
				</view>
				<view class="item">
					<view class="top">手续费</view>
					<view class="bottom">{{ fee(report.creditFee) }}</view>
				</view>
				<view class="item">
					<view class="top">退款金额</view>
					<view class="bottom">{{ fee(report.creditRefundFee)  }}</view>
				</view>
				<view class="item">
					<view class="top">退款笔数</view>
					<view class="bottom">{{ isNumber(report.creditRefundCount)  }}</view>
				</view>
				<view class="item">
					<view class="top">结算金额</view>
					<view class="bottom">{{ fee(isNumber(report.creditTotalFee)-isNumber(report.creditFee)) }}</view>
				</view>
			</view>
			<u-line />
			<view class="center">
				<u-icon name="yinhangka" custom-prefix="colour-icon" class="icon">></u-icon>
				<span>储蓄卡刷卡</span>
			</view>
			<view class="bottom">
				<view class="item">
					<view class="top">交易额</view>
					<view class="bottom">{{ fee(report.cardTotalFee) }}</view>
				</view>
				<view class="item">
					<view class="top">实收笔数<u-icon name="question-circle"></u-icon></view>
					<view class="bottom">{{ isNumber(report.cardCount)-isNumber(report.cardRefundCount)  }}</view>
				</view>
				<view class="item">
					<view class="top">手续费</view>
					<view class="bottom">{{ fee(report.cardFee) }}</view>
				</view>
				<view class="item">
					<view class="top">退款金额</view>
					<view class="bottom">{{ fee(report.cardRefundFee)  }}</view>
				</view>
				<view class="item">
					<view class="top">退款笔数</view>
					<view class="bottom">{{ isNumber(report.cardRefundCount)  }}</view>
				</view>
				<view class="item">
					<view class="top">结算金额</view>
					<view class="bottom">{{ fee(isNumber(report.cardTotalFee)-isNumber(report.cardFee)) }}</view>
				</view>
			</view>
		</view>
		<view class="method">
			<view class="head_top">
				<view class="head_one">|</view>
				<view class="head_title"> 支付通道统计 </view>
			</view>
			<u-line />
			<view class="center">
				<u-icon name="home-fill" class="icon">></u-icon>
				<span>默认支付通道</span>
			</view>
			<view class="bottom">
				<view class="item">
					<view class="top">交易额</view>
					<view class="bottom">{{ fee(report.channelTotalFee) }}</view>
				</view>
				<view class="item">
					<view class="top">实收笔数<u-icon name="question-circle"></u-icon></view>
					<view class="bottom">{{ isNumber(report.channelCount)-isNumber(report.channelRefundCount)  }}</view>
				</view>
				<view class="item">
					<view class="top">手续费</view>
					<view class="bottom">{{ fee(report.channelFee) }}</view>
				</view>
				<view class="item">
					<view class="top">退款金额</view>
					<view class="bottom">{{ fee(report.channelRefundFee)  }}</view>
				</view>
				<view class="item">
					<view class="top">退款笔数</view>
					<view class="bottom">{{ isNumber(report.channelRefundCount)  }}</view>
				</view>
				<view class="item">
					<view class="top">结算金额</view>
					<view class="bottom">{{ fee(isNumber(report.channelTotalFee)-isNumber(report.channelFee)) }}</view>
				</view>
			</view>
			<u-line />
			<view class="center">
				<u-icon name="weixinzhifu" custom-prefix="colour-icon" class="icon">></u-icon>
				<span>微信支付通道</span>
			</view>
			<view class="bottom">
				<view class="item">
					<view class="top">交易额</view>
					<view class="bottom">{{ fee(report.wechatChannelTotalFee) }}</view>
				</view>
				<view class="item">
					<view class="top">实收笔数<u-icon name="question-circle"></u-icon></view>
					<view class="bottom">{{ isNumber(report.wechatChannelCount)-isNumber(report.wechatChannelRefundCount)  }}</view>
				</view>
				<view class="item">
					<view class="top">手续费</view>
					<view class="bottom">{{ fee(report.wechatChannelFee) }}</view>
				</view>
				<view class="item">
					<view class="top">退款金额</view>
					<view class="bottom">{{ fee(report.wechatChannelRefundFee)  }}</view>
				</view>
				<view class="item">
					<view class="top">退款笔数</view>
					<view class="bottom">{{ isNumber(report.wechatChannelRefundCount)  }}</view>
				</view>
				<view class="item">
					<view class="top">结算金额</view>
					<view class="bottom">{{ fee(isNumber(report.wechatChannelTotalFee)-isNumber(report.wechatChannelFee)) }}</view>
				</view>
			</view>
			<u-line />
			<view class="center">
				<u-icon name="zhifubao" custom-prefix="colour-icon" class="icon">></u-icon>
				<span>支付宝支付通道</span>
			</view>
			<view class="bottom">
				<view class="item">
					<view class="top">交易额</view>
					<view class="bottom">{{ fee(report.alipayChannelTotalFee) }}</view>
				</view>
				<view class="item">
					<view class="top">实收笔数<u-icon name="question-circle"></u-icon></view>
					<view class="bottom">{{ isNumber(report.alipayChannelCount)-isNumber(report.alipayChannelRefundCount)  }}</view>
				</view>
				<view class="item">
					<view class="top">手续费</view>
					<view class="bottom">{{ fee(report.alipayChannelFee) }}</view>
				</view>
				<view class="item">
					<view class="top">退款金额</view>
					<view class="bottom">{{ fee(report.alipayChannelRefundFee)  }}</view>
				</view>
				<view class="item">
					<view class="top">退款笔数</view>
					<view class="bottom">{{ isNumber(report.alipayChannelRefundCount)  }}</view>
				</view>
				<view class="item">
					<view class="top">结算金额</view>
					<view class="bottom">{{ fee(isNumber(report.alipayChannelTotalFee)-isNumber(report.alipayChannelFee)) }}</view>
				</view>
			</view>
			<u-line />
			<view class="center">
				<u-icon name="yunshanfu" custom-prefix="colour-icon" class="icon">></u-icon>
				<span>银联支付通道</span>
			</view>
			<view class="bottom">
				<view class="item">
					<view class="top">交易额</view>
					<view class="bottom">{{ fee(report.unionpayChannelTotalFee) }}</view>
				</view>
				<view class="item">
					<view class="top">实收笔数<u-icon name="question-circle"></u-icon></view>
					<view class="bottom">{{ isNumber(report.unionpayChannelCount)-isNumber(report.unionpayChannelRefundCount)  }}</view>
				</view>
				<view class="item">
					<view class="top">手续费</view>
					<view class="bottom">{{ fee(report.unionpayChannelFee) }}</view>
				</view>
				<view class="item">
					<view class="top">退款金额</view>
					<view class="bottom">{{ fee(report.unionpayChannelRefundFee)  }}</view>
				</view>
				<view class="item">
					<view class="top">退款笔数</view>
					<view class="bottom">{{ isNumber(report.unionpayChannelRefundCount)  }}</view>
				</view>
				<view class="item">
					<view class="top">结算金额</view>
					<view class="bottom">{{ fee(isNumber(report.unionpayChannelTotalFee)-isNumber(report.unionpayChannelFee)) }}</view>
				</view>
			</view>
		</view>
		<u-calendar v-model="show" mode="range" @change="change"></u-calendar>
	</view>
</template>
<script>
	import { parseTime } from '@/utils'
	export default {
		data() {
			return {
				dateSelected: 0,
				dates: [
					new Date(new Date(new Date().toLocaleDateString()).getTime() - 1 * 24 * 60 * 60 * 1000),
					new Date(new Date(new Date().toLocaleDateString()).getTime() - 2 * 24 * 60 * 60 * 1000),
					new Date(new Date(new Date().toLocaleDateString()).getTime() - 3 * 24 * 60 * 60 * 1000),
					new Date(new Date(new Date().toLocaleDateString()).getTime() - 4 * 24 * 60 * 60 * 1000),
				],
				date: new Date(new Date(new Date().toLocaleDateString()).getTime() - 1 * 24 * 60 * 60 * 1000),
				show: false,
				dateRange: [],
				report: {}
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'日结报表'
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
				this.getAmount()
			},
			parseTime(time, cFormat){
				return parseTime(time, cFormat)
			},
			isNumber(number) { // 是否存在不存在返回0
				return number ? number : 0
			},
			fee(number) { // 是否存在不存在返回0
				return "￥"+(this.isNumber(number)/100).toFixed(2)
			},
			change(e) {
				this.dateRange[0] = new Date(e.startDate)
				this.dateRange[1] = new Date(e.endDate)
				this.getAmount()
			},
			clickDate(index) {
				this.dateSelected = index
				if (index===5) {
					this.show = true
					return 
				}
				this.dateRange = []
				this.date = this.dates[index]
				this.getAmount()
			},
			getAmount() {
				let where = ' true'
				if (this.dateRange.length>0) {
					const start = parseTime(this.dateRange[0],'{y}{m}{d}')
					const end = parseTime(this.dateRange[1],'{y}{m}{d}')
					where = where + " And date >= '" + start + "' And date <= '" + end + "'"
				} else {
					where = where + " And date = '" + parseTime(this.date,'{y}{m}{d}') + "'"
				}
				this.$u.api.report.Amount({
					listQuery: {
						where: where
					}
				}).then(res => {
					if (res.report) {
						this.report = res.report
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.report{
	padding: 3vw;
	.top-time {
		display: flex;
		flex-direction: row;
		align-items:flex-end;
		justify-content: space-between;
		.left {
			font-size: 14px;
			font-weight: 900;
		}
		.right {
			font-size: 10px;
			color: #909399;	
		}
	}
	.top-select {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		.date {
			margin-top: 3vw;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 16vw;
			height: 20vw;
			background-color: #fff;
			padding: 5px;
			border-radius: 5px;
			.week {
				font-size: 2.8vw;
				text-align: center;
				color: #909399;
			}
			.day {
				font-size: 5vw;
				text-align: center;
				font-weight: 900;
			}
			.month {
				font-size: 2.8vw;
				text-align: center;
				color: #909399;
			}
			.more {
				font-size: 5vw;
				line-height: 16vw;
				text-align: center;
				font-weight: 900;
			}
		}
	}
	.selected {
		background-color: #7d33ff!important;
		.week {
			color: #fff!important;
		}
		.day {
			color: #fff!important;
		}
		.month {
			color: #fff!important;
		}
		.more {
			color: #fff!important;
		}
	}
	.totalFee {
		width: 100%;
		background-color: #fff;
		margin-top: 3vw;
		padding: 2vw;
		border-radius: 5px;
		.tf_top  {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			.tf_left {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.tfl_top {
					display: flex;
					flex-direction: row;
					align-items:flex-end;
					.tfl_one {
						font-size: 20PX;
						color:  #7d33ff;
					}
					.tfl_title {
						font-size: 16PX;
						font-weight: 500;
						margin-left: 5px;
						.icon{
							margin-left: 5px;
							font-size: 12PX;
							color: #909399;
						}
					}
				}
				.tf_bottom {
					font-size: 28PX;
					color:  #7d33ff;
				}
			}
		}
		.bottom {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			flex-wrap: wrap;
			margin: 10px 0 10px 0;
			.item {
				min-width: 33.33%;
				.top {
					font-size: 12px;
					color: #909399;	
				}
				.bottom{
					font-size: 12px;
					color: #7d33ff;	
				}
			}
		}
	}
	.method {
		width: 100%;
		background-color: #fff;
		margin-top: 3vw;
		padding: 2vw;
		border-radius: 5px;
		.center {
			font-size: 14PX;
			font-weight: 500;
			margin: 10px 0 10px 0;
			span{
				margin-left: 5px;
			}
			.icon {
				color: #F56C6C;
			}
		}
		.bottom {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			flex-wrap: wrap;
			margin: 10px 0 10px 0;
			.item {
				min-width: 33.33%;
				.top {
					font-size: 12px;
					color: #909399;	
				}
				.bottom{
					font-size: 12px;
					color: #7d33ff;	
				}
			}
		}
	}
}

.head_top  {
	display: flex;
	flex-direction: row;
	align-items:flex-end;
	.head_one {
		font-size: 20PX;
		color:  #7d33ff;
	}
	.head_title {
		font-size: 16PX;
		font-weight: 500;
		margin-left: 5px;
	}
}
</style>
