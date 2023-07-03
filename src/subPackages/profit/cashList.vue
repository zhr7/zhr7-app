<template>
	<view class="item">
        <view class="content">
			<view class="item" v-for="(item, index) in list" :key="index" @click="click(item)">
				<view class="center">
					<view class="name">
						{{item.date}} 
					</view>
					<view class="time">
						{{item.profitId}} 
					</view>
				</view>
				<view class="right">
					<view class="totalFee" :class="item.status == 0? 'primary':'success'">
						{{feeProfitShow(item.totalFee)}} 
					</view>
					<view class="status">
						<u-tag v-if="item.status === 0" size="mini" color="#909399" text="未收款"/>
						<u-tag v-if="item.status === 1" size="mini" color="#2db7f5" text="已收70%"/>
						<u-tag v-if="item.status === 2" size="mini" color="#67C23A" text="已全额收款"/>
					</view>
				</view>
			</view>
			<u-loadmore :status="status" />
		</view>
        <u-toast ref="uToast" />
	</view>
</template>
<script>
	import { mapState, mapGetters } from 'vuex'
	export default {
		computed: {
            ...mapGetters([
				'name',
				'username',
				'avatar',
				'balance',
			]),
			...mapState({
				item: state => state.seller.orderInfoCache
			})
		},
		data() {
			return {
                status: 'loadmore',
				list: [],
				total: 0,
				listQuery: {
					page: 1,
					pageSize: 15,
					where: 'WHERE true ',
					sort: "ORDER BY id DESC",
				}
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'提现记录'
			})
			uni.setNavigationBarColor({
				frontColor: '#ffffff',  
                backgroundColor: '#7d33ff',  
			})
		},
		mounted() {
			this.init()
		},
		onPullDownRefresh() {
			this.init()
		},
		methods: {
			init() {	//  初始化加载查询
                this.$store.dispatch('user/getInfo').then(()=>{
					uni.stopPullDownRefresh()
				})
                this.listQuery = {
					page: 1,
					pageSize: 15,
					where: 'WHERE true ',
					sort: "ORDER BY id DESC",
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
            isNumber(fee) { // 价格是否存在不存在返回0
				return fee ? Number(fee)  : 0
			},
            replaceTime(time){
                // 替换字符串T为空格替换+08:00为空
                return time.replace(/T/g,' ').replace(/\+08:00/g,'')
			},
            
            getList() {
				this.status = 'loading';
				this.$u.api.v3.profit.my.CashList(this.listQuery).then(res => {
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
            feeProfitShow(number) { // 是否存在不存在返回0
				return "￥"+((number ? Number(number) : 0)/ 100 / 100000).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
			},
			feeShow(number) { // 是否存在不存在返回0
				return "￥"+((number ? Number(number) : 0)/ 100).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
			},
            fee2(number) { // 是否存在不存在返回0
				return ((number ? Number(number) : 0)/100 / 100000).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
			},
		},
        // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
        onReady() {
        }
	}
</script>

<style lang="scss" scoped>
.item {
	background-color: #fff;
	height: 100%;
    .content{
        padding: 2vw;
        .item {
            height: 50px;
            width: 100%;
            background-color: #fff;
            margin-bottom: 5px;
            display: flex;
            padding: 0 2vw 0 1vw ;
            .center{
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 5px;
                .title {
                    font-size: 14px;
                }
				.nameSub {
                    font-size: 10px;
                    color: #909399;
				}
                .time {
                    font-size: 10px;
                    color: #909399;
					// 自动换行
					word-break: break-all;
					overflow: hidden;
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
                    font-size: 14px;
                }
                .status {
                    font-size: 12px;
                    color: #909399;
                }
            }
        }
    }
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
</style>

