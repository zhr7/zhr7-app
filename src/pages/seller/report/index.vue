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
				title: 'Report',
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'日结报表'
			})
		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
</style>
