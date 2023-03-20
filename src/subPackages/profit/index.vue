<template>
	<view class="item">
        <view class="top">
            <view class="type">待确认金额(元)</view>
            <view class="balance">{{fee(orgProfit)}}</view>
            <view class="bottom">
                <u-button 
                    type="info"
                    class="button"
                    @click="submitForm('profitList')"
                >
                    分润账单
                </u-button>
                <u-button 
                    type="info" 
                    class="button"
                    @click="submitForm('cashList')"
                >
                    提现记录
                </u-button>
            </view>
            <view class="bottom">
                <u-button 
                    type="primary" 
                    class="button"
                    @click="submitForm('cashAccount')"
                >
                    提现账户
                </u-button>
                <u-button 
                    type="warning" 
                    class="button"
                    @click="show=true"
                    :disabled="orgProfit<=0"
                >
                    确认提现
                </u-button>
            </view>
        </view>
		<u-modal 
            v-model="show"
            title="提现到银行卡"
            :show-cancel-button="true"
            @confirm="submitCashConfirm()"
        >
            <view class="slot-content">
                提现到银行卡<br>
                1、代扣6%的税点，出款服务费3.00元/笔。 <br>
                2、到账时间1-3个工作日。 <br>
                3、如对数据存疑，请联系官方电话400-104-6788。
			</view>
        </u-modal>
        <view class="content">
            <span>
                提现到银行卡<br>
                1、代扣6%的税点，出款服务费3.00元/笔。 <br>
                2、到账时间1-3个工作日。 <br>
                3、如对数据存疑，请联系官方电话400-104-6788。
            </span>
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
                orgProfit: 0,
                show: false,
                content: `
                提现到银行卡<br>
                1、代扣6%的税点，出款服务费3.00元/笔。 <br>
                2、到账时间1-3个工作日。 <br>
                3、如对数据存疑，请联系官方电话400-104-6788。
                `
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'分润'
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
				this.sumProfit()
			},
            isNumber(fee) { // 价格是否存在不存在返回0
				return fee ? Number(fee)  : 0
			},
            replaceTime(time){
                // 替换字符串T为空格替换+08:00为空
                return time.replace(/T/g,' ').replace(/\+08:00/g,'')
			},
            
            sumProfit() {
                this.orgProfit = 0;
				this.$u.api.v3.profit.my.ProfitSumSearch({
                    page: 1,
                    pageSize: 1000000,
                    sort: "ORDER BY id DESC",
                    where: 'WHERE true AND status = 0',
                }).then((res) => {
                    this.orgProfit = res.profit.orgProfit;
                });
			},
            submitCashConfirm() {
                this.$u.api.v3.profit.my.ProfitAffirm().then((res) => {
                    this.sumProfit()
                    if (res.valid) {
                        this.$u.route({
                            url: '/subPackages/profit/cashList', 
                        })
                    }
                });
            },
            submitForm(formName) {
                switch (formName) {
                    case 'profitList': // 分润账单
                        this.$u.route({
                            url: '/subPackages/profit/list', 
                        })
                        break;
                    case 'cashList': // 现金账单
                        this.$u.route({
                            url: '/subPackages/profit/cashList', 
                        })
                        break;
                    case 'cashAccount': // 现金账单
                        this.$u.route({
                            url: '/subPackages/profit/cashAccount', 
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
				return "￥"+((number ? Number(number) : 0)/100/100000).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
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
        z-index: 100;
        height: 39vh;
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
            margin-top: 2vh;
            padding: 2vw;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            .button{
                width: 46vw;
            }
        }
    }
    .content{
        padding: 2vw;
        margin-top: 39vh;
        height: 61vh;
    }
}
.slot-content{
    padding: 2vw;
    font-size: 3vw;
}
</style>

