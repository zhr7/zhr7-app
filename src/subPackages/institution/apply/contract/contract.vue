<template>
    <view>
        <u-collapse :item-style="itemStyle" v-if="itemList.length>0">
            <u-collapse-item :index="index" title="电子合同" v-for="(item, index) in itemList" :key="index" :open="true">
                <view class="collapse-item">
                    <u-table align="center">
                        <u-tr class="u-tr">
                            <u-th class="u-th">合同编号</u-th>
                            <u-td class="u-td">{{ item.contractNo || '-' }}</u-td>
                        </u-tr>
                        <u-tr class="u-tr">
                            <u-td style="background-color: #f3f4f6;">
                                <u-tr class="u-tr"><u-th class="u-th">签约二维码</u-th></u-tr>
                                <u-tr class="u-tr"><u-th class="u-th"><u-button type="success" size="mini" @click="copyLink(item.signUrl)">复制链接</u-button></u-th></u-tr>
                                <u-tr class="u-tr"><u-th class="u-th"><u-button type="warning" size="mini" @click="saveImage(item.signUrl)">保存图片</u-button></u-th></u-tr>
                            </u-td>
                            <u-td>
                                <u-tr class="u-tr"><u-td><tki-qrcode class="qrcode" :val="item.signUrl" :size="300" :show="true" :loadMake="true" @result="qrR"/></u-td></u-tr>
                            </u-td>
                        </u-tr>
                        <u-tr class="u-tr">
                            <u-th class="u-th">签约状态</u-th>
                            <u-td class="u-td" v-if="item.status == 'WAITING'">待签约</u-td>
                            <u-td class="u-td" v-if="item.status == 'SUCCESS'">已签约</u-td>
                            <u-td class="u-td" v-if="item.status == 'FAIL'">签约失败</u-td>
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
import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'
export default {
    components: {
        tkiQrcode,
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
            qrcodeSrc: '',
        }
    },
    onShow() {
        this.item = RouteParams();
        this.getInfo()
    },
    onLoad() {
    },
    mounted() {
        this.initStorageToken()
        this.getInfo()
    },
    created() {
        uni.setNavigationBarTitle({
            title:'电子合同'
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
            this.$u.api.v3.institution.apply.ContractQuery({channelId: this.item.id}).then(res => {
                if(res.contractList.length > 0){
                    this.itemList = res.contractList
                }else {
                    this.info = '暂无数据'
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
        copyLink(url) {
            uni.setClipboardData({
                data: url,
                success: function(res) {
                uni.showToast({
                    duration: 10000,
                    title: '复制成功',
                    icon: 'success'
                });
                }
            });
        },
        qrR(res) {
            this.qrcodeSrc = res
            console.log(this.qrcodeSrc)
        },
        saveImage() {
            uni.saveImageToPhotosAlbum({
                filePath: this.qrcodeSrc,
                success: function(res) {
                uni.showToast({
                    duration: 10000,
                    title: '保存成功',
                    icon: 'success'
                });
                },
                fail: function(err) {
                uni.showToast({
                    duration: 10000,
                    title: '保存失败',
                    icon: 'none'
                });
                }
            });
        }
    }
}
</script>
<style lang="scss" scoped>
    .collapse-item {
		padding-bottom: 20rpx;
        height: 480rpx;
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