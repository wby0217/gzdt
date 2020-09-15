cordova.define("cloudtplus-plugin-qrcode-scanner.QrCodeScanner",
function(require, exports, module) {
	var exec = require('cordova/exec');
	var qrCodeScannerExport = {};

	/**
	 *  二维码扫描
	 *
	 *  @param {Function} successCallBack 成功回调
	 *  @param {Function} errorCallBack 错误回调
	 */
	qrCodeScannerExport.scan = function(successCallBack, errorCallBack) {
		return exec(successCallBack, errorCallBack, "QrCodeScanner", "scan", []);
	};

	module.exports = qrCodeScannerExport;
});
