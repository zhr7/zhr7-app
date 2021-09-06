<template>
	<view class="con">
		<view class="top">
			<span class="totalFee">
				收款金额
			</span>
			<span class="input-label">{{totalFee}}</span>
		</view>
		<u-keyboard 
			ref="uKeyboard" 
			mode="number" 
			class="bottom safe-area-inset-bottom"
			v-model="show"
			:dot-enabled="true" 
			:tooltip="false"
			confirmText="收款"
			@change="onChange"
			@confirm="onConfirm"
			@backspace="onBackspace"
		>
		</u-keyboard>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	import uKeyboard from '@/components/uview-ui/components/u-keyboard/u-keyboard.vue'
	export default {
		components: { 
			uKeyboard
		},
		data() {
			return {
				show: true,
				focus: false,
				totalFee: ""
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'收银'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
		},
		mounted() {
		},
		methods: {
			onChange(val){
				uni.vibrateShort() // 震动
				if (Number(this.totalFee + val)<1000000) {
					if (this.totalFee === "0" && val != ".") {
						return
					}
					this.totalFee += val;
					this.totalFee = this.totalFee.match(/^\d+(?:\.\d{0,2})?/)[0]
				} else {
					this.totalFee = "1000000"
					this.$refs.uToast.show({
						title: "最大金额不能大于1000000"
					})
				}
			},
			onBackspace(){
				uni.vibrateShort()
				if(this.totalFee.length>0){
					this.totalFee = this.totalFee.substring(0,this.totalFee.length-1);
				}
			},
			onConfirm(){
				uni.vibrateShort()
				console.log('onConfirm')
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "uview-ui/libs/css/style.components.scss";
	.top {
		background-color: #fff;
		padding: 5vw;
		font-size: 8vw;
	}
	.bottom{
		@include vue-flex;
		position: relative;
		position: fixed;
		bottom: 50px;
		left: 0;
	}
</style>
<style scoped>
	.input-label {
		float: right;
	}
	.input-label::before {
		float: right;
		content: " ";
		background-color: #909399;
		letter-spacing: 0.88px;
		margin-left: 2px;
		margin-top: 3px;
		width: 1px;
		height: 9vw;
		animation: cursor-blinks 1.5s infinite steps(1, start);
	}

	@keyframes cursor-blinks {
		0% {
			opacity: 1;
			display: block;
		}
		50% {
			opacity: 0;
			display: none;
		}
		100% {
			opacity: 1;
			display: block;
		}
	}

</style>