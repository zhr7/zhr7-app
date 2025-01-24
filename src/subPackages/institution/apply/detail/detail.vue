<template>
    <u-collapse :item-style="itemStyle">
        <!-- <view class="uni-container">
			<uni-table ref="table" :loading="loading" border emptyText="暂无更多数据" @selection-change="selectionChange">
				<uni-tr>
					<uni-th width="100" align="center">日期</uni-th>
					<uni-th width="100" align="center">姓名</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in tableData" :key="index">
					<uni-td>{{ item.date }}</uni-td>
					<uni-td>
						<view class="name">{{ item.name }}</view>
					</uni-td>
					<uni-td align="center">{{ item.address }}</uni-td>
					<uni-td>
						<view class="uni-group">
							<button class="uni-button" size="mini" type="primary">修改</button>
							<button class="uni-button" size="mini" type="warn">删除</button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
			<view class="uni-pagination-box"><uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total" @change="change" /></view>
		</view> -->

		<u-collapse-item :index="index" title="营业执照信息" v-for="(item, index) in itemList" :key="index" :open="item.open">
			<view class="collapse-item">
                <u-table>
                    <u-tr class="u-tr">
                        <u-th class="u-th">营业执照商户名称</u-th>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-td class="u-td">{{ item.licenseMerchantName }}</u-td>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-th class="u-th">营业执照代码</u-th>
                        <u-th class="u-th">营业执照主体类型</u-th>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-td class="u-td">{{ item.licenseCode }}</u-td>
                        <u-td class="u-td">{{ item.licenseSubjectTypeName }}</u-td>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-th class="u-th">微信经营类目</u-th>
                        <u-th class="u-th">MCC类目</u-th>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-td class="u-td">{{ item.wechatCategoryCodeValue }}</u-td>
                        <u-td class="u-td">{{ item.mccCategoryCodeValue }}</u-td>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-th class="u-th">营业执照地址</u-th>
                        <u-th v-if="item.licenseSubjectType=='SUBJECT_TYPE_INDIVIDUAL'||item.licenseSubjectType=='SUBJECT_TYPE_ENTERPRISE'||item.licenseSubjectType=='SUBJECT_TYPE_STOCK_COMPANY'" class="u-th">营业执照照片</u-th>
                        <u-th v-if="item.licenseSubjectType=='SUBJECT_TYPE_PERSONAL'" class="u-th">手持身份证照片</u-th>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-td class="u-td">{{ item.licenseAddress }}</u-td>
                        <!-- <td class="u-td">
                            <u-image width="50%" mode="widthFix" :src="imgUrlLicense"></u-image>
                        </td> -->
                        <td class="u-td" v-if="item.licenseSubjectType=='SUBJECT_TYPE_INDIVIDUAL'||item.licenseSubjectType=='SUBJECT_TYPE_ENTERPRISE'||item.licenseSubjectType=='SUBJECT_TYPE_STOCK_COMPANY'">
                            <uni-file-picker v-model="imgUrlLicense"
                                fileMediatype="image" 
                                :image-styles="imageStyles"
                                mode="grid" 
                                :del-icon="false"
                                limit="1"
                                @select="selectLicensePic" 
                            />
                        </td>
                        <td class="u-td" v-if="item.licenseSubjectType=='SUBJECT_TYPE_PERSONAL'">
                            <uni-file-picker v-model="imgUrlHand"
                                fileMediatype="image" 
                                :image-styles="imageStyles"
                                mode="grid" 
                                :del-icon="false"
                                limit="1"
                                @select="selectHandPic" 
                            />
                        </td>
                    </u-tr>
                </u-table>
			</view>
		</u-collapse-item>
        <u-collapse-item :index="index" title="法人信息" v-for="(item, index) in itemList" :key="index" :open="item.open">
			<view class="collapse-item1">
                <u-table>
                    <u-tr class="u-tr">
                        <u-th class="u-th">法人姓名</u-th>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-td class="u-td">{{ item.legalPerson }}</u-td>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-th class="u-th">法人身份证号</u-th>
                        <u-th class="u-th">法人电话</u-th>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-td class="u-td">{{ item.legalPersonCardNo }}</u-td>
                        <u-td class="u-td">{{ item.legalPersonPhone }}</u-td>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-th class="u-th">法人身份证有效期开始</u-th>
                        <u-th class="u-th">法人身份证有效期结束</u-th>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-td class="u-td">{{ item.legalPersonCardPeriodBegin }}</u-td>
                        <u-td class="u-td">{{ item.legalPersonCardPeriodEnd }}</u-td>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-th class="u-th">法人身份证人像面照片</u-th>
                        <u-th class="u-th">法人身份证国徽面照片</u-th>
                    </u-tr>
                    <u-tr class="u-tr">
                        <td class="u-td">
                            <!-- <u-image width="50%" mode="widthFix" :src="imgUrlCard"></u-image> -->
                            <uni-file-picker v-model="imgUrlCard"
                                fileMediatype="image" 
                                :image-styles="imageStyles"
                                mode="grid" 
                                :del-icon="false"
                                limit="1"
                                @select="selectIdCardCopy" 
                            />
                        </td>
                        <td class="u-td">
                            <!-- <u-image width="50%" mode="widthFix" :src="imgUrlCardNational"></u-image> -->
                            <uni-file-picker v-model="imgUrlCardNational"
                                fileMediatype="image" 
                                :image-styles="imageStyles"
                                mode="grid" 
                                :del-icon="false"
                                limit="1"
                                @select="selectIdCardNational" 
                            />
                        </td>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-th class="u-th">法人身份证地址</u-th>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-td class="u-td">{{ item.legalPersonCardCardAddress }}</u-td>
                    </u-tr>
                </u-table>
			</view>
		</u-collapse-item>
        <u-collapse-item :index="index" title="结算信息" v-for="(item, index) in itemList" :key="index" :open="item.open">
			<view class="collapse-item2">
                <u-table>
                    <u-tr class="u-tr">
                        <u-th class="u-th">账户户名</u-th>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-td class="u-td">{{ item.bankAccountName }}</u-td>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-th class="u-th">银行账号</u-th>
                        <u-th class="u-th">账户类型</u-th>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-td class="u-td">{{ item.bankAccountNo }}</u-td>
                        <u-td class="u-td" v-if="item.bankAccountType=='CORPORATE'">对公银行账户</u-td>
                        <u-td class="u-td" v-if="item.bankAccountType=='PERSONAL'">个人银行卡</u-td>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-th class="u-th">开户银行</u-th>
                        <u-th class="u-th">银行卡照片</u-th>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-td class="u-td">{{ item.bankAccountBank }}</u-td>
                        <td class="u-td">
                            <!-- <u-image width="50%" mode="widthFix" :src="imgUrlbankCard"></u-image> -->
                            <uni-file-picker v-model="imgUrlbankCard"
                                fileMediatype="image" 
                                :image-styles="imageStyles"
                                mode="grid" 
                                :del-icon="false"
                                limit="1"
                                @select="selectBankCardCopy" 
                            />
                        </td>
                    </u-tr>
                </u-table>
			</view>
		</u-collapse-item>
        <u-collapse-item :index="index" title="结算信息" v-for="(item, index) in itemList" :key="index" :open="item.open">
			<view class="collapse-item3">
                <u-table>
                    <u-tr>
                        <u-th class="u-th">门店联系人</u-th>
                    </u-tr>
                    <u-tr>
                        <u-td class="u-td">{{ item.storePerson }}</u-td>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-th class="u-th">门店简称</u-th>
                        <u-th class="u-th">门店名称</u-th>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-td class="u-td">{{ item.storeShortName }}</u-td>
                        <u-td class="u-td">{{ item.storeBusinessName }}</u-td>
                    </u-tr>
                    <u-tr class="u-tr">
                        
                        <u-th class="u-th">门店邮箱</u-th>
                        <u-th class="u-th">门店电话</u-th>
                    </u-tr>
                    <u-tr class="u-tr">
                        
                        <u-td class="u-td">{{ item.storeEmail }}</u-td>
                        <u-td class="u-td">{{ item.storePhone }}</u-td>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-th class="u-th">门店地址</u-th>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-td class="u-td">{{ item.storeAddress }}</u-td>
                    </u-tr>
                    <u-tr class="u-tr">
                        <u-th class="u-th">门店门头照</u-th>
                        <u-th class="u-th">店内环境照</u-th>
                        <u-th class="u-th">门店收银照</u-th>
                    </u-tr>
                    <u-tr class="u-tr">
                        <td class="u-td">
                            <!-- <u-image width="50%" mode="widthFix" :src="imgUrlEntrance"></u-image> -->
                            <uni-file-picker v-model="imgUrlEntrance"
                                fileMediatype="image" 
                                :image-styles="imageStyles"
                                mode="grid" 
                                :del-icon="false"
                                limit="1"
                                @select="selectStoreEntrancePic" 
                            />
                        </td>
                        <td class="u-td">
                            <!-- <u-image width="50%" mode="widthFix" :src="imgUrlIndoor"></u-image> -->
                            <uni-file-picker v-model="imgUrlIndoor"
                                fileMediatype="image" 
                                :image-styles="imageStyles"
                                mode="grid" 
                                :del-icon="false"
                                limit="1"
                                @select="selectStoreIndoorPic" 
                            />
                        </td>
                        <td class="u-td">
                            <!-- <u-image width="50%" mode="widthFix" :src="imgUrlFrontDesk"></u-image> -->
                            <uni-file-picker v-model="imgUrlFrontDesk"
                                fileMediatype="image" 
                                :image-styles="imageStyles"
                                mode="grid" 
                                :del-icon="false"
                                limit="1"
                                @select="selectStoreFrontDeskPic" 
                            />
                        </td>
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
                imageStyles:{
                    textAlign: 'center',
                    width:60,
                    height:60,
                },
                imgUrlLicense: '',
                imgUrlHand: '',
                imgUrlCard: '',
                imgUrlCardNational: '',
                imgUrlbankCard: '',
                imgUrlEntrance: '',
                imgUrlIndoor: '',
                imgUrlFrontDesk: '',
                itemStyle: {
                    marginTop: '20px',
                    backgroundColor: '#fff',
                    padding: '10px',
                },
                itemList: [],
                formData: {
                    businessCode: '', // 业务申请编号
                    licenseSubjectType: '', // 主体类型 
                    legalPersonCardHandPic: '', // 手持身份证照片
                    // 营业执照
                    licensePic: '', // 营业执照照片
                    licenseCode: '', // 营业执照代码
                    licenseMerchantName: '', // 营业执照商户名称
                    licensePersonCardPeriodBegin: '', // 营业执照有效期开始时间
                    licensePersonCardPeriodEnd: '', // 营业执照有效期结束时间
                    licenseDistrictCode: '', // 营业执照省市县
                    licenseAddress: '', // 营业执照地址
                    licenseBusinessRange: '', // 营业执照经营范围
                    licenseCityCode: '', 
                    licenseProvinceCode: '',
                    //法人信息
                    legalPerson: '', // 法人姓名
                    legalPersonPhone: '', // 法人电话
                    // 身份证
                    legalPersonCardPic: '',    // 身份证人像面照片
                    legalPersonCardNationalPic: '',    // 身份证国徽面照片
                    legalPersonCardNo: '',    // 法人身份证号
                    legalPersonCardCardAddress: '',    // 法人身份证地址
                    legalPersonCardPeriodBegin: '',  // 身份证有效期开始
                    legalPersonCardPeriodEnd: '',  // 身份证有效期结束
                    // 银行结算资料
                    bankCardPic: '',    // 银行卡照片
                    bankAccountType: '', // 账户类型[对公银行账户、经营者个人银行卡]
                    bankAccountBank: '', // 开户银行
                    bankAccountNo: '',     // 银行账号
                    bankAccountName: '',   // 账户户名
                    bankCityCode: '', 
                    bankProvinceCode: '',
                    //门店信息
                    storeShortName: '', // 门店简称
                    storeBusinessName: '', // 门店商户名称
                    storePerson: '',    // 门店联系人
                    storePhone: '',    // 门店电话
                    storeEmail: '',    // 门店邮箱
                    storeAddress: '',    // 门店地址
                    wechatCategoryCode: '',  // 微信经营类目
                    mccCategoryCode: '',  // MCC类目
                    storeEntrancePic: '',  // 门店门头照片
                    storeIndoorPic: '',  // 店内环境照片
                    storeFrontDeskPic: '',  // 前台照片
                },
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
				title:'进件详情'
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
                this.$u.api.v3.institution.apply.Get({id: this.item.id}).then(res => {
                    if(res){
                        this.formData = res.item
                        this.formData.open = true
                        let filter = "{ \"bankCode\": { \"$regex\": \"" + res.item.bankChannelNo + "\", \"$options\": \"i\" } }"
                        this.$u.api.v3.institution.apply.SearchBankInfo({filter}).then(res => {
                            this.formData.bankName = res.items[0].bankName
                        }).catch(err => {
                            console.log(err);
                            uni.showToast({
                                duration: 10000,
                                icon:'error',
                                title: err.data,
                            })
                        })
                        if(res.item.licenseSubjectType == 'SUBJECT_TYPE_ENTERPRISE' || res.item.licenseSubjectType == 'SUBJECT_TYPE_INDIVIDUAL' || res.item.licenseSubjectType == 'SUBJECT_TYPE_STOCK_COMPANY'){
                            let licensePic = res.item.licensePic
                            this.getUploadImage(licensePic, 'licensePic')
                        }else if(res.item.licenseSubjectType == 'SUBJECT_TYPE_PERSONAL'){
                            let legalPersonCardHandPic = res.item.legalPersonCardHandPic
                            this.getUploadImage(legalPersonCardHandPic, 'legalPersonCardHandPic')
                        }
                        this.getUploadImage(res.item.legalPersonCardPic, 'legalPersonCardPic')
                        this.getUploadImage(res.item.legalPersonCardNationalPic, 'legalPersonCardNationalPic')
                        this.getUploadImage(res.item.bankCardPic, 'bankCardPic')
                        //门店照片
                        this.getUploadImage(res.item.storeEntrancePic, 'storeEntrancePic')
                        this.getUploadImage(res.item.storeIndoorPic, 'storeIndoorPic')
                        this.getUploadImage(res.item.storeFrontDeskPic, 'storeFrontDeskPic')
                        if(res.item.licenseSubjectType == 'SUBJECT_TYPE_PERSONAL'){
                            this.formData.licenseSubjectTypeName = '小微商户'
                        }else if(res.item.licenseSubjectType == 'SUBJECT_TYPE_INDIVIDUAL'){
                            this.formData.licenseSubjectTypeName = '个体户'
                        }else if(res.item.licenseSubjectType == 'SUBJECT_TYPE_ENTERPRISE'){
                            this.formData.licenseSubjectTypeName = '企业'
                        }else if(res.item.licenseSubjectType == 'SUBJECT_TYPE_STOCK_COMPANY'){
                            this.formData.licenseSubjectTypeName = '股份有限公司'
                        }else if(res.item.licenseSubjectType == 'SUBJECT_TYPE_GOVERNMENT'){
                            this.formData.licenseSubjectTypeName = '政府机关'
                        }else if(res.item.licenseSubjectType == 'SUBJECT_TYPE_INSTITUTIONS'){
                            this.formData.licenseSubjectTypeName = '事业单位'
                        }else{
                            this.formData.licenseSubjectTypeName = '其他 社会组织'
                        }
                        let wechatCategoryCodeValue = JSON.parse(res.item.wechatCategoryCode)
                        this.formData.wechatCategoryCodeValue = wechatCategoryCodeValue.join('-')
                        let mccCategoryCodeValue = JSON.parse(res.item.mccCategoryCode)
                        this.formData.mccCategoryCodeValue = mccCategoryCodeValue.join('-')
                        this.itemList.push(this.formData)
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
            async getUploadImage(path,name) {
                try {
                    const res = await this.$u.api.v3.storage.file.GetUploadImage({
                        provider: 'qiniu',
                        key: path,
                    });
                    let value1 = []
                    value1.push(res)
                    if(name == 'licensePic'){
                        // this.imgUrlLicense = res.url
                        this.imgUrlLicense = value1
                    }else if(name == 'legalPersonCardHandPic'){
                        // this.imgUrlHand = res.url
                        this.imgUrlHand = value1
                    }else if(name == 'legalPersonCardNationalPic'){
                        // this.imgUrlCardNational = res.url
                        this.imgUrlCardNational = value1
                    }else if(name == 'legalPersonCardPic'){
                        // this.imgUrlCard = res.url
                        this.imgUrlCard = value1
                    }else if(name == 'bankCardPic'){
                        // this.imgUrlbankCard = res.url
                        this.imgUrlbankCard = value1
                    }else if(name == 'storeEntrancePic'){
                        // this.imgUrlEntrance = res.url
                        this.imgUrlEntrance = value1
                    }else if(name == 'storeIndoorPic'){
                        // this.imgUrlIndoor = res.url
                        this.imgUrlIndoor = value1
                    }else if(name == 'storeFrontDeskPic'){
                        // this.imgUrlFrontDesk = res.url
                        this.imgUrlFrontDesk = value1
                    }
                } catch (err) {
                    console.log(err);
                    uni.showToast({
                        duration: 10000,
                        icon: 'error',
                        title: err.data,
                    });
                }
            },
        }
    }
</script>
<style lang="scss" scoped>
    .collapse-item {
		padding-bottom: 20rpx;
        height: 580rpx;
	}
    .collapse-item1 {
		padding-bottom: 20rpx;
        height: 650rpx;
	}
    .collapse-item2 {
		padding-bottom: 20rpx;
        height: 430rpx;
	}
    .collapse-item3 {
		padding-bottom: 20rpx;
        height: 710rpx;
	}
    .u-td {
        width: 50%;
        margin: 0 auto;
    }
    // .u-tr {
    //     text-align: center;
    // }
</style>