<template>
	<view>
		<view class="item">
            <u-form :model="formData" ref="dataForm" label-width="120">
                <u-form-item label="营业执照" prop="password">
                    <uni-file-picker 
                        v-model="imageValue" 
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="select" 
                    />
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
    import { OCR } from '@/utils'
	export default {
		data() {
			return {
                imageValue:[],
                formData: {
                    password: '',
                    confirmPassword: '',
                },
                rules: {
                }
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'商户进件'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
			
		},
		mounted() {
            
		},
		methods: {
            // 获取上传状态
			select(e){
                // const path = 'apply/'+e.tempFiles[0].cloudPath
                const filePath =  e.tempFilePaths[0]
                OCR(filePath,'idcard')
                // .then(res=>{
                //     console.log(res);
                // }).catch(err => {
                //     console.error('invokeService fail', err)
                //     uni.showToast({
                //         duration: 3000,
                //         icon:'error',
                //         title:'识别失败',
                //     })
                // })
                // uni.uploadFile({
                //     url: 'https://up.qiniup.com', //仅为示例，非真实的接口地址
                //     filePath: filePath,
                //     name: 'file',
                //     formData: {
                //         'token': '1krBcOFrYoSgt9ylIJj8aPycll1q9FpMgy6UIzhn:vjWwSpxWze1prVNOb4ElyiySfKw=:eyJzY29wZSI6ImJpZ3JvY3MiLCJkZWFkbGluZSI6MTY0NjIwODA3NH0=',
                //         'key': path
                //     },
                //     success: (uploadFileRes) => {
                //         if (uploadFileRes.statusCode===200) {
                //             uni.showToast({
                //                 duration: 3000,
                //                 icon:'success',
                //                 title:'上传成功',
                //             })
                //         }else{
                //             uni.showToast({
                //                 duration: 3000,
                //                 icon:'error',
                //                 title:'上传失败',
                //             })
                //         }
                //     }
                // })
                // const observable = qiniu.upload(
                //     e.tempFilePaths[0], 
                //     "", 
                //     "1krBcOFrYoSgt9ylIJj8aPycll1q9FpMgy6UIzhn:m5BowYmTjNk-g0Nm2yrxL0kT5hA=:eyJzY29wZSI6ImJpZ3JvY3MiLCJkZWFkbGluZSI6MTY0NjE5NDM1OX0=", 
                //     {}, 
                //     {}
                // )
                // const observer = {
                //     next(res){
                //         console.log(1,res);
                //     },
                //     error(err){
                //         console.log(2,err);
                //     },
                //     complete(res){
                //         console.log(3,res);
                //     }
                // }
                // const subscription = observable.subscribe(observer) // 上传开始
                // console.log(subscription);
			},
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$u.api.institution.seller.Password({
                            user: {
                                id: this.routes.sellerId,
                                password: this.formData.password
                            }
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
                                title: err.data.detail,
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
