cordova.define("cloudtplus-plugin-image-browser.ImageBrowser", function(require, exports, module) {
    var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec');
    var imageBrowserExport = {};
    imageBrowserExport.browseImages = function(successCallback, errorCallback, options) {
               argscheck.checkArgs('fFO', 'ImageBrowser.browseImages', arguments);
               options = options || {};
               var getValue = argscheck.getValue;
               var urls = getValue(options.urls, []);
               var startIndex = getValue(options.startIndex, 0);
               var allowDelete = getValue(options.allowDelete, false);
               var description = getValue(options.description, []);
               var thumbImages = getValue(options.thumbImages,[]);
               var args = [urls, startIndex, allowDelete, description,thumbImages];
               exec(successCallback, errorCallback, "ImageBrowser", "browseImages", args);
    };
    module.exports = imageBrowserExport;
});
