<template>
    <view>
        <div class="panel-body">
    <vue-form-generator :schema="schema" :model="model" :options="formOptions"></vue-form-generator>
  </div>
        <view class="item">
            <u-form :model="formData" ref="dataForm" label-width="260">
                <u-form-item label="申请编号" prop="businessCode">
                    <u-input v-model="formData.businessCode" disabled placeholder="请输入业务申请编号"/>
                </u-form-item>
                <!-- <u-form-item label="申请渠道" prop="commonId">
                    <u-input v-model="channelName" disabled  placeholder="请选择渠道" @click="showChannel = !showChannel"/>
                    <u-select v-model="showChannel" mode="mutil-column-auto" :list="channelList" @confirm="confirmChannel"></u-select>
                </u-form-item> -->
                <uni-section title="申请渠道">
                    <uni-data-select
                        v-model="formData.commonId"
                        :localdata="channelList"
                        @change="change"
                        placeholder="请选择申请渠道"
                        label="申请渠道"
                    ></uni-data-select>
                </uni-section>
                <!--  -->
                <u-form-item label="工商网截图" prop="ic_net_screen_shot_url">
                    <uni-file-picker 
                        fileMediatype="image" 
                        mode="grid" 
                        limit="1"
                        @select="selectStoreEntrancePic" 
                    />
                </u-form-item>
                <u-form-item label="微信渠道号" prop="channelIdentifier">
                    <u-input v-model="formData.channelIdentifier" disabled placeholder="请输入微信渠道号"/>
                </u-form-item>
                <u-form-item label="代理编号" prop="directAgentNo">
                    <u-input v-model="formData.directAgentNo" disabled placeholder="请输入代理编号"/>
                </u-form-item>
                <u-form-item label="备注" prop="remark">
                    <u-input v-model="formData.remark" disabled placeholder="请输入备注"/>
                </u-form-item>
                <u-form-item label="登录标识" prop="loginAccount">
                    <u-input v-model="formData.loginAccount" disabled placeholder="请输入登录标识"/>
                </u-form-item>
                <!-- 手续费详情 -->
                <u-form-item label="批量手续费" prop="fee">
                    <u-input v-model="formData.fee" disabled placeholder="请输入"/>
                </u-form-item>
                <u-form-item label="微信手续费" prop="wechatFee">
                    <u-input v-model="formData.wechatFee" disabled placeholder="请输入"/>
                </u-form-item>
                <u-form-item label="支付宝手续费" prop="alipayFee">
                    <u-input v-model="formData.alipayFee" disabled placeholder="请输入"/>
                </u-form-item>
                <u-form-item label="云闪付手续费" prop="unionpayFee">
                    <u-input v-model="formData.unionpayFee" disabled placeholder="请输入"/>
                </u-form-item>
                <u-form-item label="借记卡费率" prop="rateOneDebit">
                    <u-input v-model="formData.rateOneDebit" disabled placeholder="请输入"/>
                </u-form-item>
                <u-form-item label="借记卡费率" prop="rateTwoDebit">
                    <u-input v-model="formData.rateTwoDebit" disabled placeholder="请输入"/>
                </u-form-item>
                <u-form-item label="借记卡费率" prop="rateDebitCap">
                    <u-input v-model="formData.rateDebitCap" disabled placeholder="请输入"/>
                </u-form-item>
                <u-form-item label="贷记卡费率" prop="rateOneCredit">
                    <u-input v-model="formData.rateOneCredit" disabled placeholder="请输入"/>
                </u-form-item>
                <u-form-item label="贷记卡费率" prop="rateTwoCredit">
                    <u-input v-model="formData.rateTwoCredit" disabled placeholder="请输入"/>
                </u-form-item>
                <u-form-item label="分账手续费" prop="sharingFee">
                    <u-input v-model="formData.sharingFee" disabled placeholder="请输入"/>
                </u-form-item>
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
import VueFormGenerator from "vue-form-generator";
// import "vue-form-generator/dist/vfg.css"; 
// Vue.use(VueFormGenerator);

export default {
    components: {
		"vue-form-generator": VueFormGenerator.component
	},
    data() {
        return {
            // 表单自动生成器
            model: {
                id: 1,
                name: 'John Doe',
                password: 'J0hnD03!x4',
                skills: ['Javascript', 'VueJS'],
                email: 'john.doe@gmail.com',
                status: true
            },
            schema: {
                fields: [
                    {
                        type: 'input',
                        inputType: 'text',
                        label: 'ID (disabled text field)',
                        model: 'id',
                        readonly: true,
                        disabled: true
                    },
                    {
                        type: 'input',
                        inputType: 'text',
                        label: 'Name',
                        model: 'name',
                        placeholder: 'Your name',
                        featured: true,
                        required: true
                    },
                    {
                        type: 'input',
                        inputType: 'password',
                        label: 'Password',
                        model: 'password',
                        min: 6,
                        required: true,
                        hint: 'Minimum 6 characters',
                        // validator: VueFormGenerator.validators.string
                    },
                    {
                        type: 'select',
                        label: 'Skills',
                        model: 'skills',
                        values: ['Javascript', 'VueJS', 'CSS3', 'HTML5']
                    },
                    {
                        type: 'input',
                        inputType: 'email',
                        label: 'E-mail',
                        model: 'email',
                        placeholder: 'User\'s e-mail address'
                    },
                    {
                        type: 'checkbox',
                        label: 'Status',
                        model: 'status',
                        default: true
                    }
                ]
            },
            formOptions: {
                validateAfterLoad: true,
                validateAfterChanged: true,
                validateAsync: true
            },

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