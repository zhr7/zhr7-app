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
        <u-line />
        <view class="bottom">	
            <u-button 
                type="warning" 
                @click="submitForm('dataForm')"
            >
                提交
            </u-button>
        </view>
  </view>
  <view v-else><u-divider bg-color="#f3f4f6">{{info}}</u-divider></view>
</template>

<script>
import { parseTime, OCR, RouteParams } from '@/utils'
import { ref } from 'vue'
import serviceFee from '../channelComponents/serviceFee'
export default {
    components: {
		serviceFee,
	},
  data() {
    return {
        info: '',
        itemStyle: {
            marginTop: '20px',
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
        console.log(this.item)
    },
    mounted() {
        this.initStorageToken()
        this.getInfo()
    },
    updated() {
        this.getChannelServiceFeeRefData()
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
    getChannelServiceFeeRefData() {
        this.$nextTick(() => {
            // 调用子组件的方法
            const serviceFeeRefData = this.$refs.serviceFeeRef;
            console.log(serviceFeeRefData);
            this.formData.fee = serviceFeeRefData.formData.fee;
            this.formData.wechatFee = serviceFeeRefData.formData.wechatFee;
            this.formData.alipayFee = serviceFeeRefData.formData.alipayFee;
            this.formData.unionpayFee = serviceFeeRefData.formData.unionpayFee;
            this.formData.rateOneDebit = serviceFeeRefData.formData.rateOneDebit;
            this.formData.rateTwoDebit = serviceFeeRefData.formData.rateTwoDebit;
            this.formData.rateDebitCap = serviceFeeRefData.formData.rateDebitCap;
            this.formData.rateOneCredit = serviceFeeRefData.formData.rateOneCredit;
            this.formData.rateTwoCredit = serviceFeeRefData.formData.rateTwoCredit;
            this.formData.sharingFee = Number(serviceFeeRefData.formData.sharingFee);
            console.log(serviceFeeRefData.formData);
        }); 
    },
    getInfo() {
        let filter = {}
        if (this.item.id) {
            this.listQuery.applicationId = this.item.applicationId
        }
        this.listQuery.filter = JSON.stringify(filter)
        this.$u.api.v3.institution.apply.ChannelSearch(this.listQuery).then(res => {
            if(res){
                this.itemList = res.items.filter(item => item.commonName.includes('盛付通'));
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
                        icon:'error',
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