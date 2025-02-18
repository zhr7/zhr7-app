<template>
    <view v-if="itemList.length>0">
        <u-collapse :item-style="itemStyle">
            <u-collapse-item :index="index" title="结算银行" v-for="(item, index) in itemList" :key="index" :open="true">
                <view class="collapse-item">
                    <u-table align="center">
                        <u-tr class="u-tr">
                            <u-th class="u-th">银行类型</u-th>
                            <u-td class="u-td">
                                <span v-if="item.bankAccountType === 'PERSONAL'">法人账户</span>
                                <span v-if="item.bankAccountType === 'CORPORATE'">对公账户</span>
                            </u-td>
                        </u-tr>
                        <u-tr class="u-tr">
                            <u-th class="u-th">银行名称</u-th>
                            <u-td class="u-td">{{ item.bankAccountBank || '-' }}</u-td>
                        </u-tr>
                        <u-tr class="u-tr">
                            <u-th class="u-th">账号名称</u-th>
                            <u-td class="u-td">{{ item.bankAccountName || '-' }}</u-td>
                        </u-tr>
                        <u-tr class="u-tr">
                            <u-th class="u-th">银行账号</u-th>
                            <u-td class="u-td">{{ item.bankAccountNo || '-' }}</u-td>
                        </u-tr>
                    </u-table>
                </view>
            </u-collapse-item>
        </u-collapse>
        <view class="item">
            <u-form :model="formData" ref="dataForm" label-width="260">
                <u-form-item label="银行卡照片" prop="bankCardPic" required>
                    <uni-file-picker 
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="selectBankCardCopy" 
                    />
                </u-form-item>
                <u-form-item label="银行账户类型" prop="bankAccountType" required>
                    <u-radio-group v-model="formData.bankAccountType">
                        <u-radio key="CORPORATE" name="CORPORATE">对公账户</u-radio>
                        <u-radio key="PERSONAL" name="PERSONAL">法人账户</u-radio>
                    </u-radio-group>
                </u-form-item>
                <u-form-item label="开户银行" prop="bankAccountBank" required>
                    <u-input v-model="formData.bankAccountBank" placeholder="请输入"/>
                </u-form-item>
                <u-form-item label="账号名称" prop="bankAccountName" required>
                    <u-input v-model="formData.bankAccountName" placeholder="请输入"/>
                </u-form-item>
                <u-form-item label="银行账号" prop="bankAccountNo" required>
                    <u-input v-model="formData.bankAccountNo" placeholder="请输入"/>
                </u-form-item>
                <u-form-item label="开户支行" prop="bankChannelNo"> 
                    <u-input v-model="searchKeyword" @input="filterOptions" placeholder="请输入关键字搜索"/>
                    <u-select v-model="showSelect" :list="filteredOptions" @confirm="confirmOption" ></u-select>
                </u-form-item>
            </u-form>
            <view class="bottom">	
                    <u-button type="warning" @click="submitForm('dataForm')">提交</u-button>
            </view>
        </view>
    </view>
    <view v-else><u-divider bg-color="#f3f4f6">{{info}}</u-divider></view>
