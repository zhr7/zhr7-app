<template>
	<view>
		<view class="item">
            <u-form :model="formData" ref="dataForm" label-width="260">
                <u-form-item label="通道ID" v-if="formData.id" prop="id">
                    {{formData.id}}
                </u-form-item>
				<u-form-item label="通道名称" prop="name">
                    <u-input v-model="formData.name"/>
                </u-form-item>
                <u-form-item label="微信公众号AppId" prop="appId">
                    <u-input v-model="formData.wechat.appId"/>
                </u-form-item>
				<u-form-item label="微信公众号Secret" prop="secret">
                    <u-input v-model="formData.wechat.secret"/>
                </u-form-item>
				<u-form-item label="支付宝AppId" prop="appId">
                    <u-input v-model="formData.alipay.appId"/>
                </u-form-item>
				<u-form-item label="支付宝公钥" prop="alipayPublicKey">
                    <u-input v-model="formData.alipay.alipayPublicKey"/>
                </u-form-item>
				<u-form-item label="支付宝客户端私钥" prop="privateKey">
                    <u-input v-model="formData.alipay.privateKey"/>
                </u-form-item>
				<u-form-item label="支付宝签名方式" prop="signType">
					<u-radio-group v-model="formData.alipay.signType">
						<u-radio key="RSA2" name="RSA2">RSA2</u-radio>
						<u-radio key="RSA" name="RSA">RSA</u-radio>
					</u-radio-group>
                </u-form-item>
            </u-form>
            <u-line />
            <view class="bottom">	
                <u-button 
					v-if="formData.id"
					class="b-button"
                    type="warning" 
                    @click="submitForm('dataForm')"
                >
                    修改授权通道
                </u-button>
				<u-button 
					v-if="formData.id"
					class="b-button"
                    type="error" 
                    @click="modalShow=true"
                >
                    删除授权通道
                </u-button>
				<u-button 
					v-if="!formData.id"
					class="a-button"
                    type="primary" 
                    @click="submitFormAdd('dataForm')"
                >
                    新增授权通道
                </u-button>
				
		    </view>	
			<u-modal v-model="modalShow" :content="modalContent" :show-cancel-button="true" @confirm="submitDelete('dataForm')"></u-modal>
		</view>	
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
				actionSheetShow: false,
				formData: {
					id: '',
					alipay: {
						appId: '',
						alipayPublicKey: '',
						privateKey: '',
						signType: 'RSA2',
					},
					wechat: {
						appId: '',
						secret: '',
					},
					name: '',
					userId: '',
					userName: '',
					value: '',
				},
				isPrintTemplate: false
			}
		},
		 watch: {
		},
		created() {
			uni.setNavigationBarTitle({
				title:'授权通道'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
		},
		mounted() {
             this.init() 
		},
		methods: {
			init() {	//  初始化加载查询
				const routeParams = JSON.parse(JSON.stringify(RouteParams()))
				if (routeParams.id) {
					const value = JSON.parse(routeParams.value)
					this.formDataValue(value,'alipay')
					this.formDataValue(value,'wechat')
					this.formDataValue(routeParams,'id')
					this.formDataValue(routeParams,'name')
					this.formDataValue(routeParams,'userId')
					this.formDataValue(routeParams,'userName')
					this.formDataValue(routeParams,'value')
				}
			},
			formDataValue(routeParams,name) {
				if (routeParams[name] == undefined) {
					switch (name) {
						default:
                    		this.formData[name] = ''
							break;
					}
                }else{
					this.formData[name] = routeParams[name]
				}
				return 
			},
			submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$u.api.pay.oauth.Update({
                            oauth: this.formData
                        }).then(res => {
                            if (res.valid) {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'success',
                                    title:'更新授权通道成功',
                                })
                                setTimeout(()=>{ 
                                    this.$u.route({
                                        type: 'back', 
                                    })
                                }, 3000);
                            } else {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'error',
                                    title:'更新授权通道失败',
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
                })
            },
			submitFormAdd(formName) {
				delete this.formData.id
				delete this.formData.userId
				delete this.formData.userName
				delete this.formData.value
				this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$u.api.pay.oauth.Create({
                            oauth: this.formData
                        }).then(res => {
                            if (res.valid) {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'success',
                                    title:'新增授权通道成功',
                                })
                                setTimeout(()=>{ 
                                    this.$u.route({
                                        type: 'back', 
                                    })
                                }, 3000);
                            } else {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'error',
                                    title:'新增授权通道失败',
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
                })
			},
			submitDelete(formName) {
				this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$u.api.pay.oauth.Delete({
                            oauth: this.formData
                        }).then(res => {
                            if (res.valid) {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'success',
                                    title:'删除授权通道成功',
                                })
                                setTimeout(()=>{ 
                                    this.$u.route({
                                        type: 'back', 
                                    })
                                }, 3000);
                            } else {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'error',
                                    title:'删除授权通道失败',
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
                })
			},
			hideKeyboard() {
				uni.hideKeyboard()
			}
		},
	}
</script>

<style lang="scss" scoped>
.item {
	background-color: #fff;
	height: 100%;
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
	.totalFee {
		font-size: 20px;
		color: #ff0000;
		text-align: right;
	}
	.refundFee {
		color: #ff0000;
	}
}
.bottom {
	margin-top: 3vh;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding-bottom: 10vh;
	.b-button{
		width: 40vw;
	}
	.a-button{
		width: 90vw;
	}
}
.icon{
	font-size: 38px;
}
.primary{
	color: #409EFF;
}
.info{
	color: #909399;
	text-align: center;
}
.error{
	color: #F56C6C;
}
.success{
	color: #67C23A;
}
.warning{
	color: #E6A23C;
}
</style>

