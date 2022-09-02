<template>
	<view class="item">
        <view class="top">
		</view>
		<view class="content">
            <view class="item" v-for="(item, index) in list" :key="index">
				<view class="left">
					<span>
						<m-icon name="weixinzhifu" custom-prefix="colour-icon" size="38">></m-icon>
					</span>
				</view>
				<view class="center">
					{{item.deviceKey}}
				</view>
				<view class="right">
					<view class="status">
						<u-button type="error" size="medium" @click="unbind(item)">解绑</u-button>
					</view>
				</view>
			</view>
            
		</view>
        <u-button v-show="showBind" type="success" open-type="getUserInfo" @getuserinfo="bindWechat">绑定微信</u-button>
		<u-toast ref="uToast" />
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
			])
		},
		data() {
			return {
                nickName: "",
                listQuery: {
					page: 1,
					limit: 20,
					where: '',
					sort: 'created_at desc'
				},
                showBind: false,
                list: []
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
			console.log(this.openid);
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
            getDevices() {
                this.listQuery.where = "drive='miniprogramWechat'"
                this.$u.api.message.device.List({
                    list_query: this.listQuery
                }).then(res=>{
                    this.list = []
                    if (res.devices) {
                        this.list = res.devices
                        this.list.forEach(element => {
                            if (element.deviceId == this.openid) {
                                this.showBind = false
                            }
                        });
                    }else{
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
            bindWechat(res) {
                this.nickName = res.detail.userInfo.nickName
                this.$u.api.message.device.Create({
					device: {
                        userName: this.name,
                        drive: 'miniprogramWechat',
                        deviceId: this.openid,
                        deviceKey: this.nickName
					}
				}).then(res=>{
                    if (res.valid) {
                        uni.showToast({
                            duration: 5000,
                            icon:'success',
                            title:'绑定微信成功',
                        })
                        this.getDevices()
                    }else{
                        uni.showToast({
                            duration: 5000,
                            icon:'none',
                            title:'绑定微信失败',
                        })
                    }
				}).catch(err => {
                    console.log(err)
					uni.showToast({
                        duration: 5000,
                        icon:'error',
                        title:'绑定微信失败',
                    })
				})
            },
            unbind(item) {
                this.$u.api.message.device.Delete({
					device: {
                        id: item.id,
					}
				}).then(res=>{
                    if (res.valid) {
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
            font-size: 20px;
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