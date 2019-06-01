(function () {
    var weChatCfg,shareMask=$();
    function getParam(str,key){
        if(arguments.length==1){
            key=str;
            str=location.href;
        }
        var reg = new RegExp('(\\w*'+key+')'+'=([^#&]*)','i');
        var r = str.match(reg);
        if (r!=null && r[1]==key)
            return decodeURIComponent(r[2])
        return null;
    }

    function getParams(str) {
        var ret = {},
            str2=str.split('?'),
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

    function delParam(str,key){
        if(arguments.length==1){
            key=str;
            str=location.href;
        }
        var uo=getParams(str);
        $.each(uo,function(k,v){
            if(k==key){
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

    var JSBridge = function () {
        var isBridge = window.JF,
            isApp = getParam('isapp'),
            shareInfo={};
        this.share = function () {
            // if (isBridge) {
            //     JF.navigator_setShareInfo(JSON.stringify({
            //         title: shareInfo.title,
            //         desc: shareInfo.desc,
            //         icon: shareInfo.icon,
            //         link: shareInfo.link
            //     }), getUniqFn(function (d) {
            //         callback(d);
            //         shareMask.hide().off('tap.share_mask');
            //     }));
            // } else
            if (isApp) {
                window.location = '/invitefriends/toapp?jsonstr=' +encodeURIComponent( JSON.stringify({
                        title: shareInfo.title,
                        desc: shareInfo.desc,
                        icon: shareInfo.icon,
                        link: shareInfo.link

                    }));
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
        this.setShareInfo=function(options){

            var title = options.title || '跟我来摇旺赚钱吧，100元返现券、14%新手专享产品和万元体验金等你来拿~',
                desc = options.desc || '不会理财的人不漂亮！',
                link = options.link || location.href,
                icon = options.icon || 'https://file.91yaowang.com/yaowang/dist/globalImg/logo.png',
                callback = options.callback || function () {};
            link=link.split('?')[0]+'?'+delParam(link,'isapp');
            link=link.split('?')[0]+'?'+delParam(link,'loginToken');
            shareInfo={
                title:title,
                desc:desc,
                link:link,
                icon:icon
            };
            if(weChatCfg){
                _resetShareInfo();
            }else {
               $.sync({
                    method: 'get',
                    url: location.origin + '/app/oauth/config.html',
                    data: {url: location.href.split('#')[0]},
                    dataType: 'json',
                    success: function (d) {
                        weChatCfg=d;
                        _initWeChat();
                    }
                });
            }

            function _resetShareInfo(){
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
                // wx.ready(function () {
                //     wx.onMenuShareAppMessage(cfg);
                //     wx.onMenuShareTimeline(cfg);
                //     wx.onMenuShareQQ(cfg);
                //     wx.onMenuShareWeibo(cfg);
                //     wx.onMenuShareQZone(cfg);
                // });
                _resetShareInfo();
            }
        };
        this.toList = function () {
            // if (isBridge) {
            //     JF.passport_productList();
            // } else
            if (isApp) {
                // window.location='/weizhan/product/productClassifyList';
                window.location = '/product/list';
            } else {
                window.location = '/weizhan/#product';
            }
        };
        this.toDetail = function (pid) {
            if (isBridge) {
                JF.passport_productDetail(JSON.stringify({productNo: pid}));
            } else if (isApp) {
                window.location = '/productNo/' + pid;
            } else {
                window.location = '/weizhan/#product';
            }
        };
        this.login = function (id, callback) {
            if (typeof(id == 'function')) {
                callback = id;
                id = '';
            }
            // if (isBridge) {
            //     JF.passport_login(JSON.stringify({phoneNum: id}), getUniqFn(function (d) {
            //         localStorage.setItem('yw_user_loginToken', d);
            //         if (callback) {
            //             callback();
            //         } else {
            //             location.reload();
            //         }
            //     }));
            // } else
            if (isApp) {
                window.location = '/member/login?phoneNum=' + id;
            } else {
                localStorage.setItem('yw_user_after_login_link', location.href);
                window.location = '/weizhan/#login';
            }
        };
        this.register = function (id, callback) {
            if (typeof(id == 'function')) {
                callback = id;
                id = '';
            }
            if (isBridge) {
                JF.passport_register(JSON.stringify({phoneNum: id}), getUniqFn(function (d) {
                    localStorage.setItem('yw_user_loginToken', d);
                    if (callback) {
                        callback();
                    } else {
                        location.reload();
                    }
                }));
            } else if (isApp) {
                window.location = '/register?phoneNum=' + id;
            } else {
                window.location = '/weizhan/#register';
            }
        };
        this.setTitle = function (title) {
            if (isBridge) {
                JF.navigator_setTitle(JSON.stringify({title: title}));
            } else {
                document.title = title;
                // $.setAppTitle(title);
                // hack在微信IOS webview中无法修改document.title的情况
                if ($.isWeixin() && $.isIOS()) {
                    var $iframe = $('<iframe src="https://file.91yaowang.com/yaowang/dist/source/mall/images/9e3e8cf0.png" style="border: 0;outline: 0"></iframe>');
                    $iframe.on('load', function () {
                        setTimeout(function () {
                            $iframe.off('load').remove();
                        }, 0);
                    }).appendTo('body');
                }
            }
        };

        this.toUcHome=function(){
            // if (isBridge) {
            //     JF.passport_productList();
            // } else
            if (isApp) {
                window.location = '/uc/home';
            } else {
                window.location = '/weizhan/#uc/home';
            }
        };
        
        this.toUcSetting=function(){
            // if (isBridge) {
            //     JF.passport_productList();
            // } else
            if (isApp) {
                window.location = '/uc/setting';
            } else {
                window.location = '/weizhan/#uc/setting';
            }
        };

        this.invite = function (code) {
            // if (isBridge) {
            //     JF.passport_invite(JSON.stringify({code: code}));
            // } else
            if (isApp) {
                window.location = '/invite?code=' + code;
            } else {
                window.location = '/weizhan/#uc/invite';
            }
        };
        this.transferList=function () {
            if(isApp){
                window.location = "product/list/transfer";
            }else{
                window.location.href='/weizhan/#transfer';
            }
        };

  

        function yaobao(id) {
            if (isBridge) {
                JF.passport_shakeTreasure(JSON.stringify({code: id}));
            } else if (isApp) {
                window.location = '/yaobao?pid=' + id;
            } else {
                window.location = '/weizhan/#yaobao';
            }
        }

        this.yaobao = function (id) {
            if (id > 0) {
                yaobao(id)
            } else {
                $.sync({
                    // url: 'https://app.91yaowang.com/app/webservice/v2/newProductList',
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
                window.location = '/mall';
            } else {
                window.location = '/weizhan/#mall';
            }
        }
        this.toFundDetail=function(code){
            // if (isBridge) {
            //     JF.passport_ScoreMarket();
            // } else
            if (isApp) {
                window.location = '/fund/' + code;
            } else {
                window.location='/weizhan/#app/download';
            }
        }
    }
    window.jsb = new JSBridge();
}());