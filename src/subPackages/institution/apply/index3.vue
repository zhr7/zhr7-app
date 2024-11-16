<template>
	<view>
		<view class="item">
            <u-steps :list="numList" :current="2" mode="number"></u-steps>
            <u-form :model="formData" ref="dataForm" label-width="250">
                <u-form-item label="银行卡照片" prop="bankCardPic">
                    <uni-file-picker 
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="selectBankCardCopy" 
                    />
                </u-form-item>
                <u-form-item label="账户类型" prop="bankAccountType">
					<u-radio-group v-model="formData.bankAccountType">
						<u-radio key="CORPORATE" name="corporate">对公银行账户</u-radio>
						<u-radio key="PERSONAL" name="personal">个人银行卡</u-radio>
					</u-radio-group>
                </u-form-item>
                <u-form-item label="开户银行" prop="bankAccountBank">
                    <u-input v-model="formData.bankAccountBank" placeholder="请输入开户银行"/>
                </u-form-item>
                <u-form-item label="银行通道编号" prop="bankChannelNo">
                    <u-input v-model="bankChannelNoName" disabled  placeholder="请选择银行通道编号" @click="showBankChannel = !showBankChannel"/>
                    <u-select v-model="showBankChannel" mode="mutil-column-auto" :list="bankChannelList" @confirm="confirmBankChannelNo"></u-select>
                </u-form-item>
                <u-form-item label="银行账号" prop="bankAccountNo">
                    <u-input v-model="formData.bankAccountNo" placeholder="请输入银行账号"/>
                </u-form-item>
                <u-form-item label="开户名称" prop="bankAccountName">
                    <u-input v-model="formData.bankAccountName" placeholder="请输入开户名称"/>
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
            <!-- <view class="bottom">	
                <u-button 
                    type="warning" 
                    @click="submitForm('dataForm')"
                >
                    提交资料
                </u-button>
		    </view>	 -->
        </view>	
        <u-toast ref="uToast" />
	</view>
