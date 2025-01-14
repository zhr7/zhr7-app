<template>
    <view>
        <u-form :model="formData" ref="dataForm" label-width="260">
            <u-form-item label="微信渠道号" prop="channelIdentifier">
                <u-input v-model="formData.channelIdentifier" disabled placeholder="请输入微信渠道号"/>
            </u-form-item>
            <u-form-item label="代理编号" prop="directAgentNo">
                <u-input v-model="formData.directAgentNo" disabled placeholder="请输入代理编号"/>
            </u-form-item>
            <u-form-item label="非法人关系" prop="relation" required>
                <uni-data-select
                    v-model="formData.relation"
                    :localdata="list"
                    @change="change"
                    placeholder="请选择"
                    label="非法人关系"
                ></uni-data-select>
            </u-form-item>
        </u-form>
    </view>
</template>
<script>
export default {
    data() {
        return {
            formData: {
                channelIdentifier: '',
                directAgentNo: '',
                relation: '',
            },
            list: [
                { text: '股东/雇佣关系', value: 'SHAREHOLDER_OR_EMPLOY' },
                { text: '总分公司关系', value: 'HEAD_BRANCH' },
                { text: '子公司关系', value: 'SUBSIDIARY' },
                { text: '亲属关系', value: 'KINSHIP' },
            ],
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