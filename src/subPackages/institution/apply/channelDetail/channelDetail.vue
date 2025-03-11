<template>
    <u-collapse :item-style="itemStyle">
		<u-collapse-item :index="index" :title="item.commonName" v-for="(item, index) in itemList" :key="index" :open="true">
                <view class="collapse-item">
                    <u-table>
                        <u-tr class="u-tr">
                            <u-th class="u-th">业务代码</u-th>
                            <u-th class="u-th">创建时间</u-th>
                        </u-tr>
                        <u-tr class="u-tr">
                            <u-td class="u-td">{{ item.businessCode }}</u-td>
                            <u-td class="u-td">{{ parseTime(item.createdAt) }}</u-td>
                        </u-tr>
                        <u-tr class="u-tr">
                            <u-th class="u-th">进件渠道</u-th>
                            <u-th class="u-th">商户号</u-th>
                        </u-tr>
                        <u-tr class="u-tr">
                            <u-td class="u-td">{{ item.commonName }}</u-td>
                            <u-td class="u-td">{{ item.subMerId || '/'}}</u-td>
                        </u-tr>
                        <u-tr class="u-tr">
                            <u-th class="u-th">状态</u-th>
                            <u-th class="u-th">配置</u-th>
                        </u-tr>
                        <u-tr class="u-tr">
                            <u-td class="u-td" v-if="item.status=='PENDING'">商户待提交</u-td>
                            <u-td class="u-td" v-if="item.status=='APPROVED'">商户初审通过</u-td>
                            <u-td class="u-td" v-if="item.status=='REJECTED'">商户审核未通过</u-td>
                            <u-td class="u-td" v-if="item.status=='UNDER_REVIEW'">商户待审核</u-td>
                            <u-td class="u-td" v-if="item.status=='ACTIVE'">商户已启用</u-td>
                            <u-td class="u-td" v-if="item.status=='SUSPENDED'">商户暂停服务</u-td>
                            <u-td class="u-td" v-if="item.status=='CLOSED'">商户关闭</u-td>
                            <u-td class="u-td">{{ item.config.slice(0, 20) + '...' }}</u-td>
                        </u-tr>
                        <u-tr class="u-tr">
                            <u-th class="u-th">操作</u-th>
                        </u-tr>
                        <u-tr class="u-tr">
                            <u-td class="u-td">
                                <u-row v-if="item.commonName.includes('盛付通')">
                                    <u-col span="2">
                                        <u-button type="primary" size="mini" :custom-style="customStyle" :throttle-time="500" @click="toApplyQuery(item)">进件查询</u-button>
                                    </u-col>
                                    <u-col span="2" v-if="!item.commonName.includes('华夏')">
                                        <u-button type="warning" size="mini" :custom-style="customStyle" :throttle-time="500" @click="toContract(item)">电子合同</u-button>
                                    </u-col>
                                    <u-col span="2">
                                        <u-button type="error" size="mini" :custom-style="customStyle" :throttle-time="500" @click="toRealName(item)">实名认证</u-button>
                                    </u-col>
                                    <u-col span="2">
                                        <u-button type="success" size="mini" :custom-style="customStyle" :throttle-time="500" @click="towechatConfig(item)">微信配置</u-button>
                                    </u-col>
                                    <u-col span="2">
                                        <u-button type="primary" size="mini" :custom-style="customStyle" :throttle-time="500" @click="toBankChange(item)">结算银行</u-button>
                                    </u-col>
                                    <u-col span="2">
                                        <u-button type="warning" size="mini" :custom-style="customStyle" :throttle-time="500" @click="toRateChange(item)">费率变更</u-button>
                                    </u-col>
                                </u-row>
                                <u-row v-else>
                                    <u-col span="3">
                                        <u-button type="primary" size="mini" :throttle-time="500" @click="toApplyQuery(item)">进件查询</u-button>
                                    </u-col>
                                    <u-col span="3" v-if="!item.commonName.includes('华夏')">
                                        <u-button type="warning" size="mini" :throttle-time="500" @click="toContract(item)">电子合同</u-button>
                                    </u-col>
                                    <u-col span="3">
                                        <u-button type="error" size="mini" :throttle-time="500" @click="toRealName(item)">实名认证</u-button>
                                    </u-col>
                                    <u-col span="3">
                                        <u-button type="success" size="mini" :throttle-time="500" @click="towechatConfig(item)">微信配置</u-button>
                                    </u-col>
                                </u-row>
                            </u-td>
                        </u-tr>
                        <u-tr class="u-tr" style="padding: 1px;">
                            <u-td class="u-td">
                                <u-button size="mini" type="error" :custom-style="{ width: '80%'}" :throttle-time="500" @click="toDeleteChannel(item)">删除</u-button>
                            </u-td>
                        </u-tr>
                    </u-table>
                </view>
		</u-collapse-item>
    </u-collapse>
