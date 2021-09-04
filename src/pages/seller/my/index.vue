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
				<u-icon name="scan" color="#969799" size="28"></u-icon>
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
			</u-cell-group>
		</view>
		<view class="u-m-t-20">
			<u-cell-group>
				<view @click="replaceLogin" class="cell-item">切换账号</view>
			</u-cell-group>
		</view>
		<view class="u-m-t-20">
			<u-cell-group>
				<view @click="outLogin" class="cell-item">退出登录</view>
			</u-cell-group>
		</view>
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
		},
		methods: {
			outLogin(){
				this.$store.dispatch('user/logout')
				this.$u.route({
					type:'redirectTo',
					url: 'pages/login/index'
				})
			},
			replaceLogin() {

			},
			handler() {
				this.$refs.uToast.show({
					title: "正在努力开发中。。"
				})
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
