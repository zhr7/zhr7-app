<template>
	<view>
		<view class="item">
            <view class="line">{{options.name}}</view>
            <u-form :model="formData" ref="dataForm" label-width="150">
                <u-form-item label="AppId" prop="appId">
                    <u-input v-model="formData.appId" disabled/>
                    <u-button 
                        slot="right"
                        type="info" 
                        size="mini"
                        @click="clipboardData(formData.appId)"
                        >复制AppId
                    </u-button>
                </u-form-item>
                <u-form-item label="平台公钥" prop="publicKey">
                    <u-input v-model="formData.publicKey" disabled :maxlength="-1"/>
                    <u-button 
                        slot="right"
                        type="info" 
                        size="mini"
                        @click="clipboardData(formData.publicKey)"
                        >复制公钥
                    </u-button>
                </u-form-item>
                <u-form-item label="客户端公钥" prop="clientPublicKey">
                    <u-input v-model="formData.clientPublicKey" :maxlength="-1"/>
                    <u-button 
                        slot="right"
                        type="info" 
                        size="mini"
                        @click="clipboardData(formData.clientPublicKey)"
                        >复制客户端公钥
                    </u-button>
                </u-form-item>
            </u-form>
            <u-line />
            <view class="bottom">	
                <u-button 
                    type="warning" 
                    @click="submitForm('dataForm')"
                >
                    确认修改
                </u-button>
		    </view>	
        </view>	
        <u-toast ref="uToast" />
	</view>
</template>
<script>
    import { RouteParams } from '@/utils'
    export default {
		data() {
			return {
                options: {
                    id: '',
                    name: '',
                },
                formData: {
                    appId: '',
                    clientPublicKey: '',
                    publicKey: '',
                    signType: '',
                    userId: ''
                },
                rules: {
                }
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'密钥管理'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
		},
		mounted() {
            this.options = JSON.parse(JSON.stringify(RouteParams()))
            this.init()
		},
		methods: {
            init() {
                this.$u.api.user.secretKey.SelfGet().then(res => {
                    if (res.secretKey) {
                        this.formData = res.secretKey
                        if (this.formData.appId == 'undefined') {
                            this.formData.appId = ''
                        }
                        if (this.formData.clientPublicKey == 'undefined') {
                            this.formData.clientPublicKey = ''
                        }
                        if (this.formData.publicKey == 'undefined') {
                            this.formData.publicKey = ''
                        }
                        if (this.formData.signType == 'undefined') {
                            this.formData.signType = ''
                        }
                        if (this.formData.userId == 'undefined') {
                            this.formData.userId = "110101"
                        }
                        delete this.formData.updatedAt
                        delete this.formData.createdAt
                    } else {
                        uni.showToast({
                            duration: 3000,
                            icon:'error',
                            title:'获取密钥信息失败',
                        })
                    }
                }).catch(err => {
                    console.log(err);
                    uni.showToast({
                        duration: 3000,
                        icon:'error',
                        title: err.datal,
                    })
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$u.api.user.secretKey.SelfUpdate({
                            secretKey: this.formData
                        }).then(res => {
                            if (res.valid) {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'success',
                                    title:'密钥更新成功',
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
                                    title:'密钥更新失败',
                                })
                            }
                        }).catch(err => {
                            console.log(err);
                            uni.showToast({
                                duration: 3000,
                                icon:'error',
                                title: err.datal,
                            })
                        })
                    }
                })
            },
            clipboardData(data) {
                uni.setClipboardData({
                    data: data,
                    success() {
                        uni.showToast({
                            duration: 3000,
                            icon:'success',
                            title:'复制成功',
                        })
                    }
                })
            }
		},
         // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
        onReady() {
            this.$refs.dataForm.setRules(this.rules);
        }
	}
</script>

<style lang="scss" scoped>
.item {
	background-color: #fff;
	height: 100%;
	padding: 5vw;
}
.line {
	font-size: 4vw;
    font-weight: 900;
	padding: 5px;
    color: #dd6161;
}
.bottom {
	margin-top: 3vh;
}
</style>
