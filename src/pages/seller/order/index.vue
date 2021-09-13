<template>
	<view>
		<!-- <u-dropdown ref="uDropdown">
			<u-dropdown-item title="日期">
				<view class="slot-content">
					<view class="u-text-center u-content-color u-m-t-20 u-m-b-20">
						<u-button @click="startShow = true">打开</u-button>
						<u-button @click="endShow = true">打开End</u-button>
					</view>
					<u-button type="primary" @click="closeDropdown">确定</u-button>
				</view>
			</u-dropdown-item>
			<u-dropdown-item title="搜索">
				<view class="slot-content">
					<view class="center">其他自定义内容</view>
					<u-button type="primary" @click="closeDropdown">确定</u-button>
				</view>
			</u-dropdown-item>
			<u-dropdown-item title="筛选">
			</u-dropdown-item>
		</u-dropdown> -->
		<view>
			<view class="item"  v-for="(item, index) in list" :key="index" @click="click(item)">
				<view class="left">
					<span v-if="item.method==='alipay'">
						<u-icon name="zhifubao" custom-prefix="colour-icon" class="icon">></u-icon><br>
						支付宝
					</span>
					<span v-if="item.method==='wechat'">
						<u-icon name="weixinzhifu" custom-prefix="colour-icon" class="icon">></u-icon><br>
						微信支付
					</span>
					<span v-if="item.method==='unionpay'">
						<u-icon name="yunshanfu" custom-prefix="colour-icon" class="icon"></u-icon><br>
						云闪付
					</span>
					<span v-if="item.method==='digital'">
						<u-icon name="yunshanfu" custom-prefix="colour-icon" class="icon"></u-icon><br>
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
						<view class="error" v-if="Number(item.status)===-1">
							已关闭
						</view>
						<view class="warning" v-if="(!item.status || Number(item.status)===0)&&Number(item.totalFee)>0">
							等付款
						</view>
						<view v-if="Number(item.status)===1">
							<view v-if="Number(item.totalFee)>0">
								<view class="primary" v-if="Number(isFee(item.refundFee)) < Number(item.totalFee) && Number(isFee(item.refundFee))!==0">
									转入退款
								</view>
								<view class="warning" v-if="Number(isFee(item.refundFee)) === Number(item.totalFee)">
									全额退款
								</view>
								<view class="success">
									支付成功
								</view>
							</view>
							<view class="success" v-if="Number(item.totalFee)<0">
								退款成功
							</view>
						</view>
					</view>
				</view>
			</view>
			<u-loadmore :status="status" />
		</view>
		<u-picker mode="time" v-model="startShow" :params="params" @confirm="startConfirm" :default-time="parseTime(query.date[0])" :show-time-tag="false"></u-picker>
		<u-picker mode="time" v-model="endShow" :params="params" @confirm="endConfirm" :default-time="parseTime(query.date[1])" :show-time-tag="false"></u-picker>
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
					sort: 'created_at desc'
				},
				query: {
					date: [
						new Date(new Date(new Date().toLocaleDateString()).getTime() - 31 * 24 * 60 * 60 * 1000),
						new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1000)
					],
					query: '',
					total_fee: '',
					out_trade_no: '',
					operator_id: '',
					terminal_id: ''
				},
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
				startShow: false,
				endShow: false,
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
				]
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
		mounted() {
			this.init()
		},
		methods: {
			init() {
				this.listQuery = {
					page: 1,
					limit: 15,
					where: '',
					sort: 'created_at desc'
				}
				this.query = {
					date: [
						new Date(new Date(new Date().toLocaleDateString()).getTime() - 30 * 24 * 60 * 60 * 1000 - 1000),
						new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1000)
					],
					query: '',
					total_fee: '',
					out_trade_no: '',
					operator_id: '',
					terminal_id: ''
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
			startConfirm(e) {
				this.startTime = new Date(e.year+"-"+e.month+"-"+e.day+" "+e.hour+":"+e.minute+":"+e.second+"")
			},
			endConfirm(e) {
				this.endTime = new Date(e.year+"-"+e.month+"-"+e.day+" "+e.hour+":"+e.minute+":"+e.second+"")
			},
			isFee(fee) { // 价格是否存在不存在返回0
				return fee ? fee : 0
			},
			getList() {
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
				if (this.query.method) {
					where = where + " And method = '" + this.query.method + "'"
				}
				if (this.query.total_fee) {
					where = where + ' And total_fee =' + Number(this.query.total_fee * 100)
				}
				if (this.query.out_trade_no) {
					where = where + " And out_trade_no like '%" + this.query.out_trade_no + "%'"
				}
				if (this.query.operator_id) {
					where = where + " And operator_id = '" + this.query.operator_id + "'"
				}
				if (this.query.terminal_id) {
					where = where + " And terminal_id = '" + this.query.terminal_id + "'"
				}
				this.listQuery.where = where
				this.status = 'loading';
				this.$u.api.List({
					list_query: this.listQuery
				}).then(res => {
					res.orders.forEach(item => {
						this.list.push(item)
					});
					this.total = Number(res.total)
				})
			},
			click(item){
				this.$u.route({
					type: 'to',
					url: '/pages/seller/order/item', 
				})
				this.$store.dispatch('seller/setOrderInfoCache',item)
			}
			
		},
	}
</script>

<style lang="scss" scoped>
.item {
	height: 60px;
	width: 100%;
	background: #fff;
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
</style>