</template>
<script>
    import { parseTime, OCR, RouteParams } from '@/utils'
    export default {
        data() {
            return {
                itemStyle: {
                    marginTop: '20px',
                    backgroundColor: '#fff',
                    padding: '10px',
                },
                customStyle: {
                    // marginTop: '20px', 
                    padding: '0 2px',
                    width: '56px',
                },
                listQuery: {
					page: 1,
					pageSize: 15,
					filter: '',
					sort: JSON.stringify([{key: '_id', value: -1}]) 
				},
                itemList: [],
                formData: {
                    businessCode: '', // 业务申请编号
                    commonName: '', // 进件渠道名称
                    subMerId: '', // 商户号
                    status: '', // 状态
                    config: '', // 配置
                    createdAt: '', // 创建时间
                },
                // options: [
                //     {
                //         text: "删除",
                //         style: {
                //             // backgroundColor: "#dd524d",
                //             backgroundColor: "#ffffff",
                //             textAlign: "center",
                //             color: "#FF0000",
                //         },
                //     },
                // ],
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
		mounted() {
            this.initStorageToken()
            this.getInfo()
		},
        created() {
			uni.setNavigationBarTitle({
				title:'通道详情'
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
            parseTime(time){
				return parseTime(time)
			},
			replaceTime(time){
				time = time.replace("T", " ")
				return time.replace("+08:00", "")
			},
            toApplyQuery(item) {
                this.$u.api.v3.institution.apply.ChannelGet({id: item.id}).then(res => {
                    console.log(res);
                    if(res){
                        uni.showToast({
                            duration: 10000,
                            icon:'none',
                            title: res.message,
                        })
                        setTimeout(() => {
                            this.getInfo()
                        }, 5000);
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
            toContract(item) {
                this.$u.route({
                    type: 'to',
                    url: '/subPackages/institution/apply/contract/contract', 
                    params: item
                })
            },
            toRealName(item) {
                this.$u.route({
                    type: 'to',
                    url: '/subPackages/institution/apply/realName/realName', 
                    params: item
                })
            },
            towechatConfig(item) {
                this.$u.route({
                    type: 'to',
                    url: '/subPackages/institution/apply/wechatConfig/wechatConfig', 
                    params: item
                })
            },
            toBankChange(item) {
                this.$u.route({
                    type: 'to',
                    url: '/subPackages/institution/apply/bankChange/bankChange', 
                    params: item
                })
            },
            toRateChange(item){
                this.$u.route({
                    type: 'to',
                    url: '/subPackages/institution/apply/rateChange/rateChange', 
                    params: item
                })
            },
            getInfo() {
                let filter = {}
				if (this.item.id) {
					this.listQuery.applicationId = this.item.id
				}
				this.listQuery.filter = JSON.stringify(filter)
                this.$u.api.v3.institution.apply.ChannelSearch(this.listQuery).then(res => {
                    if(res){
                        this.itemList = res.items
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
            toDeleteChannel(item, index) {
    uni.showModal({
        title: '确认删除',
        content: '确定要删除这个通道吗？',
        success: (res) => {
            if (res.confirm) {
                this.$u.api.v3.institution.apply.ChannelDelete({id: item.id}).then(res => {
                    if(res){
                        if(res.valid){
                            uni.showToast({
                                duration: 10000,
                                icon:'none',
                                title: "删除成功",
                            })
                            setTimeout(() => {
                                this.$u.route({
                                    type: 'back',
                                    delta: 1,
                                })
                            }, 3000)
                        }
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
},
        }
    }
</script>
<style lang="scss" scoped>
    .collapse-item {
		padding-bottom: 20rpx;
        height: 560rpx;
	}
    .u-td {
        width: 50%;
        margin: 0 auto;
    }
</style>