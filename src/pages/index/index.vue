<template>
	<view>
		<seller ref="seller" v-if="roles.indexOf('BrandMerchant')>=0||roles.indexOf('Merchant')>=0"/>
		<!-- <institution v-if="roles.indexOf('HeadOffice')>=0||roles.indexOf('Institution2')>=0||roles.indexOf('Institution3')>=0||roles.indexOf('Institution4')>=0||roles.indexOf('Institution5')>=0"/> -->
		<u-back-top :scroll-top="scrollTop"></u-back-top>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	import { mapGetters } from 'vuex'
	import { baseAppUrl } from '@/settings.js'
	import seller from '@/pages/seller/index.vue'
	// import institution from '@/subPackages/institution/index.vue'
	export default {
		components: { 
			seller,
			// institution,
		},
		computed: {
			...mapGetters([
				'roles',
			]),
		},
		data() {
			return {
				scrollTop: 0,
			}
		},
		onLoad(options) {
			this.systemUpdate()
			this.login()
			this.$store.dispatch('user/getOpenid')
		},
		mounted() {
			if (this.$refs.seller) {
				this.$refs.seller.showInit()
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			systemUpdate(){
				// #ifdef APP-PLUS
				plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
					this.$store.dispatch('settings/changeSetting', { key: 'versionCode', value: widgetInfo.versionCode })
					this.$store.dispatch('settings/changeSetting', { key: 'version', value: widgetInfo.version })
					uni.request({
						url: baseAppUrl+'manifest.json',
						success: (result) => {
							// 增则替换字符串中文
							let { versionCode, versionName } = JSON.parse(result.data.replace(/\/\*{1,2}[\s\S]*?\*\//g,""))
							// 判断版本名是否一致
							if (versionName === widgetInfo.version) {
								// 如果安装的版本号小于最新发布的版本号，则进行更新
								if (parseInt(widgetInfo.versionCode) != parseInt(versionCode)) {
									// 下载wgt更新包
									let downloadPath = baseAppUrl+plus.runtime.appid+".wgt"
									uni.downloadFile({
										url: downloadPath,
										success: (downloadResult) => {
											if (downloadResult.statusCode === 200) {
												plus.runtime.install(downloadResult.tempFilePath, {
													force: true // 强制更新
												}, () => {
													console.log('热更新成功');
													plus.runtime.restart();
												}, (e) => {
													console.error('热更新失败，错误原因：' + e);
												});
											}
										},
										fail: (error) => {
											console.log("uni.downloadFile",error)
										}
									})
								} else {
									console.log('你的版本为最新，不需要热更新');
								}
							} else {
								console.log('版本名不一致，请使用整包更新');
							}
						},
						fail: (error) => {
							 console.log("systemUpdate"+ JSON.stringify(error));
						}
					});
				});
				//  #endif
			},
			login() {
				if (!uni.getStorageSync('token')) {
					this.$u.route({
						type: 'redirect',
						url: '/pages/login/index', 
					});
				}else{
					this.userInfo()
				}
			},
			userInfo(){
				this.$store.dispatch('user/getInfo').then(()=>{
					if (this.roles.indexOf('HeadOffice')>=0||this.roles.indexOf('Institution2')>=0||this.roles.indexOf('Institution3')>=0||this.roles.indexOf('Institution4')>=0||this.roles.indexOf('Institution5')>=0) {
						this.$u.route({
							type: 'redirect',
							url: '/subPackages/institution/index', 
						})
						
					}


					// #ifdef APP-PLUS || MP-ALIPAY
					this.$store.dispatch('tts/init')
					this.$store.dispatch('socket/closeSocket') // 关闭wss
					uni.getSystemInfo({ 
						success: (res) => {
							this.deviceId = res.deviceId
							this.$store.dispatch('socket/webSocket',this.deviceId)
						}
					})
					//  #endif
				}).catch(err => {
					this.$refs.uToast.show({
						title: err.datal
					})
					this.$u.route({
						type: 'redirect',
						url: '/pages/login/index', 
					})
				})
			}
		},
	}
</script>

<style>
</style>
