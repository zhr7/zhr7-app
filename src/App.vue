<script>
	export default {
		onLaunch () {
			console.log('App Launch')
		},
		onShow () {
			console.log('App Show')
		},
		onHide () {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
	@import "./static/colour-iconfont.css"; // 自定义彩色图标
	body {
		background-color: #f4f4f5;
	}
</style>