<template>
    <view class="container">
        <view style="padding-bottom: 200rpx;">

            <!-- 设备基本信息，名称，设备id -->
            <view class="device-info">
                <view class="icon">
                    <van-image width="40" height="40" src="/static/icon/bluetooth-white_icon.png"></van-image>
                </view>
                <view class="content">
                    <view class="name">
                        <view class="value">
                            <text>41</text>{{ device.number }}
                        </view>
                        <van-icon name="edit" @click="showDeviceNumberEditPopup = true" />
                    </view>
                    <view class="id">{{ device.id }}</view>
                </view>
                <view class="status">
                    <van-tag type="success">已连接</van-tag>
                </view>
            </view>
            <!-- 参数配置 -->
            <view class="config">
                <view class="top">
                    <view class="title" @click="expandConfig">
                        <van-icon :name="configShow ? 'arrow-down' : 'arrow-up'" />
                        <view>参数配置</view>
                    </view>
                    <view class="refresh"><van-button type="info" round color="var(--themeColor)" icon="replay" size="small"
                            @click="refreshDeviceConfig" v-show="configShow">刷新</van-button></view>
                </view>
                <view class="form" v-show="configShow">
                    <van-cell-group custom-class="form-class">
                        <!-- <van-field :value="device.number" maxlength="8" type="number" required clearable label="设备编号"
                            placeholder="请输入设备编号" @blur="numberBlur" /> -->

                        <van-field :value="device.remoteMainIp" required clearable label="远程主ip及端口" title-width="7.1em"
                            placeholder="请输入远程主ip及端口" @blur="remoteMainIpBlur" @change="remoteMainIpChange"
                            :error-message="device.remoteMainIpError" />
                        <van-field :value="device.remoteBackupIp" required clearable label="远程备ip及端口" title-width="7.1em"
                            placeholder="请输入远程备ip及端口" @blur="remoteBackupIpBlur" @change="remoteBackupIpChange"
                            :error-message="device.remoteBackupIpError" />
                        <!-- <van-field :value="device.localIp" type="digit" clearable label="本地ip" title-width="7.1em"
                            placeholder="请输入本地ip" @blur="localIpBlur" />
                        <van-field :value="device.subnetMask" type="digit" clearable label="子网掩码" title-width="7.1em"
                            placeholder="请输入子网掩码" @blur="subnetMaskBlur" />
                        <van-field :value="device.gateway" type="digit" clearable label="网关" title-width="7.1em"
                            placeholder="请输入网关" @blur="gatewayBlur" /> -->
                        <van-button type="primary" :block="true" size="large" color="var(--themeColor)"
                            @click="saveDeviceConfig">设置</van-button>
                    </van-cell-group>
                </view>
            </view>
            <!-- 系统状态 -->
            <view class="config">
                <view class="top">
                    <view class="title" @click="expandSysStatus">
                        <van-icon :name="sysStatusShow ? 'arrow-down' : 'arrow-up'" />
                        <view>系统状态</view>
                    </view>
                    <view class="refresh"><van-button type="info" round color="var(--themeColor)" icon="replay" size="small"
                            @click="refreshSysStatus" v-show="sysStatusShow">刷新</van-button></view>
                </view>
                <view class="form" v-show="sysStatusShow">
                    <van-cell-group custom-class="form-class">
                        <van-field :value="device.clock" disabled clearable label="系统时钟" />
                        <van-field :value="device.remoteLoginStatus" disabled clearable label="远程状态" />
                        <van-field :value="device.remoteSignal" disabled clearable label="远程信号" />
                        <van-field :value="device.iccid" disabled clearable label="SIM卡号" />
                        <van-field :value="device.networkType" disabled clearable label="网络" />
                        <van-field :value="device.networkOperator" disabled clearable label="运营商" />
                        <van-field :value="device.remoteModule" disabled clearable label="远程模组" />
                        <van-field :value="device.imei" disabled clearable label="IMEI" />
                        <van-field :value="device.meterPort" disabled clearable label="抄表端口" />
                        <van-field :value="device.meterNumber" disabled clearable label="抄表序号" />
                        <van-field :value="device.readMeterRate" disabled clearable label="抄见率" />
                        <van-field :value="device.reportRate" disabled clearable label="上报率" />
                        <van-field :value="device.flash" disabled clearable label="FLASH" />
                        <van-field :value="device.readMeterCurrent" disabled clearable label="抄表电流" />
                        <van-field :value="device.systemRunDuration" disabled clearable label="系统运行" />
                    </van-cell-group>
                </view>
            </view>
            <view class="config">
                <view class="top">
                    <view class="title" @click="expandReadMeter">
                        <van-icon :name="readMeterShow ? 'arrow-down' : 'arrow-up'" />
                        <view>抄表控制</view>
                    </view>
                </view>
                <view class="form" v-show="readMeterShow">
                    <van-cell-group custom-class="form-class">
                        <van-field :value="device.meterAddress" type="digit" required clearable maxlength="10" label="表计地址"
                            placeholder="请输入表计地址" @blur="meterAddressBlur" />
                        <van-cell title="水表厂商" label-class="color: #646566;"
                            :value="waterMeterManufacturerPicker[waterMeterManufacturerIndex]" is-link
                            @click="showWaterMeterManufacturerPicker = true">
                        </van-cell>
                        <van-cell title="采集通道" label-class="color: #646566;"
                            :value="collectChannelPicker[collectChannelIndex]" is-link
                            @click="showCollectChannelPicker = true">
                        </van-cell>
                        <van-button type="primary" :block="true" size="large" color="var(--themeColor)"
                            @click="transparentTransmission">透明转发</van-button>
                        <view style="display: flex;justify-content: space-around;margin-top: 20rpx;">
                            <view style="flex: 1;">
                                <van-button type="primary" :block="true" size="large" color="var(--themeColor)"
                                    @click="startReadMeter">启动补抄</van-button>
                            </view>
                            <view style="flex: 1;margin-left: 20rpx;">
                                <van-button type="primary" :block="true" size="large" color="var(--themeColor)"
                                    @click="restartReadMeter">重启抄表</van-button>
                            </view>
                        </view>
                    </van-cell-group>
                </view>
            </view>
            <!-- 表计档案 -->
            <view class="config">
                <view class="top">
                    <view class="title" @click="expandMeterArchives">
                        <van-icon :name="meterArchivesShow ? 'arrow-down' : 'arrow-up'" />
                        <view>表计档案</view>
                    </view>
                    <view class="refresh" v-show="false"><van-button type="info" round color="var(--themeColor)"
                            icon="replay" size="small" @click="refreshMeterArchives"
                            v-show="meterArchivesShow">刷新</van-button></view>
                </view>
                <view class="form" v-show="meterArchivesShow">
                    <van-cell-group custom-class="form-class">
                        <van-field :value="meterArchives.number" maxlength="4" clearable label="序号" type="digit"
                            title-width="4em" @blur="meterArchivesNumberBlur" required placeholder="请输入序号" />
                        <van-field :value="meterArchives.manufacturer" disabled clearable label="厂商" title-width="4em" />
                        <van-field :value="meterArchives.address" disabled clearable label="地址" title-width="4em" />
                        <van-field :value="meterArchives.port" disabled clearable label="端口" title-width="4em" />
                    </van-cell-group>
                    <view style="display: flex;justify-content: space-around;margin-top: 20rpx;">
                        <view style="flex: 1;">
                            <van-button type="primary" :block="true" size="large" color="var(--themeColor)"
                                @click="resetDeviceConfig">恢复出厂</van-button>
                        </view>
                        <view style="flex: 1;margin-left: 20rpx;">
                            <van-button type="primary" :block="true" size="large" color="var(--themeColor)"
                                @click="queryMeterArchives">查询</van-button>
                        </view>
                    </view>
                </view>
            </view>
            <!-- MBUS保护电流 -->
            <view class="config">
                <view class="top">
                    <view class="title" @click="expandProtectiveCurrent">
                        <van-icon :name="protectiveCurrentShow ? 'arrow-down' : 'arrow-up'" />
                        <view>MBUS保护电流</view>
                    </view>
                    <view class="refresh"><van-button type="info" round color="var(--themeColor)" icon="replay" size="small"
                            @click="refreshProtectiveCurrent" v-show="protectiveCurrentShow">刷新</van-button></view>
                </view>
                <view class="form" v-show="protectiveCurrentShow">
                    <van-cell-group custom-class="form-class">
                        <van-field :value="protectiveCurrent" type="digit" @change="protectiveCurrentChange" clearable
                            label="保护电流(mA)" placeholder="请输入保护电流(100-320mA)">
                        </van-field>
                        <van-button type="primary" :block="true" size="large" color="var(--themeColor)"
                            @click="saveProtectiveCurrent">设置</van-button>
                    </van-cell-group>
                </view>
            </view>
            <!-- 软件升级 -->
            <view class="config" v-show="true">
                <view class="top">
                    <view class="title" @click="expandSoftwareUpgrading">
                        <van-icon :name="softwareUpgradingShow ? 'arrow-down' : 'arrow-up'" />
                        <view>软件升级</view>
                    </view>
                </view>
                <view class="form" v-show="softwareUpgradingShow">
                    <van-cell-group custom-class="form-class">
                        <van-field :value="softwareUpgrading.fileName" disabled clearable label="文件名" />
                        <van-field :value="softwareUpgrading.hardwareVersion" disabled clearable label="硬件版本" />
                        <van-field :value="softwareUpgrading.softwareVersion" disabled clearable label="软件版本" />
                        <!-- <van-field :value="softwareUpgrading.fileSize" disabled clearable label="文件大小(KB)"
                            title-width="8em" /> -->
                    </van-cell-group>
                    <van-button type="primary" :block="true" size="large" color="var(--themeColor)"
                        @click="chooseUpgradingFile">选择文件</van-button>
                    <view style="display: flex;justify-content: space-around;margin-top: 20rpx;">
                        <view style="flex: 1;" v-if="softwareUpgrading.fileSize != ''">
                            <van-button type="primary" :block="true" size="large" color="var(--themeColor)"
                                @click="notifyUpgrading">告知</van-button>
                        </view>
                        <view style="flex: 1;margin-left: 20rpx;" v-if="softwareUpgrading.fileSize != ''">
                            <van-button type="primary" :block="true" size="large" color="var(--themeColor)"
                                @click="upgrading">写入</van-button>
                        </view>
                        <view :style="softwareUpgrading.fileSize != '' ? 'flex: 1;margin-left: 20rpx;' : 'flex: 1;'">
                            <van-button type="primary" :block="true" size="large" color="var(--themeColor)"
                                @click="queryVersion">查询版本</van-button>
                        </view>
                    </view>
                </view>
            </view>

        </view>
        <van-popup :show="showCollectChannelPicker" round position="bottom" @close="closeCollectChannelPicker">
            <van-picker show-toolbar title="采集通道" :columns="collectChannelPicker" @confirm="collectChannelPickerConfirm"
                @cancel="showCollectChannelPicker = false" />
        </van-popup>
        <van-popup :show="showWaterMeterManufacturerPicker" round position="bottom"
            @close="showWaterMeterManufacturerPicker = false">
            <van-picker show-toolbar title="水表厂商" :columns="waterMeterManufacturerPicker"
                @confirm="waterMeterManufacturerPickerConfirm" @cancel="showWaterMeterManufacturerPicker = false" />
        </van-popup>
        <van-popup :show="showDeviceNumberEditPopup" round closeable custom-class="popup-content"
            @close="showDeviceNumberEditPopup = false">
            <view class="device-number-input">
                <text>41</text>
                <van-field :value="device.number" placeholder="请输入设备名称" maxlength="8" type="number" clearable
                    :border="false" @change="editDeviceNumberChange" custom-style="font-size:35rpx;margin-left: -28rpx;" />
            </view>
            <van-button type="default" color="var(--themeColor)" size="large" :loading="editDeviceNumberSubmitLoading"
                custom-style="margin-top:20rpx;display:flex;width:90%;" @click="editDeviceNumberHandler">提交</van-button>
        </van-popup>
        <!-- 断开连接和保存，固定底部 -->
        <view class="bottom">
            <view class="break">
                <van-button type="danger" size="large" @click="close">断开连接</van-button>
            </view>
            <!-- <view class="save">
                <van-button type="primary" size="large" color="var(--themeColor)" @click="save">保存</van-button>
            </view> -->
        </view>
    </view>
