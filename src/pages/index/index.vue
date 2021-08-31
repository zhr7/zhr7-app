<template>
	<view>
		<seller v-if="role==='seller'"/>
		<institution v-if="role==='institution'"/>
	</view>
</template>
<script>

	import seller from '@/pages/seller/index.vue'
	import institution from '@/pages/institution/index.vue'
	export default {
		components: { 
			seller,
			institution,
		},
		data() {
			return {
				role: "seller", // 当前使用角色
			}
		},
		onLoad() {

		},
		methods: {
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
