<template>
	<view class="item">
		<view class="line">
			<span class="info">
				<u-icon name="institution" custom-prefix="colour-icon" class="icon"></u-icon><br>
				{{item.level}}级机构
			</span>
			<view>
				<view class="right name">{{item.name}}</view>
				<view class="right info">{{item.username}}</view>
				<view class="right info">{{item.mobile}}</view>
			</view>
		</view>
		<u-line />
		<view class="line">
			<u-grid
                :border="false"
                col="3"
			>
				<u-grid-item>
					<u-icon
						name="institution" 
						custom-prefix="colour-icon" 
						:size="100"
						@click="handler('institution')"
					></u-icon>
					<text class="grid-text">下级机构</text>
				</u-grid-item>
				<u-grid-item>
					<u-icon
						name="seller"
						custom-prefix="colour-icon" 
						:size="100"
						@click="handler('seller')"
					></u-icon>
					<text class="grid-text">下级商户</text>
				</u-grid-item>
				<u-grid-item>
					<u-icon
						name="provider"
						custom-prefix="colour-icon" 
						:size="100"
						@click="handler('provider')"
					></u-icon>
					<text class="grid-text">软件服务商</text>
				</u-grid-item>
				<u-grid-item>
					<u-icon
						name="seller-report"
						custom-prefix="colour-icon" 
						:size="100"
						@click="handler('report')"
					></u-icon>
					<text class="grid-text">日结报表</text>
				</u-grid-item>
				<u-grid-item>
					<u-icon
						name="pay"
						custom-prefix="colour-icon" 
						:size="100"
						@click="handler('pay')"
					></u-icon>
					<text class="grid-text">支付通道</text>
				</u-grid-item>
				<u-grid-item>
					<u-icon
						name="oauth"
						custom-prefix="colour-icon" 
						:size="100"
						@click="handler('oauth')"
					></u-icon>
					<text class="grid-text">机构</text>
				</u-grid-item>
				<u-grid-item>
					<u-icon
						name="secret-key"
						custom-prefix="colour-icon" 
						:size="100"
						@click="handler('secret-key')"
					></u-icon>
					<text class="grid-text">密钥仓库</text>
				</u-grid-item>
				<u-grid-item>
					<u-icon
						name="secretKey"
						custom-prefix="colour-icon" 
						:size="100"
						@click="handler('secretKey')"
					></u-icon>
					<text class="grid-text">密钥管理</text>
				</u-grid-item>
				<u-grid-item>
					<u-icon
						name="password"
						custom-prefix="colour-icon" 
						:size="100"
						@click="handler('password')"
					></u-icon>
					<text class="grid-text">密码重置</text>
				</u-grid-item>
				<u-grid-item>
					<u-icon
						name="setting"
						custom-prefix="colour-icon" 
						:size="100"
						@click="handler('setting')"
					></u-icon>
					<text class="grid-text">机构配置</text>
				</u-grid-item>
				<u-grid-item>
					<u-icon
						name="delete"
						custom-prefix="colour-icon" 
						:size="100"
						@click="handler('delete')"
					></u-icon>
					<text class="grid-text">删除机构</text>
				</u-grid-item>
			</u-grid>
		</view>	
		<u-modal v-model="modalShow" :content="modalContent" :show-cancel-button="true" @confirm="submitDelete()"></u-modal>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	import { RouteParams } from '@/utils'
	export default {
		computed: {
		},
		data() {
			return {
				modalShow: false,
				modalContent: '此操作将永久删除授权通道, 是否继续?',
				item: {},
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'商家详情'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
		},
		mounted() {
			this.item = RouteParams()
		},
		methods: {
			handler(e){
				switch (e) {
					case "institution":
						this.$u.route({
							type: 'to',
							url: '/pages/institution/institution/index',
							params: this.item
						})
						break;
					case "seller":
						this.$u.route({
							type: 'to',
							url: '/pages/institution/seller/index?institutionId='+this.item.id,
						})
						break;
					case "report":
						this.$u.route({
							type: 'to',
							url: '/pages/institution/report/index',
							params: this.item
						})
						break;
					case "password":
						this.$u.route({
							type: 'to',
							url: '/pages/institution/institution/password/index',
							params: this.item
						})
						break;
					case "setting":
						this.$u.route({
							type: 'to',
							url: '/pages/institution/institution/setting/index',
							params: this.item
						})
						break;
					case "secretKey":
						this.$u.route({
							type: 'to',
							url: '/pages/institution/institution/secretKey/index',
							params: this.item
						})
						break;
					case "delete":
						this.modalShow = true
						break;
					default:
						this.$refs.uToast.show({
							title: "努力开发中"
						})
						break;
				}
			},
			submitDelete() {
				this.$u.api.institution.institution.Delete({
                    institution: {
						id: this.item.id
					}
                }).then(res => {
                    if (res.valid) {
                        uni.showToast({
                            duration: 3000,
                            icon:'success',
                            title:'删除机构成功',
                        })
						this.$store.dispatch('institution/changeInitCache') // 通知机构首页更新
                        setTimeout(()=>{ 
                            this.$u.route({
                                type: 'back', 
                            })
                        }, 3000);
                    } else {
                        uni.showToast({
                            duration: 3000,
                            icon:'error',
                            title:'删除机构失败',
                        })
                    }
                }).catch(err => {
                    console.log(err);
                    uni.showToast({
                        duration: 3000,
                        icon:'error',
                        title: err.data.detail,
                    })
                })
			}
		},
	}
</script>

<style lang="scss" scoped>
.item {
	background-color: #fff;
	height: 100vh;
	padding: 5vw;
	.line {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 5px;
		padding-top: 10px;
		padding-bottom: 10px;
	}
	.info {
		color: #909399;
		font-size: 10px;
	}
	.right {
		text-align: right;
	}
	.name {
		font-size: 20px;
		color: #ff0000;
	}
}
.icon{
	font-size: 38px;
}
.info{
	color: #909399;
	text-align: center;
}
.grid-text {
    font-size: 14px;
    color: #909399;
    padding: 10rpx 0 20rpx 0rpx;
    /* #ifndef APP-PLUS */
    box-sizing: border-box;
    /* #endif */
}
</style>

