<template>
  <view>
    <view>
        <u-table align="center" style="margin-bottom: 20px;" v-for="(item, index) in itemList" :key="index">
            <u-tr class="u-tr">
                <u-th class="u-th">ID</u-th>
                <u-th class="u-th">商户号</u-th>
            </u-tr>
            <u-tr class="u-tr">
                <u-td class="u-td">{{ item.id || '-' }}</u-td>
                <u-td class="u-td">{{ item.subMerId || '-' }}</u-td>
            </u-tr>
            <u-tr class="u-tr">
                <u-th class="u-th">费率</u-th>
                <u-th class="u-th">状态</u-th>
            </u-tr>
            <u-tr class="u-tr">
                <u-td class="u-td">
                    {{ item.fee || '-'}}
                    <!-- <view>微信 {{ item.wechatFee || '-' }}‱ 万分之一</view>
                    <view>支付宝 {{ item.alipayFee || '-' }}‱ 万分之一</view>
                    <view>借记卡费率(<=1000元) {{ item.rateOneDebit || '-' }}‱ 万分之一</view>
                    <view>借记卡费率(>1000元) {{item.rateTwoDebit || '-' }}‱ 万分之一</view>
                    <view>借记卡费率(封顶值) {{ item.rateDebitCap || '-' }}‱ 万分之一</view>
                    <view>贷记卡费率(<=1000元) {{ item.rateOneCredit || '-' }}‱ 万分之一</view>
                    <view>贷记卡费率(>1000元) {{ item.rateTwoCredit || '-' }}‱ 万分之一</view>
                    <view>分账手续费{{ item.sharingFee || '-' }}‱ 万分之一</view> -->
                </u-td>
                <u-td class="u-td" v-if="item.status == 'SUBMIT'">已提交待查询</u-td>
                <u-td class="u-td" v-if="item.status == 'SUCCESS'">修改成功</u-td>
            </u-tr>
            <u-tr class="u-tr">
                <u-th class="u-th">签约链接</u-th>
                <u-th class="u-th">创建时间</u-th>
            </u-tr>
            <u-tr class="u-tr">
                <u-td class="u-td">{{ item.signUrl || '-' }}</u-td>
                <u-td class="u-td">{{ parseTime(item.createdAt) || '-' }}</u-td>
            </u-tr>
            <u-tr class="u-tr">
                <u-th class="u-th">操作</u-th>
            </u-tr>
            <u-tr class="u-tr">
                <u-td class="u-td"><button type="primary" size="mini" @click="feeQuery(item)">查询</button></u-td>
            </u-tr>
        </u-table>
    </view>
    <view class="collapse-item">
        <u-divider>手续费详情</u-divider>
        <u-form :model="formData" ref="dataForm" label-width="360" style="padding: 0 20px;background-color: #fff">
            <u-form-item label="批量手续费 (‱)" prop="fee" required>
                <u-number-box v-model="formData.fee" :min="20" :max="60" @change="handleChange"></u-number-box>
            </u-form-item>
            <u-form-item label="微信手续费 (‱)" prop="wechatFee" required>
                <u-number-box v-model="formData.wechatFee" :min="20" :max="60"></u-number-box>
            </u-form-item>
            <u-form-item label="支付宝手续费 (‱)" prop="alipayFee" required>
                <u-number-box v-model="formData.alipayFee" :min="20" :max="60"></u-number-box>
            </u-form-item>
            <u-form-item label="云闪付手续费 (‱)" prop="unionpayFee" required>
                <u-number-box v-model="formData.unionpayFee" :min="20" :max="60"></u-number-box>
            </u-form-item>
            <u-form-item label="借记卡费率(<=1000元) (‱)" prop="rateOneDebit" required>
                <u-number-box v-model="formData.rateOneDebit" :min="20" :max="60"></u-number-box>
            </u-form-item>
            <u-form-item label="借记卡费率(>1000元) (‱)" prop="rateTwoDebit" required>
                <u-number-box v-model="formData.rateTwoDebit" :min="20" :max="200"></u-number-box>
            </u-form-item>
            <u-form-item label="借记卡费率(封顶值) (元)" prop="rateDebitCap">
                <u-number-box v-model="formData.rateDebitCap" :min="1" :max="200"></u-number-box>
            </u-form-item>
            <u-form-item label="贷记卡费率(<=1000元) (‱)" prop="rateOneCredit" required>
                <u-number-box v-model="formData.rateOneCredit" :min="20" :max="60"></u-number-box>
            </u-form-item>
            <u-form-item label="贷记卡费率(>1000元) (‱)" prop="rateTwoCredit" required>
                <u-number-box v-model="formData.rateTwoCredit" :min="20" :max="200"></u-number-box>
            </u-form-item>
            <u-form-item label="分账手续费 (‱)" prop="sharingFee">
                <u-number-box v-model="formData.sharingFee" :min="0" :max="200"></u-number-box>
            </u-form-item>
        </u-form>
        <u-button 
            type="warning" 
            @click="submitForm('dataForm')"
        >
            提交
        </u-button>
    </view>
  </view>
</template>

