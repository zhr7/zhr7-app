<template>
	<view class="content">
		<home v-if="path==='home'"/>
		<order v-if="path==='order'"/>
		<report v-if="path==='report'"/>
		<pay v-if="path==='pay'"/>
		<my v-if="path==='my'"/>
		<tabbar
			:list="list"
			@change="navChange"
		/>
	</view>
</template>
<script>
	import tabbar from '@/components/tabbar'
	import home from './home'
	import order from './order'
	import report from './report'
	import pay from './pay'
	import my from './my'
	export default {
		components: { 
			tabbar,
			home,
			order,
			report,
			pay,
			my,
		},
		data() {
			return {
				path: "",
				list:[	// 商家导航
					{
						path: "home",	// 主页
						iconPath: "home",
						selectedIconPath: "home-fill",
						text: '首页',
						isDot: false,
						customIcon: false,
					},
					{
						path: "order",	// 订单
						iconPath: "file-text",
						selectedIconPath: "file-text-fill",
						text: '订单',
						customIcon: false,
					},
					{
						path: "pay",	// 收银
						iconPath: "rmb-circle",
						selectedIconPath: "rmb-circle-fill",
						text: '商家',
						midButton: true,
						customIcon: false,
					},
					{
						path: "report",	// 报表
						iconPath: "edit-pen",
						selectedIconPath: "edit-pen-fill",
						text: '报表',
						customIcon: false,
					},
					{
						path: "my",	// 我的
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
			navChange(nav){
				this.path = nav.path
			},
		}
	}
</script>

<style>
</style>
