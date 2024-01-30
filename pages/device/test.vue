<template>
    <view>
        <luanqing-date-picker ref="datePickerObj" themeColor="var(--themeColor)" :isSimple="mode === 'simple'" :isMultiple="mode === 'multiple'"
            @finishSelectDate="finishSelectDate" :defaultCheckedList="defaultCheckedList">
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
            defaultCheckedList:[]
        }
    },
    methods: {
        show(showType) {
            this.mode = showType;
            this.$refs.datePickerObj.open();
        },
        finishSelectDate(e) {
            console.error("选择了日期：", e);
        }
    }
}
</script>
<style lang="scss">
.btn {
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