<template>
	<view>
		
		<view class="top">
			<view class="search">
				<!-- <u-search placeholder="商家品牌/门店名称/商户号/电话" v-model="search" @custom="handlerSearch" @search="handlerSearch"></u-search> -->
				<u-search placeholder="商户名称/法人姓名" v-model="search" @custom="handlerSearch" @search="handlerSearch"></u-search>
			</view>	
		</view>
		<view class="content">
			<u-swipe-action v-if="isChannel=='1'" :show="item.show" :index="index" 
				v-for="(item, index) in list" :key="item.id" 
				@click="click" @open="open"
				:options="optionsSwipe"
			>
				<view class="item">
						<view class="left">
						<span>
							<m-icon name="seller" custom-prefix="colour-icon" size="38"></m-icon><br>
							进件
						</span>
					</view>
					<view class="center">
						<view class="title">
							{{item.licenseMerchantName}}
						</view>
						<view class="time">
							{{item.licenseCode}}
						</view>
					</view>
					<view class="right">
						<view>
							{{item.legalPerson}}
						</view>
						<view class="status">
							{{parseTime(item.updatedAt)}}
						</view>
					</view>
				</view>
			</u-swipe-action>
			<u-swipe-action v-if="isChannel=='0'" :show="item.show" :index="index" 
				v-for="(item, index) in list" :key="item.id" 
				@click="clickChannel" @open="open"
				:options="optionsSwipeChannel"
			>
				<view class="item">
						<view class="left">
						<span>
							<m-icon name="seller" custom-prefix="colour-icon" size="38"></m-icon><br>
							进件
						</span>
					</view>
					<view class="center">
						<view class="title">
							{{item.licenseMerchantName}}
						</view>
						<view class="time">
							{{item.licenseCode}}
						</view>
					</view>
					<view class="right">
						<view>
							{{item.legalPerson}}
						</view>
						<view class="status">
							{{parseTime(item.updatedAt)}}
						</view>
					</view>
				</view>
			</u-swipe-action>
			<!-- <view class="item" v-for="(item, index) in list" :key="index" @click="click(item)">
				<view class="left">
                    <span>
						<m-icon name="seller" custom-prefix="colour-icon" size="38"></m-icon><br>
						进件
					</span>
				</view>
				<view class="center">
					<view class="title">
						{{item.licenseMerchantName}}
					</view>
					<view class="time">
						{{item.licenseCode}}
					</view>
				</view>
				<view class="right">
					<view>
						{{item.legalPerson}}
					</view>
					<view class="status">
						{{parseTime(item.updatedAt)}}
					</view>
				</view>
				<view class="arrow-right">
					<u-icon name="arrow-right" size="30"></u-icon>
				</view>
			</view> -->
			<u-loadmore :status="status" />
		</view>
		<u-calendar v-model="showDate" mode="range" @change="changeDate"></u-calendar>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	import { parseTime, RouteParams } from '@/utils'
	import {  mapState } from 'vuex'
	export default {
		computed: {
			...mapState({
				initCache: state => state.seller.initCache
			}),
		},
		data() {
			return {
				isChannel: '1',
				show: false,
				optionsSwipe: [
					{
						text: '编辑',
						style: {
							backgroundColor: '#007aff'
						}
					},
					{
						text: '详情', //进件详情
						style: {
							backgroundColor: '#e69138'
						}
					}
				],
				optionsSwipeChannel: [
					{
						text: '添加',
						style: {
							backgroundColor: '#007aff'
						}
					},
					{
						text: '详情', //通道详情
						style: {
							backgroundColor: '#e69138'
						}
					}
				],
				options: {},
				status: 'loadmore',
				list: [],
				total: 0,
				listQuery: {
					page: 1,
					pageSize: 15,
					filter: '',
					sort: JSON.stringify([{key: '_id', value: -1}]) 
				},
				query: {
				},
				showDate: false,
				search: '',
				title: '',
			}
		},
		props: {
		},
		watch: {
			initCache: {
				handler(val, oldVal) {
					this.init()
				},
				deep: true
			}
		},
		created() {
		},
		onShow() {
			this.options = RouteParams()
			if (this.options.item) {
			    this.isChannel = this.options.item
			}
			console.log(this.options.item)
		},
		mounted() {
			this.title = '进件管理'
			uni.setNavigationBarTitle({
				title:this.title
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
			this.init()
		},
		methods: {
			init() {
				this.listQuery = {
					page: 1,
					pageSize: 15,
					filter: '',
					sort: JSON.stringify([{key: '_id', value: -1}]) 
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
				time = time.replace("T", " ")
				return time.replace("+08:00", "")
			},
			isNumber(fee) { // 价格是否存在不存在返回0
				return fee ? Number(fee)  : 0
			},
			getList() {
				let filter = {}
				if (this.query.search) {
					filter = {
						$or: [
							{ legalPerson: { $regex: this.query.search, $options: 'i' } },
							{ licenseMerchantName: { $regex: this.query.search, $options: 'i' } }
						]
					}
				}
				this.listQuery.filter = JSON.stringify(filter)
				this.status = 'loading';
				this.$u.api.v3.institution.apply.List(this.listQuery).then(res => {
                    // console.log(res)
					if (res.items) {
						res.items.forEach(item => {
							item.show = false
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
					filter: '',
					sort: JSON.stringify([{key: '_id', value: -1}]) 
				}
				this.list = []
				this.getList()
			},
			// click(item){
			// 	this.$u.route({
			// 		type: 'to',
			// 		url: '/subPackages/institution/apply/update/update', 
			// 		params: item
			// 	})
			// }
			click(index, index1) {
				console.log(this.list[index])
				if(index1 == 1) {  //详情
					this.$u.route({
						type: 'to',
						url: '/subPackages/institution/apply/detail/detail', 
						params: this.list[index]
					})
				} else {
					this.$u.route({
						type: 'to',
						url: '/subPackages/institution/apply/update/update', 
						params: this.list[index]
					})
				}
			},
			clickChannel(index, index1) {
				console.log(this.list[index])
				if(index1 == 1) {  //通道详情
					this.$u.route({
						type: 'to',
						url: '/subPackages/institution/apply/channelDetail/channelDetail', 
						params: this.list[index]
					})
				} else { //添加
					this.$u.route({
						type: 'to',
						url: '/subPackages/institution/apply/channel/index', 
						params: this.list[index]
					})
				}
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if(index != idx) this.list[idx].show = false;
				})
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
