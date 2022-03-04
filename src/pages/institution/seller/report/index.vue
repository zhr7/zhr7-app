<template>
	<view>
		<view class="top">
		</view>
		<view class="content">
			<view class="item" v-for="(item, index) in list" :key="index" @click="click(item)">
				<view class="center">
					<view class="title">
						{{item.userName}}
					</view>
					<view class="time">
						品牌:{{item.brandName}}
					</view>
					<view class="time">
						笔:{{item.count}} <span v-if="item.rebate">预估佣金:{{fee(item.rebate/10000)}}</span>
					</view>
				</view>
				<view class="right">
					<view>
						{{fee(item.totalFee)}}
					</view>
					<view class="fee">
						手续费:{{fee(item.fee)}}
					</view>
					<view class="status">
						{{replaceTime(item.date)}}
					</view>
				</view>
			</view>
			<u-loadmore :status="status" />
		</view>
		<u-calendar v-model="showDate" mode="range" @change="changeDate"></u-calendar>
	</view>
</template>
<script>
	import { parseTime } from '@/utils'
	export default {
		data() {
			return {
				status: 'loadmore',
				list: [],
				total: 0,
				listQuery: {
					page: 1,
					limit: 15,
					where: '',
					sort: 'date desc'
				},
				query: {
				},
				showDate: false,
				search: '',
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'商家报表'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
			
		},
		onLoad(options) {
			this.routes = options
			uni.setNavigationBarTitle({
				title: this.routes.sellerName
			})
		},
		onShow() {
			this.init()
		},
		methods: {
			init() {
				this.listQuery = {
					page: 1,
					limit: 15,
					where: '',
					sort: 'date desc'
				}
				this.list = []
				this.getList()
				uni.$on('uOnReachBottom',()=>{
					this.listQuery.page++
					if (this.list.length>=this.total) {
						this.status = 'nomore'
						return
					}
					this.getList()
				})
			},
			parseTime(time){
				return parseTime(time)
			},
			replaceTime(time){
				return time.substr(0,4)+"-"+time.substr(4,2)+"-"+time.substr(6,2)
			},
			isNumber(number) { // 是否存在不存在返回0
				return number ? number : 0
			},
			fee(number) { // 是否存在不存在返回0
				return "￥"+(this.isNumber(number)/100).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
			},
			getList() {
				let where = ' true'
				if (this.query.search) {
					where = where + ` And (brand_name like '%` + this.query.search + `%' Or user_name like '%` + this.query.search + `%')`
				}
				this.listQuery.where = where
				this.status = 'loading';
				this.$u.api.institution.sellerReport.List({
					listQuery: this.listQuery,
					sellerReport: {
						userId: this.routes.sellerId
					}
				}).then(res => {
					if (res.sellerReports) {
						res.sellerReports.forEach(item => {
							this.list.push(item)
						});
						this.total = Number(res.total)
						if (this.list.length>=this.total) {
							this.status = 'nomore'
						}
					}else{
						this.status = 'nomore'
					}
				})
			},
			handlerSearch(res) {
				if (res) {
					this.query.search = res
				}else{
					this.query.search = this.search
				}
				this.listQuery = {
					page: 1,
					limit: 15,
					where: '',
					sort: 'created_at desc'
				}
				this.list = []
				this.getList()
			},
			click(item){
				// this.$u.route({
				// 	type: 'to',
				// 	url: '/pages/institution/seller/item', 
				// 	params: item
				// })
			}
			
		},
	}
</script>

<style lang="scss" scoped>
.content{
	.item {
		height: 60px;
		width: 100%;
		background-color: #fff;
		margin-bottom: 5px;
		display: flex;
		padding: 0 2vw 0 1vw ;
		.left {
			padding: 5px;
			text-align: center;
			min-width: 60px;
			color: #909399;
			font-size: 10px;
		}
		.center{
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding: 5px;
			.title {
				font-size: 13px;
			}
			.time {
				font-size: 10px;
				color: #909399;
			}
		}
		.right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding: 5px;
			flex: 1;
			text-align: right;
			min-width: 80px;
			.totalFee {
				color: #000;
			}
			.fee{
				font-size: 3vw;
				color: #909399;
			}
			.refundFee {
				color: #FF0000;
			}
			.status {
				font-size: 12px;
			}
		}
	}
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
.top{
	width: 100%;
	background-color: #fff;
	.search {
		padding:0 10px 10px 10px;
	}
	.uDropdown{
		background-color: #f4f4f5!important;
	}
}
.dropdown-center {
	width: 100%;
	background-color: #fff;
	padding: 5vw;
	.title {
		margin: 5px;
	}
	.order-item {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		.order-item-content {
			color: #606266;
			background-color:#f4f4f5;
			font-size: 12px;
			padding: 5px;
			width: 70px;
			height: 28px;
			text-align: center;
			border-radius: 15px;
			margin: 5px;
		}
	}
	.fee-item{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		.fee-input{
			width: 150px;
		}
		.terminal-input{
			width: 70vw;
		}
	}
	.filter{
		margin: 10px;
	}
}
.selected {
	color: #7d33ff!important;
	border:1px solid #7d33ff;
	padding: 4px!important;
}
</style>
