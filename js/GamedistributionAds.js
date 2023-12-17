var GameDistributionAdType = {};
(function (GameDistributionAdType) {
    GameDistributionAdType[GameDistributionAdType["preroll"] = 0] = "preroll";
    GameDistributionAdType[GameDistributionAdType["midroll"] = 1] = "midroll";
})(GameDistributionAdType);
var GameDistributionAds = (function () {
    function GameDistributionAds(gameId, manager) {
        var _this = this;
        this.adManager = manager;
        this.adsEnabled = true;
        this.areAdsEnabled();
        GD_OPTIONS = {
            gameId: gameId,
            advertisementSettings: {
                autoplay: false
            },
            onEvent: function (event) {
                switch (event.name) {
                    case 'SDK_GAME_START':
                        if (typeof gdApi !== 'undefined') {
                            gdApi.play();
                        }
                        _this.adManager.onGameResumed();
                        break;
                    case 'SDK_GAME_PAUSE':
                        _this.adManager.onGamePaused();
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
    }
    GameDistributionAds.prototype.setManager = function (manager) {
        this.adManager = manager;
    };
    GameDistributionAds.prototype.showAd = function () {
        if (!this.adsEnabled) {
            this.adManager.onGameResumed();
        }
        else {
            if (typeof gdApi === 'undefined' || (gdApi && typeof gdApi.showBanner === 'undefined')) {
                //So gdApi isn't available OR
                //gdApi is available, but showBanner is not there (weird but can happen)
                this.adsEnabled = false;
                this.adManager.onGameResumed();
                return;
            }
            gdApi.showBanner();
        }
    };
    //Does nothing, but needed for Provider interface
    GameDistributionAds.prototype.preloadAd = function () {
        return;
    };
    //Does nothing, but needed for Provider interface
    GameDistributionAds.prototype.destroyAd = function () {
        return;
    };
    //Does nothing, but needed for Provider interface
    GameDistributionAds.prototype.hideAd = function () {
        return;
    };
    /**
     * Checks if the ads are enabled (e.g; adblock is enabled or not)
     * @returns {boolean}
     */
    GameDistributionAds.prototype.areAdsEnabled = function () {
        var _this = this;
        var test = document.createElement('div');
        test.innerHTML = '&nbsp;';
        test.className = 'adsbox';
        test.style.position = 'absolute';
        test.style.fontSize = '10px';
        document.body.appendChild(test);
        // let adsEnabled: boolean;
        var isEnabled = function () {
            var enabled = true;
            if (test.offsetHeight === 0) {
                enabled = false;
            }
            test.parentNode.removeChild(test);
            return enabled;
        };
        window.setTimeout(function () {
            _this.adsEnabled = isEnabled();
        }, 100);
    };
    return GameDistributionAds;
}());