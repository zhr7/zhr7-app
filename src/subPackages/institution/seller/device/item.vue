<template>
	<view>
		<view class="item">
            <u-form :model="formData" ref="dataForm" label-width="150">
                <u-form-item label="商家门店" prop="userName">
                    {{formData.userName}}
                </u-form-item>
				<u-form-item label="绑定付款码" prop="build">
                    {{formData.build}}
                </u-form-item>
				<u-form-item
						label="设备品牌"
						prop="drive"
						border-bottom
						@click="actionSheetShow = true; hideKeyboard()"
						ref="item1"
					>
						<u-input
							v-model="deviceName"
							disabled
							:border="false"
							@click="actionSheetShow = true; hideKeyboard()"
						></u-input>
						<u-icon
							slot="right"
							name="arrow-right"
							@click="actionSheetShow = true; hideKeyboard()"
						></u-icon>
				</u-form-item>
				<u-form-item label="设备类型" prop="deviceId">
					<uni-data-checkbox v-model="formData.driveType" multiple :localdata="range" @change="checkboxChange"></uni-data-checkbox>
                </u-form-item>
                <u-form-item label="设备号" prop="deviceId">
                    <u-input v-model="formData.deviceId"/>
                </u-form-item>
				<u-form-item label="设备密钥" prop="deviceKey" v-if="formData.drive==='yilianyun'">
                    <u-input v-model="formData.deviceKey"/>
                </u-form-item>
				<u-form-item label="打印模板" prop="printTemplate" v-if="isPrintTemplate" >
                    <u-input type="textarea" v-model="formData.printTemplate" :border="true" :height="100" :auto-height="true" :maxlength="-1"/>
                </u-form-item>
            </u-form>
            <u-line />
            <view class="bottom">	
                <u-button 
					v-if="formData.id"
					class="b-button"
                    type="warning" 
                    @click="submitForm('dataForm')"
                >
                    修改设备
                </u-button>
				<u-button 
					v-if="formData.id"
					class="b-button"
                    type="error" 
                    @click="modalShow=true"
                >
                    删除设备
                </u-button>
				<u-button 
					v-if="!formData.id"
					class="a-button"
                    type="primary" 
                    @click="submitFormAdd('dataForm')"
                >
                    新增设备
                </u-button>
				
		    </view>	
			<u-action-sheet :list="actionSheetList" v-model="actionSheetShow" @click="clickAction"></u-action-sheet>
			<u-modal v-model="modalShow" :content="modalContent" :show-cancel-button="true" @confirm="submitDelete('dataForm')"></u-modal>
		</view>	
        <u-toast ref="uToast" />
	</view>
