var template = _.template(require('./home.html'));
require('./home.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        $.setLoginTokenFormApp();
        this.getData();
    },
    getData: function () {
        var self = this;
        self.audio = null;
        self.timeOut = null;
        self.cache = {
            isLogin: false,
            isShake: true,
            isFree: true,
            isSecond: false,
            isYaoDay: false,
            showList: true,
            yaoTimes: 0,
            timer: null,
            count: 0
        }
        $.checkUser(1, function (bl) {
            self.cache.isLogin = bl;
            $.batSync({
                data: [
                    {url: fresh.apiRoot + 'promotion/shake/yaoDayInfo'},
                    {url: fresh.apiRoot + 'promotion/shake/zjNameList'}
                ],
                success: function (d) {
                    self.cache.isYaoDay = d[0].yaoDayFlag == '1' ? true : false;
                    self.cache.isFree = d[0].yaoTimes == '0' ? true : false;
                    self.cache.isSecond = d[0].yaoTimes == '1' ? true : false;
                    self.cache.yaoTimes = d[0].yaoTimes;
                    self.cache.info = d[0];
                    self.cache.nameList = d[1].nameList;
                    if (self.cache.nameList.length > 0) {
                        self.cache.showList = true;
                    } else {
                        self.cache.showList = false;
                    }
                    self.render();
                }
            });
        })
    },

    render: function () {
        this.$el.html(template(this.cache));
        $.setAppNav('摇Day');
        jsb.setShareInfo({
            title: '哇塞...摇旺每周平分50万',
            desc: '每周三锁定摇旺，摇一摇抢现金',
            icon: $.getStaticOrgin() + '/yaowang/events/yaoday/dist/share.png',
            link: location.href
        });
        //摇一摇
        this.devicemotionFn();
        this.textScroll();
        this.reFreshBonus();
        return this;
    },
    events: {
        'click .share-btn': 'shareBtn',
        'tap .my-bonus': 'myBonus',
        'tap .ui-sign': 'doLogin',
        'tap .ui-free': 'doShake',
        'tap .ui-no-free': 'doShake'
    },
    shareBtn: function () {
        var self = this;
        clearInterval(self.cache.timer);
        sessionStorage.setItem('interval', 5);
        jsb.share();
    },
    myBonus: function () {
        var self = this;
        clearInterval(self.cache.timer);
        sessionStorage.setItem('interval', 5);
        if (self.cache.isLogin) {
            $.changePage('bonus');
        } else {
            jsb.login();
        }
    },
    doLogin: function () {
        var self = this;
        clearInterval(self.cache.timer);
        sessionStorage.setItem('interval', 5);
        jsb.login();
    },
    doShake: function () {
        var self = this;
        clearInterval(self.cache.timer);
        sessionStorage.setItem('interval', 5);
        self.doShakeResult();
    },
    reFreshBonus: function () {
        var self = this;
        if (self.cache.isYaoDay) {
            if (!sessionStorage.getItem('interval') && sessionStorage.getItem('interval') != '5') {
                self.cache.timer = setInterval(function () {
                    self.cache.count++;
                    if (self.cache.count == 5) {
                        sessionStorage.setItem('interval', 5);
                        clearInterval(self.cache.timer);
                    }
                    $.sync({
                        url: fresh.apiRoot + 'promotion/shake/yaoDayInfo',
                        type: 'post',
                        success: function (d) {
                            $('.my-bonus-total').find('span').text(d.totalAmount);
                        }
                    })
                }, 3000);
            }
        }
    },

    textScroll: function () {
        var interval;
        var $winList = $('.ui-winner-list');
        if ($winList.find('li').length >= 5) {
            var list = $winList.clone();
            $winList.html(list[0].innerHTML + list[0].innerHTML);
        }

        function intervalFn() {
            $winList.animate({'margin-top': '-0.55rem'}, 1000, function () {
                var s = Math.abs(parseInt($(this).css("margin-top")));
                if (s >= parseInt(0.55 * 5)) {
                    $(this).find("li").slice(0, 1).appendTo($(this));
                    $(this).css("margin-top", '0');
                }
            });
        }

        interval = setInterval(function () {
            if ($winList.height() <= $('.ui-slider').height()) {
                clearInterval(interval);
            } else {
                intervalFn();
            }
        }, 2000);
    },
    doShakeMove: function () {
        var self = this;
        self.audio = document.getElementById("J_audio");
        self.audio.play();
        self.timeOut = setTimeout(function () {
            self.audio.pause();
            clearTimeout(self.timeOut);
            self.doShakeResult();
        }, 2000);
    },
    doShakeResult: function () {
        var self = this;
        if (self.cache.isYaoDay) {
            if (!self.cache.isFree) {
                if (self.cache.isSecond) {
                    self.noFreeFn();
                    self.cache.isSecond = false;
                } else {
                    self.shaked();
                }
            } else {
                self.shaked();
            }
        } else {
            $.toast('今天不是摇day，周三再来！');
            return;
        }
    },
    shaked: function () {
        var self = this;
        $.sync({
            url: fresh.apiRoot + 'promotion/shake/yaoday',
            type: 'post',
            success: function (d) {
                self.cache.yaoTimes = d.yaoTimes;
                self.cache.isSecond = d.yaoTimes == '1' ? true : false;
                if (!d.hbAmt && !d.djqAmt) {
                    $.toast('<div class="toast-title">啊哦，没有中奖......</div><div>' + d.reward + '</div><div>本次消耗旺豆' + d.consWDNum + '</div>');
                    self.cache.isShake = true;
                    if (self.cache.yaoTimes == 1) {
                        var len = window.location.href.indexOf("?");
                        if (len > 0) {
                            window.location.href = window.location.href.substring(0, len) + "?" + Math.random();
                        } else {
                            window.location.href = window.location.href + "?" + Math.random();
                        }
                    }
                } else {
                    self.winPopWindow({hbAmt: d.hbAmt, djqAmt: d.djqAmt, reward: d.reward, consWDNum: d.consWDNum});
                }
                $('.my-bonus-total').find('span').text(d.totalAmount);
                $('.ui-peas-text').find('span').text(d.wdNum);
                self.cache.yaoTimes = d.yaoTimes;
                self.cache.isFree = false;
            },
            error: function (d) {
                if (d.status != 0) {
                    $.toast(d.msg);
                    self.cache.isFree = false;
                    self.cache.isShake = true;
                }
            }
        })
    },
    winPopWindow: function (obj) {
        var self = this;
        var html = '<div class="pop-header"></div><div class="pop-title">恭喜摇到';
        if (obj.hbAmt && obj.hbAmt != 0) {
            html += '现金' + obj.hbAmt + '元';
        }
        if (obj.djqAmt && obj.djqAmt != 0) {
            html += ' 代金券' + obj.djqAmt + '元'
        }
        html += '</div><div>' + obj.reward + '</div><div>本次消耗旺豆' + obj.consWDNum + '</div>';
        $.popWindow({
            content: html,
            type: '3',
            yes: '继续摇',
            no: '去查看',
            callback: function (bl) {
                if (bl) {
                    self.cache.isShake = true;
                    if (self.cache.yaoTimes == 1) {
                        var len = window.location.href.indexOf("?");
                        if (len > 0) {
                            window.location.href = window.location.href.substring(0, len) + "?" + Math.random();
                        } else {
                            window.location.href = window.location.href + "?" + Math.random();
                        }
                    }
                } else {
                    self.cache.isShake = true;
                    $.changePage('bonus');
                }
            }
        });
    },
    noFreeFn: function (fn) {
        var self = this;
        $.popWindow({
            content: '<div class="pop-header"></div><div class="pop-title">今日免费次数已用完</div><div>继续摇就要花费旺豆啦</div>',
            type: '4',
            yes: '我知道了',
            callback: function (bl) {
                if (bl) {
                    if (fn && typeof fn == 'function') {
                        fn();
                    }
                    self.cache.isShake = true;
                }
            }
        });
    },
    devicemotionFn: function () {
        var self = this;
        if (window.DeviceMotionEvent) {
            var speed = 25;
            var x, y, z, lastX, lastY, lastZ;
            x = y = z = lastX = lastY = lastZ = 0;
            window.addEventListener('devicemotion', function (event) {
                var acceleration = event.accelerationIncludingGravity;
                x = acceleration.x;
                y = acceleration.y;
                z = acceleration.z;
                if (Math.abs(x - lastX) > speed || Math.abs(y - lastY) > speed) {
                    if (self.cache.isLogin && self.cache.isShake) {
                        self.cache.isShake = false;
                        self.doShakeMove();
                    }
                }
                lastX = x;
                lastY = y;
                lastZ = z;
            }, false);
        }
    }
});