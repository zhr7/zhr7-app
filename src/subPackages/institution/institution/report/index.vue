<template>
	<view>
		<!-- <view class="top">
			<view class="search">
				<u-search placeholder="商家品牌/门店名称" v-model="search" @custom="handlerSearch" @search="handlerSearch"></u-search>
			</view>	
		</view> -->
		<view class="content">
			<view class="item" v-for="(item, index) in list" :key="index" @click="click(item)">
				<view class="center">
					<!-- <view class="title">
						{{item.userName}}
					</view>
					<view class="time">
						品牌:{{item.brandName}}
					</view> -->
					<view>
						{{fee(item.totalFee)}}
					</view>
					<view class="time">
						[笔:{{item.count}}] <span v-if="item.rebate">预估佣金:{{fee(item.rebate/10000)}}</span>
					</view>
				</view>
				<view class="right">
					
					<view class="fee">
						手续费:{{fee(item.fee)}}
					</view>
					<view class="status">
						{{replaceTime(item.date)}}
					</view>
				</view>
				<!-- <view class="arrow-right">
					<u-icon name="arrow-right" size="30"></u-icon>
				</view> -->
			</view>
			<u-loadmore :status="status" />
		</view>
		<u-calendar v-model="showDate" mode="range" @change="changeDate"></u-calendar>
	</view>
</template>
<script>
	import { parseTime,RouteParams } from '@/utils'
	export default {
		data() {
			return {
				options: {},
				status: 'loadmore',
				list: [],
				total: 0,
				listQuery: {
					page: 1,
					pageSize: 15,
					where: '',
					sort: 'ORDER BY created_at DESC, id DESC'
				},
				query: {
				},
				showDate: false,
				search: '',
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'机构报表'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
			
		},
		mounted() {
			this.options = RouteParams()
			this.init()
		},
		methods: {
			init() {
				if (this.options.name) {
					uni.setNavigationBarTitle({
						title:this.options.name+' 机构报表'
					})
				}
				this.listQuery = {
					page: 1,
					pageSize: 15,
					where: '',
					sort: 'ORDER BY date DESC, id DESC'
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
				console.log(this.options)
				let where = 'WHERE true'
				if (this.query.search) {
					where = where + ` And (brand_name like '%` + this.query.search + `%' Or user_name like '%` + this.query.search + `%')`
				}

				if (this.options.institutionId) {
					this.listQuery.institutionId = this.options.institutionId
				}

				this.listQuery.where = where
				this.status = 'loading';
				this.$u.api.v3.report.report.ReportInstitutionSearch(this.listQuery).then(res => {
					if (res.items) {
						res.items.forEach(item => {
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
					pageSize: 15,
					where: '',
					sort: 'ORDER BY date DESC, id DESC'
				}
				this.list = []
				this.getList()
			},
			click(item){
				// this.$u.route({
				// 	type: 'to',
				// 	url: '/subPackages/institution/seller/item', 
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
		.arrow-right {
			height: 60px;
			line-height: 60px;
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