</template>
<script>
	import { RouteParams } from '@/utils'
	export default {
		computed: {
		},
		data() {
			return {
				modalShow: false,
				modalContent: '此操作将永久删除设备, 是否继续?',
				actionSheetList: [
					{
						text: '云想印',
						subText: 'yxyiot'
					},
					{
						text: '易联云',
						subText: 'yilianyun'
					},
					{
						text: '证通',
						subText: 'szzt'
					},
					{
						text: '掌优',
						subText: 'zhangyoobao'
					}
				],
				actionSheetShow: false,
				range: [
					{"value": "play","text": "云播报"	},{"value": "print","text": "云打印"}
				],
				deviceName: '',
				formData: {
					id: '',
					build: [],
					deviceId: '',
					deviceKey: '',
					drive: '',
					driveType: [],
					id: '',
					printTemplate: '',
					userId: '',
					userName: '',
				},
				isPrintTemplate: false
			}
		},
		watch: {
			formData: {
				handler(val, oldVal) {
					let valid = false
					this.formData.driveType.forEach(item => {
						if (item === 'print') {
							valid = true
							this.changeDriveType()
						}
					})
					this.isPrintTemplate = valid
				},
				deep: true
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'设备编辑'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
		},
		mounted() {
            this.init()   
		},
		methods: {
			init() {	//  初始化加载查询
				const routeParams = JSON.parse(JSON.stringify(RouteParams()))
				this.formDataValue(routeParams,'id')
				this.formDataValue(routeParams,'build')
				this.formDataValue(routeParams,'deviceId')
				this.formDataValue(routeParams,'deviceKey')
				this.formDataValue(routeParams,'drive')
				this.formDataValue(routeParams,'driveType')
				this.formDataValue(routeParams,'printTemplate')
				this.formDataValue(routeParams,'userId')
				this.formDataValue(routeParams,'userName')
				this.formDataValue(routeParams,'driveType')
				this.formDataValue(routeParams,'driveType')
				if (this.formData.build.length>0) {
					this.formData.build = JSON.parse(this.formData.build)
				}
				if (this.formData.driveType.length>0) {
					this.formData.driveType = JSON.parse(this.formData.driveType)
				}
				this.initDeviceName()
			},
			formDataValue(routeParams,name) {
				if (routeParams[name] == undefined) {
					switch (name) {
						case 'driveType':
							this.formData.driveType = []
							break;
						case 'build':
							this.formData.driveType = []
							break;
						default:
                    		this.formData[name] = ''
							break;
					}
                }else{
					this.formData[name] = routeParams[name]
				}
				return 
			},
			submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$u.api.institution.device.Update({
                            device: {
                                id: this.formData.id,
								userId: this.formData.userId,
								build: JSON.stringify(this.formData.build),
								userName: this.formData.userName,
								drive: this.formData.drive,
								driveType: JSON.stringify(this.formData.driveType),
								deviceId: this.formData.deviceId,
								deviceKey: this.formData.deviceKey,
								printTemplate: this.formData.printTemplate
                            }
                        }).then(res => {
                            if (res.valid) {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'success',
                                    title:'更新设备成功',
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
                                    title:'更新设备失败',
                                })
                            }
                        }).catch(err => {
                            console.log(err);
                            uni.showToast({
                                duration: 3000,
                                icon:'error',
                                title: err.datal,
                            })
                        })
                    }
                })
            },
			submitFormAdd(formName) {
				this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$u.api.institution.device.Create({
                            device: {
								userId: this.formData.userId,
								build: JSON.stringify(this.formData.build),
								userName: this.formData.userName,
								drive: this.formData.drive,
								driveType: JSON.stringify(this.formData.driveType),
								deviceId: this.formData.deviceId,
								deviceKey: this.formData.deviceKey,
								printTemplate: this.formData.printTemplate
                            }
                        }).then(res => {
                            if (res.valid) {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'success',
                                    title:'新增设备成功',
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
                                    title:'新增设备失败',
                                })
                            }
                        }).catch(err => {
                            console.log(err);
                            uni.showToast({
                                duration: 3000,
                                icon:'error',
                                title: err.datal,
                            })
                        })
                    }
                })
			},
			submitDelete(formName) {
				this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$u.api.institution.device.Delete({
                            device: {
								id: this.formData.id,
								userId: this.formData.userId,
                            }
                        }).then(res => {
                            if (res.valid) {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'success',
                                    title:'删除设备成功',
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
                                    title:'删除设备失败',
                                })
                            }
                        }).catch(err => {
                            console.log(err);
                            uni.showToast({
                                duration: 3000,
                                icon:'error',
                                title: err.datal,
                            })
                        })
                    }
                })
			},
			initDeviceName() {
				this.actionSheetList.forEach(element => {
					if (element.subText === this.formData.drive) {
						this.deviceName = element.text
					}
				});
			},
			clickAction(e) {
				this.deviceName = this.actionSheetList[e].text
				this.formData.drive = this.actionSheetList[e].subText
				this.changeDriveType()
			},
			checkboxChange(e) {
				this.changeDriveType()
			},
			changeDriveType() {
				this.formData.driveType.forEach(item => {
					if (item === 'print' && this.formData.printTemplate === '') {
					switch (this.formData.drive) {
						case 'yxyiot':
						this.formData.printTemplate = `<CB>必诚付</CB>
<S>商户门店: {{sellerName}}</S>
<S>交易类型: {{type}}</S>
<S>交易方式: {{method}}</S>
<S>收银员工: {{operatorName}}</S>
<S>订单编号: {{outTradeNo}}</S>
<S>订单名称: {{title}}</S>
<BOLD>订单金额: {{totalFee}}</BOLD>
<S>订单时间: {{createdAt}}</S>
<S>订单流水: {{tradeNo}}</S>
<S>银行流水: {{bankTradeNo}}</S>
<S>打印时间: {{printAt}}</S>
<S>商户地址: {{sellerAddress}}</S>
 
<C><BC128_A>{{outTradeNo}}</BC128_A><C>
<C><S>{{outTradeNo}}</S></C>
 
<S><C>技术支持</C></S>
<S>必诚必拓(山东)科技服务有限公司</S>
<CUT>`
						break
						case 'yilianyun':
						this.formData.printTemplate = `<CA><FS2>必诚付</FS2></CA>

商户门店: {{sellerName}}
交易类型: {{type}}
交易方式: {{method}}
收银员工: {{operatorName}}
订单编号: {{outTradeNo}}
订单名称: {{title}}
@@2订单金额: {{totalFee}}
订单时间: {{createdAt}}
订单流水: {{tradeNo}}
银行流水: {{bankTradeNo}}
打印时间: {{printAt}}
商户地址: {{sellerAddress}}
 
<BR3>{{outTradeNo}}</BR3>
 
<CA>技术支持</CA>
<CA>必诚必拓(山东)科技服务有限公司</CA>
 
`
						break
					}
					}
				})
			},
			hideKeyboard() {
				uni.hideKeyboard()
			}
		},
	}
</script>

<style lang="scss" scoped>
.item {
	background-color: #fff;
	height: 100%;
	padding: 5vw;
	.line {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 5px;
		padding-top: 10px;
		padding-bottom: 10px;
	}
	.info {
		color: #909399;
		font-size: 10px;
	}
	.right {
		text-align: right;
	}
	.totalFee {
		font-size: 20px;
		color: #ff0000;
		text-align: right;
	}
	.refundFee {
		color: #ff0000;
	}
}
.bottom {
	margin-top: 3vh;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding-bottom: 10vh;
	.b-button{
		width: 40vw;
	}
	.a-button{
		width: 90vw;
	}
}
.icon{
	font-size: 38px;
}
.primary{
	color: #409EFF;
}
.info{
	color: #909399;
	text-align: center;
}
.error{
	color: #F56C6C;
}
.success{
	color: #67C23A;
}
.warning{
	color: #E6A23C;
}
</style>

