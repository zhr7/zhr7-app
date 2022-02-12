<template>
	<view class="content">
		<image class="logo" src="/static/logo-login.png"></image>
		<view class="login">
			<u-form ref="uForm" :model="form" :border-bottom="false" :error-type="errorType" >
				<u-form-item v-if="usePassword" label="账 号" prop="username">
					<u-input v-model="form.username" :border="true" :focus="!passwordFocus" confirm-type="next" @confirm="confirmNext" placeholder="请输入账号"/>
				</u-form-item>
				<u-form-item v-if="usePassword" :focus="passwordFocus" label="密 码" prop="password">
					<u-input v-model="form.password" type="password" :border="true" confirm-type="done"  @confirm="submit" placeholder="请输入密码"/>
				</u-form-item>
				<u-form-item v-if="!usePassword" label="账号" prop="username">
					<u-input :border="false" type="select" :select-open="auth.show" v-model="auth.usernme" placeholder="请选择登录账号" @click="auth.show = !auth.show"></u-input>
				</u-form-item>
				<u-form-item label="账号密码登录" prop="usePassword" label-width="200">
					<u-switch v-model="usePassword" slot="right"></u-switch>
				</u-form-item>
				<u-form-item >
					<u-button type="warning" shape="square" :disabled="disabled" class="submit" :ripple="true" @click="submit">登录</u-button>
				</u-form-item>
			</u-form>
			<u-action-sheet :list="listActionSheet" v-model="auth.show" @click="clickActionSheet"></u-action-sheet>
			<!-- <view class="agreement">
				<u-checkbox v-model="check"></u-checkbox>
				<view class="agreement-text">
					勾选代表同意协议
				</view>
			</view> -->
		</view>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	export default {
		data() {
			return {
				passwordFocus: false,
				auth: {
					usernme: '',
					show: false,
				},
				users: {},
				listActionSheet: [],
				form: {
					username: '',
					password: '',
				},
				usePassword: false,
				disabled: false,
				check: false,
				errorType: ['border','toast'],
				rules: {
					username: [
						{
							required: true,
							message: '请输入账号',
							trigger: ['change','blur']
						},
					],
					password: [
						{
							required: true,
							message: '请输入密码',
							trigger: ['change','blur']
						},
					],
				}
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		created() {
			// #ifdef MP-WEIXIN  
			uni.hideHomeButton()
			// #endif
			uni.setNavigationBarColor({
				frontColor: '#ffffff',  
                backgroundColor: '#7d33ff',  
			})
			this.init()
		},
		beforeCreate () {
			// #ifdef H5
			// 修复h5页面背景色不正常问题
			document.querySelector('body').setAttribute('style', 'background-color:#7d33ff')
			// #endif
		},
		beforeDestroy () {
			// #ifdef H5
			// 修复h5页面背景色不正常问题
			document.querySelector('body').setAttribute('style', 'background-color:#f4f4f5')
			// #endif			
		},
		methods: {
			init(){
				this.users = uni.getStorageSync('users')
				Object.keys(this.users).forEach((index,key) => {
					this.listActionSheet.push({
						text: this.users[index].username,
						color: '#303133',
						subText: this.users[index].name,
					})
					if (key === 0) {
						this.auth.usernme = this.users[index].username
					}
				});
				if (!this.users) {
					this.usePassword = true
				}
			},
			submit() {
				if (!this.usePassword && this.auth.usernme !== '') {
					const usernme = this.auth.usernme
					// 重新排序
					let us = {}
					Object.keys(this.users).forEach((i,key) => {
						if (usernme!==i) {
							us[i] = this.users[i]
						}
					})
					us[usernme] = this.users[usernme]
					// 重新排序
					uni.setStorageSync('users', us)
					this.form.username = this.users[usernme].username
					this.form.password = this.users[usernme].password
				}
				setTimeout(() => {
					this.$refs.uForm.validate(valid => {
						if (valid) {
							this.$store.dispatch('user/login',{
								user: {
									username: this.form.username,
									password: this.form.password,
								},
								type: 'username'
							}).then(res =>{
								uni.setStorageSync('token', res.token)
								let users = uni.getStorageSync('users')
								if (!users) {
									users = {}
								}
								users[this.form.username] = {
									username: this.form.username,
									password: this.form.password,
									name: res.user.name,
									token: res.token,
								}
								if (Object.keys(users).length > 8) {
									Object.keys(users).forEach((index,key) => {
										if (key===0) {
											delete users[index]
										}
									})
								}
								uni.setStorageSync('users', users)
								this.$u.route({
									type: 'reLaunch',
									url: '/pages/index/index', 
								});
							}).catch(err => {
								this.$refs.uToast.show({
									title: err.data.detail
								})
							})
						} else {
							console.log('验证失败');
						}
					})
				}, 0)
			},
			clickActionSheet(index) {
				this.auth.usernme = this.listActionSheet[index].text
			},
			confirmNext() {
				this.passwordFocus = true
			}
		}
	}
</script>
<style lang="scss" >
	body {
		background-color: #7d33ff;
	}
	.u-border-bottom:after {
		border-bottom-width: 0px;
	}
</style>
<style lang="scss" scoped>
	.agreement {
		display: flex;
		align-items: center;
		margin: 2vh 0;
		.agreement-text {
			margin-left: -2vw;
			color: $u-tips-color;
		}
	}
	.custom-style {
		color: #7d33ff;
		width: 400rpx;
	}
	.submit{
		width: 100%;
	}
</style>
<style scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #FFFFFF;
	}
	.logo {
		height: 20vw;
		width: 60vw;
		margin: 5vh auto 50rpx auto;
	}
	.login {
		background-color: #FFFFFF;
		width: 90vw;
		padding: 5vh 5vw 5vh 5vw;
		border-radius: 5px;
	}
</style>
