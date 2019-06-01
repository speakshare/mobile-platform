(function () {
    var weChatCfg, shareMask = $();

    function getParam(str, key) {
        if (arguments.length == 1) {
            key = str;
            str = location.href;
        }
        var reg = new RegExp('[^\\w*]' + key + '=([^#&]*)', 'i');
        // var r = str.match(reg);
        var r = reg.exec(str);
        return r != null ? decodeURIComponent(r[1]) : null;
    }

    function getParams(str) {
        var ret = {},
            str2 = str.split('?'),
            seg = str2[1] && str2[1].split('&'),
            len = seg && seg.length, i = 0, s;
        for (; i < len; i++) {
            if (!seg[i]) {
                continue;
            }
            s = seg[i].split('=');
            ret[s[0]] = s[1];
        }
        return ret;
    }

    function delParam(str, key) {
        if (arguments.length == 1) {
            key = str;
            str = location.href;
        }
        var uo = getParams(str);
        $.each(uo, function (k, v) {
            if (k == key) {
                delete uo[k]
            }
        });
        return $.param(uo);
    }

    function uniqID(string) {
        string = string || '';
        return string + Math.floor(Math.random() * 10000000) + new Date().getTime().toString().substring(10, 13);
    }

    function getUniqFn(fn) {
        var uniq = uniqID('callback_');
        window[uniq] = function (d) {
            if (d.status == 0) {
                fn(d.data);
            } else {
                console.log(d.msg);
            }
        };
        return uniq;
    }

    function toAppActionString(type, data) {
        return encodeURIComponent(JSON.stringify({
            type: type,
            data: data
        }))
    }

    var JSBridge = function () {
        var isBridge = window.JF,
            isApp = getParam('isApp'),
            shareInfo = {};

        this.share = function () {
            if (isApp) {
                window.location = '/toApp?actions=' +
                    toAppActionString('share', {
                        title: shareInfo.title,
                        desc: shareInfo.desc,
                        icon: shareInfo.icon,
                        link: shareInfo.link
                    });
            } else {
                shareMask = $('.share_mask');
                if (shareMask.length) {
                    shareMask.show().on('tap.share_mask', function () {
                        shareMask.hide().off('tap.share_mask');
                    });
                } else {
                    shareMask = $('<div class="share_mask"></div>');
                    $('body').append(shareMask);
                    shareMask.show().on('tap.share_mask', function () {
                        shareMask.hide().off('tap.share_mask');
                    });
                }
            }
        };

        this.setShareInfo = function (options) {
            var title = options.title || '跟我来摇旺赚钱吧，100元返现券、14%新手专享产品和万元体验金等你来拿~',
                desc = options.desc || '不会理财的人不漂亮！',
                link = options.link || location.href,
                icon = options.icon || 'https://file.91yaowang.com/yaowang/dist/globalImg/logo.png',
                callback = options.callback || function () {
                    };
            link = link.split('?')[0] + '?' + delParam(link, 'isapp');
            link = link.split('?')[0] + '?' + delParam(link, 'loginToken');
            shareInfo = {
                title: title,
                desc: desc,
                link: link,
                icon: icon
            };
            if (weChatCfg) {
                _resetShareInfo();
            } else {
                $.ajax({
                    type: 'get',
                    url: location.origin + '/app/oauth/config.html',
                    data: {url: location.href.split('#')[0]},
                    dataType: 'json',
                    success: function (d) {
                        if(d.status==0){
                            weChatCfg = d.data;
                            _initWeChat(d.data);
                        }
                    }
                });
            }

            function _resetShareInfo() {
                var cfg = {
                    title: title,
                    desc: desc,
                    link: link,
                    imgUrl: icon,
                    success: function () {
                        callback();
                        shareMask.hide().off('tap.share_mask');
                    },
                    cancel: function () {
                        shareMask.hide().off('tap.share_mask');
                    }
                };
                wx.showOptionMenu();
                wx.ready(function () {
                    wx.onMenuShareAppMessage(cfg);
                    wx.onMenuShareTimeline(cfg);
                    wx.onMenuShareQQ(cfg);
                    wx.onMenuShareWeibo(cfg);
                });
            }

            function _initWeChat() {
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: weChatCfg.appid, // 必填，公众号的唯一标识
                    timestamp: weChatCfg.timestamp, // 必填，生成签名的时间戳
                    nonceStr: weChatCfg.nonceStr, // 必填，生成签名的随机串
                    signature: weChatCfg.signature,// 必填，签名，见附录1
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'openLocation', 'getLocation', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2 onMenuShareAppMessage showOptionMenu
                });
                _resetShareInfo();
            }
        };

        this.toList = function () {
            if (isApp) {
                window.location = '/toApp?actions=' +
                    toAppActionString('productList', '');
            } else {
                window.location = '/weizhan/#product';
            }
        };

        this.toDetail = function (pid) {
            if (isApp) {
                window.location = '/toApp?actions=' +
                    toAppActionString('productDetail', {
                        productNo: pid
                    });
            } else {
                window.location = '/weizhan/#product/'+pid;
            }
        };

        this.transferList = function () {
            if (isApp) {
                window.location = '/toApp?actions=' +
                    toAppActionString('transferList', '');
            } else {
                window.location = '/weizhan/#transfer';
            }
        };

        this.transferDetail = function (orderNo) {
            if (isApp) {
                window.location = '/toApp?actions=' +
                    toAppActionString('transferDetail', {
                        orderNo: orderNo
                    });
            } else {
                window.location = '/weizhan/#transfer/detail/' + orderNo;
            }
        };

        function yaobao(id) {
            if (isApp) {
                window.location = '/toApp?actions=' +
                    toAppActionString('yaobaoDetail', {
                        productNo: id
                    });
            } else {
                window.location = '/weizhan/#yaobao/' + id;
            }
        }

        this.yaobao = function (id) {
            if (id > 0) {
                yaobao(id)
            } else {
                $.ajax({
                    url: location.origin + '/app/webservice/v2/newProductList',
                    type: 'post',
                    dataType:'json',
                    data: {
                        currentPage: 0,
                        pageCount: 15,
                        productType: 4,
                        channelCode: ''
                    },
                    success: function (d) {
                        if(d.status==0)
                            yaobao(d.data.currentProduct.productNo);
                    }
                });
            }
        }

        this.mall = function () {
            if (isApp) {
                window.location = '/toApp?actions=' +
                    toAppActionString('wangjiaHome', '');
            } else {
                window.location = '/weizhan/#mall';
            }
        };

        this.mallDetail = function (mid) {
            if (isApp) {
                window.location = '/toApp?actions=' +
                    toAppActionString('wangjiaDetail', {
                        id: mid
                    });
            } else {
                window.location = '/weizhan/#mall/goodsDetail/' + mid;
            }
        };

        this.fund = function () {
            if (isApp) {
                window.location = '/toApp?actions=' +
                    toAppActionString('fundList', '');
            } else {
                window.location = '/weizhan/#fund';
            }
        };

        this.toFundDetail = function (fundCode) {
            if (isApp) {
                window.location = '/toApp?actions=' +
                    toAppActionString('fundDetail', {
                        fundCode: fundCode
                    });
            } else {
                window.location = '/weizhan/#app/download';
            }
        };

        this.couponList = function () {
            if (isApp) {
                window.location = '/toApp?actions=' +
                    toAppActionString('giftList', '');
            } else {
                window.location = '/weizhan/#uc/welfare/couponList';
            }
        };

        this.VIP = function () {
            if (isApp) {
                window.location = '/toApp?actions=' +
                    toAppActionString('VIP', '');
            } else {
                window.location = '/weizhan/#member/home';
            }
        };

        this.invite = function () {
            if (isApp) {
                window.location = '/weizhan/#uc/invite';
            } else {
                window.location = '/weizhan/#uc/invite';
            }
        };

        this.login = function (phoneNum) {
            phoneNum = phoneNum || '';
            if (isApp) {
                window.location = '/toApp?actions=' +
                    toAppActionString('login', {
                        phoneNum: phoneNum
                    });
            } else {
                localStorage.setItem('yw_user_after_login_link', location.href);
                window.location = '/weizhan/#login?mobile=' + phoneNum;
            }
        };

        this.register = function (phoneNum) {
            phoneNum = phoneNum || '';
            if (isApp) {
                window.location = '/toApp?actions=' +
                    toAppActionString('register', {
                        phoneNum: phoneNum
                    });
            } else {
                localStorage.setItem('yw_user_after_login_link', location.href);
                window.location = '/weizhan/#register?mobile=' + phoneNum;
            }
        };

        this.setTitle = function (title) {
            if (isApp) {
                window.location = '/toApp?actions=' +
                    toAppActionString('navigationTitle', {
                        title: title
                    });
            } else {
                $.setWeixinTitle(title);
            }
        };

        this.toUcHome = function () {
            if (isApp) {
                window.location = '/toApp?actions=' +
                    toAppActionString('assets', '');
            } else {
                window.location = '/weizhan/#uc/home';
            }
        };

        this.toUcSetting = function () {
            if (isApp) {
                window.location = '/toApp?actions=' +
                    toAppActionString('setting', '');
            } else {
                window.location = '/weizhan/#uc/setting';
            }
        };

        this.appTel = function (tel) {
            if (isApp) {
                window.location = '/toApp?actions=' +
                    toAppActionString('tel', {
                        phoneNum: tel
                    });
            } else {
                window.location = 'tel:' + tel;
            }
        };

        this.goBack = function (refresh) {
            if (isApp) {
                window.location = '/toApp?actions=' +
                    toAppActionString('back',{
                        dataRefresh:!!refresh
                    });
            }else{
                history.go(-1);
            }
        };
        
        this.goToApp = function (type, data) {
            if (isApp) {
                window.location = '/toApp?actions=' + toAppActionString(type, data || '');
                return true;
            } else {
                return false;
            }
        }

        this.getCallback=function(){
            var cbs= getParam('callback'),cb;
            if(cbs=='') {
                return false;
            }
            try {
                cb= JSON.parse(cbs);
                if(cb.status==1){
                    return cb.data;
                }else{
                    return false;
                }
            }catch (e){

            }
        }
    };

    window.jsb = new JSBridge();
}());