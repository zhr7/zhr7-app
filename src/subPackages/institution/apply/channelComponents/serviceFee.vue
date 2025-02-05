<template>
    <view>
        <u-form :model="formData" ref="dataForm" label-width="360">
            <u-form-item label="批量手续费 (‱)" prop="fee" required>
                <u-number-box v-model="formData.fee" :min="20" :max="60" @change="handleChange"></u-number-box>
            </u-form-item>
            <u-form-item label="微信手续费 (‱)" prop="wechatFee" required>
                <u-number-box v-model="formData.wechatFee" :min="20" :max="60"></u-number-box>
            </u-form-item>
            <u-form-item label="支付宝手续费 (‱)" prop="alipayFee" required>
                <u-number-box v-model="formData.alipayFee" :min="20" :max="60"></u-number-box>
            </u-form-item>
            <u-form-item label="云闪付手续费 (‱)" prop="unionpayFee" required>
                <u-number-box v-model="formData.unionpayFee" :min="20" :max="60"></u-number-box>
            </u-form-item>
            <u-form-item label="借记卡费率(<=1000) (‱)" prop="rateOneDebit" required>
                <u-number-box v-model="formData.rateOneDebit" :min="20" :max="60"></u-number-box>
            </u-form-item>
            <u-form-item label="借记卡费率(>1000) (‱)" prop="rateTwoDebit" required>
                <u-number-box v-model="formData.rateTwoDebit" :min="20" :max="200"></u-number-box>
            </u-form-item>
            <u-form-item label="借记卡费率(封顶值) (‱)" prop="rateDebitCap">
                <u-number-box v-model="formData.rateDebitCap" :min="1" :max="200"></u-number-box>
            </u-form-item>
            <u-form-item label="贷记卡费率(<=1000) (‱)" prop="rateOneCredit" required>
                <u-number-box v-model="formData.rateOneCredit" :min="20" :max="60"></u-number-box>
            </u-form-item>
            <u-form-item label="贷记卡费率(>1000) (‱)" prop="rateTwoCredit" required>
                <u-number-box v-model="formData.rateTwoCredit" :min="20" :max="200"></u-number-box>
            </u-form-item>
            <u-form-item label="分账手续费 (‱)" prop="sharingFee">
                <u-number-box v-model="formData.sharingFee" :min="0" :max="200"></u-number-box>
            </u-form-item>
        </u-form>
    </view>
</template>
<script>
import { parseTime, OCR } from '@/utils'
export default {
    data() {
        return {
            formData: {
                fee: '30', // 批量手续费
                wechatFee: '30', //微信手续费
                alipayFee: '30', //支付宝手续费
                unionpayFee: '30', //云闪付手续费
                rateOneDebit: '30', //借记卡费率(<=1000)
                rateTwoDebit: '50', //借记卡费率(>1000)
                rateDebitCap: '20', //借记卡费率(封顶值)
                rateOneCredit: '30', //贷记卡费率(<=1000)
                rateTwoCredit: '55', //贷记卡费率(>1000)
                sharingFee: '0' //分账手续费
            }
        }
    },
    methods: {
        handleChange() {
            // this.$emit('change', this.formData)
            this.formData.wechatFee = this.formData.fee
            this.formData.alipayFee = this.formData.fee
            this.formData.rateOneDebit = this.formData.fee
            this.formData.rateOneCredit = this.formData.fee
        },
        getData() {
            return this.formData
        },
        setData(data) {
            this.formData = data
        }
    }
}
</script>
<style lang="scss" scoped>
    .item {
        background-color: #fff;
        height: 100%;
        padding: 5vw;
    }
    .bottom {
        margin-top: 3vh;
    }
</style>
