<template>
	<view>
		<view>
            <view class="top">
                <span class="name">{{seller.name}}</span>
				<span class="add"><u-button type="primary" @click="click(false)">新增收款码</u-button></span>
            </view>
            <view class="content">
                <view class="item" v-for="(item, index) in list" :key="index" @click="click(item)">
                    <view class="center">
                        <view class="title">
                            {{item.name}}
                        </view>
                        <!-- <view class="time">
                            门店:{{item.userName}}
                        </view> -->
                    </view>
					<view class="left">
                        <span>{{ item.userName }}</span>
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
    export default {
		data() {
			return {
                status: 'loadmore',
				list: [],
				total: 0,
				listQuery: {
					page: 1,
					pageSize: 15,
					where: '',
					sort: 'ORDER BY created_at DESC, id DESC'
				},
                seller: {
                    id: '',
                    institutionId: '',
                    brandId: '',
                    providerId: '',
                    username: '',
                    password: '',
                    name: '',
                    mobile: '',
                    addressCode: '0',
                    address: '',
                },
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:'收款码管理'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
			
		},
		onShow() {
			this.seller = JSON.parse(JSON.stringify(RouteParams()))
            this.init()
		},
		methods: {
            init() {
				this.listQuery = {
					page: 1,
					pageSize: 15,
					where: '',
					sort: 'ORDER BY created_at DESC, id DESC'
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
				let where = `user_id='` + this.seller.id + `'`
				this.listQuery.where = where
				this.status = 'loading';
				this.$u.api.institution.qrcode.List({
					listQuery: this.listQuery,
					qrcode: {
						userId: this.seller.id
					}
				}).then(res => {
					if (res.qrcodes) {
						res.qrcodes.forEach(item => {
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
				if (item) {
					this.$u.route({
						type: 'to',
						url: '/subPackages/main/institution/seller/qrcode/item?id='+item.id
						+ '&name=' + item.name
						+ '&userId=' + item.userId
						+ '&userName=' + item.userName
					})
				}else{
					this.$u.route({
						type: 'to',
						url: '/subPackages/main/institution/seller/qrcode/item?userId='+this.seller.id
						+ '&userName=' + this.seller.name
					})
				}
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
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: 50px;
		width: 100%;
		background-color: #fff;
		margin-bottom: 5px;
		display: flex;
		padding: 0 2vw 0 1vw ;
		.left {
			padding: 5px;
			text-align: center;
			color: #909399;
			font-size: 12px;
		}
		.center{
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding: 5px;
			.title {
				font-size: 18px;
			}
			.time {
				font-size: 10px;
				color: #909399;
			}
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
