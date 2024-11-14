<template>
	<view>
		<view class="item">
            <u-form :model="formData" ref="dataForm" label-width="260">
                <u-form-item label="申请编号" prop="businessCode">
                    <u-input v-model="formData.businessCode" placeholder="请输入业务申请编号"/>
                </u-form-item>
                <u-form-item label="主体类型" prop="licenseSubjectType">
					<u-radio-group v-model="formData.licenseSubjectType">
                        <u-radio key="personal" name="personal">小微商户</u-radio>
						<u-radio key="enterprise" name="enterprise">企业</u-radio>
                        <u-radio key="government" name="government">政府机关</u-radio>
						<u-radio key="institutions" name="institutions">事业单位</u-radio>
                        <u-radio key="others" name="others">其他 社会组织</u-radio>
					</u-radio-group>
                </u-form-item>
                <u-form-item label="手持身份证照片" prop="legalPersonCardHandPic" v-if="formData.licenseSubjectType === 'personal'">
                    <uni-file-picker 
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="selectHandPic" 
                    />
                </u-form-item>
                <div v-if="formData.licenseSubjectType === 'enterprise'">
                    <u-form-item label="营业执照照片" prop="licensePic">
                    <uni-file-picker 
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="selectLicenseCopy" 
                    />
                </u-form-item>
                <u-form-item label="营业执照商户名称" prop="licenseMerchantName">
                    <u-input v-model="formData.licenseMerchantName" placeholder="请输入商户名称"/>
                </u-form-item>
                <u-form-item label="营业执照代码" prop="licenseCode">
                    <u-input v-model="formData.licenseCode" placeholder="请输入营业执照代码"/>
                </u-form-item>
                <u-form-item label="营业执照地址" prop="licenseAddress">
                    <u-input v-model="formData.licenseAddress" placeholder="请输入地址"/>
                </u-form-item>
                <u-form-item label="营业执照有效期开始" prop="licensePersonCardPeriodBegin">
                    <u-input v-model="formData.licensePersonCardPeriodBegin" placeholder="请输入营业执照有效期"/>
                </u-form-item>
                <u-form-item label="营业执照有效期结束" prop="licensePersonCardPeriodEnd">
                    <u-input v-model="formData.licensePersonCardPeriodEnd" placeholder="请输入营业执照有效期"/>
                </u-form-item>
                <!-- <u-form-item label="营业执照有效期开始" prop="licensePersonCardPeriodBegin">
                    <uni-datetime-picker
                        type="date"
                        :value="formData.licensePersonCardPeriodBegin"
                    />
                </u-form-item>
                <u-form-item label="营业执照有效期结束" prop="licensePersonCardPeriodEnd">
                    <uni-datetime-picker
                        type="date"
                        :value="formData.licensePersonCardPeriodEnd"
                    />
                </u-form-item> -->
                <u-form-item label="营业执照省市县" prop="licenseAddressCode">
                    <pick-regions :defaultRegion="formData.licenseAddressCode" @getRegion="handleGetRegion"/>
                </u-form-item>
                <u-form-item label="营业执照经营范围" prop="licenseBusinessRange">
                    <u-input v-model="formData.licenseBusinessRange" placeholder="请输入经营范围"/>
                </u-form-item>
                </div>
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
</template>
<script>
    // https://pay.weixin.qq.com/wiki/doc/apiv3_partner/apis/chapter11_1_1.shtml
    import { parseTime, OCR } from '@/utils'
	export default {
		data() {
			return {
                channels: [],
                storageToken:'',
                subjectType: [
                    'personal',   // （小微商户）
                    'enterprise',   // （企业）：营业执照上的主体类型一般为有限公司、有限责任公司；
                    'government', // （政府机关）：包括各级、各类政府机关，如机关党委、税务、民政、人社、工商、商务、市监等；
                    'institutions', // （事业单位）：包括国内各类事业单位，如：医疗、教育、学校等单位；
                    'others' // (其他 社会组织）： 包括社会团体、民办非企业、基金会、基层群众性自治组织、农村集体经济组织等组织。
                ],
                range: [
                    {"value": "wechat","text": "微信支付"},
                    {"value": "alipay","text": "支付宝"},
                    {"value": "sdykt","text": "山东一卡通"},
					{"value": "icbc","text": "工商银行"},
                    {"value": "ccb","text": "建设银行"},
                    {"value": "hxb","text": "华夏银行"},
                    {"value": "linshang","text": "临商银行"},
                    {"value": "mfe88","text": "现代支付"}
				],
                formData: {
                    businessCode: parseTime(new Date,'{y}{m}{d}{h}{i}{s}{n}'), // 业务申请编号
                    licenseSubjectType: '', // 主体类型 
                    legalPersonCardHandPic: '', // 手持身份证照片
                    // 营业执照
                    licensePic: '', // 营业执照照片
                    licenseCode: '', // 营业执照代码
                    licenseMerchantName: '', // 营业执照商户名称
                    licensePersonCardPeriodBegin: '', // 营业执照有效期开始时间
                    licensePersonCardPeriodEnd: '', // 营业执照有效期结束时间
                    licenseAddressCode: '', // 营业执照省市县
                    licenseAddress: '', // 营业执照地址
                    licenseBusinessRange: '', // 营业执照经营范围
                    
                },
                rules: {
                    businessCode: [
                        { required: true, message: '请输入申请编号', trigger: 'blur' },
                        { min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }
                    ],
                    licenseSubjectType: [
                        { required: true, message: '请选择主体类型', trigger: 'blur' },
                    ],
                    legalPersonCardHandPic: [
                        { required: true, message: '请上传手持身份证照片', trigger: 'blur' },
                    ],
                    licensePic: [
                        { required: true, message: '请上传营业执照照片', trigger: 'blur' },
                    ],
                    licenseCode: [
                        { required: true, message: '请输入营业执照代码', trigger: 'blur' },
                        {
                            validator: (rule, value, callback) => {
                                if (!/^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/.test(value)) {
                                    callback('请输入正确的营业执照代码')
                                } else {
                                    callback()
                                }
                            }, trigger: 'blur'
                        }
                    ],
                    licenseMerchantName: [
                        { required: true, message: '请输入商户名称', trigger: 'blur' },
                        { min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }
                    ],
                    licenseAddress: [
                        { required: true, message: '请输入营业执照地址', trigger: 'blur' },
                        { min: 3, max: 64, message: '长度在 3 到 256 个字符', trigger: 'blur' }
                    ],
                    licenseBusinessRange: [
                        { required: true, message: '请输入营业执照经营范围', trigger: 'blur' },
                        { min: 3, max: 64, message: '长度在 3 到 256 个字符', trigger: 'blur' }
                    ],
                    licensePersonCardPeriodBegin: [
                        { required: true, message: '请选择营业执照有效期开始时间', trigger: 'blur' },
                    ],
                    licensePersonCardPeriodEnd: [
                        { required: true, message: '请选择营业执照有效期结束时间', trigger: 'blur' },
                    ],
                    licenseAddressCode: [
                        { required: true, message: '请选择营业执照所在地', trigger: 'blur' },
                    ]
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
            this.initStorageToken()
		},
		methods: {
            initFormData() {
                this.formData = {
                    businessCode: parseTime(new Date,'{y}{m}{d}{h}{i}{s}{n}'), // 业务申请编号
                    licenseSubjectType: '', // 主体类型 
                    legalPersonCardHandPic: '', // 手持身份证照片
                    // 营业执照
                    licensePic: '', // 营业执照照片
                    licenseCode: '', // 营业执照代码
                    licenseMerchantName: '', // 营业执照商户名称
                    licensePersonCardPeriodBegin: '', // 营业执照有效期开始时间
                    licensePersonCardPeriodEnd: '', // 营业执照有效期结束时间
                    licenseAddressCode: '', // 营业执照省市县
                    licenseAddress: '', // 营业执照地址
                    licenseBusinessRange: '', // 营业执照经营范围
                }
            },
            initStorageToken() {
                this.$u.api.v3.storage.file.Token().then(res => {
                    // console.log(res.token.type);
                    this.storageToken = res.token
                    // if (res.token.type == 'qiniu') {
                    //     this.storageToken = res.token
                    // }
                }).catch(err => {
                    console.log(err);
                    uni.showToast({
                        duration: 3000,
                        icon:'error',
                        title: "获取上传凭证失败:"+ err.datal,
                    })
                })
            },
            // 获取选择的地区
            handleGetRegion(region){
                console.log(region);
                this.formData.licenseAddressCode = region[2].code
            },
            selectHandPic(e){
                // OCR(e.tempFilePaths[0],'id_card').then(res => {
                //     if (res.idCard) {
                //         this.formData.idCardName = res.idCard.name
                //         this.formData.idCardNumber = res.idCard.id_number
                //         this.formData.idCardAddress = res.idCard.address
                //     } else {
                //         uni.showToast({
                //             duration: 3000,
                //             icon:'error',
                //             title: "身份证识别失败",
                //         })
                //     }
                // }).catch(err => {
                //     uni.showToast({
                //         duration: 3000,
                //         icon:'error',
                //         title: "身份证识别失败:"+err,
                //     })
                // })
                // console.log(e);
                this.select(e, 'legalPersonCardHandPic')
            },
            
            selectLicenseCopy(e){
                // GetUploadToken({
                //     provider: 'qiniu',
                // }).then(res => {
                    
                // })
                OCR(e.tempFilePaths[0],'biz_license').then(res => {
                    console.log(res);
                    if (res.bizLicense) {
                        // if (res.bizLicense.type_of_enterprise.indexOf("公司") != -1 ) {
                        //     this.formData.subjectType = "enterprise"
                        // }
                        // if (res.bizLicense.type_of_enterprise.indexOf("个体") != -1 ) {
                        //     this.formData.subjectType = "individual"
                        // }
                        this.formData.licenseCode = res.bizLicense.reg_num
                        this.formData.licenseMerchantName = res.bizLicense.enterprise_name
                        if (res.bizLicense.period) {
                            const periods = res.bizLicense.period
                                .replace('年', '')
                                .replace('月', '')
                                .replace('日', '')
                                .split('至');
                            this.formData.licensePersonCardPeriodBegin = periods[0]
                            this.formData.licensePersonCardPeriodEnd = periods[1]
                        } else {
                            this.formData.licensePersonCardPeriodBegin = this.formatDate(res.bizLicense.registered_date) 
                            this.formData.licensePersonCardPeriodEnd = '长期'
                        }
                        this.formData.licenseAddress = res.bizLicense.address
                        this.formData.licenseBusinessRange = res.bizLicense.business_scope
                    }else{
                       uni.showToast({
                            duration: 3000,
                            icon:'error',
                            title: "营业执照识别失败",
                        }) 
                    }
                }).catch(err => {
                    uni.showToast({
                        duration: 3000,
                        icon:'error',
                        title: "营业执照识别失败:"+err,
                    })
                })
                this.select(e, 'licensePic')
            },
            // 获取上传状态
			select(e,type){
                // console.log(e, type);
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
                            this.formData[type] = path
                            // console.log(uploadFileRes)
                            uni.showToast({
                                duration: 3000,
                                icon:'success',
                                title:'上传成功',
                            })
                        }else{
                            uni.showToast({
                                duration: 3000,
                                icon:'error',
                                title:'上传失败',
                            })
                        }
                    }
                })
			},
            //格式化营业执照时间 去掉时间中的汉字
            formatDate(dateString) {
                return dateString.replace(/[\u4e00-\u9fa5]/g, '');
            },
            nextPage(formName) {
                console.log(formName);
                this.$u.route({
                    type: 'to',
                    url: 'subPackages/institution/apply/index2',
                    params: { formData: JSON.stringify(this.formData) }
                })
                // this.$refs[formName].validate((valid) => {
                //     if (valid) {
                //         this.$u.route({
                //             type: 'to',
                //             url: 'subPackages/institution/apply/index2',
                //             params: { formData: JSON.stringify(this.formData) }
                //         })
                //     }
                    
                // })
               
            },
            // submitForm(formName) {
            //     // console.log(this.formData.subjectType);
            //     this.$refs[formName].validate((valid) => {
            //         if (valid) {
            //             this.$u.api.institution.apply.Create({
            //                 apply: this.formData
            //             }).then(res => {
            //                 if (res.valid) {
            //                     this.initFormData()
            //                     uni.showToast({
            //                         duration: 5000,
            //                         icon:'success',
            //                         title:'进件成功',
            //                     })
            //                 } else {
            //                     uni.showToast({
            //                         duration: 3000,
            //                         icon:'error',
            //                         title:'进件失败',
            //                     })
            //                 }
            //             }).catch(err => {
            //                 console.log(err);
            //                 uni.showToast({
            //                     duration: 3000,
            //                     icon:'error',
            //                     title: err.datal,
            //                 })
            //             })
            //         }
            //     })
            // }
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