</template>
<script>
import { hexStringToArrayBuffer, ab2hex, floatHexToDec, hexStrToCRC16Modbus, decToHex, hexToDec, decToHexByLen, getCs8, reverseString } from '@/utils/tools.js'
import { bluetoothEnumValue, networkEnum, networkOperatorEnum, meterPortEnumValue, meterIndexEnumValue, collectChannelEnum, remoteStatusEnum, remoteModuleEnum, waterMeterManufacturerEnum } from '@/enum'
var hexArr = []
var i = 0;
var segmentLength = 0;
var segmentNumber = 0;
export default {
    data() {
        return {
            device: {
                //设备id
                id: '',
                //设备名称
                name: '',
                //设备编号
                number: '',
                //远程主ip及端口
                remoteMainIp: '',
                //远程主ip及端口error
                remoteMainIpError: '',
                //远程备ip及端口
                remoteBackupIp: '',
                //远程备ip及端口error
                remoteBackupIpError: '',
                //本地ip
                localIp: '',
                //子网掩码
                subnetMask: '',
                //网关
                gateway: '',
                //设备端口
                port: '',
                //系统时钟
                clock: '',
                //远程登录状态
                remoteLoginStatus: '',
                //远程信号
                remoteSignal: '',
                //SIM卡号
                iccid: '',
                //网络类型
                networkType: '',
                //网络运营商
                networkOperator: '',
                //远程模组
                remoteModule: '',
                //imei
                imei: '',
                //抄表端口
                meterPort: '',
                //抄表序号
                meterNumber: '',
                //抄见率
                readMeterRate: '',
                //上报率
                reportRate: '',
                //FLASH
                flash: '',
                //抄表电流
                readMeterCurrent: '',
                //系统运行
                systemRunDuration: '',
                //表计地址
                meterAddress: '',
                //水表厂商
                waterMeterManufacturer: '',
                //MBUS端口
                mbusPort: '',
                //设备APN
                apn: '',
                //服务id
                serviceId: '',
                //特征值id
                characteristicId: '',

            }, //设备信息
            //表计档案
            meterArchives: {
                //表序号
                number: '',
                //厂商
                manufacturer: '',
                //表地址
                address: '',
                //端口
                port: '',

            },
            meterArchivesShow: true,
            //保护电流
            protectiveCurrent: '',
            protectiveCurrentShow: true,
            timer: null,
            hexStr: '',
            lastHexStr: '',
            caliber: '0',
            saveHexStr: '0106807FA5012B42',
            configShow: true,
            sysStatusShow: true,
            readMeterShow: true,
            softwareUpgradingShow: true,
            isConnected: false,
            //获取系统状态报文
            sysStatusHexStr: '68 0E 00 04 00 35 FF FF FF FF 41 80 54 16',
            //获取网络参数报文
            networkHexStr: '68 0E 00 04 00 11 FF FF FF FF 41 86 B0 16',
            //恢复出厂设置报文
            resetDeviceConfigHexStr: '68 0E 00 02 00 01 FF FF FF FF 41 04 0A 16',
            //表计档案查询报文
            meterArchivesHexStr: '68 11 00 04 00 10 FF FF FF FF 41 01 01 00 E3 76 16',
            //保护电流查询报文
            protectiveCurrentHexStr: '68 0E 00 04 00 73 FF FF FF FF 41 8E F2 16',
            //查询版本报文
            queryVersionHexStr: '68 0E 00 01 00 18 FF FF FF FF 41 46 16 16',
            //报文队列，用于存放分段回复的报文
            hexStrQueue: [],
            //采集通道picker
            collectChannelPicker: ['Mbus-1', 'Mbus-2', 'Mbus-3', 'Mbus-4'],
            collectChannelIndex: 0,
            showWaterMeterManufacturerPicker: false,
            waterMeterManufacturerPicker: ['宁波', '瑞泉', '积成'],
            waterMeterManufacturerIndex: 0,
            showCollectChannelPicker: false,
            showDeviceNumberEditPopup: false,
            editDeviceNumberSubmitLoading: false,
            tempDeviceNumber: null,
            //软件升级信息
            softwareUpgrading: {
                //文件名
                fileName: '',
                //文件大小
                fileSize: '',
                //文件内容
                fileContent: '',
                //硬件版本
                hardwareVersion: '',
                //软件版本
                softwareVersion: '',
            },
            //软件版本
            softwareVersion: '',
            //硬件版本
            hardwareVersion: '',
            //是否加载中
            loading: false,
        }
    },

    watch: {
        isConnected: function (val) {
            console.log('isConnected', val)
            this.refreshDeviceConfig()
            // setTimeout(() => {
            //     this.refreshSysStatus()
            // }, 1000);
            // setTimeout(() => {
            //     this.refreshProtectiveCurrent()
            // }, 2000);
            // setTimeout(() => {
            //     this.queryMeterArchives()
            // }, 3000);
        },
        //监听device.number
        'device.number': function (val) {
            console.log('device.number', val)
            this.tempDeviceNumber = val
        }
    },

    onLoad(options) {
        console.log(options)
        this.device.id = options.id
        this.device.name = options.name
    },
    onShow() {
        this.getBLEDeviceServices()
        // var timer = setInterval(() => {
        //     this.save()
        // }, 1000);
        // this.timer = timer
        console.log(this.softwareUpgrading.fileSize != '')
    },
    onUnload() {
        console.log('Unload')
        clearInterval(this.timer)
        this.close()
    },
    methods: {
        chooseUpgradingFile() {
            this.softwareUpgrading.fileName = ''
            this.softwareUpgrading.fileSize = ''

            let that = this;
            wx.chooseMessageFile({
                count: 1, //限制选择的文件数量
                type: 'file',//非图片和视频的文件,不选默认为all
                extension: ['bin'],//此处限制文件类型
                success(res) {
                    const tempFilePaths = res.tempFiles
                    console.log('临时路径', tempFilePaths)
                    that.softwareUpgrading.fileName = tempFilePaths[0].name
                    //读取bin文件内容
                    wx.getFileSystemManager().readFile({
                        filePath: tempFilePaths[0].path,
                        encoding: 'hex',
                        success(res) {
                            console.log('读取bin文件内容', res.data)
                            //将bin文件内容转成16进制
                            var hex = res.data
                            //将hex转成16进制数组
                            var hexArray = hexStringToArrayBuffer(hex)
                            console.log('hexArray', hexArray)
                            //文件大小
                            that.softwareUpgrading.fileSize = hexArray.byteLength
                            //软件版本
                            that.softwareUpgrading.softwareVersion = reverseString(hex.substr(0, 8))
                            //硬件版本
                            that.softwareUpgrading.hardwareVersion = reverseString(hex.substr(8, 8))
                            //文件内容
                            that.softwareUpgrading.fileContent = hex
                        }
                    })
                }
            })
        },
        upgrading() {
            hexArr = this.softwareUpgrading.fileContent.match(/[\s\S]{1,2}/g) || []
            console.log(' hexArr[24]', hexArr[24])
            //段长
            segmentLength = Number(hexArr[24]) + (Number(hexArr[25]) << 8) + (Number(hexArr[26]) << 16) + (Number(hexArr[27]) << 24) + 32
            console.log('segmentLength', segmentLength)
            //段数
            segmentNumber = (this.softwareUpgrading.fileSize + segmentLength - 1) / segmentLength
            segmentNumber = segmentNumber.toFixed(0)
            console.log('segmentNumber', segmentNumber)

        },
        //查询版本
        queryVersion() {
            console.log('queryVersion')
            this.startLoading()
            this.writeBLECharacteristicValue(this.queryVersionHexStr)
        },
        startLoading() {
            uni.showLoading({
                title: '加载中',
                mask: true
            })
            this.loading = true
            this.closeLoading()
        },
        closeLoading() {
            //判断是否加载中
            setTimeout(() => {
                console.log('this.loading', this.loading)
                if (this.loading) {
                    uni.hideLoading()
                    this.loading = false
                    uni.showToast({
                        title: '加载失败',
                        icon: 'none'
                    })
                }
            }, 5000);
        },
        //告知升级
        notifyUpgrading() {
            console.log('notifyUpgrading')
            this.startLoading()
            //文件大小
            var fileSize = this.softwareUpgrading.fileSize
            fileSize = reverseString(fileSize.toString(16))
            fileSize = fileSize.padEnd(8, '0')
            console.log('fileSize', fileSize)
            //硬件版本
            var hardwareVersion = reverseString(this.softwareUpgrading.hardwareVersion)
            console.log('hardwareVersion', hardwareVersion)
            //软件版本
            var softwareVersion = reverseString(this.softwareUpgrading.softwareVersion)
            console.log('softwareVersion', softwareVersion)

            var crc16Code = hexStrToCRC16Modbus(`1C 00 01 00 60 FF FF FF FF 41 ${fileSize} ${hardwareVersion} ${softwareVersion} 00 00`)
            console.log('crc16Code', crc16Code)
            var hex = `68 1C 00 01 00 60 FF FF FF FF 41 ${fileSize} ${hardwareVersion} ${softwareVersion} 00 00 ${crc16Code} 16`
            console.log('hex', hex)
            this.writeBLECharacteristicValue(hex)
        },
        messageChange(e) {
            this.hexStr = e.detail
        },
        editDeviceNumberChange(e) {
            this.tempDeviceNumber = e.detail
        },
        messageBlur(e) {
            console.log(e)
            //判断是否为空
            if (e.detail.value == '') {
                return
            }
            var str = e.detail.value
            console.log('writeBLECharacteristicValue', str)
            //将str转成16进制
            //值转成16进制
            var hex = decToHex(str)
            console.log('writeBLECharacteristicValue 转成16进制', hex)
            this.lastHexStr = '01 06 80 42 00'.replace(/\s*/g, "");
            str = this.lastHexStr + hex
            console.log('writeBLECharacteristicValue 加上前面的', str)
            //去除空格
            str = str.replace(/\s*/g, "")
            this.hexStr = str
            //crc16校验
            this.hexStr = this.hexStr + hexStrToCRC16Modbus(this.hexStr)
            console.log('writeBLECharacteristicValue CRC16校验后', this.hexStr)
            this.writeBLECharacteristicValue(this.hexStr)
        },
        //编辑设备编号提交
        editDeviceNumberHandler() {
            console.log('editDeviceNumberHandler')
            if (this.tempDeviceNumber == null || this.tempDeviceNumber == undefined || this.tempDeviceNumber == '') {
                uni.showToast({
                    title: '设备编号不能为空',
                    icon: 'none'
                })
            }
            this.editDeviceNumberSubmitLoading = true
            this.device.number = this.tempDeviceNumber
            console.log("this.device.number", this.device.number)
            var len = 2;
            var numberHex = this.device.number.match(new RegExp('.{1,' + len + '}', 'g')).reverse().join('')
            //设备编号反转后
            console.log("============设备编号反转后==>：" + numberHex + "=================")
            var crcHex = hexStrToCRC16Modbus('13 00 01 00 09 FF FF FF FF 41' + numberHex + '41')
            console.log("============crc码==>：" + crcHex + "=================")
            var hex = '6813 00 01 00 09 FF FF FF FF 41' + numberHex + '41' + crcHex + '16';
            console.log("============向设备发起修改编号经过crc校验后的hex==>：" + hex + "=================")
            this.writeBLECharacteristicValue(hex)
            // this.writeBLECharacteristicValue(this.resetDeviceConfigHexStr)
            // setTimeout(() => {
            //     this.writeBLECharacteristicValue(this.networkHexStr)
            //     setTimeout(() => {
            //         this.writeBLECharacteristicValue(this.sysStatusHexStr)
            //         this.editDeviceNumberSubmitLoading = false
            //         this.showDeviceNumberEditPopup = false
            //     }, 1000);
            // }, 1000);
        },
        //设备编号
        numberBlur(e) {
            console.log(e)
            //长度限制为8位
            if (e.detail.value.length > 8 || e.detail.value.length < 8) {
                uni.showToast({
                    title: '设备编号长度必须为8位',
                    icon: 'none'
                })
                return
            }
            this.device.number = e.detail.value
            //将设备编号反转
            var len = 2;
            var numberHex = this.device.number.match(new RegExp('.{1,' + len + '}', 'g')).reverse().join('')
            //设备编号反转后
            console.log("============设备编号反转后==>：" + numberHex + "=================")
            var crcHex = hexStrToCRC16Modbus('13 00 01 00 09 FF FF FF FF 41' + numberHex + '41')
            console.log("============crc码==>：" + crcHex + "=================")
            var hex = '6813 00 01 00 09 FF FF FF FF 41' + numberHex + '41' + crcHex + '16';
            console.log("============向设备发起修改编号经过crc校验后的hex==>：" + hex + "=================")
            this.writeBLECharacteristicValue(hex)
        },
        //远程主ip及端口
        remoteMainIpBlur(e) {
            if (e.detail.value == '') {
                this.device.remoteMainIpError = '远程主ip及端口不能为空'
                return
            }
            console.log(e)
            this.device.remoteMainIp = e.detail.value
        },
        remoteMainIpChange(e) {
            this.device.remoteMainIp = e.detail
            if (!this.checkIpAndPort(e.detail)) {
                this.device.remoteMainIpError = '远程主ip及端口格式不正确'
            } else {
                this.device.remoteMainIpError = ''
            }
        },
        //使用正则表达式判断ip:port格式是否正确,返回结果为true或false
        checkIpAndPort(ipAndPort) {
            var reg = /^(\d+)\.(\d+)\.(\d+)\.(\d+):(\d+)$/;
            var r = ipAndPort.match(reg);
            if (r == null) {
                return false;
            }
            return true;
        },

        //远程备ip及端口
        remoteBackupIpBlur(e) {
            if (e.detail.value == '') {
                this.device.remoteBackupIpError = '远程备ip及端口不能为空'
                return
            }
            console.log(e)
            this.device.remoteBackupIp = e.detail.value
        },
        remoteBackupIpChange(e) {
            this.device.remoteBackupIp = e.detail
            if (!this.checkIpAndPort(e.detail)) {
                this.device.remoteBackupIpError = '远程备ip及端口格式不正确'
            } else {
                this.device.remoteBackupIpError = ''
            }
        },
        //本地ip
        localIpBlur(e) {
            if (e.detail.value == '') {
                // uni.showToast({
                //     title: '本地ip不能为空',
                //     icon: 'none'
                // })
                return
            }
            console.log(e)
            this.device.localIp = e.detail.value
        },
        //子网掩码
        subnetMaskBlur(e) {
            if (e.detail.value == '') {
                // uni.showToast({
                //     title: '子网掩码不能为空',
                //     icon: 'none'
                // })
                return
            }
            console.log(e)
            this.device.subnetMask = e.detail.value
        },
        //网关
        gatewayBlur(e) {
            if (e.detail.value == '') {
                // uni.showToast({
                //     title: '网关不能为空',
                //     icon: 'none'
                // })
                return
            }
            console.log(e)
            this.device.gateway = e.detail.value
        },
        //设备APN
        apnBlur(e) {
            console.log(e)
            this.device.apn = e.detail.value
            //TODO转换成16进制
            // this.hexStr = '0106807FA5012B42'
            // this.writeBLECharacteristicValue(this.hexStr)
        },
        //表计地址
        meterAddressBlur(e) {
            console.log(e)
            this.device.meterAddress = e.detail.value
        },
        meterArchivesNumberBlur(e) {
            console.log(e)
            this.meterArchives.number = e.detail.value
        },
        //展开收缩参数配置
        expandConfig() {
            console.log('expandConfig')
            this.configShow = !this.configShow
        },
        //展开收缩系统状态
        expandSysStatus() {
            console.log('expandSysStatus')
            this.sysStatusShow = !this.sysStatusShow
        },
        //展开收缩抄表控制
        expandReadMeter() {
            console.log('expandReadMeter')
            this.readMeterShow = !this.readMeterShow
        },
        //展开收缩表计档案
        expandMeterArchives() {
            console.log('expandMeterArchives')
            this.meterArchivesShow = !this.meterArchivesShow
        },
        //刷新表计档案
        refreshMeterArchives() {
            console.log('refreshMeterArchives')
            var crc16Code = hexStrToCRC16Modbus(`11 00 04 00 ${this.meterArchives.number} FF FF FF FF 41 01 01 00`)
            console.log('crc16Code', crc16Code)
            var hex = `68 11 00 04 00 ${this.meterArchives.number} FF FF FF FF 41 01 01 00 ${crc16Code} 16`
            console.log('hex', hex)
            this.writeBLECharacteristicValue(hex)
        },
        //查询表计档案
        queryMeterArchives() {
            console.log('queryMeterArchives')
            if (this.meterArchives.number == '' || this.meterArchives.number == undefined || this.meterArchives.number == null) {
                uni.showToast({
                    title: '序号不能为空',
                    icon: 'none'
                })
                return
            }
            //最长2字节，bcd码，如果用户输入的是1那么就是0100，如果输入的是2那么就是0200
            var numberHex = this.meterArchives.number
            numberHex = numberHex.padStart(4, '0')
            numberHex = reverseString(numberHex)
            console.log('numberHex', numberHex)
            var crc16Code = hexStrToCRC16Modbus(`11 00 04 00 10 FF FF FF FF 41 01 ${numberHex}`)
            console.log('crc16Code', crc16Code)
            var hex = `68 11 00 04 00 10 FF FF FF FF 41 01 ${numberHex} ${crc16Code} 16`
            console.log('hex', hex)
            // 清空
            this.meterArchives.manufacturer = ''
            this.meterArchives.address = ''
            this.meterArchives.port = ''
            this.startLoading()
            this.writeBLECharacteristicValue(hex)
        },
        //展开收缩保护电流
        expandProtectiveCurrent() {
            console.log('expandProtectiveCurrent')
            this.protectiveCurrentShow = !this.protectiveCurrentShow
        },
        //刷新保护电流
        refreshProtectiveCurrent() {
            console.log('refreshProtectiveCurrent')
            this.protectiveCurrent = ''
            this.startLoading()
            this.writeBLECharacteristicValue(this.protectiveCurrentHexStr)
        },
        //protectiveCurrentChange
        protectiveCurrentChange(e) {
            console.log('protectiveCurrentChange', e)
            this.protectiveCurrent = e.detail
        },
        //展开收缩软件升级
        expandSoftwareUpgrading() {
            console.log('expandSoftwareUpgrading')
            this.softwareUpgradingShow = !this.softwareUpgradingShow
        },
        //保存保护电流
        saveProtectiveCurrent() {
            var protectiveCurrent = this.protectiveCurrent.replace('mA', '')
            //必须是100-320
            if (protectiveCurrent < 100 || protectiveCurrent > 320) {
                uni.showToast({
                    title: '保护电流必须在100-320mA之间',
                    icon: 'none'
                })
                return
            }
            //转换成16进制
            protectiveCurrent = reverseString(decToHexByLen(protectiveCurrent, 2))
            console.log('protectiveCurrent Hex', protectiveCurrent)
            var crc16Code = hexStrToCRC16Modbus(`10 00 00 00 72 FF FF FF FF 41 ${protectiveCurrent}`)
            console.log('crc16Code', crc16Code)
            var hex = `68 10 00 00 00 72 FF FF FF FF 41 ${protectiveCurrent} ${crc16Code} 16`
            console.log('hex', hex)
            this.startLoading()
            this.writeBLECharacteristicValue(hex)
        },
        //选择采集通道确定
        collectChannelPickerConfirm(e) {
            console.log('collectChannelPickerConfirm', e)
            console.log(collectChannelEnum[e.detail.index])
            this.collectChannelIndex = e.detail.index
            // this.device.meterPort = e.detail.value
            // var meterPort = String(e.detail.index + 1)
            // console.log(meterPortEnumValue(meterPort))
            this.showCollectChannelPicker = false
        },
        //选择水表厂商确定
        waterMeterManufacturerPickerConfirm(e) {
            console.log('waterMeterManufacturerPickerConfirm', e)
            console.log(waterMeterManufacturerEnum[e.detail.index])
            this.waterMeterManufacturerIndex = e.detail.index
            this.showWaterMeterManufacturerPicker = false
        },
        //关闭采集通道选择器
        closeCollectChannelPicker() {
            this.showCollectChannelPicker = false
        },
        //获取蓝牙设备所有服务
        getBLEDeviceServices() {
            var that = this;
            uni.getBLEDeviceServices({
                deviceId: that.device.id,
                success: (res) => {
                    console.log('getBLEDeviceServices success', res.services)
                    for (let i = 0; i < res.services.length; i++) {
                        if (res.services[i].isPrimary) {
                            that.getBLEDeviceCharacteristics(res.services[i].uuid)
                        }
                    }
                },
                fail: (res) => {
                    console.log('getBLEDeviceServices fail', res)
                    uni.showToast({
                        title: bluetoothEnumValue(res.errCode),
                        icon: 'none'
                    })
                }
            })
        },
        //获取蓝牙设备特征值
        getBLEDeviceCharacteristics(uuid) {
            console.log('getBLEDeviceCharacteristics')
            console.log("uuid", uuid)
            var that = this;
            uni.getBLEDeviceCharacteristics({
                deviceId: that.device.id,
                serviceId: uuid,
                success: (res) => {
                    for (let i = 0; i < res.characteristics.length; i++) {
                        let item = res.characteristics[i]
                        if (item.properties.notify && item.properties.write && item.properties.read) {
                            that.device.serviceId = uuid;
                            that.device.characteristicId = item.uuid
                            that.notifyBLECharacteristicValueChange()
                            break;
                        }
                    }
                },
                fail: (res) => {
                    console.log('getBLEDeviceCharacteristics fail', res)
                    uni.showToast({
                        title: bluetoothEnumValue(res.errCode),
                        icon: 'none'
                    })
                }
            })
        },
        //启用低功耗蓝牙设备特征值变化时的 notify 功能
        notifyBLECharacteristicValueChange() {
            var that = this;
            uni.notifyBLECharacteristicValueChange({
                deviceId: this.device.id,
                serviceId: this.device.serviceId,
                characteristicId: this.device.characteristicId,
                state: true,
                success: (res) => {
                    console.log('notifyBLECharacteristicValueChange success', res)
                    that.onBLECharacteristicValueChange()
                    setTimeout(() => {
                        that.isConnected = true
                    }, 1500);
                },
                fail: (res) => {
                    console.log('notifyBLECharacteristicValueChange fail', res)
                    uni.showToast({
                        title: bluetoothEnumValue(res.errCode),
                        icon: 'none'
                    })
                }
            })
        },
        //监听蓝牙设备的特征值变化
        onBLECharacteristicValueChange() {
            console.log('onBLECharacteristicValueChange')
            uni.onBLECharacteristicValueChange((res) => {
                //转换成16进制
                var hex = ab2hex(res.value)
                if (!hex) {
                    return
                }
                console.log("=================设备回复开始=================")
                console.log("=================原始报文数据==>：" + hex + "=================")
                console.log("=================原始报文数据长度==>：" + hex.length + "=================")
                //由于蓝牙设备每次发送的数据长度有限制，所以需要分段发送，这里将分段的报文存放到队列中
                this.hexStrQueue.push(hex)
                console.log("=================队列长度==>：" + this.hexStrQueue.length + "=================")
                //判断回复报文开始和结束的标志位是否与发送的一致
                if (hex.endsWith('16')) {
                    //将队列中的报文拼接成完整的报文
                    hex = this.hexStrQueue.join('')
                    //清空队列
                    this.hexStrQueue = []
                    console.log("=================完整报文数据==>：" + hex + "=================")
                    console.log("=================完整报文数据长度==>：" + hex.length + "=================")
                } else {
                    //不是最后一段报文，直接返回
                    return
                }
                //从报文中截取，68开头，16结尾的报文
                hex = hex.substring(hex.indexOf('68'), hex.lastIndexOf('16') + 2)
                console.log("=================截取后的报文==>：" + hex + "=================")

                switch (hex.length) {
                    // case 128:
                    case 156:
                        console.log("=================设备回复系统状态方法开始=================")
                        // 获取设备编号如原始报文：68 4A 00 04 00 B5 02 00 28 03 41 54 53 10 25 11 23 07 19 04 48 37 83 70 22 10 D6 04 86 89 01 01 10 53 52 66 20 45 64 08 00 00 05 13 05 00 80 00 80 00 80 00 80 00 00 00 02 00 00 80 00 00 00 00 00 00 00 00 00 A0 00 62 B6 16获取到的应是02 00 28 03
                        // //获取设备编号
                        // console.log("============设备编号原始报文==>：" + hex.substring(12, 20) + "=================")
                        // var deviceNumber = this.getDeviceNumber(hex.substring(12, 20))
                        // console.log("============设备编号==>：" + deviceNumber + "=================")
                        // this.device.number = deviceNumber
                        //时钟 54 53 10 25 11 23
                        var clock = this.getClock(hex.substring(22, 34))
                        console.log("============时钟==>：" + clock + "=================")
                        this.device.clock = clock
                        //远程登录状态
                        console.log("============远程登录状态原始报文==>：" + hex.substring(34, 36) + "=================")
                        var remoteLoginStatus = hexToDec(hex.substring(34, 36))
                        console.log("============远程登录状态==>：" + remoteLoginStatus + "=================")
                        this.device.remoteLoginStatus = remoteStatusEnum[remoteLoginStatus]
                        //远程信号
                        console.log("============远程信号原始报文==>：" + hex.substring(36, 38) + "=================")
                        var remoteSignal = hexToDec(hex.substring(36, 38))
                        console.log("============远程信号==>：" + remoteSignal + "=================")
                        this.device.remoteSignal = remoteSignal
                        //获取网络类型
                        console.log("============网络类型原始报文==>：" + hex.substring(38, 40) + "=================")
                        var networkType = hexToDec(hex.substring(38, 40))
                        console.log("============网络类型==>：" + networkEnum[networkType] + "=================")
                        this.device.networkType = networkEnum[networkType]
                        //获取iccid=>48 37 83 70 22 10 D6 04 86 89
                        var iccid = this.getIccid(hex.substring(40, 60))
                        console.log("============iccid==>：" + iccid + "=================")
                        this.device.iccid = iccid
                        //获取网络运营商
                        console.log("============网络运营商原始报文==>：" + hex.substring(60, 62) + "=================")
                        var networkOperator = hexToDec(hex.substring(60, 62))
                        console.log("============网络运营商==>：" + networkOperatorEnum[networkOperator] + "=================")
                        this.device.networkOperator = networkOperatorEnum[networkOperator]
                        //获取远程模组
                        console.log("============远程模组原始报文==>：" + hex.substring(62, 64) + "=================")
                        var remoteModule = hex.substring(62, 64)
                        console.log("============远程模组==>：" + remoteModuleEnum[remoteModule] + "=================")
                        this.device.remoteModule = remoteModuleEnum[remoteModule]
                        //获取IMEI
                        console.log("============IMEI原始报文==>：" + hex.substring(64, 84) + "=================")
                        var imei = this.getImei(hex.substring(64, 84))
                        console.log("============IMEI==>：" + imei + "=================")
                        this.device.imei = imei
                        //抄表端口
                        console.log("============抄表端口原始报文==>：" + hex.substring(84, 86) + "=================")
                        var meterPort = hexToDec(hex.substring(84, 86))
                        console.log("============抄表端口==>：" + meterPortEnumValue(meterPort) + "=================")
                        this.device.meterPort = meterPortEnumValue(meterPort)
                        //抄表序号
                        console.log("============抄表序号原始报文==>：" + hex.substring(86, 90) + "=================")
                        var meterNumber = hexToDec(hex.substring(86, 90))
                        console.log("============抄表序号==>：" + meterIndexEnumValue(meterNumber) + "=================")
                        this.device.meterNumber = meterIndexEnumValue(meterNumber)
                        //获取抄见率
                        //106
                        console.log("============抄见率原始报文==>：" + hex.substring(90, 106) + "=================")
                        var readMeterRate = this.getReadMeterRate(hex.substring(90, 106))
                        console.log("============抄见率==>：" + readMeterRate + "=================")
                        this.device.readMeterRate = readMeterRate
                        //上报率
                        console.log("============上报率原始报文==>：" + hex.substring(106, 112) + "=================")
                        var reportRate = this.getReportRate(hex.substring(106, 112))
                        console.log("============上报率==>：" + reportRate + "=================")
                        this.device.reportRate = reportRate
                        //Flash
                        console.log("============Flash原始报文==>：" + hex.substring(114, 122) + "=================")
                        var flash = this.getFlash(hex.substring(114, 122))
                        console.log("============Flash==>：" + flash + "=================")
                        this.device.flash = flash
                        //抄表电流 18字节
                        console.log("============抄表电流原始报文==>：" + hex.substring(122, 140) + "=================")
                        var readMeterCurrent = this.getReadMeterCurrent(hex.substring(122, 142))
                        console.log("============抄表电流==>：" + readMeterCurrent + "=================")
                        this.device.readMeterCurrent = readMeterCurrent
                        //系统运行时间4字节
                        console.log("============系统运行时长原始报文==>：" + hex.substring(142, 150) + "=================")
                        var systemRunDuration = this.getSystemRunDuration(hex.substring(142, 150))
                        console.log("============系统运行时长==>：" + systemRunDuration + "=================")
                        this.device.systemRunDuration = systemRunDuration
                        uni.hideLoading();
                        this.loading = false
                        console.log("=================设备回复系统状态方法结束=================")
                        break;
                    case 66:
                        console.log("=================啦啦啦=================")
                        console.log("=================报文数据==>：" + hex + "=================")
                        break;
                    case 28:
                        console.log("=================设备回复方法开始=================")
                        console.log("=================报文数据==>：" + hex + "=================")
                        //去掉前10位,后面的不需要去除
                        hex = hex.substring(10, hex.length)
                        console.log("去掉前10位后的hex", hex)
                        //校验功能码，前2位
                        console.log("校验功能码", hex.substring(0, 2))
                        switch (hex.substring(0, 2)) {
                            case '81':
                                //恢复出厂设置 
                                console.log("=================设备回复恢复出厂设置方法开始=================")
                                console.log("=================恢复出厂设置报文数据==>：" + hex + "=================")
                                console.log("============设备编号原始报文==>：" + hex.substring(2, 10) + "=================")
                                var deviceNumber = this.getDeviceNumber(hex.substring(2, 10))
                                console.log("============设备编号==>：" + deviceNumber + "=================")
                                uni.hideLoading();
                                this.loading = false
                                if (this.device.number == Number(deviceNumber)) {
                                    uni.showToast({
                                        title: '恢复出厂设置成功',
                                        icon: 'none'
                                    })
                                    // this.writeBLECharacteristicValue(this.networkHexStr)
                                } else {
                                    uni.showToast({
                                        title: '恢复出厂设置失败',
                                        icon: 'none'
                                    })
                                    // this.writeBLECharacteristicValue(this.networkHexStr)
                                }
                                break;
                            case '8a':
                                //保存设备参数配置
                                console.log("=================设备回复保存设备参数配置方法开始=================")
                                console.log("=================保存设备参数配置报文数据==>：" + hex + "=================")
                                console.log("============设备编号原始报文==>：" + hex.substring(2, 10) + "=================")
                                var deviceNumber = this.getDeviceNumber(hex.substring(2, 10))
                                console.log("============设备编号==>：" + deviceNumber + "=================")
                                uni.hideLoading();
                                this.loading = false
                                if (this.device.number == Number(deviceNumber)) {
                                    uni.showToast({
                                        title: '设备参数配置成功',
                                        icon: 'none'
                                    })
                                    this.writeBLECharacteristicValue(this.networkHexStr)
                                } else {
                                    uni.showToast({
                                        title: '设备参数配置失败',
                                        icon: 'none'
                                    })
                                    this.writeBLECharacteristicValue(this.networkHexStr)
                                }
                                break;
                            case '8f':
                                console.log("=================设备回复8f功能码==>启动补抄方法开始=================")
                                console.log("=================启动回复补抄报文数据==>：" + hex + "=================")
                                console.log("============设备编号原始报文==>：" + hex.substring(2, 10) + "=================")
                                var deviceNumber = this.getDeviceNumber(hex.substring(2, 10))
                                console.log("============设备编号==>：" + deviceNumber + "=================")
                                uni.hideLoading();
                                this.loading = false
                                if (this.device.number == Number(deviceNumber)) {
                                    uni.showToast({
                                        title: '启动补抄成功',
                                        icon: 'none'
                                    })
                                    // this.writeBLECharacteristicValue(this.networkHexStr)
                                } else {
                                    uni.showToast({
                                        title: '启动补抄失败',
                                        icon: 'none'
                                    })
                                    // this.writeBLECharacteristicValue(this.networkHexStr)
                                }
                                console.log("=================设备回复8f功能码==>启动补抄方法结束=================")
                                break;
                            case '8e':
                                console.log("=================设备回复8e功能码==>重启抄表方法开始=================")
                                console.log("=================重启抄表报文数据==>：" + hex + "=================")
                                console.log("============设备编号原始报文==>：" + hex.substring(2, 10) + "=================")
                                var deviceNumber = this.getDeviceNumber(hex.substring(2, 10))
                                console.log("============设备编号==>：" + deviceNumber + "=================")
                                uni.hideLoading();
                                this.loading = false
                                if (this.device.number == Number(deviceNumber)) {
                                    uni.showToast({
                                        title: '重启抄表成功',
                                        icon: 'none'
                                    })
                                    // this.writeBLECharacteristicValue(this.networkHexStr)
                                } else {
                                    uni.showToast({
                                        title: '重启抄表失败',
                                        icon: 'none'
                                    })
                                    // this.writeBLECharacteristicValue(this.networkHexStr)
                                }
                                console.log("=================设备回复8e功能码==>重启抄表方法结束=================")
                                break;
                            case '89':
                                console.log("=================设备回复89功能码==>修改编号回复报文方法开始=================")
                                console.log("=================修改编号回复报文数据==>：" + hex + "=================")
                                console.log("============设备编号原始报文==>：" + hex.substring(2, 10) + "=================")
                                var deviceNumber = this.getDeviceNumber(hex.substring(2, 10))
                                console.log("============设备编号==>：" + deviceNumber + "=================")
                                if (this.device.number == Number(deviceNumber)) {
                                    this.editDeviceNumberSubmitLoading = false
                                    this.showDeviceNumberEditPopup = false
                                    uni.showToast({
                                        title: '修改编号成功',
                                        icon: 'none'
                                    })
                                    // this.writeBLECharacteristicValue(this.networkHexStr)
                                } else {
                                    uni.showToast({
                                        title: '修改编号失败',
                                        icon: 'none'
                                    })
                                    // this.writeBLECharacteristicValue(this.networkHexStr)
                                }
                                console.log("=================设备回复89功能码==>修改编号回复报文方法结束=================")
                                break;
                            case 'f2':
                                //保护电流
                                console.log("=================设备回复设置保护电流方法开始=================")
                                console.log("=================设置保护电流报文数据==>：" + hex + "=================")
                                console.log("============设备编号原始报文==>：" + hex.substring(2, 10) + "=================")
                                var deviceNumber = this.getDeviceNumber(hex.substring(2, 10))
                                console.log("============设备编号==>：" + deviceNumber + "=================")
                                uni.hideLoading();
                                this.loading = false
                                if (this.device.number == Number(deviceNumber)) {
                                    uni.showToast({
                                        title: '设置保护电流成功',
                                        icon: 'none'
                                    })
                                    // this.writeBLECharacteristicValue(this.networkHexStr)
                                } else {
                                    uni.showToast({
                                        title: '设置保护电流失败',
                                        icon: 'none'
                                    })
                                    // this.writeBLECharacteristicValue(this.networkHexStr)
                                }
                                console.log("=================设备回复设置保护电流方法结束=================")
                                break;
                            case 'e0':
                                // 告知升级
                                console.log("=================设备回复告知升级方法开始=================")
                                console.log("=================告知升级报文数据==>：" + hex + "=================")
                                uni.hideLoading();
                                this.loading = false
                                uni.showToast({
                                    title: '告知成功',
                                    icon: 'none'
                                })
                                console.log("=================设备回复告知升级方法结束=================")
                            default:
                                break;
                        }
                        break;
                    case 142:
                        //去掉前10位,后面的不需要去除
                        hex = hex.substring(10, hex.length)
                        console.log("去掉前10位后的hex", hex)
                        //校验功能码，前2位
                        console.log("校验功能码", hex.substring(0, 2))
                        switch (hex.substring(0, 2)) {
                            case '91':
                                console.log("=================设备回复获取网络参数方法开始=================")
                                console.log("=================网络参数报文数据==>：" + hex + "=================")
                                //获取设备编号
                                console.log("============设备编号原始报文==>：" + hex.substring(2, 10) + "=================")
                                var deviceNumber = this.getDeviceNumber(hex.substring(2, 10))
                                console.log("============设备编号==>：" + deviceNumber + "=================")
                                this.device.number = deviceNumber
                                //获取远程主ip及端口
                                console.log("============远程主ip及端口原始报文==>：" + hex.substring(14, 26) + "=================")
                                var remoteMainIp = this.getIpAndPort(hex.substring(14, 26))
                                console.log("============远程主ip及端口==>：" + remoteMainIp + "=================")
                                this.device.remoteMainIp = remoteMainIp
                                //获取远程备ip及端口
                                console.log("============远程备ip及端口原始报文==>：" + hex.substring(26, 38) + "=================")
                                var remoteBackupIp = this.getIpAndPort(hex.substring(26, 38))
                                console.log("============远程备ip及端口==>：" + remoteBackupIp + "=================")
                                this.device.remoteBackupIp = remoteBackupIp
                                //获取网关
                                console.log("============网关原始报文==>：" + hex.substring(38, 46) + "=================")
                                var gateway = this.getGateway(hex.substring(38, 46))
                                console.log("============网关==>：" + gateway + "=================")
                                this.device.gateway = gateway
                                //获取本地ip
                                console.log("============本地ip原始报文==>：" + hex.substring(94, 102) + "=================")
                                var localIp = this.getLocalIp(hex.substring(94, 102))
                                console.log("============本地ip==>：" + localIp + "=================")
                                this.device.localIp = localIp
                                //获取子网掩码
                                console.log("============子网掩码原始报文==>：" + hex.substring(106, 114) + "=================")
                                var subnetMask = this.getSubnetMask(hex.substring(106, 114))
                                console.log("============子网掩码==>：" + subnetMask + "=================")
                                this.device.subnetMask = subnetMask
                                //结束
                                uni.hideLoading();
                                this.loading = false
                                console.log("=================设备回复获取网络参数方法结束=================")
                                break;

                            default:
                                break;
                        }
                        break;
                    case 110:
                        //去掉前10位,后面的不需要去除
                        hex = hex.substring(10, hex.length)
                        console.log("去掉前10位后的hex", hex)
                        //校验功能码，前2位
                        console.log("校验功能码", hex.substring(0, 2))
                        switch (hex.substring(0, 2)) {
                            case 'f8':
                                console.log("=================设备发送透明转发回复方法开始=================")
                                console.log("=================透明转发回复报文数据==>：" + hex + "=================")
                                //数据校验码0-16
                                var dataCheckCode = hex.substring(16, 18)
                                console.log('dataCheckCode', dataCheckCode)
                                uni.hideLoading();
                                this.loading = false
                                if (dataCheckCode == '26') {
                                    var data = hex.substring(50, 58);
                                    console.log('data', data)
                                    //需要是两位小数，如00003900==>000039.00
                                    data = data.substring(0, data.length - 2) + '.' + data.substring(data.length - 2, data.length)
                                    uni.showModal({
                                        title: '透转成功',
                                        content: '响应数据：' + data,
                                        success: function (res) {
                                            if (res.confirm) {
                                                console.log('用户点击确定');
                                            } else if (res.cancel) {
                                                console.log('用户点击取消');
                                            }
                                        }
                                    });
                                } else {
                                    uni.showToast({
                                        title: '透转失败',
                                        icon: 'none',
                                        mask: true,
                                        duration: 2000
                                    });
                                }
                                console.log("=================设备发送透明转发回复方法结束=================")
                                break;
                        }
                        break;
                    case 32:
                        //去掉前10位,后面的不需要去除
                        hex = hex.substring(10, hex.length)
                        console.log("去掉前10位后的hex", hex)
                        //校验功能码，前2位
                        console.log("校验功能码", hex.substring(0, 2))
                        switch (hex.substring(0, 2)) {
                            case 'f3':
                                console.log("=================设备发送保存保护电流回复方法开始=================")
                                console.log("=================保存保护电流回复报文数据==>：" + hex + "=================")
                                //10-14
                                console.log("============保护电流原始报文==>：" + hex.substring(12, 16) + "=================")
                                //BCD格式，需要先反转再进行转换
                                var protectiveCurrent = hexToDec(reverseString(hex.substring(12, 16)))
                                console.log("============保护电流==>：" + protectiveCurrent + "=================")
                                this.protectiveCurrent = protectiveCurrent
                                uni.hideLoading();
                                this.loading = false
                                console.log("=================设备发送保存保护电流回复方法结束=================")
                                break;
                        }
                        break;
                    case 30:
                        //去掉前10位,后面的不需要去除
                        hex = hex.substring(10, hex.length)
                        console.log("去掉前10位后的hex", hex)
                        //校验功能码，前2位
                        console.log("校验功能码", hex.substring(0, 2))
                        switch (hex.substring(0, 2)) {
                            case '90':
                                console.log("=================设备发送表计档案查询回复方法开始=================")
                                console.log("=================表计档案查询回复报文数据==>：" + hex + "=================")
                                //档案数量
                                console.log("============档案数量原始报文==>：" + hex.substring(12, 14) + "=================")
                                var archivesNumber = hex.substring(12, 14)
                                console.log("============档案数量==>：" + archivesNumber + "=================")
                                uni.hideLoading();
                                this.loading = false
                                // uni.showModal({
                                //     title: '请求水表档案失败！',
                                //     content: '档案数量：' + Number(archivesNumber),
                                //     success: function (res) {
                                //         if (res.confirm) {
                                //             console.log('用户点击确定');
                                //         } else if (res.cancel) {
                                //             console.log('用户点击取消');
                                //         }
                                //     }
                                // });
                                break;
                        }
                        break;
                    case 34:
                        //去掉前10位,后面的不需要去除
                        hex = hex.substring(10, hex.length)
                        console.log("去掉前10位后的hex", hex)
                        //校验功能码，前2位
                        console.log("校验功能码", hex.substring(0, 2))
                        switch (hex.substring(0, 2)) {
                            case 'f8':
                                console.log("=================设备发送透明转发回复方法开始=================")
                                console.log("=================透明转发回复报文数据==>：" + hex + "=================")
                                //数据校验码0-16
                                var dataCheckCode = hex.substring(16, 18)
                                console.log('dataCheckCode', dataCheckCode)
                                uni.hideLoading();
                                this.loading = false
                                uni.showToast({
                                    title: '透转失败',
                                    icon: 'none',
                                    mask: true,
                                    duration: 2000
                                });
                                console.log("=================设备发送透明转发回复方法结束=================")
                                break;
                        }
                        break;
                    case 76:
                        //去掉前10位,后面的不需要去除
                        hex = hex.substring(10, hex.length)
                        console.log("去掉前10位后的hex", hex)
                        //校验功能码，前2位
                        console.log("校验功能码", hex.substring(0, 2))
                        switch (hex.substring(0, 2)) {
                            case '90':
                                console.log("=================设备发送表计档案查询回复方法开始=================")
                                console.log("=================表计档案查询回复报文数据==>：" + hex + "=================")
                                //01 00 27 03 41 01 01 00 60 57 10 00 00 42 01 01 02 02 02 00 00 00 00 00 00 00 00 00 11 3A 59 16
                                //表序号 01 00
                                console.log("============表序号原始报文==>：" + hex.substring(14, 18) + "=================")
                                var meterNumber = reverseString(hex.substring(14, 18))
                                console.log("============表序号==>：" + meterNumber + "=================")
                                //表地址 60 57 10 00 00
                                console.log("============表地址原始报文==>：" + hex.substring(18, 28) + "=================")
                                var meterAddress = reverseString(hex.substring(18, 28))
                                console.log("============表地址==>：" + meterAddress + "=================")
                                this.meterArchives.address = meterAddress
                                //厂商 42 01
                                console.log("============厂商原始报文==>：" + hex.substring(28, 32) + "=================")
                                //获取厂商
                                var manufacturer = waterMeterManufacturerEnum.find(item => item.value === reverseString(hex.substring(28, 32))).label
                                console.log("============厂商==>：" + manufacturer + "=================")
                                this.meterArchives.manufacturer = manufacturer
                                // //bps 02
                                console.log("============bps原始报文==>：" + hex.substring(34, 36) + "=================")
                                var bps = hex.substring(34, 36)
                                console.log("============bps==>：" + bps + "=================")
                                // //Even 02
                                console.log("============Even原始报文==>：" + hex.substring(38, 40) + "=================")
                                var even = hex.substring(38, 40)
                                console.log("============Even==>：" + even + "=================")
                                // 端口 11
                                console.log("============端口原始报文==>：" + hex.substring(58, 60) + "=================")
                                // //获取端口
                                var port = collectChannelEnum.find(item => item.value === reverseString(hex.substring(58, 60))).label
                                console.log("============端口==>：" + port + "=================")
                                this.meterArchives.port = port
                                uni.hideLoading();
                                this.loading = false
                                console.log("=================设备发送表计档案查询回复方法结束=================")
                                break;
                        }
                        break;
                    case 44:
                        //去掉前10位,后面的不需要去除
                        hex = hex.substring(10, hex.length)
                        console.log("去掉前10位后的hex", hex)
                        //校验功能码，前2位
                        console.log("校验功能码", hex.substring(0, 2))
                        switch (hex.substring(0, 2)) {
                            case '98':
                                console.log("=================设备发送软件版本回复方法开始=================")
                                console.log("=================软件版本回复报文数据==>：" + hex + "=================")
                                //98 38 00 27 03 41 01 01 02 01 11 30 01 24 07 A6 16
                                //硬件版本01 01 02 01
                                console.log("============硬件版本原始报文==>：" + hex.substring(12, 20) + "=================")
                                var hardwareVersion = reverseString(hex.substring(12, 20))
                                console.log("============硬件版本==>：" + hardwareVersion + "=================")
                                this.hardwareVersion = hardwareVersion
                                //软件版本11 30 01 24
                                console.log("============软件版本原始报文==>：" + hex.substring(20, 28) + "=================")
                                var softwareVersion = reverseString(hex.substring(20, 28))
                                console.log("============软件版本==>：" + softwareVersion + "=================")
                                this.softwareVersion = softwareVersion
                                uni.hideLoading();
                                this.loading = false
                                console.log("=================设备发送软件版本回复方法结束=================")
                                break;
                        }
                        break;
                    default:
                        // this.writeBLECharacteristicValue('68 0E 00 04 00 35 FF FF FF FF 41 80 54 16')
                        break;
                }

                console.log("=================设备回复结束=================")
            })
        },
        //断开连接
        close() {
            uni.closeBLEConnection({
                deviceId: this.device.id,
                success: (res) => {
                    console.log('closeBLEConnection success', res)
                    uni.navigateBack({
                        delta: 1
                    })
                },
                fail: (res) => {
                    console.log('closeBLEConnection fail', res)
                    uni.showToast({
                        title: bluetoothEnumValue(res.errCode),
                        icon: 'none'
                    })
                }
            })
        },
        //写入数据
        writeBLECharacteristicValue(hexStr) {
            var that = this;
            var buffer = hexStringToArrayBuffer(hexStr)
            console.log(buffer)
            uni.writeBLECharacteristicValue({
                // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
                deviceId: this.device.id,
                // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
                serviceId: this.device.serviceId,
                // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
                characteristicId: this.device.characteristicId,
                // 这里的value是ArrayBuffer类型
                value: buffer,
                success(res) {
                    console.log('writeBLECharacteristicValue success', res.errMsg)
                    // that.hexStr = ''
                    wx.vibrateShort({
                        type: 'medium',
                        success: (res) => {
                            console.log('vibrateShort success', res)
                        },
                    })
                },
                fail(res) {
                    console.log('writeBLECharacteristicValue fail', res.errMsg)
                    uni.showToast({
                        title: bluetoothEnumValue(res.errCode),
                        icon: 'none'
                    })
                    that.hexStr = ''
                }
            })
        },
        //保存指令
        save() {
            console.log('save')
            this.writeBLECharacteristicValue(this.saveHexStr)
        },
        //恢复出厂设置
        resetDeviceConfig() {
            console.log('resetDeviceConfig')
            this.startLoading()
            this.writeBLECharacteristicValue(this.resetDeviceConfigHexStr)
        },
        //保存设备参数配置
        saveDeviceConfig() {
            console.log('saveDeviceConfig')
            //校验远程ip及端口
            if (this.device.remoteMainIp == '') {
                this.device.remoteMainIpError = '远程主ip及端口不能为空'
                return
            }
            if (this.device.remoteBackupIp == '') {
                this.device.remoteBackupIpError = '远程备ip及端口不能为空'
                return
            }
            // if (this.device.localIp == '') {
            //     uni.showToast({
            //         title: '本地ip不能为空',
            //         icon: 'none'
            //     })
            //     return
            // }
            // if (this.device.subnetMask == '') {
            //     uni.showToast({
            //         title: '子网掩码不能为空',
            //         icon: 'none'
            //     })
            //     return
            // }
            // if (this.device.gateway == '') {
            //     uni.showToast({
            //         title: '网关不能为空',
            //         icon: 'none'
            //     })
            //     return
            // }
            //获取远程主ip及端口
            var remoteMainIpHex = this.ipAndPortToHex(this.device.remoteMainIp.split(':')[0], this.device.remoteMainIp.split(':')[1])
            console.log("============远程主ip及端口==>：" + remoteMainIpHex + "=================")

            //获取远程备ip及端口
            var remoteBackupIpHex = this.ipAndPortToHex(this.device.remoteBackupIp.split(':')[0], this.device.remoteBackupIp.split(':')[1])
            console.log("============远程备ip及端口==>：" + remoteBackupIpHex + "=================")
            //获取子网掩码
            var subnetMaskHex = this.getLocalIpAndGatewayAndSubnetMask(this.device.subnetMask)
            console.log("============子网掩码==>：" + subnetMaskHex + "=================")
            //获取网关
            var gatewayHex = this.getLocalIpAndGatewayAndSubnetMask(this.device.gateway)
            console.log("============网关==>：" + gatewayHex + "=================")
            //获取本地ip
            var localIpHex = this.getLocalIpAndGatewayAndSubnetMask(this.device.localIp)
            console.log("============本地ip==>：" + localIpHex + "=================")

            var crcHex = hexStrToCRC16Modbus('47 00 03 00 0A FF FF FF FF 41 02' + remoteMainIpHex + remoteBackupIpHex + gatewayHex + '00 00 00 00 00 00 00 00 53 57 43 42 2E 48 41 00 00 00 00 00 00 00 00 00' + localIpHex + '00 00' + subnetMaskHex + '00 00 00 00 00 00')
            console.log("============crc码==>：" + crcHex + "=================")
            this.startLoading()
            this.writeBLECharacteristicValue('68 47 00 03 00 0A FF FF FF FF 41 02' + remoteMainIpHex + remoteBackupIpHex + gatewayHex + '00 00 00 00 00 00 00 00 53 57 43 42 2E 48 41 00 00 00 00 00 00 00 00 00' + localIpHex + '00 00' + subnetMaskHex + '00 00 00 00 00 00' + crcHex + '16')
        },
        //参数配置
        refreshDeviceConfig() {
            this.emptyDeviceConfig()
            this.startLoading()
            this.writeBLECharacteristicValue(this.networkHexStr)
        },
        //置空设备参数配置
        emptyDeviceConfig() {
            this.device.remoteMainIp = ''
            this.device.remoteBackupIp = ''
            this.device.localIp = ''
            this.device.subnetMask = ''
            this.device.gateway = ''
        },
        //刷新系统状态
        refreshSysStatus() {
            this.emptySysStatus()
            this.startLoading()
            this.writeBLECharacteristicValue(this.sysStatusHexStr)
        },
        //置空系统状态
        emptySysStatus() {
            this.device.clock = ''
            this.device.remoteLoginStatus = ''
            this.device.remoteSignal = ''
            this.device.networkType = ''
            this.device.iccid = ''
            this.device.networkOperator = ''
            this.device.remoteModule = ''
            this.device.imei = ''
            this.device.meterPort = ''
            this.device.meterNumber = ''
            this.device.readMeterRate = ''
            this.device.reportRate = ''
            this.device.flash = ''
            this.device.readMeterCurrent = ''
            this.device.systemRunDuration = ''
        },
        // 透明转发
        transparentTransmission() {
            console.log('transparentTransmission')
            if (this.device.meterAddress == '') {
                uni.showToast({
                    title: '表计地址不能为空',
                    icon: 'none'
                })
                return
            }
            //表计地址
            var meterAddress = this.device.meterAddress
            meterAddress = meterAddress.padStart(10, '0')
            meterAddress = reverseString(meterAddress)
            console.log("meterAddressBlur reverseString", meterAddress)
            //水表厂商
            var waterMeterManufacturer = waterMeterManufacturerEnum[this.waterMeterManufacturerIndex].value
            //反转
            waterMeterManufacturer = reverseString(waterMeterManufacturer)
            console.log("waterMeterManufacturer", waterMeterManufacturer)
            //采集通道
            var collectChannel = collectChannelEnum[this.collectChannelIndex].value
            console.log("collectChannel", collectChannel)
            //cs8累加和功能码
            var cs8Code = getCs8(`68 10 ${meterAddress}${waterMeterManufacturer} 01 03 1F 90 00`)
            console.log("cs8Code", cs8Code)
            var crc16Code = hexStrToCRC16Modbus(`28 00 05 00 78 FF FF FF FF 41${collectChannel}00 00 88 01 14 FE FE FE FE68 10${meterAddress}${waterMeterManufacturer} 01 03 1F 90 00 ${getCs8(`68 10 ${meterAddress}${waterMeterManufacturer} 01 03 1F 90 00`)}16`)
            console.log("crc16Code", crc16Code)
            var hex = `68 28 00 05 00 78 FF FF FF FF 41${collectChannel}00 00 88 01 14 FE FE FE FE68 10${meterAddress}${waterMeterManufacturer} 01 03 1F 90 00 ${getCs8(`68 10 ${meterAddress}${waterMeterManufacturer} 01 03 1F 90 00`)}16 ${crc16Code} 16`
            console.log('transparentTransmission hex', hex)
            this.startLoading()
            this.writeBLECharacteristicValue(hex)
        },
        // 启动补抄
        startReadMeter() {
            console.log('startReadMeter')
            this.startLoading()
            this.writeBLECharacteristicValue('68 0E 00 02 00 0F FF FF FF FF 41 05 24 16')
        },
        // 重启补抄
        restartReadMeter() {
            console.log('restartReadMeter')
            this.startLoading()
            this.writeBLECharacteristicValue('68 0E 00 02 00 0E FF FF FF FF 41 04 F5 16')
        },
        //获取设备编号
        getDeviceNumber(number) {
            number = number.replace(/\s+/g, "");
            var len = 2;
            number = number.match(new RegExp('.{1,' + len + '}', 'g')).reverse().join('')
            return number;
        },
        getClock(hex) {
            hex = hex.replace(/\s+/g, "");
            var len = 2;
            hex = hex.match(new RegExp('.{1,' + len + '}', 'g')).reverse().join('')
            var year = hex.substr(0, 2);
            var month = hex.substr(2, 2);
            var day = hex.substr(4, 2);
            var hour = hex.substr(6, 2);
            var minute = hex.substr(8, 2);
            var second = hex.substr(10, 2);
            var clock = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
            return clock;
        },
        getIccid(hex) {
            console.log("iccid", hex)
            hex = hex.replace(/\s+/g, "");
            var len = 2;
            hex = hex.match(new RegExp('.{1,' + len + '}', 'g')).reverse().join('')
            // 英文需要转大写
            hex = hex.toUpperCase();
            return hex;
        },
        getImei(hex) {
            hex = hex.replace(/\s+/g, "");
            var len = 2;
            hex = hex.match(new RegExp('.{1,' + len + '}', 'g')).reverse().join('')
            return hex;
        },
        //获取MBUS保护电流
        getMbusCurrent(hex) {
            hex = hex.replace(/\s+/g, "");
            var len = 2;
            hex = hex.match(new RegExp('.{1,' + len + '}', 'g'))
            return hexToDec(hex);
        },
        //获取抄见率
        getReadMeterRate(hex) {
            // 去除字符串中的空格
            hex = hex.replace(/\s+/g, '');
            //规则，如原始报文008000800080008000000002需要将解析为10进制，如：00为0，80为128
            //需要按照每两位截取，然后转换为10进制
            var len = 2
            var decArr = hex.match(new RegExp('.{1,' + len + '}', 'g'));
            var decStr = decArr.map((item, index) => {
                //将16进制字符串转成10进制字符串，然后将数组中每两位拼接到一起
                if (index % 2 === 0) {
                    return hexToDec(item) + "/"
                }
                return hexToDec(item) + "  "
            })
            return decStr.join('');
        },
        //获取上报率
        getReportRate(hex) {
            hex = hex.substring(2, 6)
            // 去除字符串中的空格
            hex = hex.replace(/\s+/g, '');
            //规则，如原始报文008000800080008000000002需要将解析为10进制，如：00为0，80为128
            //需要按照每两位截取，然后转换为10进制
            var len = 2
            var decArr = hex.match(new RegExp('.{1,' + len + '}', 'g'));
            var decStr = decArr.map((item, index) => {
                //将16进制字符串转成10进制字符串，然后将数组中每两位拼接到一起
                if (index % 2 === 0) {
                    return hexToDec(item) + "/"
                }
                return hexToDec(item) + "  "
            })
            return decStr.join('');
        },
        //获取Flash,低字节在前,8字节
        getFlash(hex) {
            hex = hex.replace(/\s+/g, "");
            var len = 2;
            hex = hex.match(new RegExp('.{1,' + len + '}', 'g')).reverse().join('')
            //转成M单位
            var flash = hexToDec(hex) / 1024 / 1024;
            return flash + 'M';
            // return hex;
        },
        //获取仪表电流，00 00 00 00 00 00 00 00 A0 00====>0mA  0mA  0mA  0mA  [160mA]
        getReadMeterCurrent(hex) {
            hex = hex.replace(/\s+/g, "");
            var len = 4;
            hex = hex.match(new RegExp('.{1,' + len + '}', 'g'))
            var decArr = []
            hex.map(item => {
                decArr.push(item.match(new RegExp('.{1,' + 2 + '}', 'g')).reverse().join(''))
            })
            //按照每两位截取，然后转换为10进制
            decArr = decArr.map(item => {
                return parseInt(item, 16).toString(10) + 'mA'
            })
            decArr[decArr.length - 1] = '[' + decArr[decArr.length - 1] + ']'
            return decArr.join('  ');
        },
        getSystemRunDuration(hex) {
            hex = hex.replace(/\s+/g, "");
            var len = 2;
            hex = hex.match(new RegExp('.{1,' + len + '}', 'g')).reverse().join('')
            //转天、时、分、秒
            var time = hexToDec(hex);
            var day = parseInt(time / 86400);
            var hour = parseInt(time % 86400 / 3600);
            var minute = parseInt(time % 86400 % 3600 / 60);
            var second = parseInt(time % 86400 % 3600 % 60);
            var duration = '';
            if (day > 0) {
                duration += day + '天';
            }
            if (hour > 0) {
                duration += hour + '小时';
            }
            if (minute > 0) {
                duration += minute + '分钟';
            }
            if (second > 0) {
                duration += second + '秒';
            }
            return duration;
        },
        //获取主ip及端口
        getIpAndPort(hex) {
            hex = hex.replace(/\s+/g, "");
            var len = 2;
            hex = hex.match(new RegExp('.{1,' + len + '}', 'g'))
            var port = hex.splice(hex.length - 2, 2).reverse().join('');
            port = parseInt(port, 16).toString(10);
            //按照每两位截取，然后转换为10进制
            var decArr = hex.map(item => {
                return parseInt(item, 16).toString(10)
            })
            var ip = decArr.splice(0, 4).join('.');
            return ip + ':' + port;
        },
        //将主ip及端口转换成16进制
        ipAndPortToHex(ip, port) {
            function getPort(hex) {
                hex = hex.replace(/\s+/g, "");
                var len = 2;
                var port = (Number(hex)).toString(16);
                //如果端口号不够4位，需要补0
                if (port.length < 4) {
                    port = '0'.repeat(4 - port.length) + port;
                }
                port = port.match(new RegExp('.{1,' + len + '}', 'g')).reverse().join('');
                return port;
            }
            //将ip地址转换为16进制字符串
            var hexIp = ip.split('.').map(item => {
                console.log(item);
                var numberHex = (Number(item)).toString(16);
                //如果ip不够2位，需要补0
                if (numberHex.length < 2) {
                    numberHex = '0'.repeat(2 - numberHex.length) + numberHex;
                }
                return numberHex;
            }).join('');
            //将端口号转换为16进制字符串
            var hexPort = getPort(port);
            //将ip和端口号拼接到一起
            var hex = hexIp + hexPort;
            return hex;
        },
        //将子网掩码转换成16进制
        subnetMaskToHex(subnetMask) {
            subnetMask = subnetMask.replace(/\s+/g, "");
            var hex = subnetMask.split('.').map(item => {
                var subnetMaskHex = (Number(item)).toString(16);
                //如果ip不够2位，需要补0
                if (subnetMaskHex.length < 2) {
                    subnetMaskHex = '0'.repeat(2 - subnetMaskHex.length) + subnetMaskHex;
                }
                return subnetMaskHex;
            }).join('');
            return hex;
        },
        //获取子网掩码,本地ip,网关
        getLocalIpAndGatewayAndSubnetMask(dec) {
            dec = dec.replace(/\s+/g, "");
            var hex = dec.split('.').map(item => {
                var hex1 = (Number(item)).toString(16);
                //如果ip不够2位，需要补0
                if (hex1.length < 2) {
                    hex1 = '0'.repeat(2 - hex1.length) + hex1;
                }
                return hex1;
            }).join('');
            return hex;
        },


        //获取子网掩码
        getSubnetMask(hex) {
            hex = hex.replace(/\s+/g, "");
            var len = 2;
            hex = hex.match(new RegExp('.{1,' + len + '}', 'g'))
            //按照每两位截取，然后转换为10进制
            var decArr = hex.map(item => {
                return parseInt(item, 16).toString(10)
            })
            var subnetMask = decArr.join('.');
            return subnetMask;
        },
        getGateway(hex) {
            hex = hex.replace(/\s+/g, "");
            var len = 2;
            hex = hex.match(new RegExp('.{1,' + len + '}', 'g'))
            //按照每两位截取，然后转换为10进制
            var decArr = hex.map(item => {
                return parseInt(item, 16).toString(10)
            })
            var gateway = decArr.join('.');
            return gateway;
        },
        //获取本地ip
        getLocalIp(hex) {
            hex = hex.replace(/\s+/g, "");
            var len = 2;
            hex = hex.match(new RegExp('.{1,' + len + '}', 'g'))
            //按照每两位截取，然后转换为10进制
            var decArr = hex.map(item => {
                return parseInt(item, 16).toString(10)
            })
            var localIp = decArr.join('.');
            return localIp;
        },
        getManufacturer(hex) {
            //从waterMeterManufacturerEnum列表中遍历
            var manufacturer = '';
            waterMeterManufacturerEnum.map(item => {
                if (item.value == hex) {
                    manufacturer = item.label;
                }
            })
            return manufacturer;
        },
    },
}
</script>
<style lang="scss">
.container {
    padding: 20rpx 20rpx 0 20rpx;

    .device-info {
        display: flex;
        border: 1rpx solid #eee;
        border-radius: 14rpx;
        padding: 20rpx;
        align-items: center;

        .icon {
            width: 120rpx;
            height: 120rpx;
            border-radius: 14rpx;
            background-color: var(--themeColor);
            display: flex;
            justify-content: center;
            align-items: center;
        }

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

            .name {
                font-size: 32rpx;
                font-weight: bold;
                display: flex;
                align-items: center;

                text {}
            }
        }
    }

    .config {
        margin-top: 20rpx;
        border: 1rpx solid #eee;
        border-radius: 14rpx;
        padding: 20rpx;

        .van-field__label--disabled {
            color: var(--field-label-color, #646566);
        }

        .van-field__control--disabled {
            color: var(--field-input-text-color, #323233);

        }

        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .title {
                font-size: 32rpx;
                font-weight: bold;
                color: var(--themeColor);
                display: flex;

            }

            .refresh {
                width: 120rpx;
            }
        }

        .form {
            margin-top: 20rpx;
            overflow: hidden;
        }
    }

    .bottom {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        // padding-bottom: 20rpx;
        background-color: #fff;
        box-shadow: 0 0 10rpx #eee;
        display: flex;

        .break {
            flex: 1;
        }

        .save {
            flex: 1.5;
        }

    }
}

.popup-content {
    width: 80%;
    padding: 50rpx 20rpx;

    .device-number-input {
        display: flex;
        align-items: center;

        text {
            margin-left: 35rpx;
            font-size: 35rpx;
            color: #323233;
        }
    }
}

.form-class {
    margin-left: -28rpx;
}
</style>
