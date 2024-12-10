<template>
	<view>
        <view v-if="userId">
		<view class="item">
            <u-form :model="formData" ref="dataForm" label-width="150">
                <u-form-item prop="brandId">
                    <uni-combox label="品牌商家" :candidates="queryBrands" placeholder="请选择品牌" v-model="formData.brandId" @input="inputCombox"></uni-combox>
                </u-form-item>
                <u-form-item label="商家账号" prop="username">
                    <u-input v-model="formData.username" placeholder="请输入商家名称"/>
                </u-form-item>
                <u-form-item label="商家密码" prop="password">
                    <u-input v-model="formData.password" placeholder="请输入商家密码" type="password" password-icon/>
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
    <view v-if="!userId">
        <u-form-item> 页面开发中，敬请期待</u-form-item>
    </view>
    </view>
</template>
<script>
	import { RouteParams } from '@/utils'
    import uniCombox from '@/components/uni-combox/uni-combox.vue'
    import {  mapState, mapGetters } from 'vuex'
	import pickRegions from '@/subPackages/institution/components/pick-regions/pick-regions.vue'

	export default {
        components: { 
			pickRegions,
            uniCombox
		},
		data() {
			return {
                options: {},
                formData: {
                    username: '',
                    password: '',
                    brandId: '',
                    name: '',
                    rebate: '0',
                    mobile: '',
                    addressCode: '0',
                    address: ''
                },
                queryBrands: [
                    {
                        name:'默认品牌商家',
                        lable:''
                    }
                ],
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
                        { required: true, message: '请输入商家名称', trigger: 'blur' },
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
				title:'添加商家'
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
            inputCombox(v) {
                if (v) {
                    this.$u.api.institution.seller.SimpleList({
                        list_query:{
                            page: 1,
                            pageSize: 100,
                            where: 'id=brand_id And name LIKE \'%' + v + '%\''
                        }
                    }).then(res => {
                        if (res.sellers) {
                            this.queryBrands = res.sellers
                        }
                    })
                }
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$u.api.institution.seller.Create({
                            user: {
                                username: this.formData.username,
                                password: this.formData.password
                            },
                            seller: {
                                brandId: this.formData.brandId,
                                name: this.formData.name,
                                username: this.formData.username,
                                mobile: this.formData.mobile,
                                addressCode: this.formData.addressCode,
                                address: this.formData.address
                            }
                        }).then(res => {
                            if (res.valid) {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'success',
                                    title:'添加商家成功',
                                })
                                setTimeout(()=>{ 
                                    if (this.options.item === "1") {
                                        this.$u.route({
                                            type: 'back', 
                                        })
                                    }else{
                                        this.$u.route({
                                            type: 'to',
                                            url: '/pages/institution/seller/index'
                                        })

                                    }
                                }, 3000);
                            } else {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'error',
                                    title:'添加商家失败',
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
