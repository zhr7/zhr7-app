<template>
	<view class="item">
		<view class="line">
			<span v-if="item.brandId===item.id" class="info">
				<m-icon name="brand" custom-prefix="colour-icon" class="38"></m-icon><br>
				品牌
			</span>
			<span v-else class="info">
				<m-icon name="seller" custom-prefix="colour-icon" class="38"></m-icon><br>
				门店
			</span>
			<view>
				<view class="right name">{{item.name}}</view>
				<view class="right info">{{item.username}}</view>
				<view class="right info">{{item.mobile}}</view>
			</view>
		</view>
		<u-line />
		<view class="line">
			<u-grid
                :border="false"
                col="3"
			>
				<u-grid-item>
					<m-icon
						name="seller" 
						custom-prefix="colour-icon" 
						:size="58"
						@click="handler('seller')"
					></m-icon>
					<text class="grid-text">相关门店</text>
				</u-grid-item>
				<u-grid-item>
					<m-icon
						name="order-list" 
						custom-prefix="colour-icon" 
						:size="58"
						@click="handler('sellerOrder')"
					></m-icon>
					<text class="grid-text">交易明细</text>
				</u-grid-item>
				<u-grid-item>
					<m-icon
						name="seller-report" 
						custom-prefix="colour-icon" 
						:size="58"
						@click="handler('sellerReport')"
					></m-icon>
					<text class="grid-text">日结报表</text>
				</u-grid-item>
				<u-grid-item>
					<m-icon
						name="password"
						custom-prefix="colour-icon" 
						:size="58"
						@click="handler('sellerPassword')"
					></m-icon>
					<text class="grid-text">密码重置</text>
				</u-grid-item>
				<u-grid-item>
					<m-icon
						name="pay"
						custom-prefix="colour-icon" 
						:size="58"
						@click="handler('sellerPay')"
					></m-icon>
					<text class="grid-text">支付配置</text>
				</u-grid-item>
				<u-grid-item>
					<m-icon
						name="setting"
						custom-prefix="colour-icon" 
						:size="58"
						@click="handler('sellerSetting')"
					></m-icon>
					<text class="grid-text">商家配置</text>
				</u-grid-item>
				<u-grid-item>
					<m-icon
						name="device" 
						custom-prefix="colour-icon" 
						:size="58"
						@click="handler('sellerDevice')"
					></m-icon>
					<text class="grid-text">设备管理</text>
				</u-grid-item>
				<u-grid-item>
					<m-icon
						name="qrcode" 
						custom-prefix="colour-icon" 
						:size="58"
						@click="handler('sellerQrcode')"
					></m-icon>
					<text class="grid-text">收款码</text>
				</u-grid-item>
				<u-grid-item>
					<m-icon
						name="delete"
						custom-prefix="colour-icon" 
						:size="58"
						@click="handler('delete')"
					></m-icon>
					<text class="grid-text">删除商家</text>
				</u-grid-item>
			</u-grid>
		</view>	
		<u-modal v-model="modalShow" :show-cancel-button="true" @confirm="submitDelete()">
			<view class="slot-content">
				<u-input v-model="modalContent" placeholder="请输入【我确认删除】"/>
			</view>
		</u-modal>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	import { RouteParams } from '@/utils'
	export default {
		computed: {
		},
		data() {
			return {
				modalShow: false,
				modalContent: '',
				item: {},
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'商家详情'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
		},
		onShow() {
			this.item = RouteParams()
		},
		methods: {
			isNumber(fee) { // 价格是否存在不存在返回0
				return fee ? Number(fee) : 0
			},
			replaceTime(time){
				time = time.replace("T", " ")
				return time.replace("+08:00", "")
			},
			refund() {
				this.$u.route({
					type: 'to',
					url: '/pages/seller/order/refund', 
				})
			},
			handler(e){
				switch (e) {
					case "seller":
						this.$u.route({
							type: 'to',
							url: '/pages/institution/seller/index?brandId=' + this.item.brandId
						})
						break;
					case "sellerOrder":
						this.$u.route({
							type: 'to',
							url: '/pages/institution/seller/order/index?sellerId=' + this.item.id + '&sellerName=' + this.item.name
						})
						break;
					case "sellerReport":
						this.$u.route({
							type: 'to',
							url: '/pages/institution/seller/report/index?sellerId=' + this.item.id + '&sellerName=' + this.item.name
						})
						break;
					case "sellerPassword":
						this.$u.route({
							type: 'to',
							url: '/pages/institution/seller/password/index?sellerId=' + this.item.id + '&sellerName=' + this.item.name
						})
						break;
					case "sellerSetting":
						this.$u.route({
							type: 'to',
							url: '/pages/institution/seller/setting/index?id=' + this.item.id 
						})
						break;
					case "sellerDevice":
						this.$u.route({
							type: 'to',
							url: '/pages/institution/seller/device/index?id=' + this.item.id + '&name=' + this.item.name
						})
						break;
					case "sellerQrcode":
						this.$u.route({
							type: 'to',
							url: '/pages/institution/seller/qrcode/index?id=' + this.item.id + '&name=' + this.item.name
						})
						break;
					case "delete":
						this.modalShow = true
						break;
					default:
						this.$refs.uToast.show({
							title: "努力开发中"
						})
						break;
				}
			},
			submitDelete() {
				if (this.modalContent === '我确认删除') {
					this.$u.api.institution.seller.Delete({
						seller: {
							id: this.item.id
						}
					}).then(res => {
						if (res.valid) {
							uni.showToast({
								duration: 3000,
								icon:'success',
								title:'删除商家成功',
							})
							this.$store.dispatch('seller/changeInitCache') // 通知商家首页更新
							setTimeout(()=>{ 
								this.$u.route({
									type: 'back', 
								})
							}, 3000);
						} else {
							uni.showToast({
								duration: 3000,
								icon:'error',
								title:'删除商家失败',
							})
						}
					}).catch(err => {
						console.log(err);
						uni.showToast({
							duration: 3000,
							icon:'error',
							title: err.data.detail,
						})
					})
				}else{
					uni.showToast({
						duration: 3000,
						icon:'error',
						title:'删除失败',
					})
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
.item {
	background-color: #fff;
	height: 100vh;
	padding: 5vw;
	.line {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 5px;
		padding-top: 10px;
		padding-bottom: 10px;
	}
	.info {
		color: #909399;
		font-size: 10px;
	}
	.right {
		text-align: right;
	}
	.name {
		font-size: 4vw;
		color: #dd6161;
	}
}
.icon{
	font-size: 38px;
}
.info{
	color: #909399;
	text-align: center;
}
.grid-text {
    font-size: 14px;
    color: #909399;
    padding: 10rpx 0 20rpx 0rpx;
    /* #ifndef APP-PLUS */
    box-sizing: border-box;
    /* #endif */
}
.order{
	color: #409EFF;
}
.report{
	color: #19be6b;
}
.pay{
	color: #67C23A;
}
.setting {
	color: #F56C6C;
}
.password {
	color: #E6A23C;
}
.slot-content{
	padding: 5vw;
}
</style>

