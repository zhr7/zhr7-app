<template>
	<view>
		<seller v-if="roles.indexOf('seller')===0"/>
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
			}
		},
		onLoad() {
			this.login()
		},
		methods: {
			login() {
				if (!uni.getStorageSync('token')) {
					this.$u.route({
						type: 'reLaunch',
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