<script>
import { parseTime, OCR, RouteParams } from '@/utils'
import { ref } from 'vue'
export default {
  data() {
    return {
        itemStyle: {
            marginTop: '0px',
            backgroundColor: '#fff',
            padding: '10px',
        },
        itemList: [],
        formData: {
            //手续费详情
            fee: '',
            wechatFee: '',
            alipayFee: '',
            unionpayFee: '',
            rateOneDebit: '',
            rateTwoDebit: '',
            rateDebitCap: '',
            rateOneCredit: '',
            rateTwoCredit: '',
            sharingFee: '',
        },
        listQuery: {
            page: 1,
            pageSize: 15,
            filter: '',
            sort: JSON.stringify([{key: '_id', value: -1}]) 
        },
    };
  },
  watch: {
        itemList() {
            console.log(this.itemList);
            this.$forceUpdate();
        }
    },
    onload() {
    },
    onShow() {
        this.item = RouteParams();
        this.getInfo()
    },
    mounted() {
        this.initStorageToken()
    },
    updated() {
    },
    created() {
        uni.setNavigationBarTitle({
            title:'费率变更'
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
            //手续费详情
            fee: '',
            wechatFee: '',
            alipayFee: '',
            unionpayFee: '',
            rateOneDebit: '',
            rateTwoDebit: '',
            rateDebitCap: '',
            rateOneCredit: '',
            rateTwoCredit: '',
            sharingFee: '',
        }
    },
    handleChange() {
        this.formData.wechatFee = this.formData.fee
        this.formData.alipayFee = this.formData.fee
        this.formData.rateOneDebit = this.formData.fee
        this.formData.rateOneCredit = this.formData.fee
        this.formData.unionpayFee = this.formData.fee
    },
    parseTime(time){
        return parseTime(time)
    },
    getInfo() {
        let filter = {}
        if (this.item.applicationId) {
            this.listQuery.applicationId = this.item.applicationId
        }
        this.listQuery.filter = JSON.stringify(filter)
        this.$u.api.v3.institution.apply.ChannelSearch(this.listQuery).then(res => {
            if(res){
                let feeData = res.items.filter(item => item.commonName.includes('盛付通'));
                console.log(feeData);
                this.formData.fee = feeData[0].fee;
                this.formData.wechatFee = feeData[0].wechatFee;
                this.formData.alipayFee = feeData[0].alipayFee;
                this.formData.unionpayFee = feeData[0].unionpayFee;
                this.formData.rateOneDebit = feeData[0].rateOneDebit;
                this.formData.rateTwoDebit = feeData[0].rateTwoDebit;
                this.formData.rateDebitCap = feeData[0].rateDebitCap;
                this.formData.rateOneCredit = feeData[0].rateOneCredit;
                this.formData.rateTwoCredit = feeData[0].rateTwoCredit;
                this.formData.sharingFee = feeData[0].sharingFee;

                let params = {
                    applicationChannelId: feeData[0].id,
                    page: 1,
                    pageSize: 15,
                    filter: '{}',
                    sort: JSON.stringify([{key: '_id', value: -1}]) 
                }
                this.$u.api.v3.institution.apply.FeeSearch(params).then(res => {
                    if(res){
                        this.itemList = res.items;
                        console.log(this.itemList);
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
            
        }).catch(err => {
            console.log(err);
            uni.showToast({
                duration: 10000,
                icon:'error',
                title: err.data,
            })
        })
    },
    feeQuery(item) {
        this.$u.api.v3.institution.apply.FeeQuery({id: item.id}).then(res => {
            if(res){
                console.log(res);
                uni.showToast({
                    duration: 10000,
                    icon:'none',
                    title: res.message,
                })
            }
        }).catch(err => {
            console.log(err);
            uni.showToast({
                duration: 10000,
                icon:'none',
                title: err.data,
            })
        })
    },
    submitForm(formName) {
        console.log(this.formData);
        this.$refs[formName].validate((valid) => {
            if (this.isSubmitting) return; // 如果正在提交，则不再执行
            this.isSubmitting = true; // 设置为不可点击状态
            this.formData.applicationChannelId = this.item.id;
            if (valid) {
                this.$u.api.v3.institution.apply.FeeChange(this.formData).then(res => {
                    if (res.valid) {
                        this.initFormData()
                        console.log(res);
                        this.getInfo()
                        uni.showToast({
                            duration: 10000,
                            icon:'none',
                            title: res.message,
                        })
                        this.isSubmitting = false;
                    }else {
                        uni.showToast({
                            duration: 10000,
                            icon:'none',
                            title: res.message,
                        })
                    }
                }).catch(err => {
                    console.log(err);
                    uni.showToast({
                        duration: 10000,
                        icon:'none',
                        title: err.data,
                    })
                })
            }
        })
    }
  },
};
</script>

<style lang="scss" scoped>
    .collapse-item {
		padding: 30rpx;
        background-color: #fff;
        margin-top: 20rpx;
	}
    .u-td {
        width: 230px;
        margin: 0 auto;
    }
    .u-th {
        width: 130px;
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
    // .item {
    //     background-color: #fff;
    //     height: 100%;
    //     padding: 5vw;
    // }
    // .bottom {
    //     margin-top: 3vh;
    // }
</style>