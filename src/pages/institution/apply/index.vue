<template>
	<view>
		<view class="item">
            <u-form :model="formData" ref="dataForm" label-width="250">
                <u-form-item label="申请编号" prop="businessCode">
                    <u-input v-model="formData.businessCode" placeholder="请输入业务申请编号"/>
                </u-form-item>
                <u-form-item label="申请通道" prop="channels">
                    <uni-data-checkbox multiple :localdata="range" @change="checkboxChange"></uni-data-checkbox>
                </u-form-item>
                <u-form-item label="主体类型" prop="subjectType">
					<u-radio-group v-model="formData.subjectType">
						<u-radio key="individual" name="individual">个体户</u-radio>
						<u-radio key="enterprise" name="enterprise">企业</u-radio>
                        <u-radio key="government" name="government">政府机关</u-radio>
						<u-radio key="institutions" name="institutions">事业单位</u-radio>
                        <u-radio key="others" name="others">其他 社会组织</u-radio>
					</u-radio-group>
                </u-form-item>
                <u-form-item label="营业执照照片" prop="licenseCopy">
                    <uni-file-picker 
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="selectLicenseCopy" 
                    />
                </u-form-item>
                <u-form-item label="商户名称" prop="merchantName">
                    <u-input v-model="formData.merchantName" placeholder="请输入商户名称"/>
                </u-form-item>
                <u-form-item label="注册号/统一社会信用代码" prop="licenseCode">
                    <u-input v-model="formData.licenseCode" placeholder="请输入注册号/统一社会信用代码"/>
                </u-form-item>
                <u-form-item label="注册地址" prop="address">
                    <u-input v-model="formData.address" placeholder="请输入注册地址"/>
                </u-form-item>
                <u-form-item label="法人姓名" prop="legalPerson">
                    <u-input v-model="formData.legalPerson" placeholder="请输入法人姓名"/>
                </u-form-item>
                <u-form-item label="法人电话" prop="legalPersonPhone">
                    <u-input v-model="formData.legalPersonPhone" placeholder="请输入法人电话"/>
                </u-form-item>
                <u-form-item label="身份证人像面照片" prop="idCardCopy">
                    <uni-file-picker 
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="selectIdCardCopy" 
                    />
                </u-form-item>
                <u-form-item label="身份证国徽面照片" prop="idCardNational">
                    <uni-file-picker 
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="selectIdCardNational" 
                    />
                </u-form-item>
                <u-form-item label="法人身份证号" prop="legalPersonBank">
                    <u-input v-model="formData.legalPersonBank" placeholder="请输入法人身份证号"/>
                </u-form-item>
                <u-form-item label="身份证有效期开始" prop="cardPeriodBegin">
                    <uni-datetime-picker
                        type="date"
                        :value="formData.cardPeriodBegin"
                    />
                </u-form-item>
                <u-form-item label="身份证有效期结束" prop="cardPeriodEnd">
                    <uni-datetime-picker
                        type="date"
                        :value="formData.cardPeriodEnd"
                    />
                </u-form-item>
                <u-form-item label="银行卡照片" prop="bankCardCopy">
                    <uni-file-picker 
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="selectBankCardCopy" 
                    />
                </u-form-item>
                <u-form-item label="账户类型" prop="bankAccountType">
					<u-radio-group v-model="formData.bankAccountType">
						<u-radio key="corporate" name="corporate">对公银行账户</u-radio>
						<u-radio key="personal" name="personal">个人银行卡</u-radio>
					</u-radio-group>
                </u-form-item>
                <u-form-item label="开户银行" prop="accountBank">
                    <u-input v-model="formData.accountBank" placeholder="请输入开户银行"/>
                </u-form-item>
                <u-form-item label="开户银行省市编码" prop="bankAddressCode">
                    <pick-regions :defaultRegion="formData.bankAddressCode" @getRegion="handleGetRegion"/>
                </u-form-item>
                <u-form-item label="银行账号" prop="accountNumber">
                    <u-input v-model="formData.accountNumber" placeholder="请输入银行账号"/>
                </u-form-item>
                <u-form-item label="收款二维码编号" prop="qrcode">
                    <u-input v-model="formData.qrcode" placeholder="请输入收款二维码编号"/>
                </u-form-item>
                <u-form-item label="其他备注" prop="remark">
                    <u-input v-model="formData.remark"/>
                </u-form-item>
            </u-form>
            <u-line />
            <view class="bottom">	
                <u-button 
                    type="warning" 
                    @click="submitForm('dataForm')"
                >
                    提交资料
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
                    'individual',   // （个体户）：营业执照上的主体类型一般为个体户、个体工商户、个体经营；
                    'enterprise',   // （企业）：营业执照上的主体类型一般为有限公司、有限责任公司；
                    'government', // （政府机关）：包括各级、各类政府机关，如机关党委、税务、民政、人社、工商、商务、市监等；
                    'institutions', // （事业单位）：包括国内各类事业单位，如：医疗、教育、学校等单位；
                    'others' // (其他 社会组织）： 包括社会团体、民办非企业、基金会、基层群众性自治组织、农村集体经济组织等组织。
                ],
                bankAccountType: [  // 结算银行账户 账户类型
                    'corporate',    // 对公银行账户
                    'personal'      // 经营者个人银行卡
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
                    channels: [], //  通道组
                    subjectType: '', // 主体类型 
                    // 营业执照
                    licenseCopy: '', // 营业执照照片
                    licenseCode: '', // 注册号/统一社会信用代码
                    merchantName: '', // 商户名称
                    address: '',
                    // 法人资料
                    legalPerson: '', // 个体户经营者/法人姓名
                    legalPersonPhone: '', // 法人电话
                    // 身份证
                    idCardCopy: '',    // 身份证人像面照片
                    idCardNational: '',    // 身份证国徽面照片
                    legalPersonBank: '',    // 法人身份证号
                    cardPeriodBegin: '20010-01-01',  // 身份证有效期开始
                    cardPeriodEnd: '2030-01-01',  // 身份证有效期结束
                    // 银行结算资料
                    bankCardCopy: '',    // 银行卡照片
                    bankAccountType: '', // 账户类型[对公银行账户、经营者个人银行卡]
                    accountBank: '', // 开户银行
                    bankAddressCode: '',  // 开户银行省市编码 至少精确到市，详细参见省市区编号对照表。
                    accountNumber: '',     // 银行账号
                    // 需求相关
                    qrcode: '',  // 预制码 收款二维码
                    remark: '', // 备注
                },
                rules: {
                    businessCode: [
                        { required: true, message: '请输入申请编号', trigger: 'blur' },
                        { min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }
                    ],
                    channels: [
                        {
                            validator: (rule, value, callback) => {
                                if (value.length>0) {
                                    callback()
                                } else {
                                    callback('请选择通道')
                                }
                            }, trigger: 'blur'
                        }
                    ],
                    subjectType: [
                        { required: true, message: '请选择主体类型', trigger: 'blur' },
                    ],
                    licenseCopy: [
                        { required: true, message: '请上传营业执照照片', trigger: 'blur' },
                    ],
                    licenseCode: [
                        { required: true, message: '请输入注册号/统一社会信用代码', trigger: 'blur' },
                        {
                            validator: (rule, value, callback) => {
                                if (!/^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/.test(value)) {
                                    callback('请输入正确的注册号/统一社会信用代码')
                                } else {
                                    callback()
                                }
                            }, trigger: 'blur'
                        }
                    ],
                    merchantName: [
                        { required: true, message: '请输入商户名称', trigger: 'blur' },
                        { min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }
                    ],
                    legalPerson: [
                        { required: true, message: '请输入个体户经营者/法人姓名', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '请输入注册地址', trigger: 'blur' },
                        { min: 3, max: 64, message: '长度在 3 到 256 个字符', trigger: 'blur' }
                    ],
                    legalPersonPhone: [
                        { required: true, message: '请输入法人电话', trigger: 'blur' },
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
                    idCardCopy: [
                        { required: true, message: '请上传身份证人像面照片', trigger: 'blur' },
                    ],
                    idCardNational: [
                        { required: true, message: '请上传身份证国徽面照片', trigger: 'blur' },
                    ],
                    legalPersonBank: [
                        { required: true, message: '请输入法人身份证号', trigger: 'blur' },
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
                    bankCardCopy: [
                        { required: true, message: '请上传银行卡照片', trigger: 'blur' },
                    ],
                    bankAccountType: [
                        { required: true, message: '请选择银行账户类型', trigger: 'blur' },
                    ],
                    bankAddressCode: [
                        { required: true, message: '请选择开户银行省市编码', trigger: 'blur' },
                    ],
                    accountNumber: [
                        { required: true, message: '请输入银行账号', trigger: 'blur' },
                    ],
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
                    channels: [], //  通道组
                    subjectType: '', // 主体类型 
                    // 营业执照
                    licenseCopy: '', // 营业执照照片
                    licenseCode: '', // 注册号/统一社会信用代码
                    merchantName: '', // 商户名称
                    address: '',
                    // 法人资料
                    legalPerson: '', // 个体户经营者/法人姓名
                    legalPersonPhone: '', // 法人电话
                    // 身份证
                    idCardCopy: '',    // 身份证人像面照片
                    idCardNational: '',    // 身份证国徽面照片
                    legalPersonBank: '',    // 法人身份证号
                    cardPeriodBegin: '20010-01-01',  // 身份证有效期开始
                    cardPeriodEnd: '2030-01-01',  // 身份证有效期结束
                    // 银行结算资料
                    bankCardCopy: '',    // 银行卡照片
                    bankAccountType: '', // 账户类型[对公银行账户、经营者个人银行卡]
                    accountBank: '', // 开户银行
                    bankAddressCode: '',  // 开户银行省市编码 至少精确到市，详细参见省市区编号对照表。
                    accountNumber: '',     // 银行账号
                    // 需求相关
                    qrcode: '',  // 预制码 收款二维码
                    remark: '', // 备注
                }
            },
            initStorageToken() {
                        this.$u.api.storage.file.Token().then(res => {
                            if (res.token.type == 'qiniu') {
                                this.storageToken = res.token.token
                            }
                        }).catch(err => {
                            console.log(err);
                            uni.showToast({
                                duration: 3000,
                                icon:'error',
                                title: "获取上传凭证失败:"+ err.datal,
                            })
                        })
            },
            checkboxChange(e) {
                this.formData.channels = []
                e.detail.value.forEach(item => {
                    this.formData.channels.push({
                        type: item,
                    })
                });
                
			},
            // 获取选择的地区
            handleGetRegion(region){
                this.formData.bankAddressCode = region[2].code
            },
            selectLicenseCopy(e){
                OCR(e.tempFilePaths[0],'biz_license').then(res => {
                    if (res.bizLicense) {
                        if (res.bizLicense.type_of_enterprise.indexOf("公司") != -1 ) {
                            this.formData.subjectType = "enterprise"
                        }
                        if (res.bizLicense.type_of_enterprise.indexOf("个体") != -1 ) {
                            this.formData.subjectType = "individual"
                        }
                        this.formData.merchantName = res.bizLicense.enterprise_name
                        this.formData.licenseCode = res.bizLicense.reg_num
                        this.formData.legalPerson = res.bizLicense.legal_representative
                        this.formData.address = res.bizLicense.address
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
                this.select(e, 'licenseCopy')
            },
            selectIdCardCopy(e){
                OCR(e.tempFilePaths[0],'idcard').then(res => {
                    if (res.idcard) {
                        this.formData.legalPersonBank = res.idcard.id
                    }else{
                       uni.showToast({
                            duration: 3000,
                            icon:'error',
                            title: "身份证识别失败",
                        }) 
                    }
                }).catch(err => {
                    uni.showToast({
                        duration: 3000,
                        icon:'error',
                        title: "身份证识别失败:"+err,
                    })
                })
                this.select(e, 'idCardCopy')
            },
            selectIdCardNational(e){
                OCR(e.tempFilePaths[0],'idcard').then(res => {
                    if (res.idcard) {
                        const dates =  res.idcard.valid_date.split("-")
                        this.formData.cardPeriodBegin = dates[0].slice(0,4)+"-"+dates[0].slice(4,6)+"-"+dates[0].slice(6,8)
                        this.formData.cardPeriodEnd = dates[1].slice(0,4)+"-"+dates[1].slice(4,6)+"-"+dates[1].slice(6,8)
                    }else{
                       uni.showToast({
                            duration: 3000,
                            icon:'error',
                            title: "身份证识别失败",
                        }) 
                    }
                }).catch(err => {
                    uni.showToast({
                        duration: 3000,
                        icon:'error',
                        title: "身份证识别失败:"+err,
                    })
                })
                this.select(e, 'idCardNational')
            },
            selectBankCardCopy(e){
                OCR(e.tempFilePaths[0],'bankcard').then(res => {
                    if (res.bankcard) {
                        this.formData.accountNumber = res.bankcard.number
                    }else{
                       uni.showToast({
                            duration: 3000,
                            icon:'error',
                            title: "银行卡识别失败",
                        }) 
                    }
                }).catch(err => {
                    uni.showToast({
                        duration: 3000,
                        icon:'error',
                        title: "银行卡识别失败:"+err,
                    })
                })
                this.select(e, 'bankCardCopy')
            },
            // 获取上传状态
			select(e,type){
                const path = 'apply/'+this.formData.businessCode+"/"+e.tempFiles[0].cloudPath
                const filePath =  e.tempFilePaths[0]
                uni.uploadFile({
                    url: 'https://up.qiniup.com', //仅为示例，非真实的接口地址
                    filePath: filePath,
                    name: 'file',
                    formData: {
                        'token': this.storageToken,
                        'key': path
                    },
                    success: (uploadFileRes) => {
                        if (uploadFileRes.statusCode===200) {
                            this.formData[type] = path
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
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$u.api.institution.apply.Create({
                            apply: this.formData
                        }).then(res => {
                            if (res.valid) {
                                this.initFormData()
                                uni.showToast({
                                    duration: 5000,
                                    icon:'success',
                                    title:'进件成功',
                                })
                            } else {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'error',
                                    title:'进件失败',
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