<template>
	<view>
        <view v-if="userId">
		<view class="item">
            <u-form :model="formData" ref="dataForm" label-width="150">
                <u-form-item label="机构账号" prop="username">
                    <u-input v-model="formData.username" placeholder="请输入机构名称"/>
                </u-form-item>
                <u-form-item label="机构密码" prop="password">
                    <u-input v-model="formData.password" placeholder="请输入机构密码" type="password" password-icon/>
                </u-form-item>
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
    <view v-if="!userId">
        <u-form-item> 页面开发中，敬请期待</u-form-item>
    </view>
    </view>
</template>
<script>
	import { RouteParams } from '@/utils'
    import {  mapState, mapGetters } from 'vuex'
	import pickRegions from '@/subPackages/institution/components/pick-regions/pick-regions.vue'

	export default {
        components: { 
			pickRegions
		},
		data() {
			return {
                options: {},
                formData: {
                    username: '',
                    password: '',
                    name: '',
                    rebate: '0',
                    mobile: '',
                    addressCode: '0',
                    address: ''
                },
                institutionName: '',
                brandName: '',
                providerName: '',
                rules: {
                    username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            // 去后端验证是否存在
                           this.$u.api.user.user.Exist({
                               user:{ 
                                   username: value 
                                }
                            }).then(res => {
                                if (res.valid) {
                                    callback('用户名已存在')
                                }else{
                                    callback()
                                }
                            })
                        }, trigger: 'blur'
                    }
                    ],
                    password: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                        if (value === undefined) {
                            callback()
                        } else {
                            if (!/^.{6,16}$/.test(value)) {
                            callback('密码长度请控制在 6 到 16 个字符')
                            }
                            callback()
                        }
                        },
                        trigger: 'blur'
                    }
                    ],
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
				title:'添加机构'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
			
		},
		mounted() { 
            this.options = RouteParams()
		},
		methods: {
            // 获取选择的地区
            handleGetRegion(region){
                this.formData.addressCode = region[2].code
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$u.api.institution.institution.Create({
                            user: {
                                username: this.formData.username,
                                password: this.formData.password
                            },
                            institution: {
                                name: this.formData.name,
                                username: this.formData.username,
                                rebate: this.formData.rebate,
                                mobile: this.formData.mobile,
                                addressCode: this.formData.addressCode,
                                address: this.formData.address
                            }
                        }).then(res => {
                            if (res.valid) {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'success',
                                    title:'添加机构成功',
                                })
                                setTimeout(()=>{ 
                                    console.log(this.options);
                                    if (this.options.item === "1") {
                                        this.$u.route({
                                            type: 'back', 
                                        })
                                    }else{
                                        this.$u.route({
                                            type: 'to',
                                            url: '/pages/institution/institution/index'
                                        })
                                    }
                                }, 3000);
                            } else {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'error',
                                    title:'添加机构失败',
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
        },
        computed: {
            ...mapGetters(['name','userId','avatar','roles']),
            ...mapState({payQrcodeUrl: state => state.settings.payQrcodeUrl}),
        },
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
