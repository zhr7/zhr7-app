<template>
	<view>
        <view v-if="userId">
		<view class="item">
            <u-steps :list="numList" :current="1" mode="number"></u-steps>
            <u-form :model="formData" ref="dataForm" label-width="250">
                <u-form-item label="法人姓名" prop="legalPerson">
                    <u-input v-model="formData.legalPerson" placeholder="请输入法人姓名"/>
                </u-form-item>
                <u-form-item label="法人电话" prop="legalPersonPhone">
                    <u-input v-model="formData.legalPersonPhone" placeholder="请输入法人电话"/>
                </u-form-item>
                <u-form-item label="法人身份证人像面照片" prop="legalPersonCardPic">
                    <!-- <u-image width="100%" height="300rpx" :src="imgUrl.legalPersonCardPic" v-if="reUploadPersonCardPic"></u-image> -->
                    <uni-file-picker v-model="valueFront"
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="selectIdCardCopy" 
                    />
                </u-form-item>
                <u-form-item label="法人身份证国徽面照片" prop="legalPersonCardNationalPic">
                    <!-- <u-image width="100%" height="300rpx" :src="imgUrl.legalPersonCardNationalPic" v-if="reUploadPersonCardNationalPic"></u-image> -->
                    <uni-file-picker v-model="valueBack"
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="selectIdCardNational" 
                    />
                </u-form-item>
                <u-form-item label="法人身份证号" prop="legalPersonCardNo">
                    <u-input v-model="formData.legalPersonCardNo" placeholder="请输入法人身份证号"/>
                </u-form-item>
                <u-form-item label="法人身份证地址" prop="legalPersonCardCardAddress">
                    <u-input v-model="formData.legalPersonCardCardAddress" placeholder="请输入法人身份证地址"/>
                </u-form-item>
                <u-form-item label="法人身份证有效期开始" prop="legalPersonCardPeriodBegin">
                    <u-input v-model="formData.legalPersonCardPeriodBegin" placeholder="请输入法人身份证有效期"/>
                </u-form-item>
                <u-form-item label="法人身份证有效期结束" prop="legalPersonCardPeriodEnd">
                    <u-input v-model="formData.legalPersonCardPeriodEnd" placeholder="请输入法人身份证有效期"/>
                </u-form-item>
            </u-form>
            <u-line />
            <view class="bottom">	
                <u-button 
                    type="warning" 
                    @click="nextPage('dataForm')"
                >
                    下一步
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
    // https://pay.weixin.qq.com/wiki/doc/apiv3_partner/apis/chapter11_1_1.shtml
    import { parseTime, OCR } from '@/utils'
    import { RouteParams } from '@/utils'
    import {  mapState, mapGetters } from 'vuex'
	export default {
		data() {
			return {
                valueFront: [],
                valueBack: [],
                reUploadPersonCardPic: true,
                reUploadPersonCardNationalPic: true,
                imgUrl: {},
                numList: [{
					name: '主体信息'
				}, {
					name: '法人信息'
				}, {
					name: '结算信息'
				}, {
					name: '门店信息'
				}, {
                    name: '通道信息'
                },],
                item: {},
                channels: [],
                storageToken:'',
                formData: {
                    // 法人资料
                    legalPerson: '', // 法人姓名
                    legalPersonPhone: '', // 法人电话
                    // 身份证
                    legalPersonCardPic: '',    // 身份证人像面照片
                    legalPersonCardNationalPic: '',    // 身份证国徽面照片
                    legalPersonCardNo: '',    // 法人身份证号
                    legalPersonCardCardAddress: '',    // 法人身份证地址
                    legalPersonCardPeriodBegin: '',  // 身份证有效期开始
                    legalPersonCardPeriodEnd: '',  // 身份证有效期结束
                },
                rules: {
                    legalPerson: [
                        {
                            required: true,
                            message: '请输入法人姓名',
                            trigger: ['blur', 'change']
                        },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    legalPersonPhone: [
                        {
                            required: true,
                            message: '请输入法人电话',
                            trigger: ['blur', 'change']
                        },
                        {
                            required: true,
                            validator: (rule, value, callback) => {
                                if (value === undefined) {
                                callback('请输入法人电话')
                                } else {
                                if (!/^1[23456789]\d{9}$/.test(value)) {
                                    callback('请输入正确的手机号码')
                                } else {
                                    callback()
                                }
                                }
                            },
                            trigger: 'blur' 
                        }
                    ],
                    legalPersonCardPic: [
                        {
                            required: true,
                            message: '请上传法人身份证人像面照片',
                            trigger: ['blur', 'change']
                        }
                    ],
                    legalPersonCardNationalPic: [
                        {
                            required: true,
                            message: '请上传法人身份证国徽面照片',
                            trigger: ['blur', 'change']
                        }
                    ],
                    legalPersonCardNo: [
                        {
                            required: true,
                            message: '请输入法人身份证号',
                            trigger: ['blur', 'change']
                        },
                        {
                            required: true,
                            validator: (rule, value, callback) => {
                                if (value === undefined) {
                                    callback('请输入法人身份证号')
                                } else {
                                if (!/^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)) {
                                    callback('请输入正确的身份证号')
                                } else {
                                    callback()
                                }
                                }
                            },
                            trigger: 'blur' 
                        }
                    ],
                    legalPersonCardCardAddress: [
                        {
                            required: true,
                            message: '请输入法人身份证地址',
                            trigger: ['blur', 'change']
                        },
                        { min: 2, max: 64, message: '长度在 2 到 256 个字符', trigger: 'blur' }
                    ],
                    legalPersonCardPeriodBegin: [
                        {
                            required: true,
                            message: '请输入法人身份证有效期开始',
                            trigger: ['blur', 'change']
                        }
                    ],
                    legalPersonCardPeriodEnd: [
                        {
                            required: true,
                            message: '请输入法人身份证有效期结束',
                            trigger: ['blur', 'change']
                        }
                    ]
                }
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'商户进件编辑'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
			
		},
		mounted() {
            this.initStorageToken()
		},
        onShow() {
		},
		onLoad() {
            this.item = RouteParams();
            this.formData = this.item
            this.getUploadImage(this.formData.legalPersonCardPic, 'legalPersonCardPic')
            this.getUploadImage(this.formData.legalPersonCardNationalPic, 'legalPersonCardNationalPic')
		},
		onHide() {
            // this.initFormData()
		},
		onUnload() {
            // this.initFormData()
		},
		onPullDownRefresh() {
            // this.initFormData()
		},
		methods: {
            initFormData() {
                this.formData = {
                    // 法人资料
                    legalPerson: '', // 法人姓名
                    legalPersonPhone: '', // 法人电话
                    // 身份证
                    legalPersonCardPic: '',    // 身份证人像面照片
                    legalPersonCardNationalPic: '',    // 身份证国徽面照片
                    legalPersonCardNo: '',    // 法人身份证号
                    legalPersonCardCardAddress: '',    // 法人身份证地址
                    legalPersonCardPeriodBegin: '20010-01-01',  // 身份证有效期开始
                    legalPersonCardPeriodEnd: '2030-01-01',  // 身份证有效期结束
                }
            },
            initStorageToken() {
                this.$u.api.v3.storage.file.GetUploadToken().then(res => {
                    // if (res.token.type == 'qiniu') {
                    //     this.storageToken = res.token.token
                    // }
                    this.storageToken = res.token
                }).catch(err => {
                    console.log(err);
                    uni.showToast({
                        duration: 10000,
                        icon:'error',
                        title: "获取上传凭证失败:"+ err.datal,
                    })
                })
            },
            async getUploadImage(path,name) {
                try {
                    const res = await this.$u.api.v3.storage.file.GetUploadImage({
                        provider: 'qiniu',
                        key: path,
                    });
                    this.imgUrl[name] = res.url
                    let value1 = []
                    value1.push(res)
                    if(name == 'legalPersonCardPic'){
                        this.valueFront = value1
                    }else if(name == 'legalPersonCardNationalPic'){
                        this.valueBack = value1
                    }
                } catch (err) {
                    console.log(err);
                    uni.showToast({
                        duration: 10000,
                        icon: 'error',
                        title: err.data,
                    });
                }
            },
            // 获取选择的地区
            handleGetRegion(region){
                this.formData.bankAddressCode = region[2].code
            },
            selectIdCardCopy(e){
                // console.log(e);
                if (e.tempFiles[0].size > 1024 * 1024) {
                    uni.showToast({
                        duration: 10000,
                        icon:'error',
                        title:'图片大小超过1M',
                    })
                    return;
                }
                const path = 'apply/'+this.formData.businessCode+"/"+e.tempFiles[0].cloudPath
                const filePath =  e.tempFilePaths[0]
                uni.uploadFile({
                    url: 'https://upload.qiniup.com/', 
                    filePath: filePath,
                    name: 'file',
                    formData: {
                        'token': this.storageToken,
                        'key': path
                    },
                    success: (uploadFileRes) => {
                        if (uploadFileRes.statusCode===200) {
                            this.formData.legalPersonCardPic = path
                           //获取图片地址并识别图片信息
                           this.$u.api.v3.storage.file.GetUploadImage({
                                provider: 'qiniu',
                                key: path
                            }).then(res => {
                                this.imgUrl.legalPersonCardPic = res.url
                                this.reUploadPersonCardPic = false
                                this.$u.api.v3.storage.file.IDCardOCR({
                                    imageBase64: '',
                                    imageUrl: res.url,
                                    cardSide: 'FRONT',
                                }).then(res => {
                                    this.formData.legalPerson = res.name
                                    this.formData.legalPersonCardNo = res.idNum
                                    this.formData.legalPersonCardCardAddress = res.address
                                }).catch(err => {
                                    uni.showToast({
                                        duration: 10000,
                                        icon:'error',
                                        title: "身份证识别失败:"+err,
                                    })
                                })
                            }).catch(err => {
                                uni.showToast({
                                    duration: 10000,
                                    icon:'error',
                                    title: "身份证识别失败:"+err,
                                })
                            })
                            uni.showToast({
                                duration: 10000,
                                icon:'success',
                                title:'上传成功'
                            })
                        }else{
                            uni.showToast({
                                duration: 10000,
                                icon:'error',
                                title:'上传失败'
                            })
                        }
                    },
                    fail: (err) => {
                    console.log(err.errMsg);
                    uni.showToast({
                        duration: 10000,
                        icon:'error',
                        title:'上传失败'+err.errMsg,
                    })
                }
                })
			},
            selectIdCardNational(e) {
                // console.log(e);
                if (e.tempFiles[0].size > 1024 * 1024) {
                    uni.showToast({
                        duration: 10000,
                        icon:'error',
                        title:'图片大小超过1M',
                    })
                    return;
                }
                const path = 'apply/'+this.formData.businessCode+"/"+e.tempFiles[0].cloudPath
                const filePath =  e.tempFilePaths[0]
                uni.uploadFile({
                    url: 'https://upload.qiniup.com/', 
                    filePath: filePath,
                    name: 'file',
                    formData: {
                        'token': this.storageToken,
                        'key': path
                    },
                    success: (uploadFileRes) => {
                        if (uploadFileRes.statusCode===200) {
                            this.formData.legalPersonCardNationalPic = path
                           //获取图片地址并识别图片信息
                           this.$u.api.v3.storage.file.GetUploadImage({
                                provider: 'qiniu',
                                key: path
                            }).then(res => {
                                this.imgUrl.legalPersonCardNationalPic = res.url
                                this.reUploadPersonCardNationalPic = false
                                this.$u.api.v3.storage.file.IDCardOCR({
                                    imageBase64: '',
                                    imageUrl: res.url,
                                    cardSide: 'BACK',
                                }).then(res => {
                                    console.log('res')
                                    console.log(res)
                                    let idCardDate = res.validDate.split('-');
                                    // console.log(idCardDate);
                                    this.formData.legalPersonCardPeriodBegin = idCardDate[0].replaceAll('.', '');
                                    this.formData.legalPersonCardPeriodEnd = idCardDate[1].replaceAll('.', '');

                                }).catch(err => {
                                    uni.showToast({
                                        duration: 10000,
                                        icon:'error',
                                        title: "身份证识别失败:"+err,
                                    })
                                })
                            }).catch(err => {
                                uni.showToast({
                                    duration: 10000,
                                    icon:'error',
                                    title: "身份证识别失败:"+err,
                                })
                            })
                            uni.showToast({
                                duration: 10000,
                                icon:'success',
                                title:'上传成功'
                            })
                        }else{
                            uni.showToast({
                                duration: 10000,
                                icon:'error',
                                title:'上传失败'
                            })
                        }
                    },
                    fail: (err) => {
                    console.log(err.errMsg);
                    uni.showToast({
                        duration: 10000,
                        icon:'error',
                        title:'上传失败'+err.errMsg
                    })
                }
                })
            },
            nextPage(formName) {
                // console.log(this.formData);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$u.route({
                            type: 'to',
                            url: 'subPackages/institution/apply/update/update3',
                            params: this.formData
                        })
                    }
                })
               
            },
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