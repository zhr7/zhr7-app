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
                default: 'home'
            },
		},
		data() {
			return {
				current: 0,
			}
		},
		created() {
			this.$emit('change',this.list[this.current])
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
