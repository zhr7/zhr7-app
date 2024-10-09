<template>
	<view>
		<view class="top">
			<view class="search">
				<u-search placeholder="订单号/流水号/凭证号/备注" v-model="search" @custom="handlerSearch" @search="handlerSearch"></u-search>
			</view>	
			<view class="uDropdown">
				<u-dropdown ref="uDropdown" @open="deteOpen">
					<u-dropdown-item title="日期">
					</u-dropdown-item>
					<u-dropdown-item title="扫码找单">
					</u-dropdown-item>
					<u-dropdown-item title="筛选">
						<view class="slot-content">
							<view class="dropdown-center">
								<view class="type">
									<view class="title">
										订单类型
									</view>
									<view class="order-item">
										<view 
											class="order-item-content" 
											v-for="(item,index) in orderType" 
											:class="[query.type===item.value?'selected':'']" 
											:key="index" 
											@click="clickOrderTYpe(item.value)"
										>
											{{item.label}}
										</view>
									</view>
								</view>
								<view class="method">
									<view class="title">
										支付方式
									</view>
									<view class="order-item">
										<view 
											class="order-item-content" 
											v-for="(item,index) in orderMethod" 
											:class="[query.method===item.value?'selected':'']" 
											:key="index" 
											@click="clickOrderMethod(item.value)"
										>
											{{item.label}}
										</view>
									</view>
								</view>
								<view class="status">
									<view class="title">
										支付状态
									</view>
									<view class="order-item">
										<view 
											class="order-item-content" 
											v-for="(item,index) in orderStatus" 
											:class="[query.status===item.value?'selected':'']" 
											:key="index" 
											@click="clickOrderStatus(item.value)"
										>
											{{item.label}}
										</view>
									</view>
								</view>
								<view class="fee">
									<view class="title">
										金额范围
									</view>
									<view class="fee-item">
										<u-input v-model="query.startFee" class="fee-input" type="digit" :border="true" placeholder="请输入金额"/>
										<span>至</span>
										<u-input v-model="query.endFee" class="fee-input" type="digit" :border="true" placeholder="请输入金额"/>
									</view>
								</view>
								<view class="fee">
									<view class="title">
										终端ID
									</view>
									<view class="fee-item">
										<u-input v-model="query.terminalId" class="terminal-input" :border="true" placeholder="请输入终端ID"/>
										<u-button type="info" size="mini" @click="clickTerminalId">本设备ID</u-button>
									</view>
								</view>
								<u-button type="primary" class="filter" @click="clickFilter">确认</u-button>
							</view>
						</view>
					</u-dropdown-item>
				</u-dropdown>
			</view>	
		</view>
		<view class="content">
			<view class="item" v-for="(item, index) in list" :key="index" @click="click(item)">
				<view class="left">
					<span v-if="item.method==='alipay'">
						<m-icon name="zhifubao" custom-prefix="colour-icon" size="38">></m-icon><br>
						支付宝
					</span>
					<span v-if="item.method==='wechat'">
						<m-icon name="weixinzhifu" custom-prefix="colour-icon" size="38">></m-icon><br>
						微信支付
					</span>
					<span v-if="item.method==='unionpay'">
						<m-icon name="yunshanfu" custom-prefix="colour-icon" size="38"></m-icon><br>
						云闪付
					</span>
					<span v-if="item.method==='digital'">
						<m-icon name="yunshanfu" custom-prefix="colour-icon" size="38"></m-icon><br>
						数字货币
					</span>
				</view>
				<view class="center">
					<view class="title">
						{{item.title}}
					</view>
					<view class="time">
						{{replaceTime(item.createdAt)}}
					</view>
				</view>
				<view class="right">
					<view :class="Number(item.totalFee)>0?'totalFee':'refundFee'">
						{{(item.totalFee/100).toFixed(2) }}
					</view>
					<view class="status">
						<view class="error" v-if="isNumber(item.status)===-1">
							已关闭
						</view>
						<view class="warning" v-if="isNumber(item.status)===0&&isNumber(item.totalFee)>0">
							等付款
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
				</view>
				<view class="arrow-right">
					<u-icon name="arrow-right" size="30"></u-icon>
				</view>
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
					date: [
						new Date(new Date(new Date().toLocaleDateString()).getTime() - 30 * 24 * 60 * 60 * 1000),
						new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1000)
					],
					method: '',
					status: '',
					type: '', // 订单类型 退款订单 支付订单
					search: '', // 搜索
					startFee: '', 
					endFee: '',
					total_fee: '',
					out_trade_no: '',
					operator_id: '',
					terminalId: '',
				},
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
				tabbarList:[	// 商家导航
					{
						path: "home",	// 主页
						iconPath: "home",
						selectedIconPath: "home-fill",
						text: '首页',
						isDot: false,
						customIcon: false,
					},
					{
						path: "order",	// 订单
						iconPath: "file-text",
						selectedIconPath: "file-text-fill",
						text: '订单',
						customIcon: false,
					},
					{
						path: "pay",	// 收银
						iconPath: "rmb-circle",
						selectedIconPath: "rmb-circle-fill",
						text: '收银',
						midButton: true,
						customIcon: false,
					},
					{
						path: "report",	// 报表
						iconPath: "edit-pen",
						selectedIconPath: "edit-pen-fill",
						text: '报表',
						customIcon: false,
					},
					{
						path: "my",	// 我的
						iconPath: "account",
						selectedIconPath: "account-fill",
						text: '我的',
						isDot: false,
						customIcon: false,
					},
				],
				orderType: [
					{
						label: '支付订单',
						value: 1,
					},
					{
						label: '退款订单',
						value: -1,
					},
				],
				orderMethod: [
					{
						label: '微信支付',
						value: 'wechat',
					},
					{
						label: '支付宝',
						value: 'alipay',
					},
					{
						label: '银联云闪付',
						value: 'unionpay',
					},
					{
						label: '信用卡',
						value: 'credit',
					},
					{
						label: '银行卡',
						value: 'card',
					},
					{
						label: '数字货币',
						value: 'digital',
					},
				],
				orderStatus: [
					{
						label: '订单关闭',
						value: -1,
					},
					{
						label: '等待支付',
						value: 0,
					},
					{
						label: '支付成功',
						value: 1,
					},
				],
				showDate: false,
				search: '',
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'订单流水'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
			
		},
		onShow() {
			this.options = JSON.parse(JSON.stringify(RouteParams()))
			uni.setNavigationBarTitle({
				title: this.options.sellerName
			})
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
			clickTerminalId() {
				uni.getSystemInfo({
					success:(res) => {
						this.query.terminalId = res.deviceId
					}
				})
			},
			getList() {
				let where = ' true'
				if (this.query.date.length===2) {
					if (this.query.date[1] - this.query.date[0] > 31 * 24 * 60 * 60 * 1000) {
						uni.showToast({
                            duration: 3000,
                            icon:'error',
                            title:'不允许大于31天',
                        })
						return
					}
					const start = parseTime(this.query.date[0])
					const end = parseTime(new Date(this.query.date[1].getTime() + 1000))
					where = where + " And created_at >= '" + start + "' And created_at < '" + end + "'"
				}
				if (this.query.type) {
					if (this.query.type === 1) {
						where = where + " And total_fee > 0"
					} else {
						where = where + " And total_fee < 0"
					}
				}
				if (this.query.status !== '') {
					where = where + " And status = " + this.query.status + ""
				}
				if (this.query.method) {
					where = where + " And method = '" + this.query.method + "'"
				}

				if (this.query.startFee||this.query.endFee) {
					let startFee = this.query.startFee
					let endFee = this.query.endFee
					if (this.query.type === -1) {
						startFee = -this.query.endFee
						endFee = -this.query.startFee
					}
					where = where + " And total_fee >= " + Number(startFee * 100) + " And total_fee <= " + Number(endFee * 100) + ""
				}

				if (this.query.search) {
					where = where + ` And (out_trade_no like '%` + this.query.search + `%' Or trade_no like '%` + this.query.search + `%' Or bank_trade_no like '%` + this.query.search + `%' Or title like '%` + this.query.search + `%' Or attach like '%` + this.query.search + `%')`
				}

				if (this.query.total_fee) {
					where = where + ' And total_fee =' + Number(this.query.total_fee * 100)
				}
				if (this.query.out_trade_no) {
					where = where + " And (out_trade_no like '%" + this.query.out_trade_no + "%' OR trade_no like '%" + this.query.out_trade_no + "%' OR bank_trade_no like '%" + this.query.out_trade_no + "%')"
				}
				if (this.query.operator_id) {
					where = where + " And operator_id = '" + this.query.operator_id + "'"
				}
				if (this.query.terminalId) {
					where = where + " And terminal_id = '" + this.query.terminalId + "'"
				}
				this.listQuery.where = where
				this.status = 'loading';
				this.$u.api.institution.order.List({
					listQuery: this.listQuery,
					order: {
						userId: this.options.sellerId,
					}
				}).then(res => {
					if (res.orders) {
						res.orders.forEach(item => {
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
			deteOpen(index) {
				if (index === 0) {
					this.showDate = true
					this.$refs.uDropdown.close()
				}
				if (index === 1) {
					uni.scanCode({
						success:(res) =>{
							this.handlerSearch(res.result)
						}
					})
					this.$refs.uDropdown.close()
				}
			},
			changeDate(e){ // 时间选择
				this.query.date[0] = new Date(e.startDate + " 00:00:00")
				this.query.date[1] = new Date(e.endDate + " 23:59:59")
				this.listQuery = {
					page: 1,
					pageSize: 15,
					where: '',
					sort: 'ORDER BY created_at DESC, id DESC'
				}
				this.query.search = ''
				this.search = ''
				this.list = []
				this.getList()
			},
			clickFilter() {
				this.listQuery = {
					page: 1,
					pageSize: 15,
					where: '',
					sort: 'ORDER BY created_at DESC, id DESC'
				}
				this.query.search = ''
				this.search = ''
				this.list = []
				this.getList()
				this.$refs.uDropdown.close()
			},
			clickOrderTYpe(value) { // 点击订单支付类型
				if (this.query.type === value) {
					this.query.type = ''
				}else{
					this.query.type = value
				}
			},
			clickOrderMethod(value) { // 点击订单支付方式
				if (this.query.method === value) {
					this.query.method = ''
				}else{
					this.query.method = value
				}
			},
			clickOrderStatus(value) { // 点击订单支付状态
				if (this.query.status === value) {
					this.query.status = ''
				}else{
					this.query.status = value
				}
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
				this.query.date = []
				this.list = []
				this.getList()
			},
			click(item){
				this.$u.route({
					type: 'to',
					url: '/pages/institution/seller/order/item', 
				})
				this.$store.dispatch('institution/setOrderInfoCache',item)
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
