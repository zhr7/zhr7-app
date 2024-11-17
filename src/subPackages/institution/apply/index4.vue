<template>
	<view>
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
                    <uni-file-picker 
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="selectStoreEntrancePic" 
                    />
                </u-form-item>
                <u-form-item label="店内环境照片" prop="storeIndoorPic">
                    <uni-file-picker 
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="selectStoreIndoorPic" 
                    />
                </u-form-item>
                <u-form-item label="前台照片" prop="storeFrontDeskPic">
                    <uni-file-picker 
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="selectStoreFrontDeskPic" 
                    />
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
    import { parseTime, OCR, RouteParams } from '@/utils'
    import { mapState } from 'vuex'
    import uniCombox from '@/components/uni-combox/uni-combox.vue'
    import mccCategoryCodes from '@/subPackages/institution/assets/json/mccCategoryCodesSetting.json'
    import wechatMerchantCategories from '@/subPackages/institution/assets/json/wechatMerchantCategoriesSetting.json'
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
                },
                rules: {
                    storeShortName: [
                        {
                            required: true,
                            message: '请输入门店简称',
                            trigger: ['blur', 'change']
                        },
                        { min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }
                    ],
                    storeBusinessName: [
                        {
                            required: true,
                            message: '请输入门店商户名称',
                            trigger: ['blur', 'change']
                        }
                    ],
                    storePerson: [
                        {
                            required: true,
                            message: '请输入门店联系人',
                            trigger: ['blur', 'change']
                        }
                    ],
                    storePhone: [
                        {
                            required: true,
                            message: '请输入门店电话',
                            trigger: ['blur', 'change']
                        }
                    ],
                    storeEmail: [
                        {
                            required: true,
                            message: '请输入门店邮箱',
                            trigger: ['blur', 'change']
                        }
                    ],
                    storeAddress: [
                        {
                            required: true,
                            message: '请输入门店地址',
                            trigger: ['blur', 'change']
                        }
                    ],
                    wechatCategoryCode: [
                        {
                            required: false,
                            message: '请选择微信经营类目',
                            trigger: ['blur', 'change']
                        }
                    ],
                    mccCategoryCode: [
                        {
                            required: false,
                            message: '请选择MCC类目',
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
            try {
                this.item.formData = JSON.parse(this.item.formData)
                this.formData = {...this.item.formData, ...this.formData}
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
            console.log(this.formData);
		},
		methods: {
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
            },
            selectStoreIndoorPic(e){
                this.select(e, 'storeIndoorPic')
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
                    console.log(err);
                    uni.showToast({
                        duration: 3000,
                        icon:'error',
                        title:'上传失败'+err,
                    })
                }
                })
			},
            confirmWechatCategoryCode(e) {
                this.showWechat = !this.showWechat
				console.log(e[3].value);
                this.wechatCategoryCodeName = e[3].label
                this.formData.wechatCategoryCode = e[3].value.toString()
			},
            confirmMccCategoryCode(e) {
                console.log(e[2].value);
                this.showMcc = !this.showMcc
                this.mccCategoryCodeName = e[2].label
                this.formData.mccCategoryCode = e[2].value
            },
            submitForm(formName) {
                console.log(this.formData);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$u.api.v3.institution.apply.Create(this.formData).then(res => {
                    if (res.valid) {
                        this.initFormData()
                        // this.$u.route({
                        //     type: 'to',
                        //     url: 'subPackages/institution/apply/index',
                        // })
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
               

                // this.$refs[formName].validate((valid) => {
                //     if (valid) {
                //         this.$u.api.v3.institution.apply.Create({
                //             apply: this.formData
                //         }).then(res => {
                //             if (res.valid) {
                //                 this.initFormData()
                //                 uni.showToast({
                //                     duration: 5000,
                //                     icon:'success',
                //                     title:'进件成功',
                //                 })
                //             } else {
                //                 uni.showToast({
                //                     duration: 3000,
                //                     icon:'error',
                //                     title:'进件失败',
                //                 })
                //             }
                //         }).catch(err => {
                //             console.log(err);
                //             uni.showToast({
                //                 duration: 3000,
                //                 icon:'error',
                //                 title: err.datal,
                //             })
                //         })
                //     }
                // })
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