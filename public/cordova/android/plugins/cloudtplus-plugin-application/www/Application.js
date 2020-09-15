cordova.define("cloudtplus-plugin-application.Application", function(require, exports, module) {
	var argscheck = require('cordova/argscheck'),
		exec = require('cordova/exec');
	var applicationExport = {};
	var emptyFn = function() {};

	var removeInvalidProperty = function(options) {
		var opts = options || {};
		for (var i in opts) {
			if (opts[i] === undefined || opts[i] === null || Object.prototype.toString.call(opts[i]) === "[object Function]") {
				delete opts[i];
			}
		}
		return opts;
	};

	var mergeProperty = function(options, defaultOptions) {
		for (var i in defaultOptions) {
			if (options[i] === undefined) {
				options[i] = defaultOptions[i];
			}
		}
		return removeInvalidProperty(options);
	};

	var getFilterProperty = function(prop) {
		var p = prop;
		if (p && Object.prototype.toString.call(p) === "[object String]") {
			p = [p];
		}
		return p;
	};

	var execItem = function(cmd, sCallback, eCallback, pCallback, opts) {
		return exec((function(me, success, progress) {
			return function(value) {
				if (Object.prototype.toString.call(value) === "[object Number]") {
					return progress.call(me, value);
				} else {
					return success.call(me, value);
				}
			}
		})(this, sCallback || emptyFn, pCallback || emptyFn), eCallback, "Application", cmd, [opts]);
	};

	var formatSuccessData = function(sData) {
		if (sData && sData.length > 0) {
			for (var i = 0; i < sData.length; i++) {
				if (sData[i] && sData[i].uploaded !== undefined) {
					sData[i].uploaded = !!(sData[i].uploaded);
				}
			}
		}
		return sData;
	};

	var execList = function(cmd, sCallback, eCallback, pCallback, items, index, sData, eData) {
		items = items || [];
		index = index || 0;
		sData = sData || [];
		eData = eData || [];
		sCallback = sCallback || emptyFn;
		eCallback = eCallback || emptyFn;
		pCallback = pCallback || emptyFn;
		var item = items[index];
		if (item) {
			execItem(cmd,
				(function(me, cmd, success, error, progress, items, index, sData, eData) {
					return function(value) {
						sData.push(value);
						progress.call(me, (index + 1) * (1 / items.length), {
							success: true,
							data: value
						});
						execList.call(me, cmd, success, error, progress, items, index + 1, sData, eData);
					}
				})(this, cmd, sCallback, eCallback, pCallback, items, index, sData, eData),
				(function(me, cmd, success, error, progress, items, index, sData, eData) {
					return function(errMsg) {
						var value = items[index];
						value.errorMsg = errMsg;
						eData.push(value);
						progress.call(me, (index + 1) * (1 / items.length), {
							success: false,
							data: value
						});
						execList.call(me, cmd, success, error, progress, items, index + 1, sData, eData);
					}
				})(this, cmd, sCallback, eCallback, pCallback, items, index, sData, eData),
				(function(me, progress, items, index) {
					return function(value) {
						progress.call(me, (index + value) * (1 / items.length), null);
					}
				})(this, pCallback, items, index), item);
		} else if (items.length == 0) {
			return eCallback.call(this, cmd + "参数错误");
		} else {
			sData = formatSuccessData(sData);
			return sCallback.call(this, sData, eData);
		}
	};

	var getExecItems = function(items, defaultOptions) {
		defaultOptions = removeInvalidProperty(defaultOptions);
		items = items || [];
		if (items.length == 0) {
			items.push(defaultOptions);
		} else {
			for (var i = 0; i < items.length; i++) {
				items[i] = removeInvalidProperty(mergeProperty(items[i], defaultOptions));
			}
		}
		return items;
	};

	function isEmptyObject(e) {
		for (var t in e) return !1;
		return !0
	}

	var getType = function(v) {
		return Object.prototype.toString.call(v).replace("[object ", "").replace("]", "");
	};

	var checkOptions = (function() {
		
		var doCheckString = function(value, check) {
			var r = "";
			if (getType(value) != "String") {
				r = "应为字符串类型";
			} else if (check.allowEmptyString !== true && value === "") {
				r = "不允许空字符串";
			}
			return r;
		};
		var doCheckStringArray = function(value, check) {
			var r = "";
			if (getType(value) != "Array") {
				r = "应为字符串数组类型";
			} else if (check.allowEmptyArray !== true && value.length == 0) {
				r = "不允许空数组";
			} else {
				for (var i = 0; i < value.length; i++) {
					r = doCheckString(value[i], check);
					if (r) {
						r = "数组中" + r;
						break;
					}
				}
			}
			return r;
		};
		var doCheckObjectArray = function(value, check) {
			var r = "";
			if (getType(value) != "Array") {
				r = "应为对象数组类型";
			} else if (check.allowEmptyArray !== true && value.length == 0) {
				r = "不允许空数组";
			} else {
				for (var i = 0; i < value.length; i++) {
					if (getType(value[i]) != "Object") {
						r = "数组中应为对象类型";
						break;
					}
				}
			}
			return r;
		};
		var doCheckOption = function(value, check) {
			var r = "";
			if (check) {
				switch (check.type) {
					case "Enum":
						if ((check.enum || []).indexOf(value) < 0) {
							r = "应为" + '"' + (check.enum || []).join('","') + '"之一';
						}
						break;
					case "String":
						r = doCheckString(value, check);
						break;
					case "Number":
						if (getType(value) != "Number") {
							r = "应为数字类型";
						} else if (getType(check.minValue) == "Number" && value < minValue) {
							r = "不能小于" + minValue;
						} else if (getType(check.maxValue) == "Number" && value > maxValue) {
							r = "不能大于" + maxValue;
						}
						break;
					case "Date":
						if (getType(value) != "Date") {
							r = "应为日期类型";
						}
						break;
					case "Boolean":
						if (getType(value) != "Boolean") {
							r = "应为布尔类型";
						}
						break;
					case "Object":
						if (getType(value) != "Object") {
							r = "应为对象类型";
						}
						break;
					case "ObjectArray":
						r = doCheckObjectArray(value, check);
						break;
					case "StringArray":
						r = doCheckStringArray(value, check);
						break;
					case "String|StringArray":
						if (getType(value) == "String") {
							r = doCheckString(value, check);
						} else if (getType(value) == "Array") {
							r = doCheckStringArray(value, check);
						} else {
							r = "应为字符串或字符串数组";
						}
						break;
					default:
						r = "内部类型错误";
				}
			}
			return r;
		};
		var doCheckOptions = function(opts, checkOpts) {
			var r = "";
			if (getType(opts) == "Object") {
				for (var i in checkOpts) {
					if (checkOpts[i].isRequired === true && opts[i] === undefined) {
						r = i + "为必填属性";
						break;
					}
				}
				if (!r) {
					for (var i in opts) {
						r = doCheckOption(opts[i], checkOpts[i]);
						if (r) {
							r = i + r;
							break;
						}
					}
				}
			} else {
				r = "内部参数错误";
			}
			return r;
		};	
		return function(name, opts, checkOpts) {
			var t = getType(opts);
			var optList = [], r = "";
			if (t == "Array") {
				optList = opts;
			} else if (t == "Object") {
				optList = [opts];
			} else {
				r = "内部错误"
			}
			if (!r) {
				for (var i = 0; i < optList.length; i++) {
					r = doCheckOptions(optList[i], checkOpts);
					if (r) {
						break;
					}
				}
			}
			if (r) {
				r = name + "方法参数错误，" + r;
			}
			return r;
		}
	})();

	var CHECK = {
		StringAllowEmpty: {type: "String", allowEmptyString: true},
		StringIsRequired: {type: "String", allowEmptyString: false, isRequired: true},
		EnumMediaType: {type: "Enum", enum: ["PICTURE", "VIDEO", "AUDIO", "UNKNOWN"]},
		EnumAjaxType: {type: "Enum", enum: ["GET", "POST", "PUT", "DELETE"]},
		EnumSourceType: {type: "Enum", enum: ["CAMERA", "PHOTOLIBRARY"]},
		EnumFileBrowserMode: {type: "Enum", enum: ["BROWSE", "BROWSE_DELETE", "SELECT"]},
		EnumShootMode: {type: "Enum", enum: ["TAP", "TAP_HOLD"]},
		EnumCountTemplate: {type: "Enum", enum: ["REBAR", "STEELTUBE"]},
		NumberCount: {type: "Number", minVlaue: 0},
		NumberDuration: {type: "Number", minVlaue: 0},
		NumberStartIndex: {type: "Number", minVlaue: 0},

		EnumPrintItemType: {type: "Enum", enum: ["TEXT", "TITLE_VALUE", "NEW_LINE",
		 "SEPERATOR_LINE", "BAR_CODE", "QR_CODE", "IMAGE", "PRINT_NO"]},
        EnumPrintItemAlignment: {type: "Enum", enum: ["CENTER", "LEFT", "RIGHT"]},
        EnumPrintItemFontSize: {type: "Enum", enum: ["SMALL", "MIDDLE", "BIG"]},

		StringArrayFilter: {type: "String|StringArray", allowEmptyArray: false, allowEmptyString: true},
		BooleanValue: {type: "Boolean"},
		DateValue: {type: "Date"},
		ObjectValue: {type: "Object"},
		ObjectArrayAllowEmpty: {type: "ObjectArray", allowEmptyArray: true},
		StringArrayAllowEmpty: {type: "StringArray", allowEmptyArray: true, allowEmptyString: false},
		StringArrayIsRequired: {type: "StringArray", allowEmptyArray: false, allowEmptyString: false},
		StringArrayKeys: {type: "String|StringArray", allowEmptyArray: false, allowEmptyString: false}

	};

	/**
	 *  接收壳上的消息
	 */
	applicationExport.onDeviceNotification = function(fn) {
		window.cordova_callback_notification = (function(callback) {
			return function(type, data) {
				return !!callback && (typeof callback == "function") && callback.call(window, type, data);
			}
		})(fn);
	};

	/**
	 *  显示标题栏
	 */
	applicationExport.showTitlebar = function(successCallback, errorCallback) {
		return exec(successCallback, errorCallback, "Application", "showTitlebar", []);
	};

	/**
	 *  隐藏标题栏
	 */
	applicationExport.hideTitlebar = function(successCallback, errorCallback) {
		return exec(successCallback, errorCallback, "Application", "hideTitlebar", []);
	};

	/**
	 *  更新标题栏
	 *
	 *  @param {String} text 标题文本
	 *  @param {String} textColor 标题颜色
	 *  @param {String} leftButtonColor 返回按钮颜色
	 *  @param {String} backgroundColor 背景颜色
	 */
	applicationExport.updateTitlebar = function(successCallback, errorCallback, options) {
		options = options || {};
		if (options.text !== undefined) {
			window.document.title = options.text;
		}
		var getValue = argscheck.getValue;
		var backgroundColor = getValue(options.backgroundColor, ""),
			textColor = getValue(options.textColor, ""),
			leftButtonColor = getValue(options.leftButtonColor, ""),
			text = getValue(options.text, "");
		var args = [backgroundColor, textColor, leftButtonColor, text];
		return exec(successCallback, errorCallback, "Application", "updateTitlebar", args);
	};

	/**
	 *  显示扫描按钮
	 *
	 *  @param {Function} successCallback 扫描成功回调
	 *  @param {Function} errorCallback 取消扫描回调
	 */
	applicationExport.showScanButton = function(successCallback, errorCallback) {
		window.cordova_callback_scanButton = (function(success, error) {
			return function() {
				if (window.QrCodeScanner && window.QrCodeScanner.scan) {
					window.QrCodeScanner.scan(success, error);
				} else if (window.cordova_exec) {
					window.cordova_exec("QrCodeScanner.scan", {
						success: success,
						error: error
					});
				}
			};
		})(successCallback, errorCallback);
		return exec(successCallback, errorCallback, "Application", "showScanButton", []);
	};

	/**
	 *  隐藏扫描按钮
	 */
	applicationExport.hideScanButton = function(successCallback, errorCallback) {
		return exec(successCallback, errorCallback, "Application", "hideScanButton", []);
	};

	/**
	 *  显示状态栏菊花 (仅支持iOS)
	 */
	applicationExport.showNetworkActivityIndicator = function(successCallback, errorCallback) {
		return !!window.cordova && window.cordova.platformId == "ios" &&
			exec(successCallback, errorCallback, "Application", "showNetworkActivityIndicator", []);
	};

	/**
	 *  隐藏状态栏菊花 (仅支持iOS)
	 */
	applicationExport.hideNetworkActivityIndicator = function(successCallback, errorCallback) {
		return !!window.cordova && window.cordova.platformId == "ios" &&
			exec(successCallback, errorCallback, "Application", "hideNetworkActivityIndicator", []);
	};


	/**
     *  显示左边栏菜单（等同于从壳的标题栏上点击【菜单】按钮）
     */
    applicationExport.showLeftSideMenu = function(successCallback, errorCallback) {
        return exec(successCallback, errorCallback, "Application", "showLeftSideMenu", []);
    };

    /**
     *  显示左边栏菜单（等同于从壳的标题栏上点击【菜单】按钮）
     */
    applicationExport.controlLeftSideMenu = function(successCallback, errorCallback,options) {
        return exec(successCallback, errorCallback, "Application", "controlLeftSideMenu", [options.touchMode]);
    };

    /**
     *  显示推送消息视图（等同于从壳的标题栏上点击【消息】按钮）
     */
    applicationExport.showNotifyView = function(successCallback, errorCallback) {
        return exec(successCallback, errorCallback, "Application", "showNotifyView", []);
    };

   /**
     * @method downloadFile
     * 下载文件
     * @param {Object} args 参数对象
     * @return {Object} 返回cloudtplus对象
     */
    applicationExport.downloadFile = function(successCallback, errorCallback, progressCallback, options) {
            options = options || {};
            var opts = {
                url: options.url || "",
                cacheKey: options.cacheKey || "",
                headers: options.headers || {}
            };
            opts = removeInvalidProperty(opts);
            var err = checkOptions("downloadFile", opts, {
    	                               url: CHECK.StringIsRequired,
                                       cacheKey: CHECK.StringAllowEmpty,
    	                               headers: CHECK.ObjectValue
                                   });
            if (err) {
                errorCallback && errorCallback.call(this, err);
            } else {
                return exec(function(data) {
                    if (Object.prototype.toString.call(data) === "[object Number]") {
                        if (progressCallback) progressCallback(data);
                    }
                    else {
                        if (successCallback) successCallback(data);
                    }
               }, errorCallback, "Application", "downloadFile", [opts.url, opts.headers, opts.cacheKey]);
            }
        };

    /**
     * @method removeDownloadedFiles
     * 批量删除已下载的文件
     * @param {Object} args 参数对象
     * @return {Object} 返回cloudtplus对象
     */
    applicationExport.removeDownloadedFiles = function(successCallback, errorCallback, options) {
        options = options || {};
        var opts = {
            urls: options.urls || []
        };
        opts = removeInvalidProperty(opts);
        var err = checkOptions("removeDownloadedFiles", opts, {
	                               urls: CHECK.StringArrayAllowEmpty
                               });
        if (err) {
           errorCallback && errorCallback.call(this, err);
        } else {
           return exec(successCallback, errorCallback, "Application", "removeDownloadedFiles", [opts.urls]);
        }
    };


    /**
     * @method isFilesDownloaded
     * 批量判断文件是否已经下载，返回其中已下载的文件的url列表
     * @param {Object} args 参数对象
     * @return {Object} 返回cloudtplus对象
     */
    applicationExport.isFilesDownloaded = function(successCallback, errorCallback, options) {
        options = options || {};
        var opts = {
            urls: options.urls || []
        };
        opts = removeInvalidProperty(opts);
        var err = checkOptions("isFilesDownloaded", opts, {
	                               urls: CHECK.StringArrayAllowEmpty
                               });
        if (err) {
           errorCallback && errorCallback.call(this, err);
        } else {
           return exec(successCallback, errorCallback, "Application", "isFilesDownloaded", [opts.urls]);
        }
    };

	/**
     * @method markOnBlueprint
     * 质量安全问题，在图纸中添加（或修改）质量安全标记
     * @param {Object} args 参数对象
     * @return {Object} 返回cloudtplus对象
     */
    applicationExport.markOnBlueprint = function(successCallback, errorCallback, options) {
        options = options || {};
        var opts = {
            category: options.category || "quality",
            mode: options.mode || "new",
            blueprint: options.blueprint,
            marker: options.marker
        };
        opts = removeInvalidProperty(opts);
        var err = checkOptions("markOnBlueprint", opts, {
                           category: CHECK.StringAllowEmpty,
                           mode: CHECK.StringAllowEmpty,
                           blueprint: CHECK.ObjectValue,
                           marker: CHECK.ObjectValue
                       });
        if (err) {
            errorCallback && errorCallback.call(this, err);
        } else {
            return exec(successCallback, errorCallback, "Application", "markOnBlueprint", [opts.category, opts.mode, opts.blueprint, opts.marker]);
        }
    };


    applicationExport.markOnBlueprint2 = function(successCallback, errorCallback, options) {
            options = options || {};
            var opts = {
                category: options.category || "quality",
                mode: options.mode || "new",
                blueprint: options.blueprint,
                markers: options.markers
            };
            opts = removeInvalidProperty(opts);
            var err = checkOptions("markOnBlueprint2", opts, {
                               category: CHECK.StringAllowEmpty,
                               mode: CHECK.StringAllowEmpty,
                               blueprint: CHECK.ObjectValue,
                               markers: CHECK.ObjectArrayAllowEmpty
                           });
            if (err) {
                errorCallback && errorCallback.call(this, err);
            } else {
                return exec(successCallback, errorCallback, "Application", "markOnBlueprint2", [opts.category, opts.mode, opts.blueprint, opts.markers]);
            }
        };

    /**
     * @method startMonitorBeacon
     * 开始蓝牙扫描
     * @param {Object} args 参数对象
     * @return {Object} 返回cloudtplus对象
     */
    applicationExport.startMonitorBeacon = function(successCallback, errorCallback, resultCallback, options) {
        options = options || {};
        var opts = {
            radius: options.radius || 1
        };
        opts = removeInvalidProperty(opts);
        var err = checkOptions("startMonitorBeacon", opts, {
	                               radius: CHECK.NumberDuration
                               });
        if (err) {
            errorCallback && errorCallback.call(this, err);
        } else {
            return exec(function(data) {
                if (Object.prototype.toString.call(data) === "[object String]") {
                    successCallback(data);
                }
                else {
                    resultCallback(data);
                }
           }, errorCallback, "Application", "startMonitorBeacon", [opts.radius]);
        }
    };

    /**
     * @method stopMonitorBeacon
     * 结束蓝牙扫描
     * @param {Object} args 参数对象
     * @return {Object} 返回cloudtplus对象
     */
    applicationExport.stopMonitorBeacon = function(successCallback, errorCallback) {
        return exec(successCallback, errorCallback, "Application", "stopMonitorBeacon", []);
    };

	/**
	 *  打开海康监控
	 *
	 *  @param {String} deviceName 设备名称
	 *  @param {String} deviceIP 设备地址
	 *  @param {String} devicePort 设备端口
	 *  @param {String} userName 帐号
	 *  @param {String} password 密码
	 */
	applicationExport.showHikvision = function(successCallback, errorCallback, options) {
		var getValue = argscheck.getValue;
		options = options || {};
		var deviceName = getValue(options.deviceName, ""),
			deviceIP =  getValue(options.deviceIP, ""),
			devicePort = getValue(options.devicePort, ""),
			userName = getValue(options.userName, ""),
			password = getValue(options.password, "");
		return exec(successCallback, errorCallback, "Application", "showHikvision", [deviceName, deviceIP, devicePort, userName, password]);
	};

	/**
	 *  打开海康监控8700
	 *
	 *  @param {String} deviceIP 设备地址
	 *  @param {String} devicePort 设备端口
	 *  @param {String} userName 帐号
	 *  @param {String} password 密码
	 */
	applicationExport.showHikvision8700 = function(successCallback, errorCallback, options) {
		var getValue = argscheck.getValue;
		options = options || {};
		var deviceIP =  getValue(options.deviceIP, ""),
			devicePort = getValue(options.devicePort, ""),
			userName = getValue(options.userName, ""),
			password = getValue(options.password, "");
		return exec(successCallback, errorCallback, "Application", "showHikvision8700", [deviceIP, devicePort, userName, password]);
	};


	/**
     *  打开大华监控
     *
     *  @param {String} deviceIP 设备地址
     *  @param {String} devicePort 设备端口
     *  @param {String} userName 帐号
     *  @param {String} password 密码
     */
    applicationExport.showDHVideo = function(successCallback, errorCallback, options) {
        var getValue = argscheck.getValue;
        options = options || {};
        var deviceIP =  getValue(options.deviceIP, ""),
            devicePort = getValue(options.devicePort, ""),
            userName = getValue(options.userName, ""),
            password = getValue(options.password, "");
        return exec(successCallback, errorCallback, "Application", "showDHVideo", [deviceIP, devicePort, userName, password]);
    };


     /**
      *  视频推流
      *  @param {String} url 推流地址
      *  @param {Number} resolution 分辨率 1标清 2高清
      *  @param {Number} cameraFacing 摄像头 0后置 1前置  默认为0
      *  @param {Number} videoFPS 帧率默认20
      *  @param {Number} orientation 1竖屏  2横屏  默认为2
      *  @param {Number} definition 清晰度  1流畅 2清晰 默认1
      *  @param {Boolean} audioEnabled 推流直播是否带声音 true 有声音 false无声音 默认为true
      */
    applicationExport.startRtmp = function(successCallback, errorCallback, options) {
        options = options || {};
        var opts = {
            url: options.url,
            resolution:options.resolution||2,
            cameraFacing:options.cameraFacing||0,
            videoFPS:options.videoFPS||20,
            orientation:options.orientation||2,
            definition:options.definition||1,
            audioEnabled:options.audioEnabled

        };
        opts = removeInvalidProperty(opts);
       var err = checkOptions("startRtmp", opts, {
       			url: CHECK.StringIsRequired,
       			resolution: CHECK.NumberDuration,
       			cameraFacing: CHECK.NumberDuration,
       			videoFPS: CHECK.NumberDuration,
       			orientation: CHECK.NumberDuration,
       			definition: CHECK.NumberDuration,
       			audioEnabled: CHECK.BooleanValue
       		})
        if (err) {
            errorCallback && errorCallback.call(this, err);
        } else {
            return exec(successCallback, errorCallback,"Application", "startRtmp", [opts]);
        }
    };
  /**
    * @method showYSYLiveVideo
    * 打开萤石云视频
    *
    * Example:
    *
    *         window.cloudtplus.showYSYLiveVideo({
    *             success: function() {},
    *             error: function() {},
    *            appkey: ""              //appkey
    *            accessToken: "",        //访问token
    *            projectId:"",             ///项目ID
    *            rooms:[{
    *                           deviceName :"" ,       ///设备名字
    *                           deviceSerial: "",      ///通道
    *                           channelNo: number,      ///频道
    *                           alidateCode: "",       ///通道验证码
    *                     }],
    *           specialDevice:[{
                                  *                           deviceName :"" ,       ///设备名字
                                  *                           deviceSerial: "",      ///通道
                                  *                           channelNo: number,      ///频道
                                  *                           alidateCode: "",       ///通道验证码
                                  *                     }]
    *         });
    *
    * @param {Object} args 参数对象
    * @return {Object} 返回cloudtplus对象
    */
   applicationExport.showYSYLiveVideo=function(successCallback,errorCallback,options){
       var getValue = argscheck.getValue;
       options = options || {};
       var sourceType =  getValue(options.sourceType, ""),
       playType = getValue(options.playType, ""),
       streamType = getValue(options.streamType, ""),
       appkey = getValue(options.appkey, ""),
       projectId = getValue(options.projectId,""),
       accessToken = getValue(options.accessToken, ""),
       host= getValue(options.host, ""),
       zlToken= getValue(options.zlToken, ""),
       expireTime = getValue(options.expireTime, ""),
       rooms = getValue(options.rooms, []);
       specialDevice = getValue(options.specialDevice,[]);
       var paramerList = [{
                          host:host,
                          zlToken:zlToken,
                          appkey: appkey,
                          accessToken: accessToken,
                          projectId:projectId,
                          rooms:rooms,
                          specialDevice:specialDevice
       }];
       return exec(successCallback, errorCallback, "Application", "showYSYLiveVideo", paramerList);
   };

   /**
       * @method showYSYLiveVideo2
       * 打开萤石云视频
       *
       * Example:
       *
       *         window.cloudtplus.showYSYLiveVideo2({
       *             success: function() {},
       *             error: function() {},
       *            appkey: ""              //appkey
       *            accessToken: "",        //访问token
       *            projectId:"",             ///项目ID
       *            rooms:[{
       *                           deviceName :"" ,       ///设备名字
       *                           deviceSerial: "",      ///通道
       *                           channelNo: number,      ///频道
       *                           alidateCode: "",       ///通道验证码
       *                     }],
       *           specialDevice:[{
                                     *                           deviceName :"" ,       ///设备名字
                                     *                           deviceSerial: "",      ///通道
                                     *                           channelNo: number,      ///频道
                                     *                           alidateCode: "",       ///通道验证码
                                     *                     }]
       *         });
       *
       * @param {Object} args 参数对象
       * @return {Object} 返回cloudtplus对象
       */
      applicationExport.showYSYLiveVideo2=function(successCallback,errorCallback,options){
          var getValue = argscheck.getValue;
          options = options || {};
          var sourceType =  getValue(options.sourceType, ""),
          playType = getValue(options.playType, ""),
          streamType = getValue(options.streamType, ""),
          appkey = getValue(options.appkey, ""),
          projectId = getValue(options.projectId,""),
          accessToken = getValue(options.accessToken, ""),
          host= getValue(options.host, ""),
          zlToken= getValue(options.zlToken, ""),
          expireTime = getValue(options.expireTime, ""),
          rooms = getValue(options.rooms, []);
          specialDevice = getValue(options.specialDevice,[]);
          var paramerList = [{
                             host:host,
                             zlToken:zlToken,
                             appkey: appkey,
                             accessToken: accessToken,
                             projectId:projectId,
                             rooms:rooms,
                             specialDevice:specialDevice
          }];
          return exec(successCallback, errorCallback, "Application", "showYSYLiveVideo2", paramerList);
      };

/**
    * @method showIJKPlayerVideo
    * 打开ijk视频
    *
    * Example:
    *
    *         window.cloudtplus.showIJKPlayerVideo({
    *             success: function() {},
    *             error: function() {},
    *            host: ""              //host
    *            accessToken: "",        //访问token
    *            projectId:"",             ///项目ID
    *            devices:[{
    *                           deviceName :"" ,       ///设备名字
    *                           deviceSerial: "",      ///通道
    *                           channelNo: number,      ///频道
    *                           alidateCode: "",       ///通道验证码
    *                     }],
    *         });
    *
    * @param {Object} args 参数对象
    * @return {Object} 返回cloudtplus对象
    */
   applicationExport.showIJKPlayerVideo=function(successCallback,errorCallback,options){
       var getValue = argscheck.getValue;
       options = options || {};
       var sourceType =  getValue(options.sourceType, ""),
       playType = getValue(options.playType, ""),
       streamType = getValue(options.streamType, ""),
       host = getValue(options.host, ""),
       productCode = getValue(options.productCode,""),
       projectId = getValue(options.projectId,""),
       accessToken = getValue(options.accessToken, ""),
       expireTime = getValue(options.expireTime, ""),
       devices = getValue(options.devices, []);
       specialDevice = getValue(options.specialDevice,[]);
       var paramerList = [{
                          host: host,
                          productCode:productCode,
                          accessToken: accessToken,
                          projectId:projectId,
                          devices:devices,
                          specialDevice:specialDevice
       }];
       return exec(successCallback, errorCallback, "Application", "showIJKPlayerVideo", paramerList);
   };

   /**
       * @method showIJKPlayerVideo
       * 打开ijk视频
       *
       * Example:
       *
       *         window.cloudtplus.showIJKPlayerVideo2({
       *             success: function() {},
       *             error: function() {},
       *            host: ""              //host
       *            accessToken: "",        //访问token
       *            projectId:"",             ///项目ID
       *            devices:[{
       *                           deviceName :"" ,       ///设备名字
       *                           deviceSerial: "",      ///通道
       *                           channelNo: number,      ///频道
       *                           alidateCode: "",       ///通道验证码
       *                     }],
       *         });
       *
       * @param {Object} args 参数对象
       * @return {Object} 返回cloudtplus对象
       */
      applicationExport.showIJKPlayerVideo2=function(successCallback,errorCallback,options){
          var getValue = argscheck.getValue;
          options = options || {};
          var sourceType =  getValue(options.sourceType, ""),
          playType = getValue(options.playType, ""),
          streamType = getValue(options.streamType, ""),
          host = getValue(options.host, ""),
          productCode = getValue(options.productCode,""),
          projectId = getValue(options.projectId,""),
          accessToken = getValue(options.accessToken, ""),
          expireTime = getValue(options.expireTime, ""),
          devices = getValue(options.devices, []);
          specialDevice = getValue(options.specialDevice,[]);
          var paramerList = [{
                             host: host,
                             productCode:productCode,
                             accessToken: accessToken,
                             projectId:projectId,
                             devices:devices,
                             specialDevice:specialDevice
          }];
          return exec(successCallback, errorCallback, "Application", "showIJKPlayerVideo2", paramerList);
      };

      /**
      * @method showBlendLiveVideo
      * 混合视频
      *
      * Example:
      *
      *         window.cloudtplus.showBlendLiveVideo({
      *            success: function() {},
      *            error: function() {},
      *            host:"",             //云台控制的host路径
      *            zlToken:"",          //云台控制的token
      *            projectId:""  ,        ///项目ID
      *            appkey: ""              //appkey
      *            accessToken: "",        //访问token
      *            devices:[{
      *                           sourceType:"YSY" ,    ///视频类型， 必须有
      *                           deviceId:""   ,        ///设备id
      *                           deviceName :"" ,       ///设备名字
      *                           deviceSerial: "",      ///通道
      *                           channelNo: number,      ///频道
      *                           validateCode: "",       ///通道验证码
      *                           pictureUrl:"",          ///默认缩略图
      *                           controllable: true,     ///是否支持云台控制
      *                     },
      *                      {
      *                            sourceType:"IJK" ,    /// 视频类型，必须有
      *                           "streamType":"RTMP",
      *                            "deviceId" : "0fa2f8bd-27e8-4a48-b964-a9a241034a19",
      *                           "deviceName" : "大厅RTMP",
      *                        }],
      *            specialDevice:[{
      *                           deviceId:"",
      *                           deviceName :"" ,       ///设备名字
      *                           deviceSerial: "",      ///通道
      *                           channelNo: number,      ///频道
      *                           validateCode: "",       ///通道验证码
      *                           controllable: true,     ///是否支持云台控制
      *                     }],
      *         });
      *
      * @param {Object} args 参数对象
      * @return {Object} 返回cloudtplus对象
      */
      applicationExport.showBlendLiveVideo=function(successCallback,errorCallback,options){
                var getValue = argscheck.getValue;
                options = options || {};
                var host = getValue(options.host, ""),
                productCode = getValue(options.productCode,""),
                projectId = getValue(options.projectId,""),
                appkey = getValue(options.appkey, ""),
                accessToken = getValue(options.accessToken, ""),
                zlToken = getValue(options.zlToken, ""),
                expireTime = getValue(options.expireTime, ""),
                devices = getValue(options.devices, []);
                specialDevice = getValue(options.specialDevice,[]);

                var paramerList = [{
                                   host: host,
                                   productCode:productCode,
                                   appkey:appkey,
                                   accessToken: accessToken,
                                   zlToken:zlToken,
                                   projectId:projectId,
                                   expireTime:expireTime,
                                   devices:devices,
                                   specialDevice:specialDevice
                }];
                return exec(successCallback, errorCallback, "Application", "showIJKPlayerVideo2", paramerList);
            };

	/**
	 *  重现加载
	 */
	applicationExport.reload = function(successCallback, errorCallback) {
		return exec(successCallback, errorCallback, "Application", "reload", []);
	};

	/**
	 *  重现加载离线应用
	 */
	applicationExport.reloadOfflineApp = function(successCallback, errorCallback, progressCallback) {
		if (!window._reloadOfflineApp_reloading) {
			window._reloadOfflineApp_reloading = true;
			return exec((function(me, success, progress) {
				return function(value) {
					if (value === true) {
						window._reloadOfflineApp_reloading = false;
						return success.apply(this, arguments);
					} else {
						return progress.call(this, value);
					}
				}
			})(this, successCallback || emptyFn, progressCallback || emptyFn), (function(me, error) {
				return function() {
					window._reloadOfflineApp_reloading = false;
					return error.apply(this, arguments);
				}
			})(this, errorCallback || emptyFn), "Application", "reloadOfflineApp", []);
		}
	};

	/**
	 *  退出页面
	 */
	applicationExport.exitApp = function(successCallback, errorCallback,options) {
	    options = options || {};
		return exec(successCallback, errorCallback, "Application", "exitApp", [options]);
	};

	/**
     *  退出页面
     */
    applicationExport.callApp = function(successCallback, errorCallback,options) {
        options = options || {};
        var opts = {
            url: options.url || "",
            appId: options.appId || "",
            title:options.title||""
        };
        var err = checkOptions("callApp", opts, {
            url: CHECK.StringIsRequired,
            appId: CHECK.StringAllowEmpty
        });
        if (err) {
            errorCallback && errorCallback.call(this, err);
        } else {
            return exec(successCallback, errorCallback, "Application", "callApp", [opts]);
        }

	};
	
	/**
    *  显示部位选择树
    */
   applicationExport.showPositionTree = function(successCallback, errorCallback, options) {
       options = options || {};
       return exec(successCallback, errorCallback, "Application", "showPositionTree", [options]);
   };


    /**
        * @method unzipFile
        * 解压文件
        * @param {Object} args 参数对象
        * @return {Object} 返回cloudtplus对象
        */
       applicationExport.unzipFile = function(successCallback, errorCallback, options) {
           options = options || {};
           var opts = {
               fileUrl: options.fileUrl || "",
               id: options.id || null
           };
           opts = removeInvalidProperty(opts);
           var err = checkOptions("unzipFile", opts, {
                                      fileUrl: CHECK.StringIsRequired,
                                      id: CHECK.StringAllowEmpty
                                  });
           if (err) {
               errorCallback && errorCallback.call(this, err);
           } else {
               return exec(successCallback, errorCallback, "Application", "unzipFile", [opts]);
           }
       };

       /**
        * @method removeUnzippedFiles
        * 批量删除已解压得到的文件
        * @param {Object} args 参数对象
        * @return {Object} 返回cloudtplus对象
        */
       applicationExport.removeUnzippedFiles = function(successCallback, errorCallback, options) {
           options = options || {};
           var opts = {
               ids: options.ids || []
           };
           opts = removeInvalidProperty(opts);
           var err = checkOptions("removeUnzippedFiles", opts, {
                                      ids: CHECK.StringArrayAllowEmpty
                                  });
           if (err) {
               errorCallback && errorCallback.call(this, err);
           } else {
               return exec(successCallback, errorCallback, "Application", "removeUnzippedFiles", [opts.ids]);
           }
       };

       /**
        * @method isFilesUnzipped
        * 批量判断文件是否已经解压，返回其中已解压得到的文件夹的路径列表
        * @param {Object} args 参数对象
        * @return {Object} 返回cloudtplus对象
        */
       applicationExport.isFilesUnzipped = function(successCallback, errorCallback, options) {
           options = options || {};
           var opts = {
               ids: options.ids || []
           };
           opts = removeInvalidProperty(opts);
           var err = checkOptions("isFilesUnzipped", opts, {
                                      ids: CHECK.StringArrayAllowEmpty
                                  });
           if (err) {
               errorCallback && errorCallback.call(this, err);
           } else {
               return exec(successCallback, errorCallback, "Application", "isFilesUnzipped", [opts.ids]);
           }
       };

       /**
        * @method startWebServer
        * 启动本地WebServer
        * @param {Object} args 参数对象
        * @return {Object} 返回cloudtplus对象
        */
       applicationExport.startWebServer = function(successCallback, errorCallback, options) {
           options = options || {};
           var opts = {
               rootPath: options.rootPath || ""
           };
           opts = removeInvalidProperty(opts);
           var err = checkOptions("startWebServer", opts, {
                                      rootPath: CHECK.StringIsRequired
                                  });
           if (err) {
               errorCallback && errorCallback.call(this, err);
           } else {
               return exec(successCallback, errorCallback, "Application", "startWebServer", [opts.rootPath]);
           }
       };

       /**
        * @method stopWebServer
        * 停止本地WebServer
        * @param {Object} args 参数对象
        * @return {Object} 返回cloudtplus对象
        */
       applicationExport.stopWebServer = function(successCallback, errorCallback, options) {
           return exec(successCallback, errorCallback, "Application", "stopWebServer", []);
       };


    /**
     *  拷贝一个本地文件到另一个App，并在另一个App中添加成为一个OfflineFile
     */
    applicationExport.copyOfflineFileToApp = function(successCallback, errorCallback, options) {
        options = options || {};
        var opts = {
            fileUrls: options.fileUrls || [],
            appId: options.appId || ""
        };
        opts = removeInvalidProperty(opts);
        var err = checkOptions("copyOfflineFileToApp", opts, {
                           fileUrls: CHECK.StringArrayIsRequired,
                           appId: CHECK.StringIsRequired
                        });
        if (err) {
            errorCallback && errorCallback.call(this, err);
        } else {
            return exec(successCallback, errorCallback, "Application", "copyOfflineFileToApp", [opts]);
        }
    };


   /**
     *  拷贝一个本地文件到另一个App，并在另一个App中添加成为一个OfflineFile
     */
    applicationExport.editPicture = function(successCallback, errorCallback, options) {
        options = options || {};
        var opts = {
            fileUrl: options.fileUrl || "",
            type: options.type || ""
        };
        opts = removeInvalidProperty(opts);
        var err = checkOptions("editPicture", opts, {
                           fileUrl: CHECK.StringIsRequired,
                           type: CHECK.StringIsRequired
                        });
        if (err) {
            errorCallback && errorCallback.call(this, err);
        } else {
            return exec(successCallback, errorCallback, "Application", "editPicture", [opts]);
        }
    };

	/**
	 *  获取离线照片
	 *  
	 *  @param {String} orgId 组织id
	 *  @param {String} projectId 项目id
	 *  @param {String} type 类型
	 *  @param {String} tag1 标签1
	 *  @param {String} tag2 标签2
	 *  @param {String} tag3 标签3
	 *  @param {String} tag4 标签4
	 *  @param {String} tag5 标签5
	 *  @param {String} productType 产品类型，默认值: appId/UNKNOWN
	 *  @param {String} moduleName 模块名称，目录，默认值: cloudtplus/ios 或 cloudtplus/android
	 *  @param {Boolean} isPublic 是否公开，默认值: false
	 *  @param {String} sourceType 照片来源，默认值: CAMERA
	 *  @param {Number} maxCount 最大连拍数
	 *  @param {Boolean} allowVideo 允许录制短视频，默认值: false
	 *  @param {Boolean} hideAlbumBtn 当sourceType是CAMERA时，是否在拍照界面隐藏从相册选择按钮，默认值：false
	 * 	@param {Number} maxDuration 限制录制时长
	 * 	@param {Boolean} alwaysSave 总是保存(拍照时，点击取消也保存)，默认值: false
	 * 	@param {Boolean} isTemp 不存储，只用于临时使用，默认值: false
	 *  @param {Boolean} isContinue 是否允许连续拍照，不返回保存，默认值: false
	 */
	applicationExport.getOfflinePicture = function(successCallback, errorCallback, options) {
		var getTimeFormUrl = function(url) {
			var fileName = url.substring(url.lastIndexOf('/') + 1);
			var dateStr = fileName.substring(0, fileName.indexOf("."));
			if (dateStr) {
				var n = Number(dateStr);
				if (!window.isNaN(n)) {
					var r = new Date(n);
					if (!window.isNaN(r)) {
						return r;
					}
				}
			}
		};

		var updateFile = function(successCallback, errorCallback, emptyFn, imageUrl,sources,categoryName, opts) {
			var items = [];
			var sourceData=(getType(sources) == "Array")?sources:false;
			if(!sourceData){
			   sourceData=new Array(imageUrl.length);
			}
			//这里需要处理一下
			for (var i = 0; i < imageUrl.length; i++) {
				var url = imageUrl[i];
				var isMp4 = url.length - url.indexOf(".mp4") === 4;
				items.push({
					lastTime: getTimeFormUrl(url),
					mediaType: isMp4 ? "VIDEO" : "PICTURE",
					sourceFileUrl: url,
					photoSource: sourceData[i],
					category:categoryName
				});
			}
			opts.items = items;
			window.Application.updateOfflineFile(successCallback, errorCallback, emptyFn, opts);
		};

		options = options || {};
		var opts = {
			orgId: options.orgId || "",
			projectId: options.projectId || "",
			type: options.type || "",
			tag1: options.tag1 || "",
			tag2: options.tag2 || "",
			tag3: options.tag3 || "",
			tag4: options.tag4 || "",
			tag5: options.tag5 || "",
			productType: options.productType || "",
			moduleName: options.moduleName || "",
			isPublic: options.isPublic || false,
			sourceType: options.sourceType || "CAMERA",
			maxCount: options.maxCount || 0,
			allowVideo: options.allowVideo || false,
			hideAlbumBtn: options.hideAlbumBtn || false,
			maxDuration: options.maxDuration || 0,
            quality: options.quality || 60,
            watermark: options.watermark || "",
            waterColor: options.waterColor || "#FFFFFF",
            cropRate: options.cropRate || 0.0,
            freeStyleCropEnabled: options.freeStyleCropEnabled || 0,
			alwaysSave: options.alwaysSave || false,
			isTemp: options.isTemp || false,
			isContinue: options.isContinue || false,
			photoCategory: options.photoCategory || []
		};
		opts = removeInvalidProperty(opts);
		var err = checkOptions("getOfflinePicture", opts, {
			mediaType: CHECK.EnumMediaType,
			orgId: CHECK.StringAllowEmpty,
			projectId: CHECK.StringAllowEmpty,
			type: CHECK.StringAllowEmpty,
			tag1: CHECK.StringAllowEmpty,
			tag2: CHECK.StringAllowEmpty,
			tag3: CHECK.StringAllowEmpty,
			tag4: CHECK.StringAllowEmpty,
			tag5: CHECK.StringAllowEmpty,
			productType: CHECK.StringAllowEmpty,
			moduleName: CHECK.StringAllowEmpty,
			isPublic: CHECK.BooleanValue,
			sourceType: CHECK.EnumSourceType,
			maxCount: CHECK.NumberCount,
			allowVideo: CHECK.BooleanValue,
			hideAlbumBtn: CHECK.BooleanValue,
			maxDuration: CHECK.NumberDuration,
            quality: CHECK.NumberDuration,
			watermark: CHECK.StringAllowEmpty,
            waterColor: CHECK.StringAllowEmpty,
            cropRate: CHECK.NumberDuration,
            freeStyleCropEnabled: CHECK.NumberCount,
			alwaysSave: CHECK.BooleanValue,
			isTemp: CHECK.BooleanValue,
			isContinue: CHECK.BooleanValue,
			photoCategory: CHECK.StringArrayAllowEmpty
		});

		options.sourceType = opts.sourceType;
		delete opts.sourceType;
		options.maxCount = opts.maxCount;
		delete opts.maxCount;
		options.allowVideo = opts.allowVideo;
		delete opts.allowVideo;
		options.hideAlbumBtn = opts.hideAlbumBtn;
        delete opts.hideAlbumBtn;
		options.maxDuration = opts.maxDuration;
		delete opts.maxDuration;
        options.quality = opts.quality;
        delete opts.quality;
		options.watermark = opts.watermark;
		delete opts.watermark;
        options.waterColor = opts.waterColor;
        delete opts.waterColor;
        options.cropRate = opts.cropRate;
        delete opts.cropRate;
        options.freeStyleCropEnabled = opts.freeStyleCropEnabled;
        delete opts.freeStyleCropEnabled;
		options.alwaysSave = opts.alwaysSave;
		delete opts.alwaysSave;
		options.isTemp = opts.isTemp;
		delete opts.isTemp;
		options.isContinue = opts.isContinue;
        delete opts.isContinue;
		options.photoCategory = opts.photoCategory;
        delete opts.photoCategory;

		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return exec((function(successCallback, errorCallback, emptyFn, opts, options) {
				return function(data) {
				    var imageUrl,categoryName,sources;
                    if(getType(data) == "Array"){
                        imageUrl=data;
                        categoryName="";
                        sources="";
                    }else{
                        imageUrl=data.imageUrl;
                        sources=data.sources;
                        categoryName=data.categoryName;
                    }

					if (imageUrl && imageUrl.length > 0) {
						if (options.isTemp) {
							var urls = [];
							for (var i = 0; i < imageUrl.length; i++) {
								urls.push({fileUrl: imageUrl[i]});
							}
							successCallback && successCallback.call(this, urls);
						} else {
							updateFile(successCallback, errorCallback, emptyFn, imageUrl,sources,categoryName, opts);
						}
					} else {
						errorCallback && errorCallback.call(this, '没有拍摄任何照片');
					}
			}})(successCallback, errorCallback, emptyFn, opts, options),
			(function(successCallback, errorCallback, emptyFn, opts, alwaysSave) {
				return function(err) {
				    var data= getType(err) == "Object"&&err.imageUrl.length>0 ? err : false;
				    if(data){
				        var imageUrl=data.imageUrl;
				        var categoryName=data.categoryName;
				        var sources = data.sources;
                        if (alwaysSave) {
                            updateFile(successCallback, errorCallback, emptyFn, imageUrl,sources, categoryName, opts);
                        } else {
                            errorCallback && errorCallback.call(this, ''); // 取消拍照，不返回错误文本
                        }
				    }else {
                       var imageUrl = getType(err) == "Array" && err.length > 0 ? err : false;
                       if(imageUrl){
                          var categoryName="";
                          var sources="";
                          if (alwaysSave) {
                              updateFile(successCallback, errorCallback, emptyFn, imageUrl,sources, categoryName, opts);
                          } else {
                             errorCallback && errorCallback.call(this, ''); // 取消拍照，不返回错误文本
                          }
                       }else{
                           errorCallback && errorCallback.call(this, err);
                       }
                    }
			}})(successCallback, errorCallback, emptyFn, opts, options.alwaysSave), "Application", "getPicture", [{
				sourceType: options.sourceType == "CAMERA" ? 0 : 1, // 0:拍照 1:系统相册
				maxCount: options.maxCount || 0, // 0:表示无限制
				maxBurstCount: options.maxCount || 0, // 0:表示无限制 // 弃用maxBurstCount
				encodingType: 0,			// 0:JPEG 1:PNG
				targetWidth: undefined,		// 照片宽度，保持宽高比
				targetHeight: undefined,	// 照片高度，保持宽高比
				quality: options.quality || 60,		// 图像质量:60~100
				cameraDirection: 0,			// 0:后置摄像头 1:前置摄像头
				allowVideo: options.allowVideo || false,	// true:拍照时允许录制短视频
				hideAlbumBtn: options.hideAlbumBtn || false,   // 当sourceType是CAMERA时，是否在拍照界面隐藏从相册选择按钮，默认值：false
				maxDuration: options.maxDuration || 8000,	// 限制录制时长，默认8秒
				watermark: options.watermark || "",    // 在照片上添加的水印文字
                waterColor: options.waterColor || "#FFFFFF",    // 水印文字颜色，默认为白色
                cropRate: options.cropRate || 0 ,    // 剪裁图片的剪裁框的宽高比，默认为0，表示不剪裁
                freeStyleCropEnabled: options.freeStyleCropEnabled || 0 , //当cropRate不为0时，用于控制裁剪筐是否支持拖动 默认为0 不支持 1支持
                isContinue: options.isContinue || false,	// true:允许连续拍照
                photoCategory: options.photoCategory || [] // 拍照时需要选择的类别
			}]);
		}
	};

	/**
     *  调用加入人脸识别的相机
     */
    applicationExport.scanFace = function(successCallback, errorCallback, options) {
        options = options || {};
        return exec(successCallback,errorCallback,"Application","scanFace",[options]);

    };

	/**
	 *  获取离线视频
	 *  
	 *  @param {String} orgId 组织id
	 *  @param {String} projectId 项目id
	 *  @param {String} type 类型
	 *  @param {String} tag1 标签1
	 *  @param {String} tag2 标签2
	 *  @param {String} tag3 标签3
	 *  @param {String} tag4 标签4
	 *  @param {String} tag5 标签5
	 *  @param {String} productType 产品类型，默认值: appId/UNKNOWN
	 *  @param {String} moduleName 模块名称，目录，默认值: cloudtplus/ios 或 cloudtplus/android
	 *  @param {Boolean} isPublic 是否公开，默认值: false
	 * 	@param {String} shootMode 录制模式
	 * 	@param {Number} maxDuration 限制录制时长
	 */
	applicationExport.getOfflineVideo = function(successCallback, errorCallback, options) {
		options = options || {};
		var opts = {
			mediaType: "VIDEO",
			orgId: options.orgId || "",
			projectId: options.projectId || "",
			type: options.type || "",
			tag1: options.tag1 || "",
			tag2: options.tag2 || "",
			tag3: options.tag3 || "",
			tag4: options.tag4 || "",
			tag5: options.tag5 || "",
			productType: options.productType || "",
			moduleName: options.moduleName || "",
			isPublic: options.isPublic || false,
			shootMode: options.shootMode || "",
			maxDuration: options.maxDuration || 0
		};
		opts = removeInvalidProperty(opts);
		var err = checkOptions("getOfflineVideo", opts, {
			mediaType: CHECK.EnumMediaType,
			orgId: CHECK.StringAllowEmpty,
			projectId: CHECK.StringAllowEmpty,
			type: CHECK.StringAllowEmpty,
			tag1: CHECK.StringAllowEmpty,
			tag2: CHECK.StringAllowEmpty,
			tag3: CHECK.StringAllowEmpty,
			tag4: CHECK.StringAllowEmpty,
			tag5: CHECK.StringAllowEmpty,
			productType: CHECK.StringAllowEmpty,
			moduleName: CHECK.StringAllowEmpty,
			isPublic: CHECK.BooleanValue,
			shootMode: CHECK.EnumShootMode,
			maxDuration: CHECK.NumberDuration
		});
		options.shootMode = opts.shootMode;
		delete opts.shootMode;
		options.maxDuration = opts.maxDuration;
		delete opts.maxDuration;
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return exec((function(successCallback, errorCallback, emptyFn, opts) {
				return function(videoUrl) {
					if (videoUrl) {
						opts.items = [{
							sourceFileUrl: videoUrl
						}];
						window.Application.updateOfflineFile(successCallback, errorCallback, emptyFn, opts);
					} else {
						errorCallback && errorCallback.call(this, '没有录制任何视频');
					}
			}})(successCallback, errorCallback, emptyFn, opts), errorCallback, "Application", "getVideo", [{
				shootMode: options.shootMode || "TAP",		// 默认点击录制
				maxDuration: options.maxDuration || 8000	// 默认8秒
			}]);
		}
	};

	/**
	 *  获取离线音频
	 *  
	 *  @param {String} orgId 组织id
	 *  @param {String} projectId 项目id
	 *  @param {String} type 类型
	 *  @param {String} tag1 标签1
	 *  @param {String} tag2 标签2
	 *  @param {String} tag3 标签3
	 *  @param {String} tag4 标签4
	 *  @param {String} tag5 标签5
	 *  @param {String} productType 产品类型，默认值: appId/UNKNOWN
	 *  @param {String} moduleName 模块名称，目录，默认值: cloudtplus/ios 或 cloudtplus/android
	 *  @param {Boolean} isPublic 是否公开，默认值: false
	 * 	@param {String} shootMode 录制模式
	 * 	@param {Number} maxDuration 限制录制时长
	 */
	applicationExport.getOfflineAudio = function(successCallback, errorCallback, options) {
		options = options || {};
		var opts = {
			mediaType: "AUDIO",
			orgId: options.orgId || "",
			projectId: options.projectId || "",
			type: options.type || "",
			tag1: options.tag1 || "",
			tag2: options.tag2 || "",
			tag3: options.tag3 || "",
			tag4: options.tag4 || "",
			tag5: options.tag5 || "",
			productType: options.productType || "",
			moduleName: options.moduleName || "",
			isPublic: options.isPublic || false,
			shootMode: options.shootMode || "",
			maxDuration: options.maxDuration || 0
		};
		opts = removeInvalidProperty(opts);
		var err = checkOptions("getOfflineAudio", opts, {
			mediaType: CHECK.EnumMediaType,
			orgId: CHECK.StringAllowEmpty,
			projectId: CHECK.StringAllowEmpty,
			type: CHECK.StringAllowEmpty,
			tag1: CHECK.StringAllowEmpty,
			tag2: CHECK.StringAllowEmpty,
			tag3: CHECK.StringAllowEmpty,
			tag4: CHECK.StringAllowEmpty,
			tag5: CHECK.StringAllowEmpty,
			productType: CHECK.StringAllowEmpty,
			moduleName: CHECK.StringAllowEmpty,
			isPublic: CHECK.BooleanValue,
			shootMode: CHECK.EnumShootMode,
			maxDuration: CHECK.NumberDuration
		});
		options.shootMode = opts.shootMode;
		delete opts.shootMode;
		options.maxDuration = opts.maxDuration;
		delete opts.maxDuration;
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return exec((function(successCallback, errorCallback, emptyFn, opts) {
				return function(audioUrl) {
					if (audioUrl) {
						opts.items = [{
							sourceFileUrl: audioUrl
						}];
						window.Application.updateOfflineFile(successCallback, errorCallback, emptyFn, opts);
					} else {
						errorCallback && errorCallback.call(this, '没有录制任何音频');
					}
			}})(successCallback, errorCallback, emptyFn, opts), errorCallback, "Application", "getAudio", [{
				shootMode: options.shootMode || "TAP",		// 默认点击录制
				maxDuration: options.maxDuration || 60000	// 默认60秒
			}]);
		}
	};

	/**
	 *  根据属性删除离线记录
	 *  
	 *  @param {String|Array} recordId 离线记录id
	 *  @param {String|Array} orgId 组织id
	 *  @param {String|Array} projectId 项目id
	 *  @param {String|Array} type 类型
	 *  @param {String|Array} tag1 标签1
	 *  @param {String|Array} tag2 标签2
	 *  @param {String|Array} tag3 标签3
	 *  @param {String|Array} tag4 标签4
	 *  @param {String|Array} tag5 标签5
	 *  @param {String|Array} uploaded 是否上传
	 */
	applicationExport.removeOfflineRecord = function(successCallback, errorCallback, options) {
		options = options || {};
		var opts = {
			recordId: getFilterProperty(options.recordId),
			orgId: getFilterProperty(options.orgId),
			projectId: getFilterProperty(options.projectId),
			type: getFilterProperty(options.type),
			tag1: getFilterProperty(options.tag1),
			tag2: getFilterProperty(options.tag2),
			tag3: getFilterProperty(options.tag3),
			tag4: getFilterProperty(options.tag4),
			tag5: getFilterProperty(options.tag5),
			uploaded: options.uploaded
		};
		opts = removeInvalidProperty(opts);
		var err;
		if (isEmptyObject(opts)) {
			err = "不允许全部清空记录";
		}
		if (!err) {
			err = checkOptions("removeOfflineRecord", opts, {
				recordId: CHECK.StringArrayFilter,
				orgId: CHECK.StringArrayFilter,
				projectId: CHECK.StringArrayFilter,
				type: CHECK.StringArrayFilter,
				tag1: CHECK.StringArrayFilter,
				tag2: CHECK.StringArrayFilter,
				tag3: CHECK.StringArrayFilter,
				tag4: CHECK.StringArrayFilter,
				tag5: CHECK.StringArrayFilter,
				uploaded: CHECK.BooleanValue
			});
		}
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return exec(successCallback, errorCallback, "Application", "removeOfflineRecord", [opts]);
		}
	};

	/**
	 *  根据属性删除离线文件
	 *  
	 *  @param {String|Array} fileId 离线文件id
	 *  @param {String|Array} mediaType 媒体类型
	 *  @param {String|Array} saveId oss唯一标识
	 *  @param {String|Array} orgId 组织id
	 *  @param {String|Array} projectId 项目id
	 *  @param {String|Array} type 类型
	 *  @param {String|Array} tag1 标签1
	 *  @param {String|Array} tag2 标签2
	 *  @param {String|Array} tag3 标签3
	 *  @param {String|Array} tag4 标签4
	 *  @param {String|Array} tag5 标签5
	 *  @param {String|Array} uploaded 是否上传
	 */
	applicationExport.removeOfflineFile = function(successCallback, errorCallback, options) {
		options = options || {};
		var opts = {
			fileId: getFilterProperty(options.fileId),
			mediaType: getFilterProperty(options.mediaType),
			saveId: getFilterProperty(options.saveId),
			orgId: getFilterProperty(options.orgId),
			projectId: getFilterProperty(options.projectId),
			type: getFilterProperty(options.type),
			tag1: getFilterProperty(options.tag1),
			tag2: getFilterProperty(options.tag2),
			tag3: getFilterProperty(options.tag3),
			tag4: getFilterProperty(options.tag4),
			tag5: getFilterProperty(options.tag5),
			uploaded: options.uploaded
		};
		opts = removeInvalidProperty(opts);
		var err;
		if (isEmptyObject(opts)) {
			err = "不允许全部清空文件";
		}
		if (!err) {
			err = checkOptions("removeOfflineFile", opts, {
				fileId: CHECK.StringArrayFilter,
				mediaType: CHECK.StringArrayFilter,
				saveId: CHECK.StringArrayFilter,
				orgId: CHECK.StringArrayFilter,
				projectId: CHECK.StringArrayFilter,
				type: CHECK.StringArrayFilter,
				tag1: CHECK.StringArrayFilter,
				tag2: CHECK.StringArrayFilter,
				tag3: CHECK.StringArrayFilter,
				tag4: CHECK.StringArrayFilter,
				tag5: CHECK.StringArrayFilter,
				uploaded: CHECK.BooleanValue
			});
		}
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return exec(successCallback, errorCallback, "Application", "removeOfflineFile", [opts]);
		}
	};

	/**
	 *  根据recordId，更新离线记录
	 *  
	 *  @param {String} recordId 离线记录id
	 *  @param {String} data 数据
	 *  @param {String} orgId 组织id
	 *  @param {String} projectId 项目id
	 *  @param {String} type 类型
	 *  @param {String} tag1 标签1
	 *  @param {String} tag2 标签2
	 *  @param {String} tag3 标签3
	 *  @param {String} tag4 标签4
	 *  @param {String} tag5 标签5
	 *  @param {String} lastTime 最后修改时间
	 *  @param {String} uploaded 是否上传
	 *  @param {String} errorMsg 错误信息
	 *  @param {String} uploadUrl 上传地址，以参数传入为优先
	 *  @param {Array} files 关联文件
	 *  @param {Array} items 批量更新离线记录
	 */
	applicationExport.updateOfflineRecord = function(successCallback, errorCallback, progressCallback, options) {
		options = options || {};
		var defaultOptions = {
			recordId: options.recordId,
			data: options.data,
			orgId: options.orgId,
			projectId: options.projectId,
			type: options.type,
			tag1: options.tag1,
			tag2: options.tag2,
			tag3: options.tag3,
			tag4: options.tag4,
			tag5: options.tag5,
			lastTime: options.lastTime,
			uploaded: options.uploaded,
			errorMsg: options.errorMsg,
			uploadUrl: options.uploadUrl,
			files: options.files
		};
		var items = getExecItems(options.items, defaultOptions);
		var err = checkOptions("updateOfflineRecord", items, {
			recordId: CHECK.StringAllowEmpty,
			data: CHECK.StringAllowEmpty,
			orgId: CHECK.StringAllowEmpty,
			projectId: CHECK.StringAllowEmpty,
			type: CHECK.StringAllowEmpty,
			tag1: CHECK.StringAllowEmpty,
			tag2: CHECK.StringAllowEmpty,
			tag3: CHECK.StringAllowEmpty,
			tag4: CHECK.StringAllowEmpty,
			tag5: CHECK.StringAllowEmpty,
			lastTime: CHECK.DateValue,
			uploaded: CHECK.BooleanValue,
			errorMsg: CHECK.StringAllowEmpty,
			uploadUrl: CHECK.StringAllowEmpty,
			files: CHECK.StringArrayAllowEmpty
		});
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return execList("updateOfflineRecord", successCallback, errorCallback, progressCallback, items);
		}
	};

	/**
	 *  根据fileId，更新离线文件
	 *  
	 *  @param {String} fileId 离线文件id
	 *  @param {String} saveId oss唯一标识
	 *  @param {String} mediaType 媒体类型
	 *  @param {String} orgId 组织id
	 *  @param {String} projectId 项目id
	 *  @param {String} type 类型
	 *  @param {String} tag1 标签1
	 *  @param {String} tag2 标签2
	 *  @param {String} tag3 标签3
	 *  @param {String} tag4 标签4
	 *  @param {String} tag5 标签5
	 *  @param {String} lastTime 最后修改时间
	 *  @param {String} uploaded 是否上传
	 *  @param {String} errorMsg 错误信息
	 *  @param {String} productType 根据saveId下载文件时使用，可以不传，默认为：appId/UNKNOWN，数据库中默认值存：""
	 *  @param {String} moduleName 默认值: cloudtplus/ios 或 cloudtplus/android，数据库中默认值存：""
	 *  @param {Boolean} isPublic // 是否公有文件，默认值：false
	 *  @param {Array} items 批量更新离线文件
	 */
	applicationExport.updateOfflineFile = function(successCallback, errorCallback, progressCallback, options) {
		options = options || {};
		var defaultOptions = {
			fileId: options.fileId,
			saveId: options.saveId,
			mediaType: options.mediaType,
			orgId: options.orgId,
			projectId: options.projectId,
			type: options.type,
			tag1: options.tag1,
			tag2: options.tag2,
			tag3: options.tag3,
			tag4: options.tag4,
			tag5: options.tag5,
			lastTime: options.lastTime,
			uploaded: options.uploaded,
			errorMsg: options.errorMsg,
			productType: options.productType,
			moduleName: options.moduleName,
			gcloudUploadUrl: options.gcloudUploadUrl,
			isPublic: options.isPublic
		};
		var items = getExecItems(options.items, defaultOptions);
		var err = checkOptions("updateOfflineFile", items, {
			fileId: CHECK.StringAllowEmpty,
			saveId: CHECK.StringAllowEmpty,
			mediaType: CHECK.EnumMediaType,
			orgId: CHECK.StringAllowEmpty,
			projectId: CHECK.StringAllowEmpty,
			type: CHECK.StringAllowEmpty,
			tag1: CHECK.StringAllowEmpty,
			tag2: CHECK.StringAllowEmpty,
			tag3: CHECK.StringAllowEmpty,
			tag4: CHECK.StringAllowEmpty,
			tag5: CHECK.StringAllowEmpty,
			lastTime: CHECK.DateValue,
			uploaded: CHECK.BooleanValue,
			errorMsg: CHECK.StringAllowEmpty,
			productType: CHECK.StringAllowEmpty,
			moduleName: CHECK.StringAllowEmpty,
			gcloudUploadUrl: CHECK.StringAllowEmpty,
			isPublic: CHECK.BooleanValue
		});
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return execList("updateOfflineFile", successCallback, errorCallback, progressCallback, items);
		}
	};

	/**
	 *  根据属性获取离线数据
	 *  
	 *  @param {String|Array} recordId 离线记录id
	 *  @param {String|Array} orgId 组织id
	 *  @param {String|Array} projectId 项目id
	 *  @param {String|Array} type 类型
	 *  @param {String|Array} tag1 标签1
	 *  @param {String|Array} tag2 标签2
	 *  @param {String|Array} tag3 标签3
	 *  @param {String|Array} tag4 标签4
	 *  @param {String|Array} tag5 标签5
	 *  @param {String|Array} uploaded 是否上传
	 */
	applicationExport.getOfflineRecord = function(successCallback, errorCallback, options) {
		options = options || {};
		var opts = {
			recordId: getFilterProperty(options.recordId),
			orgId: getFilterProperty(options.orgId),
			projectId: getFilterProperty(options.projectId),
			type: getFilterProperty(options.type),
			tag1: getFilterProperty(options.tag1),
			tag2: getFilterProperty(options.tag2),
			tag3: getFilterProperty(options.tag3),
			tag4: getFilterProperty(options.tag4),
			tag5: getFilterProperty(options.tag5),
			uploaded: options.uploaded,
			files: getFilterProperty(options.files)
		};
		opts = removeInvalidProperty(opts);
		var err = checkOptions("getOfflineRecord", opts, {
			recordId: CHECK.StringArrayFilter,
			orgId: CHECK.StringArrayFilter,
			projectId: CHECK.StringArrayFilter,
			type: CHECK.StringArrayFilter,
			tag1: CHECK.StringArrayFilter,
			tag2: CHECK.StringArrayFilter,
			tag3: CHECK.StringArrayFilter,
			tag4: CHECK.StringArrayFilter,
			tag5: CHECK.StringArrayFilter,
			uploaded: CHECK.BooleanValue,
			files: CHECK.StringArrayFilter
		});
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return exec((function(sCallback) {
				return function(data) {
					return sCallback.call(this, formatSuccessData(data));
				}
			})(successCallback || emptyFn), errorCallback, "Application", "getOfflineRecord", [opts]);
		}
	};

	/**
	 *  根据属性获取离线文件
	 *  
	 *  @param {String|Array} fileId 离线文件id
	 *  @param {String|Array} mediaType 媒体类型
	 *  @param {String|Array} saveId oss唯一标识
	 *  @param {String|Array} orgId 组织id
	 *  @param {String|Array} projectId 项目id
	 *  @param {String|Array} type 类型
	 *  @param {String|Array} tag1 标签1
	 *  @param {String|Array} tag2 标签2
	 *  @param {String|Array} tag3 标签3
	 *  @param {String|Array} tag4 标签4
	 *  @param {String|Array} tag5 标签5
	 *  @param {String|Array} uploaded 是否上传
	 */
	applicationExport.getOfflineFile = function(successCallback, errorCallback, options) {
		options = options || {};
		var opts = {
			fileId: getFilterProperty(options.fileId),
			mediaType: getFilterProperty(options.mediaType),
			saveId: getFilterProperty(options.saveId),
			orgId: getFilterProperty(options.orgId),
			projectId: getFilterProperty(options.projectId),
			type: getFilterProperty(options.type),
			tag1: getFilterProperty(options.tag1),
			tag2: getFilterProperty(options.tag2),
			tag3: getFilterProperty(options.tag3),
			tag4: getFilterProperty(options.tag4),
			tag5: getFilterProperty(options.tag5),
			uploaded: options.uploaded
		};
		opts = removeInvalidProperty(opts);
		var err = checkOptions("getOfflineFile", opts, {
			fileId: CHECK.StringArrayFilter,
			mediaType: CHECK.StringArrayFilter,
			saveId: CHECK.StringArrayFilter,
			orgId: CHECK.StringArrayFilter,
			projectId: CHECK.StringArrayFilter,
			type: CHECK.StringArrayFilter,
			tag1: CHECK.StringArrayFilter,
			tag2: CHECK.StringArrayFilter,
			tag3: CHECK.StringArrayFilter,
			tag4: CHECK.StringArrayFilter,
			tag5: CHECK.StringArrayFilter,
			uploaded: CHECK.BooleanValue
		});
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return exec((function(sCallback) {
				return function(data) {
					return sCallback.call(this, formatSuccessData(data));
				}
			})(successCallback || emptyFn), errorCallback, "Application", "getOfflineFile", [opts]);
		}
	};

	/**
	 *  根据recordId，上传离线记录及关联文件
	 *  
	 *  @param {String} recordId 离线记录id
	 *  @param {String} uploadUrl 上传地址
	 *  @param {String} productType 产品类型，默认值: appId/UNKNOWN
	 *  @param {String} moduleName 模块名称，目录，默认值: cloudtplus/ios 或 cloudtplus/android
	 *  @param {String} isPublic 是否公开，默认值: false
	 *  @param {Array} items 批量上传
	 */
	applicationExport.uploadOfflineRecord = function(successCallback, errorCallback, progressCallback, options) {
		options = options || {};
		var defaultOptions = {
			recordId: options.recordId || "",
			uploadUrl: options.uploadUrl || "",
			productType: options.productType || "",
			moduleName: options.moduleName || "",
			isPublic: options.isPublic || false
		};
		var items = getExecItems(options.items, defaultOptions);
		var err = checkOptions("uploadOfflineRecord", items, {
			recordId: CHECK.StringIsRequired,
			uploadUrl: CHECK.StringIsRequired,
			productType: CHECK.StringAllowEmpty,
			moduleName: CHECK.StringAllowEmpty,
			isPublic: CHECK.BooleanValue
		});
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return execList("uploadOfflineRecord", successCallback, errorCallback, progressCallback, items);
		}
	};

	/**
	 *  根据fileId，上传离线文件
	 *  
	 *  @param {String} fileId 离线文件id
	 *  @param {String} productType 产品类型，默认值: appId/UNKNOWN
	 *  @param {String} moduleName 模块名称，目录，默认值: cloudtplus/ios 或 cloudtplus/android
	 *  @param {String} isPublic 是否公开，默认值: false
	 *  @param {Array} items 批量上传
	 */
	applicationExport.uploadOfflineFile = function(successCallback, errorCallback, progressCallback, options) {
		options = options || {};
		var defaultOptions = {
			fileId: options.fileId || "",
			productType: options.productType || "",
			moduleName: options.moduleName || "",
			isPublic: options.isPublic || false
		};
		var items = getExecItems(options.items, defaultOptions);
		var err = checkOptions("uploadOfflineFile", items, {
			fileId: CHECK.StringIsRequired,
			productType: CHECK.StringAllowEmpty,
			moduleName: CHECK.StringAllowEmpty,
			isPublic: CHECK.BooleanValue
		});
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return execList("uploadOfflineFile", successCallback, errorCallback, progressCallback, items);
		}
	};

	/**
	 *  根据name更新离线字典，并记录版本号
	 *  
	 *  @param {String} name 名称
	 *  @param {String} version 版本号
	 *  @param {String} data 数据
	 */
	applicationExport.updateOfflineDict = function(successCallback, errorCallback, options) {
		options = options || {};
		var opts = {
			name: options.name || "",
			version: options.version || "",
			data: options.data || "",
			global: options.global || false
		};
		opts = removeInvalidProperty(opts);
		var err = checkOptions("updateOfflineDict", opts, {
			name: CHECK.StringIsRequired,
			version: CHECK.StringAllowEmpty,
			data: CHECK.StringAllowEmpty,
			global: CHECK.BooleanValue
		});
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return exec(successCallback, errorCallback, "Application", "updateOfflineDict", [opts]);
		}
	};

	/**
	 *  根据name删除离线字典
	 *  
	 *  @param {String} name 名称
	 */
	applicationExport.removeOfflineDict = function(successCallback, errorCallback, options) {
		options = options || {};
		var opts = {
			name: getFilterProperty(options.name),
			global: options.global || false
		};
		opts = removeInvalidProperty(opts);
		var err = checkOptions("removeOfflineDict", opts, {
			name: CHECK.StringArrayFilter,
			global: CHECK.BooleanValue
		});
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return exec(successCallback, errorCallback, "Application", "removeOfflineDict", [opts]);
		}
	};

	/**
	 *  根据name获取离线字典的版本号
	 *  
	 *  @param {String} name 名称
	 */
	applicationExport.getOfflineDictVersion = function(successCallback, errorCallback, options) {
		options = options || {};

        if(options.global!=undefined){
            errorCallback && errorCallback.call(this, "unsupported param");
            return
        }

		var opts = {
			name: options.name || ""
		};

		opts = removeInvalidProperty(opts);
		var err = checkOptions("getOfflineDictVersion", opts, {
			name: CHECK.StringIsRequired
		});
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return exec(successCallback, errorCallback, "Application", "getOfflineDictVersion", [opts]);
		}
	};

	/**
	 *  根据name获取离线字典
	 *  
	 *  @param {String} name 名称
	 */
	applicationExport.getOfflineDict = function(successCallback, errorCallback, options) {
		options = options || {};
		var opts = {
			name: options.name || "",
			global: options.global || false
		};
		opts = removeInvalidProperty(opts);
		var err = checkOptions("getOfflineDict", opts, {
			name: CHECK.StringIsRequired,
			global: CHECK.BooleanValue
		});
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return exec(successCallback, errorCallback, "Application", "getOfflineDict", [opts]);
		}
	};

   /**
	 *  异步请求数据
	 *
	 *  @param {String} url 请求地址
	 *  @param {String} data 提交数据
     *  @param (Object) headers 请求头
	 *  @param {String} type 请求类型 GET/POST/PUT/DELETE
	 */
	applicationExport.ajax = function(successCallback, errorCallback, options) {
		options = options || {};
		var opts = {
			url: options.url || "",
			data: options.data || {},
            headers: options.headers || {},
			type: options.type || "GET"
		};
		opts = removeInvalidProperty(opts);
		var err = checkOptions("ajax", opts, {
			url: CHECK.StringIsRequired,
			data: CHECK.ObjectValue,
            headers: CHECK.ObjectValue,
			type: CHECK.EnumAjaxType
		});
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			opts.url += (opts.url.indexOf("?") >= 0 ? "&" : "?") + "timestamp=" + (new Date()).valueOf();
			return exec(successCallback, errorCallback, "Application", "ajax", [opts]);
		}
	};
	/**
	 *  异步请求图像
	 *  
	 *  @param {String} url 名称
	 *  @param {Boolean} force 是否强制转换
	 */
	applicationExport.getDataUrl = function(successCallback, errorCallback, options) {
		options = options || {};
		var opts = {
			url: options.url || ""
		};
		opts = removeInvalidProperty(opts);
		if (!!window.cordova && window.cordova.platformId == "ios" && !options.force) {
			return successCallback.call(this, opts.url);	
		} else {
			return exec(successCallback, errorCallback, "Application", "getDataUrl", [opts]);
		}
	};

	/**
	 *  获取guid
	 *  
	 */
	applicationExport.getGuid = function(successCallback, errorCallback) {
		return exec(successCallback, errorCallback, "Application", "getGuid", []);
	};

	/**
	 *  获取上下文信息
	 *  
	 */
	applicationExport.getContextInfo = function(successCallback, errorCallback) {
		return exec(successCallback, errorCallback, "Application", "getContextInfo", []);
	};

	/**
	 *  检查当前会话状态
	 *  
	 */
	applicationExport.checkSession = function(successCallback, errorCallback, options) {
		options = options || {};
		var opts = {
			autoLogin: options.autoLogin || false
		};
		opts = removeInvalidProperty(opts);
		return exec(successCallback, errorCallback, "Application", "checkSession", [opts]);
	};


    /**
     *  获取网络状态
     *
     */
    applicationExport.getNetWorkType = function(successCallback, errorCallback, options) {
        options = options || {};
        return exec(successCallback, errorCallback, "Application", "getNetWorkType", [options]);
    };

	/**
	 *  根据url，浏览文件
	 *  
	 *  @param {String} title 标题
	 *  @param {String} mode 浏览模式 BROWSE/SELECT
	 *  @param {Boolean} allowDelete 允许删除 仅在BROWSE模式下起作用
	 *  @param {Boolean} allowExport 允许导出 仅在BROWSE模式下起作用
	 *  @param {Boolean} allowImport 允许导入 仅在BROWSE模式下起作用
	 *  @param {Number} maxCount 最大选择个数／默认0表示不限制选择个数
	 *  @param {Array} items 关联文件
	 *  @param {String} item.groupName 分组名称
	 *  @param {String} item.url 文件地址
	 *  @param {String} item.tag 标签
	 *  @param {String} item.tagColor 标签字体颜色／默认白色
	 *  @param {String} item.tagBackgroundColor 标签背景颜色／默认黑色／自动半透明
	 *  @param {String} item.description 详细描述
	 *  @param {Boolean} item.noSelect 允许选择／默认fasle
	 */
	applicationExport.fileBrowser = function(successCallback, errorCallback, deleteCallback, importCallback, options) {
		options = options || {};
		var getItems = function(items, indexList) {
			indexList = indexList || [];
			var r = [];
			for (var i = 0; i < indexList.length; i++) {
				var item = items[indexList[i]];
				if (item) {
					r.push(item);
				}
			}
			return r
		};
		var opts = {
			title: options.title || "相册",
			mode: options.mode || "BROWSE",
			allowDelete: !!options.allowDelete || options.mode === "BROWSE_DELETE",
			allowExport: !!options.allowExport,
			allowImport: !!options.allowImport,
			maxCount: options.maxCount || 0,
			items: options.items || []
		};
		var err = checkOptions("fileBrowser", opts, {
			title: CHECK.StringIsRequired,
			mode: CHECK.EnumFileBrowserMode,
			allowDelete: CHECK.BooleanValue,
			allowExport: CHECK.BooleanValue,
			allowImport: CHECK.BooleanValue,
			maxCount: CHECK.NumberCount,
			items: CHECK.ObjectArrayAllowEmpty
		});
		if (!err) {
			err = checkOptions("fileBrowser", opts.items, {
				groupName: CHECK.StringIsRequired,
				url: CHECK.StringIsRequired,
				tag: CHECK.StringAllowEmpty,
				tagColor: CHECK.StringAllowEmpty,
				tagBackgroundColor: CHECK.StringAllowEmpty,
				description: CHECK.StringAllowEmpty,
				noSelect: CHECK.BooleanValue
			});
		}
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return exec((function(me, success, del, imp, items, mode) {
				return function(value) {
					if (value == "#IMPORT#") {
						return imp.call(me);
					} else if (getType(value) == "Array") {
						if (mode == "SELECT") {
							return success.call(me, getItems(items, value));
						} else {
							return del.call(me, getItems(items, value));
						}
					} else {
						return success.call(me, value);
					}
				}
			})(this,
				successCallback || emptyFn,
				deleteCallback || emptyFn,
				importCallback || emptyFn,
				opts.items,
				opts.mode),
			errorCallback, "Application", "fileBrowser", [opts]);
		}
	};

	/**
	 *  刷新当前浏览文件内容
	 *  
	 *  @param {Array} items 刷新内容
	 *  @param {String} item.groupName 分组名称
	 *  @param {String} item.url 文件地址
	 *  @param {String} item.tag 标签
	 *  @param {String} item.tagColor 标签字体颜色／默认白色
	 *  @param {String} item.tagBackgroundColor 标签背景颜色／默认黑色／自动半透明
	 *  @param {String} item.description 详细描述
	 *  @param {Boolean} item.noSelect 允许选择／默认fasle
	 */
	applicationExport.fileBrowserRefresh = function(successCallback, errorCallback, options) {
		options = options || {};
		var opts = {
			items: options.items || []
		};
		var err = checkOptions("fileBrowserRefresh", opts, {
			items: CHECK.ObjectArrayAllowEmpty
		});
		if (!err) {
			err = checkOptions("fileBrowserRefresh", opts.items, {
				groupName: CHECK.StringIsRequired,
				url: CHECK.StringIsRequired,
				tag: CHECK.StringAllowEmpty,
				tagColor: CHECK.StringAllowEmpty,
				tagBackgroundColor: CHECK.StringAllowEmpty,
				description: CHECK.StringAllowEmpty,
				noSelect: CHECK.BooleanValue
			});
		}
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return exec(successCallback, errorCallback, "Application", "fileBrowserRefresh", [opts]);
		}
	};

	/**
	 *  浏览照片
	 *  
	 *  @param {Array} items 照片信息
	 *  @param {String} item.url 地址
	 *  @param {String} item.description 描述
	 *  @param {Number} startIndex 开始索引
	 */
	applicationExport.browsePicture = function(successCallback, errorCallback, options) {
		options = options || {};
		var opts = {
			items: options.items || [],
			startIndex: options.startIndex || 0
		};
		var err = checkOptions("browsePicture", opts, {
			items: CHECK.ObjectArrayAllowEmpty,
			startIndex: CHECK.NumberStartIndex
		});
		if (!err) {
			err = checkOptions("browsePicture", opts.items, {
				url: CHECK.StringIsRequired,
				description: CHECK.StringAllowEmpty
			});
		}
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else if (window.ImageBrowser && window.ImageBrowser.browseImages) {
			var urls = [], desc = [], smallImgs = [];
			for (var i = 0; i < opts.items.length; i++) {
				urls.push(opts.items[i].url);
				desc.push(opts.items[i].description);
				smallImgs.push(opts.items[i].thumbImage);
			}
			return window.ImageBrowser.browseImages(successCallback, errorCallback, {
				urls: urls,
				startIndex: opts.startIndex,
				allowDelete: false,
				description: desc,
				smallImgUrls: smallImgs
			});
		}
	};

	/**
	 *  浏览视频
	 *  
	 *  @param {String} title 标题
	 *  @param {String} url 文件地址
	 */
	applicationExport.browseVideo = function(successCallback, errorCallback, options) {
		options = options || {};
		var opts = {
			title: options.title || "",
			url: options.url || ""
		};
		var err = checkOptions("browseVideo", opts, {
			title: CHECK.StringAllowEmpty,
			url: CHECK.StringIsRequired
		});
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return exec(successCallback, errorCallback, "Application", "browseVideo", [opts]);
		}
	};

	/**
	 *  浏览音频
	 *  
	 *  @param {String} title 标题
	 *  @param {String} url 文件地址
	 */
	applicationExport.browseAudio = function(successCallback, errorCallback, options) {
		options = options || {};
		var opts = {
			title: options.title || "",
			url: options.url || ""
		};
		var err = checkOptions("browseAudio", opts, {
			title: CHECK.StringAllowEmpty,
			url: CHECK.StringIsRequired
		});
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return exec(successCallback, errorCallback, "Application", "browseAudio", [opts]);
		}
	};

	/**
	 *  根据saveId下载包，返回解压后的路径
	 *  
	 *  @param {String} saveId 文件服务器中的文件标识
	 *  @param {Boolean} force 是否强制下载
	 */
	applicationExport.downloadBundleBySaveId = function(successCallback, errorCallback, progressCallback, options) {
		options = options || {};
		var opts = {
			productType: options.productType || "",
			saveId: options.saveId || "",
			force: options.force || false
		};
		var err = checkOptions("downloadBundleBySaveId", opts, {
			productType: CHECK.StringIsRequired,
			saveId: CHECK.StringIsRequired,
			force: CHECK.BooleanValue
		});
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return exec((function(me, success, progress) {
				return function(value) {
					if (Object.prototype.toString.call(value) === "[object Number]") {
						return progress.call(me, value);
					} else {
						return success.call(me, value);
					}
				}
			})(this, successCallback || emptyFn, progressCallback || emptyFn), errorCallback, "Application", "downloadBundleBySaveId", [opts]);
		}
	};

	/**
	 *  根据saveId检查包是否存在
	 *  
	 *  @param {String|Array} saveId 文件服务器中的文件标识
	 */
	applicationExport.checkBundleBySaveId = function(successCallback, errorCallback, options) {
		options = options || {};
		var opts = {
			productType: options.productType || "",
			saveId: options.saveId || ""
		};
		var err = checkOptions("checkBundleBySaveId", opts, {
			productType: CHECK.StringIsRequired,
			saveId: CHECK.StringArrayKeys
		});
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			if (getType(opts.saveId) == "String") {
				opts.saveId = [opts.saveId];
			}
			return exec(successCallback, errorCallback, "Application", "checkBundleBySaveId", [opts]);
		}
	};

	/**
	 *  根据saveId删除离线包
	 *  
	 *  @param {String|Array} saveId 文件服务器中的文件标识
	 */
	applicationExport.removeBundleBySaveId = function(successCallback, errorCallback, options) {
		options = options || {};
		var opts = {
			productType: options.productType || "",
			saveId: options.saveId || ""
		};
		var err = checkOptions("removeBundleBySaveId", opts, {
			productType: CHECK.StringIsRequired,
			saveId: CHECK.StringArrayKeys
		});
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			if (getType(opts.saveId) == "String") {
				opts.saveId = [opts.saveId];
			}
			return exec(successCallback, errorCallback, "Application", "removeBundleBySaveId", [opts]);
		}
	};

	/**
	 *  删除所有离线包
	 *  
	 */
	applicationExport.removeBundleAll = function(successCallback, errorCallback, options) {
		options = options || {};
		var opts = {
			productType: options.productType || ""
		};
		var err = checkOptions("removeBundleAll", opts, {
			productType: CHECK.StringIsRequired
		});
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return exec(successCallback, errorCallback, "Application", "removeBundleAll", [options]);
		}
	};

	/**
	 *  根据saveId删除包
	 *  
	 *  @param {String} url 文件地址
	 */
	applicationExport.readFile = function(successCallback, errorCallback, options) {
		options = options || {};
		var opts = {
			url: options.url || ""
		};
		var err = checkOptions("readFile", opts, {
			url: CHECK.StringIsRequired
		});
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return exec(successCallback, errorCallback, "Application", "readFile", [opts]);
		}
	};

	/**
	 *  显示分享菜单
	 *  
	 *  @param {Array} platformTypes 分享平台类型，字符串数组，空数组表示分享到所有平台，平台包括："WechatSession"（微信聊天）, "WechatTimeLine"（微信朋友圈）, "WechatFavorite"（微信收藏）, "QQ"（QQ聊天页面）, "Qzone"（QQ空间）
	 *  @param {String} title 标题
	 *  @param {String} description 描述
	 *  @param {String} thumbUrl 缩略图，空字符串表示没有图标，"appIcon"（应用图标）, "applicationIcon"（数字项目平台图标）, "file:///", "https://"
	 *  @param {String} url 分享页面地址
	 */
	applicationExport.showShareMenu = function(successCallback, errorCallback, options) {
		options = options || {};
		var opts = {
			platformTypes: options.platformTypes || [],
			title: options.title || "",
			description: options.description || "",
			thumbUrl: options.thumbUrl || "",
			url: options.url || ""
		};
		var err = checkOptions("showShareMenu", opts, {
			platformTypes: CHECK.StringArrayAllowEmpty,
			title: CHECK.StringIsRequired,
			description: CHECK.StringIsRequired,
			thumbUrl: CHECK.StringAllowEmpty,
			url: CHECK.StringIsRequired
		});
		if (err) {
			errorCallback && errorCallback.call(this, err);
		} else {
			return exec(successCallback, errorCallback, "Application", "showShareMenu", [opts]);
		}
	};

    applicationExport.share = function(successCallback, errorCallback, options) {
        options = options || {};
        var opts = {
            platformType: options.platformType || "",
            title: options.title || "",
            description: options.description || "",
            thumbUrl: options.thumbUrl || "",
            url: options.url || ""
        };
        var err = checkOptions("share", opts, {
            platformType: CHECK.StringIsRequired,
            title: CHECK.StringIsRequired,
            description: CHECK.StringIsRequired,
            thumbUrl: CHECK.StringAllowEmpty,
            url: CHECK.StringIsRequired
        });
        if (err) {
            errorCallback && errorCallback.call(this, err);
        } else {
            return exec(successCallback, errorCallback, "Application", "share", [opts]);
        }
    };


	/**
     *  显示导航菜单
     */
    applicationExport.showMapNavi = function(successCallback, errorCallback, options) {
        options = options || {};
        var opts = {
            startName: options.startName || "",
            startLat: options.startLat || "",
            startLon: options.startLon || "",
            endName: options.endName || "",
            endLat: options.endLat || "",
            endLon: options.endLon || ""
        };
        var err = checkOptions("showMapNavi", opts, {
            startName: CHECK.StringAllowEmpty,
            startLat: CHECK.StringAllowEmpty,
            startLon: CHECK.StringAllowEmpty,
            endName: CHECK.StringAllowEmpty,
            endLat: CHECK.StringAllowEmpty,
            endLon: CHECK.StringAllowEmpty
        });
        if (err) {
            errorCallback && errorCallback.call(this, err);
        } else {
            return exec(successCallback, errorCallback, "Application", "showMapNavi", [opts]);
        }
    };

    /**
     * Vibrates the device for a given amount of time.
     */
    applicationExport.vibrate = function(successCallback, errorCallback, options) {
        options = options || {};
        var opts = {
            time: options.time ||0
        };
        var err = checkOptions("vibrate", opts, {
            time: CHECK.NumberCount
        });
        if (err) {
            errorCallback && errorCallback.call(this, err);
        } else {
            return exec(successCallback, errorCallback, "Application", "vibrate", [opts]);
        }
    };
    /**
     * Vibrates the device for a given amount of time.
     */
    applicationExport.copytoAlbum = function(successCallback, errorCallback, options) {
        options = options || {};
        var opts = {
            photoPath: options.photoPath ||0
        };
        var err = checkOptions("copytoAlbum", opts, {
            photoPath: CHECK.StringIsRequired
        });
        if (err) {
            errorCallback && errorCallback.call(this, err);
        } else {
            return exec(successCallback, errorCallback, "Application", "copytoAlbum", [opts]);
        }
    };

    applicationExport.currentLocation = function(successCallback, errorCallback, options) {
         options = options || {};
         return exec(successCallback, errorCallback, "Application", "currentLocation", [options]);
    };

    applicationExport.startGPS = function(successCallback, errorCallback, options) {
        options = options || {};
        return exec(successCallback, errorCallback, "Application", "startGPS", [options]);
    };



    applicationExport.initBluetooth = function(successCallback, errorCallback, options) {
        var opts = {
            type: options.type || ""
        };
        var err = checkOptions("initBluetooth", opts, {
            type: CHECK.StringAllowEmpty
        });
        if (err) {
            errorCallback && errorCallback.call(this, err);
        } else {
            return exec(successCallback, errorCallback, "Application", "initBluetooth", [opts]);
        }
    };

    applicationExport.blueWriteChara = function(successCallback, errorCallback, options) {
        options = options || {};
        return exec(successCallback, errorCallback, "Application", "blueWriteChara", [options]);
    };

    applicationExport.searchBluePrinter = function(successCallback, errorCallback, options) {
        options = options || {};
        return exec(successCallback, errorCallback, "Application", "searchBluePrinter", [options]);
    };


    /**
     *  打印过磅单
     *  @param {Number} projectName 项目名称
     *  @param {Number} oddNumber 单号
        @param {String} printNumber 打印次数
     *  @param {String} productionUnit 发料单位
     *  @param {String} carNumb 车牌号
     *  @param {String} storageRoom 库房
     *  @param {String} note 备注
     *  @param {Array} dataList 材料信息
     *  @param {String} acceptor 验收人
     *  @param {String} acceptTime 验收时间
     */
    applicationExport.bluetoothPrinter = function(successCallback, errorCallback,options) {
        options = options || {};
        var opts = {
            projectName: options.projectName,
            oddNumber: options.oddNumber,
            printNumber: options.printNumber,
            productionUnit: options.productionUnit,
            carNumb: options.carNumb,
            storageRoom: options.storageRoom,
            note: options.note,
            dataList: options.dataList,
            acceptor: options.acceptor,
            acceptTime: options.acceptTime
        };
        var err = checkOptions("bluetoothPrinter", opts, {
            projectName: CHECK.StringAllowEmpty,
            oddNumber: CHECK.StringAllowEmpty,
            printNumber: CHECK.StringAllowEmpty,
            productionUnit: CHECK.StringAllowEmpty,
            carNumb: CHECK.StringAllowEmpty,
            storageRoom: CHECK.StringAllowEmpty,
            note: CHECK.StringAllowEmpty,
            dataList: CHECK.ObjectArrayAllowEmpty,
            acceptor: CHECK.StringAllowEmpty,
            acceptTime: CHECK.StringAllowEmpty
        });
        if (err) {
            errorCallback && errorCallback.call(this, err);
        } else {
            return exec(successCallback, errorCallback, "Application", "bluetoothPrinter", [opts]);
        }
    };

    applicationExport.bluetoothPrinter2 = function(successCallback, errorCallback, options) {
        options = options || {};
        var err = checkOptions("bluetoothPrinter2", options, {
            printNumber: CHECK.NumberCount,
            items: CHECK.ObjectArrayAllowEmpty
        });
        if (!err) {
            err = checkOptions("bluetoothPrinter2", options.items, {
                type: CHECK.EnumPrintItemType,
                alignment: CHECK.EnumPrintItemAlignment,
                fontSize: CHECK.EnumPrintItemFontSize,
                param1: CHECK.StringAllowEmpty,
                param2: CHECK.StringAllowEmpty
            });
        }
        if (err) {
            errorCallback && errorCallback.call(this, err);
        } else {
            return exec(successCallback, errorCallback, "Application", "bluetoothPrinter2", [options]);
        }
    };


    applicationExport.getBlueData = function(successCallback, errorCallback, options) {
        options = options || {};
        var opts = {bleState: options.bleState ||""};
        return exec(successCallback, errorCallback, "Application", "getBlueData", [opts]);
    };

    applicationExport.connectBlueTooth = function(successCallback, errorCallback, options) {
        options = options || {};
        return exec(successCallback, errorCallback, "Application", "connectBlueTooth", [options]);
    };





    applicationExport.stopGPS = function(successCallback, errorCallback, options) {
            options = options || {};
            return exec(successCallback, errorCallback, "Application", "stopGPS", [options]);
    };

    applicationExport.searchGPSRecords = function(successCallback, errorCallback, options) {
            options = options || {};
            return exec(successCallback, errorCallback, "Application", "searchGPSRecords", [options]);
    };

    applicationExport.removeGPSRecords = function(successCallback, errorCallback, options) {
            options = options || {};
            return exec(successCallback, errorCallback, "Application", "removeGPSRecords", [options]);
    };

    applicationExport.locationPoint = function(successCallback, errorCallback, options) {
            options = options || {};
            return exec(successCallback, errorCallback, "Application", "locationPoint", [options]);
    };

    applicationExport.cameraLPR = function(successCallback, errorCallback, options) {
            options = options || {};
            return exec(successCallback, errorCallback, "Application", "cameraLPR", [options]);
    };

    applicationExport.countRebar = function(successCallback, errorCallback, options) {
            options = options || "";
            var opts;
            if(getType(options) != "Object"){
                opts = {
                  imageDataUrl: options|| "",
                  resourceVersion:4}
            }else{
                opts = {
                imageDataUrl: options.imageDataUrl|| "",
                resourceVersion:options.resourceVersion||4}
            }
            return exec(successCallback, errorCallback, "Application", "countRebar", [opts]);
    };

     applicationExport.countRebar2 = function(successCallback, errorCallback, options) {
        options = options || "";
        var opts;
        if(getType(options) != "Object"){
            opts = {
              user: options|| "",
              resourceVersion:4}
        }else{
            opts = {
            user: options.user|| "",
            resourceVersion:options.resourceVersion||4}
        }
        return exec(successCallback, errorCallback, "Application", "countRebar2", [opts]);
    };

     applicationExport.countThings = function(successCallback, errorCallback, options) {
        options = options || "";
        var opts = {
         user: options.user|| "",
         template: options.template||"",
         trackInfo:options.trackInfo|| {},
         noResult:options.noResult|| false,
         resourceVersion:options.resourceVersion||6};

         var err = checkOptions("countThings", opts, {
                                    user: CHECK.StringAllowEmpty,
                                    template: CHECK.EnumCountTemplate,
                                    trackInfo: CHECK.ObjectValue,
                                    noResult: CHECK.BooleanValue,
                                    resourceVersion:CHECK.NumberCount
                                });
         if (err) {
             errorCallback && errorCallback.call(this, err);
         } else {
             return exec(successCallback, errorCallback, "Application", "countThings", [opts]);
         }
    };



    applicationExport.applozic = function(successCallback, errorCallback, options) {
           options = options || "";
           var opts;
           opts = {
            action: options.action,
            user: options.user|| "",
            chatId: options.chatId|| ""}
           return exec(successCallback, errorCallback, "Application", "applozic", [opts]);
    };

    applicationExport.openBimfaceModel = function(successCallback, errorCallback, options) {
            options = options || {};
            return exec(successCallback, errorCallback, "Application", "openBimfaceModel", [options]);
    };
    /**
    * @method startIActiveMeeting
    * 启动视频会议
    *
    * Example:
    *
                 * 匿名入会
                    window.cloudtplus.startIActiveMeeting({
                                success: function(data) {
                                },
                                error: function(errMsg) {
                                },
                                type:1,
                                roomId:123234,
                                roompass :"password111",
                                username:"xiaoguang",
                            });
                   主持人入会

                            window.cloudtplus.startIActiveMeeting({
                                success: function(data) {
                                },
                                error: function(errMsg) {
                                },
                                type:0,
                                roomId:123234,
                                roompass :"passward111",
                                enterprisename:"glodon",
                                username:"xiaoguang",
                                userpass: "password111"
                            });
    *
    * @param {Object} args 参数对象
    * @return {Object} 返回cloudtplus对象
    */
    applicationExport.startIActiveMeeting=function(successCallback,errorCallback,options){
       return exec(successCallback, errorCallback, "Application", "startIActiveMeeting", [options]);
    };

   module.exports = applicationExport;
});