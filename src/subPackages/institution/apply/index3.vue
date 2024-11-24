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
						<u-radio key="CORPORATE" name="corporate">对公银行账户</u-radio>
						<u-radio key="PERSONAL" name="personal">个人银行卡</u-radio>
					</u-radio-group>
                </u-form-item>
                <u-form-item label="开户银行" prop="bankAccountBank">
                    <u-input v-model="formData.bankAccountBank" placeholder="请输入开户银行"/>
                </u-form-item>
                <u-form-item label="银行通道编号" prop="bankChannelNo"> 
                    <u-input v-model="searchKeyword" @input="filterOptions" placeholder="请输入关键字搜索"/>
                    <u-select v-model="showSelect" :list="filteredOptions" @confirm="confirmOption" ></u-select>
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
    <view v-if="!userId">
        <u-form-item> 页面开发中，敬请期待</u-form-item>
    </view>
    </view>
</template>
<script>
    // https://pay.weixin.qq.com/wiki/doc/apiv3_partner/apis/chapter11_1_1.shtml
    import { parseTime, OCR, RouteParams } from '@/utils'
    import { mapState, mapGetters } from 'vuex'
	export default {
		data() {
			return {
                //银行通道编号下拉框
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
            // console.log(this.formData);
		},
		methods: {
            //银行通道编号
            filterOptions() {
                if (this.searchKeyword.length === 0) {
                    // 如果搜索关键字为空，清空过滤后的选项
                    this.filteredOptions = this.options.map(item => {
                        return {
                            value: item.bankCode,
                            label: item.bankName
                        };
                    })
                    this.showSelect = false; // 隐藏下拉框
                    return;
                }
                const keyword = this.searchKeyword.toLowerCase();
                this.filteredOptions = this.options.filter(item => {
                    return item.bankName.toLowerCase().includes(keyword);
                });
                this.filteredOptions = this.filteredOptions.map(item => {
                    return {
                        value: item.bankCode,
                        label: item.bankName
                    };
                })
                // console.log(this.filteredOptions);
                this.showSelect = true; // 显示下拉框
            },
            confirmOption(e) {
                // 处理选中的值
                // console.log(e[0]);
                this.showSelect = false; // 隐藏下拉框
                this.searchKeyword = e[0].label;
                //将e[0].value赋值给银行通道编号字段
                this.formData.bankChannelNo = e[0].value;
            },
            // bankFocus(){
            //     let bankName = this.formData.bankAccountBank.match(/^.*行/);
            //     if (!bankName) {
            //         bankName = this.formData.bankAccountBank.match(/^.*信用社/);
            //     }
            //     this.params.filter = `{"$or":[{"bankName":{"$regex":"${bankName}","$options":"i"}},{"bankCode":{"$regex":"${bankName}","$options":"i"}}]}`;
            //     this.searchBankInfo();
            //     this.filteredOptions = this.options.map(item => {
            //         return {
            //             value: item.bankCode,
            //             label: item.bankName
            //         };
            //     })
            //     this.showSelect = true; // 显示下拉框
            // },
            searchBankInfo() {
                // 根据银行名称查询银行信息
                let bankName = this.formData.bankAccountBank.match(/^.*行/);
                // console.log(bankName);
                if (!bankName) {
                    bankName = formModel.bankAccountBank.match(/^.*信用社/);
                }
                
                this.params.filter = `{"$or":[{"bankName":{"$regex":"${bankName}","$options":"i"}},{"bankCode":{"$regex":"${bankName}","$options":"i"}}]}`;

                this.$u.api.v3.institution.apply.SearchBankInfo(this.params).then(res => {
                    // console.log('res');
                    // console.log(res.items);
                    this.options = res.items;
                });
            },
            // filterOptions() {
            //     console.log('过滤选项');
            //     const keyword = this.searchKeyword.toLowerCase();
            //     this.filteredOptions = this.bankChannelList.filter(item => {
            //         return item.label.toLowerCase().includes(keyword);
            //     });
            //     this.showSelect = true; // 显示下拉框
            // },
            // confirmOption() {
            // // 处理选中的值
            // console.log(this.selectedOption);
            // this.showSelect = false; // 隐藏下拉框
            // },
            // // 银行通道编号下拉框
            // confirmBankChannelNo(e) {
            //     console.log('111');
            //     this.showBankChannel = !this.showBankChannel
			// 	// console.log(e);
            //     // this.bankChannelNoName = e[0].label
            //     // this.formData.bankChannelNo = e[0].value

            //     const keyword = this.bankChannelNoName.toLowerCase();
            //     this.filteredBankChannelList = this.bankChannelList.filter(item => {
            //         return item.label.toLowerCase().includes(keyword);
            //     });
			// },

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
            // filterBankChannelList() {
            //     const keyword = this.bankChannelNoName.toLowerCase();
            //     this.filteredBankChannelList = this.bankChannelList.filter(item => {
            //         return item.label.toLowerCase().includes(keyword);
            //     });
            //     this.bankChannelList = this.filteredBankChannelList;
            // },
            
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
                                    if(this.formData.bankAccountBank){
                                        this.searchBankInfo(); // 初始化时获取银行信息
                                    }

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
                    },
                    fail: (err) => {
                    console.log(err.errMsg);
                    uni.showToast({
                        duration: 3000,
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