<template>
    <view v-if="itemList.length>0">
        <u-collapse :item-style="itemStyle">
            <u-collapse-item :index="index" :title="item.applymentType" v-for="(item, index) in itemList" :key="index" :open="true">
                <view class="collapse-item">
                    <u-table align="center">
                        <u-tr class="u-tr">
                            <u-th class="u-th">绑定AppIds</u-th>
                            <u-td class="u-td">{{ item.subAppids[0] || '-' }}</u-td>
                        </u-tr>
                        <u-tr class="u-tr">
                            <u-th class="u-th">绑定支付授权路径</u-th>
                            <u-td class="u-td">{{ item.jsapiPaths[0] || '-' }}</u-td>
                        </u-tr>
                    </u-table>
                </view>
            </u-collapse-item>
        </u-collapse>
        <view class="item">
                <u-form :model="formData" ref="dataForm" label-width="260">
                <u-form-item label="Appid/授权路径" prop="appidOrPath" required>
                    <u-radio-group v-model="formData.appidOrPath">
                        <u-radio key="Appid" name="Appid">授权AppId</u-radio>
                        <u-radio key="Path" name="Path">支付授权路径</u-radio>
                    </u-radio-group>
                </u-form-item>
                <u-form-item label="添加AppId授权" prop="subAppid" v-if="formData.appidOrPath=='Appid'" required>
                    <u-input v-model="formData.subAppid" placeholder="请输入"/>
                </u-form-item>
                <u-form-item label="添加路径授权" prop="jsapiPath" v-if="formData.appidOrPath=='Path'" required>
                    <u-input v-model="formData.jsapiPath" placeholder="请输入"/>
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
            info: '',
            itemStyle: {
                marginTop: '20px',
                backgroundColor: '#fff',
                padding: '10px',
            },
            itemList: [],
            formData: {
                appidOrPath: 'Appid',
                subAppid: '',
                jsapiPath: '',
            },
            rules: {
                subAppid: [
                    { required: true, message: '请输入授权AppId', trigger: 'blur' },
                    {
                        pattern: /^[a-zA-Z0-9]{18}$/,
                        message: 'Appid 必须为 18 位字符',
                    },
                ],
                jsapiPath: [
                    { required: true, message: '请输入支付授权路径', trigger: 'blur' },
                    {
                        pattern: /^https:\/\/.*\/$/,
                        message: '路径必须以 https 开头并以 / 结尾',
                    },
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
            title:'微信配置'
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
                appidOrPath: 'Appid',
                subAppid: '',
                jsapiPath: '',
            }
        },
        getInfo() {
            this.itemList = [];
            this.$u.api.v3.institution.apply.ConfigQuery({channelId: this.item.id}).then(res => {
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
        submitForm(formName) {
            console.log(this.formData);
            this.$refs[formName].validate((valid) => {
                if (this.isSubmitting) return; // 如果正在提交，则不再执行
                this.isSubmitting = true; // 设置为不可点击状态
                this.formData.channelId = this.item.id
                if (valid) {
                    if(this.formData.appidOrPath == 'Appid'){
                        this.$u.api.v3.institution.apply.SubAppidConfig(this.formData).then(res => {
                            if (res.returnCode=='SUCCESS') {
                                this.initFormData()
                                console.log(res);
                                this.getInfo()
                                uni.showToast({
                                    duration: 10000,
                                    icon:'success',
                                    title: '配置成功',
                                })
                                this.isSubmitting = false;
                            }else {
                                uni.showToast({
                                    duration: 10000,
                                    icon:'error',
                                    title:'配置失败',
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
                    }else if(this.formData.appidOrPath == 'Path'){
                        this.$u.api.v3.institution.apply.JsapiPathConfig(this.formData).then(res => {
                            if (res.returnCode=='SUCCESS') {
                                this.initFormData()
                                console.log(res);
                                this.getInfo()
                                uni.showToast({
                                    duration: 10000,
                                    icon:'success',
                                    title: '配置成功',
                                })
                                this.isSubmitting = false;
                            }else {
                                uni.showToast({
                                    duration: 10000,
                                    icon:'error',
                                    title:'配置失败',
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
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .collapse-item {
		padding-bottom: 20rpx;
        height:160rpx;
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