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
		<u-button type="primary" @click="submit">提交</u-button>
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
				this.$u.api.icbcjft.register.H5Register({ 
					config: {
						"AppId": "10000000000003236024",
						"IcbcPublicKey": "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCMpjaWjngB4E3ATh+G1DVAmQnIpiPEFAEDqRfNGAVvvH35yDetqewKi0l7OEceTMN1C6NPym3zStvSoQayjYV+eIcZERkx31KhtFu9clZKgRTyPjdKMIth/wBtPKjL/5+PYalLdomM4ONthrPgnkN4x4R0+D4+EBpXo8gNiAFsNwIDAQAB",
						"PrivateKey": "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCmMgS+b7WU8cRhyhHEHTnBNcdyvfxs0YuyXCiVaNPF09JEkiyVDemJ/pKsCO9tQ1zy3fBpTO3oGWj4REA/Re7BAmu9jtAGIXuLX06ZxW4jhVkTSZgMTVk0i5mcX1s+Af+FixaJsltzvrUBdwBS39mAFXIWZtIk2VyvhwwAfhw6FBCbULY4UJ36nZd3tKOjb3I7xSyeeH81anuBoqlNEAOduuAQMNfuNFo0L5mq0SltMFWuniDlt5V+PjE9TNnVbhkPeDuTmVWIvVqJtOcN7BmwC2HDT382y/UPmh3ADdROQTZOb4bJsGfk0TPo0PisgYV4IEiUda10B6+RmldsERAvAgMBAAECggEAGPNjcO+2dCED2aaLmkTE+fPH+Lr7HZ8r+OALG7s8J/QQGklTtiD7kcMNZBSHVYEKgE+/mx94jCLcdoFQn+8w0/s4D6JUKsd2E8uAMmfIjD6ly9Z9pEMshE39BtPuD9Ye9X6XKJ8FSdA0vn6OJuMCdU9C7IgNPoj/eD6vF5fXRwSjpLA+29ItE6jqzip+bXzRIwLJVFRnBIEN8yE1eTqVt0gdeT4JXYYnjhbBULzvayQjPYYpSC1BBpxRo+XmtgnNOgJot3cWl7ueNRpdRrAhHOzkDbqTZMRwvr0qwWKbf52MbLrLG9DPmy6WMSJHSE3NJJrjgmWfti2XWdYi+G42IQKBgQDsMqyVVQc5VPDkLRYDPTozzrjsuXtC9yowRzXSDSyaiX1xCMt4tAFbTM/ORX2ccWNhgjhCQez7/CuxO/LTcYqCuPTz+ckX4YZ03UyKWdtIIJE/971c0ykxvmWkpLEC/drdJ0gE31clQPIAKOcD67pwTfIRt/0xxP5YVO3DsV3wPwKBgQC0IO+YVsH3qILFlKK424VW/gb1ejbvrAXlSAdnR2FX6PmVMHdwdpoApAd50E9A5v89CQBz+sI3XkmMq7xBqa80TbpXwwhPYHACnR6kBRP42Pr6aZfhnoVZJ8kAjAPWBIcG5mM5nnrJpwPhCvdYT+52svYJWMJtEPa5NowITiTkEQKBgQDQJrw3Ae7S1ItR2nXKtvuCyovnenIpCp6wWyEQErIbIk1c/s4peiCz8BY2BsFyy+4z8UlZArYxPwLWNymAs0/IcezU0W0pUYNnm9qnFhcMEj9O6ymDE0f7YXo7xTOFmmd1e/eY66Xl270o7OLhbq0n6VkJymYkpSEsgPPkAHvziwKBgFBA6F74MH12D6WWHpW8AIGMtm8CX52TCCFqYRoLvHwdaa2lpWFvBhhI/KeyPs1M3eVEsHX8ADIJCT3qefrLbisggmh9laM/9UfE1xT+yjIyAkg1aZz1MrZROoXK3B6rb7mMRiMyz8QubFUEvMUU/8rU2ze42w8a4sIMYoGEx3zxAoGBAMs1nVqW8tROPwZ0V/ngkQlcGvAkHFQbaUvfm04xh6B6hpvEmkrV+ptXWCqFjzspZaUa7q1DhSEuLRRL1iK8cGwiJ6T8g2TN1UZrMD/rAsxanBSMtBVgHW6vVO1QgD8b89suJw+uNlL/fR34mlIXnGF9j67lIG/2jcqWgfzhkTXO",
						"SubMerId": this.form.subMerId
					},
					bizContent: {
						"subMerId": "1660205040123"
					}
				}).then(res=>{
					// string to json 
					let content = JSON.parse(res.content);
					// 跳转链接
					window.location.href = content.url;
				}).catch(err=>{
					this.err =  "获取工行聚富通注册信息失败"
					this.show = true
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