</template>
<script>
    // https://pay.weixin.qq.com/wiki/doc/apiv3_partner/apis/chapter11_1_1.shtml
    import { parseTime, OCR, RouteParams } from '@/utils'
    import { mapState } from 'vuex'
    import uniCombox from '@/components/uni-combox/uni-combox.vue'
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
                bankChannelNoName: '',
                showBankChannel: false,
                bankChannelList: [
					{
						value: '102100000021',
						label: '中国工商银行股份有限公司北京通州支行新华分理处'
					},
					{
						value: '102100000030',
						label: '中国工商银行股份有限公司北京市分行营业部'
					},
					{
						value: '102100000048',
						label: '中国工商银行股份有限公司北京东铁匠营支行'
					},
					{
						value: '102100000056',
						label: '中国工商银行股份有限公司北京崇文门外大街支行'
					},
					{
						value: '102100000064',
						label: '中国工商银行股份有限公司北京樱桃园支行'
					},
					{
						value: '102100000072',
						label: '中国工商银行股份有限公司北京王府井金街支行'
					},
					{
						value: '102100000089',
						label: '中国工商银行股份有限公司北京南苑支行'
					},
					{
						value: '102100000097',
						label: '中国工商银行股份有限公司北京南中轴路支行'
					}
				],
                channels: [],
                storageToken:'',
                formData: {
                    // 银行结算资料
                    bankCardPic: '',    // 银行卡照片
                    bankAccountType: '', // 账户类型[对公银行账户、经营者个人银行卡]
                    bankAccountBank: '', // 开户银行
                    bankChannelNo: '',  // 银行通道编号
                    bankAccountNo: '',     // 银行账号
                    bankAccountName: ''   // 开户名称
                },
                
                rules: {
                    bankCardPic: [
                        { required: true, message: '请上传银行卡照片', trigger: 'blur' },
                    ],
                    bankAccountType: [
                        { required: true, message: '请选择银行账户类型', trigger: 'blur' },
                    ],
                    bankChannelNo: [
                        { required: false, message: '请选择银行通道编号', trigger: 'blur' },
                    ],
                    bankAccountNo: [
                        { required: true, message: '请输入银行账号', trigger: 'blur' },
                    ],
                    bankAccountName: [
                        { required: true, message: '请输入开户名称', trigger: 'blur' },
                    ],
                    bankAccountBank: [
                        { required: true, message: '请输入开户银行', trigger: 'blur' },
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
        onShow() {
			this.item = RouteParams()
            this.item.formData = JSON.parse(this.item.formData)
            this.formData = {...this.item.formData, ...this.formData}
            console.log(this.formData);
		},
		methods: {
            initFormData() {
                this.formData = {
                    // 银行结算资料
                    bankCardPic: '',    // 银行卡照片
                    bankAccountType: '', // 账户类型[对公银行账户、经营者个人银行卡]
                    bankAccountBank: '', // 开户银行
                    bankChannelNo: '',  // 银行通道编号
                    bankAccountNo: '',     // 银行账号
                    bankAccountName: ''   // 开户名称
                }
            },
            initStorageToken() {
                this.$u.api.v3.storage.file.GetUploadToken().then(res => {
                    // if (res.token.type == 'qiniu') {
                    //     this.storageToken = res.token
                    // }
                    this.storageToken = res.token
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
                this.formData.bankChannelNo = region[2].code
            },
            // 银行通道编号下拉框
            confirmBankChannelNo(e) {
                this.showBankChannel = !this.showBankChannel
				console.log(e);
                this.bankChannelNoName = e[0].label
                this.formData.bankChannelNo = e[0].value
			},
            // OCR识别
            selectBankCardCopy(e) {
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
                            this.formData.bankCardPic = path
                           //获取图片地址并识别图片信息
                           this.$u.api.v3.storage.file.GetUploadImage({
                                provider: 'qiniu',
                                key: path
                            }).then(res => {
                                console.log(res)
                                this.$u.api.v3.storage.file.BankCardOCR({
                                    imageBase64: '',
                                    imageUrl: res.url,
                                }).then(res => {
                                    console.log('res')
                                    console.log(res)
                                    this.formData.bankAccountBank = res.bankInfo
                                    this.formData.bankAccountNo = res.cardNo

                                }).catch(err => {
                                    uni.showToast({
                                        duration: 3000,
                                        icon:'error',
                                        title: "银行卡识别失败:"+err,
                                    })
                                })
                            }).catch(err => {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'error',
                                    title: "银行卡识别失败:"+err,
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
                    }
                })
            },
            // selectBankCardCopy(e){
            //     console.log(e.tempFilePaths[0])
            //     OCR(e.tempFilePaths[0],'bankcard').then(res => {     
            //         console.log(res) 
            //         if (res.bankcard) {
            //             // this.formData.bankAccountBank = res.bankcard.number
            //             this.formData.bankAccountNo = res.bankcard.number
            //         } else {
            //             uni.showToast({
            //                 duration: 3000,
            //                 icon:'error',
            //                 title: "银行卡识别失败",
            //             })
            //             return
            //         }
            //     }).catch(err => {
            //         uni.showToast({
            //             duration: 3000,
            //             icon:'error',
            //             title: "银行卡识别失败:"+err,
            //         })
            //         return
            //     })
            //     this.select(e, 'bankCardPic')
            // },
            // // 获取上传状态
			// select(e,type){
            //     if (e.tempFiles[0].size > 1024 * 1024) {
            //         uni.showToast({
            //             duration: 3000,
            //             icon:'error',
            //             title:'图片大小超过1M',
            //         })
            //         return;
            //     }
            //     const path = 'apply/'+this.formData.businessCode+"/"+e.tempFiles[0].cloudPath
            //     const filePath =  e.tempFilePaths[0]
            //     uni.uploadFile({
            //         url: 'https://upload.qiniup.com/', 
            //         filePath: filePath,
            //         name: 'file',
            //         formData: {
            //             'token': this.storageToken,
            //             'key': path
            //         },
            //         success: (uploadFileRes) => {
            //             console.log(uploadFileRes);
            //             if (uploadFileRes.statusCode===200) {
            //                 this.formData[type] = path
            //                 uni.showToast({
            //                     duration: 3000,
            //                     icon:'success',
            //                     title:'上传成功',
            //                 })
            //             }else{
            //                 uni.showToast({
            //                     duration: 3000,
            //                     icon:'error',
            //                     title:'上传失败',
            //                 })
            //             }
            //         }
            //     })
			// },
            nextPage(formName) {
                console.log(this.formData);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$u.route({
                            type: 'to',
                            url: 'subPackages/institution/apply/index4',
                            params: { formData: JSON.stringify(this.formData) }
                        })
                    }
                })
               
            },
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