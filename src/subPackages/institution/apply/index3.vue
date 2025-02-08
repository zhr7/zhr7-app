<template>
	<view>
        <view v-if="userId">
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
						<u-radio key="CORPORATE" name="CORPORATE">对公银行账户</u-radio>
						<u-radio key="PERSONAL" name="PERSONAL">个人银行卡</u-radio>
					</u-radio-group>
                </u-form-item>
                <u-form-item label="开户银行" prop="bankAccountBank">
                    <u-input v-model="formData.bankAccountBank" placeholder="请输入开户银行"/>
                </u-form-item>
                <u-form-item label="开户支行" prop="bankChannelNo"> 
                    <u-input v-model="searchKeyword" @input="filterOptions" @focus="focusInputBankInfo" placeholder="请输入关键字搜索"/>
                    <u-select v-model="showSelect" :list="filteredOptions" @confirm="confirmOption" ></u-select>
                </u-form-item>
                <u-form-item label="银行账号" prop="bankAccountNo">
                    <u-input v-model="formData.bankAccountNo" placeholder="请输入银行账号"/>
                </u-form-item>
                <u-form-item label="账户户名" prop="bankAccountName">
                    <u-input v-model="formData.bankAccountName" placeholder="请输入账户户名"/>
                </u-form-item>
                <u-form-item label="支行地址" prop="bankDistrictCode" v-if="formData.bankAccountType === 'CORPORATE'">
                    <pick-regions :defaultRegion="formData.bankDistrictCode" @getRegion="handleGetRegion"/>
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
    import { parseTime, OCR, RouteParams } from '@/utils'
    import { mapState, mapGetters } from 'vuex'
	import pickRegions from '@/subPackages/institution/components/pick-regions/pick-regions.vue'

	export default {
        components: { 
			pickRegions
		},
		data() {
			return {
                //开户支行下拉框
                searchKeyword: '',
                options: [], 
                filteredOptions: [],
                selectedOption: null,
                showSelect: false,
                params: {filter: '',},
    

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
                formData: {
                    // 银行结算资料
                    bankCardPic: '',    // 银行卡照片
                    bankAccountType: '', // 账户类型[对公银行账户、经营者个人银行卡]
                    bankAccountBank: '', // 开户银行
                    bankChannelNo: '',  // 开户支行
                    bankAccountNo: '',     // 银行账号
                    bankAccountName: '',   // 账户户名
                    bankDistrictCode: '',   // 支行地址
                    bankCityCode: '', 
                    bankProvinceCode: '',
                    tempConfig: {}, // 临时配置
                },
                
                rules: {
                    bankCardPic: [
                        { required: true, message: '请上传银行卡照片', trigger: 'blur' },
                    ],
                    bankAccountType: [
                        { required: true, message: '请选择银行账户类型', trigger: 'blur' },
                    ],
                    bankChannelNo: [
                        { required: false, message: '请选择开户支行', trigger: 'blur' },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    bankAccountNo: [
                        { required: true, message: '请输入银行账号', trigger: 'blur' },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    bankAccountName: [
                        { required: true, message: '请输入账户户名', trigger: 'blur' },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    bankAccountBank: [
                        { required: true, message: '请输入开户银行', trigger: 'blur' },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    bankDistrictCode: [
                        { required: true, message: '请选择支行地址', trigger: 'blur' },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
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
            console.log(this.item)
			this.item = RouteParams()
            this.item.formData = JSON.parse(this.item.formData)
            this.formData = {...this.item.formData, ...this.formData}
            console.log(this.formData)
		},
		methods: {
            //开户支行
            async searchBankInfo(value) {
                let bankName = this.formData.bankAccountBank.match(/^.*行/);
                if (!bankName) {
                    bankName = this.formData.bankAccountBank.match(/^.*信用社/);
                }
                let regexNmae1 = '';
                let regexName2 = '';
                if (bankName) {
                    regexNmae1 = `.*${value}.*${bankName}.*`;
                    regexName2 = `.*${bankName}.*${value}.*`;
                    this.params.filter = `{"$or":[{"bankName":{"$regex":"${regexNmae1}","$options":"i"}},{"bankName":{"$regex":"${regexName2}","$options":"i"}},{"bankCode":{"$regex":"${value}","$options":"i"}}]}`;
                } else {
                    this.params.filter = `{"$or":[{"bankName":{"$regex":"${value}","$options":"i"}},{"bankCode":{"$regex":"${value}","$options":"i"}}]}`;
                }
                try {
                    const res = await this.$u.api.v3.institution.apply.SearchBankInfo(this.params);
                    this.options = res.items;
                    this.filteredOptions = [];
                    this.filteredOptions = this.options.map(item => ({
                        value: item.bankCode,
                        label: item.bankName
                    }));
                } catch (err) {
                    console.log(err);
                        uni.showToast({
                        duration: 10000,
                        icon:'error',
                        title: "获取银行信息失败",
                    });
                }
            },
            async filterOptions() {
                if (this.searchKeyword.length === 0) {
                    this.showSelect = false; // 隐藏下拉框
                }
                const keyword = this.searchKeyword.toLowerCase();
                await this.searchBankInfo(keyword);
                this.showSelect = true; // 显示下拉框
                
            },
            async focusInputBankInfo() {
                let bankName = this.formData.bankAccountBank.match(/^.*行/);
                if (!bankName) {
                    bankName = this.formData.bankAccountBank.match(/^.*信用社/);
                }
                this.params.filter = `{"$or":[{"bankName":{"$regex":"${bankName}","$options":"i"}},{"bankCode":{"$regex":"${bankName}","$options":"i"}}]}`;
                try {
                    const res = await this.$u.api.v3.institution.apply.SearchBankInfo(this.params);
                    this.options = res.items;
                    this.filteredOptions = [];
                    this.filteredOptions = this.options.map(item => ({
                        value: item.bankCode,
                        label: item.bankName
                    }));
                } catch (err) {
                    console.log(err);
                    uni.showToast({
                        duration: 10000,
                        icon:'error',
                        title: "获取银行信息失败",
                    });
                }
            },
            confirmOption(e) {
                // 处理选中的值
                this.showSelect = false; // 隐藏下拉框
                this.searchKeyword = e[0].label;
                this.formData.bankChannelNo = e[0].value; //将e[0].value赋值给开户支行字段
            },
            
            initFormData() {
                this.formData = {
                    // 银行结算资料
                    bankCardPic: '',    // 银行卡照片
                    bankAccountType: '', // 账户类型[对公银行账户、经营者个人银行卡]
                    bankAccountBank: '', // 开户银行
                    bankChannelNo: '',  // 开户支行
                    bankAccountNo: '',     // 银行账号
                    bankAccountName: '',   // 账户户名
                    bankDistrictCode: '', // 支行地址
                    bankCityCode: '', 
                    bankProvinceCode: '',

                    tempConfig: {}, // 临时配置
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
                        duration: 10000,
                        icon:'error',
                        title: "获取上传凭证失败:"+ err.datal,
                    })
                })
            },
            // 获取选择的地区
            handleGetRegion(region){
                this.formData.bankDistrictCode = region[2].code
                this.formData.bankCityCode = region[1].code
                this.formData.bankProvinceCode = region[0].code
            },
            // OCR识别
            selectBankCardCopy(e) {
                console.log(e);
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
                            this.formData.bankCardPic = path
                           //获取图片地址并识别图片信息
                           this.$u.api.v3.storage.file.GetUploadImage({
                                provider: 'qiniu',
                                key: path
                            }).then(res => {
                                // console.log(res)
                                this.formData.tempConfig.bankCardPic = res.url
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
                                        duration: 10000,
                                        icon:'error',
                                        title: "银行卡识别失败:"+err,
                                    })
                                })
                            }).catch(err => {
                                uni.showToast({
                                    duration: 10000,
                                    icon:'error',
                                    title: "银行卡识别失败:"+err,
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
                console.log(this.formData)
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