<template>
	<uni-popup type="bottom" ref="popupDialogObj">
		<view v-if="!isSimple">
			<view class="title_bar">
				<text class="cancel_text" :style="'color:'+themeColor" style="min-width: 100rpx;" @click="close">取消</text>
				<text class="title_text" v-if="isMultiple">{{title}}{{checkedList && checkedList.length > 0 ? '(已选'+checkedList.length+'天)':'(可选多天)'}}</text>
				<text class="title_text" v-else>{{title}}</text>
				<text class="cancel_text" :style="'color:'+themeColor" style="min-width: 100rpx;" v-if="isMultiple" @click="comfirmModel">确定</text>
				<text class="cancel_text" style="min-width: 100rpx;" v-else></text>
			</view>
			<!-- <view class="uni_flex_row_align_left year_month_bar">
				<text class="year_text">{{year}}年</text>
				<uni-icons type="back" @click="lastMonth" size="21"></uni-icons>
				<text class="title_date">{{month < 10 ? '0'+month:month}}月</text>
				<uni-icons v-if="(year < curYear) || (month < curMonth && year === curYear)" type="forward" @click="nextMonth" size="21"></uni-icons>
			</view> -->
			
			<luanqing-calendar
				ref="calendarObj"
				:mode="isMultiple ? 'multiple':'single'"
				:isAbleSelectFutureDate="isAbleSelectFutureDate"
				:selected="isMultiple ? checkedList || [] : []"
				:insert="true"
				:lunar="true" 
				:themeColor="themeColor"
				:clearDate="false"
				:showMonth="showMonthOnCenter"
				:isShowHeader="false"
				@change="checkedEvent"
			 />
		</view>
		<view v-else>
			<simple-picker-date
				ref="simplePickerObj"
				@onCancel="onCancel"
				@onConfirm="onConfirm" 
				:defaultValue="defaultDate" 
				:themeColor="themeColor"
				:startDate="startDate"
				:title="title"
				:endDate="endDate">
			</simple-picker-date>
		</view>
	</uni-popup>
</template>

<script>
	import luanqingCalendar from './luanqing-calendar.vue';
	import simplePickerDate from './simple-pickerdate.vue';
	
	function getNowDate() {
		let date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		if (month.toString().length == 1) {
			month = "0" + month;
		}
		if (day.toString().length == 1) {
			day = "0" + day;
		}
		return year + "-" + month + "-" + day;
	}
	
	export default {
		components:{ luanqingCalendar,simplePickerDate },
		// 日期选择完成
		emits:['finishSelectDate'],
		props: {
			// 是否默认选中今日
			checkedToady:{
				type:Boolean,
				default:false
			},
			// 默认选中的日期列表(可用于传入之前选择的值)
			defaultCheckedList:{
				type: Array,
				default:()=>{
					return []
				}
			},
			// 是否简单选择日期（滚动小弹窗单选年月日）
			isSimple:{
				type: Boolean,
				default: false
			},
			// 是否多选，默认多选（弹出日期选择）
			isMultiple:{
				type: Boolean,
				default: true
			},
			// 是否可以选择未来日期
			isAbleSelectFutureDate:{
				type: Boolean,
				default: true
			},
			// 是否在日历中间显示大大的月份数字
			showMonthOnCenter:{
				type: Boolean,
				default: true
			},
			// 主题风格颜色
			themeColor:{
				type: String,
				default: '#E00300'
			},
			// 弹窗的标题文字
			title:{
				type: String,
				default: '选择日期'
			},
			startDate: {	
				type: String,
				default () {
					return "1971-01-01"
				}
			},
			endDate: {
				type: String,
				default () {
					return "2099-12-31"
				}
			},
			defaultDate: {
				type: String,
				default () {
					return getNowDate()
				}
			}		
		},
		data() {
			return {
				checkedList:[],
				year:2022,
				month:7,
				curYear:2022,
				curMonth:6
			}
		},
		created() {
			let date = new Date();
			this.month = date.getMonth() + 1;
			this.year = date.getFullYear();
			this.date = date.getDate();
			
			this.curYear = this.year;
			this.curMonth = this.month;

			if(!this.$props.isMultiple){
				if(this.$props.checkedToady){
					let dateStr = ''+this.year+'-'+(this.month < 10 ? '0'+this.month:this.month)+'-'+(this.date < 10 ? '0'+this.date:this.date);
					this.checkedList = [{date:dateStr}];
				}
				
				if(this.$props.defaultCheckedList){
					this.$props.defaultCheckedList.forEach((item,index)=>{
						this.checkedList.push({date:item});
					})
				}
			}
		},
		methods: {
			onCancel(){
				this.close();
			},
			onConfirm(date){
				this.close();
				this.$emit("finishSelectDate",[ date.dateValue]);
			},
			updateCheckedList(list){
				this.checkedList = list || [];
			},
			comfirmModel(){
				this.$emit("finishSelectDate",this.checkedList || []);
				this.close();
			},
			getCheckedList(){
				return this.checkedList || [];
			},
			lastMonth(){
				if(this.month === 1){
					this.year -= 1;
					this.month = 12;
				}else{
					this.month -= 1;
				}
				this.$refs.calendarObj.pre();
			},
			nextMonth(){
				if(this.month === 12){
					this.year += 1;
					this.month = 1;
				}else{
					this.month += 1;
				}
				this.$refs.calendarObj.next();
			},
			checkedEvent(weeks){
				let list = [];
				// 是否重复
				let isDuplicate = false;
				this.checkedList.forEach(item=>{
					if(item.date === weeks.fulldate){
						isDuplicate = true;
					}else{
						list.push(item);
					}
				})
				
				if(!isDuplicate){
					list.push({date:weeks.fulldate})
				}
				
				this.checkedList = list;
				
				if(!this.$props.isMultiple){
					let temp = [...(this.checkedList || [])];
					this.$emit("finishSelectDate",temp);
					this.checkedList = [];
					this.close();
				}
			},
			open() {
				// #ifndef MP
				let date = new Date();
				this.month = date.getMonth() + 1;
				this.year = date.getFullYear();
				this.date = date.getDate();
				
				this.curYear = this.year;
				this.curMonth = this.month;
				// #endif
				
				this.$refs.popupDialogObj.open();
			},
			close() {
				this.$refs.popupDialogObj.close();
			},
		}
	}
</script>

<style>
@import url('luanqing-date-picker.css');
</style>
