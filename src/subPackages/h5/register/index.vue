
<template>
	<view class="content">
		<u-form :model="form" ref="uForm" label-width="190">
			<u-form-item label="商户号" prop="subMerId">
                <u-input v-model="form.subMerId" :maxlength="-1"/>
                <u-button 
                    slot="right"
                    type="info" 
                    size="mini"
                    @click="clipboardData(form.subMerId)"
                    >复制商户号
                </u-button>
            </u-form-item>
		</u-form>
		<u-button type="primary" :disabled="disabled" @click="submit">提交</u-button>
		<u-modal v-model="show" title="错误提示" :content="err"></u-modal>
	</view>
</template>

<script>
	export default {
		components: { 
		},
		data() {
			return {
				form: {
					subMerId: '',
				},
				show: false,
				err: "",
				disabled: false
			}
		},
		computed: {
		},
		onLoad() {
		},
		mounted() {
			// 获取时间戳 time
			this.form.subMerId = String(new Date().getTime())
		},
		methods: {
			clipboardData(data) {
                uni.setClipboardData({
                    data: data,
                    success() {
                        uni.showToast({
                            duration: 3000,
                            icon:'success',
                            title:'复制成功',
                        })
                    }
                })
            },
			submit() {
				this.disabled = true
				this.$u.api.icbcjft.register.H5Register({ 
					config: {
						"AppId": "10000000000003241581",
						"IcbcPublicKey": "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCMpjaWjngB4E3ATh+G1DVAmQnIpiPEFAEDqRfNGAVvvH35yDetqewKi0l7OEceTMN1C6NPym3zStvSoQayjYV+eIcZERkx31KhtFu9clZKgRTyPjdKMIth/wBtPKjL/5+PYalLdomM4ONthrPgnkN4x4R0+D4+EBpXo8gNiAFsNwIDAQAB",
						"PrivateKey": "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDRCQzPtXBrDV5d2s2Mut73m+OkyNSUjh5zPzhYtJzyo/eh5own6KyXZwSO5qyWbSSLP1JX0NYIoF88/C2xRMY3j/hsx6kt9esP/6HlJ8TJYwjYyhd6NgARUgD+ntMZSxLtH+d0woXMjeAW+f/rW+WnQ/pcJZ/WNDytpueoGHRZ5YZrbpqNUcIs9HTICmLoON1Kz3ic7IzlSIMoFRSMeCNgsK0j0YY4CVNofP4fV37un3ebtBQiv1QygK+yzq3KU0hA3ypfdqHjZoSXHFBbceqse9k1dQoOsqG0UZOwqXgmEJtqRRYcWG62qBPEooi7eHiUEbVdgL9rNhNbGiih0y4nAgMBAAECggEAKN45F/7kLLnfYkAeAc6jOwvKVPRCw4yJnYSVspoVOUcfahLWAhN2ct9cP8gPpBVQmLzXj32v6t3X4Od403ibvE80haf/hpHW1DjpYREGY00udJwGPQmDt98tfJp2sTJBUAT1zpkdaaGvVy6nf09nNe2PbCaa+lkaJ+VC01V8ofpoGVidUhPxKXLb/s3r6M3GnCkccAhZ6PWgT8DGOGmgK5Ia8/SG0H7wokRTkufh3sUxcELL+CR9+8kvMfAhlz0dnmWQzxalt6r0RtOMyK001K42cOYgyiyDDcRuc2kSGgMY3uRjVBrm1YfEsHlXusER9O9yRHrQLhak+cUfTevHgQKBgQD9dGabGH3T9ZB1Ob9uFQPiLevYVu+ppQhHIhDN0v8Q0rohUbCoqkDgTuFsDfJYjmmsljxwDXpwSDD62zDr3EUQU5eYfvf5AAL5FokjjLj0MTP+vHp3E8LYwLL9aZ/5ziUG1rTaFO9Lg/PCVd4tRIhVTJ/TiG/qQ7clY2+1gwh2ZwKBgQDTInPvVsDOHwPTuiFDsL+NSSE7RemCLvASCd7+okyvl1P7FitwdtTLYt/Dtn+RS09iBNfg7ClgLvpu82bIZVw42w3snJg3t4UcqMHvcf8zirRCyM5s2lf+nI7mCiYDqpegw6Y/amfR7pTdmwBfTHwzit5Jum5iaawP/A80s+syQQKBgQCelK8CSY+pCBNrlUc2LEXyxYK0KKjpfw2v3BuhfGwE7aRx5nffAC95aUFX514DlI9/4bxM69H44OJsgqqYWIiJz5OhYYfrrtstWLFTod+zQfnjX7BMQvv9vIwBTI5AsX+vSLV9Ye3bVOM2a52Iu0GGBVxW8R38+INmDFI/wo2P7wKBgFCMxWRbWaWJyaD+UvCLPxk8/DOr4YFsPOT05SGKc+1Ns5mIhLwcaeTKbQoy1wpsi/WeWWoTT1nFsn+f1ue/W+bJE8/gkmY3Ws5rR8n9WNqmIU2VZMO8rXOS8SWsW4Jsk/qeig+JneBGwH6nQwYYnQ3g/htsx+492IokpPx7Y9DBAoGBAJdEOuQt5Y4pK1tNZDPIO3z3rjwrOFmqS7Xjbmm0nB1Ycas2tKVaz3vQGwlG9SUjDtRXCKk//2aixAZ6W00XrL1+ieR6307+LM9Qqlj8xYKRt1doigboGAOLU6aW6EFl7oGzFCaKZZrkD6In+JjiJg5CCqbEQ3wMDuSBe0OsZZq6",
						"SubMerId": this.form.subMerId
					},
					bizContent: {
						"subMerId": this.form.subMerId
					}
				}).then(res=>{
					// string to json 
					let content = JSON.parse(res.content);
					// 跳转链接
					window.location.href = content.url;
				}).catch(err=>{
					this.err =  "获取工行聚富通注册信息失败"
					this.show = true
					this.disabled = false
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// justify-content: center;
		padding: 5vw;
		background-color: #ffffff;
		height: 100vh;
		padding-top: 10vh;
	}
</style>
