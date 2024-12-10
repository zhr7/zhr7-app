<template>
	<view>
        <view v-if="userId">
		<view class="item">
            <u-form :model="formData" ref="dataForm" label-width="260">
                <u-form-item label="激活付款码ID" prop="id">
                    <u-input v-model="formData.id" placeholder="请输入付款码ID"/>
                </u-form-item>
                <!-- <u-form-item label="付款码名称" prop="name"> -->
                <u-form-item label="付款码名称">
                    <u-input v-model="formData.name" placeholder="请输入付款码名称"/>
                </u-form-item>
                <u-form-item label="商户存否">
					<u-radio-group v-model="SellerExist">
                        <u-radio key="true" name="true">已存在商户账号</u-radio>
						<u-radio key="false" name="false">无账号创建账号</u-radio>
					</u-radio-group>
                </u-form-item>
                <u-form-item label="平台商家" prop="userId" v-if="SellerExist === 'true'"> 
                    <u-input v-model="searchKeywordSeller" @input="filterOptionsSeller" placeholder="请输入关键字搜索"/>
                    <u-select v-model="showSelectSeller" :list="filteredOptionsSeller" @confirm="confirmOptionSeller" ></u-select>
                </u-form-item>
                <div v-if="SellerExist === 'false'">
                    <u-form-item label="所属品牌商家" prop="brandId"> 
                        <u-input v-model="searchKeywordBrand" @input="filterOptionsBrand" placeholder="请输入关键字搜索"/>
                        <u-select v-model="showSelectBrand" :list="filteredOptionsBrand" @confirm="confirmOptionBrand" ></u-select>
                    </u-form-item>
                    <u-form-item label="绑定软件服务商" prop="providerId"> 
                        <u-input v-model="searchKeywordProvider" @input="filterOptionsProvider" placeholder="请输入关键字搜索"/>
                        <u-select v-model="showSelectProvider" :list="filteredOptionsProvider" @confirm="confirmOptionProvider" ></u-select>
                    </u-form-item>
                    <u-form-item label="账号" prop="username">
                        <u-input v-model="formData.user.username" placeholder="请输入账号"/>
                    </u-form-item>
                    <u-form-item label="密码" prop="password">
                        <u-input v-model="formData.user.password" placeholder="请输入密码"/>
                    </u-form-item>
                    <u-form-item label="商家名称" prop="name">
                        <u-input v-model="formData.seller.name" placeholder="请输入商家名称"/>
                    </u-form-item>
                    <u-form-item label="联系手机" prop="mobile">
                        <u-input v-model="formData.seller.mobile" placeholder="请输入手机号"/>
                    </u-form-item>
                    <u-form-item label="地址" prop="addressCode">
                        <pick-regions :defaultRegion="formData.seller.addressCode" @getRegion="handleGetRegion"/>
                    </u-form-item>
                    <u-form-item label="详情地址" prop="address">
                        <u-input v-model="formData.seller.address" placeholder="请输入详细地址"/>
                    </u-form-item>
                </div>
            </u-form>
            <u-line />
            <view class="bottom">	
                <u-button 
                    type="warning" 
                    @click="submitForm('dataForm')"
                >
                    激活付款码
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
                //平台商家
                searchKeywordSeller: '',
                optionsSeller: [], 
                filteredOptionsSeller: [],
                showSelectSeller: false,
                listQuery: {
					page: 1,
					pageSize: 15,
					where: '',
					sort: 'ORDER BY created_at DESC, id DESC'
				},
                //所属品牌商家
                searchKeywordBrand: '',
                optionsBrand: [], 
                filteredOptionsBrand: [],
                showSelectBrand: false,
                //绑定软件服务商
                searchKeywordProvider: '',
                optionsProvider: [], 
                filteredOptionsProvider: [],
                showSelectProvider: false,

                
                SellerExist: 'true', // 商户存否
                formData: {
                    // operatorId: '', // 激活付款码id
                    id: '', // 激活付款码id 
                    name: '', // 付款码名称
                    userId: '', // 平台商家
                    user: {
                        username: '', // 账号
                        password: '', // 密码
                    },
                    seller: {
                        username: '', // 账号
                        brandId: '', // 所属品牌商家
                        institutionId: '', // 所属机构
                        providerId: '', // 绑定软件服务商
                        mobile: '', // 联系手机
                        name: '', // 商家名称
                        addressCode: [], // 地址
                        address: '', // 详情地址
                    }
                },
                rules: {
                    id: [
                        { required: true, message: '请输入激活付款码id', trigger: 'blur' },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    SellerExist: [
                        { required: true, message: '请选择商家存否', trigger: 'blur' },
                    ],
                    // name: [
                    //     { required: false, message: '请输入付款码名称', trigger: 'blur' },
                    //     { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    // ],
                    userId: [
                        { required: true, message: '请选择平台商家', trigger: 'blur' },
                    ],
                    // brandId: [
                    //     { required: true, message: '请选择品牌商家', trigger: 'blur' },
                    // ],
                    // institutionId: [
                    //     { required: true, message: '请选择所属机构', trigger: 'blur' },
                    // ],
                    // providerId: [
                    //     { required: true, message: '请选择绑定软件服务商', trigger: 'blur' },
                    // ],
                    username: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'change' },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: '请输入商家名称', trigger: 'blur' },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    mobile: [
                        {
                            required: true,
                            message: '请输入手机号码',
                            trigger: ['blur', 'change']
                        },
                        {
                            required: true,
                            validator: (rule, value, callback) => {
                                if (value === undefined) {
                                callback('请输入手机号码')
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
                    address: [
                        { required: false, message: '请填写详细地址', trigger: 'blur' },
                    ],
                    addressCode: [
                        { required: false, message: '请选择地址', trigger: 'blur' },
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
            //平台商家
            async searchSellerInfo(value) {
                let where = 'WHERE true'
                if (this.searchKeywordSeller) {
					where = where + ` And (name like '%` + this.searchKeywordSeller + `%' )` 
				}
                this.listQuery.where = where;
                try {
                    const res = await this.$u.api.v3.institution.seller.SellerSimpleList(this.listQuery);
                    console.log(res);
                    this.optionsSeller = res.items;
                    this.filteredOptionsSeller = [];
                    this.filteredOptionsSeller = this.optionsSeller.map(item => ({
                        value: item.id,
                        label: item.name
                    }));
                } catch (err) {
                    console.log(err);
                        uni.showToast({
                        duration: 3000,
                        icon:'error',
                        title: "获取平台商户信息失败",
                    });
                }
            },
            async filterOptionsSeller() {
                if (this.searchKeywordSeller.length === 0) {
                    this.showSelectSeller = false; // 隐藏下拉框
                }
                const keyword = this.searchKeywordSeller.toLowerCase();
                await this.searchSellerInfo(keyword);
                this.showSelectSeller = true; // 显示下拉框
                
            },
            confirmOptionSeller(e) {
                // 处理选中的值
                console.log(e);
                this.showSelectSeller = false; // 隐藏下拉框
                this.searchKeywordSeller = e[0].label;
                this.formData.userId = e[0].value;
            },
            //所属品牌商家
            async searchBrandInfo(value) {
                let where = 'WHERE true'
                if (this.searchKeywordBrand) {
                    where = 'WHERE'
                    where = where + ` id=brand_id ` + ` And name like '%` + this.searchKeywordBrand + `%' ` 
				}
                this.listQuery.where = where;
                try {
                    const res = await this.$u.api.v3.institution.seller.SellerSimpleList(this.listQuery);
                    console.log(res);
                    this.optionsBrand = res.items;
                    this.filteredOptionsBrand = [];
                    this.filteredOptionsBrand = this.optionsBrand.map(item => ({
                        value: item.id,
                        label: item.name
                    }));
                } catch (err) {
                    console.log(err);
                        uni.showToast({
                        duration: 3000,
                        icon:'error',
                        title: "获取品牌信息失败",
                    });
                }
            },
            async filterOptionsBrand() {
                if (this.searchKeywordBrand.length === 0) {
                    this.showSelectBrand = false; // 隐藏下拉框
                }
                const keyword = this.searchKeywordBrand.toLowerCase();
                await this.searchBrandInfo(keyword);
                this.showSelectBrand = true; // 显示下拉框
                
            },
            confirmOptionBrand(e) {
                // 处理选中的值
                console.log(e);
                this.showSelectBrand = false; // 隐藏下拉框
                this.searchKeywordBrand = e[0].label;
                this.formData.seller.brandId = e[0].value;
            },
            //软件服务商
            async searchProviderInfo(value) {
                let where = 'WHERE true'
                if (this.searchKeywordProvider) {
					where = where + ` And name like '%` + this.searchKeywordProvider + `%' ` 
				}
                this.listQuery.where = where;
                try {
                    const res = await this.$u.api.v3.institution.seller.ProviderSimpleList(this.listQuery);
                    console.log(res);
                    this.optionsProvider = res.items;
                    this.filteredOptionsProvider = [];
                    this.filteredOptionsProvider = this.optionsProvider.map(item => ({
                        value: item.id,
                        label: item.name
                    }));
                } catch (err) {
                    console.log(err);
                        uni.showToast({
                        duration: 3000,
                        icon:'error',
                        title: "获取软件服务商信息失败",
                    });
                }
            },
            async filterOptionsProvider() {
                if (this.searchKeywordProvider.length === 0) {
                    this.showSelectProvider = false; // 隐藏下拉框
                }
                const keyword = this.searchKeywordProvider.toLowerCase();
                await this.searchProviderInfo(keyword);
                this.showSelectProvider = true; // 显示下拉框
                
            },
            confirmOptionProvider(e) {
                // 处理选中的值
                console.log(e);
                this.showSelectProvider = false; // 隐藏下拉框
                this.searchKeywordProvider = e[0].label;
                this.formData.seller.providerId = e[0].value;
            },

            initFormData() {
                this.formData = {
                    // operatorId: '', // 激活付款码id
                    id: '', // 激活付款码id
                    // SellerExist: 'true', // 商户存否 
                    name: '', // 付款码名称
                    userId: '', // 平台商家
                    user: {
                        username: '', // 账号
                        password: '', // 密码
                    },
                    seller: {
                        username: '', // 账号
                        brandId: '', // 所属品牌商家
                        institutionId: '', // 所属机构
                        providerId: '', // 绑定软件服务商
                        mobile: '', // 联系手机
                        name: '', // 商家名称
                        addressCode: [], // 地址
                        address: '', // 详情地址
                    }
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
                const newArr = region.map(item => item.code);
                this.formData.seller.addressCode = newArr
                console.log(this.formData.seller.addressCode);
            },
            submitForm(formName) {
                if(this.SellerExist === 'false'){
                    this.formData.seller.institutionId = this.userId
                    this.formData.seller.username = this.formData.user.username
                    delete this.formData.userId
                }
                if(this.SellerExist === 'true'){
                    this.formData.seller = {}
                    this.formData.user = {}
                }
                console.log(this.formData.seller.institutionId);
                // this.$refs[formName].validate((valid) => {
                    // if (valid) {
                        this.$u.api.v3.institution.seller.Activate(this.formData).then(res => {
                            if (res.valid) {
                                this.initFormData()
                                uni.showToast({
                                    duration: 5000,
                                    icon:'success',
                                    title:'激活成功',
                                })
                                setTimeout(() => {
                                    this.$u.route({
                                        type: 'to',
                                        url: 'subPackages/institution/index',
                                    });
                                }, 3000);
                            } else {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'error',
                                    title:'激活失败',
                                })
                            }
                        }).catch(err => {
                            console.log(err);
                            uni.showToast({
                                duration: 3000,
                                icon:'error',
                                title: err.data,
                            })
                        })
                    // }
                // })
            }
		},
         // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
        onReady() {
            this.$refs.dataForm.setRules(this.rules);
        },
        onShow() {
            this.item = RouteParams()
            this.formData.id = this.item.operatorId
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