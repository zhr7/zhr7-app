<template>
    <view>
        <view class="item">
            <u-form :model="formData" ref="dataForm" label-width="260">
                <u-form-item label="申请编号" prop="businessCode">
                    <u-input v-model="formData.businessCode" disabled placeholder="请输入业务申请编号"/>
                </u-form-item>
                <!-- <u-form-item label="申请渠道" prop="commonId">
                    <u-input v-model="channelName" disabled  placeholder="请选择渠道" @click="showChannel = !showChannel"/>
                    <u-select v-model="showChannel" mode="mutil-column-auto" :list="channelList" @confirm="confirmChannel"></u-select>
                </u-form-item> -->
                <u-form-item label="申请渠道" prop="commonId" required>
                    <uni-data-select
                        v-model="formData.commonId"
                        :localdata="channelList"
                        @change="change"
                        placeholder="请选择申请渠道"
                    ></uni-data-select>
                </u-form-item>
                
                <!-- 杉德 -->
                <!-- <sand/> -->
                <!-- 华夏 -->
                 <!-- <huaxia/> -->
                <!-- 易宝 -->
                 <!-- <yeePay/> -->
                <!-- 盛付通 -->
                 <!-- <shengfuPayment/> -->
                <!-- 手续费详情 -->
                <serviceFee/>
            </u-form>
            <u-line />
            <view class="bottom">	
                <u-button 
                    type="warning" 
                    @click="nextPage('dataForm')"
                >
                    提交
                </u-button>
            </view>
        </view>	
        <u-toast ref="uToast" />
    </view>
</template>
<script>
import { parseTime, OCR } from '@/utils'
import serviceFee from '../channelComponents/serviceFee'
import shengfuPayment from '../channelComponents/shengfuPayment'
import yeePay from '../channelComponents/yeePay'
import huaxia from '../channelComponents/huaxia'
import sand from '../channelComponents/sand'

export default {
    components: {
		serviceFee,
        shengfuPayment,
        yeePay,
        huaxia,
        sand
	},
    data() {
        return {
            // showChannel: false,
            channelList: [],
            // channelName: '',
            params: {
                page: 1,
                pageSize: 1000,
                sort: 'ORDER BY created_at DESC, id DESC',
                where: 'WHERE true',
            },
            formData: {
                businessCode: parseTime(new Date,'{y}{m}{d}') + Math.floor(Math.random() * 10000), // 业务申请编号
                commonId: '', // 申请渠道
                ic_net_screen_shot_url: '', // 网银截图
                channelIdentifier: '', // 微信渠道号
                directAgentNo: '', // 代理编号
                remark: '', // 备注
                loginAccount: '', // 登录标识
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
        }
    },
    onLoad() {
        this.initFormData()
        this.getChannelInfo()
    },
    created() {
        uni.setNavigationBarTitle({
            title:'添加通道'
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
                businessCode: parseTime(new Date,'{y}{m}{d}') + Math.floor(Math.random() * 10000), // 业务申请编号
                commonId: '', // 申请渠道
            }
            
        },
        initStorageToken() {
            this.$u.api.v3.storage.file.GetUploadToken().then(res => {
                this.storageToken = res.token
            }).catch(err => {
                uni.showToast({
                    duration: 3000,
                    icon:'error',
                    title: "获取上传凭证失败:"+ err.data,
                })
            })
        },
        // confirmChannel(e) {
        //     console.log(e);
        //     this.showChannel = !this.showChannel
        //     // const newArr = e.map(item => item.value);
        //     this.channelName = e[0].label
        //     // this.formData.mccCategoryCode = JSON.stringify(newArr)
        // },
        change(e) {
            console.log("e:", e);
        },
        getChannelInfo() {
                this.$u.api.v3.institution.apply.CommonSimpleList(this.params).then(res => {
                    console.log(res);
                    if(res) {
                        // this.channelList.push(res.items)
                        this.channelList = res.items.map(item => {
                            return {
                                value: item.id,
                                text: item.name
                            }
                        })
                    }
                }).catch(err => {
                    uni.showToast({
                        duration: 3000,
                        icon:'error',
                        title: err.data,
                    })
                })
            },
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