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
				title: 'home2',
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title: '首页'
			})
			uni.setNavigationBarColor({
				frontColor: '#ffffff',  
                backgroundColor: '#7d33ff',  
			})
		},
		methods: {
			
		}
	}
</script>
<style lang="scss" scoped>
</style>
