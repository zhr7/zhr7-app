<template>
	<view>
		<view class="top">
			<view class="search">
				<u-search placeholder="机构名称" v-model="search" @custom="handlerSearch" @search="handlerSearch"></u-search>
			</view>	
		</view>
		<view class="content">
			<view class="item" v-for="(item, index) in list" :key="index" @click="click(item)">
				<view class="left">
					<span>
						<m-icon name="institution" custom-prefix="colour-icon" size="38"></m-icon><br>
						{{item.level}}级机构
					</span>
				</view>
				<view class="center">
					<view class="title">
						{{item.name}}
					</view>
					<view class="time">
						{{item.mobile}}
					</view>
				</view>
				<view class="right">
					<view>
						{{item.username}}
					</view>
					<view class="status">
						{{replaceTime(item.updatedAt)}}
					</view>
				</view>
				<view class="arrow-right">
					<u-icon name="arrow-right" size="30"></u-icon>
				</view>
			</view>
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
				initCache: state => state.institution.initCache
			}),
		},
		data() {
			return {
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
				institution: {
					id: '',
					institutionId: '',
					level: '',
					mobile: '',
					name: '',
					rebate: '',
					username: '',
				}
			}
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
			uni.setNavigationBarTitle({
				title:'机构管理'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
		},
		mounted() {
			this.institution = JSON.parse(JSON.stringify(RouteParams()))
			this.init()
		},
		methods: {
			init() {
				this.listQuery = {
					page: 1,
					pageSize: 15,
					where: '',
					sort: 'ORDER BY created_at DESC, id DESC'
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
				let where = ' true'
				if (this.query.search) {
					where = where + ` And (name like '%` + this.query.search + `%' Or username like '%` + this.query.search + `%')`
				}
				this.listQuery.where = where
				this.status = 'loading';
				this.$u.api.institution.institution.List({
						list_query: this.listQuery,
						institution: {
							id: this.institution.id,
						},
					}).then(res => {
						if (res.institutions) {
							res.institutions.forEach(item => {
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
					sort: 'ORDER BY created_at DESC, id DESC'
				}
				this.list = []
				this.getList()
			},
			click(item){
				this.$u.route({
					type: 'to',
					url: '/subPackages/main/institution/institution/item', 
					params: item
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
