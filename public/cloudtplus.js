(function() {
	if (window.cloudtplus) {
		return;
	}

	var u = navigator.userAgent;
	var tag = document.getElementById("cloudtplus-script-tag");
	var platform = u.match(/Android/i) ? "android" : u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i) ? "ios" : "";

	if (tag && platform) {
		var onDeviceReady = function() {
			window.cloudtplus.isDeviceReady = true;
			if (window.cloudtplus.__DeviceReady) {
				window.cloudtplus.onDeviceReady(window.cloudtplus.__DeviceReady);
				delete window.cloudtplus.__DeviceReady;
			}
		};
		document.addEventListener("deviceready", onDeviceReady, false);
		document.write("<script type='text/javascript' src='" + tag.src.replace("cloudtplus.js", "cordova/" + platform + "/cordova.js") + "'><\/script>");
	}

	window.cloudtplus = {
		/**
		 * @property {String} version
		 * 版本号
		 */
		version: "1.8.4.8",

		/**
		 * @property {String} platform
		 * 平台名称，"android" 或 "ios" 或 ""
		 */
		platform: platform,

		/**
		 * @property {Boolean} isDeviceReady
		 * 设备是否准备就绪，只有准备就绪后，才可以执行与设备进行交互的相关方法
		 */
		isDeviceReady: false,

		/**
		 * @event onDeviceReady
		 * 当设备准备好后触发，如果设备已经准备好则直接执行
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.onDeviceReady(function() {
		 * 			// 从这里开始执行window.cloudtplus中的方法
		 * 		});
		 * 
		 * @param {Function} fn 回调函数
		 * @return {Object} 返回cloudtplus对象
		 */
		onDeviceReady: function(fn) {
			if (window.cloudtplus.isDeviceReady) {
				if (typeof fn == "function") {
					fn.apply(window);
				}
			} else {
				window.cloudtplus.__DeviceReady = fn || null;
			}
			return window.cloudtplus;
		},

		/**
		 * @event onDeviceNotification
		 * 接收设备通知
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.onDeviceNotification(function(type, data) {
		 * 			// type 为通知类型，包括：
		 * 			// 		"_DN_NOTIFICATION_REMOTE"		收到远程通知
		 * 			// 		"_DN_PAGE_BACKGROUND"			已经进入后台
		 * 			// 		"_DN_PAGE_FOREGROUND"			将要进入前台
		 * 			// 		"_DN_APP_ONLINE"				进入在线状态
		 * 			// 		"_DN_APP_OFFLINE"				进入离线状态
		 * 			// 		"_DN_AUTOUPLOAD_SUCCESS"		自动上传成功
		 * 			// 		"_DN_NOTIFICATION_RED_CHANGED"  推送消息小红点状态变化，有小红点，data为"red"m；没有小红点，data为未定义
		 * 			// data 为通知内容
		 * 		});
		 * 
		 * @param {Function} fn 回调函数
		 * @return {Object} 返回cloudtplus对象
		 */
		onDeviceNotification: function(fn) {
			window.Application.onDeviceNotification(fn);
			return window.cloudtplus;
		},

		/**
		 * @method updateTitlebar
		 * 更新标题栏
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.updateTitlebar({
		 * 			success: function() {},
		 * 			error: function() {},
		 * 			text: "",
		 * 			color: "",
		 * 			backgroundColor: ""
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		updateTitlebar: function(args) {
			args = args || {};
			window.Application.updateTitlebar(args.success, args.error, {
				backgroundColor: args.backgroundColor,
				leftButtonColor: args.color,
				textColor: args.color,
				text: args.text
			});
			return window.cloudtplus;
		},

		/**
		 * @method showScanButton
		 * 显示扫码按钮
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.showScanButton({
		 * 			success: function(data) {
		 * 				// data为扫码内容，字符串
		 * 			},
		 * 			error: function() {}
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		showScanButton: function(args) {
			args = args || {};
			window.Application.showScanButton(args.success, args.error);
			return window.cloudtplus;
		},
		
		/**
		 * @method hideScanButton
		 * 隐藏扫码按钮
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.hideScanButton({
		 * 			success: function() {},
		 * 			error: function() {}
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		hideScanButton: function(args) {
			args = args || {};
			window.Application.hideScanButton(args.success, args.error);
			return window.cloudtplus;
		},

		/**
		 * @method showNetworkActivityIndicator
		 * 显示状态栏菊花 (仅支持iOS)
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.showNetworkActivityIndicator({
		 * 			success: function() {},
		 * 			error: function() {}
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		showNetworkActivityIndicator: function(args) {
			args = args || {};
			window.Application.showNetworkActivityIndicator(args.success, args.error);
			return window.cloudtplus;
		},

		/**
		 * @method hideNetworkActivityIndicator
		 * 隐藏状态栏菊花 (仅支持iOS)
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.hideNetworkActivityIndicator({
		 * 			success: function() {},
		 * 			error: function() {}
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		hideNetworkActivityIndicator: function(args) {
			args = args || {};
			window.Application.hideNetworkActivityIndicator(args.success, args.error);
			return window.cloudtplus;
		},

		/**
		 * @method showLeftSideMenu
		 * 显示左边栏菜单（等同于从壳的标题栏上点击【菜单】按钮）
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.showLeftSideMenu({
		 * 			success: function() {},
		 * 			error: function() {}
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		showLeftSideMenu: function(args) {
			args = args || {};
			window.Application.showLeftSideMenu(args.success, args.error);
			return window.cloudtplus;
		},

		/**
		 * @method showNotifyView
		 * 显示推送消息视图（等同于从壳的标题栏上点击【消息】按钮）
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.showNotifyView({
		 * 			success: function() {},
		 * 			error: function() {}
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		showNotifyView: function(args) {
			args = args || {};
			window.Application.showNotifyView(args.success, args.error);
			return window.cloudtplus;
		},

		/**
		 * @method showChatInputView
		 * 显示聊天输入框
		 * 
		 * Example:
		 * 
		 * 	    window.cloudtplus.showChatInputView({
		 * 		success: function(data) {
	         *              // 当用户输入文字、图片或语音时，会多次调用该回调函数
	         *              // 输入文字的回调参数为{"action": "enteredText", "data": "输入的文字"}
	         *              // 输入图片或视频的回调参数为{"action": "enteredImage", "data": [本地文件路径]}，视频的文件路径的后缀名为.mp4
	         *              // 输入语音的回调参数为{"action": "enteredVoice", "data": [本地文件路径]}
         	 *          },
		 * 			error: function() {},
	         *          maxCount: 1,            // 最大照片数，默认值：1
	         *          allowVideo: false       // 允许录制短视频，默认值: false
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		showChatInputView: function(args) {
			args = args || {};
	            	window.Application.showChatInputView(args.success, args.error, {
		                maxCount: args.maxCount || 1,
		                allowVideo: args.allowVideo || false
		            });
			return window.cloudtplus;
		},

		/**
		 * @method hideChatInputView
		 * 隐藏聊天输入框
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.hideChatInputView({
		 * 			success: function() {},
		 * 			error: function() {}
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		hideChatInputView: function(args) {
			args = args || {};
			window.Application.hideChatInputView(args.success, args.error);
			return window.cloudtplus;
		},

        /**
         * @method downloadFile
         * 下载文件
         * Example:
         *         window.cloudtplus.downloadFile({
         *             success: function(data) {
         *                 // 下载完成后，回调参数为对象
         *                 {
         *                     fileUrl: "",           // 下载得到的本地文件地址
         *                     fileLength: number,    // 文件大小
         *                     suggestedFilename: ""  // 文件在服务端的名字，可能为空，如果文件之前已经下载过，则该值必然为空
         *                 }
         *             },
         *             error: function(data) {
         *                 // 失败后回调，回调参数为字符串，字符串内容为错误原因
         *             },
         *             progress: function(value) {
         *                 // 进度回调，参数内容为0-1之间的小数
         *             },
         *             url: "",           // 字符串，要下载的文件的网址
         *             cacheKey: "",      // 字符串，缓存的唯一标识，可为空；如果为空，则直接使用url作为唯一标识
         *             headers: {}        // 请求头，可为空
         *         });
         *
         * @param {Object} args 参数对象
         * @return {Object} 返回cloudtplus对象
         */
        downloadFile: function(args) {
            args = args || {};
            window.Application.downloadFile(args.success, args.error, args.progress, {
                    url: args.url,
                    cacheKey: args.cacheKey,
                    headers: args.headers
                });
            return window.cloudtplus;
        },

        /**
         * @method removeDownloadedFiles
         * 批量删除已下载的文件
         * Example:
         *         window.cloudtplus.removeDownloadedFiles({
         *             success: function() {},
         *             error: function() {},
         *             urls: []            // 字符串数组，要删除的文件的网址
         *         });
         *
         * @param {Object} args 参数对象
         * @return {Object} 返回cloudtplus对象
         */
        removeDownloadedFiles: function(args) {
            args = args || {};
            window.Application.removeDownloadedFiles(args.success, args.error, {
                    urls: args.urls
                });
            return window.cloudtplus;
        },

        /**
         * @method isFilesDownloaded
         * 批量判断文件是否已经下载，返回其中已下载的文件的url列表
         * Example:
         *         window.cloudtplus.isFilesDownloaded({
         *             success: function(data) {
         *                 // 回调参数为Object，key为文件远程url，value为文件在本地存储的路径，如果文件还没有下载，则value为null
         *                 {
         *                     url: filePath,
         *                 }
         *             },
         *             error: function() {},
         *             urls: []           // 字符串数组，要判断的文件的网址
         *         });
         *
         * @param {Object} args 参数对象
         * @return {Object} 返回cloudtplus对象
         */
        isFilesDownloaded: function(args) {
            args = args || {};
            window.Application.isFilesDownloaded(args.success, args.error, {
                    urls: args.urls
                });
            return window.cloudtplus;
        },

        /**
         * @method markOnBlueprint
         * 质量安全问题，在图纸中添加（或修改）质量安全标记
         * Example:
         *         window.cloudtplus.markOnBlueprint({
         *             success: function() {},
         *             error: function() {},
         *             category: "",           // 质量/安全分类: quality/security，用于确定标记的形状
         *             mode: "",               // 模式：new-新建标记，view-查看标记，move-移动标记
         *             blueprint: {            // 图纸
         *                id: "",              //  --图纸ID
         *                name: "",            //  --图纸名
         *                downloadUrl: "",     //  --下载地址
         *             },
         *             marker: {               // 需要查看或修改的标记，如果mode为new，则该参数应该为null
         *                positionX: "",       //  --相对的X坐标，浮点数，取值范围[0～1]
         *                positionY: "",       //  --相对的Y坐标，浮点数，取值范围[0～1]
         *                status: "",          //  --质量安全问题状态，用于确定标记的线条样式或颜色
         *             }
         *         });
         *
         * @param {Object} args 参数对象
         * @return {Object} 返回cloudtplus对象
         */
        markOnBlueprint: function(args) {
            args = args || {};
            window.Application.markOnBlueprint(args.success, args.error, {
                    category: args.category,
                    mode: args.mode,
                    blueprint: args.blueprint,
                    marker: args.marker
                });
            return window.cloudtplus;
        },

        /**
         * @method markOnBlueprint2
         * 质量安全问题，在图纸中添加（或修改）质量安全标记
         * Example:
         *         window.cloudtplus.markOnBlueprint2({
         *             success: function() {},
         *             error: function() {},
         *             category: "",           // 质量/安全分类: quality/security，用于确定标记的形状
         *             mode: "",               // 模式：new-新建标记，view-查看标记，move-移动标记
         *             blueprint: {            // 图纸
         *                id: "",              //  --图纸ID
         *                name: "",            //  --图纸名
         *                downloadUrl: "",     //  --下载地址
         *                isDeleteToken,       // 是否请求j添加token
         *             },
         *             markers: [{             // 需要查看或修改的标记，如果mode为new，则该参数应该为null
         *                positionX: "",       //  --相对的X坐标，浮点数，取值范围[0～1]
         *                positionY: "",       //  --相对的Y坐标，浮点数，取值范围[0～1]
         *                status: "",          //  --质量安全问题状态，用于确定标记的线条样式或颜色
         *             }]
         *         });
         *
         * @param {Object} args 参数对象
         * @return {Object} 返回cloudtplus对象
         */
        markOnBlueprint2: function(args) {
            args = args || {};
            window.Application.markOnBlueprint2(args.success, args.error, {
                category: args.category,
                mode: args.mode,
                blueprint: args.blueprint,
                markers: args.markers
            });
            return window.cloudtplus;
        },

        /**
         * @method createQSProblem
         * BIM5D，新建质量安全问题时，选择图纸并在图纸中标记，添加问题照片
         * Example:
         *         window.cloudtplus.createQSProblem({
         *             success: function(data) {
         *               回调参数 data：{
         *                 blueprintId: "1234",         // 图纸ID
         *                 positionX: 0.1,              // X轴位置
         *                 positionY: 0.1,              // Y轴位置
         *                 attachments: ["file://..."]  // 照片文件地址
         *               }
         *             },
         *             error: function() {},
         *             category: "",        // 质量/安全分类: quality/security，用于确定标记的形状
         *             blueprints: [     	// 图纸列表
         *               {
         *                  id: "",            // 树节点ID，如果downloadUrl不为空，则同时也是图纸ID
         *                  pid: "",           // 树节点父ID
         *                  name: "",          // 树节点名字
         *                  downloadUrl: "",   // 图纸下载地址，可能为空，为空表示该节点只是一个分类，不包含图纸
         *                  orderNo: number    // 顺序号
         *               }
         *             ]
         *         });
         *
         * @param {Object} args 参数对象
         * @return {Object} 返回cloudtplus对象
         */
        createQSProblem: function(args) {
            args = args || {};
            window.Application.createQSProblem(args.success, args.error, {
                    category: args.category,
                    blueprints: args.blueprints
                });
            return window.cloudtplus;
        },

        /**
         * @method startMonitorBeacon
         * 开始蓝牙扫描
         * Example:
         *         window.cloudtplus.startMonitorBeacon({
         *             success: function(str) {
         *                 // 开启成功的回调，如果没有权限也会开启成功，但随后会在error回调中返回错误
         *             },
         *             error: function(str) {
         *                 // 失败回调，包括开启失败、没有蓝牙定位的权限、调用者主动调用stopMonitorBeacon结束扫描三种情况
         *             },
         *             result: function(array) {
         *                 // 扫描结果
         *             },
         *             radius: number     // 扫描半径
         *         });
         *
         * @param {Object} args 参数对象
         * @return {Object} 返回cloudtplus对象
         */
        startMonitorBeacon: function(args) {
            args = args || {};
            window.Application.startMonitorBeacon(args.success, args.error, args.result, {radius: args.radius});
            return window.cloudtplus;
        },

        /**
         * @method stopMonitorBeacon
         * 结束蓝牙扫描
         * Example:
         *         window.cloudtplus.stopMonitorBeacon({
         *             success: function(str) {
         *                 // 结束成功的回调
         *             },
         *             error: function(str) {
         *                 // 失败回调
         *             }
         *         });
         *
         * @param {Object} args 参数对象
         * @return {Object} 返回cloudtplus对象
         */
        stopMonitorBeacon: function(args) {
            args = args || {};
            window.Application.stopMonitorBeacon(args.success, args.error);
            return window.cloudtplus;
        },
        
		/**
		 * @method showHikvision
		 * 打开海康监控
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.showHikvision({
		 * 			success: function() {},
		 * 			error: function() {},
		 * 			deviceName: "",		// 设备名称
		 * 			deviceIP: "",		// 设备地址
		 * 			devicePort: "",		// 设备端口
		 * 			userName: "",		// 帐号
		 * 			password: "",		// 密码
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		showHikvision: function(args) {
			args = args || {};
			window.Application.showHikvision(args.success, args.error, {
				deviceName: args.deviceName,
				deviceIP: args.deviceIP,
				devicePort: args.devicePort,
				userName: args.userName,
				password: args.password
			});
			return window.cloudtplus;
		},

		/**
		 * @method showHikvision8700
		 * 打开海康监控
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.showHikvision8700({
		 * 			success: function() {},
		 * 			error: function() {},
		 * 			deviceIP: "",		// 设备地址
		 * 			devicePort: "",		// 设备端口
		 * 			userName: "",		// 帐号
		 * 			password: "",		// 密码
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		showHikvision8700: function(args) {
			args = args || {};
			window.Application.showHikvision8700(args.success, args.error, {
				deviceIP: args.deviceIP,
				devicePort: args.devicePort,
				userName: args.userName,
				password: args.password
			});
			return window.cloudtplus;
		},
                                                             
		/**
		 * @method showDHVideo
		 * 打开大华视频监控
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.showDHVideo({
		 * 			success: function() {},
		 * 			error: function() {},
		 * 			deviceIP: "",		// 设备地址
		 * 			devicePort: "",		// 设备端口
		 * 			userName: "",		// 帐号
		 * 			password: "",		// 密码
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		showDHVideo: function(args) {
			args = args || {};
			window.Application.showDHVideo(args.success, args.error, {
				deviceIP: args.deviceIP,
				devicePort: args.devicePort,
				userName: args.userName,
				password: args.password
			});
			return window.cloudtplus;
		},
                                                             
                                                   
         /**
          * @method showYSYLiveVideo
          * 打开萤石云视频
          *
          * Example:
          *
          *         window.cloudtplus.showYSYLiveVideo({
          *             success: function() {},
          *             error: function() {},
          *            host:"",             //云台控制的host路径
          *            zlToken:"",          //云台控制的token
          *            projectId:""  ,        ///项目ID
          *            appkey: ""              //appkey
          *            accessToken: "",        //访问token
          *            rooms:[{
          *                           deviceId:""   ,        ///设备id
          *                           deviceName :"" ,       ///设备名字
          *                           deviceSerial: "",      ///通道
          *                           channelNo: number,      ///频道
          *                           validateCode: "",       ///通道验证码
          *                           controllable: true,     ///是否支持云台控制
          *                     }],
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
        showYSYLiveVideo:function(args){
            args = args || {};
            window.Application.showYSYLiveVideo(args.success, args.error, {
                                                host:args.host,
                                                zlToken:args.zlToken,
                                                appkey: args.appkey,
                                                accessToken: args.accessToken,
                                                projectId:args.projectId,
                                                rooms:args.rooms,
                                                specialDevice:args.specialDevice
                });
             return window.cloudtplus;
        },

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
        *                           stringType:0,        ///视频播放源  0 代表ysy  1代表ijk
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
        *                         stringType:1,        ///视频播放源  0 代表ysy 
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
         showBlendLiveVideo:function(args){
                 args = args || {};
                 window.Application.showBlendLiveVideo(args.success, args.error, {
                                              host:args.host,
                                              zlToken:args.zlToken,
                                              appkey: args.appkey,
                                              accessToken: args.accessToken,
                                              projectId:args.projectId,
                                              devices:args.devices,
                                              specialDevice:args.specialDevice
                                              });
                return window.cloudtplus;
         },
         
         /**
          * @method showIJKPlayerVideo
          * 打开ijk视频
          *
          * Example:
          *
          *        window.cloudtplus.showIJKPlayerVideo({
          *                success: function() {},
          *                error: function(errMsg) {},
          *                host:"https://zl-test.glodon.com:38001",
          *                productCode: "gvs",
          *                accessToken: "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbG9kb24uZmVpIiwiYXVkIjoidGFibGV0IiwidGVuYW50aWQiOiJiMGQ5YWRkZC00MjIxLTRhN2UtYTQ5Zi00NjE1ODkxZDUzM2YiLCJzY29wZXMiOlsiUk9MRV9BRE1JTiJdLCJwcm9qZWN0aWQiOiJmODgzZjYxOS1iOGFiLTQ1ZGQtYWVmNy1lMTc5NDUyNmM0OTMiLCJpYXQiOjE1NTA1NjQ3NzJ9.Nd_RkJOtsthfEzev6olLDZeZR2Lc0Jb7AumW14JhdGJ8D3Ddq6HL4qo-RoaxFjCs9nLTDnp772q0TRdY4Lxifw",        //访问token
          *                projectId: 218107571651072,
          *                devices:[
          *                        {
          *                        "streamType":"RTMP",
          *                        "deviceId" : "0fa2f8bd-27e8-4a48-b964-a9a241034a19",
          *                        "deviceName" : "大厅RTMP",
          *                        },
          *                ],
          *                specialDevice:[
          *                        {
          *                        "streamType":"RTMP",
          *                        "deviceId" : "0fa2f8bd-27e8-4a48-b964-a9a241034a19",
          *                        "deviceName" : "大厅RTMP",
          *                        },
          *                ],
          *
          *    });
          *
          * @param {Object} args 参数对象
          * @return {Object} 返回cloudtplus对象
          */
         showIJKPlayerVideo:function(args){
             args = args || {};
             window.Application.showIJKPlayerVideo(args.success, args.error, {
                                             host:args.host,
                                             productCode: args.productCode,
                                             accessToken: args.accessToken,
                                             projectId:args.projectId,
                                             devices:args.devices,
                                             specialDevice:args.specialDevice
                                             });
            return window.cloudtplus;
         },
         /**
          * @method startRtmp
          * 调用推流接口
          *
          * Example:
          * window.cloudtplus.startRtmp({
          *       success: function(data) {
          *       },
          *       error: function(errMsg) {
          *       },
          *       url:"rtmp://glodn.com"
          *       resolution:"720p",          //分辨率 1标清 2高清 默认2
          *       cameraFacing:0,          //0后置 1前置  默认为0
          *       videoFPS :20,            //帧率默认20
          *       orientation:2,           //1竖屏  2横屏  默认为2
          *       definition:1,            //清晰度  1流畅 2清晰 默认1
          *       audioEnabled:true        //true 有声音 false无声音 默认为true
          *    });
          * @param {Object} args 参数对象
          * @return {Object} 返回cloudtplus对象
          */
         startRtmp:function(args){
         args = args || {};
         window.Application.startRtmp(args.success, args.error, {
                                      resolution:args.resolution,
                                      cameraFacing:args.cameraFacing,
                                      videoFPS:args.videoFPS,
                                      orientation:args.orientation,
                                      definition:args.definition,
                                      audioEnabled:args.audioEnabled,
                                      url:args.url
                                      });
         return window.cloudtplus;
         },

        /**
         * @method startIActiveMeeting
         * 开启会议
         *
         * Example:
         * window.cloudtplus.startIActiveMeeting({
         *       success: function(data) {
         *       },
         *       error: function(errMsg) {
         *       },
         *    type:1,            // 1 是匿名会议  0 是主持人会议
         *    roomId:123234,
         *    roompass :"passward111",
         *    enterprisename:"glodon",
         *    username:"xiaoguang",
         *    userpass: "password111"
         *    });
         * @param {Object} args 参数对象
         * @return {Object} 返回cloudtplus对象
         */
         startIActiveMeeting:function(args){
             args = args || {};
             window.Application.startIActiveMeeting(args.success, args.error, {
             type:args.type,
             roomId: args.roomId,
             roompass: args.roompass,
             enterprisename:args.enterprisename,
             username:args.username,
             userpass:args.userpass
             });
             return window.cloudtplus;
         },
       /**
         * @method startRtmp
         * 调用推流接口
         *
         * Example:
         * window.cloudtplus.startRtmp({
         *       success: function(data) {
         *       },
         *       error: function(errMsg) {
         *       },
         *       url:"asdfsafa",          //推流地址
         *       resolution:2,            //分辨率 1标清 2高清
         *       cameraFacing:0,          //0后置 1前置  默认为0
         *       videoFPS :20,            //帧率默认20
         *       orientation:2,           //1竖屏  2横屏  默认为2
         *       definition:1,            //清晰度  1流畅 2清晰 默认1
         *       audioEnabled:true        //true 有声音 false无声音 默认为true
         *    });
         * @param {Object} args 参数对象
         * @return {Object} 返回cloudtplus对象
         */
         startRtmp:function(args){
              args = args || {};
              window.Application.startRtmp(args.success, args.error, {
              url:args.url,
              resolution:args.resolution,
              cameraFacing:args.cameraFacing,
              videoFPS:args.videoFPS,
              orientation:args.orientation,
              definition:args.definition,
              audioEnabled:args.audioEnabled
              });
              return window.cloudtplus;
          },

		/**
		 * @method reload
		 * 重现加载
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.reload({
		 * 			success: function() {},
		 * 			error: function() {}
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		reload: function(args) {
			args = args || {};
			window.Application.reload(args.success, args.error);
			return window.cloudtplus;
		},

		/**
		 * @method reloadOfflineApp
		 * 重现加载离线应用
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.reload({
		 * 			success: function() {},
		 * 			error: function() {}
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		reloadOfflineApp: function(args) {
			args = args || {};
			window.Application.reloadOfflineApp(args.success, args.error, args.progress);
			return window.cloudtplus;
		},

		/**
		 * @method exitApp
		 * 退出页面
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.exitApp({
		 * 			success: function() {},
		 * 			error: function(errMsg) {},
         	 *            		data: null        // 想要返回给调用者的数据，类型可以是字符串，对象，或数组，也可以为空
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		exitApp: function(args) {
			args = args || {};
			window.Application.exitApp(args.success, args.error, args.data);
			return window.cloudtplus;
		},

		/**
		 * @method getOfflinePicture
		 * 获取离线照片
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.getOfflinePicture({
		 * 			success: function(data) {
		 * 				// data: [{fileUrl:"", fileId:"", ..., errorMsg: ""}]
		 * 			},
		 * 			error: function(errMsg) {},
		 *			orgId: "",
		 * 			projectId: "",
		 * 			type: "",
		 * 			tag1: "",
		 * 			tag2: "",
		 * 			tag3: "",
		 * 			tag4: "",
		 * 			tag5: "",
		 * 			productType: "",
		 * 			moduleName: "",
		 * 			isPublic: false,
		 * 			sourceType: "CAMERA",	// 照片来源：CAMERA／PHOTOLIBRARY
		 * 			maxCount: 0,			// 最大照片数
		 * 			allowVideo: false,		// 允许录制短视频，默认值: false
         	 *          hideAlbumBtn,           // 当sourceType是CAMERA时，是否在拍照界面隐藏从相册选择按钮，默认值：false
		 * 	    maxDuration: 8000,		// 限制录制时长，毫秒，默认8秒
         	 *          quality: 60,            // 图像质量:60~100
		 * 	    watermark: "",          // 照片的水印文字
         	 *          waterColor: "#FFFFFF",  // 水印文字颜色，默认为白色
         	 *          cropRate: 0,            // 照片剪裁框宽高比，默认为0，表示不剪裁；值为1则剪裁框为正方形，值越大则剪裁框越扁平
         	 *          freeStyleCropEnabled:0,   // 当cropRate不为0时，用于控制裁剪筐是否支持拖动 默认为0 不支持 1支持
         	 *          photoCategory: [],      // 照片类别选择数组
		 * 			alwaysSave: false		// 总是保存(拍照时，点击取消也保存)，默认值: false
         	 *          isContinue:false  // 是否拍照完毕并继续拍照.  默认值false
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		getOfflinePicture: function(args) {
			args = args || {};
			window.Application.getOfflinePicture(args.success, args.error, {
				orgId: args.orgId,
				projectId: args.projectId,
				type: args.type,
				tag1: args.tag1,
				tag2: args.tag2,
				tag3: args.tag3,
				tag4: args.tag4,
				tag5: args.tag5,
				productType: args.productType,
				moduleName: args.moduleName,
				isPublic: args.isPublic,
				sourceType: args.sourceType,
				maxCount: args.maxCount || args.maxBurstCount,	// 废弃maxBurstCount
				allowVideo: args.allowVideo,
		                hideAlbumBtn: args.hideAlbumBtn,
				maxDuration: args.maxDuration,
		                quality: args.quality,
		                cropRate: args.cropRate,
		                freeStyleCropEnabled: args.freeStyleCropEnabled,
				alwaysSave: args.alwaysSave,
				isTemp: args.isTemp,
		                isContinue: args.isContinue,
				watermark: args.watermark,
		                waterColor: args.waterColor,
				photoCategory: args.photoCategory
			});
			return window.cloudtplus;
			
		},

        /** 编辑图片
         * @method editPicture
         * Example:
         *
         *         window.cloudtplus.editPicture({
         *             success: function(data) {
         *                 // 返回编辑好的图片路径
         *             },
         *             error: function(errMsg) {
         *                 // 错误信息
         *             },
         *             fileUrl: "file:///path.jpg",  // 源文件路径
         *             type: "crop"                          // 编辑类型 crop 剪裁  edit 编辑
         *         });
         *
         * @param {Object} args 参数对象
         * @return {Object} 返回cloudtplus对象
         */
        editPicture: function(args) {
            args = args || {};
            window.Application.editPicture(args.success, args.error, {
                fileUrl: args.fileUrl,
                type: args.type
            });
            return window.cloudtplus;
        },

		/**
		 * @method getOfflineVideo
		 * 获取离线视频
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.getOfflineVideo({
		 * 			success: function(data) {
		 * 				// data: [{fileUrl:"", fileId:"", ..., errorMsg: ""}]
		 * 			},
		 * 			error: function(errMsg) {},
		 *			orgId: "",
		 * 			projectId: "",
		 * 			type: "",
		 * 			tag1: "",
		 * 			tag2: "",
		 * 			tag3: "",
		 * 			tag4: "",
		 * 			tag5: "",
		 * 			productType: "",
		 * 			moduleName: "",
		 * 			isPublic: false,
		 * 			shootMode: "",		// 录制模式，TAP/TAP_HOLD
		 * 			maxDuration: 8000	// 限制录制时长，毫秒，默认8秒
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		getOfflineVideo: function(args) {
			args = args || {};
			window.Application.getOfflineVideo(args.success, args.error, {
				orgId: args.orgId,
				projectId: args.projectId,
				type: args.type,
				tag1: args.tag1,
				tag2: args.tag2,
				tag3: args.tag3,
				tag4: args.tag4,
				tag5: args.tag5,
				productType: args.productType,
				moduleName: args.moduleName,
				isPublic: args.isPublic,
				shootMode: args.shootMode,
				maxDuration: args.maxDuration
			});
			return window.cloudtplus;
		},

		/**
		 * @method getOfflineAudio
		 * 获取离线音频
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.getOfflineAudio({
		 * 			success: function(data) {
		 * 				// data: [{fileUrl:"", fileId:"", ..., errorMsg: ""}]
		 * 			},
		 * 			error: function(errMsg) {},
		 *			orgId: "",
		 * 			projectId: "",
		 * 			type: "",
		 * 			tag1: "",
		 * 			tag2: "",
		 * 			tag3: "",
		 * 			tag4: "",
		 * 			tag5: "",
		 * 			productType: "",
		 * 			moduleName: "",
		 * 			isPublic: false,
		 * 			shootMode: "",		// 录制模式，TAP/TAP_HOLD
		 * 			maxDuration: 8000	// 限制录制时长，毫秒，默认8秒
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		getOfflineAudio: function(args) {
			args = args || {};
			window.Application.getOfflineAudio(args.success, args.error, {
				orgId: args.orgId,
				projectId: args.projectId,
				type: args.type,
				tag1: args.tag1,
				tag2: args.tag2,
				tag3: args.tag3,
				tag4: args.tag4,
				tag5: args.tag5,
				productType: args.productType,
				moduleName: args.moduleName,
				isPublic: args.isPublic,
				shootMode: args.shootMode,
				maxDuration: args.maxDuration
			});
			return window.cloudtplus;
		},

		/**
		 * @method removeOfflineRecord
		 * 根据属性删除离线记录
		 * 不允许全部删除
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.removeOfflineRecord({
		 * 			success: function(recordIds) {
		 * 				// 删除成功 recordIds: ["", ""]
		 * 			},
		 * 			error: function(errMsg) {},
		 * 			recordId: "", // ["", ""]
		 * 			orgId: "", // ["", ""]
		 * 			projectId: "", // ["", ""]
		 * 			type: "", // ["", ""]
		 * 			tag1: "", // ["", ""]
		 * 			tag2: "", // ["", ""]
		 * 			tag3: "", // ["", ""]
		 * 			tag4: "", // ["", ""]
		 * 			tag5: "", // ["", ""]
		 * 			uploaded: undefined
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		removeOfflineRecord: function(args) {
			args = args || {};
			window.Application.removeOfflineRecord(args.success, args.error, {
				recordId: args.recordId,
				orgId: args.orgId,
				projectId: args.projectId,
				type: args.type,
				tag1: args.tag1,
				tag2: args.tag2,
				tag3: args.tag3,
				tag4: args.tag4,
				tag5: args.tag5,
				uploaded: args.uploaded
			});
			return window.cloudtplus;
		},

		/**
		 * @method removeOfflineFile
		 * 根据属性删除离线文件
		 * 不允许全部删除
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.removeOfflineFile({
		 * 			success: function(fileIds) {
		 * 				// 删除成功 fileIds: ["", ""]
		 * 			},
		 * 			error: function(errMsg) {},
		 * 			fileId: "", // ["", ""]
		 * 			mediaType: "", // ["", ""]
		 * 			saveId: "", // ["", ""]
		 * 			orgId: "", // ["", ""]
		 * 			projectId: "", // ["", ""]
		 * 			type: "", // ["", ""]
		 * 			tag1: "", // ["", ""]
		 * 			tag2: "", // ["", ""]
		 * 			tag3: "", // ["", ""]
		 * 			tag4: "", // ["", ""]
		 * 			tag5: "", // ["", ""]
		 * 			uploaded: undefined
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		removeOfflineFile: function(args) {
			args = args || {};
			window.Application.removeOfflineFile(args.success, args.error, {
				fileId: args.fileId,
				mediaType: args.mediaType,
				saveId: args.saveId,
				orgId: args.orgId,
				projectId: args.projectId,
				type: args.type,
				tag1: args.tag1,
				tag2: args.tag2,
				tag3: args.tag3,
				tag4: args.tag4,
				tag5: args.tag5,
				uploaded: args.uploaded
			});
			return window.cloudtplus;
		},

		/**
		 * @method updateOfflineRecord
		 * 根据recordId，修改离线记录
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.updateOfflineRecord({
		 * 			success: function(successData, errorData) {
		 * 				// successData: [{recordId:"", ..., uploaded: false, files:[]}]
		 * 				// errorData: []
		 * 			},
		 * 			error: function(errMsg) {},
		 * 			progress: function(value, info) {
		 * 				// value: 0~1
		 * 				// info: null 或 {success:true, data:{...}}
		 * 			},
		 * 			recordId: "",
		 *			data: "",
		 *			orgId: "",
		 * 			projectId: "",
		 * 			type: "",
		 * 			tag1: "",
		 * 			tag2: "",
		 * 			tag3: "",
		 * 			tag4: "",
		 * 			tag5: "",
		 * 			lastTime: undefined,
		 * 			uploaded: undefined,
		 * 			errorMsg: "",
		 * 			uploadUrl: "",
		 * 			files: ["", ""],
		 * 			items: undefined
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		updateOfflineRecord: function(args) {
			args = args || {};
			window.Application.updateOfflineRecord(args.success, args.error, args.progress, {
				recordId: args.recordId,
				data: args.data,
				orgId: args.orgId,
				projectId: args.projectId,
				type: args.type,
				tag1: args.tag1,
				tag2: args.tag2,
				tag3: args.tag3,
				tag4: args.tag4,
				tag5: args.tag5,
				lastTime: args.lastTime,
				uploaded: args.uploaded,
				errorMsg: args.errorMsg,
				uploadUrl: args.uploadUrl,
				files: args.files,
				items: args.items
			});
			return window.cloudtplus;
		},

		/**
		 * @method updateOfflineFile
		 * 根据fileId，更新离线文件
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.updateOfflineFile({
		 * 			success: function(successData, errorData) {
		 * 				// successData: [{fileUrl:"", fileId:"", ..., errorMsg: ""}]
		 * 				// errorData: []
		 * 			},
		 * 			error: function(errMsg) {},
		 * 			progress: function(value, info) {
		 * 				// value: 0~1
		 * 				// info: null 或 {success:true, data:{...}}
		 * 			},
		 * 			fileId: "",
		 *			saveId: "",
		 *			mediaType: "",
		 *			orgId: "",
		 * 			projectId: "",
		 * 			type: "",
		 * 			tag1: "",
		 * 			tag2: "",
		 * 			tag3: "",
		 * 			tag4: "",
		 * 			tag5: "",
		 * 			lastTime: undefined,
		 * 			uploaded: undefined,
		 * 			errorMsg: "",
		 *			productType: "",
		 *			moduleName: "",
		 *			isPublic: false,
		 * 			items: undefined
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		updateOfflineFile: function(args) {
			args = args || {};
			window.Application.updateOfflineFile(args.success, args.error, args.progress, {
				fileId: args.fileId,
				saveId: args.saveId,
				mediaType: args.mediaType,
				orgId: args.orgId,
				projectId: args.projectId,
				type: args.type,
				tag1: args.tag1,
				tag2: args.tag2,
				tag3: args.tag3,
				tag4: args.tag4,
				tag5: args.tag5,
				lastTime: args.lastTime,
				uploaded: args.uploaded,
				errorMsg: args.errorMsg,
				productType: args.productType,
				moduleName: args.moduleName,
				gcloudUploadUrl: args.gcloudUploadUrl,
				isPublic: args.isPublic,
				items: args.items
			});
			return window.cloudtplus;
		},

		/**
		 * @method getOfflineRecord
		 * 根据属性获取离线记录
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.getOfflineRecord({
		 * 			success: function(data) {
		 * 				// data: [{recordId:"", ..., errorMsg: "", files:[]}]
		 * 			},
		 * 			error: function(errMsg) {},
		 * 			recordId: "", // ["", ""]
		 * 			orgId: "", // ["", ""]
		 * 			projectId: "", // ["", ""]
		 * 			type: "", // ["", ""]
		 * 			tag1: "", // ["", ""]
		 * 			tag2: "", // ["", ""]
		 * 			tag3: "", // ["", ""]
		 * 			tag4: "", // ["", ""]
		 * 			tag5: "", // ["", ""]
		 * 			uploaded: undefined,
		 * 			files: "" // ["", ""]
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		getOfflineRecord: function(args) {
			args = args || {};
			window.Application.getOfflineRecord(args.success, args.error, {
				recordId: args.recordId,
				orgId: args.orgId,
				projectId: args.projectId,
				type: args.type,
				tag1: args.tag1,
				tag2: args.tag2,
				tag3: args.tag3,
				tag4: args.tag4,
				tag5: args.tag5,
				uploaded: args.uploaded,
				files: args.files
			});
			return window.cloudtplus;
		},

		/**
		 * @method getOfflineFile
		 * 根据属性获取离线文件
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.getOfflineFile({
		 * 			success: function(data) {
		 * 				// data: [{fileUrl:"", fileId:"", ..., errorMsg: ""}]
		 * 			},
		 * 			error: function(errMsg) {},
		 * 			fileId: "", // ["", ""]
		 * 			mediaType: "", // ["", ""]
		 * 			saveId: "", // ["", ""]
		 * 			orgId: "", // ["", ""]
		 * 			projectId: "", // ["", ""]
		 * 			type: "", // ["", ""]
		 * 			tag1: "", // ["", ""]
		 * 			tag2: "", // ["", ""]
		 * 			tag3: "", // ["", ""]
		 * 			tag4: "", // ["", ""]
		 * 			tag5: "", // ["", ""]
		 * 			uploaded: undefined
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		getOfflineFile: function(args) {
			args = args || {};
			window.Application.getOfflineFile(args.success, args.error, {
				fileId: args.fileId,
				mediaType: args.mediaType,
				saveId: args.saveId,
				orgId: args.orgId,
				projectId: args.projectId,
				type: args.type,
				tag1: args.tag1,
				tag2: args.tag2,
				tag3: args.tag3,
				tag4: args.tag4,
				tag5: args.tag5,
				uploaded: args.uploaded
			});
			return window.cloudtplus;
		},

		/**
		 * @method uploadOfflineRecord
		 * 根据recordId，上传离线记录及关联文件
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.uploadOfflineRecord({
		 * 			success: function(successData, errorData) {
		 * 				// successData: [{recordId:"", ..., errorMsg: "", files:[]}]
		 * 				// errorData: []
		 * 			},
		 * 			error: function(errMsg) {},
		 * 			progress: function(value, info) {
		 * 				// value: 0~1
		 * 				// info: null 或 {success:true, data:{...}}
		 * 			},
		 * 			recordId: "",
		 * 			uploadUrl: "",
		 * 			productType: "",	// 默认值: appId/UNKNOWN
		 * 			moduleName: "",		// 默认值: cloudtplus/ios 或 cloudtplus/android
		 * 			isPublic: false,	// 默认值: false
		 * 			items: [{}, {}]		// 批量上传
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		uploadOfflineRecord: function(args) {
			args = args || {};
			window.Application.uploadOfflineRecord(args.success, args.error, args.progress, {
				recordId: args.recordId,
				uploadUrl: args.uploadUrl,
				productType: args.productType,
				moduleName: args.moduleName,
				isPublic: args.isPublic,
				items: args.items
			});
			return window.cloudtplus;
		},

		/**
		 * @method uploadOfflineFile
		 * 根据fileId，上传离线文件
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.uploadOfflineFile({
		 * 			success: function(successData, errorData) {
		 * 				// successData: [{fileUrl:"", fileId:"", ..., errorMsg: ""}]
		 * 				// errorData: []
		 * 			},
		 * 			error: function(errMsg) {},
		 * 			progress: function(value, info) {
		 * 				// value: 0~1
		 * 				// info: null 或 {success:true, data:{...}}
		 * 			},
		 * 			fileId: "",
		 * 			productType: "", // 默认值: appId/UNKNOWN
		 * 			moduleName: "", // 默认值: cloudtplus/ios 或 cloudtplus/android
		 * 			isPublic: false // 默认值: false
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		uploadOfflineFile: function(args) {
			args = args || {};
			window.Application.uploadOfflineFile(args.success, args.error, args.progress, {
				fileId: args.fileId,
				productType: args.productType,
				moduleName: args.moduleName,
				isPublic: args.isPublic,
				items: args.items
			});
			return window.cloudtplus;
		},

		/**
		 * @method updateOfflineDict
		 * 根据name更新离线字典，并记录版本号
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.updateOfflineDict({
		 * 			success: function() {},
		 * 			error: function(errMsg) {},
		 * 			name: "",
		 * 			version: "",
		 * 			data: "",
		 *          		global:false
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		updateOfflineDict: function(args) {
			args = args || {};
			window.cloudtplus.removeOfflineDict({
				success: (function(scallback, ecallback, name, version, data, global) {
					return function() {
						var maxDictLength = 1024 * 1024; // 大于1M分开存储
						if (data && data.length > maxDictLength) {
							var count = 0;
							var errCount = 0;
							var length = Math.ceil(data.length / maxDictLength);
							for (var i = 0; i < length; i++) {
								var d = data.substring(maxDictLength * i, maxDictLength * (i + 1));
								window.Application.updateOfflineDict((function() {
									return function() {
										count++;
										if (count === length) {
											window.Application.updateOfflineDict(scallback, ecallback, {
												name: name,
												version: version,
												data: "$$$Count:" + length,
												global: global

											});
										}
									}
								})(), (function() {
									return function(errMsg) {
										errCount++;
										if (errCount === 1) {
											ecallback && ecallback.call(this, errMsg);
										}
									}
								})(), {
									name: name + "$$$" + i,
									version: version,
									data: d,
									global: global
								});
							}
						} else {
							window.Application.updateOfflineDict(scallback, ecallback, {
								name: name,
								version: version,
								data: data,
								global: global
							});
						}
					}
				})(args.success, args.error, args.name, args.version, args.data, args.global),
				error: (function(ecallback) {
					return function(errMsg) {
						ecallback && ecallback.call(this, errMsg);
					}
				})(args.error),
				name: args.name,
				global:args.global
			});
			return window.cloudtplus;
		},

		/**
		 * @method removeOfflineDict
		 * 根据name删除离线字典
		 * 允许全部删除
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.removeOfflineDict({
		 * 			success: function() {},
		 * 			error: function(errMsg) {},
		 * 			name: "",
		 *          		global:false
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		removeOfflineDict: function(args) {
			args = args || {};
			var successCallback = (function(scallback, ecallback, name, global) {
				return function(data) {
					var names = [name];
					if (data && data.indexOf("$$$Count:") === 0) {
						var length = Number(data.replace("$$$Count:", ""));
						for (var i = 0; i < length; i++) {
							names.push(name + "$$$" + i);
						}
					}
					window.Application.removeOfflineDict(scallback, ecallback, {
						name: names,
						global: global
					});
				}
			})(args.success, args.error, args.name, args.global);
			window.Application.getOfflineDict(successCallback, args.error, {
				name: args.name,
				global:args.global

			});
			return window.cloudtplus;
		},

		/**
		 * @method getOfflineDictVersion
		 * 根据name获取离线字典的版本号
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.getOfflineDictVersion({
		 * 			success: function() {},
		 * 			error: function(errMsg) {},
		 * 			name: "",
         	 *          		global: false
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		getOfflineDictVersion: function(args) {
			args = args || {};
			window.Application.getOfflineDictVersion(args.success, args.error, {
				name: args.name,
                		global: args.global
			});
			return window.cloudtplus;
		},

		/**
		 * @method getOfflineDict
		 * 根据name获取离线字典
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.getOfflineDict({
		 * 			success: function() {},
		 * 			error: function(errMsg) {},
		 * 			name: "",
		 *          		global:false
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		getOfflineDict: function(args) {
			args = args || {};
			var successCallback = (function(scallback, ecallback, name, global) {
				return function(data) {
					if (data && data.indexOf("$$$Count:") === 0) {
						var parts = [];
						var count = 0;
						var errCount = 0;
						var length = Number(data.replace("$$$Count:", ""));
						for (var i = 0; i < length; i++) {
							parts.push("");
							window.Application.getOfflineDict((function(ii) {
								return function(data) {
									parts[ii] = data;
									count++;
									if (count === length) {
										scallback && scallback.call(this, parts.join(""));
									}
								}
							})(i), (function() {
								return function(errMsg) {
									errCount++;
									if (errCount === 1) {
										ecallback && ecallback.call(this, errMsg);
									}
								}
							})(), {
								name: name + "$$$" + i,
								global:global
							});							
						}
					} else {
						scallback && scallback.call(this, data);
					}
				}
			})(args.success, args.error, args.name, args.global);
			window.Application.getOfflineDict(successCallback, args.error, {
				name: args.name,
				global:args.global
			});
			return window.cloudtplus;
		},
       	/**
		 * @method ajax
		 * 解决跨域问题，在壳上封装的ajax请求
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.ajax({
		 * 			success: function() {},
		 * 			error: function(errMsg) {},
		 * 			url: "",
         *          headers: {},
		 * 			data: "",
		 * 			type: ""	// 默认值: GET, 	其他: POST/PUT/DELETE
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		ajax: function(args) {
			args = args || {};
			window.Application.ajax(args.success, args.error, {
				url: args.url,
		                headers: args.headers,
				data: args.data,
				type: args.type
			});
			return window.cloudtplus;
		},

		/**
		 * @method getDataUrl
		 * 解决跨协议显示图片问题
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.getDataUrl({
		 * 			success: function(dataUrl) {},
		 * 			error: function(errMsg) {},
		 * 			url: "",
		 * 			force: false
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		getDataUrl: function(args) {
			args = args || {};
			window.Application.getDataUrl(args.success, args.error, {
				url: args.url,
				force: args.force
			});
			return window.cloudtplus;
		},

		/**
		 * @method getGuid
		 * 获取新guid
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.getGuid({
		 * 			success: function(guid) {},
		 * 			error: function(errMsg) {}
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		getGuid: function(args) {
			args = args || {};
			window.Application.getGuid(args.success, args.error);
			return window.cloudtplus;
		},

		/**
		 * @method getContextInfo
		 * 获取上下文信息
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.getContextInfo({
		 * 			success: function(data) {
         	 * 				// data: {userId:"", userName:"", tenantId:"", tenantName:"", serverId:"", appId:"", gcloudToken:"", gcloudUserId:""}
		 * 			},
		 * 			error: function(errMsg) {}
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		getContextInfo: function(args) {
			args = args || {};
			window.Application.getContextInfo(args.success, args.error);
			return window.cloudtplus;
		},

		/**
		 * @method checkSession
		 * 检查当前会话状态
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.checkSession({
		 * 			success: function(networkStatus) {
		 * 				// 会话可用，networkStatus: "WiFi" "WWAN"
		 * 			},
		 * 			error: function(errMsg) {
		 * 				// 会话不可用，errMsg为出错信息，例如：网络不可用
		 * 			},
		 * 			autoLogin: false	// 是否自动登录
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		checkSession: function(args) {
			args = args || {};
			window.Application.checkSession(args.success, args.error, {
				autoLogin: args.autoLogin
			});
			return window.cloudtplus;
		},

        /**
         * @method getNetWorkType
         * 获取网络状态
         *
         * Example:
         *
         *         window.cloudtplus.getNetWorkType({
         *             success: function(data) {
         *                 // 会话可用，data: "WIFI" "运营商网络" "无" "未知"
         *             },
         *             error: function(errMsg) {
         *                 // 错误信息
         *             }
         *         });
         *
         * @param {Object} args 参数对象
         * @return {Object} 返回cloudtplus对象
         */
        getNetWorkType: function(args) {
            args = args || {};
            window.Application.getNetWorkType(args.success, args.error);
            return window.cloudtplus;
        },

        /**
         * @method callApp
         * 调用其他产品页面
         *
         * Example:
         *
         *         window.cloudtplus.callApp({
         *             success: function(data) {
         *                 // 被调用的页面返回的信息
         *             },
         *             error: function(errMsg) {
         *                 // 错误信息
         *             },
         *             url: "offline://app/3/index.html?page=buildForm&id=123&from=otherApp",  // 产品URL，在线或离线均可
         *             appId: "3"       // 产品ID，如果是调用离线App，则会使用url中的AppID，此处可为空,
         *             title:"标题"     //vc 标题
         *         });
         *
         * @param {Object} args 参数对象
         * @return {Object} 返回cloudtplus对象
         */
        callApp: function(args) {
            args = args || {};
            window.Application.callApp(args.success, args.error, {
                                           url: args.url,
                                           appId: args.appId,
                                           title: args.title
                                       });
            return window.cloudtplus;
		},
		
	   /**
            * @method showPositionTree
            * 显示部位树
            *
            * Example:
            *
            *         window.cloudtplus.showPositionTree({
            *             success: function(data) {
            *                 // 返回的选中的部位数组，数组中元素的pathName为部位的完整路径
            *             },
            *             error: function(errMsg) {
            *                 // 错误信息
            *             },
            *             isMultiSelect: bool,                // 是否多选
            *             isComputeParent: bool,              // 是否计算共同父
            *             isSegmentOnly: bool,                // 是否之选流水段
            *             defaultLevel:int,                   // 默认展开级别
            *             selectedIds: StringArray,        // 当前已选的树节点ID
            *             items: ObjectArray,                 // 树节点数据项
            *         });
            *
            * @param {Object} args 参数对象
            * @return {Object} 返回cloudtplus对象
            */
         showPositionTree: function(args) {
             args = args || {};
             window.Application.showPositionTree(args.success, args.error, {
                                         isMultiSelect: args.isMultiSelect,
                                         isComputeParent: args.isComputeParent,
                                         isSegmentOnly:args.isSegmentOnly,
                                         defaultLevel:args.defaultLevel || 1,
                                         selectedIds: args.selectedIds || [],
                                         items: args.items || []
                                         });
             return window.cloudtplus;
         },

        /**
         * @method copyOfflineFileToApp
         * 拷贝一个本地文件到另一个App，并在另一个App中添加成为一个OfflineFile
         *
         * Example:
         *
         *         window.cloudtplus.copyOfflineFileToApp({
         *             success: function(data) {
         *                 // 在新App中生成的OfflineFileID数组
         *             },
         *             error: function(errMsg) {
         *                 // 错误信息
         *             },
         *             fileUrls: ["file:///path.jpg"],  // 源文件路径数组
         *             appId: "3"                       // 产品ID
         *         });
         *
         * @param {Object} args 参数对象
         * @return {Object} 返回cloudtplus对象
         */
        copyOfflineFileToApp: function(args) {
            args = args || {};
            window.Application.copyOfflineFileToApp(args.success, args.error, {
                                   fileUrls: args.fileUrls,
                                   appId: args.appId
                               });
            return window.cloudtplus;
        },

		/**
		 * @method fileOpen
		 * 打开文件
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.fileOpen({
		 * 			success: function() {},
		 * 			error: function(errMsg) {},
		 * 			url: "file:///",	// 文件路径
		 * 			fileName: ""		// 显示名称
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		fileOpen: function(args) {
			args = args || {};
			window.FileOpener.open(args.url || "", args.success, args.error, args.fileName || "");
			return window.cloudtplus;
		},

		/**
		 * @method fileBrowser
		 * 浏览文件
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.fileBrowser({
		 * 			success: function(selected) {
		 * 				// selected: [{}]
		 * 			},
		 * 			error: function(errMsg) {},
		 * 			delete: function(deleted) {
		 * 				// deleted: [{}]
		 * 			},
		 * 			import: function() {
		 * 				// window.cloudtplus.fileBrowserRefresh({items: []});
		 * 			},
		 * 			title: "",
		 * 			mode: "",	// "BROWSE", "SELECT"
		 * 			allowDelete: false,		// 仅在"BROWSE"模式下起作用
		 * 			allowExport: false,		// 仅在"BROWSE"模式下起作用
		 * 			allowImport: false,		// 仅在"BROWSE"模式下起作用
		 * 			maxCount: 0,			// 仅在"SELECT"模式下起作用
		 * 			items: [{
		 * 				groupName: "",
		 * 				url: "",
		 * 				tag: "",
		 * 				tagColor: "",
		 * 				tagBackgroundColor: "",
		 * 				description: "",
		 * 				noSelect: false
		 * 			}]
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		fileBrowser: function(args) {
			args = args || {};
			window.Application.fileBrowser(args.success, args.error, args.delete, args.import, {
				title: args.title,
				mode: args.mode,
				allowDelete: args.allowDelete,
				allowExport: args.allowExport || args.allowSave,
				allowImport: args.allowImport,
				maxCount: args.maxCount,
				items: args.items
			});
			return window.cloudtplus;
		},

		/**
		 * @method fileBrowserRefresh
		 * 刷新当前浏览文件内容
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.fileBrowserRefresh({
		 * 			success: function() {},
		 * 			error: function(errMsg) {},
		 * 			items: [{
		 * 				groupName: "",
		 * 				url: "",
		 * 				tag: "",
		 * 				tagColor: "",
		 * 				tagBackgroundColor: "",
		 * 				description: "",
		 * 				noSelect: false
		 * 			}]
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		fileBrowserRefresh: function(args) {
			args = args || {};
			window.Application.fileBrowserRefresh(args.success, args.error, {
				items: args.items
			});
			return window.cloudtplus;
		},
		
	/**
         * @method cameraLPR
         * 调用扫描车牌号插件
         *
         * Example:
         *
         * 	    window.cloudtplus.cameraLPR({
         *          success: function(data) {
         * 	         // data: [{carNumber:"",recogRate:"",recogFileUrl: ""}]
         *          },
         * 	    	error: function(errMsg) {}
         * 	    });
         *
         * @param {Object} args 参数对象
         * @return {Object} 返回cloudtplus对象
         */
        cameraLPR: function(args) {
            args = args || {};
            window.Application.cameraLPR(args.success,args.error);
            return window.cloudtplus;
        },
        
        /**
         * @method countRebar2
         * 弹出数钢筋功能界面
         *
         * Example:
         *
         *     window.cloudtplus.countRebar2({
         *          success: function(data) {},
         *          error: function(errMsg) {},
         *          user: "张三",
         *          trackInfo: {}    // 需要补充提交的埋点信息
         *     });
         *
         * @param {Object} args 参数对象
         * @return {Object} 返回cloudtplus对象
         */
        countRebar2: function(args) {
            args = args || {};
            window.Application.countRebar2(args.success,args.error,args.user,args.trackInfo);
            return window.cloudtplus;
        },

         /**
          * @method countThings
          * 弹出图像识别功能能界面
          *
          * Example:
          *
          *     window.cloudtplus.countThings({
          *          success: function(data) {},
          *          error: function(errMsg) {},
          *          template: "STEELTUBE",    //"REBAR", "STEELTUBE"   钢筋 钢管
          *          trackInfo: {},            // 需要补充提交的埋点信息
          *          noResult: false,          // 成功回调中不返回识别的结果，只会将图片保存到系统相册
          *          user: "张三"
          *     });
          *
          * @param {Object} args 参数对象
          * @return {Object} 返回cloudtplus对象
          */
         countThings: function(args) {
             args = args || {};
             window.Application.countThings(args.success,args.error,{
                                            template: args.template,
                                            trackInfo: args.trackInfo,
                                            noResult: args.noResult,
                                            user: args.user
                                            });
             return window.cloudtplus;
         },

                                                             
		/**
		 * @method browseImages
		 * 浏览图片
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.browseImages({
		 * 			success: function(deleted) {
		 * 				// deleted: [0, 1]
		 * 			},
		 * 			error: function() {},
		 * 			urls: [""],
		 * 			startIndex: 0,
		 * 			allowDelete: false
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		browseImages: function(args) {
			window.console && window.console.warn && window.console.warn("window.cloudtplus.browseImages已不推荐使用，请更换为browsePicture");
			args = args || {};
			window.ImageBrowser.browseImages(args.success, args.error, {
				urls: args.urls,
				startIndex: args.startIndex,
				allowDelete: args.allowDelete
			});
			return window.cloudtplus;
		},

		/**
		 * @method browsePicture
		 * 浏览图片
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.browsePicture({
		 * 			success: function() {},
		 * 			error: function(errMsg) {},
		 * 			items: [{
		 * 				url: "",
		 * 				description: ""
		 * 			}],
		 * 			startIndex: 0
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		browsePicture: function(args) {
			args = args || {};
			window.Application.browsePicture(args.success, args.error, {
				items: args.items,
				startIndex: args.startIndex
			});
			return window.cloudtplus;
		},

		/**
		 * @method browseVideo
		 * 浏览视频
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.browseVideo({
		 * 			success: function() {},
		 * 			error: function(errMsg) {},
		 * 			title: "",
		 * 			url: ""
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		browseVideo: function(args) {
			args = args || {};
			window.Application.browseVideo(args.success, args.error, {
				title: args.title,
				url: args.url
			});
			return window.cloudtplus;
		},

		/**
		 * @method browseAudio
		 * 浏览音频
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.browseAudio({
		 * 			success: function() {},
		 * 			error: function(errMsg) {},
		 * 			title: "",
		 * 			url: ""
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		browseAudio: function(args) {
			args = args || {};
			window.Application.browseAudio(args.success, args.error, {
				title: args.title,
				url: args.url
			});
			return window.cloudtplus;
		},

		/**
		 * @method downloadBundleBySaveId
		 * 根据saveId下载包，返回解压后的路径
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.downloadBundleBySaveId({
		 * 			success: function(path) {
		 * 				// path: file:///xxxx/xxx/   最后有一个斜杠
		 * 			},
		 * 			error: function(errMsg) {},
		 * 			progress: function(value) {
		 * 				// value: 0~1
		 * 			},
		 * 			productType: "",
		 * 			saveId: "",
		 * 			force: false
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		downloadBundleBySaveId: function(args) {
			args = args || {};
			window.Application.downloadBundleBySaveId(args.success, args.error, args.progress, {
				productType: args.productType,
				saveId: args.saveId,
				force: args.force
			});
			return window.cloudtplus;
		},

		/**
		 * @method checkBundleBySaveId
		 * 根据saveId检查包是否存在
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.checkBundleBySaveId({
		 * 			success: function(result) {
		 * 				// 离线包信息 result: [{saveId: "", path:"file:///xxxx/xxx/", success: true}]
		 * 			},
		 * 			error: function(errMsg) {},
		 * 			productType: "",
		 * 			saveId: "" // ["", ""]
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		checkBundleBySaveId: function(args) {
			args = args || {};
			window.Application.checkBundleBySaveId(args.success, args.error, {
				productType: args.productType,
				saveId: args.saveId
			});
			return window.cloudtplus;
		},

		/**
		 * @method removeBundleBySaveId
		 * 根据saveId删除包
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.removeBundleBySaveId({
		 * 			success: function(result) {
		 * 				// 删除信息 result: [{saveId: "", path:"file:///xxxx/xxx/", success: true}]
		 * 			},
		 * 			error: function(errMsg) {},
		 * 			productType: "",
		 * 			saveId: "" // ["", ""]
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		removeBundleBySaveId: function(args) {
			args = args || {};
			window.Application.removeBundleBySaveId(args.success, args.error, {
				productType: args.productType,
				saveId: args.saveId
			});
			return window.cloudtplus;
		},

		/**
		 * @method removeBundleAll
		 * 删除全部包
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.removeBundleAll({
		 * 			success: function(result) {
		 * 				// 删除信息 result: [{saveId: "", path:"file:///xxxx/xxx/", success: true}]
		 * 			},
		 * 			error: function(errMsg) {},
		 * 			productType: ""
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		removeBundleAll: function(args) {
			args = args || {};
			window.Application.removeBundleAll(args.success, args.error, {
				productType: args.productType
			});
			return window.cloudtplus;
		},

		/**
		 * @method readFile
		 * 读取文件
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.readFile({
		 * 			success: function(data) {},
		 * 			error: function(errMsg) {},
		 * 			url: "file:///"				// 文件路径
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		readFile: function(args) {
			args = args || {};
			window.Application.readFile(args.success, args.error, {
				url: args.url
			});
			return window.cloudtplus;
		},

		/**
		 * @method showShareMenu
		 * 显示分享菜单
		 * 
		 * Example:
		 * 
		 * 		window.cloudtplus.showShareMenu({
		 * 			success: function() {},
		 * 			error: function(errMsg) {},
		 * 			platformTypes: [""], // "WechatSession", "WechatTimeLine", "WechatFavorite", "QQ", "Qzone","DingDing", "WhatsApp", "Email", "SMS"
		 * 			title: "",
		 * 			description: "",
		 * 			thumbUrl: "", // "appIcon", "applicationIcon", “file:///”, “https://”
		 * 			url: ""
		 * 		});
		 *
		 * @param {Object} args 参数对象
		 * @return {Object} 返回cloudtplus对象
		 */
		showShareMenu: function(args) {
			args = args || {};
			window.Application.showShareMenu(args.success, args.error, {
				platformTypes: args.platformTypes,
				title: args.title,
				description: args.description,
				thumbUrl: args.thumbUrl,
				url: args.url
			});
			return window.cloudtplus;
		},

        /**
         * @method share
         * 分享
         *
         * Example:
         *
         *         window.cloudtplus.share({
         *             success: function() {},
         *             error: function(errMsg) {},
         *             platformType: "", // "WechatSession", "WechatTimeLine", "WechatFavorite", "QQ", "Qzone","DingDing", "WhatsApp", "Email", "SMS"
         *             title: "",
         *             description: "",
         *             thumbUrl: "", // "appIcon", "applicationIcon", “file:///”, “https://”
         *             url: ""
         *         });
         *
         * @param {Object} args 参数对象
         * @return {Object} 返回cloudtplus对象
         */
        share: function(args) {
            args = args || {};
            window.Application.share(args.success, args.error, {
                platformType: args.platformType,
                title: args.title,
                description: args.description,
                thumbUrl: args.thumbUrl,
                url: args.url
            });
            return window.cloudtplus;
        },

        /**
         * @method startMapNavi
         * 显示分享菜单
         *
         * Example:
         *
         * 		window.cloudtplus.showMapNavi({
         * 			success: function() {},
         * 			error: function(errMsg) {},
         * 			startName: "我的位置",
         *          startLat: "",
         *          startLon: "",
         *          endName: "东郡华城广场",
         *          endLat: "28.187519",
         *          endLon: "113.031738"
         * 		});
         *
         * @param {Object} args 参数对象
         * @return {Object} 返回cloudtplus对象
         */
        showMapNavi: function(args) {
            args = args || {};
            window.Application.showMapNavi(args.success, args.error, {
                startName: args.startName,
                startLat: args.startLat,
                startLon: args.startLon,
                endName: args.endName,
                endLat: args.endLat,
                endLon: args.endLon
            });
            return window.cloudtplus;
        },
     /**
      * Vibrates the device for a given amount of time.
      * @param {Integer} param  The number of milliseconds to vibrate
      * Example:
      *
      *         window.cloudtplus.vibrate({
      *             success: function() {},
      *             error: function(errMsg) {},
      *             time: 200
      *         });
      *
      * @param {Object} args 参数对象
      * @return {Object} 返回cloudtplus对象
      */
     vibrate: function(args) {
     args = args || {};
     window.Application.vibrate(args.success, args.error, {
                                time: args.time
                                });
     return window.cloudtplus;
     },
                                                             
    /**
     * 将照片导出到系统相册
     * @param {String} 照片本地或网络地址
     * Example:
     *
     *         window.cloudtplus.copytoAlbum({
     *             success: function() {},
     *             error: function(errMsg) {},
     *             photoPath: "https://www.baidu.com/img/bd_logo1.png"
     *         });
     *
     * @param {Object} args 参数对象
     * @return {Object} 返回cloudtplus对象
     */
    copytoAlbum: function(args) {
        args = args || {};
        window.Application.copytoAlbum(args.success, args.error, {
                                           photoPath: args.photoPath
                                       });
        return window.cloudtplus;
    },

    startGPS: function(args) {
    args = args || {};
    window.Application.startGPS(args.success, args.error, {
            orgId: args.orgId,
            projectId: args.projectId,
            tag1: args.tag1,
            tag2: args.tag2,
            tag3: args.tag3,
            tag4: args.tag4,
            tag5: args.tag5
        });
       return window.cloudtplus;
     },
                                                             
    stopGPS: function(args) {
    args = args || {};
    window.Application.stopGPS(args.success, args.error,{});
        return window.cloudtplus;
    },
                                                             
    initBluetooth: function(args) {
        args = args || {};
        window.Application.initBluetooth(args.success, args.error,{type:args.type});
        return window.cloudtplus;
    },

    blueWriteChara: function(args) {
        args = args || {};
        window.Application.blueWriteChara(args.success, args.error,{});
        return window.cloudtplus;
    },
     /**
     *window.cloudtplus.getBlueData({
     * 			success: function() {},
     * 			error: function(errMsg) {},
     * 			bleState: "getConnectState"   //获取蓝牙数据传空 ""
     * 		});
     **/
    getBlueData: function(args) {
        args = args || {};
        window.Application.getBlueData(args.success, args.error,{
          bleState: args.bleState});
        return window.cloudtplus;
    },

    connectBlueTooth: function(args) {
        args = args || {};
        window.Application.connectBlueTooth(args.success, args.error,{});
        return window.cloudtplus;
    },

    /**
     * @method bluetoothPrinter
     * 连接蓝牙打印机，打印过磅单
     *
     * Example:
     * window.cloudtplus.bluetoothPrinter({
     *   success: function(successData) {
     *       alert({
     *           successData: successData
     *       });
     *   },
     *   error: function(errMsg) {
     *       alert(errMsg);
     *   },
     *   projectName:"广州项目",
     *   oddNumber:123456789111,
     *   printNumber:"4",
     *   productionUnit:"北京圣源春凯商贸有限公司",
     *   carNumb:"京P79581",
     *   storageRoom:"",
     *   note:"",
     *   dataList:[{"name":"圆钢Q235","waybill":"100吨","realbill":"100吨","confirm":"100吨"}],
     *   acceptor:"产品管理员3",
     *   acceptTime:"2018-05-25 9:42"
     *});
     **/
    bluetoothPrinter: function(args) {
        args = args || {};
        if(args.storageRoom === undefined) args.storageRoom="";
        window.Application.bluetoothPrinter(args.success, args.error, {
            projectName: args.projectName,
            oddNumber: args.oddNumber,
            printNumber:args.printNumber,
            productionUnit: args.productionUnit,
            carNumb: args.carNumb,
            storageRoom: args.storageRoom,
            note: args.note,
            dataList: args.dataList,
            acceptor: args.acceptor,
            acceptTime: args.acceptTime
        });
        return window.cloudtplus;
    },

    /**
     * @method bluetoothPrinter2
     * 连接蓝牙打印机，打印自定义单据
     *
     * Example:
     * window.cloudtplus.bluetoothPrinter2({
     *   success: function(successData) {
     *       alert({
     *           successData: successData
     *       });
     *   },
     *   error: function(errMsg) {
     *       alert(errMsg);
     *   },
     *   printNumber: 1,        // 打印份数
     *   items: [
     *       {
     *           type : "TEXT",          // 类型，文字：TEXT, 标题和值：TITLE_VALUE, 换行：NEW_LINE, 分割线：SEPERATOR_LINE, 条码：BAR_CODE, 二维码：QR_CODE, 图片：IMAGE, 打印联数：PRINT_NO
     *           alignment : "CENTER",   // 对其方式，仅对 TEXT, IMAGE, PRINT_NO 类型有效，可能取值：CENTER, LEFT, RIGHT
     *           fontSize : "SMALL",     // 字体大小，仅对 TEXT, TITLE_VALUE, IMAGE, PRINT_NO 类型有效，可能取值: SMALL, MIDDLE, BIG
     *           param1: "过磅单",        // 参数1，根据类型不同具有不同的意义，TEXT：文字内容，TITLE_VALUE：标题文字内容，BAR_CODE：条码内容，QR_CODE：二维码内容，IMAGE：图片本地存储路径，PRINT_NO：打印联数文字前缀
     *           param2: ""              // 参数2，根据类型不同具有不同的意义，TITLE_VALUE：值文字内容，BAR_CODE：条码高度，PRINT_NO：打印联数文字后缀，IMAGE：旋转角度
     *       },
     *   ]
     *});
     **/
    bluetoothPrinter2: function(args) {
        args = args || {};
        window.Application.bluetoothPrinter2(args.success, args.error, {
            printNumber: args.printNumber,
            items: args.items
        });
        return window.cloudtplus;
    },

    /**
     * @method searchBluePrinter
     * 搜索蓝牙打印机
     *
     * Example:
     *
     *         window.cloudtplus.searchBluePrinter({
     *          success: function(data) {},
     *             error: function(errMsg) {}
     *         });
     *
     * @param {Object} args 参数对象
     * @return {Object} 返回cloudtplus对象
     */
    searchBluePrinter: function(args) {
        args = args || {};
        window.Application.searchBluePrinter(args.success, args.error,{});
        return window.cloudtplus;
    },

    /**
     * @method scanFace
     * 打开相机，自动检测人脸，并自动拍照剪裁，返回人脸图片
     *
     * Example:
     *
     *      window.cloudtplus.scanFace({
     *          success: function(fileUrl) {
     *          },
     *          error: function(errMsg) {}
     *      });
     *
     * @param {Object} args 参数对象
     * @return {Object} 返回cloudtplus对象
     */
    scanFace: function(args) {
        args = args || {};
        window.Application.scanFace(args.success, args.error, {});
        return window.cloudtplus;
    },

    searchGPSRecords: function(args) {
    args = args || {};
    window.Application.searchGPSRecords(args.success, args.error, {
        date: args.date,
        recordId: args.recordId,
        orgId: args.orgId,
        projectId: args.projectId,
        tag1: args.tag1,
        tag2: args.tag2,
        tag3: args.tag3,
        tag4: args.tag4,
        tag5: args.tag5,
        uploaded: args.uploaded
       });
       return window.cloudtplus;
    },
           
        currentLocation: function(args) {
            args = args || {};
            window.Application.currentLocation(args.success, args.error, {
                orgId: args.orgId,
                projectId: args.projectId,
                tag1: args.tag1,
                tag2: args.tag2,
                tag3: args.tag3,
                tag4: args.tag4,
                tag5: args.tag5
            });
            return window.cloudtplus;
        },
	/**
         * @method locationPoint
         * 获取位置坐标点
         *
         * Example:
         *
         * 		window.cloudtplus.locationPoint({
         * 			success: function() {},
         * 			error: function() {}
         * 		});
         *
         * @param {Object} args 参数对象
         * @return {Object} 返回JsonArray对象 [Latitude,Longitude]
         */
        locationPoint: function(args) {
            args = args || {};
            window.Application.locationPoint(args.success, args.error,{});
            return window.cloudtplus;
        },
	
	/**
         * @method removeGPSRecords
         * 根据属性删除坐标记录
         * 不允许全部删除
         *
         * Example:
         *
         * 		window.cloudtplus.removeGPSRecords({
         * 			success: function(recordIds) {
         * 				// 删除成功 recordIds: ["", ""]
         * 			},
         * 			error: function(errMsg) {},
         * 			recordId: "", // ["", ""]
         * 			orgId: "", // ["", ""]
         * 			projectId: "", // ["", ""]
         * 			date: "", // ""
         * 			tag1: "", // ["", ""]
         * 			tag2: "", // ["", ""]
         * 			tag3: "", // ["", ""]
         * 			tag4: "", // ["", ""]
         * 			tag5: "", // ["", ""]
         * 			uploaded: undefined
         * 		});
         *
         * @param {Object} args 参数对象
         * @return {Object} 返回cloudtplus对象
         */
        removeGPSRecords: function(args) {
            args = args || {};
            window.Application.removeGPSRecords(args.success, args.error, {
                recordId: args.recordId,
                orgId: args.orgId,
                projectId: args.projectId,
                date: args.date,
                tag1: args.tag1,
                tag2: args.tag2,
                tag3: args.tag3,
                tag4: args.tag4,
                tag5: args.tag5,
                uploaded: args.uploaded
            });
            return window.cloudtplus;
        },

    /**
     * @method scanFace
     * 打开BIMFACE模型文件
     *
     * Example:
     *
     *      window.cloudtplus.openBimfaceModel({
     *          success: function() {
     *          },
     *          error: function(errMsg) {},
     *          fileUrl: "",    // 本地文件路径，类似这样：file://path
     *          viewToken: "",  // 在线模型viewToken，该参数与fileUrl参数只能填写一个，如果两个都填写了，则使用viewToken
     *          baseUrl: "",    // 用于从后台查询模型树和图元属性的baseUrl，类似这样：https://xmgl-test.glodon.com/bim5d-tech/api/tech-service/v4/projects/233691177762816
     *          cacheKey: "",   // 用于缓存的唯一标识，如果为空，则表示不使用缓存
     *          title: "",      // 界面标题,
     *          share: {        // 分享，可以为null
     *             platformTypes: [""], // "WechatSession", "WechatTimeLine", "WechatFavorite", "QQ", "Qzone","DingDing", "WhatsApp", "Email", "SMS"
     *             title: "",
     *             description: "",
     *             thumbUrl: "", // "appIcon", "applicationIcon", “file:///”, “https://”
     *             url: ""
     *          },
     *          logo: {         // 版权logo，可以为null
     *              width: number,      // 显示宽度
     *              height: number,     // 显示高度
     *              url: ""             // logo图片地址
     *          }
     *      });
     *
     * @param {Object} args 参数对象
     * @return {Object} 返回cloudtplus对象
     */
    openBimfaceModel:function(args) {
        args = args || {};
        window.Application.openBimfaceModel(args.success,args.error,{
                                           fileUrl: args.fileUrl,
                                           viewToken: args.viewToken,
                                           baseUrl: args.baseUrl,
                                           cacheKey: args.cacheKey,
                                           title: args.title,
                                           share: args.share,
                                           logo: args.logo
                                       });
        return window.cloudtplus;
    },
    
    

    /**
     * @method unzipFile
     * 解压文件
     * Example:
     *         window.cloudtplus.unzipFile({
     *             success: function(dirPath) {
     *                 // 成功回调，回调参数为解压后文件所在的文件夹路径
     *             },
     *             error: function(errMsg) {
     *                 // 失败后回调，回调参数为字符串，字符串内容为错误原因
     *             },
     *             fileUrl: "",       // 字符串，要解压的文件路径
     *             id: ""             // 唯一标识，可为空，如果为空，则使用文件名（不包含文件路径，包含文件名和后缀名）作为唯一标识
     *         });
     *
     * @param {Object} args 参数对象
     * @return {Object} 返回cloudtplus对象
     */
    unzipFile: function(args) {
        args = args || {};
        window.Application.unzipFile(args.success, args.error, {
                                     fileUrl: args.fileUrl,
                                     id: args.id
                                     });
        return window.cloudtplus;
    },
    
    /**
     * @method removeUnzippedFiles
     * 批量删除已解压得到的文件
     * Example:
     *         window.cloudtplus.removeUnzippedFiles({
     *             success: function() {},
     *             error: function() {},
     *             ids: []            // 字符串数组，要删除的文件的唯一标识
     *         });
     *
     * @param {Object} args 参数对象
     * @return {Object} 返回cloudtplus对象
     */
    removeUnzippedFiles: function(args) {
        args = args || {};
        window.Application.removeUnzippedFiles(args.success, args.error, {
                                               ids: args.ids
                                               });
        return window.cloudtplus;
    },
    
    /**
     * @method isFilesUnzipped
     * 批量判断文件是否已经解压，返回其中已解压得到的文件夹的路径列表
     * Example:
     *         window.cloudtplus.isFilesUnzipped({
     *             success: function(data) {
     *                 // 回调参数为Object，key为文件的唯一标识，value为该文件解压后得到的文件夹的路径，如果文件还没有解压，则value为null
     *             },
     *             error: function() {},
     *             ids: []           // 字符串数组，要判断的文件的唯一标识
     *         });
     *
     * @param {Object} args 参数对象
     * @return {Object} 返回cloudtplus对象
     */
    isFilesUnzipped: function(args) {
        args = args || {};
        window.Application.isFilesUnzipped(args.success, args.error, {
                                               ids: args.ids
                                           });
        return window.cloudtplus;
    },

    /**
     * @method startWebServer
     * 启动本地WebServer
     * Example:
     *         window.cloudtplus.startWebServer({
     *             success: function(port) {
     *                 // port为启动成功的WebServer的端口
     *             },
     *             error: function(errMsg) {},
     *             rootPath: ""                // 本地文件夹路径，作为WebServer根目录
     *         });
     *
     * @param {Object} args 参数对象
     * @return {Object} 返回cloudtplus对象
     */
    startWebServer: function(args) {
        args = args || {};
        window.Application.startWebServer(args.success, args.error, {
                                              rootPath: args.rootPath
                                          });
        return window.cloudtplus;
    },
    
    /**
     * @method stopWebServer
     * 停止本地WebServer
     * Example:
     *         window.cloudtplus.stopWebServer({
     *             success: function() {},
     *             error: function() {}
     *         });
     *
     * @param {Object} args 参数对象
     * @return {Object} 返回cloudtplus对象
     */
    stopWebServer: function(args) {
        args = args || {};
        window.Application.stopWebServer(args.success, args.error);
        return window.cloudtplus;
    },

	/**
         * @method controlLeftSideMenu
         * 控制左侧菜单是否可以滑动，可以取代showLeftSideMenu
         *
         * Example:
         *
         * 		window.cloudtplus.controlLeftSideMenu({
         * 			success: function() {},
         * 			error: function() {},
         *          touchMode: "MARGIN","FULLSCREEN","NONE"   //MARGIN边缘滑动，FULLSCREEN全屏滑动，禁止滑动
         *
         * 		});
         *
         * @param {Object} args 参数对象
         * @return {Object} 返回cloudtplus对象
         */
         controlLeftSideMenu: function(args) {
                    args = args || {};
                    window.Application.controlLeftSideMenu(args.success, args.error,{
                        touchMode: args.touchMode
                    });
                    return window.cloudtplus;
         },
	 
	/**
         * @method applozic
         * 自调用连接和退出
         *
         * Example:
         *
         *     window.cloudtplus.applozic({
         *          success: function(data) {},
         *          error: function(errMsg) {},
         *          action: "connectUser",   //connectUser执行连接 loginOut 执行登出
         *          user: "OwnImId"   //对应IMUtils.getOwnImId()生成的字符串
         *     });
         *
         * @param {Object} args 参数对象
         * @return {Object} 返回cloudtplus对象
         */
        applozic: function(args) {
            args = args || {};
            window.Application.applozic(args.success,args.error,{
             action: args.action,
             user: args.user,
             chatId: args.chatId
            });
            return window.cloudtplus;
        },
	
	};

	/**
	 * 接口调试
	 * 
	 * Example:
	 * 
	 * 		window.cloudtplus.debug = true;
	 * 		window.cloudtplus.debugFilter = ['ajax'];
	 * 		window.cloudtplus.debugInfo; // [{"start": "2016-11-15T01:58:01.941Z", "end": "2016-11-15T01:58:20.420Z", "name": "ajax", success: true, args: {}, result: {}, text: ""}]
	 * 
	 */
	(function(ctp) {
		var formatDate = function(date) {
			return date.getFullYear() + '年' + date.getMonth() + '月' + date.getDate() + '日 ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' ' + date.getMilliseconds();
		};
		var getType = function(v) {
			return Object.prototype.toString.call(v).replace("[object ", "").replace("]", "");
		};
		var log = function(start, end, name, success, args, result) {
			if (!ctp.debugInfo) {
				ctp.debugInfo = [];
			}
			var o = {
				start: start,
				end: end,
				name: name,
				success: success,
				args: args,
				result: result,
				text: '开始时间:' + formatDate(start) + ' 结束时间:' + formatDate(end) + ' 耗时:' + (Number(end) - Number(start)) + '毫秒 执行方法:' + name + ' 执行结果:' + (success ? '成功' : '失败')
			};
			if (name == 'ajax' && args) {
				o.text += ' 请求地址:' + args.url;
			}
			if (getType(ctp.debugFilter) != 'Array' || ctp.debugFilter.length == 0 || ctp.debugFilter.indexOf(name) >= 0) {
				ctp.debugInfo.push(o);
			}
		};
		var init_args = function(name, args) {
			args = args || {};

			if (ctp.debug) {
				args.success = (function(callback, name, start) {
					return function(data) {
						log(start, new Date(), name, true, args, data);
						return callback && callback.apply(this, arguments)
					}
				})(args.success, name, new Date());
				args.error = (function(callback, name, start) {
					return function(msg) {
						log(start, new Date(), name, false, args, msg);
						return callback && callback.apply(this, arguments)
					}
				})(args.error, name, new Date());
			}

			return args
		};
		for (i in ctp) {
			var item = ctp[i];
			if (getType(item) == 'Function') {
				if (i.indexOf('on') != 0) {
					ctp[i] = (function(name, fn) {
						return function(args) {
							args = init_args(name, args);
							return fn.call(this, args);
						}
					})(i, item);
				}
			}
		}
	})(window.cloudtplus);
})();
