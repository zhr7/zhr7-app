<template>
    <text class="colour-icon" :class="[customPrefix+'-'+name]" :style="{color:color,'font-size':fontSize,'background':background}" @click="onClick()"></text>
</template>

<script>
    export default {
        props: {
            /**
             * 图标类型
             */
            name: String,
            /**
             * 图标类型
             */
            customPrefix: String,
            /**
             * 图标颜色
             */
            color: String,
                /**
             * 图标背景颜色
             */
            background: String,
            /**
             * 图标大小
             */
            size: {
                type: [Number, String],
                default: 24
            }
        },
        computed: {
            fontSize() {
                var size = Number(this.size)
                size = isNaN(size) ? 24 : size
                return `${size}px`
            }
        },
        methods: {
            onClick() {
                this.$emit('click')
            }
        }
    }
</script>

<style scoped>
	@import "@/static/colour-iconfont.css";
    .colour-icon{
        line-height: 1;
    }
</style>
