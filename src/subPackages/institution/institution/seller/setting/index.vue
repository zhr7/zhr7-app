<template>
	<view>
		<view class="item">
            <u-form :model="formData" ref="dataForm" label-width="150">
                <!-- <u-form-item label="商家ID" prop="id">
                    {{ formData.id }}
                </u-form-item> -->
                <u-form-item label="所属机构" prop="institutionId">
                    {{ institutionName }}
                </u-form-item>
                <u-form-item label="所属品牌" prop="brandId">
                    {{ brandName }}
                </u-form-item>
                <u-form-item label="软件服务商" prop="providerId">
                    {{ providerName }}
                </u-form-item>
                <u-form-item label="商家名称" prop="name">
                    <u-input v-model="formData.name" placeholder="请输入商家名称"/>
                </u-form-item>
                <u-form-item label="联系手机" prop="mobile">
                    <u-input v-model="formData.mobile" placeholder="请输入联系手机"/>
                </u-form-item>
                <u-form-item label="地址" prop="addressCode">
                    <pick-regions :defaultRegion="formData.addressCode" @getRegion="handleGetRegion"/>
                </u-form-item>
                <u-form-item label="详细地址" prop="address">
                    <u-input v-model="formData.address" placeholder="请输入详细地址"/>
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
                formData: {
                    id: '',
                    institutionId: '',
                    brandId: '',
                    providerId: '',
                    username: '',
                    password: '',
                    name: '',
                    mobile: '',
                    addressCode: '0',
                    address: '',
                },
                institutionName: '',
                brandName: '',
                providerName: '',
                rules: {
                    name: [
                        { required: true, message: '请输入机构名称', trigger: 'blur' },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    mobile: [{
                        required: true,
                        validator: (rule, value, callback) => {
                            if (value === undefined) {
                            callback('请输入手机号码')
                            } else {
                            if (!/^1[23456789]\d{9}$/.test(value)) {
                                callback('请输入正确的手机号码')
                            } else {
                                callback()
                            }
                            }
                        },
                        trigger: 'blur' }
                    ]
                }
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'商户编辑'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
			
		},
		onShow() {
            this.formData = JSON.parse(JSON.stringify(RouteParams()))
            this.init()    
		},
		methods: {
            // 获取选择的地区
            handleGetRegion(region){
                this.formData.addressCode = region[2].code
            },
            init() {
                this.$u.api.institution.seller.Get({
                    'seller': {
                        id: this.formData.id
                    }
                }).then(res => {
                    if (res.seller) {
                        this.formData = res.seller
                        if (this.formData.institutionId == 'undefined') {
                            this.formData.institutionId = ''
                        }
                        if (this.formData.brandId == 'undefined') {
                            this.formData.brandId = ''
                        }
                        if (this.formData.providerId == 'undefined') {
                            this.formData.providerId = ''
                        }
                        if (this.formData.username == 'undefined') {
                            this.formData.username = ''
                        }
                        if (this.formData.password == 'undefined') {
                            this.formData.password = ''
                        }
                        if (this.formData.name == 'undefined') {
                            this.formData.name = ''
                        }
                        if (this.formData.mobile == 'undefined') {
                            this.formData.mobile = ''
                        }
                        if (this.formData.addressCode == 'undefined') {
                            this.formData.addressCode = "110101"
                        }
                        if (this.formData.address == 'undefined') {
                            this.formData.address = ''
                        }
                        delete this.formData.updatedAt
                        delete this.formData.createdAt
                        if (this.formData.institutionId) {
                            this.initInstitution()
                        }
                        if (this.formData.brandId) {
                            this.initBrand()
                        }
                        if (this.formData.providerId) {
                            this.initProvider()
                        }
                    } else {
                        uni.showToast({
                            duration: 3000,
                            icon:'error',
                            title:'获取商家信息',
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
            initInstitution() {
                this.$u.api.institution.institution.SimpleInfo({
                    'institution': {
                        id: this.formData.institutionId
                    }
                }).then(res => {
                    if (res.institution) {
                        this.institutionName = res.institution.name
                    } else {
                        uni.showToast({
                            duration: 3000,
                            icon:'error',
                            title:'获取品机构信息失败',
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
            initBrand() {
                this.$u.api.institution.seller.SimpleInfo({
                    'seller': {
                        id: this.formData.brandId
                    }
                }).then(res => {
                    if (res.seller) {
                        this.brandName = res.seller.name
                    } else {
                        uni.showToast({
                            duration: 3000,
                            icon:'error',
                            title:'获取品牌商家信息失败',
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
            initProvider() {
                this.$u.api.institution.provider.SimpleInfo({
                    'provider': {
                        id: this.formData.providerId
                    }
                }).then(res => {
                    if (res.provider) {
                        this.providerName = res.provider.name
                    } else {
                        uni.showToast({
                            duration: 3000,
                            icon:'error',
                            title:'获取软件服务商信息失败',
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
                        this.$u.api.institution.seller.Update({
                            'seller': this.formData
                        }).then(res => {
                            if (res.valid) {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'success',
                                    title:'更新商家成功',
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
                                    title:'商家修改失败',
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
