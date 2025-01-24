<template>
    <view>
        <u-collapse :item-style="itemStyle" v-if="itemList.length>0">
            <u-collapse-item :index="index" :title="item.applymentType" v-for="(item, index) in itemList" :key="index" :open="true">
                <view class="collapse-item">
                    <u-table align="center">
                        <u-tr class="u-tr">
                            <u-th class="u-th">商户号</u-th>
                            <u-td class="u-td">{{ item.subMchId || '-' }}</u-td>
                        </u-tr>
                        <u-tr class="u-tr">
                            <u-td style="background-color: #f3f4f6;">
                                <u-tr class="u-tr"><u-th class="u-th">二维码</u-th></u-tr>
                            </u-td>
                            <u-td>
                                <img :src="item.qrcodeData" alt="二维码" style="width: 300rpx; height: 300rpx;margin: 0 auto;">
                            </u-td>
                        </u-tr>
                        <u-tr class="u-tr">
                            <u-th class="u-th">状态</u-th>
                            <u-td class="u-td">{{ item.status || '-' }}</u-td>
                        </u-tr>
                    </u-table>
                </view>
            </u-collapse-item>
        </u-collapse>
        <view v-else><u-divider bg-color="#f3f4f6">{{info}}</u-divider></view>
    </view>
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
            title:'实名认证'
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
        getInfo() {
            this.itemList = [];
            console.log(this.itemList)
            this.$u.api.v3.institution.apply.ApplymentRealNameQuery({applymentType: 'wechat',channelId: this.item.id}).then(res => {
                if(res){
                    res.applymentType = '微信'
                    if(!res.qrcodeData.startsWith('http')){
                        res.qrcodeData = 'data:image/png;base64,' + res.qrcodeData
                    }
                    this.itemList.push(res)
                }
            }).catch(err => {
                console.log(err);
                uni.showToast({
                    duration: 10000,
                    icon:'error',
                    title: err.data,
                })
            })
            this.$u.api.v3.institution.apply.ApplymentRealNameQuery({applymentType: 'alipay',channelId: this.item.id}).then(res => {
                if(res){
                    res.applymentType = '支付宝'
                    if(!res.qrcodeData.startsWith('http')){
                        res.qrcodeData = 'data:image/png;base64,' + res.qrcodeData
                    }
                    this.itemList.push(res)
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
        }
    }
}
</script>
<style lang="scss" scoped>
    .collapse-item {
		padding-bottom: 20rpx;
        height: 540rpx;
	}
    .u-td {
        width: 80%;
        margin: 0 auto;
    }
    .custom-link {
        border: 1px solid #18b566;
        background-color: #19be6b;
        padding: 10rpx 0rpx 10rpx 0rpx!important;
        border-radius: 8rpx;
    }
</style>


