<template>
    <view>
        <u-form :model="formData" ref="dataForm" label-width="260">
            <u-form-item label="工商网截图" prop="ic_net_screen_shot_url" required>
                <uni-file-picker 
                    fileMediatype="image" 
                    mode="grid" 
                    limit="1"
                    @select="selectStoreEntrancePic" 
                />
            </u-form-item>
        </u-form>
    </view>
</template>
<script>
export default {
    data() {
        return {
            formData: {
                ic_net_screen_shot_url: ''
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