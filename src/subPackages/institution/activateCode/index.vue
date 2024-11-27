<template>
	<view>
		<view class="item">
            <u-form :model="formData" ref="dataForm" label-width="260">
                <u-form-item label="激活付款码ID" prop="operatorId">
                    <u-input v-model="formData.operatorId" placeholder="请输入付款码ID"/>
                </u-form-item>
                <u-form-item label="付款码名称" prop="name">
                    <u-input v-model="formData.name" placeholder="请输入付款码名称"/>
                </u-form-item>
                <u-form-item label="商户存否" prop="SellerExist">
					<u-radio-group v-model="formData.SellerExist">
                        <u-radio key="true" name="true">已存在商户账号</u-radio>
						<u-radio key="false" name="false">无账号创建账号</u-radio>
					</u-radio-group>
                </u-form-item>
                <u-form-item label="平台商家" prop="userId" v-if="formData.SellerExist === 'true'"> 
                    <u-input v-model="searchKeyword" @input="filterOptions" placeholder="请输入关键字搜索"/>
                    <u-select v-model="showSelect" :list="filteredOptions" @confirm="confirmOption" ></u-select>
                </u-form-item>
                <div v-if="formData.SellerExist === 'false'">
                    <u-form-item label="所属品牌商家" prop="brandId"> 
                        <u-input v-model="searchKeyword" @input="filterOptions" placeholder="请输入关键字搜索"/>
                        <u-select v-model="showSelect" :list="filteredOptions" @confirm="confirmOption" ></u-select>
                    </u-form-item>
                    <u-form-item label="所属机构" prop="institutionId"> 
                        <u-input v-model="searchKeyword" @input="filterOptions" placeholder="请输入关键字搜索"/>
                        <u-select v-model="showSelect" :list="filteredOptions" @confirm="confirmOption" ></u-select>
                    </u-form-item>
                    <u-form-item label="绑定软件服务商" prop="providerId"> 
                        <u-input v-model="searchKeyword" @input="filterOptions" placeholder="请输入关键字搜索"/>
                        <u-select v-model="showSelect" :list="filteredOptions" @confirm="confirmOption" ></u-select>
                    </u-form-item>
                    <u-form-item label="账号" prop="username">
                        <u-input v-model="formData.username" placeholder="请输入账号"/>
                    </u-form-item>
                    <u-form-item label="密码" prop="password">
                        <u-input v-model="formData.password" placeholder="请输入密码"/>
                    </u-form-item>
                    <u-form-item label="商家名称" prop="sellerName">
                        <u-input v-model="formData.sellerName" placeholder="请输入商家名称"/>
                    </u-form-item>
                    <u-form-item label="联系手机" prop="mobile">
                        <u-input v-model="formData.mobile" placeholder="请输入手机号"/>
                    </u-form-item>
                    <u-form-item label="地址" prop="addressCode">
                        <pick-regions :defaultRegion="formData.addressCode" @getRegion="handleGetRegion"/>
                    </u-form-item>
                    <u-form-item label="详情地址" prop="address">
                        <u-input v-model="formData.address" placeholder="请输入详细地址"/>
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
    import { parseTime, OCR, RouteParams } from '@/utils'
	export default {
		data() {
			return {
                //平台商家
                searchKeywordSeller: '',
                optionsSeller: [], 
                filteredOptionsSeller: [],
                showSelectSeller: false,
                //所属品牌商家
                searchKeywordBrand: '',
                optionsBrand: [], 
                filteredOptionsBrand: [],
                showSelectBrand: false,
                //所属机构
                searchKeywordInstitution: '',
                optionsInstitution: [], 
                filteredOptionsInstitution: [],
                showSelectInstitution: false,
                //绑定软件服务商
                searchKeywordProvider: '',
                optionsProvider: [], 
                filteredOptionsProvider: [],
                showSelectProvider: false,

                formData: {
                    operatorId: '', // 激活付款码id
                    SellerExist: 'true', // 商户存否 
                    name: '', // 付款码名称
                    userId: '', // 平台商家
                    brandId: '', // 所属品牌商家
                    institutionId: '', // 所属机构
                    providerId: '', // 绑定软件服务商
                    username: '', // 账号
                    password: '', // 密码
                    sellerName: '', // 商家名称
                    mobile: '', // 联系手机
                    addressCode: '', // 地址
                    address: '', // 详情地址
                    
                },
                rules: {
                    operatorId: [
                        { required: true, message: '请输入激活付款码id', trigger: 'blur' },
                        { min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }
                    ],
                    SellerExist: [
                        { required: true, message: '请选择商家存否', trigger: 'blur' },
                    ],
                    name: [
                        { required: true, message: '请输入付款码名称', trigger: 'blur' },
                        { min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }
                    ],
                    userId: [
                        { required: true, message: '请选择平台商家', trigger: 'blur' },
                    ],
                    brandId: [
                        { required: true, message: '请选择品牌商家', trigger: 'blur' },
                    ],
                    institutionId: [
                        { required: true, message: '请选择所属机构', trigger: 'blur' },
                    ],
                    providerId: [
                        { required: true, message: '请选择绑定软件服务商', trigger: 'blur' },
                    ],
                    username: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                        { min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }
                    ],
                    sellerName: [
                        { required: true, message: '请输入商家名称', trigger: 'blur' },
                        { min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },

                    ],
                    address: [
                        { required: true, message: '请填写详细地址', trigger: 'blur' },
                    ],
                    addressCode: [
                        { required: true, message: '请选择地址', trigger: 'blur' },
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
                    operatorId: '', // 激活付款码id
                    SellerExist: 'true', // 商户存否 
                    name: '', // 付款码名称
                    userId: '', // 平台商家
                    brandId: '', // 所属品牌商家
                    institutionId: '', // 所属机构
                    providerId: '', // 绑定软件服务商
                    username: '', // 账号
                    password: '', // 密码
                    sellerName: '', // 商家名称
                    mobile: '', // 联系手机
                    addressCode: '', // 地址
                    address: '', // 详情地址
                }
            },
            initStorageToken() {
                this.$u.api.v3.storage.file.GetUploadToken().then(res => {
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
                this.formData.licenseAddressCode = region[2].code
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
        onShow() {
            this.item = RouteParams()
            this.formData.operatorId = this.item.operatorId
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