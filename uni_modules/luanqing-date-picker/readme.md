# luanqing-date-picker
日期选择组件

有三种模式：
1. 简单的年月日弹窗选择
2. 日历弹窗选择多个日期（多选）
3. 日历弹窗选择单个日期（单选）

#### 参数说明
名称|说明|默认值
--|--|--
isSimple|是否简单模式(非日历组件)| false
isMultiple|是否多选模式，是否可选多个日期| true
checkedToady|是否默认选中今日，仅多选模式生效|false
defaultCheckedList|默认选中的日期，仅多选模式生效| []
isAbleSelectFutureDate|是否可以选择未来日期，非简单模式下生效|true
showMonthOnCenter|是否在日历中间显示大大的月份数字，非简单模式下生效|true
title|日期弹窗的标题|'选择日期'
startDate|简单模式下的开始日期| '1971-01-01'
endDate|简单模式下的结束日期| '2099-12-31'
defaultDate|简单模式下的默认日期| 今日的日期
themeColor|组件的主题色，包含选择时的颜色，以及常见文字按钮颜色|'#E00300'

#### 示例代码
```
<template>
	<view>
		<luanqing-date-picker 
			ref="datePickerObj" 
			:isSimple="mode === 'simple'" 
			:isMultiple="mode === 'multiple'" 
			@finishSelectDate="finishSelectDate" 
			:defaultCheckedList="['2023-03-28','2023-03-25']">
		</luanqing-date-picker>
		
		<view style="margin-top: 48rpx;">
			<view @click="show('simple')" class="btn">简单选择模式</view>
			<view @click="show('multiple')" class="btn">日历多选模式</view>
			<view @click="show('single')" class="btn">日历单选模式</view>
		</view>	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mode: 'simple',
			}
		},
		methods: {
			show(showType){
				this.mode = showType;
				this.$refs.datePickerObj.open();
			},
			finishSelectDate(e){
				console.error("选择了日期：",e);
			}
		}
	}
</script>

<style>
.btn{
	width: 600rpx;
	margin-left: 74rpx;
	margin-right: 74rpx;
	text-align: center;
	padding: 12rpx;
	background-color: #E00300;
	color: aliceblue;
	border-radius: 12rpx;
	margin-top: 24rpx;
}
</style>

```