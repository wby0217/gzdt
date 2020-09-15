cordova.define("cloudtplus-plugin-bluetooth.Bluetooth", function(require, exports, module) {

    var argscheck = require('cordova/argscheck'),
            utils = require('cordova/utils'),
            exec = require('cordova/exec');
        var myExportFuns = {};

    // ASCII only
    function bytesToString(buffer) {
        return String.fromCharCode.apply(null, new Uint8Array(buffer));
    }

    //打开蓝牙
    myExportFuns.openBluetoothAdapter = function(args) {
        return exec(args.success, args.fail, "Bluetooth", "openBluetoothAdapter", null);
    };

    //关闭蓝牙
    myExportFuns.closeBluetoothAdapter = function(args) {
        return exec(args.success, args.fail, "Bluetooth", "closeBluetoothAdapter", null);
    };

    //查询蓝牙状态
    myExportFuns.getBluetoothAdapterState = function(args) {
        return exec(args.success, args.fail, "Bluetooth", "getBluetoothAdapterState", null);
    };

    //监听蓝牙状态
    myExportFuns.onBluetoothAdapterStateChange = function(callback) {
        return exec(callback, null, "Bluetooth", "onBluetoothAdapterStateChange", null);
    };

    //取消监听蓝牙状态
    myExportFuns.offBluetoothAdapterStateChange = function() {
        return exec(null, null, "Bluetooth", "offBluetoothAdapterStateChange", null);
    };

    // 开始搜索蓝牙设备
    myExportFuns.startBluetoothDevicesDiscovery = function(args) {
       return exec(args.success, args.fail, "Bluetooth", "startBluetoothDevicesDiscovery", null);
    };

    // 停止搜索蓝牙设备
    myExportFuns.stopBluetoothDevicesDiscovery = function(args) {
        return exec(args.success, args.fail, "Bluetooth", "stopBluetoothDevicesDiscovery", null);
    };

    // 监听搜索到的设备
    myExportFuns.onBluetoothDeviceFound = function(callback) {
        return exec(callback, null, "Bluetooth", "onBluetoothDeviceFound", null);
    };

    // 停止监听搜索到的设备
    myExportFuns.offBluetoothDeviceFound = function() {
        return exec(null, null, "Bluetooth", "offBluetoothDeviceFound", null);
    };

    // 获取所有搜索到的设备
    myExportFuns.getBluetoothDevices = function(args) {
        return exec(args.success, args.fail, "Bluetooth", "getBluetoothDevices", null);
    };


    myExportFuns.createBLEConnection = function(args) {
       return exec(args.success, args.fail, "Bluetooth", "createBLEConnection", [args.deviceId, args.timeout]);
    };


    myExportFuns.closeBLEConnection = function(args) {
        return exec(args.success, args.fail, "Bluetooth", "closeBLEConnection", [args.deviceId]);
    };

    myExportFuns.getConnectedBluetoothDevices = function(args) {
        return exec(args.success, args.fail, "Bluetooth", "getConnectedBluetoothDevices", null);
    };

    myExportFuns.onBLEConnectionStateChange = function(callback) {
        return exec(callback, null, "Bluetooth", "onBLEConnectionStateChange", null);
    };

    myExportFuns.offBLEConnectionStateChange = function() {
        return exec(null, null, "Bluetooth", "offBLEConnectionStateChange", null);
    };

    myExportFuns.getBLEDeviceServices = function(args) {
        return exec(args.success, args.fail, "Bluetooth", "getBLEDeviceServices", [args.deviceId]);
    };

    myExportFuns.getBLEDeviceCharacteristics = function(args) {
        return exec(args.success, args.fail, "Bluetooth", "getBLEDeviceCharacteristics", [args.deviceId, args.serviceId]);
    };

    // success callback is called on notification
    myExportFuns.startNotification =function (device_id, service_uuid, characteristic_uuid, success, failure) {
        cordova.exec(success, failure, 'Bluetooth', 'startNotification', [device_id, service_uuid, characteristic_uuid]);
    };

    myExportFuns.notifyBLECharacteristicValueChange = function(args) {
         return exec(args.success, args.fail, "Bluetooth", "notifyBLECharacteristicValueChange", [args.deviceId, args.serviceId, args.characteristicId, args.state]);
    };

    myExportFuns.onBLECharacteristicValueChange = function(callback) {
        return exec(function (res) {
            if (getType(res.value) == "String") {
                if (res.value.length > 0) {
                    var buf = bytesToString(res.value)
                    res.value = buf;
                }
                else {
                    res.value = null;
                }
            }
            if (callback) callback(res)
        }, null, "Bluetooth", "onBLECharacteristicValueChange", null);
    };

    myExportFuns.offBLECharacteristicValueChange = function() {
        return exec(null, null, "Bluetooth", "offBLECharacteristicValueChange", null);
    };

    myExportFuns.writeBLECharacteristicValue = function(args) {
        return exec(args.success, args.fail, "Bluetooth", "writeBLECharacteristicValue", [args.deviceId, args.serviceId, args.characteristicId, args.value]);
    };

    myExportFuns.readBLECharacteristicValue = function(args) {
        return exec(args.success, args.fail, "Bluetooth", "readBLECharacteristicValue", [args.deviceId, args.serviceId, args.characteristicId]);
    };

    module.exports = myExportFuns;

});
