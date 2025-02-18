<template>
    <view>
        <u-form :model="formData" ref="dataForm" label-width="260">
            <u-form-item label="备注" prop="remarks" required>
                <u-input v-model="formData.remarks" placeholder="请输入备注"/>
            </u-form-item>
        </u-form>
    </view>
</template>
<script>
export default {
    data() {
        return {
            formData: {
                remarks: ''
            },
            rules: {
                remarks: [
                    { required: true, message: '请输入备注', trigger: 'blur' },
                    { min: 2, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        getData() {
            return this.formData
        },
        setData(data) {
            this.formData = data
        }
    },
    onReady() {
        this.$refs.dataForm.setRules(this.rules);
    },
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