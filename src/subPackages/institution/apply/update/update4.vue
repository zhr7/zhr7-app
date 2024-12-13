<template>
	<view>
        <view v-if="userId">
		<view class="item">
            <u-steps :list="numList" :current="3" mode="number"></u-steps>
            <u-form :model="formData" ref="dataForm" label-width="250">
                <u-form-item label="门店简称" prop="storeShortName">
                    <u-input v-model="formData.storeShortName" placeholder="请输入门店简称"/>
                </u-form-item>
                <u-form-item label="门店商户名称" prop="storeBusinessName">
                    <u-input v-model="formData.storeBusinessName" placeholder="请输入门店商户名称"/>
                </u-form-item>
                <u-form-item label="门店联系人" prop="storePerson">
                    <u-input v-model="formData.storePerson" placeholder="请输入门店联系人"/>
                </u-form-item>
                <u-form-item label="门店电话" prop="storePhone">
                    <u-input v-model="formData.storePhone" placeholder="请输入门店电话"/>
                </u-form-item>
                <u-form-item label="门店邮箱" prop="storeEmail">
                    <u-input v-model="formData.storeEmail" placeholder="请输入门店邮箱"/>
                </u-form-item>
                <u-form-item label="门店地址" prop="storeAddress">
                    <u-input v-model="formData.storeAddress" placeholder="请输入门店地址"/>
                </u-form-item>
                <u-form-item label="微信经营类目" prop="wechatCategoryCode">
                    <u-input v-model="wechatCategoryCodeName" disabled  placeholder="请选择微信经营类目" @click="showWechat = !showWechat"/>
                    <u-select v-model="showWechat" mode="mutil-column-auto" :list="wechatMerchantCategories" @confirm="confirmWechatCategoryCode"></u-select>
                </u-form-item>
                <u-form-item label="MCC类目" prop="mccCategoryCode">
					<u-input v-model="mccCategoryCodeName" disabled  placeholder="请选择MCC类目" @click="showMcc = !showMcc"/>
                    <u-select v-model="showMcc" mode="mutil-column-auto" :list="mccCategoryCodes" @confirm="confirmMccCategoryCode"></u-select>
                </u-form-item>
                <u-form-item label="门店门头照片" prop="storeEntrancePic">
                    <!-- <u-image width="100%" height="300rpx" :src="imgUrl.storeEntrancePic" v-if="reUploadEntrancePic"></u-image> -->
                    <uni-file-picker v-model="valueEntrance"
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="selectStoreEntrancePic" 
                    />
                </u-form-item>
                <u-form-item label="店内环境照片" prop="storeIndoorPic">
                    <!-- <u-image width="100%" height="300rpx" :src="imgUrl.storeIndoorPic" v-if="reUploadIndoorPic"></u-image> -->
                    <uni-file-picker v-model="valueIndoor"
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="selectStoreIndoorPic" 
                    />
                </u-form-item>
                <u-form-item label="前台照片" prop="storeFrontDeskPic">
                    <!-- <u-image width="100%" height="300rpx" :src="imgUrl.storeFrontDeskPic" v-if="reUploadFrontDeskPic"></u-image> -->
                    <uni-file-picker v-model="valueFrontDesk"
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="selectStoreFrontDeskPic" 
                    />
                </u-form-item>
                <u-form-item label="快捷填写信息">
                    <u-switch v-model="checked" @change="quickFill"></u-switch>
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
    <view v-if="!userId">
        <u-form-item> 页面开发中，敬请期待</u-form-item>
    </view>
    </view>
