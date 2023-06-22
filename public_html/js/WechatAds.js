var WechatAdprovider = /** @class */ (function () {
    function WechatAdprovider(manager) {
        this.adsEnabled = true;
        this.rewardedAd = null;
        this.adManager = manager;
        this.adManager.isReady = true;
    }
    WechatAdprovider.prototype.showAd = function () {
        var _this = this;
        if (!this.adsEnabled) {
            console.log('Ads disablewd!!!!');
            this.resumeGameplay();
            return;
        }
        if (!this.adManager.bannerActive) {
            console.log('no banner active!!!!!');
            this.resumeGameplay();
            return;
        }
        this.adManager.onContentPaused.dispatch();
        this.rewardedAd.show()
            .then(function () {
            _this.adManager.bannerActive = false;
            console.log('Ad is beeing shown');
        })
            .catch(function () {
            _this.adManager.bannerActive = false;
            _this.rewardedAd.load();
            _this.resumeGameplay();
            console.log('Ad failed to show');
        });
        console.log('called sho ad');
        return;
    };
    //Does nothing, but needed for Provider interface
    WechatAdprovider.prototype.preloadAd = function (adUnitId) {
        var _this = this;
        try {
            if (!this.rewardedAd) {
                this.rewardedAd = wx.createRewardedVideoAd({ adUnitId: adUnitId });
                this.rewardedAd.onLoad(function () {
                    console.log('ad loaded');
                    _this.adManager.bannerActive = true;
                });
                this.rewardedAd.onClose(function (data) {
                    console.log('ad closed', data);
                    _this.adManager.bannerActive = false;
                    if (data.isEnded) {
                        _this.adManager.onAdRewardGranted();
                    }
                    _this.resumeGameplay();
                });
                this.rewardedAd.onError(function (e) {
                    console.log('ad error', e);
                });
            }
            this.rewardedAd.load();
        }
        catch (e) {
            this.adsEnabled = false;
        }
        return;
    };
    WechatAdprovider.prototype.resumeGameplay = function () {
        this.adManager.onGameResumed();
    };
    //Does nothing, but needed for Provider interface
    WechatAdprovider.prototype.destroyAd = function () {
        return;
    };
    //Does nothing, but needed for Provider interface
    WechatAdprovider.prototype.hideAd = function () {
        return;
    };
    return WechatAdprovider;
}());
