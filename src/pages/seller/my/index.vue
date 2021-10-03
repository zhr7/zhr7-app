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
				<u-cell-item @click="handler" icon="rmb-circle" title="秘钥管理"></u-cell-item>
			</u-cell-group>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item @click="handler" icon="volume" title="云喇叭"></u-cell-item>
				<u-cell-item @click="handler" icon="coupon" title="云打印机"></u-cell-item>
				<u-cell-item @click="handler" icon="tags" title="门店"></u-cell-item>
				<u-cell-item @click="handler" icon="server-man" title="收银员/终端"></u-cell-item>
				<u-cell-item @click="handler('password')" icon="eye-fill" title="修改密码"></u-cell-item>
			</u-cell-group>
		</view>
		<view class="u-m-t-20">
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
			outLogin(){
				this.$store.dispatch('user/logout')
				this.$u.route({
					type:'redirectTo',
					url: 'pages/login/index'
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
