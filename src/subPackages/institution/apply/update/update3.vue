<template>
	<view>
        <view v-if="userId">
		<view class="item">
            <u-steps :list="numList" :current="2" mode="number"></u-steps>
            <u-form :model="formData" ref="dataForm" label-width="320">
                <u-form-item label="银行卡照片" prop="bankCardPic">
                    <!-- <u-image width="100%" height="300rpx" :src="imgUrl.bankCardPic" v-if="reUploadBankCardPic"></u-image> -->
                    <uni-file-picker v-model="value"
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
                <u-form-item label="是否非法人结算" prop="isIlLegalPerson">
                    <u-switch v-model="checked" size="40" @change="change"></u-switch>
                </u-form-item>

                <view v-if="checked">
                    <u-gap height="60" bg-color="#ffffff"></u-gap>
                    <u-divider>非法人结算卡信息</u-divider>
                    <!-- 非法人结算卡信息 divider1 -->
                    <u-form-item label="非法人银行卡照片" prop="ilLegalPersonBankCardPic">
                        <uni-file-picker v-model="valueIlLegal"
                            fileMediatype="image" 
                            mode="grid" 
                            limit="1"
                            @select="selectIlLegalBankCardCopy" 
                        />
                    </u-form-item>
                    <u-form-item label="非法人账户类型" prop="ilLegalPersonBankAccountType">
                        <u-radio-group v-model="formData.ilLegalPersonBankAccountType">
                            <u-radio key="CORPORATE" name="CORPORATE">对公银行账户</u-radio>
                            <u-radio key="PERSONAL" name="PERSONAL">个人银行卡</u-radio>
                        </u-radio-group>
                    </u-form-item>
                    <u-form-item label="非法人开户银行" prop="ilLegalPersonBankAccountBank">
                        <u-input v-model="formData.ilLegalPersonBankAccountBank" placeholder="请输入非法人开户银行"/>
                    </u-form-item>
                    <u-form-item label="非法人开户支行" prop="ilLegalPersonBankChannelNo"> 
                        <u-input v-model="searchKeywordIlLegal" @input="filterOptionsIlLegal" @focus="focusInputBankInfo" placeholder="请输入关键字搜索"/>
                        <u-select v-model="showSelectIlLegal" :list="filteredOptionsIlLegal" @confirm="confirmOptionIlLegal" ></u-select>
                    </u-form-item>
                    <u-form-item label="非法人银行账号" prop="ilLegalPersonBankAccountNo">
                        <u-input v-model="formData.ilLegalPersonBankAccountNo" placeholder="请输入非法人银行账号"/>
                    </u-form-item>
                    <u-form-item label="非法人账户户名" prop="ilLegalPersonBankAccountName">
                        <u-input v-model="formData.ilLegalPersonBankAccountName" placeholder="请输入非法人账户户名"/>
                    </u-form-item>
                    <u-form-item label="非法人支行地址" prop="ilLegalPersonBankDistrictCode" v-if="formData.ilLegalPersonBankAccountType === 'CORPORATE'">
                        <pick-regions :defaultRegion="formData.ilLegalPersonBankDistrictCode" @getRegion="handleGetRegionIlLegal"/>
                    </u-form-item>
                    <u-gap height="60" bg-color="#ffffff"></u-gap>
                    <u-divider>非法人信息</u-divider>
                    <!-- 非法人信息 divider2 -->
                    <u-form-item label="非法人姓名" prop="ilLegalPerson">
                        <u-input v-model="formData.ilLegalPerson" placeholder="请输入非法人姓名"/>
                    </u-form-item>
                    <u-form-item label="非法人电话" prop="ilLegalPersonPhone">
                        <u-input v-model="formData.ilLegalPersonPhone" placeholder="请输入非法人电话"/>
                    </u-form-item>
                    <u-form-item label="非法人身份证人像面照片" prop="ilLegalPersonCardPic">
                        <uni-file-picker v-model="valueIlLegalPersonCardPic"
                            fileMediatype="image" 
                            mode="grid" 
                            limit="1"
                            @select="selectIlLegalIdCardCopy" 
                        />
                    </u-form-item>
                    <u-form-item label="非法人身份证国徽面照片" prop="ilLegalPersonCardNationalPic">
                        <uni-file-picker v-model="valueIlLegalPersonCardNationalPic"
                            fileMediatype="image" 
                            mode="grid" 
                            limit="1"
                            @select="selectIlLegalIdCardNational" 
                        />
                    </u-form-item>
                    <u-form-item label="非法人身份证号" prop="ilLegalPersonCardNo">
                        <u-input v-model="formData.ilLegalPersonCardNo" placeholder="请输入非法人身份证号"/>
                    </u-form-item>
                    <u-form-item label="非法人身份证地址" prop="ilLegalPersonCardCardAddress">
                        <u-input v-model="formData.ilLegalPersonCardCardAddress" placeholder="请输入非法人身份证地址"/>
                    </u-form-item>
                    <u-form-item label="非法人身份证有效期开始" prop="ilLegalPersonCardPeriodBegin">
                        <u-input v-model="formData.ilLegalPersonCardPeriodBegin" placeholder="请输入非法人身份证有效期"/>
                    </u-form-item>
                    <u-form-item label="非法人身份证有效期结束" prop="ilLegalPersonCardPeriodEnd">
                        <u-input v-model="formData.ilLegalPersonCardPeriodEnd" placeholder="请输入非法人身份证有效期"/>
                    </u-form-item>
                </view>
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
	import pickRegions from '@/subPackages/institution/components/pick-regions/pick-regions.vue'

	export default {
        components: { 
			pickRegions
		},
		data() {
			return {
                value: [],
                reUploadBankCardPic: true,
                imgUrl: {},
                valueIlLegal: [],
                valueIlLegalPersonCardPic: [],
                valueIlLegalPersonCardNationalPic: [],
                //开户支行下拉框
                searchKeyword: '',
                options: [], 
                filteredOptions: [],
                selectedOption: null,
                showSelect: false,
                params: {filter: '',},
                // 非法人开户支行下拉框
                showSelectIlLegal: false,
                searchKeywordIlLegal: '',
                checked: false, // 是否非法人结算
                filteredOptionsIlLegal: [],

                numList: [{
					name: '主体信息'
				}, {
					name: '法人信息'
				}, {
					name: '结算信息'
				}, {
					name: '门店信息'
				}, {
                    name: '通道信息'
                },],
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
                    // 非法人结算卡信息 divider1
                    ilLegalPersonBankCardPic: '',    // 非法人银行卡照片
                    ilLegalPersonBankAccountType: '', // 非法人账户类型
                    ilLegalPersonBankAccountBank: '', // 非法人开户银行
                    ilLegalPersonBankAccountName: '',   // 非法人账户户名
                    ilLegalPersonBankAccountNo: '',     // 非法人银行账号
                    ilLegalPersonBankChannelNo: '',  // 非法人开户支行
                    ilLegalPersonBankAddressCode: '',   // 非法人支行地址
                    ilLegalPersonBankCityCode: '',
                    ilLegalPersonBankDistrictCode: '',
                    ilLegalPersonBankProvinceCode: '',
                    // 非法人信息 divider2
                    ilLegalPersonCardPic: '',    // 非法人身份证人像面照片
                    ilLegalPersonCardNationalPic: '',    // 非法人身份证国徽面照片
                    ilLegalPerson: '',   // 非法人姓名
                    ilLegalPersonPhone: '',   // 非法人电话
                    ilLegalPersonCardNo: '',   // 非法人身份证号
                    ilLegalPersonCardCardAddress: '',   // 非法人身份证地址
                    ilLegalPersonCardPeriodBegin: '',   // 非法人身份证有效期开始
                    ilLegalPersonCardPeriodEnd: '',   // 非法人身份证有效期结束
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
                    ],
                    // 非法人结算卡信息
                    ilLegalPersonBankCardPic: [
                        { required: true, message: '请上传非法人银行卡照片', trigger: 'blur' },
                    ],
                    ilLegalPersonBankAccountType: [
                        { required: true, message: '请选择非法人银行账户类型', trigger: 'blur' },
                    ],
                    ilLegalPersonBankAccountBank: [
                        { required: true, message: '请输入非法人开户银行', trigger: 'blur' },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    ilLegalPersonBankAccountName: [
                        { required: true, message: '请输入非法人账户户名', trigger: 'blur' },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    ilLegalPersonBankAccountNo: [
                        { required: true, message: '请输入非法人银行账号', trigger: 'blur' },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    ilLegalPersonBankChannelNo: [
                        { required: true, message: '请输入非法人开户行联行号', trigger: 'blur' },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    ilLegalPersonBankAddressCode: [
                        { required: true, message: '请选择非法人支行地址', trigger: 'blur' },
                    ],
                    // 非法人信息
                    ilLegalPersonCardPic: [
                        { required: true, message: '请上传非法人身份证人像面照片', trigger: 'blur' },
                    ],
                    ilLegalPersonCardNationalPic: [
                        { required: true, message: '请上传非法人身份证国徽面照片', trigger: 'blur' },
                    ],
                    ilLegalPerson: [
                        { required: true, message: '请输入非法人姓名', trigger: 'blur' },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    ilLegalPersonPhone: [
                        { required: true, message: '请输入非法人手机号', trigger: 'blur' },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    ilLegalPersonCardNo: [
                        { required: true, message: '请输入非法人身份证号', trigger: 'blur' },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    ilLegalPersonCardCardAddress: [
                        { required: true, message: '请输入非法人身份证地址', trigger: 'blur' },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    ilLegalPersonCardPeriodBegin: [
                        { required: true, message: '请输入非法人身份证有效期开始时间', trigger: 'blur' },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ],
                    ilLegalPersonCardPeriodEnd: [
                        { required: true, message: '请输入非法人身份证有效期结束时间', trigger: 'blur' },
                        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                    ]
                }
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'商户进件编辑'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
			
		},
        onload() {
        },
		mounted() {
            this.initStorageToken()
		},
        onShow() {
            this.item = RouteParams()
            this.formData = this.item
            this.searchKeyword = this.item.bankName
            if(this.item.bankNameIlLegal) {
                this.checked = true
                this.searchKeywordIlLegal = this.item.bankNameIlLegal
                this.getUploadImage(this.formData.ilLegalPersonBankCardPic, 'ilLegalPersonBankCardPic') 
                this.getUploadImage(this.formData.ilLegalPersonCardNationalPic, 'ilLegalPersonCardNationalPic')
                this.getUploadImage(this.formData.ilLegalPersonCardPic, 'ilLegalPersonCardPic')
            } 

            this.getUploadImage(this.formData.bankCardPic, 'bankCardPic')
            
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
                    if(name == 'bankCardPic') {
                        this.value = value1
                    }else if(name == 'ilLegalPersonBankCardPic') {  
                        this.valueIlLegal = value1
                    }else if(name == 'ilLegalPersonCardPic') {
                        this.valueIlLegalPersonCardPic = value1
                    }else if(name == 'ilLegalPersonCardNationalPic') {
                        this.valueIlLegalPersonCardNationalPic = value1
                    }
                    
                } catch (err) {
                    console.log(err);
                    uni.showToast({
                        duration: 10000,
                        icon: 'error',
                        title: err.data,
                    });
                }
            },
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
            // 非法人 下拉框方法
            async searchBankInfoIlLegal(value) {
                let bankName = this.formData.ilLegalPersonBankAccountBank.match(/^.*行/);
                if (!bankName) {
                    bankName = this.formData.ilLegalPersonBankAccountBank.match(/^.*信用社/);
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
                    this.optionsIlLegal = res.items;
                    this.filteredOptionsIlLegal = [];
                    this.filteredOptionsIlLegal = this.optionsIlLegal.map(item => ({
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
            // 非法人 下拉框方法
            async filterOptionsIlLegal() {
                if (this.searchKeywordIlLegal.length === 0) {
                    this.showSelectIlLegal = false; // 隐藏下拉框
                }
                const keyword = this.searchKeywordIlLegal.toLowerCase();
                await this.searchBankInfoIlLegal(keyword);
                this.showSelectIlLegal = true; // 显示下拉框
                
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
            confirmOptionIlLegal(e) {
                // 处理选中的值
                this.showSelectIlLegal = false; // 隐藏下拉框
                this.searchKeywordIlLegal = e[0].label;
                this.formData.ilLegalPersonBankChannelNo = e[0].value; //将e[0].value赋值给开户支行字段
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
                    // 非法人结算卡信息 divider1
                    ilLegalPersonBankCardPic: '',    // 非法人银行卡照片
                    ilLegalPersonBankAccountType: '', // 非法人账户类型
                    ilLegalPersonBankAccountBank: '', // 非法人开户银行
                    ilLegalPersonBankAccountName: '',   // 非法人账户户名
                    ilLegalPersonBankAccountNo: '',     // 非法人银行账号
                    ilLegalPersonBankChannelNo: '',  // 非法人开户支行
                    ilLegalPersonBankAddressCode: '',   // 非法人支行地址
                    // 非法人信息 divider2
                    ilLegalPersonCardPic: '',    // 非法人身份证人像面照片
                    ilLegalPersonCardNationalPic: '',    // 非法人身份证国徽面照片
                    ilLegalPerson: '',   // 非法人姓名
                    ilLegalPersonPhone: '',   // 非法人电话
                    ilLegalPersonCardNo: '',   // 非法人身份证号
                    ilLegalPersonCardCardAddress: '',   // 非法人身份证地址
                    ilLegalPersonCardPeriodBegin: '',   // 非法人身份证有效期开始
                    ilLegalPersonCardPeriodEnd: '',   // 非法人身份证有效期结束
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
            // 获取选择的地区  非法人
            handleGetRegionIlLegal(region){
                this.formData.ilLegalPersonBankDistrictCode = region[2].code
                this.formData.ilLegalPersonBankCityCode = region[1].code
                this.formData.ilLegalPersonBankProvinceCode = region[0].code
            },
            change(status) {
				console.log(status);
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
                                this.imgUrl.bankCardPic = res.url
                                this.reUploadBankCardPic = false
                                this.$u.api.v3.storage.file.BankCardOCR({
                                    imageBase64: '',
                                    imageUrl: res.url,
                                }).then(res => {
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
            // OCR识别 非法人识别银行卡
            selectIlLegalBankCardCopy(e) {
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
                            this.formData.ilLegalPersonBankCardPic = path
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
                                    console.log(res)
                                    this.formData.ilLegalPersonBankAccountBank = res.bankInfo
                                    this.formData.ilLegalPersonBankAccountNo = res.cardNo
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
            selectIlLegalIdCardCopy(e){
                // console.log(e);
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
                            this.formData.ilLegalPersonCardPic = path
                           //获取图片地址并识别图片信息
                           this.$u.api.v3.storage.file.GetUploadImage({
                                provider: 'qiniu',
                                key: path
                            }).then(res => {
                                this.$u.api.v3.storage.file.IDCardOCR({
                                    imageBase64: '',
                                    imageUrl: res.url,
                                    cardSide: 'FRONT',
                                }).then(res => {
                                    this.formData.ilLegalPerson = res.name
                                    this.formData.ilLegalPersonCardNo = res.idNum
                                    this.formData.ilLegalPersonCardCardAddress = res.address
                                }).catch(err => {
                                    uni.showToast({
                                        duration: 3000,
                                        icon:'error',
                                        title: "身份证识别失败:"+err,
                                    })
                                })
                            }).catch(err => {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'error',
                                    title: "身份证识别失败:"+err,
                                })
                            })
                            uni.showToast({
                                duration: 3000,
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
                        title:'上传失败'+err.errMsg,
                    })
                }
                })
			},
            selectIlLegalIdCardNational(e) {
                // console.log(e);
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
                            this.formData.ilLegalPersonCardNationalPic = path
                           //获取图片地址并识别图片信息
                           this.$u.api.v3.storage.file.GetUploadImage({
                                provider: 'qiniu',
                                key: path
                            }).then(res => {
                                this.$u.api.v3.storage.file.IDCardOCR({
                                    imageBase64: '',
                                    imageUrl: res.url,
                                    cardSide: 'BACK',
                                }).then(res => {
                                    let idCardDate = res.validDate.split('-');
                                    // console.log(idCardDate);
                                    this.formData.ilLegalPersonCardPeriodBegin = idCardDate[0].replaceAll('.', '');
                                    this.formData.ilLegalPersonCardPeriodEnd = idCardDate[1].replaceAll('.', '');

                                }).catch(err => {
                                    uni.showToast({
                                        duration: 3000,
                                        icon:'error',
                                        title: "身份证识别失败:"+err,
                                    })
                                })
                            }).catch(err => {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'error',
                                    title: "身份证识别失败:"+err,
                                })
                            })
                            uni.showToast({
                                duration: 3000,
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
            nextPage(formName) {
                // this.$refs[formName].validate((valid) => {
                    delete this.formData.bankName
                    // if (valid) {
                        this.$u.route({
                            type: 'to',
                            url: 'subPackages/institution/apply/update/update4',
                            params: this.formData
                        })
                        // console.log(this.formData);
                    // }
                // })
               
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