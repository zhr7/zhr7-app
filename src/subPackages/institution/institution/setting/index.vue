<template>
	<view>
		<view class="item">
            <u-form :model="formData" ref="dataForm" label-width="150">
                <u-form-item label="机构名称" prop="name">
                    <u-input v-model="formData.name" placeholder="请输入机构名称"/>
                </u-form-item>
                <u-form-item label="佣金比例" prop="rebate">
                    <template slot="right">%</template>
                    <u-input v-model="formData.rebate" placeholder="请输入佣金比例百分比"/>
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
	import pickRegions from '@/subPackages/institution/components/pick-regions/pick-regions.vue'

	export default {
        components: { 
			pickRegions
		},
		data() {
			return {
                formData: {
                    id: '',
                    rebate: '',
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
					rebate: [
                        { required: true, message: '请输分成比例', trigger: 'blur' },
                        {
                            required: true,
                            validator: (rule, value, callback) => {
                            if (value > 100) {
                                callback('分成比例不允许大于100%')
                            } else {
                                this.$u.api.institution.institution.SelfInfo().then(res => {
                                if (Number(res.institution.rebate) < Number(value)) {
                                    callback('分成比例不允许大于:' + res.institution.rebate + '%')
                                } else {
                                    callback()
                                }
                                }).catch(err => {
                                    callback(err.message)
                                })
                            }
                            },
                            trigger: 'blur'
                        }
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
		mounted() {
            this.formData = JSON.parse(JSON.stringify(RouteParams()))
            this.init()    
		},
		methods: {
            // 获取选择的地区
            handleGetRegion(region){
                this.formData.addressCode = region[2].code
            },
            init() {
                this.$u.api.institution.institution.Get({
                    'institution': {
                        id: this.formData.id
                    }
                }).then(res => {
                    if (res.institution) {
                        this.formData = res.institution
                        if (this.formData.name == 'undefined') {
                            this.formData.name = ''
                        }
                        if (this.formData.rebate == 'undefined') {
                            this.formData.rebate = ''
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
                    } else {
                        uni.showToast({
                            duration: 3000,
                            icon:'error',
                            title:'获取机构信息',
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
                        this.$u.api.institution.institution.Update({
                            'institution': this.formData
                        }).then(res => {
                            if (res.valid) {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'success',
                                    title:'更新机构成功',
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
                                    title:'机构修改失败',
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
