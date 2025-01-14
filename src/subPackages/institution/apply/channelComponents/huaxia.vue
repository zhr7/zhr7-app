<template>
    <view>
        <u-form :model="formData" ref="dataForm" label-width="260">
            <u-form-item label="备注" prop="remark" required>
                <u-input v-model="formData.remark" disabled placeholder="请输入备注"/>
            </u-form-item>
        </u-form>
    </view>
</template>
<script>
export default {
    data() {
        return {
            formData: {
                remark: ''
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