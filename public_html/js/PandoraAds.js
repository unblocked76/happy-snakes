var EnumAdStatus;
(function (EnumAdStatus) {
    EnumAdStatus[EnumAdStatus["error"] = 0] = "error";
    EnumAdStatus[EnumAdStatus["skip"] = 1] = "skip";
    EnumAdStatus[EnumAdStatus["completed"] = 2] = "completed";
})(EnumAdStatus || (EnumAdStatus = {}));

var PandoraAdProvider = /** @class */ (function () {
    function PandoraAdProvider(gameId, manager, placementId) {
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
        this.placementId = placementId;
    }
    
    PandoraAdProvider.prototype.showAd = function (adType) {
        var _this = this;
        if (adType === void 0) { adType = AdType.interstitial; }
        if (!this.adsEnabled || adType === AdType.interstitial) {
            this.resumeGameplay();
            return;
        }
        if (adType === AdType.rewarded) {
            Pandora.AD.prepared(this.placementId).then(function (isReady) {
                if (isReady) {
                    _this.adManager.onGamePaused();
                    Pandora.AD.show(_this.placementId).then(function (statusObject) {
                        var adStatus = statusObject[_this.placementId];
                        if (adStatus === EnumAdStatus.completed || adStatus === EnumAdStatus.skip) {
                            _this.adManager.onAdRewardGranted();
                        }
                        _this.resumeGameplay();
                    }).catch(function () {
                        _this.resumeGameplay();
                    });
                }
                else {
                    _this.resumeGameplay();
                }
            }).catch(function () {
                _this.resumeGameplay();
            });
        }
    };
    PandoraAdProvider.prototype.resumeGameplay = function () {
        this.adManager.onGameResumed();
    };
    //Does nothing, but needed for Provider interface
    PandoraAdProvider.prototype.preloadAd = function (adType) {
        if (adType === void 0) { adType = PhaserAds.AdType.interstitial; }
        return;
    };
    //Does nothing, but needed for Provider interface
    PandoraAdProvider.prototype.destroyAd = function () {
        return;
    };
    //Does nothing, but needed for Provider interface
    PandoraAdProvider.prototype.hideAd = function () {
        return;
    };
    PandoraAdProvider.prototype.areAdsEnabled = function () {
        var _this = this;
        if (typeof Pandora !== 'undefined') {
            this.adsEnabled = true;
        }
        else {
            window.addEventListener('PandoraReady', function () {
                _this.adsEnabled = true;
            });
        }
    };
    return PandoraAdProvider;
}());