cordova.define("cloudtplus-plugin-audio-player.AudioPlayer", function(require, exports, module) {

var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec');

var playerObjects = {};

/**
 * This class provides access to the device media, interfaces to sound
 *
 * @constructor
 * @param src                   The file name or url to play
 * @param successCallback       The callback to be called when the file is done playing or recording.
 *                                  successCallback()
 * @param errorCallback         The callback to be called if there is an error.
 *                                  errorCallback(int errorCode) - OPTIONAL
 * @param statusCallback        The callback to be called when media status has changed.
 *                                  statusCallback(int statusCode) - OPTIONAL
 */
var AudioPlayer = function(src, successCallback, errorCallback, statusCallback) {
    argscheck.checkArgs('sFFF', 'AudioPlayer', arguments);
    this.id = utils.createUUID();
    playerObjects[this.id] = this;
    this.src = src;
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
    this.statusCallback = statusCallback;
    this._duration = -1;
    this._position = -1;
    exec(null, this.errorCallback, "AudioPlayer", "create", [this.id, this.src]);
};

// AudioPlayer messages
AudioPlayer.MEDIA_STATE = 1;
AudioPlayer.MEDIA_DURATION = 2;
AudioPlayer.MEDIA_POSITION = 3;
AudioPlayer.MEDIA_ERROR = 9;

// AudioPlayer states
AudioPlayer.MEDIA_NONE = 0;
AudioPlayer.MEDIA_STARTING = 1;
AudioPlayer.MEDIA_RUNNING = 2;
AudioPlayer.MEDIA_PAUSED = 3;
AudioPlayer.MEDIA_STOPPED = 4;
AudioPlayer.MEDIA_MSG = ["None", "Starting", "Running", "Paused", "Stopped"];

// "static" function to return existing objs.
AudioPlayer.get = function(id) {
    return playerObjects[id];
};

/**
 * Start or resume playing audio file.
 */
AudioPlayer.prototype.play = function(options) {
    exec(null, null, "AudioPlayer", "startPlayingAudio", [this.id, this.src, options]);
};

/**
 * Stop playing audio file.
 */
AudioPlayer.prototype.stop = function() {
    var me = this;
    exec(function() {
        me._position = 0;
    }, this.errorCallback, "AudioPlayer", "stopPlayingAudio", [this.id]);
};

/**
 * Seek or jump to a new time in the track..
 */
AudioPlayer.prototype.seekTo = function(milliseconds) {
    var me = this;
    exec(function(p) {
        me._position = p;
    }, this.errorCallback, "AudioPlayer", "seekToAudio", [this.id, milliseconds]);
};

/**
 * Pause playing audio file.
 */
AudioPlayer.prototype.pause = function() {
    exec(null, this.errorCallback, "AudioPlayer", "pausePlayingAudio", [this.id]);
};

/**
 * Get duration of an audio file.
 * The duration is only set for audio that is playing, paused or stopped.
 *
 * @return      duration or -1 if not known.
 */
AudioPlayer.prototype.getDuration = function() {
    return this._duration;
};

/**
 * Get position of audio.
 */
AudioPlayer.prototype.getCurrentPosition = function(success, fail) {
    var me = this;
    exec(function(p) {
        me._position = p;
        success(p);
    }, fail, "AudioPlayer", "getCurrentPositionAudio", [this.id]);
};

/**
 * Release the resources.
 */
AudioPlayer.prototype.release = function() {
    exec(null, this.errorCallback, "AudioPlayer", "release", [this.id]);
};

/**
 * Adjust the volume.
 */
AudioPlayer.prototype.setVolume = function(volume) {
    exec(null, null, "AudioPlayer", "setVolume", [this.id, volume]);
};

/**
 * Audio has status update.
 * PRIVATE
 *
 * @param id            The media object id (string)
 * @param msgType       The 'type' of update this is
 * @param value         Use of value is determined by the msgType
 */
AudioPlayer.onStatus = function(id, msgType, value) {

    var media = playerObjects[id];

    if (media) {
        switch(msgType) {
            case AudioPlayer.MEDIA_STATE :
                if (media.statusCallback) {
                    media.statusCallback(value);
                }
                if (value == AudioPlayer.MEDIA_STOPPED) {
                    if (media.successCallback) {
                        media.successCallback();
                    }
                }
                break;
            case AudioPlayer.MEDIA_DURATION :
                media._duration = value;
                break;
            case AudioPlayer.MEDIA_ERROR :
                if (media.errorCallback) {
                    media.errorCallback(value);
                }
                break;
            case AudioPlayer.MEDIA_POSITION :
                media._position = Number(value);
                break;
            default :
                if (console.error) {
                    console.error("Unhandled AudioPlayer.onStatus :: " + msgType);
                }
                break;
        }
    } else if (console.error) {
        console.error("Received AudioPlayer.onStatus callback for unknown media :: " + id);
    }

};

module.exports = AudioPlayer;

function onMessageFromNative(msg) {
    if (msg.action == 'status') {
        AudioPlayer.onStatus(msg.status.id, msg.status.msgType, msg.status.value);
    } else {
        throw new Error('Unknown media action' + msg.action);
    }
}

if (cordova.platformId === 'android' || cordova.platformId === 'amazon-fireos' || cordova.platformId === 'windowsphone') {

    var channel = require('cordova/channel');

    channel.createSticky('onAudioPlayerPluginReady');
    channel.waitForInitialization('onAudioPlayerPluginReady');

    channel.onCordovaReady.subscribe(function() {
        exec(onMessageFromNative, undefined, 'AudioPlayer', 'messageChannel', []);
        channel.initializationComplete('onAudioPlayerPluginReady');
    });
}

});
