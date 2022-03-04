<template>
	<view>
		<view class="top">
			<span class="t-totalFee">昨日交易</span>
			<span class="totalFee">{{fee(report.totalFee)}}</span>
			<span>
				<span class="t-fee">手续费</span>
				<span class="fee">{{fee(report.fee)}}</span>
			</span>
			<span class="bottom"></span>
		</view>
		<view class="content">
			<view class="content-top">
				<span class="item">
					<span class="t-totalFee">当月交易</span>
					<span class="totalFee">{{fee(currentReport.totalFee)}}</span>
					<span class="t-fee">手续费</span>
					<span class="fee">{{fee(currentReport.fee)}}</span>
				</span>
				<span class="item">
					<span class="t-totalFee">上月交易</span>
					<span class="totalFee">{{fee(lastReport.totalFee)}}</span>
					<span class="t-fee">手续费</span>
					<span class="fee">{{fee(lastReport.fee)}}</span>
				</span>
			</view>
			<view class="list">
				<view @click="handler('sellerCreate')" class="item border-bottom-style">
					<u-icon
						name="add-seller" 
						custom-prefix="colour-icon" 
						:size="60"
					></u-icon>
					<text class="grid-text">新增商户</text>
				</view>
				<view @click="handler('institutionCreate')" class="item border-bottom-style border-left-style">
					<u-icon
						name="add-institution" 
						custom-prefix="colour-icon" 
						:size="60"
					></u-icon>
					<text class="grid-text">新增机构</text>
				</view>
				<view @click="handler('sellerBrand')" class="item border-bottom-style">
					<u-icon
						name="brand" 
						custom-prefix="colour-icon" 
						:size="60"
					></u-icon>
					<text class="grid-text">品牌商户</text>
				</view>
				<view @click="handler('institution')" class="item border-bottom-style border-left-style">
					<u-icon
						name="institution" 
						custom-prefix="colour-icon" 
						:size="60"
					></u-icon>
					<text class="grid-text">机构管理</text>
				</view>
				<view @click="handler('seller')" class="item border-bottom-style">
					<u-icon
						name="seller" 
						custom-prefix="colour-icon" 
						:size="60"
					></u-icon>
					<text class="grid-text">门店管理</text>
				</view>
				<view @click="handler('institutionReport')" class="item border-bottom-style border-left-style">
					<u-icon
						name="institution-report" 
						custom-prefix="colour-icon" 
						:size="60"
					></u-icon>
					<text class="grid-text">机构报表</text>
				</view>
				<view @click="handler('institutionSecretKey')" class="item border-bottom-style">
					<u-icon
						name="secretKey" 
						custom-prefix="colour-icon" 
						:size="60"
					></u-icon>
					<text class="grid-text">密钥管理</text>
				</view>
				<view @click="handler('institutionPay')" class="item border-bottom-style border-left-style">
					<u-icon
						name="pay" 
						custom-prefix="colour-icon" 
						:size="60"
					></u-icon>
					<text class="grid-text">支付通道</text>
				</view>
				<view @click="handler('institution-secret-key')" class="item border-bottom-style">
					<u-icon
						name="secret-key" 
						custom-prefix="colour-icon" 
						:size="60"
					></u-icon>
					<text class="grid-text">密钥仓库</text>
				</view>
				<view @click="handler('institutionOauth')" class="item border-bottom-style border-left-style">
					<u-icon
						name="oauth" 
						custom-prefix="colour-icon" 
						:size="60"
					></u-icon>
					<text class="grid-text">授权通道</text>
				</view>
				<!-- <view @click="handler('sellerReport')" class="item border-bottom-style">
					<u-icon
						name="seller-report" 
						custom-prefix="colour-icon" 
						:size="60"
					></u-icon>
					<text class="grid-text">商户报表</text>
				</view>
				<view @click="handler('sellerQrcode')" class="item border-bottom-style border-left-style">
					<u-icon
						name="qrcode" 
						custom-prefix="colour-icon" 
						:size="60"
					></u-icon>
					<text class="grid-text">收 款 码</text>
				</view>
				<view @click="handler('sellerOrder')" class="item">
					<u-icon
						name="order-list" 
						custom-prefix="colour-icon" 
						:size="60"
					></u-icon>
					<text class="grid-text">交易明细</text>
				</view>
				<view @click="handler('sellerDevice')" class="item border-left-style">
					<u-icon
						name="device" 
						custom-prefix="colour-icon" 
						:size="60"
					></u-icon>
					<text class="grid-text">设备管理</text>
				</view> -->
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	import { parseTime } from '@/utils'
	export default {
		data() {
			return {
				date: new Date(new Date(new Date().toLocaleDateString()).getTime() - 1 * 24 * 60 * 60 * 1000),
				dateRange: [],
				report: {},
				currentReport: {},
				lastReport: {},
			}
		},
		onLoad() {
			
		},
		created() {
			uni.setNavigationBarTitle({
				title:''
			})
			uni.setNavigationBarColor({
				frontColor: '#ffffff',  
                backgroundColor: '#7d33ff',  
			})
		},
		mounted() {
			this.init()
		},
		methods: {
			clickclick(e) {
				console.log(e);
			},
			init() {
				this.getAmount('report')
				this.getAmount('currentReport')
				this.getAmount('lastReport')
			},
			parseTime(time, cFormat){
				return parseTime(time, cFormat)
			},
			isNumber(number) { // 是否存在不存在返回0
				return number ? number : 0
			},
			fee(number) { // 是否存在不存在返回0
				return "￥"+(this.isNumber(number)/100).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
			},
			change(e) {
				this.dateRange[0] = new Date(e.startDate)
				this.dateRange[1] = new Date(e.endDate)
				this.getAmount()
			},
			getAmount(name) {
				let where = ' true'
				if (name === "currentReport") {
					this.dateRange = [
						new Date(new Date(new Date().setDate(1)).getTime()),
					 	new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1000)
					]
				}
				if (name === "lastReport") {
					this.dateRange = [
					 	 new Date(new Date().getFullYear(), new Date().getMonth()-1, 1),
						new Date(new Date(new Date().setDate(0)).getTime())
					]
				}
				if (this.dateRange.length>0) {
					const start = parseTime(this.dateRange[0],'{y}{m}{d}')
					const end = parseTime(this.dateRange[1],'{y}{m}{d}')
					where = where + " And date >= '" + start + "' And date <= '" + end + "'"
				} else {
					where = where + " And date = '" + parseTime(this.date,'{y}{m}{d}') + "'"
				}
				this.$u.api.institution.institutionReport.Amount({
					listQuery: {
						where: where
					}
				}).then(res => {
					if (res.institutionReport) {
						this[name] = res.institutionReport
					}
				})
			},
			handler(e){
				this.$emit('handlerPath', e)
				this.$refs.uToast.show({
					title: "努力开发中"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.top{
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: #7d33ff;
	color: #ffffff;
	padding: 5vw;
	.t-totalFee{
		font-size: 3vw;
	}
	.totalFee{
		font-size: 10vw;
	}
	.t-fee{
		font-size: 3vw;
	}
	.fee{
		font-size: 5vw;
	}
	.bottom{
		height: 5vh;
	}
}
.content{
	margin: 3vw;
	margin-top: -5vh;
	.content-top{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		.item{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			width: 39.5vw;
			height: 10vh;
			min-height: 80px;
			border-radius: 5px;
			padding: 3vw;
			background-color: #ffffff;
			color: #82848a;
			.t-totalFee{
				font-size: 2vw;
			}
			.totalFee{
				font-size: 5vw;
			}
			.t-fee{
				font-size: 2vw;
			}
			.fee{
				font-size: 3vw;
			}
		}
	}
	.list{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		margin-top: 3vw;
		border-radius: 5px;
		background-color: #ffffff;
		.item{
			width: 47vw;
			padding: 7vw;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			.grid-text{
				color: #82848a;
				font-size: 5vw;
			}
		}
	}
}
</style>
