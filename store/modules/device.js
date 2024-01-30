
export default {
    state: {
        //历史连接设备
        historyDeviceList: [],
        filterDeviceOptions: [
            { text: '全部', value: 0 },
            { text: 'JDY-', value: 1 },
            { text: 'BT-', value: 2 },
            { text: 'CZBLE', value: 3 },
        ]
    },
    getters: {
    },
    mutations: {
        initHistoryDeviceList(state) {
            let historyDeviceList = uni.getStorageSync('historyDeviceList');
            if (historyDeviceList) {
                historyDeviceList = JSON.parse(historyDeviceList);
                state.historyDeviceList = historyDeviceList;
            }
        },
        //添加历史连接设备
        addHistoryDeviceList(state, device) {
            var historyDeviceList = state.historyDeviceList;
            let index = historyDeviceList.findIndex(item => item.deviceId === device.deviceId);
            if (index === -1) {
                historyDeviceList.push(device);
                state.historyDeviceList = historyDeviceList;
                uni.setStorageSync('historyDeviceList', JSON.stringify(state.historyDeviceList));
            }
        },
        initFilterDeviceOptions(state) {
            let filterDeviceOptions = uni.getStorageSync('filterDeviceOptions');
            if (filterDeviceOptions) {
                filterDeviceOptions = JSON.parse(filterDeviceOptions);
                state.filterDeviceOptions = filterDeviceOptions;
            }
        },
        addFilterDeviceOptions(state, options) {
            var filterDeviceOptions = state.filterDeviceOptions;
            filterDeviceOptions.push(options);
            uni.setStorageSync('filterDeviceOptions', JSON.stringify(state.filterDeviceOptions));
        }
    },
    actions: {
    }
}