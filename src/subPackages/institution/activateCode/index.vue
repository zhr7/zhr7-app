<template>
	<view>
		<view class="item">
            <u-form :model="formData" ref="dataForm" label-width="260">
                <u-form-item label="激活付款码" prop="qrcode">
                    <uni-file-picker 
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="selectFile" 
                    />
                </u-form-item>
                <u-form-item label="激活付款码ID" prop="businessCode">
                    <u-input v-model="formData.businessCode" placeholder="请输入业务申请编号"/>
                </u-form-item>
                <u-form-item label="付款码名称" prop="businessCode">
                    <u-input v-model="formData.businessCode" placeholder="请输入业务申请编号"/>
                </u-form-item>
                <u-form-item label="商户存否" prop="licenseSubjectType">
					<u-radio-group v-model="formData.licenseSubjectType">
                        <u-radio key="personal" name="personal" >已存在商户账号</u-radio>
						<u-radio key="enterprise" name="enterprise">无账号创建账号</u-radio>
					</u-radio-group>
                </u-form-item>
                <u-form-item label="平台商家" prop="bankChannelNo"> 
                    <u-input v-model="searchKeyword" @input="filterOptions" placeholder="请输入关键字搜索"/>
                    <u-select v-model="showSelect" :list="filteredOptions" @confirm="confirmOption" ></u-select>
                </u-form-item>
                <div v-if="formData.licenseSubjectType === 'enterprise'">
                    <u-form-item label="所属品牌商家" prop="bankChannelNo"> 
                        <u-input v-model="searchKeyword" @input="filterOptions" placeholder="请输入关键字搜索"/>
                        <u-select v-model="showSelect" :list="filteredOptions" @confirm="confirmOption" ></u-select>
                    </u-form-item>
                    <u-form-item label="所属机构" prop="bankChannelNo"> 
                        <u-input v-model="searchKeyword" @input="filterOptions" placeholder="请输入关键字搜索"/>
                        <u-select v-model="showSelect" :list="filteredOptions" @confirm="confirmOption" ></u-select>
                    </u-form-item>
                    <u-form-item label="绑定软件服务商" prop="bankChannelNo"> 
                        <u-input v-model="searchKeyword" @input="filterOptions" placeholder="请输入关键字搜索"/>
                        <u-select v-model="showSelect" :list="filteredOptions" @confirm="confirmOption" ></u-select>
                    </u-form-item>
                    <u-form-item label="账号" prop="licenseMerchantName">
                        <u-input v-model="formData.licenseMerchantName" placeholder="请输入商户名称"/>
                    </u-form-item>
                    <u-form-item label="密码" prop="licenseCode">
                        <u-input v-model="formData.licenseCode" placeholder="请输入营业执照代码"/>
                    </u-form-item>
                    <u-form-item label="商家名称" prop="licenseAddress">
                        <u-input v-model="formData.licenseAddress" placeholder="请输入地址"/>
                    </u-form-item>
                    <u-form-item label="联系手机" prop="licensePersonCardPeriodBegin">
                        <u-input v-model="formData.licensePersonCardPeriodBegin" placeholder="请输入营业执照有效期"/>
                    </u-form-item>
                    <u-form-item label="地址" prop="licenseAddressCode">
                        <pick-regions :defaultRegion="formData.licenseAddressCode" @getRegion="handleGetRegion"/>
                    </u-form-item>
                    <u-form-item label="详情地址" prop="licensePersonCardPeriodEnd">
                        <u-input v-model="formData.licensePersonCardPeriodEnd" placeholder="请输入营业执照有效期"/>
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
                formData: {
                    businessCode: parseTime(new Date,'{y}{m}{d}{h}{i}{s}{n}'), // 业务申请编号
                    licenseSubjectType: 'personal', // 主体类型 
                    qrcode: '', // 手持身份证照片
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
                    qrcode: [
                        { required: true, message: '请上传二维码照片', trigger: 'blur' },
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
                        { min: 3, max: 256, message: '长度在 3 到 256 个字符', trigger: 'blur' }
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
				title:'激活付款码'
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
                    qrcode: '', // 激活码
                    operatorId: '', // 激活二维码ID
                    SellerExist: '', // 商户存否 
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
                this.formData.licenseAddressCode = region[2].code
            },
            selectFile(e){
                if (e.tempFiles[0].size > 1024 * 1024) {
                    uni.showToast({
                        duration: 3000,
                        icon:'error',
                        title:'图片大小超过1M',
                    })
                    return;
                }
                wx.scanCode({
                    success: (res) => {
                        console.log(res);
                        this.formData.operatorId = res.result
                    }
                })
                // const path = 'apply/'+this.formData.businessCode+"/"+e.tempFiles[0].cloudPath
                // const filePath =  e.tempFilePaths[0]
                // uni.uploadFile({
                //     url: 'https://upload.qiniup.com/', 
                //     filePath: filePath,
                //     name: 'file',
                //     formData: {
                //         'token': this.storageToken,
                //         'key': path
                //     },
                //     success: (uploadFileRes) => {
                //         if (uploadFileRes.statusCode===200) {
                //             this.formData.legalPersonCardHandPic = path
                //             uni.showToast({
                //                 duration: 3000,
                //                 icon:'success',
                //                 title:'上传成功'
                //             })
                //         }else{
                //             uni.showToast({
                //                 duration: 3000,
                //                 icon:'error',
                //                 title:'上传失败'
                //             })
                //         }
                //     },
                //     fail: (err) => {
                //         console.log(err.errMsg);
                //         uni.showToast({
                //             duration: 3000,
                //             icon:'error',
                //             title:'上传失败'+err.errMsg,
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