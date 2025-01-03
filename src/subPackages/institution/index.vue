<template>
	<view class="content">
		<home v-if="path==='home'" @handlerPath="handlerPath"/>
		<institution v-if="path==='institution'"/>
		<seller v-if="path==='sellerBrand'"/>
		<apply v-if="path==='apply'"/>
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
	import institution from './list.vue'
	import seller from './seller/index.vue'
	import apply from './apply'
	import pay from './pay'
	import my from './my'
	export default {
		components: { 
			tabbar,
			home,
			institution,
			seller,
			apply,
			pay,
			my,
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
						path: "apply",	// 报表
						iconPath: "plus-circle",
						selectedIconPath: "plus-circle-fill",
						text: '进件',
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
		mounted() {
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
							url: '/subPackages/institution/seller/create/index?item=0'
						})
						break;
					case "institutionCreate":
						this.$u.route({
							type: 'to',
							url: '/subPackages/institution/institution/create/index?item=0'
						})
						break;
					case "institutionReport":
						this.$u.route({
							type: 'to',
							url: '/subPackages/institution/institution/report/index'
						})
						break;
					case "createPaymentApplication":
					this.$u.route({
						type: 'to',
						url: '/subPackages/institution/apply/paymentApplication/index'
					})
					break;
					case "sellerBrand":
						this.path = "sellerBrand"
						break;
					case "seller":
						this.$u.route({
							type: 'to',
							url: '/subPackages/institution/seller/index?seller=true'
						})
						break;
					case "institutionSecretKey":
						this.$u.route({
							type: 'to',
							url: '/subPackages/institution/institution/secretKey/index'
						})
						break;
					case "institution-secret-key":
						break;
					case "institutionPay":
						this.$refs.uToast.show({
							title: "努力开发中"
						});
						break;
					case "institutionOauth":
						this.$u.route({
							type: 'to',
							url: '/subPackages/institution/oauth/index'
						})
						break;
					case "activatePaymentCode":
						uni.scanCode({
							scanType: ['qrCode'],
							onlyFromCamera: false,
							success: (res) => {
								let operatorId = res.result.split("=")[1];
								if(res.result){
									this.$u.route({
										type: 'to',
										url: '/subPackages/institution/activateCode/index?operatorId=' + operatorId
									})
								}
							}
						})
						break;
					case "apply":
						this.$u.route({
							type: 'to',
							url: '/subPackages/institution/apply/list'
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
