<template>
	<view>
		<view class="item">
            <view class="line">{{routes.sellerName}}</view>
            <u-form :model="formData" ref="dataForm" label-width="120">
                <u-form-item label="新密码" prop="password">
                    <u-input v-model="formData.password" type="password" password-icon/>
                </u-form-item>
                <u-form-item label="确认密码" prop="confirmPassword">
                    <u-input v-model="formData.confirmPassword" type="password" password-icon/>
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
	export default {
		data() {
            var validatePass = (rule, value, callback) => {
                const hasUpperCase = /[A-Z]/.test(value);
                const hasLowerCase = /[a-z]/.test(value);
                const hasNumbers = /\d/.test(value);
                const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
                if (value === undefined) {
                    callback()
                } else {
                    if (!/^.{8,16}$/.test(value)) {
                        callback('密码长度请控制在 8 到 16 个字符')
                    }
                    if (!hasUpperCase) {
                        callback('密码必须包含大写字母')
                    }
                    if (!hasLowerCase) {
                        callback('密码必须包含小写字母')
                    }
                    if (!hasNumbers) {
                        callback('密码必须包含数字')
                    }
                    if (!hasSpecialChar) {
                        callback('密码必须包含特殊字符')
                    }
                    if (this.formData.password !== value) {
                        callback('两次密码不一样')
                    }
                    callback()
                }
            }
			return {
                routes: {
                    sellerId: '',
                    sellerName: '',
                },
                formData: {
                    password: '',
                    confirmPassword: '',
                },
                rules: {
                    password: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            const hasUpperCase = /[A-Z]/.test(value);
                            const hasLowerCase = /[a-z]/.test(value);
                            const hasNumbers = /\d/.test(value);
                            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
                            if (value === undefined) {
                                callback()
                            } else {
                                if (!/^.{8,16}$/.test(value)) {
                                    callback('密码长度请控制在 8 到 16 个字符')
                                }
                                if (!hasUpperCase) {
                                    callback('密码必须包含大写字母')
                                }
                                if (!hasLowerCase) {
                                    callback('密码必须包含小写字母')
                                }
                                if (!hasNumbers) {
                                    callback('密码必须包含数字')
                                }
                                if (!hasSpecialChar) {
                                    callback('密码必须包含特殊字符')
                                }
                                if (this.formData.password !== value) {
                                    callback('两次密码不一样')
                                }
                                callback()
                            }
                        },
                        trigger: 'blur'
                    }
                    ],
                    confirmPassword: [
                    {
                        required: true,
                        validator: validatePass,
                        trigger: 'blur'
                    }
                    ]
                }
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'修改密码'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
			
		},
		onLoad(options) {
            this.routes = options
		},
		mounted() {
            
		},
		methods: {
            submitForm(dataForm) {
                this.$refs.dataForm.validate((valid) => {
                    console.log(valid)
                    if (valid) {
                        this.$u.api.v3.seller.seller.Password({
                            id: this.routes.sellerId,
                            password: this.formData.password
                        }).then(res => {
                            if (res.valid) {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'success',
                                    title:'密码修改成功',
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
                                    title:'密码修改失败',
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
