<template>
	<view class="">
		<view class="top">
			<seller-select v-if="roles.indexOf('BrandMerchant')!=-1" @sellerId="handlerSellerId"/>
			<view class="line">
				<view class="title">
					今日交易统计
				</view>
			</view>
			<u-line/>
			<view class="line">
				<view class="left">
					交易额
				</view>
				<view class="right totalFee">
					￥{{(amount.totalFee/100).toFixed(2)}}
				</view>
			</view>
			<view class="line">
				<view class="left">
					交易笔数
				</view>
				<view class="right">
					{{amount.total-amount.refundTotal}}
				</view>
			</view>
			<view class="line">
				<view class="left">
					手续费
				</view>
				<view class="right">
					￥{{(amount.fee/100).toFixed(2)}}
				</view>
			</view>
			<view class="line">
				<view class="left">
					结算金额
				</view>
				<view class="right">
					￥{{((amount.totalFee-amount.fee)/100).toFixed(2)}}
				</view>
			</view>
			<view class="line">
				<view class="left">
					退款金额
				</view>
				<view class="right">
					￥{{(amount.refundFee/100).toFixed(2)}}
				</view>
			</view>
			<view class="line">
				<view class="left">
					退款笔数
				</view>
				<view class="right">
					{{amount.refundTotal}}
				</view>
			</view>
			<u-line/>
			<view class="qrcode" v-if="userId">
				<view class="title">商家收款码</view>
				<tki-qrcode cid="qrcode" ref="qrcode" class="qrcode" :val="payQrcodeUrl+'?user_id='+userId" :size="400" :show="true" :loadMake="true" @result="qrR"/>
				<u-button type="info" @click="saveQrcodeToPhotosAlbum">保存二维码</u-button>
			</view>
		</view>
	</view>
</template>
<script>
	import {  mapGetters, mapState } from 'vuex'
	import { parseTime } from '@/utils'
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'
	import sellerSelect from '@/components/seller/select.vue'
	export default {
		components: { 
			tkiQrcode,
			sellerSelect
		},
		computed: {
			...mapState({
				payQrcodeUrl: state => state.settings.payQrcodeUrl
			}),
			...mapGetters([
				'name',
				'userId',
				'avatar',
				'roles',
			]),
		},
		data() {
			return {
				query: {
					date: [
						new Date(new Date(new Date().toLocaleDateString()).getTime() - 10 * 24 * 60 * 60 * 1000 - 1000),
						new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1000)
					]
				},
				amount: {
					totalFee: 0,
					fee: 0,
					buyerPayFee: 0,
					rebate: 0,
					total: 0,
					refundFee: 0,
					refundTotal: 0
				},
				qrcodeSrc: '',
				sellerId: 'all'
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title: '首页'
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
			qrR(res) {
				this.qrcodeSrc = res
			},
			saveQrcodeToPhotosAlbum(){
				uni.saveImageToPhotosAlbum({
                    filePath: this.qrcodeSrc,
                    success() {
                      	// 5 提示保存成功
						uni.showToast({
							title: "保存成功",
							duration: 3000
						})
                    }
				})
			},
			init() {
				this.query = {
					date: [
						new Date(new Date(new Date().toLocaleDateString()).getTime()),
						new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000)
					]
				}
				this.getAmount()
			},
			getAmount() {
				let where = 'WHERE true'
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
					const end = parseTime(new Date(this.query.date[1].getTime()))
					where = where + " And created_at >= '" + start + "' And created_at < '" + end + "'"
				}
				if (this.sellerId != 'all') {
					where = where + " And user_id = '" + this.sellerId + "'"
				}
				this.$u.api.v3.order.order.Amount({
					where: where,
					startTime: Math.floor(this.query.date[0].getTime() / 1000),
					endTime: Math.floor(this.query.date[1].getTime() / 1000)
				}).then(res => {
					this.amount = {
						totalFee: 0,
						fee: 0,
						buyerPayFee: 0,
						rebate: 0,
						total: 0,
						refundFee: 0,
						refundTotal: 0
					}
					if (res) {
						const amount = res
						if (amount.total) {
							this.amount.total = amount.total
						}
						if (amount.totalFee) {
							this.amount.totalFee = amount.totalFee
						}
						if (amount.fee) {
							this.amount.fee = amount.fee
						}
						if (amount.refundFee) {
							this.amount.refundFee = amount.refundFee
						}
						if (amount.refundTotal) {
							this.amount.refundTotal = amount.refundTotal
						}
						if (amount.buyerPayFee) {
							this.amount.buyerPayFee = amount.buyerPayFee
						}
					}
				})
			},
			handlerSellerId(id){
				this.sellerId = id
				this.getAmount()
			}
		}
	}
</script>
<style lang="scss" scoped>
.top {
	background-color: #fff;
	height: 100%;
	padding: 5vw;
	.line {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 5px;
		padding-top: 10px;
		padding-bottom: 10px;
		.title {
			font-size: 16px;
			font-weight: 500;
		}
		.right {
			text-align: right;
			font-weight: 900;
			color: #7d33ff;
		}
		.totalFee {
			font-size: 27px;
			color: #F56C6C;
		}
	}
	.qrcode {
		width:200px;
		margin:0 auto;
		text-align:center;
		.title{
			margin-top: 20px;
			font-size: 16px;
		}
		.qrcode {
			margin: 10px;
			width:200px;
			height: 200px;
		}
	}
}
</style>
