<template>
    <view class="container" id="container">
        <view v-if="bluetoothInitStateCode == 0">
            <!-- #ifdef MP-WEIXIN -->
            <van-sticky>
                <view class="filter">
                    <view class="search" container="container" v-show="false">
                        <van-search :value="searchValue" placeholder="请输入设备编号" @change="searchValueChange" />
                    </view>
                    <view class="dropdown" v-show="false">
                        <van-dropdown-menu custom-class="" active-color="var(--themeColor)">
                            <van-dropdown-item :value="dropdownValue" :options="filterDeviceOptions"
                                @change="dropdownChange">
                                <view style="padding: 10rpx 40rpx;">
                                    <van-button type="danger" block round bind:click="onConfirm" color="var(--themeColor)"
                                        @click="addFilterShowPopup = true">
                                        添加过滤条件
                                    </van-button>
                                </view>
                            </van-dropdown-item>
                        </van-dropdown-menu>
                    </view>
                </view>
            </van-sticky>
            <!-- #endif -->
            <view class="device-list_title">
                <view class="title">·设备列表</view>
                <!-- #ifdef MP-WEIXIN -->
                <view class="refresh">
                    <van-button type="info" round color="var(--themeColor)" icon="replay" size="small"
                        @click="refreshDeviceList">刷新</van-button>
                </view>
                <!-- #endif -->
            </view>
            <view class="list_content">
                <view class="list">
                    <view class="item" v-for="(item, index) in deviceList" :key="index" @click="connect(item)">
                        <view class="icon">
                            <van-image width="30" height="30" src="/static/icon/bluetooth_icon.png" />
                        </view>
                        <view class="content">
                            <view class="name">{{ item.name }}</view>
                            <view class="id">{{ item.deviceId }}</view>
                        </view>
                        <view class="status">
                            <view v-if="item.connectState == 'connecting'" class="connecting">
                                <van-image width="15" height="15" src="/static/icon/connecting_icon.png" />
                                <view>连接中...</view>
                            </view>
                            <!-- 连接成功 -->
                            <view v-if="item.connectState == 'connected'" class="connected">
                                <van-image width="30" height="13" src="/static/icon/connected_icon.png" />
                                <view>连接成功</view>
                            </view>
                            <!-- 连接失败 -->
                            <view v-if="item.connectState == 'connectFail'" class="connectFail">
                                <van-image width="30" height="16" src="/static/icon/connectFail_icon.png" />
                                <view>连接失败</view>
                            </view>
                            <view v-if="item.connectState == ''" class="signal">
                                {{ item.RSSI }}
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="history-device-list_title" v-show="false">
                <view class="title">·连接记录</view>
                <view class="refresh"><van-button type="info" round color="var(--themeColor)" icon="replay"
                        size="small">刷新</van-button></view>
            </view>
            <view class="list_content" v-show="false">

                <view class="list">
                    <view class="item" v-for="(item, index) in historyDeviceList" :key="index">
                        <view class="icon">
                            <van-image width="30" height="30" src="/static/icon/bluetooth_icon.png" />
                        </view>
                        <view class="content">
                            <view class="name">{{ item.name }}</view>
                            <view class="id">{{ item.deviceId }}</view>
                        </view>
                        <!-- <view class="status">
                            <view v-if="item.connectState == 'connecting'" class="connecting">
                                <van-image width="15" height="15" src="/static/icon/connecting_icon.png" />
                                <view>连接中...</view>
                            </view>
                            <view v-if="item.connectState == 'connected'" class="connected">
                                <van-image width="30" height="13" src="/static/icon/connected_icon.png" />
                                <view>连接成功</view>
                            </view>
                            <view v-if="item.connectState == 'connectFail'" class="connectFail">
                                <van-image width="30" height="16" src="/static/icon/connectFail_icon.png" />
                                <view>连接失败</view>
                            </view>
                            <view v-if="item.connectState == ''" class="signal">
                                {{ item.RSSI }}
                            </view>
                        </view> -->
                    </view>
                </view>
            </view>
        </view>
        <view v-if="bluetoothInitStateCode == 10001" class="error">
            <van-empty image="network" :description="bluetoothInitStateMsg">
                <van-button type="danger" class="bottom-button" color="var(--themeColor)"
                    @click="initBluetooth">刷新</van-button>
            </van-empty>
        </view>
        <van-popup :show="addFilterShowPopup" round closeable custom-class="popup-content"
            @close="addFilterShowPopup = false">
            <van-field :value="addFilterValue" placeholder="请输入过滤设备名称" :border="false" @change="addFilterValueChange"
                clearable />
            <van-button type="default" color="var(--themeColor)" size="large" :loading="addFilterValueSubmitLoading"
                custom-style="margin-top:20rpx;display:flex;width:90%;" @click="addFilterValueHandler">提交</van-button>
        </van-popup>
    </view>
