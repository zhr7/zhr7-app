<template>
	<view class="item">
        <view class="top">
		</view>
		<view class="u-m-t-20">
			<u-cell-group>
				<!-- #ifdef MP-WEIXIN -->
				<u-cell-item icon="volume-up-fill" title="小程序收款通知" :arrow="false">
					<u-switch v-model="showBind" @change="changeWechatMessage"></u-switch>
				</u-cell-item>
				<!-- #endif -->
			</u-cell-group>
		</view>
	</view>
</template>
<script>
	import { mapGetters } from 'vuex'
    const login = require('@/utils/login').default
	export default {
		components: { 
		},
		computed: {
            ...mapGetters([
				'openid',
				'appid',
                'name',
				'userId',
			])
		},
		data() {
			return {
                nickName: "",
                showBind: false,
                item: [],
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'微信通知'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
		},
		onLoad(options) {
		},
		mounted() {
            this.init()
		},
		onPullDownRefresh() {
		},
		methods: {
            init() {
                this.getDevices()
            },
			changeWechatMessage() {
				if (this.showBind) {
					this.$u.api.v3.wechat.GetByAppid({
						appid: this.appid
					}).then(res=>{
						if (res.item) {
							if (res.item.configs) {
								// res.item.configs string转json
								const configs = JSON.parse(res.item.configs)
								wx.requestSubscribeMessage({
									tmplIds: [configs.MiniprogramVoiceTemplateId],
									success: (res) => {
										if (res[configs.MiniprogramVoiceTemplateId] == 'accept') {
											this.$u.api.v3.message.Build({
												userId: this.userId,
												userName: this.name,
												drive: 'wechat',
												types: ["MINIPROGRAM_WECHAT"],
												address: this.openid,
												eventType: ["ORDER"],
												config: '',
											}).then(res=>{
												if (res.valid) {
													this.getDevices()
													uni.showToast({
														duration: 5000,
														icon:'success',
														title:'收款通知开启',
													})
												}else{
													this.showBind = false
												}
											}).catch(err => {
												this.showBind = false
												uni.showToast({
													duration: 5000,
													icon:'error',
													title:'获取微信通知绑定失败',
												})
											})
										}else{
											this.showBind = false
											uni.showToast({
												duration: 5000,
												icon:'error',
												title:'收款通知开启失败',
											})
										}
									},
									fail(err) {
										console.log(err);
										this.showBind = false
										uni.showToast({
											duration: 5000,
											icon:'error',
											title:'收款通知开启失败',
										})
									}
								})
							}
						}
					}).catch(err => {
						console.log(err)
						this.showBind = false
						uni.showToast({
							duration: 5000,
							icon:'error',
							title: err.Error(),
						})
					})
				}else{
					this.unbind()
				}
			},
            getDevices() {
                const where = "WHERE drive='wechat' And types='[\"MINIPROGRAM_WECHAT\"]' And user_id='"+this.userId+"'"
                this.$u.api.v3.message.Search({
					page: 1,
					pageSize: 20,
					where: where,
					sort: 'ORDER BY created_at DESC, id DESC'
                }).then(res=>{
					if (res.total > 0){
						this.item = res.items[0]
						this.showBind = true
					}
                }).catch(err => {
                    console.log(err)
					uni.showToast({
                        duration: 5000,
                        icon:'error',
                        title:'获取微信通知绑定失败',
                    })
				})
            },
            unbind() {
                this.$u.api.v3.message.Unbuild({
					id: this.item.id,
				}).then(res=>{
                    if (res.valid) {
						this.showBind = false
                        uni.showToast({
                            duration: 5000,
                            icon:'success',
                            title:'解绑微信成功',
                        })
                        this.getDevices()
                    }else{
                        uni.showToast({
                            duration: 5000,
                            icon:'none',
                            title:'解绑微信失败',
                        })
                    }
				}).catch(err => {
                    console.log(err)
					uni.showToast({
                        duration: 5000,
                        icon:'error',
                        title:'解绑微信失败',
                    })
				})
            }
		},
        // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
        onReady() {
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
.content{
	.item {
		height: 50px;
		width: 100%;
		background-color: #fff;
		margin-bottom: 5px;
		display: flex;
		padding: 0 2vw 0 1vw ;
		.left {
			padding: 5px;
			text-align: center;
			min-width: 60px;
			color: #909399;
			font-size: 10px;
			span{
				display: flex;
				flex-direction: column;
			}
		}
		.center{
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding: 10px;
            font-size: 18px;
		}
		.right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding: 7px;
			flex: 1;
			text-align: right;
			min-width: 80px;
		}
	}
}
	.k-bottom{
		@include vue-flex;
		position: relative;
		position: fixed;
		bottom: 0px;
		// #ifdef MP-ALIPAY
		bottom: 30px;
		// #endif
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