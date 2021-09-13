<template>
	<view>
		<seller ref="seller" v-if="roles.indexOf('seller')===0"/>
		<institution v-if="roles.indexOf('institution')===0"/>
	</view>
</template>
<script>
	import {  mapGetters } from 'vuex'
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
				show: false
			}
		},
		onLoad() {
			this.login()
		},
		onShow() {
			if (this.$refs.seller) {
				this.$refs.seller.showInit()
			}
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
				this.$store.dispatch('user/getInfo').catch(err => {
					uni.removeStorageSync('token'); // 删除token 重新获取
				})
			}
		},
	}
</script>

<style>
</style>
