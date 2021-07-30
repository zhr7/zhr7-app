<template>
	<view class="content">
		<view class="pay">
			<u-form :model="form" ref="uForm" label-width="190">
				<u-form-item>
					<span class="top">
						<u-icon name="home"></u-icon> 
					</span>
					<span class="top-name">
						{{storeName}}
					</span>
				</u-form-item>
				<u-form-item label="消费金额:" prop="name">
					<span class="totalFee">
						￥
					</span>
					<span class="input-label totalFee">{{form.totalFee}}</span>
				</u-form-item>
				<u-form-item>
				</u-form-item>
			</u-form>
			<u-button @click="submit" type="warning" :disabled="disabled">确认付款</u-button>
		</view>
		<u-keyboard 
			ref="uKeyboard" 
			mode="number" 
			v-model="keyboard"
			:mask="false"
			:tooltip="false"
			:mask-close-able="false"
			:safe-area-inset-bottom="true"
			:dot-enabled="true" 
			@change="onChange"
			@backspace="onBackspace"
		></u-keyboard>
		<u-toast ref="uToast" position="top"/>
		<u-modal v-model="show" title="错误提示" :content="err"></u-modal>
	</view>
</template>

<script>
	import wx from 'weixin-js-sdk'
    import { parseTime }  from '@/utils'
	export default {
		data() {
			return {
				channel: "",
				storeName: "",
				disabled: false,
				form: {
					totalFee: ""
				},
				keyboard: true,
				show: false,
				err: ""
			}
		},
		onLoad() {

		},
		mounted() {
			this.simpleInfo()
			this.hideOptionMenu() // 因此分享

		},
		methods: {
			check(e) {
				//重新赋值给input
				this.$nextTick(() => {
					this.form.totalFee = (e.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				})
			},
			simpleInfo(){
				this.disabled = true
				this.$u.api.SimpleInfo({ config: {
					id: this.$route.query.store_id
				}}).then(res =>{
					if (res.config) {
						this.disabled = false
						this.channel = res.config.channel
						this.storeName = res.config.storeName
					}
				}).catch(err => {
					this.show = true
					this.err =  "获取商户信息失败：" + err.data.detail
				})
			},
			submit() {
				if (Math.round(this.form.totalFee*100)<=0) {
					this.show = true
					this.err =  "请输入下单金额"
					return
				}
				this.disabled = true
				this.$u.api.QRCode({
					storeId: this.$route.query.store_id,
					bizContent: {
						channel: this.channel,
						title: "二维码支付B2C",
						outTradeNo: parseTime(new Date,'{y}{m}{d}{h}{i}{s}{n}') + Math.round(Math.random()*1000),
						totalFee: String(Math.round(this.form.totalFee*100))
					}
				}).then(res=>{
					this.disabled = false
					if (res.content.qrcode) {
						window.location.href = res.content.qrcode
					}else{
						this.show = true
						this.err =  "请联系管理员,下单成功未找到跳转链接！"
					}
				}).catch(err => {
					this.show = true
					this.err =  "下单失败：" + err.data.detail
				})
			},
			hideOptionMenu(){
				wx.hideOptionMenu()
			},
			onChange(val){
				if (Number(this.form.totalFee + val)<100000) {
					this.form.totalFee += val;
					this.form.totalFee = this.form.totalFee.match(/^\d+(?:\.\d{0,2})?/)[0]
				}else{
					this.$refs.uToast.show({
						duration: 5000,
						title: "不允许大于10万元",
						type: 'warning'
					});
				}
			},
			onBackspace(e){
				if(this.form.totalFee.length>0){
					this.form.totalFee = this.form.totalFee.substring(0,this.form.totalFee.length-1);
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 5vw;
	}

	.pay{
		width: 95vw;
		height: 110vw;
		border-radius: 5px;
		border: 1px solid #c8c9cc;
		box-shadow: 5px 5px 2px #c8c9cc;
		padding: 5vw;
		background-color: #fff;
	}
	.top{
		font-size: 6vw;
		color:#2b85e4;
	}
	.top-name{
		padding-left: 3vw;
		font-size: 5vw;
		font-weight: 900;
	}
	.totalFee {
		font-size: 8vw;
	}
	/deep/ .uni-input-input{
		font-size: 8vw;
	}
</style>
<style scoped>
	.input-label::before {
		float: right;
		content: " ";
		background-color: #ff9900;
		letter-spacing: 0.88px;
		width: 2px;
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