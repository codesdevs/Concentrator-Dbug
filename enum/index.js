//连接蓝牙状态码枚举
const bluetoothEnum = {
    "0": '正常',
    "-1": '已连接',
    "10000": '未初始化蓝牙适配器',
    "10001": '当前蓝牙适配器不可用',
    "10002": '没有找到指定设备',
    "10003": '连接失败',
    "10004": '没有找到指定服务',
    "10005": '没有找到指定特征值',
    "10006": '当前连接已断开',
    "10007": '当前特征值不支持此操作',
    "10008": '其余所有系统上报的异常',
    "10009": 'Android 系统特有，系统版本低于 4.3 不支持 BLE',
    "10010": '已连接',
    "10011": '配对设备需要配对码',
    "10012": '连接超时',
    "10013": '连接 deviceId 为空或者是格式不正确',
};
function bluetoothEnumValue(key) {
    return bluetoothEnum[key];
}
//网络模式
const networkEnum = {
    "1": '以太网',
    "2": '2G',
    "3": '3G',
    "4": '4G',
    "11": 'nb',
    "12": 'IOT',
};
//网络运营商
const networkOperatorEnum = {
    "1": '移动',
    "2": '联通',
    "3": '电信',
    "11": '广电',
};
//抄表端口==>1 ~ 4为mbus1 ~ mbus4，其它值视为 “无”
const meterPortEnum = {
    "1": 'mbus1',
    "2": 'mbus2',
    "3": 'mbus3',
    "4": 'mbus4',
};
function meterPortEnumValue(key) {
    if (!meterPortEnum[key]) {
        return '无';
    } else {
        return meterPortEnum[key];
    }
}

//抄表序号 1 到 512，其它值视为 “无”
function meterIndexEnumValue(key) {
    if (key > 0 && key < 513) {
        return key;
    } else {
        return '无';
    }
}

//保护电流 100mA~320mA
const protectCurrentEnum = {
    "1": '100mA',
    "2": '150mA',
    "3": '200mA',
    "4": '250mA',
    "5": '300mA',
    "6": '320mA',
};
//采集通道 01H 为485-1、02H为485-2、03H为485-3、04H为485-4，11H为Mbus-1、12H为Mbus-2、13H为Mbus-3、14H为Mbus-4，其它备用。
const collectChannelEnum = [
    { value: '11', label: 'Mbus-1' },
    { value: '12', label: 'Mbus-2' },
    { value: '13', label: 'Mbus-3' },
    { value: '14', label: 'Mbus-4' },
]
//远程状态：0-开机启动，1-进入配置，2-初始化 AT，3配置参数，4-正在连接，5查询时钟，6-正在登录，7-登录成功，其它-关机重启
const remoteStatusEnum = {
    "0": '开机启动',
    "1": '进入配置',
    "2": '初始化 AT',
    "3": '配置参数',
    "4": '正在连接',
    "5": '查询时钟',
    "6": '正在登录',
    "7": '登录成功',
    "8": '关机重启',
};

//远程模组 0x10-WH-G5，0x11-Air780E
const remoteModuleEnum = {
    10: 'WH-GM5',
    11: 'Air780E',
};

//水表厂商 0000：宁波，0142：瑞泉，7833：积成
const waterMeterManufacturerEnum = [
    { value: '0000', label: '宁波' },
    { value: '0142', label: '瑞泉' },
    { value: '7833', label: '积成' },
]

export { bluetoothEnumValue, networkEnum, networkOperatorEnum, meterPortEnumValue, meterIndexEnumValue, collectChannelEnum, remoteStatusEnum, remoteModuleEnum, waterMeterManufacturerEnum };