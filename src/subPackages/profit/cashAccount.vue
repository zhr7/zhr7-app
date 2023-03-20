<!--
 * @Author: BigRocs
 * @Date: 2023-02-11 10:06:28
 * @LastEditTime: 2023-03-19 16:38:18
 * @LastEditors: BigRocs
 * @Description: QQ: 532388887, Email:bigrocs@qq.com
-->
<template>
	<view class="item">
		<view class="content">
			<u-form :model="form" ref="uForm" label-width="190">
				<u-form-item label="账户类型">
					<u-radio-group v-model="formData.accountType">
						<u-radio 
							v-for="(item, index) in accountType" :key="index" 
							:name="item.value"
						>
							{{item.label}}
						</u-radio>
					</u-radio-group>	
				</u-form-item>
				<u-form-item label="开户名称"><u-input v-model="formData.accountName" /></u-form-item>
				<u-form-item label="银行账号"><u-input v-model="formData.accountNumber" /></u-form-item>
				<u-form-item label="开户银行"><u-input v-model="formData.accountBank" /></u-form-item>
				<u-form-item label="开户银行省市">
					<u-select v-model="show" mode="mutil-column-auto" :list="addressTree" @confirm="confirm"></u-select>
					<u-input v-model="formData.bankAddressCode" type="select" :border="true" @click="show = true" />
				</u-form-item>
				<u-form-item label="开户支行名称"><u-input v-model="formData.bankName" /></u-form-item>
			</u-form>
			<u-line />
            <view class="bottom">	
                <u-button 
                    type="warning" 
                    @click="submitForm()"
                >
                    确认修改
                </u-button>
		    </view>	
		</view>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
    import uKeyboard from '@/components/uview-ui/components/u-keyboard/u-keyboard.vue'
	import { AccountType } from './bankSetting';
	import { AddressTree } from './addressSetting';
	import { mapGetters } from 'vuex'
	export default {
		components: { 
			uKeyboard
		},
		computed: {
            ...mapGetters([
				'openid',
				'appid',
			])
		},
		data() {
			return {
				show: false,
				accountType: AccountType,
				addressTree: AddressTree,
                formData: {
					id: '',
					accountType: 'BANK_ACCOUNT_TYPE_CORPORATE',
					accountName: '',
					accountNumber: '',
					accountBank: '',
					bankAddressCode: '',
					bankName: ''
				},
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'分润银行账户'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
		},
		onLoad(options) {
			// this.$store.dispatch('user/getOpenid')
		},
		mounted() {
            this.init()
		},
		onPullDownRefresh() {
		},
		methods: {
            init() {
				this.$u.api.v3.profit.account.AccountGetByUserId({}).then((res) => {
					this.formData = JSON.parse(JSON.stringify(res.item));
				});
            },
			confirm(e) {
				this.formData.bankAddressCode = ''
				e.forEach(item => {
					if (this.formData.bankAddressCode!='') {
						this.formData.bankAddressCode += ','
					}
					this.formData.bankAddressCode += item.value
				});
			},
            submitForm() {
				this.$u.api.v3.profit.account.AccountCreateOrUpdate(this.formData).then((res) => {
                    if (res.valid) {
                        uni.showToast({
                            duration: 3000,
                            icon:'success',
                            title:'更新提现银行账户成功',
                        })
                        setTimeout(()=>{ 
                            this.$u.route({
                                type: 'back', 
                            })
                        }, 3000);
                    } else {
                        uni.showToast({
                            duration: 3000,
                            icon:'error',
                            title:'提现银行账户修改失败',
                        })
                    }
                }).catch(err => {
                    console.log(err);
                    uni.showToast({
                        duration: 3000,
                        icon:'error',
                        title: err.data.detail,
                    })
                })
			}
		},
        // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
        onReady() {
        }
	}
</script>

<style lang="scss" scoped>
	@import "uview-ui/libs/css/style.components.scss";
	.content {
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

<style scoped>

</style>