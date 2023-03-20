<template>
	<view>
		<view>
            <view class="top">
                <span class="name">{{options.name}}</span>
				<span class="add"><u-button type="primary" @click="click(false)">新增授权通道</u-button></span>
            </view>
            <view class="content">
                <view class="item" v-for="(item, index) in list" :key="index" @click="click(item)">
                    <!-- <view class="left">
                        <span>{{ item.id }}</span>
                    </view> -->
                    <view class="center">
                        {{item.name}}
                    </view>
                    <view class="right">
                        <m-icon v-if="item.alipay" name="zhifubao" custom-prefix="colour-icon" size="38"></m-icon>
                        <m-icon v-if="item.wechat" name="weixinzhifu" custom-prefix="colour-icon" size="38"></m-icon>
                    </view>
					<view class="arrow-right">
						<u-icon name="arrow-right" size="30"></u-icon>
					</view>
                </view>
                <u-loadmore :status="status" />
            </view>
        </view>	
        <u-toast ref="uToast" />
	</view>
</template>
<script>
    import { RouteParams } from '@/utils'
	import {  mapGetters } from 'vuex'
    export default {
		computed: {
			...mapGetters([
				'name',
				'username',
				'avatar',
			]),
		},
		data() {
			return {
				options: {},
                status: 'loadmore',
				list: [],
				total: 0,
				listQuery: {
					page: 1,
					limit: 15,
					where: '',
					sort: 'created_at desc'
				},
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'授权通道'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
			
		},
		onShow() {
			this.init()
		},
		methods: {
            init() {
				this.options = RouteParams()
				if (!this.options.name) {
					this.options.name = this.name
				}
				this.listQuery = {
					page: 1,
					limit: 15,
					where: '',
					sort: 'created_at desc'
				}
				this.list = []
				this.getList()
				uni.$on('uOnReachBottom',()=>{
					this.listQuery.page++
					if (this.list.length>=this.total) {
						this.status = 'nomore'
						return
					}
					this.getList()
				})
			},
            getList() {
				let where = `true`
				this.listQuery.where = where
				this.status = 'loading';
				this.$u.api.pay.oauth.List({
					listQuery: this.listQuery,
				}).then(res => {
					if (res.oauths) {
						res.oauths.forEach(item => {
							this.list.push(item)
						});
						this.total = Number(res.total)
						if (this.list.length>=this.total) {
							this.status = 'nomore'
						}
					}else{
						this.status = 'nomore'
					}
				})
			},
			click(item){
				this.$u.route({
					type: 'to',
					url: '/subPackages/main/institution/oauth/item',
					params: item
				})
			}
		},
         // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
        onReady() {
            // this.$refs.dataForm.setRules(this.rules);
        }
	}
</script>

<style lang="scss" scoped>
.top {
	background-color: #fff;
	height: 100%;
	padding: 5vw;
    margin-bottom: 2vw;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	.name{
		font-size: 4vw;
	}
}
.line {
	font-size: 4vw;
    font-weight: 900;
	padding: 5px;
    color: #dd6161;
}
.bottom {
	margin-top: 3vh;
}
.content{
	.item {
		height: 50px;
		width: 100%;
		background-color: #fff;
		margin-bottom: 5px;
		display: flex;
		padding: 0 2vw 0 1vw ;
		.center{
			margin-left: 3vw;
            min-width: 70vw;
			font-size: 18px;
			height: 50px;
			line-height: 50px;
		}
		.right {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 5px;
			flex: 1;
			text-align: right;
			max-width: 70px;
		}
		.arrow-right {
			height: 50px;
			line-height: 50px;
		}
	}
}
.icon{
	font-size: 20px;
}
</style>
