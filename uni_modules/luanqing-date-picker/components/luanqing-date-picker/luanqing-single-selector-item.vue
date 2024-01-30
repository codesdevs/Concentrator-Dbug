<template>
	<view class="uni-calendar-item__weeks-box" :class="{
		'uni-calendar-item--disable': weeks.disable,
		'uni-calendar-item--before-checked':weeks.beforeMultiple,
		'uni-calendar-item--multiple': weeks.multiple,
		'uni-calendar-item--after-checked':weeks.afterMultiple,
		}"
		@click.stop="onCheckDate(weeks)"
		>
		<view :class="weeks.extraInfo ? 'uni-calendar-checked':'uni-calendar-item__weeks-box-item'">
			<text v-if="!weeks.disable" :class="weeks.extraInfo ? 'luanqing_date_text_selected':'luanqing_date_text'">{{weeks.date}}</text>
			<text v-if="!weeks.disable" :class="weeks.extraInfo ? 'luanqing_lanur_text_selected':'luanqing_lanur_text'" style="margin-top: 2rpx;">{{weeks.isDay ? todayText : (weeks.lunar.IDayCn === '初一'?weeks.lunar.IMonthCn:weeks.lunar.IDayCn)}}</text>
		</view>
	</view>
</template>

<script>
	import {
	initVueI18n
	} from '@dcloudio/uni-i18n'
	import messages from './i18n/index.js'
	const {	t	} = initVueI18n(messages)
	export default {
		emits:['change'],
		props: {
			themeColor:{
				type: String,
				default: '#E00300'
			},
			isAbleSelectFutureDate:{
				type: Boolean,
				default: true
			},
			curYear:{
				type: Number,
				default: 2022
			},
			curMonth:{
				type: Number,
				default: 7
			},
			curDate:{
				type: Number,
				default: 14
			},
			weeks: {
				type: Object,
				default () {
					return {}
				}
			},
			calendar: {
				type: Object,
				default: () => {
					return {}
				}
			},
			selected: {
				type: Array,
				default: () => {
					return []
				}
			},
			lunar: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			todayText() {
				return t("uni-calender.today")
			},
		},
		methods: {
			onCheckDate(weeks){
				if(!this.$props.isAbleSelectFutureDate){
					if((weeks.lunar.cYear < this.$props.curYear) 
					|| (weeks.lunar.cYear === this.$props.curYear && weeks.lunar.cMonth < this.$props.curMonth) 
					|| (weeks.lunar.cYear === this.$props.curYear && weeks.lunar.cMonth === this.$props.curMonth && weeks.lunar.cDay <= this.$props.curDate)){
						this.$emit('change', weeks);
					}
				}else{
					this.$emit('change', weeks);
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.selected{
		width: 22rpx;
		height: 22rpx;
		background-color: #E00300;
		margin-top: 6rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		
		.icon{
			width: 20rpx;
			height: 20rpx;
		}
	}
	.unselected{
		width: 20rpx;
		height: 20rpx;
		border: 1rpx solid #999999;
		margin-top: 6rpx;
	}
	.uni-calendar-item__weeks-box {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.luanqing_lanur_text{
		font-size: 20rpx;
		font-weight: 400;
		color: #999999;
	}
	
	.luanqing_lanur_text_selected{
		font-size: 20rpx;
		font-weight: 400;
		color: #E00300;
	}
	
	.luanqing_date_text_single{
		font-weight: 500;
		font-size: 28rpx;
		color: #999999;
	}
	
	.luanqing_date_text_selected_single{
		font-weight: 500;
		font-size: 28rpx;
		color: #E00300;
	}
	
	.luanqing_date_text{
		font-weight: 500;
		font-size: 28rpx;
		color: #333333;
	}
	
	.luanqing_date_text_selected{
		font-weight: 500;
		font-size: 28rpx;
		color: #E00300;
	}

	.uni-calendar-item__weeks-box-text {
		font-size: $uni-font-size-base;
		color: $uni-text-color;
	}

	.uni-calendar-item__weeks-lunar-text {
		font-size: $uni-font-size-sm;
		color: $uni-text-color;
	}

	.uni-calendar-item__weeks-box-item {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		width: 104rpx;
		height: 120rpx;
	}

	.uni-calendar-checked{
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		width: 102rpx;
		height: 118rpx;
		border: 1rpx solid #E00300;
	}
	
	.uni-calendar-item__weeks-box-circle {
		position: absolute;
		top: 5px;
		right: 5px;
		width: 8px;
		height: 8px;
		border-radius: 8px;
		background-color: $uni-color-error;
	}

	.uni-calendar-item--disable {
		background-color: rgba(249, 249, 249, $uni-opacity-disabled);
	}

	.uni-calendar-item--isDay-text {
		color: $uni-color-primary;
	}

	.uni-calendar-item--isDay {
		background-color: $uni-color-primary;
		opacity: 0.8;
	}

	.uni-calendar-item--extra {
		color: $uni-color-error;
		opacity: 0.8;
	}

	.uni-calendar-item--checked {
		background: #FBEDED;
		border-radius: 4rpx;
		border: 2rpx solid #E00300;
		opacity: 0.8;
	}

	.uni-calendar-item--multiple {
		background-color: $uni-color-primary;
		opacity: 0.8;
	}
	.uni-calendar-item--before-checked {
		background-color: #ff5a5f;
	}
	.uni-calendar-item--after-checked {
		background-color: #ff5a5f;
	}
</style>
