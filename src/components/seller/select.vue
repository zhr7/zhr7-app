<!--
 * @Author: BigRocs
 * @Date: 2024-06-11 16:11:38
 * @LastEditTime: 2024-07-30 18:04:47
 * @LastEditors: BigRocs
 * @Description: QQ: 532388887, Email:bigrocs@qq.com
-->
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
			if (this.roles.indexOf('BrandMerchant')!=-1) {
				this.getSeller()
			}
		},
		methods: {
			getSeller() {
				this.$u.api.v3.seller.seller.Search({
					page: 1,
					pageSize: 1000,
					where: 'WHERE true',
					sort: 'ORDER BY created_at DESC, id DESC'
				}).then(res => {
					this.actionSheetList = [
						{
							value: 'all',
							label: '全部门店',
						}
					]
					if (res.items) {
						res.items.forEach(element => {
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
