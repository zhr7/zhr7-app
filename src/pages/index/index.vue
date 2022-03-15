<template>
	<view>
		<seller ref="seller" v-if="roles.indexOf('seller')===0"/>
		<institution v-if="roles.indexOf('institution')===0"/>
		<u-back-top :scroll-top="scrollTop"></u-back-top>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	import { mapGetters } from 'vuex'
	import seller from '@/pages/seller/index.vue'
	import institution from '@/pages/institution/index.vue'
	export default {
		components: { 
			seller,
			institution,
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
			this.login()
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
					this.$store.dispatch('socket/webSocket') // 链接websocket
				}).catch(err => {
					this.$refs.uToast.show({
						title: err.data.detail
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
