<template>
	<view>
        <view v-if="userId">
            <view class="item">
                <u-steps :list="numList" :current="0" mode="number"></u-steps>
                <u-form :model="formData" ref="dataForm" label-width="260">
                    <u-form-item label="申请编号" prop="businessCode">
                        <u-input v-model="formData.businessCode" disabled placeholder="请输入业务申请编号"/>
                    </u-form-item>
                    <u-form-item label="主体类型" prop="licenseSubjectType">
                        <u-radio-group v-model="formData.licenseSubjectType">
                            <u-radio key="SUBJECT_TYPE_PERSONAL" name="SUBJECT_TYPE_PERSONAL">小微商户</u-radio>
                            <u-radio key="SUBJECT_TYPE_INDIVIDUAL" name="SUBJECT_TYPE_INDIVIDUAL">个体户</u-radio>
                            <u-radio key="SUBJECT_TYPE_ENTERPRISE" name="SUBJECT_TYPE_ENTERPRISE">企业</u-radio>
                            <u-radio key="SUBJECT_TYPE_STOCK_COMPANY" name="SUBJECT_TYPE_STOCK_COMPANY">股份有限公司</u-radio>
                            <u-radio key="SUBJECT_TYPE_GOVERNMENT" name="SUBJECT_TYPE_GOVERNMENT">政府机关</u-radio>
                            <u-radio key="SUBJECT_TYPE_INSTITUTIONS" name="SUBJECT_TYPE_INSTITUTIONS">事业单位</u-radio>
                            <u-radio key="SUBJECT_TYPE_OTHERS" name="SUBJECT_TYPE_OTHERS">其他 社会组织</u-radio>
                        </u-radio-group>
                    </u-form-item>
                    <u-form-item label="手持身份证照片" prop="legalPersonCardHandPic" v-if="formData.licenseSubjectType === 'SUBJECT_TYPE_PERSONAL'">
                        <uni-file-picker 
                            fileMediatype="image" 
                            mode="grid" 
                            limit="1"
                            @select="selectHandPic" 
                        />
                    </u-form-item>
                    <div v-if="formData.licenseSubjectType === 'SUBJECT_TYPE_ENTERPRISE' || formData.licenseSubjectType === 'SUBJECT_TYPE_INDIVIDUAL' || formData.licenseSubjectType === 'SUBJECT_TYPE_STOCK_COMPANY'">
                        <u-form-item label="营业执照照片" prop="licensePic">
                        <uni-file-picker 
                            fileMediatype="image" 
                            mode="grid" 
                            limit="1"
                            @select="selectLicensePic" 
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
                    <!-- <u-form-item label="营业执照省市县" prop="licenseAddressCode">
                        <pick-regions :defaultRegion="formData.licenseAddressCode" @getRegion="handleGetRegion"/>
                    </u-form-item> -->
                    <u-form-item label="营业执照省市县" prop="licenseDistrictCode">
                        <pick-regions :defaultRegion="formData.licenseDistrictCode" @getRegion="handleGetRegion"/>
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
        <view v-if="!userId">
            <u-form-item> 页面开发中，敬请期待</u-form-item>
        </view>
    </view>
