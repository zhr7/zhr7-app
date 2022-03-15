<template>
	<view>
        <image class="index" src="https://wap.bichengbituo.com/static/h5/img/index.png"></image>
	</view>
</template>
<script>
    import {  mapGetters } from 'vuex'
    import { parseTime }  from '@/utils'
	export default {
		data() {
			return {
			}
		},
        computed: {
			...mapGetters([
				'name',
				'userId',
				'avatar',
			]),
		},
		created() {
			uni.setNavigationBarTitle({
				title: this.name
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#8a24b7',  
			})
		},
		mounted() {
            my.ix.onKeyEventChange((r) => {
                switch (r.keyCode) {
                    case 131:
                        this.startApp(r.amount)
                        break;
                    case 136:
                        this.$u.route({
                            type: 'redirectTo',
                            url: '/pages/index/index'
                        })
                        break;
                    default:
                        break;
                }
                console.log(r);
            })
		},
        destroyed() {
            my.ix.offKeyEventChange();
        },
		methods: {
            startApp(totalAmount) {
                const outTradeNo = parseTime(new Date,'{y}{m}{d}{h}{i}{s}{n}') + Math.round(Math.random()*1000)
                my.ix.startApp({
                    appName: 'cashier',
                    bizNo: outTradeNo,
                    totalAmount: totalAmount,
                    posTimeout: '30',
                    faceLoadingTimeout: '10',
                    scanLoadingTimeout: '10',
                    success: (r) => {
                        const amount = Math.round(totalAmount * 100)
                        this.aopF2F(outTradeNo, amount, r.barCode, r.deviceSn )
                    },
                    fail: (r) => {
                        if (r.error===1400) {
                            const errMsg = '收款金额错误'
                            my.showToast({ content: errMsg });
                            my.ix.speech({
                                text: errMsg,
                                speak: true,
                                success: (r) => {
                                    console.log(r);
                                }
                            });
                        }
                    }
                });
                  
            },
            aopF2F(outTradeNo, totalFee, code, terminalId) {
                my.showToast({ content: '收款下单中' });
				const order = {
					bizContent: {
						authCode: code,
						outTradeNo: outTradeNo,
						title: "刷脸设备",
						totalFee: String(totalFee),
						terminalId: terminalId,
					}
				}
				this.$u.api.pay.tradeAuth.AopF2F(order).then(res=>{
					if (res.content.returnCode === 'SUCCESS' && res.content.status === 'SUCCESS') {
						uni.showToast({
                            duration: 5000,
                            icon:'success',
                            title:'收款成功',
                        })
						this.successTotalFee = this.totalFee
						this.totalFee = ""
					} else {
						this.Query(order)
					}
				}).catch(err => {
					this.Query(order)
				})
			},
			Query(order){
				uni.showLoading({
					title:'收款查询中'
				})
				this.$u.api.pay.tradeAuth.Query(order).then(res => {
					if (res.content.returnCode === 'SUCCESS') {
						switch (res.content.status) {
							case 'SUCCESS':
								uni.showToast({
                                    duration: 10000,
                                    icon:'success',
                                    title:'收款成功',
                                })
								this.totalFee = ""
								break;
							case 'USERPAYING':
								uni.showToast({
                                    duration: 5000,
                                    icon:'loading',
                                    title:'等待用户付款',
                                })
								setTimeout(() => {
									this.Query(order)
								}, 3000)
								break;
							case 'WAITING':
								uni.showToast({
                                    duration: 5000,
                                    icon:'loading',
                                    title:'系统方繁忙稍后查询',
                                })
								setTimeout(() => {
									this.Query(order)
								}, 3000)
							case 'CLOSED':
								uni.showToast({
                                    duration: 5000,
                                    icon:'error',
                                    title:'订单已关闭',
                                })
								break;
							default:
								break;
						}
					}

				}).catch(error => {
					uni.showToast({
                        duration: 5000,
						icon:'error',
						title:'查询失败!请到流水里面查询'
					})
				})
			}
		},
         // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
        onReady() {
        }
	}
</script>

<style lang="scss" scoped>
.index {
	width: 100vw;
    height: 100vh;
}
</style>
