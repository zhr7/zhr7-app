<template>
    <view>
        <view class="item">
            <u-form :model="formData" ref="dataForm" label-width="130">
                <u-form-item label="所属商户" prop="userId">
                    <uni-data-select
                        v-model="formData.userId"
                        :localdata="sellerList"
                        @change="changeSeller"
                        placeholder="请选择所属商户"
                        :disabled="isDisabled"
                    ></uni-data-select>
                </u-form-item>
                <u-form-item label="登录账号" prop="userName">
                    <div style="display: flex; align-items: center;justify-content: flex-end;">
                        <u-input v-model="formData.userName" placeholder="请输入登录账号" @input="handleInput" :disabled="isDisabledUserName"/>
                        <u-button size="mini"  @click="usePhone">使用资料手机号</u-button>
                    </div>
                </u-form-item>
                <u-form-item label="申请渠道" prop="commonId">
                    <uni-data-select
                        v-model="formData.channelConfig.commonId"
                        :localdata="channelList"
                        @change="change"
                        placeholder="请选择申请渠道"
                    ></uni-data-select>
                </u-form-item>
                
                <!-- 杉德 -->
                <sand v-if="isShowKeyword.includes('杉德')" ref="sandRef"/>
                <!-- 华夏 -->
                 <huaxia v-if="isShowKeyword.includes('华夏')" ref="huaxiaRef"/>
                <!-- 易宝 -->
                 <yeePay v-if="isShowKeyword.includes('易宝')" ref="yeePayRef"/>
                <!-- 盛付通 -->
                 <shengfuPayment ref="shengfuPaymentRef" v-if="isShowKeyword.includes('盛付通')||isShowKeyword.includes('广西金商机')||isShowKeyword.includes('成都前海')"/>
                 <view style="margin-top: 3vh;"/>
                 <!-- 手续费详情 -->
                 <u-divider>手续费详情</u-divider>
                <serviceFee v-if="!isShowKeyword.includes('工商聚富通')" ref="serviceFeeRef"/>
            </u-form>
            <u-line />
            <!-- <view class="bottom">	
                <u-button 
                    type="warning" 
                    @click="submitForm('dataForm')"
                >
                    提交
                </u-button>
            </view> -->
            <view class="bottom">	
                <u-button 
                    :disabled="isSubmitting"
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
import { parseTime, OCR, RouteParams } from '@/utils'
import { ref } from 'vue';
import serviceFee from './channelComponents/serviceFee'
import shengfuPayment from './channelComponents/shengfuPayment'
import yeePay from './channelComponents/yeePay'
import huaxia from './channelComponents/huaxia'
import sand from './channelComponents/sand'

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
            isDisabled: false,
            isDisabledUserName: false,
            picList: {},
            // showChannel: false,
            channelList: [],
            sellerList: [], //所属商户列表
            isShowKeyword: '',
            isShowKeywordSeller: '',
            // channelName: '',
            params: {
                page: 1,
                pageSize: 1000,
                sort: 'ORDER BY created_at DESC, id DESC',
                where: 'WHERE true',
            },
            formData: {
                userId: '', // 所属商户
                userName: '', // 登录账号
                // ic_net_screen_shot_url: '', // 网银截图
                relation: '', // 关系
                channelIdentifier: '', // 微信渠道号
                directAgentNo: '', // 代理编号
                remark: '', // 备注
                loginAccount: '', // 登录标识

                status: '',
                subMerId: '',

                applicationId: '', 

                channelConfig: {
                    commonId: '', // 申请渠道
                    config: {},
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
            },
        }
    },
    onLoad() {
        // this.initFormData()
        this.getChannelInfo()
        // this.options = RouteParams()
        this.item = RouteParams()
        this.item.formData = JSON.parse(this.item.formData)
        this.formData = {...this.item.formData, ...this.formData}
        console.log(this.item)
        console.log(this.formData)
        // if (this.item.id) {
        //     this.formData.applicationId = this.item.id
        // }
        // if(this.item.businessCode){
        //     this.formData.businessCode = this.item.businessCode
        // }
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
        this.getChannelServiceFeeRefData()
        this.getSellerSimpleList()
        
    },
    // onShow() {
    //     this.item = RouteParams()
    //     this.item.formData = JSON.parse(this.item.formData)
    //     this.formData = {...this.item.formData, ...this.formData}
    //     console.log(this.item)
    // },
    methods: {
        initFormData() {
            this.formData = {
                userId: '', // 所属商户
                userName: '', // 登录账号
                
                // ic_net_screen_shot_url: '', // 网银截图
                relation: '', // 关系
                channelIdentifier: '', // 微信渠道号
                directAgentNo: '', // 代理编号
                remark: '', // 备注
                loginAccount: '', // 登录标识
                

                
                status: '',
                subMerId: '',

                applicationId: '', 
                channelConfig: {
                    commonId: '', // 申请渠道
                    config: {},
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
        initStorageToken() {
            this.$u.api.v3.storage.file.GetUploadToken().then(res => {
                this.storageToken = res.token
            }).catch(err => {
                uni.showToast({
                    duration: 10000,
                    icon:'error',
                    title: "获取上传凭证失败:"+ err.data,
                })
            })
        },
        change(e) {
            console.log("e:", e);
            if(this.isShowKeyword!='') {
                this.formData.remark = ''
                this.formData.loginAccount = ''
                this.formData.channelIdentifier = ''
                this.formData.directAgentNo = ''
                this.formData.relation = ''
                this.formData.ic_net_screen_shot_url = ''
                this.formData.remark = ''
            }
            let selectedValue = e;
            let selectedText = this.channelList.find(item => item.value === selectedValue).text;
            this.formData.channelConfig.commonId = e;
            this.isShowKeyword = selectedText;
            console.log(selectedText);
        },
        changeSeller(e) {
            console.log("e:", e);
            if(e != '') {
                this.isDisabledUserName = true;
            }
            let selectedValue = e;
            let selectedText = this.sellerList.find(item => item.value === selectedValue).text;
            this.formData.userId = e;
            this.isShowKeywordSeller = selectedText;
            console.log(selectedText);
        },
        usePhone() {
            this.isDisabled = !this.isDisabled;
            if(this.isDisabled) {
                this.formData.userName = this.formData.storePhone
                this.formData.userId = ''
                this.isDisabledUserName = false
            }
            if(!this.isDisabled) {
                this.formData.userName = ''
                this.isDisabledUserName = false
            }
        },
        handleInput(e) {
            console.log(e);
            if(this.formData.userName.length <= 0) {
                this.isDisabled = false;
            }
        },
        getSellerSimpleList() {
            this.$u.api.v3.institution.seller.SellerSimpleList(this.params).then(res => {
                console.log(res);
                if(res) {
                    this.sellerList = res.items;
                    this.sellerList = this.sellerList.map(item => {
                        return {
                            value: item.id,
                            text: item.name
                        }
                    })
                }
            }).catch(err => {
                uni.showToast({
                    duration: 10000,
                    icon:'error',
                    title: err.data,
                })
            })
        },
        getChannelInfo() {
                this.$u.api.v3.institution.apply.CommonSimpleList(this.params).then(res => {
                    console.log(res);
                    if(res) {
                        let huaxia = res.items.filter(item => item.name.includes('华夏'));
                        let shengfutong = res.items.filter(item => item.name.includes('盛付通'));
                        let yibao = res.items.filter(item => item.name.includes('易宝'));
                        let jufutong = res.items.filter(item => item.name.includes('工商聚富通'));
                        let jinshangji = res.items.filter(item => item.name.includes('广西金商机'));
                        let qianhai = res.items.filter(item => item.name.includes('成都前海'));
                        let shande = res.items.filter(item => item.name.includes('杉德'));
                        this.channelList = huaxia.concat(shengfutong,yibao,jufutong,jinshangji,qianhai,shande);
                        this.channelList = this.channelList.map(item => {
                            return {
                                value: item.id,
                                text: item.name
                            }
                        })
                    }
                }).catch(err => {
                    uni.showToast({
                        duration: 10000,
                        icon:'error',
                        title: err.data,
                    })
                })
        },
        getChannelServiceFeeRefData() {
            this.$nextTick(() => {
                // 调用子组件的方法
                const serviceFeeRefData = this.$refs.serviceFeeRef;
                this.formData.channelConfig.fee = serviceFeeRefData.formData.fee;
                this.formData.channelConfig.wechatFee = serviceFeeRefData.formData.wechatFee;
                this.formData.channelConfig.alipayFee = serviceFeeRefData.formData.alipayFee;
                this.formData.channelConfig.unionpayFee = serviceFeeRefData.formData.unionpayFee;
                this.formData.channelConfig.rateOneDebit = serviceFeeRefData.formData.rateOneDebit;
                this.formData.channelConfig.rateTwoDebit = serviceFeeRefData.formData.rateTwoDebit;
                this.formData.channelConfig.rateDebitCap = serviceFeeRefData.formData.rateDebitCap;
                this.formData.channelConfig.rateOneCredit = serviceFeeRefData.formData.rateOneCredit;
                this.formData.channelConfig.rateTwoCredit = serviceFeeRefData.formData.rateTwoCredit;
                this.formData.channelConfig.sharingFee = Number(serviceFeeRefData.formData.sharingFee);
                console.log(serviceFeeRefData.formData);
            });
            
        },
        getChannelHuaxiaRefData() {
            this.$nextTick(() => {
                const huaxiaRefData = this.$refs.huaxiaRef;
                this.formData.remark = huaxiaRefData.formData.remark;
                console.log(huaxiaRefData.formData);
            });
        },
        getChannelYeePayRefData() {
            this.$nextTick(() => {
                const yeePayRefData = this.$refs.yeePayRef;
                this.formData.channelIdentifier = yeePayRefData.formData.channelIdentifier;
                this.formData.directAgentNo = yeePayRefData.formData.directAgentNo;
                this.formData.relation = yeePayRefData.formData.relation;
                console.log(yeePayRefData.formData);
            });
        },
        getChannelShengfuPaymentRefData() {
            this.$nextTick(() => {
                const shengfuPaymentRefData = this.$refs.shengfuPaymentRef;
                this.formData.remark = shengfuPaymentRefData.formData.remark;
                this.formData.loginAccount = shengfuPaymentRefData.formData.loginAccount;
                console.log(shengfuPaymentRefData.formData);
            });
        },
        async getConfigInfo() {
            console.log(this.formData.applicationId);
            // const picList = {};
            try {
                const res = await this.$u.api.v3.institution.apply.Get({id: this.formData.applicationId});
                const data = JSON.parse(JSON.stringify(res.item));
                console.log(data);
                const picList = {};
                if (data.storeEntrancePic) {
                    const res = await this.$u.api.v3.storage.file.GetUploadImage({
                        provider: 'qiniu',
                        key: data.storeEntrancePic,
                    });
                    picList.storeEntrancePic = res.url;
                }
                if (data.storeIndoorPic) {
                    const res = await this.$u.api.v3.storage.file.GetUploadImage({
                        provider: 'qiniu',
                        key: data.storeIndoorPic,
                    });
                    picList.storeIndoorPic = res.url;
                }
                if (data.storeFrontDeskPic) {
                    const res = await this.$u.api.v3.storage.file.GetUploadImage({
                        provider: 'qiniu',
                        key: data.storeFrontDeskPic,
                    });
                    picList.storeFrontDeskPic = res.url;
                }
                if (data.licensePic) {
                    const res = await this.$u.api.v3.storage.file.GetUploadImage({
                        provider: 'qiniu',
                        key: data.licensePic,
                    });
                    picList.licensePic = res.url;
                }
                if (data.legalPersonCardPic) {
                    const res = await this.$u.api.v3.storage.file.GetUploadImage({
                        provider: 'qiniu',
                        key: data.legalPersonCardPic,
                    });
                    picList.legalPersonCardPic = res.url;
                }
                if (data.legalPersonCardNationalPic) {
                    const res = await this.$u.api.v3.storage.file.GetUploadImage({
                        provider: 'qiniu',
                        key: data.legalPersonCardNationalPic,
                    });
                    picList.legalPersonCardNationalPic = res.url;
                }
                if (data.legalPersonCardHandPic) {
                    const res = await this.$u.api.v3.storage.file.GetUploadImage({
                        provider: 'qiniu',
                        key: data.legalPersonCardHandPic,
                    });
                    picList.legalPersonCardHandPic = res.url;
                }
                if (data.bankCardPic) {
                    const res = await this.$u.api.v3.storage.file.GetUploadImage({
                        provider: 'qiniu',
                        key: data.bankCardPic,
                    });
                    picList.bankCardPic = res.url;
                }
                if (data.ilLegalPersonCardPic) {
                    const res = await this.$u.api.v3.storage.file.GetUploadImage({
                        provider: 'qiniu',
                        key: data.ilLegalPersonCardPic,
                    });
                    picList.ilLegalPersonCardPic = res.url;
                }
                if (data.ilLegalPersonCardNationalPic) {
                    const res = await this.$u.api.v3.storage.file.GetUploadImage({
                        provider: 'qiniu',
                        key: data.ilLegalPersonCardNationalPic,
                    });
                    picList.ilLegalPersonCardNationalPic = res.url;
                }
                if (data.ilLegalPersonBankCardPic) {
                    const res = await this.$u.api.v3.storage.file.GetUploadImage({
                        provider: 'qiniu',
                        key: data.ilLegalPersonBankCardPic,
                    });
                    picList.ilLegalPersonBankCardPic = res.url;
                }
                
                picList.commonId = this.formData.channelConfig.commonId;
                if(this.formData.remark!=''){
                    picList.remark = this.formData.remark;
                }
                if(this.formData.loginAccount!=''){
                    picList.loginAccount = this.formData.loginAccount;
                }
                if(this.formData.channelIdentifier!=''){
                    picList.channelIdentifier = this.formData.channelIdentifier;
                }
                if(this.formData.relation!=''){
                    picList.relation = this.formData.relation;
                }
                if(this.formData.directAgentNo!=''){
                    picList.directAgentNo = this.formData.directAgentNo;
                }
                Object.assign(this.formData.channelConfig.config, picList);
                this.formData.channelConfig.config = JSON.stringify(this.formData.channelConfig.config);
                //提交时删除多余字段
                delete this.formData.remark;
                delete this.formData.loginAccount;
                delete this.formData.channelIdentifier;
                delete this.formData.relation;
                delete this.formData.directAgentNo;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        submitForm(formName) {
            Promise.all([
                this.getConfigInfo(),
                this.getChannelServiceFeeRefData(),
                this.getChannelHuaxiaRefData(),
                this.getChannelShengfuPaymentRefData(),
                this.getChannelYeePayRefData(),
            ]).then(() => {
                if (this.isShowKeyword.includes('华夏')) {
                    this.getChannelHuaxiaRefData();
                } else if (this.isShowKeyword.includes('盛付通')) {
                    this.getChannelShengfuPaymentRefData();
                } else if (this.isShowKeyword.includes('易宝')) {
                    this.getChannelYeePayRefData();
                }
                console.log(this.formData);
                this.$refs[formName].validate((valid) => {
                    if (this.isSubmitting) return; // 如果正在提交，则不再执行
                    this.isSubmitting = true; // 设置为不可点击状态
                    if (valid) {
                    console.log(this.formData);
                    this.$u.api.v3.institution.apply.Create(this.formData).then(res => {
                        if (res.valid) {
                            let id = this.formData.applicationId
                            this.initFormData()
                            uni.showToast({
                                duration: 10000,
                                icon:'success',
                                title:'进件成功',
                            })
                            this.isSubmitting = false;
                            setTimeout(() => {
                                this.$u.route({
                                    type: 'to',
                                    url: 'subPackages/institution/apply/list',
                                });
                            }, 2000);
                            // setTimeout(() => {
                            //     this.$u.route({
                            //         type: 'to',
                            //         url: 'subPackages/institution/apply/channelDetail/channelDetail?id=' + id, //添加通道成功后跳转到通道详情页面
                            //     });
                            // }, 2000);
                        } else {
                            uni.showToast({
                                duration: 10000,
                                icon:'error',
                                title:'进件失败',
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
            }).catch(err => {
                console.error('Error:', err);
            });
        }
        // submitForm(formName) {
        //     console.log(this.formData);
        //     this.$refs[formName].validate((valid) => {
        //         if (this.isSubmitting) return; // 如果正在提交，则不再执行
        //         this.isSubmitting = true; // 设置为不可点击状态
        //         if (valid) {
        //             this.$u.api.v3.institution.apply.Create(this.formData).then(res => {
        //                 if (res.valid) {
        //                     this.initFormData()
        //                     uni.showToast({
        //                         duration: 10000,
        //                         icon:'success',
        //                         title:'进件成功',
        //                     })
        //                     this.isSubmitting = false;
        //                     setTimeout(() => {
        //                         this.$u.route({
        //                             type: 'to',
        //                             url: 'subPackages/institution/apply/list',
        //                         });
        //                     }, 2000);
        //                 } else {
        //                     uni.showToast({
        //                         duration: 10000,
        //                         icon:'error',
        //                         title:'进件失败',
        //                     })
        //                 }
        //             }).catch(err => {
        //                 console.log(err);
        //                 uni.showToast({
        //                     duration: 10000,
        //                     icon:'error',
        //                     title: err.data,
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
}
</script>
<style lang="scss" scoped>
    .item {
        background-color: #fff;
        height: 100%;
        padding: 5vw;
    }
    .bottom {
        margin-top: 3vh;
    }
</style>

