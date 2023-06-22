var SMAdType;
(function (SMAdType) {
    SMAdType[SMAdType["interstitial"] = 100] = "interstitial";
    SMAdType[SMAdType["rewarded"] = 101] = "rewarded";
})(SMAdType || (SMAdType = {}));

// SmInstance Ads <START>
var SmInstantAdProvider = /** @class */ (function () {
    function SmInstantAdProvider(gameId, manager) {
        this.adsEnabled = false;
        this.areAdsEnabled();
        this.adManager = manager;
        GD_OPTIONS = {
            gameId: gameId,
            advertisementSettings: {
                autoplay: false
            },
            onEvent: function (event) {
                switch (event.name) {
                    case 'SDK_GAME_START':
                        break;
                    case 'SDK_GAME_PAUSE':
                        break;
                    case 'SDK_READY':
                        manager.isReady = true;
                        break;
                    case 'SDK_ERROR':
                        break;
                }
            }
        };
        //Include script. even when adblock is enabled, this script also allows us to track our users;
        (function (d, s, id) {
            var js;
            var fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = 'patch/js/gd-main.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'gamedistribution-jssdk'));
        SMGameInstant.context.onInit(function () {
            console.log('Game initialized');
        });
    }
    SmInstantAdProvider.prototype.setManager = function (manager) {
        
    };
    SmInstantAdProvider.prototype.showAd = function (adType) {
        var _this = this;
        if (adType === void 0) { adType = AdType.interstitial; }
        if (!this.adsEnabled) {
            this.resumeGameplay();
            return;
        }
        var internalAdType = (adType === AdType.interstitial) ? SMAdType.interstitial : SMAdType.rewarded;
        SMGameInstant.context.actionHasAdvertisement(internalAdType, function (adAvailable) {

            adAvailable = parseInt(adAvailable, 10);
            console.log('ad available?: ', internalAdType, adAvailable, 1 === adAvailable);
            if (1 === adAvailable) {
                //ad available
                _this.adManager.onGamePaused();
                SMGameInstant.context.actionShowAdvertisement(internalAdType, function (adShown) {
                    adShown = parseInt(adShown, 10);
                    console.log('tried to show ad: ', internalAdType, adShown);
                    if (1 === adShown) {
                        if (SMAdType.rewarded === internalAdType) {
                            _this.adManager.onAdRewardGranted();
                        }
                    }
                    _this.resumeGameplay();
                });
            }
            else {
                //no ad available, resuming
                _this.resumeGameplay();
            }
        });
    };
    SmInstantAdProvider.prototype.resumeGameplay = function () {
        this.adManager.onGameResumed();
    };
    //Does nothing, but needed for Provider interface
    SmInstantAdProvider.prototype.preloadAd = function (adType) {
        if (adType === void 0) { adType = AdType.interstitial; }
        var internalAdType = (adType === AdType.interstitial) ? SMAdType.interstitial : SMAdType.rewarded;
        SMGameInstant.context.actionLoadAdvertisement(internalAdType, function (responseData) {
            responseData = parseInt(responseData, 10);
        });
        return;
    };
    //Does nothing, but needed for Provider interface
    SmInstantAdProvider.prototype.destroyAd = function () {
        return;
    };
    //Does nothing, but needed for Provider interface
    SmInstantAdProvider.prototype.hideAd = function () {
        return;
    };
    SmInstantAdProvider.prototype.areAdsEnabled = function () {
        if (typeof SMGameInstant !== 'undefined') {
            this.adsEnabled = true;
        }
    };
    return SmInstantAdProvider;
}());

/**
 * Copyright (c) 2018-present, CMCM, Inc. All rights reserved.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to use,
 * copy, modify, and distribute this software in source code or binary form for use
 * in connection with the web services and APIs provided by CMCM.
 *
 * As with any software that integrates with the CMCM platform, your use of
 * this software is subject to the CMCM Platform Policy
 * [http://www.cmcm.com/protocol/site/privacy-cn.html]. This copyright notice shall be
 * included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


var SMGameInstant = {
    context : {
        //Game Lifecycle start.
        onInit : function(responseCallback){
            callNativeHandle("onInit", {'param': ''}, function(responseData){
                console.log("onInit responseData is :" + responseData);
                responseCallback(responseData);
            });
        },
        onStartGame : function(responseCallback){
            callNativeHandle("onStartGame", {'param': ''}, function(responseData){
                console.log("onStartGame responseData is :" + responseData);
                responseCallback(responseData);
            });
        },
        onGameOver : function(){
            callNativeHandle("onGameOver", {'param': ''}, function(responseData){
                console.log("onGameOver responseData is :" + responseData);
            });
        },
        onPauseGame : function (){
            callNativeHandle("onPauseGame", {'param': ''}, function(responseData){
                console.log("onPauseGame responseData is :" + responseData);
            });
        },
        onResumeGame : function () {
            callNativeHandle("onResumeGame", {'param': ''}, function(responseData){
                console.log("onResumeGame responseData is :" + responseData);
            });
        },
         //Game Lifecycle end.

        //------------------------------------------------------------------------------------------
        actionLoadAdvertisement : function (type, responseCallback){
            callNativeHandle("actionLoadAdvertisement", {'param': type}, function(responseData){
                console.log("actionLoadAdvertisement responseData is :" + responseData);
                responseCallback(responseData);
            });
        },

        actionShowAdvertisement : function (type, responseCallback){
            callNativeHandle("actionShowAdvertisement", {'param': type}, function(responseData){
                console.log("actionShowAdvertisement responseData is :" + responseData);
                responseCallback(responseData);
            });
        },

        actionHasAdvertisement : function (type , responseCallback){
            callNativeHandle("actionHasAdvertisement", {'param': type}, function(responseData){
                  console.log("actionHasAdvertisement responseData is :" + responseData);
                  responseCallback(responseData);
               });
        },

        actionLogcat : function (logs) {
             //call native method
            callNativeHandle('actionLogcat', {'logs': logs}
                        , function(responseData) {
                        });
        },

        actionReportData : function (table, dataString, force) {
            callNativeHandle("actionReportData", {'table': table, 'data': dataString, 'force' : force},
             function(responseData){
                  console.log("actionReportData responseData is :" + responseData);
                  responseCallback(responseData);
             });
        },

        actionAddDesktopShortCut : function (appId, responseCallback) {
            callNativeHandle("actionAddDesktopShortCut", {'appId': appId},
             function(responseData){
                  console.log("actionAddDesktopShortCut responseData is :" + responseData);
                  responseCallback(responseData);
             });
        }
    }
};

//JavaScript call Java Native mehtod.
function callNativeHandle(handleName, data, responseCallback){
    if(typeof window.WebViewJavascriptBridge !== 'undefined')
    {
        window.WebViewJavascriptBridge.callHandler(handleName, data, function(responseData){
            responseCallback(responseData);
        });
    }
    else
    {
        if(handleName == "actionHasAdvertisement")
        {
            responseCallback(0);
        }

    }
}

//the method is connect webview JavaScript Bridge.
function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener(
            'WebViewJavascriptBridgeReady'
            , function() {
                callback(WebViewJavascriptBridge)
            },
            false
        );
    }
}

connectWebViewJavascriptBridge(function(bridge) {
    bridge.init(function(message, responseCallback) {
        console.log('JS got a message', message);
        var data = {
            'Javascript Responds': '测试中文!'
        };

        if (responseCallback) {
            console.log('JS responding with', data);
            responseCallback(data);
        }
    });

    bridge.registerHandler("functionInJs", function(data, responseCallback) {
        if (responseCallback) {
            var responseData = "Javascript Says Right back Kong!";
            responseCallback(responseData);
        }
    });

    bridge.registerHandler("functionInJsOsVersion", function(data, responseCallback) {

            SMGameInstant.context.osversion = data;
            console.log("osversion:" + SMGameInstant.context.appId);

            if (responseCallback) {
                var responseData = "Javascript Says osVersion is :" + data;
                responseCallback(responseData);
            }
        });

    bridge.registerHandler("functionInJsAppId", function(data, responseCallback) {

        SMGameInstant.context.appId = data;
        console.log("appId:" + SMGameInstant.context.appId);

        if (responseCallback) {
            var responseData = "Javascript Says appid is :" + data;
            responseCallback(responseData);
        }
    });
})


