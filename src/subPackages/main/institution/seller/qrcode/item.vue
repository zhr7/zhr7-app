<template>
	<view>
		<view class="item">
            <u-form :model="formData" ref="dataForm" label-width="150">
                <u-form-item label="商家门店" prop="userName">
                    {{formData.userName}}
                </u-form-item>
				<u-form-item label="名称" prop="qrcodeId">
                    <u-input v-model="formData.name"/>
                </u-form-item>
				<view class="qrcode">
					<tki-qrcode cid="qrcode" ref="qrcode" class="qrcode" :val="payQrcodeUrl+'?user_id='+formData.userId + '&operator_id='+formData.id" :size="400" :show="true" :loadMake="true" @result="qrR"/>
					<u-button type="info" @click="saveQrcodeToPhotosAlbum">保存二维码</u-button>
				</view>
            </u-form>
            <u-line />
            <view class="bottom">	
                <u-button 
					v-if="formData.id"
					class="b-button"
                    type="warning" 
                    @click="submitForm('dataForm')"
                >
                    修改付款码
                </u-button>
				<u-button 
					v-if="formData.id"
					class="b-button"
                    type="error" 
                    @click="modalShow=true"
                >
                    删除付款码
                </u-button>
				<u-button 
					v-if="!formData.id"
					class="a-button"
                    type="primary" 
                    @click="submitFormAdd('dataForm')"
                >
                    新增付款码
                </u-button>
				
		    </view>	
			<u-modal v-model="modalShow" :content="modalContent" :show-cancel-button="true" @confirm="submitDelete('dataForm')"></u-modal>
		</view>	
        <u-toast ref="uToast" />
	</view>
</template>
<script>
	import {  mapState } from 'vuex'
	import { RouteParams } from '@/utils'
	export default {
		computed: {
			...mapState({
				payQrcodeUrl: state => state.settings.payQrcodeUrl
			}),
		},
		data() {
			return {
				modalShow: false,
				modalContent: '此操作将永久删除付款码, 是否继续?',
				formData: {
					id: '',
					build: [],
					qrcodeId: '',
					qrcodeKey: '',
					drive: '',
					driveType: [],
					id: '',
					printTemplate: '',
					userId: '',
					userName: '',
				},
				isPrintTemplate: false,
				qrcodeSrc: ''
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'付款码编辑'
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
				this.formDataValue(routeParams,'name')
				this.formDataValue(routeParams,'userId')
				this.formDataValue(routeParams,'userName')
			},
			formDataValue(routeParams,name) {
				if (routeParams[name] == undefined) {
					this.formData[name] = ''
                }else{
					this.formData[name] = routeParams[name]
				}
				return 
			},
			qrR(res) {
				this.qrcodeSrc = res
			},
			saveQrcodeToPhotosAlbum(){
				console.log(this.qrcodeSrc);
				uni.saveImageToPhotosAlbum({
                    filePath: this.qrcodeSrc,
                    success() {
						uni.showToast({
							title: "保存成功",
							duration: 3000
						})
                    }
				})
			},
			submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$u.api.institution.qrcode.Update({
                            qrcode: {
                                id: this.formData.id,
								userId: this.formData.userId,
								userName: this.formData.userName,
								name: this.formData.name,
                            }
                        }).then(res => {
                            if (res.valid) {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'success',
                                    title:'更新付款码成功',
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
                                    title:'更新付款码失败',
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
                        this.$u.api.institution.qrcode.Create({
                            qrcode: {
								userId: this.formData.userId,
								userName: this.formData.userName,
								name: this.formData.name,
                            }
                        }).then(res => {
                            if (res.valid) {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'success',
                                    title:'新增付款码成功',
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
                                    title:'新增付款码失败',
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
                        this.$u.api.institution.qrcode.Delete({
                            qrcode: {
								id: this.formData.id,
								userId: this.formData.userId,
                            }
                        }).then(res => {
                            if (res.valid) {
                                uni.showToast({
                                    duration: 3000,
                                    icon:'success',
                                    title:'删除付款码成功',
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
                                    title:'删除付款码失败',
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
	.qrcode {
		width:200px;
		margin:0 auto;
		text-align:center;
		.title{
			margin-top: 20px;
			font-size: 16px;
		}
		.qrcode {
			margin: 10px;
			width:200px;
			height: 200px;
		}
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

