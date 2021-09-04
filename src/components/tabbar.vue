<template>
	<u-tabbar 
		v-model="current" 
		:list="list" 
		:mid-button="true"
		active-color="#409EFF"
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
			this.list.forEach((item,key) => {
				if (item.path === this.default) {
					this.$emit('change',item)
					this.current = key
				}
			});
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
