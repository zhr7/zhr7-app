<template>
	<view>
		<!-- #ifdef MP-ALIPAY -->
        	<image class="index" src="https://wap.bichengbituo.com/static/h5/img/index.png"></image>
		<!-- #endif -->
	</view>
</template>
<script>
    import {  mapGetters } from 'vuex'
    import { parseTime }  from '@/utils'
	export default {
		data() {
			return {
				codeType: "C",
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
					case 134:
                        this.$u.route({
                            type: 'redirectTo',
                            url: '/pages/index/index'
                        })
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
						this.codeType = r.codeType
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
					},
					userId: this.userId
				}
				this.$u.api.v3.institution.tradeAuth.AopF2F(order).then(res=>{
					console.log(res);
					if (res.returnCode === 'SUCCESS' && res.status === 'SUCCESS') {
						uni.showToast({
                            duration: 5000,
                            icon:'success',
                            title:'收款成功',
                        })
						this.play(res) // 语音播报
						this.successTotalFee = this.totalFee
						this.totalFee = ""
					} else {
						my.showToast({
							type: 'fail',
							content: res.returnMsg,
							duration: 5000,
						});
						// 等待5秒
						setTimeout(()=>{
							this.Query(order)
						},5000)
					}
				}).catch(err => {
					console.log(err);
					my.showToast({
						type: 'fail',
						content: JSON.stringify(err),
						duration: 10000,
					});
					this.Query(order)
				})
			},
			play(order) {
				// 开启socket播报后不重复播报
				if (this.$store.state.socket.palyOrder) {
					return
				}
				if (this.codeType === "F") { // 刷脸支付时不播报
					return
				}
				switch (order.method) {
				case 'wechat':
					order.method = '微信'
					break
				case 'alipay':
					order.method = '支付宝'
					break
				case 'unionpay':
					order.method = '银联'
					break
				case 'digital':
					order.method = '数字人民币'
					break
				case 'sdykt':
					order.method = '山东一卡通'
					break
				}
				// 替换.00为空防止播报两百点零零元
				let text = "收款"+((order.totalFee ? Number(order.totalFee) : 0)/100).toFixed(2).replace(/\.00/g, '')+"元"
				if (order.operatorName) {
					text = order.operatorName+text
				}else{
					text = order.method+text
				}
				my.ix.speech({
					text: text,
					success: (r) => {
					}
				})
			},
			Query(order){
				uni.showLoading({
					title:'收款查询中'
				})
				this.$u.api.v3.institution.tradeAuth.Query(order).then(res => {
					if (res.returnCode === 'SUCCESS') {
						switch (res.status) {
							case 'SUCCESS':
								uni.showToast({
                                    duration: 10000,
                                    icon:'success',
                                    title:'收款成功',
                                })
								this.play(res) // 语音播报
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
					my.showToast({
						type: 'fail',
						content: JSON.stringify(err),
						duration: 10000,
					});
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