</template>
<script>
    // https://pay.weixin.qq.com/wiki/doc/apiv3_partner/apis/chapter11_1_1.shtml
    import { parseTime, OCR, RouteParams } from '@/utils'
    import { mapState, mapGetters } from 'vuex'
    import mccCategoryCodes from '@/subPackages/institution/assets/json/mccCategoryCodesSetting.json'
    import wechatMerchantCategories from '@/subPackages/institution/assets/json/wechatMerchantCategoriesSetting.json'
	export default {
		data() {
			return {
                valueIndoor: [],
                valueFrontDesk: [],
                valueEntrance: [],
                reUploadEntrancePic: true,
                reUploadFrontDeskPic: true,
                reUploadIndoorPic: true,
                hasShow: true,
                imgUrl:{},
                checked: true,
                numList: [{
					name: '主体信息'
				}, {
					name: '法人信息'
				}, {
					name: '结算信息'
				}, {
					name: '门店信息'
				}, ],
                wechatCategoryCodeName: '',
                mccCategoryCodeName: '',
                showWechat: false,
                showMcc: false,
                mccCategoryCodes: mccCategoryCodes,
                wechatMerchantCategories: wechatMerchantCategories,
                channels: [],
                storageToken:'',
                formData: {
                    // 门店资料
                    storeShortName: '', // 门店简称
                    storeBusinessName: '', // 门店商户名称
                    storePerson: '',    // 门店联系人
                    storePhone: '',    // 门店电话
                    storeEmail: '',    // 门店邮箱
                    storeAddress: '',    // 门店地址
                    wechatCategoryCode: '',  // 微信经营类目
                    mccCategoryCode: '',  // MCC类目
                    storeEntrancePic: '',  // 门店门头照片
                    storeIndoorPic: '',  // 店内环境照片
                    storeFrontDeskPic: '',  // 前台照片
                },
                rules: {
                    storeShortName: [
                        {
                            required: true,
                            message: '请输入门店简称',
                            trigger: ['blur', 'change']
                        },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    storeBusinessName: [
                        {
                            required: true,
                            message: '请输入门店商户名称',
                            trigger: ['blur', 'change']
                        },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    storePerson: [
                        {
                            required: true,
                            message: '请输入门店联系人',
                            trigger: ['blur', 'change']
                        },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    storePhone: [
                        {
                            required: true,
                            message: '请输入门店电话',
                            trigger: ['blur', 'change']
                        },
                        {
                            required: true,
                            validator: (rule, value, callback) => {
                                if (value === undefined) {
                                callback('请输入门店电话')
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
                    storeEmail: [
                        {
                            required: true,
                            message: '请输入门店邮箱',
                            trigger: ['blur', 'change']
                        },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    storeAddress: [
                        {
                            required: true,
                            message: '请输入门店地址',
                            trigger: ['blur', 'change']
                        },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    // wechatCategoryCode: [
                    //     {
                    //         required: false,
                    //         message: '请选择微信经营类目',
                    //         trigger: ['blur', 'change']
                    //     }
                    // ],
                    // mccCategoryCode: [
                    //     {
                    //         required: false,
                    //         message: '请选择MCC类目',
                    //         trigger: ['blur', 'change']
                    //     }
                    // ],
                    storeEntrancePic: [
                        {
                            required: true,
                            message: '请上传门店门头照片',
                            trigger: ['blur', 'change']
                        }
                    ],
                    storeIndoorPic: [
                        {
                            required: true,
                            message: '请上传店内环境照片',
                            trigger: ['blur', 'change']
                        }
                    ],
                    storeFrontDeskPic: [
                        {
                            required: true,
                            message: '请上传前台照片',
                            trigger: ['blur', 'change']
                        }
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
            this.formData = this.item
            const arr1 = JSON.parse(this.item.mccCategoryCode)
            const arr2 = JSON.parse(this.item.wechatCategoryCode)
            const mcc = this.findLabelByValue(this.mccCategoryCodes, arr1[2])
            const wechat = this.findLabelByValue(this.wechatMerchantCategories, arr2[3])
            arr1.pop()
            arr2.pop()
            arr1.push(mcc)
            arr2.push(wechat)
            this.mccCategoryCodeName = arr1.join(' / ')
            this.wechatCategoryCodeName = arr2.join(' / ')
            if(this.hasShow){
                this.hasShow = false
                this.getUploadImage(this.formData.storeEntrancePic, 'storeEntrancePic')
                this.getUploadImage(this.formData.storeIndoorPic, 'storeIndoorPic')
                this.getUploadImage(this.formData.storeFrontDeskPic, 'storeFrontDeskPic')
                // console.log(this.hasShow)
            } 
		},
        onload() {
        },
		methods: {
            async getUploadImage(path,name) {
                try {
                    const res = await this.$u.api.v3.storage.file.GetUploadImage({
                        provider: 'qiniu',
                        key: path,
                    });
                    this.imgUrl[name] = res.url
                    let value1 = []
                    value1.push(res)
                    if(name == 'storeEntrancePic'){
                        this.valueEntrance = value1
                    }else if(name == 'storeIndoorPic'){
                        this.valueIndoor = value1
                    }else if(name == 'storeFrontDeskPic'){
                        this.valueFrontDesk = value1
                    }
                } catch (err) {
                    console.log(err);
                    uni.showToast({
                        duration: 3000,
                        icon: 'error',
                        title: err.data,
                    });
                }
            },
            findLabelByValue(data, value) {
                for (let item of data) {
                    if (item.value === value) {
                        return item.label;
                    }
                    if (item.children && item.children.length > 0) {
                        const result = this.findLabelByValue(item.children, value);
                        if (result) {
                            return result;
                        }
                    }
                }
                return null;
            },
            quickFill(){
                if(this.checked){
                    if(this.formData.licenseSubjectType == 'SUBJECT_TYPE_ENTERPRISE'||this.formData.licenseSubjectType == 'SUBJECT_TYPE_INDIVIDUAL'||this.formData.licenseSubjectType == 'SUBJECT_TYPE_STOCK_COMPANY'){
                        this.formData.storeShortName = this.formData.licenseMerchantName
                        this.formData.storeBusinessName = this.formData.licenseMerchantName
                        this.formData.storePerson = this.formData.legalPerson
                        this.formData.storeAddress = this.formData.licenseAddress
                        this.formData.storePhone = this.formData.legalPersonPhone
                        this.formData.storeEmail = this.formData.legalPersonPhone+'@qq.com'
                    }else {
                        this.formData.storePerson = this.formData.legalPerson
                        this.formData.storePhone = this.formData.legalPersonPhone
                        this.formData.storeEmail = this.formData.legalPersonPhone+'@qq.com'
                    }
                }else {
                        this.formData.storeShortName = ''
                        this.formData.storeBusinessName = ''
                        this.formData.storePerson = ''
                        this.formData.storeAddress = ''
                        this.formData.storePhone = ''
                        this.formData.storeEmail = ''
                }
                
            },
            initFormData() {
                this.formData = {
                     // 门店资料
                     storeShortName: '', // 门店简称
                    storeBusinessName: '', // 门店商户名称
                    storePerson: '',    // 门店联系人
                    storePhone: '',    // 门店电话
                    storeEmail: '',    // 门店邮箱
                    storeAddress: '',    // 门店地址
                    wechatCategoryCode: '',  // 微信经营类目
                    mccCategoryCode: '',  // MCC类目
                    storeEntrancePic: '',  // 门店门头照片
                    storeIndoorPic: '',  // 店内环境照片
                    storeFrontDeskPic: '',  // 前台照片
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
                        duration: 3000,
                        icon:'error',
                        title: "获取上传凭证失败:"+ err.datal,
                    })
                })
            },
            // 获取选择的地区
            handleGetRegion(region){
                this.formData.bankAddressCode = region[2].code
            },
            selectStoreEntrancePic(e){
                this.select(e, 'storeEntrancePic')
                // if (e.tempFiles[0].size > 1024 * 1024) {
                //     uni.showToast({
                //         duration: 3000,
                //         icon:'error',
                //         title:'图片大小超过1M',
                //     })
                //     return;
                // }
                // const path = 'apply/'+this.formData.businessCode+'/'+e.tempFiles[0].cloudPath
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
                //             this.formData.storeEntrancePic = path
                //             this.$u.api.v3.storage.file.GetUploadImage({
                //                 provider: 'qiniu',
                //                 key: path
                //             }).then(res => {
                //                 this.imgUrl.storeEntrancePic = res.url
                //             }).catch(err => {
                //                 uni.showToast({
                //                     duration: 3000,
                //                     icon:'error',
                //                     title: err,
                //                 })
                //             })
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
                //     },
                //     fail: (err) => {
                //         console.log(err.errMsg);
                //         uni.showToast({
                //             duration: 3000,
                //             icon:'error',
                //             title:'上传失败'+err.errMsg,
                //         })
                // }
                // })
            },
            selectStoreIndoorPic(e){
                this.select(e, 'storeIndoorPic')
                // if (e.tempFiles[0].size > 1024 * 1024) {
                //     uni.showToast({
                //         duration: 3000,
                //         icon:'error',
                //         title:'图片大小超过1M',
                //     })
                //     return;
                // }
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
                //             this.formData.storeIndoorPic = path
                //             //获取图片地址
                //             this.$u.api.v3.storage.file.GetUploadImage({
                //                 provider: 'qiniu',
                //                 key: path
                //             }).then(res => {
                //                 this.imgUrl.storeIndoorPic = res.url    
                //                 uni.showToast({
                //                     duration: 3000,
                //                     icon:'success',
                //                     title:'上传成功'
                //                 })
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
                //             title:'上传失败'+err.errMsg
                //         })
                //     }
                // })
            },
            selectStoreFrontDeskPic(e){
                this.select(e, 'storeFrontDeskPic')
            },
            // 获取上传状态
			select(e,type){
                if (e.tempFiles[0].size > 1024 * 1024) {
                    uni.showToast({
                        duration: 3000,
                        icon:'error',
                        title:'图片大小超过1M',
                    })
                    return;
                }
                const path = 'apply/'+this.formData.businessCode+'/'+e.tempFiles[0].cloudPath
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
                            this.$u.api.v3.storage.file.GetUploadImage({
                                provider: 'qiniu',
                                key: path
                            }).then(res => {
                                this.imgUrl[type] = res.url
                                if(type==='storeFrontDeskPic'){
                                    this.reUploadFrontDeskPic = false
                                }else if(type==='storeIndoorPic'){
                                    this.reUploadIndoorPic = false
                                }else if(type==='storeEntrancePic'){
                                    this.reUploadEntrancePic = false
                                }
                            }).catch(err => {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'error',
                                    title: err,
                                })
                            })
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
            confirmWechatCategoryCode(e) {
                this.showWechat = !this.showWechat
				console.log(e);
                const newArr = e.map(item => item.value);
                this.wechatCategoryCodeName = e[3].label
                this.formData.wechatCategoryCode = JSON.stringify(newArr)
			},
            confirmMccCategoryCode(e) {
                // console.log(e);
                this.showMcc = !this.showMcc
                const newArr = e.map(item => item.value);
                this.mccCategoryCodeName = e[2].label
                this.formData.mccCategoryCode = JSON.stringify(newArr)
            },
            submitForm(formName) {
                // console.log(this.formData);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$u.api.v3.institution.apply.Update(this.formData).then(res => {
                            if (res.valid) {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'success',
                                    title:'编辑成功',
                                })
                                setTimeout(() => {
                                    this.$u.route({
                                        type: 'to',
                                        url: 'subPackages/institution/apply/list',
                                    });
                                }, 3000);
                            } else {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'error',
                                    title:'编辑失败',
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