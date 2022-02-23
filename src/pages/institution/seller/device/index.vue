<template>
	<view>
		<view>
            <view class="top">
                <span class="name">{{seller.name}}</span>
				<span class="add"><u-button type="primary" @click="click(false)">新增设备</u-button></span>
            </view>
            <view class="content">
                <view class="item" v-for="(item, index) in list" :key="index" @click="click(item)">
                    <view class="left">
                        <span>{{ getDeviceName(item)}}</span>
                    </view>
                    <view class="center">
                        <view class="title">
                            {{item.deviceId}}
                        </view>
                        <view class="time">
                            门店:{{item.userName}}
                        </view>
                    </view>
                    <view class="right">
                        <u-icon v-if="isExist(item.driveType,'play')" name="play" custom-prefix="colour-icon" class="icon"></u-icon>
                        <u-icon v-if="isExist(item.driveType,'print')" name="print" custom-prefix="colour-icon" class="icon"></u-icon>
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
					limit: 15,
					where: '',
					sort: 'created_at desc'
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
				title:'设备管理'
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',  
                backgroundColor: '#ffffff',  
			})
			
		},
		mounted() {
		},
		onShow() {
			this.seller = JSON.parse(JSON.stringify(RouteParams()))
            this.init()
		},
		methods: {
            init() {
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
				let where = `user_id='` + this.seller.id + `'`
				this.listQuery.where = where
				this.status = 'loading';
				this.$u.api.institution.device.List({
					listQuery: this.listQuery,
					device: {
						userId: this.seller.id
					}
				}).then(res => {
					if (res.devices) {
						res.devices.forEach(item => {
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
            isExist(driveType, type) {
                return driveType.indexOf(`"`+type+`"`)!=-1
            },
            getDeviceName(item) {
                switch (item.drive) {
                    case 'yxyiot':
                        return '云想印'
                    case 'yilianyun':
                        return '易联云'
                    case 'szzt':
                        return '证通'
                    case 'zhangyoobao':
                        return '掌优'
                }
            },
			click(item){
				if (item) {
					this.$u.route({
						type: 'to',
						url: '/pages/institution/seller/device/item?id='+item.id
						+ '&build=' + item.build
						+ '&deviceId=' + item.deviceId
						+ '&deviceKey=' + item.deviceKey
						+ '&drive=' + item.drive
						+ '&driveType=' + item.driveType
						+ '&printTemplate=' + item.printTemplate
						+ '&userId=' + item.userId
						+ '&userName=' + item.userName
						+ '&params=' + item.params
					})
				}else{
					this.$u.route({
						type: 'to',
						url: '/pages/institution/seller/device/item?userId='+this.seller.id
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
		height: 50px;
		width: 100%;
		background-color: #fff;
		margin-bottom: 5px;
		display: flex;
		padding: 0 2vw 0 1vw ;
		.left {
			padding: 5px;
			text-align: center;
			max-width: 70px;
			color: #909399;
			font-size: 10px;
		}
		.center{
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding: 5px;
            min-width: 70vw;
			.title {
				font-size: 18px;
			}
			.time {
				font-size: 10px;
				color: #909399;
			}
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
	}
}
.icon{
	font-size: 20px;
}
</style>
