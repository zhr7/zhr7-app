<template>
	<view>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
			<view class="u-m-r-10">
				<u-avatar :src="avatar" size="140"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{name}}</view>
				<view class="u-font-14 u-tips-color">账号: {{username}}</view>
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="grid" color="#969799" size="28"></u-icon>
			</view>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item @click="handler('balance')" icon="rmb-circle" title="余额">{{fee(balance)}}</u-cell-item>
				<u-cell-item @click="handler('profit')" icon="rmb-circle" title="分润管理"></u-cell-item>
			</u-cell-group>
		</view>
		
		<!-- <view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item @click="handler('institution')" icon="rmb-circle" title="机构管理"></u-cell-item>
			</u-cell-group>
		</view> -->
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item @click="handler('message-wechat')" icon="weixin-fill" title="微信通知"></u-cell-item>
				<u-cell-item @click="handler('institutionReport')" icon="volume" title="机构报表"></u-cell-item>
				<u-cell-item @click="handler('sellerReport')" icon="coupon" title="商家报表"></u-cell-item>
				<u-cell-item @click="handler('seller')" icon="tags" title="商家管理"></u-cell-item>
				<u-cell-item @click="handler('institution')" icon="server-man" title="机构管理"></u-cell-item>
			</u-cell-group>
		</view>
		<view class="u-m-t-20">
			<u-cell-group>
				<view @click="clickDeleteUsers" class="cell-item">删除账号缓存</view>
			</u-cell-group>
			<u-cell-group>
				<view @click="showActionSheet = !showActionSheet" class="cell-item">切换账号</view>
			</u-cell-group>
		</view>
		<view class="u-m-t-20">
			<u-cell-group>
				<view @click="outLogin" class="cell-item">退出登录</view>
			</u-cell-group>
		</view>
		<u-action-sheet :list="listActionSheet" v-model="showActionSheet" @click="clickActionSheet"></u-action-sheet>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	import {  mapGetters } from 'vuex'
	export default {
		computed: {
			...mapGetters([
				'name',
				'username',
				'avatar',
				'balance',
			]),
		},
		data() {
			return {
				title: 'My',
				users: {},
				listActionSheet: [],
				showActionSheet: false,
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title: "我的商户"
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
			this.init()
		},
		methods: {
			init(){
				this.users = uni.getStorageSync('users')
				Object.keys(this.users).forEach((index,key) => {
					this.listActionSheet.push({
						text: this.users[index].username,
						color: '#303133',
						subText: this.users[index].name,
					})
				});
			},
			fee(number) { // 是否存在不存在返回0
				return "￥"+((number ? Number(number) : 0)/100).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
			},
			outLogin(){
				this.$store.dispatch('user/logout')
				this.$u.route({
					type:'redirectTo',
					url: 'pages/login/index'
				})
			},
			clickDeleteUsers() {
				uni.removeStorageSync("users")
				this.$refs.uToast.show({
					title: "账号缓存已删除"
				})
			},
			clickActionSheet(index) {
				const usernme = this.listActionSheet[index].text
				// 重新排序
				let us = {}
				Object.keys(this.users).forEach((i,key) => {
					if (usernme!==i) {
						us[i] = this.users[i]
					}
				})
				us[usernme] = this.users[usernme]
				uni.setStorageSync('users', us)
				// 重新排序
				uni.setStorageSync('token', this.users[usernme].token)
				this.$u.route({
					type: 'reLaunch',
					url: '/pages/index/index', 
				})
			},
			handler(path) {
				switch (path) {
					case 'password':
						this.$u.route({
							url: '/pages/my/password', 
						})
						break;
					case 'balance':
						this.$u.route({
							url: '/pages/my/balance/index', 
						})
						break;
					case 'profit':
						this.$u.route({
							url: '/subPackages/profit/index', 
						})
						break;
					case 'message-wechat':
						this.$u.route({
							url: '/pages/my/message/wechat/index', 
						})
						break;
					default:
						this.$emit('handlerPath', path)
						this.$refs.uToast.show({
							title: "正在努力开发中。。"
						})
						break;
				}
				// this.$emit('handlerPath', e)
				// this.$refs.uToast.show({
				// 	title: "努力开发中"
				// })
			}
		}
	}
</script>

<style lang="scss" scoped>
.cell-item {
	text-align:center;
	line-height: 50rpx;
	padding: 20rpx 30rpx;
}
.cell-item:active{
	background-color: #f4f4f5;
} 
.cell-item:focus{
	background-color: #f4f4f5;
} 
.user-box{
	background-color: #fff;
}
</style>
