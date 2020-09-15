/* eslint-disable */
(function() {
	var u = navigator.userAgent;
	var tag = document.getElementById("cordova-script-tag");
	var log = function(msg) {
		return console.log("cordova: " + msg);
	};
	
	window.cordova_platform = u.match(/Android/i) ? "android" : u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i) ? "ios" : "";
	window.cordova_isReady = false;
	window.cordova_clobbers = {};

	if (tag) {
		if (window.cordova_platform) {
			var onDeviceReady = function() {
				var list = window.cordova.require("cordova/plugin_list");
				for (var i = 0; i < list.length; i++) {
					var clobbers = list[i].clobbers || [];
					for (var j = 0; j < clobbers.length; j++) {
						var clobber = clobbers[j];
						window.cordova_clobbers[clobber] = window[clobber];
						//delete window[clobber];
					}
				}
				window.cordova_isReady = true;
				if (window.cordova_ready_callback) {
					var fn = window.cordova_ready_callback;
					delete window.cordova_ready_callback;
					window.cordova_ready(fn);
				}
			};
			document.addEventListener("deviceready", onDeviceReady, false);
			document.write("<script type='text/javascript' src='" + tag.src.replace("cordova.js", window.cordova_platform + "/cordova.js") + "'><\/script>");
		} else {
			log("Only allowed to run in the Android and iOS!");
		}
	} else {
		log("<script id=\"cordova-script-tag\" type=\"text/javascript\" src=\"js/cordova/cordova.js\"></script>");
	}

	window.cordova_exec = function(cmd, opts) {
		if (window.cordova_isReady) {
			if (window.cordova_platform) {
				var action;
				if (typeof cmd == "string") {
					var arr = cmd.split(".");
					var service = window.cordova_clobbers[arr[0]];
					if (service) {
						action = service[arr[1]];
					}
				}
				if (typeof action == "function") {
					opts = opts || {};
					var args = [opts.success || null, opts.error || null, opts];
					return action.apply(this, args);
				} else {
					log("Invalid command: " + cmd);
				}
			} else {
				log("exec " + cmd);
			}
		} else {
			log("Not ready! command: " + cmd);
		}
	};

	window.cordova_ready = function(callback) {
		if (window.cordova_isReady || (window.cordova_platform != "android" && window.cordova_platform != "ios")) {
			if (typeof callback == "function") {
				callback.apply(window);
			}
		} else {
			window.cordova_ready_callback = callback;
		}
	};
})();
/* eslint-enable */
