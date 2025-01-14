<template>
    <view>
        <u-form :model="formData" ref="dataForm" label-width="330">
            <u-form-item label="批量手续费" prop="fee" required>
                <u-input v-model="formData.fee" disabled placeholder="请输入"/>
            </u-form-item>
            <u-form-item label="微信手续费" prop="wechatFee" required>
                <u-input v-model="formData.wechatFee" disabled placeholder="请输入"/>
            </u-form-item>
            <u-form-item label="支付宝手续费" prop="alipayFee" required>
                <u-input v-model="formData.alipayFee" disabled placeholder="请输入"/>
            </u-form-item>
            <u-form-item label="云闪付手续费" prop="unionpayFee" required>
                <u-input v-model="formData.unionpayFee" disabled placeholder="请输入"/>
            </u-form-item>
            <u-form-item label="借记卡费率(<=1000)" prop="rateOneDebit" required>
                <u-input v-model="formData.rateOneDebit" disabled placeholder="请输入"/>
            </u-form-item>
            <u-form-item label="借记卡费率(>1000)" prop="rateTwoDebit" required>
                <u-input v-model="formData.rateTwoDebit" disabled placeholder="请输入"/>
            </u-form-item>
            <u-form-item label="借记卡费率(封顶值)" prop="rateDebitCap">
                <u-input v-model="formData.rateDebitCap" disabled placeholder="请输入"/>
            </u-form-item>
            <u-form-item label="贷记卡费率(<=1000)" prop="rateOneCredit" required>
                <u-input v-model="formData.rateOneCredit" disabled placeholder="请输入"/>
            </u-form-item>
            <u-form-item label="贷记卡费率(>1000)" prop="rateTwoCredit" required>
                <u-input v-model="formData.rateTwoCredit" disabled placeholder="请输入"/>
            </u-form-item>
            <u-form-item label="分账手续费" prop="sharingFee">
                <u-input v-model="formData.sharingFee" disabled placeholder="请输入"/>
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
                fee: '',
                wechatFee: '',
                alipayFee: '',
                unionpayFee: '',
                rateOneDebit: '',
                rateTwoDebit: '',
                rateDebitCap: '',
                rateOneCredit: '',
                rateTwoCredit: '',
                sharingFee: ''
            }
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
