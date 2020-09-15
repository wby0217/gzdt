cordova.define("cloudtplus-plugin-file-opener.FileOpener", function(require, exports, module) {
    module.exports = {
        open: function(url, opt_success, opt_failure, fileName) {
            if (typeof opt_success == 'undefined') {
                opt_success = function() {
                    console.log("success!");
                }
            }
            if (typeof opt_failure == 'undefined') {
                opt_failure = function(error) {
                    console.log(error);
                }
            }
            cordova.exec(opt_success, opt_failure, "FileOpener", "openFile", [url, fileName]);
        }
    }
});