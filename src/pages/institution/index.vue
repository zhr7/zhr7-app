<template>
	<view class="content">
		<home v-if="path==='home'" @handlerPath="handlerPath"/>
		<institution v-if="path==='institution'"/>
		<seller v-if="path==='sellerBrand'"/>
		<report v-if="path==='institutionReport'"/>
		<pay v-if="path==='pay'"/>
		<my v-if="path==='my'" @handlerPath="handlerPath"/>
		<tabbar
			ref="tabbar"
			:list="list"
			:default="path"
			@change="navChange"
		/>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	import tabbar from '@/components/tabbar'
	import home from './home'
	import institution from './institution'
	import seller from './seller'
	import report from './report'
	import pay from './pay'
	import my from './my'
	export default {
		components: { 
			tabbar,
			home,
			institution,
			seller,
			report,
			pay,
			my,
		},
		props: {
		},
		data() {
			return {
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
						path: "institution",	// 机构
						iconPath: "moments",
						selectedIconPath: "moments-circel-fill",
						text: '机构',
						customIcon: false,
					},
					{
						path: "institutionReport",	// 报表
						iconPath: "more-circle",
						selectedIconPath: "more-circle-fill",
						text: '报表',
						midButton: true,
						customIcon: false,
					},
					{
						path: "sellerBrand",	// 商家
						iconPath: "grid",
						selectedIconPath: "grid-fill",
						text: '商家',
						customIcon: false,
					},
					{
						path: "my",	// 我的
						iconPath: "account",
						selectedIconPath: "account-fill",
						text: '我的',
						// count: 23,
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
			handlerPath(e){
				switch (e) {
					case "sellerCreate":
						this.$u.route({
							type: 'to',
							url: '/pages/institution/seller/create/index?item=0'
						})
						break;
					case "institutionCreate":
						this.$u.route({
							type: 'to',
							url: '/pages/institution/institution/create/index?item=0'
						})
						break;
					case "sellerReport":
						break;
					case "sellerBrand":
						this.path = "sellerBrand"
						break;
					case "seller":
						this.$u.route({
							type: 'to',
							url: '/pages/institution/seller/index?seller=true'
						})
						break;
					case "institutionSecretKey":
						this.$u.route({
							type: 'to',
							url: '/pages/institution/secretKey/index'
						})
						break;
					case "institution-secret-key":
						break;
					case "institutionPay":
						break;
					case "institutionOauth":
						this.$u.route({
							type: 'to',
							url: '/pages/institution/oauth/index'
						})
						break;
					default:
						this.path = e
						break;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
