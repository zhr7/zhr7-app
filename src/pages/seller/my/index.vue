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
			</u-cell-group>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<!-- <u-cell-item @click="handler" icon="volume" title="云喇叭"></u-cell-item>
				<u-cell-item @click="handler" icon="coupon" title="云打印机"></u-cell-item>
				<u-cell-item @click="handler" icon="tags" title="门店"></u-cell-item>
				<u-cell-item @click="handler('password')" icon="eye-fill" title="修改密码"></u-cell-item> -->
				<u-cell-item @click="handler('message-wechat')" icon="weixin-fill" title="微信通知"></u-cell-item>
				<!-- #ifdef APP-PLUS || MP-ALIPAY -->
				<u-cell-item icon="volume-up-fill" title="收款语音播报" :arrow="false">
					<u-switch v-model="palyOrder"></u-switch>
				</u-cell-item>
				<u-cell-item icon="error-circle-fill" title="软件版本" :arrow="false">{{version}}.{{versionCode}}</u-cell-item>
				<!-- #endif -->
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
	import { mapState } from 'vuex'
	export default {
		computed: {
			...mapGetters([
				'name',
				'username',
				'avatar',
				'balance',
			]),
			...mapState({
				versionCode: state => state.settings.versionCode,
				version: state => state.settings.version
			}),
			palyOrder: {
				get() {
					return this.$store.state.socket.palyOrder
				},
				set(value) {
					this.$store.dispatch('socket/setPalyOrder')
				},
			}
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
					case 'message-wechat':
						this.$u.route({
							url: '/pages/my/message/wechat/index', 
						})
						break;
					default:
						this.$refs.uToast.show({
							title: "正在努力开发中。。"
						})
						break;
				}
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
