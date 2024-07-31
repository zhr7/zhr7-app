<template>
	<view class="item">
        <view class="top">
            <view class="type">可用余额(元)</view>
            <view class="balance">{{fee(balance)}}</view>
            <view class="bottom">
                <u-button 
                    class="button"
                    @click="submitForm('Withdraw')"
                >
                    提现
                </u-button>
                <u-button 
                    type="primary" 
                    class="button"
                    @click="submitForm('Deposit')"
                >
                    充值
                </u-button>
            </view>
        </view>
        <view class="content">
			<view class="item" v-for="(item, index) in list" :key="index" @click="click(item)">
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
						{{fee2(item.totalFee)}}
					</view>
					<view class="status">
						余额 {{fee2(item.currentBalance)}} 
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
    import { parseTime } from '@/utils'
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
					limit: 15,
					where: '',
					sort: 'created_at desc'
				}
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'余额'
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
					limit: 15,
					where: 'WHERE true',
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
            isNumber(fee) { // 价格是否存在不存在返回0
				return fee ? Number(fee)  : 0
			},
            replaceTime(time){
                return parseTime(time)
			},
            
            getList() {
				this.status = 'loading';
				this.$u.api.v3.user.order.Search(this.listQuery).then(res => {
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
            submitForm(formName) {
                switch (formName) {
                    case 'Deposit': // 充值
                        this.$u.route({
                            url: '/pages/my/balance/deposit', 
                        })
                        break;
                    case 'Withdraw':
                        uni.showToast({
                            duration: 5000,
                            icon:'error',
                            title:'暂不支持提现',
                        })
                        break;
                }
            },
            fee(number) { // 是否存在不存在返回0
				return "￥"+((number ? Number(number) : 0)/100).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
			},
            fee2(number) { // 是否存在不存在返回0
				return ((number ? Number(number) : 0)/100).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
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
    .top{
        position: fixed;
        top: 0;
        z-index: 99999;
        height: 27vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #7d33ff;
        color: #ffffff;
        padding: 5vw;
        border-radius: 0 0 5px 5px;
        .type{
            font-size: 3vw;
        }
        .balance{
            font-size: 9vw;
        }
        .bottom {
            width: 100vw;
            margin-top: 5vh;
            padding: 5vw;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            .button{
                width: 40vw;
            }
        }
    }
    .content{
        padding: 2vw;
        margin-top: 27vh;
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
                    font-size: 14px;
                    color: #000;
                }
                .status {
                    font-size: 12px;
                    color: #909399;
                }
            }
        }
    }
}
</style>

