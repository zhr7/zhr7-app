<template>
	<view class="item">
		<u-select v-model="show" :list="actionSheetList" @confirm="actionSheetCallback"></u-select>
		<u-input v-model="sellerLabel" type="select" class="select-input" :border="true" @click="show = true" />
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		props: {
		},
        computed: {
			...mapGetters([
				'roles',
			]),
        },
		data() {
			return {
				actionSheetList: [
					{
						id: 'all',
						text: '全部门店',
					}
				],
				sellerLabel: '全部门店',
                sellerId: 'all',
				show: false,
			}
		},
		created() {
			if (this.roles.indexOf('sellerBrand')!=-1) {
				this.getSeller()
			}
		},
		methods: {
			getSeller() {
				this.$u.api.institution.seller.List({
					list_query: {
						page: 1,
						limit: 1000,
						where: '',
						sort: 'created_at desc'
					},
				}).then(res => {
					this.actionSheetList = [
						{
							value: 'all',
							label: '全部门店',
						}
					]
					if (res.sellers) {
						res.sellers.forEach(element => {
							this.actionSheetList.push({
								value: element.id,
								label: element.name,
							})
						})
					}
				})
			},
			// 点击actionSheet回调
			actionSheetCallback(item) {
				this.sellerLabel= item[0].label;
				this.sellerId = item[0].value;
                this.$emit('sellerId', this.sellerId)
			}
		}
	}
</script>

<style lang="scss" >
.select-input{
	width: 95vw;
}
</style>