</template>
<script>
import { mapState } from "vuex";
import { bluetoothEnumValue } from '@/enum'
export default {
    watch: {
        bluetoothInitStateCode() {
            console.log('bluetoothInitStateCode watch', this.bluetoothInitStateCode)
            this.bluetoothInitStateMsg = bluetoothEnumValue(this.bluetoothInitStateCode)
            console.log('bluetoothInitStateMsg watch', this.bluetoothInitStateMsg)
        },
    },
    data() {
        return {
            searchValue: '',
            //
            bluetoothInitStateCode: 0,
            bluetoothInitStateMsg: '',
            deviceList: [],
            deviceLists: [],
            data:
            {
                name: "JDY-23",
                deviceId: "316B5F35-3B02-B860-819E-8506863C3378",
            },
            dropdownValue: 0,
            addFilterShowPopup: false,
            addFilterValue: '',
            addFilterValueSubmitLoading: false,
        }
    },
    computed: {
        ...mapState({
            historyDeviceList: (state) => state.device.historyDeviceList,
            filterDeviceOptions: (state) => state.device.filterDeviceOptions,
        }),
    },
    created() {
        this.$store.commit("initFilterDeviceOptions");
    },
    methods: {
        searchValueChange(e) {
            this.searchValue = e.detail
            if (this.searchValue == '') {
                this.deviceList = this.deviceLists
                return
            }
            var deviceList = []
            this.deviceLists.forEach(item => {
                if (item.name.indexOf(this.searchValue) >= 0) {
                    deviceList.push(item)
                }
            });
            this.deviceList = deviceList
        },
        dropdownChange(event) {
            this.dropdownValue = event.detail
            if (this.dropdownValue == 0) {
                this.deviceList = this.deviceLists
                return
            }
            var text = this.filterDeviceOptions[this.dropdownValue].text
            var deviceList = []
            this.deviceLists.forEach(item => {
                if (item.name.indexOf(text) >= 0) {
                    deviceList.push(item)
                }
            });
            this.deviceList = deviceList
        },
        addFilterValueChange(event) {
            this.addFilterValue = event.detail
        },
        addFilterValueHandler() {
            var that = this;
            if (that.addFilterValue == '') {
                uni.showToast({
                    title: '请输入过滤设备名称',
                    icon: 'none',
                    duration: 2000
                })
                return
            }
            that.addFilterValueFunction()

        },
        addFilterValueFunction() {
            var that = this;
            if (that.addFilterValue == '') {
                uni.showToast({
                    title: '请输入过滤设备名称',
                    icon: 'none',
                    duration: 2000
                })
                return
            }
            //判断是否已经存在
            var isExist = false;
            that.filterDeviceOptions.forEach(item => {
                if (item.text == that.addFilterValue) {
                    isExist = true
                    uni.showToast({
                        title: '已存在该过滤设备名称',
                        icon: 'none',
                        duration: 2000
                    })
                    return
                }
            });
            if (isExist) {
                return
            }
            //获取option1的最后一个value值
            var lastValue = that.filterDeviceOptions[that.filterDeviceOptions.length - 1].value

            that.addFilterValueSubmitLoading = true
            setTimeout(() => {
                that.addFilterValueSubmitLoading = false
                var options = {
                    text: that.addFilterValue,
                    value: lastValue + 1
                }
                that.$store.commit('addFilterDeviceOptions', options)
                that.addFilterValue = ''
                that.addFilterShowPopup = false
            }, 1000);
        },
        //初始化蓝牙模块
        initBluetooth() {
            var that = this;
            uni.openBluetoothAdapter({
                success: function (res) {
                    console.log(res)
                    that.bluetoothInitStateCode = res.errno
                    that.searchDevice()
                },
                fail: function (res) {
                    console.log(res)
                    that.bluetoothInitStateCode = res.errCode
                    uni.showToast({
                        title: bluetoothEnumValue(res.errCode),
                        icon: 'error',
                        mask: true,
                        duration: 2000
                    });
                }
            })
        },
        // ArrayBuffer转16进度字符串示例
        ab2hex(buffer) {
            const hexArr = Array.prototype.map.call(
                new Uint8Array(buffer),
                function (bit) {
                    return ('00' + bit.toString(16)).slice(-2)
                }
            )
            return hexArr.join('')
        },
        //索附近设备
        searchDevice() {
            var that = this;
            uni.startBluetoothDevicesDiscovery({
                success: function (res) {
                    console.log(res)
                    that.bluetoothInitStateCode = res.errno
                },
                fail: function (res) {
                    console.log(res)
                    that.bluetoothInitStateCode = res.errCode
                    uni.showToast({
                        title: bluetoothEnumValue(res.errCode),
                        icon: 'error',
                        mask: true,
                        duration: 2000
                    });
                }
            })
            uni.onBluetoothDeviceFound(function (devices) {
                that.addDeviceList(devices)
            })
            that.getPairedDevice()
        },
        //添加设备列表
        addDeviceList(devices) {
            var that = this;
            var isExist = false;
            if (devices.deviceId) {
                if (devices.advertisData) {
                    devices.advertisData = that.ab2hex(devices.advertisData)
                } else {
                    devices.advertisData = ''
                }
                that.deviceList.forEach(item => {
                    if (item.deviceId == devices.deviceId) {
                        isExist = false;
                    }
                });
                if (isExist) {
                    that.deviceList.push(devices)
                }
            } else if (devices.devices) {
                that.deviceList.forEach(item => {
                    if (item.deviceId == devices.devices[0].deviceId) {
                        isExist = false;
                    }
                });
                if (!isExist) {
                    devices.devices[0].connectState = ''
                    this.deviceLists.push(devices.devices[0])
                    this.deviceList.push(devices.devices[0])
                    // this.deviceList.push(devices.devices[0])
                    // var isFilter = false;
                    // that.filterDeviceOptions.forEach(item => {
                    //     if (devices.devices[0].name.indexOf(item.text) >= 0) {
                    //         devices.devices[0].connectState = ''
                    //         that.deviceLists.push(devices.devices[0])
                    //         isFilter = true
                    //     }
                    // });
                    // if (isFilter) {
                    //     if (that.dropdownValue == 0) {
                    //         that.deviceList.push(devices.devices[0])
                    //     } else {
                    //         if (devices.devices[0].name.indexOf(that.filterDeviceOptions[that.dropdownValue].text) >= 0) {
                    //             devices.devices[0].connectState = ''
                    //             that.deviceList.push(devices.devices[0])
                    //         }

                    //     }
                    // }
                    that.deviceList = that.deviceList.sort((a, b) => {
                        return b.RSSI - a.RSSI
                    })
                    that.deviceLists = that.deviceLists.sort((a, b) => {
                        return b.RSSI - a.RSSI
                    })
                }
            }
        },
        //获取本机已配对的蓝牙设备
        getPairedDevice() {
            var that = this;
            uni.getBluetoothDevices({
                success: function (res) {
                    console.log(res)
                    // that.bluetoothInitStateCode = res.errno
                },
                fail: function (res) {
                    console.log(res)
                    // that.bluetoothInitStateCode = res.errCode
                }
            })
        },
        refreshDeviceList() {
            var that = this;
            that.deviceList = []
            that.deviceLists = []
            that.searchDevice()
        },
        connect(item) {
            if (item.connectState == 'connecting') {
                return
            }
            item.connectState = 'connecting'
            var that = this;
            uni.createBLEConnection({
                deviceId: item.deviceId,
                timeout: 8000,
                success: function (res) {
                    console.log(res)
                    item.connectState = 'connected'
                    console.log('连接成功')
                    that.$store.commit('addHistoryDeviceList', item)
                    setTimeout(() => {
                        item.connectState = ''
                        uni.navigateTo({
                            url: './detail?id=' + item.deviceId + '&name=' + item.name
                        })
                    }, 1000);
                },
                fail: function (res) {
                    console.log(res)
                    item.connectState = 'connectFail'
                    uni.showToast({
                        title: '连接失败',
                        icon: 'none',
                        duration: 2000
                    })
                    that.bluetoothInitStateCode = res.errCode
                    that.refreshDeviceList()
                }
            })
        }
    },
    onLoad() {
        console.log('Page Load')
        this.initBluetooth()
    },
    onReady() {
        console.log('Page Ready')
    },
    onShow() {
        console.log('Page Show')
    },
    onHide() {
        console.log('Page Hide')
    },
    onUnload() {
        console.log('Page Unload')
    },
}
</script>
<style lang="scss">
.container {
    padding: 0 20rpx;
}

