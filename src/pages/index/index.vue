<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view>
			<text class="title">{{title}}</text>
		</view>
		<tabbar
			:list="list"
			@change="navChange"
		/>
	</view>
</template>
<script>

	import tabbar from '@/components/tabbar.vue'
	export default {
		components: { 
			tabbar,
		},
		data() {
			return {
				title: 'Hello',
				
				list:[	// 商家导航
					{
						path: "sellerHome",	// 主页
						iconPath: "home",
						selectedIconPath: "home-fill",
						text: '首页',
						isDot: false,
						customIcon: false,
					},
					{
						path: "sellerOrder",	// 订单
						iconPath: "file-text",
						selectedIconPath: "file-text-fill",
						text: '订单',
						customIcon: false,
					},
					{
						path: "sellerPay",	// 收银
						iconPath: "rmb-circle",
						selectedIconPath: "rmb-circle-fill",
						text: '收银',
						midButton: true,
						customIcon: false,
					},
					{
						path: "sellerReport",	// 报表
						iconPath: "edit-pen",
						selectedIconPath: "edit-pen-fill",
						text: '报表',
						customIcon: false,
					},
					{
						path: "sellerMy",	// 我的
						iconPath: "account",
						selectedIconPath: "account-fill",
						text: '我的',
						count: 23,
						isDot: false,
						customIcon: false,
					},
				],
			}
		},
		onLoad() {

		},
		methods: {
			navChange(row){
				console.log(row)
			},
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin: 200rpx auto 50rpx auto;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
