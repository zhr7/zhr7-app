<template>
	<view>
		<home v-if="path==='home'"/>
		<order ref="order" v-if="path==='order'"/>
		<pay v-if="path==='pay'"/>
		<report v-if="path==='report'"/>
		<my v-if="path==='my'"/>
		<tabbar
			:list="list"
			:default="path"
			@change="navChange"
		/>
	</view>
</template>
<script>
	import { mapState } from 'vuex'
	import tabbar from '@/components/tabbar'
	import home from './home'
	import order from './order'
	import report from './report'
	import pay from './pay'
	import My from './my'
	export default {
		components: { 
			tabbar,
			home,
			order,
			report,
			pay,
			My,
		},
		computed: {
			...mapState({
				facePayCont: state => state.seller.facePayCont
			}),
		},
		data() {
			return {
				tabbarClick: false, // tabbar导航点击动态
				path: "home",
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
						text: '收银',
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
						isDot: false,
						customIcon: false,
					},
				],
				facePay: ''
			}
		},
		mounted() {
			// #ifdef MP-ALIPAY
			if (typeof my.ix !== "undefined") {
				this.facePay = 'alipay'
				if (this.facePayCont===0) {
					this.startFacePay()
				}
			}
			// #endif
		},
		methods: {
			navChange(nav){
				this.path = nav.path
				if (this.facePay!==''&&this.path==='pay') {
					this.startFacePay()
				}
				if (nav.path==="order" && this.$refs.order) {
					this.$refs.order.init()
				}
			},
			showInit() {
				if (this.path==="order" && this.$refs.order) {
					this.$refs.order.init()
				}
			},
			startFacePay() {
				this.$store.dispatch('seller/addFacePayCont')
				this.$u.route({
					type: 'redirectTo',
					url: '/subPackages/facepay/'+this.facePay+'/index'
				})
			}
		}
	}
</script>

<style>
</style>
