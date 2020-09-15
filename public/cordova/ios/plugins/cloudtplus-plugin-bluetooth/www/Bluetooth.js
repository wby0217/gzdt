cordova.define("cloudtplus-plugin-bluetooth.Bluetooth", function(require, exports, module) {

    var argscheck = require('cordova/argscheck'),
        utils = require('cordova/utils'),
        exec = require('cordova/exec');
    var myExportFuns = {};

    var getType = function(v) {
        return Object.prototype.toString.call(v).replace("[object ", "").replace("]", "");
    };

    var base64ToUint8Array = function(base64String) {
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

        var rawData = window.atob(base64);
        var outputArray = new Uint8Array(rawData.length);

        for (var i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    myExportFuns.openBluetoothAdapter = function(args) {
        return exec(args.success, args.fail, "Bluetooth", "openBluetoothAdapter", null);
    };

    myExportFuns.closeBluetoothAdapter = function(args) {
        return exec(args.success, args.fail, "Bluetooth", "closeBluetoothAdapter", null);
    };

    myExportFuns.getBluetoothAdapterState = function(args) {
        return exec(args.success, args.fail, "Bluetooth", "getBluetoothAdapterState", null);
    };

    myExportFuns.onBluetoothAdapterStateChange = function(callback) {
        return exec(callback, null, "Bluetooth", "onBluetoothAdapterStateChange", null);
    };

    myExportFuns.offBluetoothAdapterStateChange = function() {
        return exec(null, null, "Bluetooth", "offBluetoothAdapterStateChange", null);
    };

    myExportFuns.startBluetoothDevicesDiscovery = function(args) {
        return exec(args.success, args.fail, "Bluetooth", "startBluetoothDevicesDiscovery", null);
    };

    myExportFuns.stopBluetoothDevicesDiscovery = function(args) {
        return exec(args.success, args.fail, "Bluetooth", "stopBluetoothDevicesDiscovery", null);
    };

    myExportFuns.onBluetoothDeviceFound = function(callback) {
        return exec(callback, null, "Bluetooth", "onBluetoothDeviceFound", null);
    };

    myExportFuns.offBluetoothDeviceFound = function() {
        return exec(null, null, "Bluetooth", "offBluetoothDeviceFound", null);
    };

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

    myExportFuns.notifyBLECharacteristicValueChange = function(args) {
        return exec(args.success, args.fail, "Bluetooth", "notifyBLECharacteristicValueChange", [args.deviceId, args.serviceId, args.characteristicId, args.state]);
    };

    myExportFuns.onBLECharacteristicValueChange = function(callback) {
        return exec(function (res) {
            if (getType(res.value) == "String") {
                if (res.value.length > 0) {
                    var buf = base64ToUint8Array(res.value)
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