</template>
<script>
import { parseTime, RouteParams } from '@/utils'
export default {
    data() {
        return {
            searchKeyword: '',
            showSelect: false,
            filteredOptions: [],
            params: {filter: '',},
            info: '',
            itemStyle: {
                marginTop: '20px',
                backgroundColor: '#fff',
                padding: '10px',
            },
            itemList: [],
            formData: {
                bankAccountType: 'PERSONAL',
                bankAccountBank: '',
                bankAccountName: '',
                bankAccountNo: '',
                bankChannelNo: '',
                bankCardPic: '',
                bankCityCode: '',
                bankDistrictCode: '',
                bankProvinceCode: '',
            },
            rules: {
                bankAccountType: [
                    { required: true, message: '请选择银行账户类型', trigger: 'change' }
                ],
                bankAccountBank: [
                    { required: true, message: '请输入开户银行', trigger: 'blur' }
                ],
                bankAccountName: [
                    { required: true, message: '请输入账号名称', trigger: 'blur' },
                    { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                ],
                bankAccountNo: [
                    { required: true, message: '请输入银行账号', trigger: 'blur' },
                    { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                ],
                bankChannelNo: [
                    { required: true, message: '请输入开户支行', trigger: 'blur' },
                    { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
                ],
                bankCardPic: [
                    { required: true, message: '请上传银行卡照片', trigger: 'change' }
                ]
            }
        }
    },
    watch: {
        itemList() {
            console.log(this.itemList);
            this.$forceUpdate();
        }
    },
    onShow() {
        this.item = RouteParams();
    },
    onLoad() {
    },
    mounted() {
        this.initStorageToken()
        this.getInfo()
    },
    created() {
        uni.setNavigationBarTitle({
            title:'结算银行'
        })
        uni.setNavigationBarColor({
            frontColor: '#000000',  
            backgroundColor: '#ffffff',  
        })
    },
    methods: {
        initStorageToken() {
            this.$u.api.v3.storage.file.GetUploadToken().then(res => {
                this.storageToken = res.token
            }).catch(err => {
                console.log(err);
                uni.showToast({
                    duration: 10000,
                    icon:'error',
                    title: "获取上传凭证失败:"+ err.data,
                })
            })
        },
        initFormData() {
            this.formData = {
                bankAccountType: 'PERSONAL',
                bankAccountBank: '',
                bankAccountName: '',
                bankAccountNo: '',
                bankChannelNo: '',
                bankCardPic: '',
                bankCityCode: '',
                bankDistrictCode: '',
                bankProvinceCode: '',
            }
        },
        confirmOption(e) {
            // 处理选中的值
            this.showSelect = false; // 隐藏下拉框
            this.searchKeyword = e[0].label;
            this.formData.bankChannelNo = e[0].value; //将e[0].value赋值给开户支行字段
        },
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
        getInfo() {
            this.itemList = [];
            this.$u.api.v3.institution.apply.BankQuery({channelId: this.item.id}).then(res => {
                if(res){
                    this.itemList.push(res)
                    console.log(this.itemList)
                }
            }).catch(err => {
                console.log(err);
                uni.showToast({
                    duration: 10000,
                    icon:'error',
                    title: err.data,
                })
            })
            console.log(this.itemList)
            if (this.itemList.length == 0){
                this.info = '暂无数据'
            }
        },
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
        submitForm(formName) {
            console.log(this.formData);
            this.$refs[formName].validate((valid) => {
                if (this.isSubmitting) return; // 如果正在提交，则不再执行
                this.isSubmitting = true; // 设置为不可点击状态
                this.formData.channelId = this.item.id
                delete this.formData.bankCardPic
                if (valid) {
                    this.$u.api.v3.institution.apply.BankChange(this.formData).then(res => {
                        if (res.returnCode=='SUCCESS') {
                            this.initFormData()
                            console.log(res);
                            this.getInfo()
                            uni.showToast({
                                duration: 10000,
                                icon:'none',
                                title: res.returnMsg,
                            })
                            this.isSubmitting = false;
                        }else {
                            uni.showToast({
                                duration: 10000,
                                icon:'none',
                                title: res.returnMsg,
                            })
                        }
                    }).catch(err => {
                        console.log(err);
                        uni.showToast({
                            duration: 10000,
                            icon:'error',
                            title: err.data,
                        })
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .collapse-item {
		padding-bottom: 20rpx;
        height:230rpx;
	}
    .u-td {
        width: 50%;
        margin: 0 auto;
    }
    .u-tr {
        width: 40%;
    }
    .custom-link {
        border: 1px solid #18b566;
        background-color: #19be6b;
        padding: 10rpx 0rpx 10rpx 0rpx!important;
        border-radius: 8rpx;
    }
    .item {
        background-color: #fff;
        height: 100%;
        padding: 5vw;
    }
    .bottom {
        margin-top: 3vh;
    }
</style>