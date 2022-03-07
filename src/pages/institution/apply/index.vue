<template>
	<view>
		<view class="item">
            <u-form :model="formData" ref="dataForm" label-width="240">
                <u-form-item label="申请编号" prop="businessCode">
                    <u-input v-model="formData.businessCode" placeholder="请输入业务申请编号"/>
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
                        v-model="imageValue" 
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="select" 
                    />
                </u-form-item>
                <u-form-item label="商户名称" prop="merchantName">
                    <u-input v-model="formData.merchantName" placeholder="请输入商户名称"/>
                </u-form-item>
                <u-form-item label="注册号/统一社会信用代码" prop="licenseCode">
                    <u-input v-model="formData.licenseCode" placeholder="请输入注册号/统一社会信用代码"/>
                </u-form-item>
                <u-form-item label="法人姓名" prop="legalPerson">
                    <u-input v-model="formData.legalPerson" placeholder="请输入法人姓名"/>
                </u-form-item>
                <u-form-item label="法人电话" prop="legalPersonPhone">
                    <u-input v-model="formData.legalPersonPhone" placeholder="请输入法人电话"/>
                </u-form-item>
                <u-form-item label="身份证人像面照片" prop="idCardCopy">
                    <uni-file-picker 
                        v-model="imageValue" 
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="select" 
                    />
                </u-form-item>
                <u-form-item label="身份证国徽面照片" prop="idCardNational">
                    <uni-file-picker 
                        v-model="imageValue" 
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="select" 
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
                        v-model="imageValue" 
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="select" 
                    />
                </u-form-item>
                <u-form-item label="账户类型" prop="bankAccountType">
					<u-radio-group v-model="formData.bankAccountType">
						<u-radio key="corporate" name="corporate">对公银行账户</u-radio>
						<u-radio key="personal" name="enterprise">个人银行卡</u-radio>
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
                    确认修改
                </u-button>
		    </view>	
        </view>	
        <u-toast ref="uToast" />
	</view>
</template>
<script>
    // https://pay.weixin.qq.com/wiki/doc/apiv3_partner/apis/chapter11_1_1.shtml
    import { OCR } from '@/utils'
	export default {
		data() {
			return {
                queryBanks: [],
                imageValue:[],
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
                formData: {
                    businessCode: '', // 业务申请编号
                    subjectType: '', // 主体类型 
                    // 营业执照
                    licenseCopy: '', // 营业执照照片
                    licenseCode: '', // 注册号/统一社会信用代码
                    merchantName: '', // 商户名称
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
            // 获取选择的地区
            handleGetRegion(region){
                this.formData.bankAddressCode = region[2].code
            },
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
                        this.$u.api.institution.aaply.Create({
                            aaply: this.formData
                        }).then(res => {
                            if (res.valid) {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'success',
                                    title:'进件成功',
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
                                    title:'进件失败',
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