.filter {
    height: fit-content;
    display: flex;

    .search {
        flex: 1;
    }

    // .dropdown {
    //     flex: 0.3;
    //     height: 50px;
    // }
}

.device-list_title,
.history-device-list_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1rpx solid #eee;
    padding-bottom: 20rpx;
    background-color: white;

    .title {
        font-size: 32rpx;
        font-weight: bold;
        color: var(--themeColor);
    }
}

.list_content {
    height: fit-content;
    padding: 0 20rpx;



    .list {
        margin-top: 20rpx;

        .item {
            height: 100rpx;
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 30rpx;
            border-bottom: 1rpx solid #e8e8e8;
            padding-bottom: 15rpx;

            //内容
            .content {
                margin-left: 20rpx;
                //宽度是父元素的剩余宽度
                display: flex;
                flex-direction: column;
                //设备id不换行，超出显示省略号
                overflow: hidden;
                flex: 1;

                .id {
                    font-size: 30rpx;
                    color: #999;
                    overflow: hidden;
                    margin-top: 20rpx;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }

            .status {
                flex: 0.5;
                text-align: center;
                color: var(--themeColor);

                //子view居中
                view {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: row;
                }

                .connected {
                    color: #67C23A;
                }

                .connectFail {
                    color: #c71818;
                }

                .signal {
                    justify-content: right;
                    font-weight: 800;
                }
            }
        }
    }
}

.error {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup-content {
    width: 80%;
    padding: 50rpx 20rpx;
}
</style>