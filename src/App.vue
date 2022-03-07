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
	.uni-calendar__content{
		z-index: 999!important;
	}
	.border-top-style{
		border-color:#f4f4f5;
		border-width:1px;
		border-top-style:solid;
	}
	.border-bottom-style{
		border-color:#f4f4f5;
		border-width:1px;
		border-bottom-style:solid;
	}
	.border-right-style{
		border-color:#f4f4f5;
		border-width:1px;
		border-right-style:solid;
	}
	.border-left-style{
		border-color:#f4f4f5;
		border-width:1px;
		border-left-style:solid;
	}
</style>