</template>
<script>
    // https://pay.weixin.qq.com/wiki/doc/apiv3_partner/apis/chapter11_1_1.shtml
    import { parseTime, OCR } from '@/utils'
    import { mapState, mapGetters } from 'vuex'
	export default {
		data() {
			return {
                numList: [{
					name: '主体信息'
				}, {
					name: '法人信息'
				}, {
					name: '结算信息'
				}, {
					name: '门店信息'
				}, ],
                channels: [],
                storageToken:'',
                subjectType: [
                    'SUBJECT_TYPE_PERSONAL',   // （小微商户）
                    'SUBJECT_TYPE_INDIVIDUAL',   // （个体工商户）：营业执照上的主体类型一般为个体户、个体工商户；
                    'SUBJECT_TYPE_ENTERPRISE',   // （企业）：营业执照上的主体类型一般为有限公司、有限责任公司；
                    'SUBJECT_TYPE_STOCK_COMPANY',   // （股份有限公司）：营业执照上的主体类型一般为股份有限公司；
                    'SUBJECT_TYPE_GOVERNMENT', // （政府机关）：包括各级、各类政府机关，如机关党委、税务、民政、人社、工商、商务、市监等；
                    'SUBJECT_TYPE_INSTITUTIONS', // （事业单位）：包括国内各类事业单位，如：医疗、教育、学校等单位；
                    'SUBJECT_TYPE_OTHERS' // (其他 社会组织）： 包括社会团体、民办非企业、基金会、基层群众性自治组织、农村集体经济组织等组织。
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
                    businessCode: parseTime(new Date,'{y}{m}{d}'+Math.floor(Math.random() * 10000).toString().padStart(4, '0')), // 业务申请编号
                    licenseSubjectType: '', // 主体类型 
                    legalPersonCardHandPic: '', // 手持身份证照片
                    // 营业执照
                    licensePic: '', // 营业执照照片
                    licenseCode: '', // 营业执照代码
                    licenseMerchantName: '', // 营业执照商户名称
                    licensePersonCardPeriodBegin: '', // 营业执照有效期开始时间
                    licensePersonCardPeriodEnd: '', // 营业执照有效期结束时间
                    licenseDistrictCode: '', // 营业执照省市县
                    licenseAddress: '', // 营业执照地址
                    licenseBusinessRange: '', // 营业执照经营范围
                    licenseCityCode: '', 
                    licenseProvinceCode: '',
                    
                },
                rules: {
                    businessCode: [
                        { required: true, message: '请输入申请编号', trigger: 'blur' },
                        { min: 2, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }
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
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    licenseAddress: [
                        { required: true, message: '请输入营业执照地址', trigger: 'blur' },
                        { min: 2, max: 64, message: '长度在 2 到 256 个字符', trigger: 'blur' }
                    ],
                    licenseBusinessRange: [
                        { required: true, message: '请输入营业执照经营范围', trigger: 'blur' },
                        { min: 2, max: 256, message: '长度在 2 到 256 个字符', trigger: 'blur' }
                    ],
                    licensePersonCardPeriodBegin: [
                        { required: true, message: '请选择营业执照有效期开始时间', trigger: 'blur' },
                    ],
                    licensePersonCardPeriodEnd: [
                        { required: true, message: '请选择营业执照有效期结束时间', trigger: 'blur' },
                    ],
                    licenseDistrictCode: [
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
                    businessCode: parseTime(new Date,'{y}{m}{d}')+Math.floor(Math.random() * 10000), // 业务申请编号
                    licenseSubjectType: '', // 主体类型 
                    legalPersonCardHandPic: '', // 手持身份证照片
                    // 营业执照
                    licensePic: '', // 营业执照照片
                    licenseCode: '', // 营业执照代码
                    licenseMerchantName: '', // 营业执照商户名称
                    licensePersonCardPeriodBegin: '', // 营业执照有效期开始时间
                    licensePersonCardPeriodEnd: '', // 营业执照有效期结束时间
                    licenseDistrictCode: '', // 营业执照省市县
                    licenseAddress: '', // 营业执照地址
                    licenseBusinessRange: '', // 营业执照经营范围
                    licenseCityCode: '', 
                    licenseProvinceCode: '',
                }
            },
            initStorageToken() {
                this.$u.api.v3.storage.file.GetUploadToken().then(res => {
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
                this.formData.licenseDistrictCode = region[2].code
                this.formData.licenseCityCode = region[1].code
                this.formData.licenseProvinceCode = region[0].code
            },
            selectHandPic(e){
                // this.select(e, 'legalPersonCardHandPic')
                if (e.tempFiles[0].size > 1024 * 1024) {
                    uni.showToast({
                        duration: 3000,
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
                            this.formData.legalPersonCardHandPic = path
                            uni.showToast({
                                duration: 3000,
                                icon:'success',
                                title:'上传成功'
                            })
                        }else{
                            uni.showToast({
                                duration: 3000,
                                icon:'error',
                                title:'上传失败'
                            })
                        }
                    },
                    fail: (err) => {
                        console.log(err.errMsg);
                        uni.showToast({
                            duration: 3000,
                            icon:'error',
                            title:'上传失败'+err.errMsg,
                        })
                    }
                })
                
            },
            // selectLicenseCopy(e){
            //     // if (e.tempFilePaths[0].size > 1024 * 1024) {
            //     //     console.log('图片超过1m');
            //     //     this.$toast('文件大小不能超过1M');
            //     //     uni.showToast({
            //     //         duration: 3000,
            //     //         icon:'error',
            //     //         title: "图片大小超过1M",
            //     //     }) 
            //     //     return false;
            //     // }
            //     OCR(e.tempFilePaths[0],'biz_license').then(res => {
            //         console.log(res);
            //         if (res.bizLicense) {
            //             this.formData.licenseCode = res.bizLicense.reg_num
            //             this.formData.licenseMerchantName = res.bizLicense.enterprise_name
            //             if (res.bizLicense.period) {
            //                 const periods = res.bizLicense.period
            //                     .replace('年', '')
            //                     .replace('月', '')
            //                     .replace('日', '')
            //                     .split('至');
            //                 this.formData.licensePersonCardPeriodBegin = periods[0]
            //                 this.formData.licensePersonCardPeriodEnd = periods[1]
            //             } else {
            //                 this.formData.licensePersonCardPeriodBegin = this.formatDate(res.bizLicense.registered_date) 
            //                 this.formData.licensePersonCardPeriodEnd = '长期'
            //             }
            //             this.formData.licenseAddress = res.bizLicense.address
            //             this.formData.licenseBusinessRange = res.bizLicense.business_scope
            //         }else{
            //            uni.showToast({
            //                 duration: 3000,
            //                 icon:'error',
            //                 title: "营业执照识别失败",
            //             }) 
            //             return
            //         }
            //     }).catch(err => {
            //         uni.showToast({
            //             duration: 3000,
            //             icon:'error',
            //             title: "营业执照识别失败:"+err,
            //         })
            //     })
            //     this.select(e, 'licensePic')
            // },

            // 获取上传状态
			selectLicensePic(e){
                console.log(e);
                if (e.tempFiles[0].size > 1024 * 1024) {
                    uni.showToast({
                        duration: 3000,
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
                            this.formData.licensePic = path
                           //获取图片地址并识别图片信息
                           this.$u.api.v3.storage.file.GetUploadImage({
                                provider: 'qiniu',
                                key: path
                            }).then(res => {
                                console.log(res)
                                this.$u.api.v3.storage.file.BizLicenseOCR({
                                    imageBase64: '',
                                    imageUrl: res.url,
                                }).then(res => {
                                    console.log('res')
                                    console.log(res)
                                    this.formData.licenseCode = res.regNum
                                    this.formData.licenseMerchantName = res.name
                                    if (res.period) {
                                        const periods = res.period
                                            .replace('年', '')
                                            .replace('月', '')
                                            .replace('日', '')
                                            .split('至');
                                        this.formData.licensePersonCardPeriodBegin = periods[0]
                                        this.formData.licensePersonCardPeriodEnd = periods[1]
                                    } else {
                                        this.formData.licensePersonCardPeriodBegin = this.formatDate(res.registrationDate) 
                                        this.formData.licensePersonCardPeriodEnd = '长期'
                                    }
                                    this.formData.licenseAddress = res.address
                                    this.formData.licenseBusinessRange = res.business
                                }).catch(err => {
                                    uni.showToast({
                                        duration: 3000,
                                        icon:'error',
                                        title: "营业执照识别失败:"+err,
                                    })
                                })
                            }).catch(err => {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'error',
                                    title: "营业执照识别失败:"+err,
                                })
                            })
                            uni.showToast({
                                duration: 3000,
                                icon:'success',
                                title:'上传成功'
                            })
                        }else{
                            uni.showToast({
                                duration: 3000,
                                icon:'error',
                                title:'上传失败'
                            })
                        }
                    },
                    fail: (err) => {
                        console.log('err')
                        console.log(err.errMsg);
                        uni.showToast({
                            duration: 3000,
                            icon:'error',
                            title:'上传失败'+err.errMsg,
                        })
                    }
                })
			},
            //格式化营业执照时间 去掉时间中的汉字
            formatDate(dateString) {
                return dateString.replace(/[\u4e00-\u9fa5]/g, '');
            },
            nextPage(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$u.route({
                            type: 'to',
                            url: 'subPackages/institution/apply/index2',
                            params: { formData: JSON.stringify(this.formData) }
                        })
                    } 
                })
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