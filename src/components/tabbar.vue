<template>
	<u-tabbar 
		v-model="current" 
		:list="list" 
		:mid-button="true"
		active-color="#7d33ff"
		inactive-color="#909399"
		@change="change"
	></u-tabbar>
</template>

<script>
	export default {
		props: {
            list: {
                type: Array,
                default: []
            },
			default: {
                type: String,
                default: ""
            },
		},
		data() {
			return {
				current: 0,
			}
		},
		created() {
			// 初始化时自动点亮图标
			this.list.forEach((item,key) => {
				if (item.path === this.default) {
					this.$emit('change',item)
					this.current = key
				}
			});
		},
		watch: {
			default: { // 监控外部改变path时自动点亮图标
				handler(val, oldVal) {
					this.list.forEach((item,key) => {
						if (item.path === this.default) {
							this.$emit('change',item)
							this.current = key
						}
					});
				},
				deep: true
			},
		},
		methods: {
			change(index) {
				this.current = index
                this.$emit('change',this.list[index])
			}
		}
	}
</script>

<style>
</style>
