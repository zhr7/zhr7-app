<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view>
			<text class="title">{{title}}</text>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				title: 'Order',
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'订单详情'
			})
		},
		methods: {
		}
	}
</script>

<style>
</style>
