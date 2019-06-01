$.extend({
    checkNetwork: function () {
//        if (navigator.onLine) {
//            return true;
//        } else {
//            $.toast('您的网络不太给力哦~', 500);
//            return false;
//        }
        return true;
    },
    serverError: function () {
        $.toast('服务器忙，请稍候再试!', 1500);
    },
    isRetina: function () {
        return window.devicePixelRatio && window.devicePixelRatio >= 1.5;
    },
    uniqID: function (string) {
        string = string || '';
        return string + Math.floor(Math.random() * 10000000) + new Date().getTime().toString().substring(10, 13);
    },
    scrollTo: function (obj) {
        if (typeof obj === "number") {
            $(window).scrollTop(obj);
        } else {
            var offset = $(obj).offset();
            $(window).scrollTop(offset.top);
        }
    },
    isWeixin: function () {
        return /MicroMessenger/i.test(navigator.userAgent);
    },
    isIOS: function () {
        return /ipad|iphone|iPod|Macintosh|mac os/i.test(navigator.userAgent);
    },
    isAndroid: function () {
        return /Android/i.test(navigator.userAgent);
    },
    charLen: function (string) {
        if (!string) return 0;
        return string.replace(/[^\x00-\xff]/g, '00').length;
    },
    isMobileNum: function (num) {
        return !isNaN(num) && /^1\d{10}$/.test(num);
    },
    checkPhoneNumberOperator: function (telphone) {
        var telphone = $.trim(telphone);
        var isChinaMobile = /^134[0-8]\d{7}$|^(?:13[5-9]|147|15[0-27-9]|178|18[2-478])\d{8}$/;//移动
        var isChinaUnion = /^(?:13[0-2]|145|15[56]|176|18[56])\d{8}$/; //联通
        var isChinaTelcom = /^(?:133|153|177|18[019])\d{8}$/;//电信
        var isOtherTelphone = /^170([059])\d{7}$/;
        if (isChinaMobile.test(telphone)) {
            return 1;//'ChinaMobile'
        }
        else if (isChinaUnion.test(telphone)) {
            return 2;//'ChinaUnion'
        }
        else if (isChinaTelcom.test(telphone)) {
            return 3;//'ChinaTelcom'
        }
        else if (isOtherTelphone.test(telphone)) {
            return 0;//'other'
        } else {
            return -1;//'error'
        }

    },
    isPassword: function (str) {
        var reg = /^(([a-z]+[0-9]+)|([0-9]+[a-z]+))[a-z0-9]*$/i;
        return reg.test(str);
    },
    setCache: function (key, value, exp, type) {
        //过期时间默认1天
        exp = exp || 86400;
        type = type || 0;
        !type && (key += '_' + curUserID);
        fresh.cache[key] = value;
        store.set(key, value, exp);
    },
    getCache: function (key, type) {
        type = type || 0;
        !type && (key += '_' + curUserID);
        return (fresh.cache[key] || store.get(key));
    },
    setToken: function (token) {
        localStorage.setItem('yw_user_loginToken', token)
    },
    getToken: function () {
        return localStorage.getItem('yw_user_loginToken') || '';
        //return localStorage.getItem('yw_user_loginToken')==null?'':localStorage.getItem('yw_user_loginToken');
    },
    setIsApp: function (isapp) {
        $.setCache('IsApp', isapp, 86400, 1);
    },
    getIsApp: function () {
        return $.getCache('IsApp', 1);
    },
    setNub: function (Nub) {
        localStorage.setItem('yw_user_phoneNum', Nub)
    },
    getNub: function () {
        return localStorage.getItem('yw_user_phoneNum')
    },
    setLogin: function (Nub) {
        $.setCache('isLogin', Nub, 86400, 1);
        // localStorage.setItem('isLogin',Nub)
    },
    getLogin: function () {
        return $.getCache('isLogin', 1);
        //localStorage.getItem('isLogin')=="true"?true:false;
    },
    setafterLogin: function (Nub) {
        localStorage.setItem('yw_user_after_login_link', Nub)
    },
    getafterLogin: function () {
        return localStorage.getItem('yw_user_after_login_link')
    },
    shareQQAddress: function (title, summary) {
        return 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + encodeURIComponent('http://channel.hujiang.com/ch_click.aspx?ch_source=st_qq&page=' + location.href)
            + '&showcount=0&summary=' + encodeURIComponent(summary) + '&desc=' + encodeURIComponent(summary)
            + '&title=' + encodeURIComponent(title) + '&site=' + encodeURIComponent('摇旺理财')
            + '&pics=' + encodeURIComponent('http://ms.hujiang.com/st/images/icon114.png')
    },
    shareWeiboAddress: function (title) {
        var url = escape('http://channel.hujiang.com/ch_click.aspx?ch_source=st_weibo&amp;page=' + location.href);
        return 'http://service.weibo.com/share/share.php?url=' + url
            + '&type=icon&language=zh_cn&title=' + encodeURIComponent(title + '（阅读原文：' + location.href + '，下载沪江手机客户端：http://hj.vc/vrjU3vJ）')
            + '&searchPic=http://ms.hujiang.com/st/images/icon114.png&style=simple'
    },
    setWeixinTitle: function (title) {
        document.title = title;
        // $.setAppTitle(title);
        // hack在微信IOS webview中无法修改document.title的情况
        if ($.isWeixin() && $.isIOS()) {
            var $iframe = $('<iframe src="https://static.91yaowang.com/yaowang/dist/source/mall/images/9e3e8cf0.png" style="border: 0;outline: 0"></iframe>');
            $iframe.on('load', function () {
                setTimeout(function () {
                    $iframe.off('load').remove();
                }, 0);
            }).appendTo('body');
        }
    },
    setAppTitle: function (title) {
        if (window.JF || $.getParam(location.href, 'isapp')) {
            setTimeout(function () {
                JF.navigator_setTitle(title);
            }, 500);
        }
    },
    setCursorPosition: function (htmlTag, start, end) {
        if (start === undefined) start = htmlTag.value.length;
        if (end === undefined) end = htmlTag.value.length;
        if (htmlTag.setSelectionRange) { //W3C
            setTimeout(function () {
                htmlTag.setSelectionRange(start, end);
                htmlTag.focus();
            }, 0);
        } else if (htmlTag.createTextRange) { //IE
            var textRange = htmlTag.createTextRange();
            textRange.moveStart("character", start);
            textRange.moveEnd("character", end);
            textRange.select();
        }
    },
    getLimitString: function (str, limit) {
        var pos = 0;
        if (!limit || $.charlen(str) <= limit) return str;
        for (var i = 0; i < str.length; i++) {
            pos += str.charCodeAt(i) > 255 ? 2 : 1;
            if (limit <= pos) {
                return str.substr(0, i + 1);
                break;
            }
        }
    },
    starFormat: function (index) {
        var str = '', textstr = '';
        for (var i = 0; i < parseInt(index); i++) {
            str += '<span class="star"></span>';
        }
        if (index == '1') {
            textstr = '一星理财大使';
        } else if (index == '2') {
            textstr = '二星理财大使';
        } else if (index == '3') {
            textstr = '三星理财大使';
        } else {
            textstr = '普通用户';
        }
        return {
            star: str,
            text: textstr
        }
    },
    scoreFormat: function (num, format) {
        if (isNaN(num) || !num) return '<span class="score_num_b">0<span>';
        num = num.toFixed('2').toString().split('.');
        format = format || 'html';
        if (format == 'html') {
            return '<span class="score_num_b">' + num[0] + '.</span><span class="score_num_s">' + num[1] + '%</span>'
        } else {
            return {
                b: num[0],
                s: num[1]
            }
        }
    },
    numberFormat: function (num, dot) {
        dot = dot || 1;
        if (isNaN(num = parseInt(num))) return 0..toFixed(dot);
        return num >= 10000 ? ((num / 10000).toFixed(dot) + '万') : num;
    },
    changePage: function (hash_path, replace) {
        fresh.router.navigate(hash_path, {trigger: true, replace: replace});
    },
    //没有更多列表统一处理
    hasNotMoreData: function (obj, hasData, notDataText) {
        if (hasData) {
            obj.append('<div class="has_not_data">' + (notDataText || '暂无数据') + '</div>');
        } else {
            obj.append('<div class="has_not_more_topic">没有更多了</div>');
            setTimeout(function () {
                obj.find('.has_not_more_topic').fadeOut();
            }, 3000);
        }
    },
    getParam: function (str, key) {
        if (arguments.length == 1) {
            key = str;
            str = location.href;
        }
        var reg = new RegExp('[^\\w*]' + key +  '=([^#&]*)', 'i');
        // var r = str.match(reg);
        var r=reg.exec(str);
        return r != null?decodeURIComponent(r[1]):null;
        //
        // if (r != null && r[1] == key)
        //     return decodeURIComponent(r[2])
        // return null;
    },
    sendSMS: require('./sendSMS'),
    back: function () {
        window.history.back(-1);
    },
    setLoginTokenFormApp: function () {
        var url = location.href,
            isApp = $.getParam(url, 'isapp'),
            type=$.getParam(url, 'type'),
            loginToken = $.getParam(url, 'loginToken');
        if (isApp == 1||type==1) {
            $.setToken(loginToken);
            $.setIsApp(true);
            if (loginToken) {
                $.setLogin(true);
            } else {
                $.setLogin(false);
            }
        }
    },
    isApp: function () {
        return $.getIsApp();
    },
    setafterSetAddr: function (url) {
        $.setCache('yw_user_after_setaddr_link', url || location.href, 86400, 1)
    },
    getafterSetAddr: function () {
        return $.getCache('yw_user_after_setaddr_link')
    },
    /*手机号间隔*/
    telGap: function (tel) {
        var telGap = tel.substring(0, 3) + " " + tel.substring(3, 7) + " " + tel.substring(7, 11);
        return telGap;
    },
    /*手机号隐藏*/
    telHide: function (tel) {
        var telHide = tel.substring(0, 3) + "****" + tel.substring(7, 11);
        return telHide;
    },
    isZipCode: function (num) {
        return !isNaN(num) && /^[0-9]{6}$/.test(num);
    },
    /*格式化数据 n：小数点保留位数*/
    fmoney: function (s, n) {
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(),
            r = s.split(".")[1];
        t = "";
        for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("") + "." + r;
    },
    //异地登录检索
    remoteLogin: function (callback) {
        $.sync({
            url: fresh.apiRoot + 'verifCode/verifLogin',
            type: 'post',
            success: function () {
                callback && callback(true);
            },
            error: function () {
                $.login();
            }
        });
    },
    /*登录状态检索*/
    checkUser: require('./checkUser'),

    // 获取体验金次数 ---- 用于 立即购买 与 登录成功后的先发判断 origin:0:常规 1:立即购买
    canExperienceFund: function (fnCallback, origin) {
        origin = origin || 0;
        $.sync({
            url: fresh.apiRoot + 'member/queryUserFlowStatus',
            type: 'post',
            dataType: 'json',
            success: function (data) {
                // registerShakeFlag
                if (data.registerShakeFlag== 0) { // 说明要去摇体验金先
                    window.localStorage.setItem('newshake_origin', origin);
                    $.changePage('newshake');
                } else {
                    fnCallback && fnCallback();
                }
            },
            error: function () {
                $.toast('请求出错');
            }
        });
    },
    findEleByClass: function (obj, sClass) {
        var nowEle = obj;
        if (nowEle.classList.contains(sClass)) { // 说明刚点中
            return nowEle;
        }
        while (nowEle) {
            if (nowEle == document.documentElement) {
                return null;
            }
            if (nowEle.classList.contains(sClass)) {
                return nowEle;
            }
            nowEle = nowEle.parentNode;
        }
        return null;
    },
    strHtml: function (str) {
        str = str + "";
        var html = '';
        str = str.split('');
        for (var i = 0; i < str.length; i++) {
            html += '<em class="num' + str[i] + '"></em>';
        }
        return html;
    },
    getStaticOrgin: function () {
        var host = location.host.split('.')[0],
            sh = {
                'dev': 'http://staticdev.91yaowang.com',
                'app': 'https://filetest.91yaowang.com',
                'wz': 'https://file.91yaowang.com',
                'apa': 'https://file.91yaowang.com'
            };
        return sh[host] || 'https://filetest.91yaowang.com';
    },
    // 统计
    statistics: function (actiCode) {
        var platform = 'WAP';
        var token = localStorage.getItem('yw_user_loginToken') || '';
        var channelInviteValue = $.getParam(location.href, 'i') || 'ywlc';
        if ($.getParam(location.href, 'isapp')) {
            token = $.getParam(location.href, 'loginToken') || '';
            platform = 'ANDROID';
            if ($.isIOS()) {
                platform = 'IOS';
            }
        }

        if (token && channelInviteValue) {
            $.sync({
                url: fresh.apiRoot + 'marketActi/inertLog',
                type: 'post',
                data: {
                    loginToken: token,
                    actiCode: actiCode,
                    channelCode: channelInviteValue,
                    platform: platform
                },
                success: function (d) {
                },
                error: function (d) {
                }
            })
        }

    },

    //进度条
    SetProgress:function(pos1,pos2,num){
        var current = 0,
            interval = setInterval(function(){
                if(num>0){
                    increment();
                }else{
                    $('.'+pos1).html('0%')
                }
            },10);
        function increment(){
            current++;
            $('.'+pos1).html(current+'%').css('left',current-16);
            $('.'+pos2).css('width',current);
            if(current == num) {
                if(current == 100){
                    $('.'+pos1).html('满标')
                }
                current = num;
                clearInterval(interval);
            }
        }
    },

    tradePassword: require('./tradePassword'),
    tradeSmsPassword: require('./tradeSmsPassword'),
    // userLogin: require('../source/passport/login/login'),
    // userRegister: require('../source/passport/register/register'),
    // userForgetPassword: require('../source/passport/forget/forget'),

    sync: require('./sync'),
    batSync: require('./batSync'),
    customEvent: require('./customEvent'),
    toast: require('./toast/toast'),
    parseURL: require('./parseUrl'),
    dateFormat: require('./dateFormat'),
    popWindow: require('./popWindow/popWindow'),
    loadMoreData: require('./loadMoreData'),
    loadMore: require('./loadMore'),
    loadMoreFund: require('./loadMoreFund'),
    // praiseAction: require('./praiseAction'),
    // shareWeixinTip: require('./shareWeixinTip/shareWeixinTip'),
    // upload: require('./upload'),
    // fullSlider: require('./fullSlider/fullSlider'),
    // swiper: require('./swiper/swiper-3.3.1.jquery.min.js'),
    // swiperAnimate: require('./swiper/swiper.animate1.0.2.min.js'),
    getUniqFn: function (fn) {
        var uniq = $.uniqID('callback_');
        window[uniq] = function (d) {
            console.log(d)
            fn(d);
        }
        return uniq;
    },
    login: function (url) {
        // if(window.JF){
        //     JF.passport_login($.getParam('m')||'',$.getUniqFn(function(d){
        //         if(d.status==0){
        //             // $('.mask .title').html(d.data);
        //             $.setToken(d.data)
        //             location.reload();
        //         }
        //     }));
        //     return false;
        // }
        // JF.navigator_setShareInfo(JSON.stringify({
        //     title:'分享测试',
        //     desc:'测试正文测试正文测试正文测试正文',
        //     icon:'http://192.168.62.221:8080/source/home/images/ec23dbc4.png',
        //     link:'https://app.91yaowang.com/weizhan/#login'
        // }),$.getUniqFn(function(d){
        //     log(d.data);
        // }));
        // return false;

        $.setafterLogin(url || location.href);
        if ($.isWeixin()) {
            var callback = location.origin +  '/weizhan/%23login',
                iframeSrc = fresh.weizhanApi + '/app/oauth.html',
                redirectUrl = encodeURIComponent(fresh.weizhanApi + '/app/oauth/auth.html');
            window.location = iframeSrc + '?redirectUrl=' + redirectUrl + '&scope=snsapi_base&callback=' + callback;
        } else {
            // $.userLogin();
            window.location='/weizhan/#login'
        }
    },
    // 运动框架
    // tweenMove: require('./move/move'),
    // 自定义弹框
    // popup: require('./popup/popup'),
    amountFormat: function (v, symbol) {
        if (!v || v == 0) return '0.00';
        if (v == '--') return '--';
        v = parseFloat(v).toFixed(2);
        var t = v.toString().split('.'),
            sy = t[0].substr(0, 1) == '-' ? (t[0] == 0 ? '-' : '') : (symbol == 1 ? '+' : '');
        return sy + (+t[0]).toLocaleString() + '.' + (t[1] >= '01' ? t[1] : '00');
    },
    isIDCard: require('./isIDCard'),
    setAppNav: function (title, backUrl) {
        if (!$.getCache('channelCode')) {
            $.setWeixinTitle(title);
        } else {
            fresh.$content.prepend('<div class="top-channel-nav"></div>')
            var TopChannelNav = require('../source/common/top-channel-nav/top-channel-nav');
            new TopChannelNav({el: $('.top-channel-nav'), title: title, backUrl: backUrl});
        }
    },
    // 日期
    // monthPicker: function (opt) {
    //     var defaultOpt = {
    //         years: '2010-2030',
    //         curValue: '2016-11',
    //         yes: '确认',
    //         no: '取消',
    //         onSelect: function () {
    //
    //         },
    //         callback: function () {
    //
    //         }
    //     }
    //     opt = $.extend(defaultOpt, opt);
    //     var win = $(template()),
    //         startYear = parseInt(opt.years.split('-')[0]);
    //     curYear = opt.curValue.split('-')[0] || startYear,
    //         curMonth = opt.curValue.split('-')[1] || '01';
    //
    //     function n2s(v) {
    //         return v > 9 ? v : '0' + v;
    //     }
    //
    //     function template() {
    //         var str = '<div class="month-picker-wrap"><div class="picker-box"><div class="picker-bar">'
    //             + '<span class="cancel-btn">' + opt.no + '</span><span class="confirm-btn">' + opt.yes + '</span>'
    //             + '</div><div class="picker-hover"></div><div class="year-content"><ul class="picker-year">';
    //         var year = opt.years.split('-');
    //         for (var i = year[0]; i < year[1]; i++) {
    //             str += '<li class="picker-li" data-id="' + i + '">' + i + ' 年</li>';
    //         }
    //         str += '</ul></div><div class="month-content"><ul class="picker-month">';
    //         for (i = 1; i < 13; i++) {
    //             str += '<li class="picker-li" data-id="' + i + '">' + n2s(i) + ' 月</li>';
    //         }
    //         str += '</ul></div></div></div>';
    //         return str;
    //     }
    //
    //     $('body').append(win);
    //     var height = win.find('.picker-li').height(),
    //         height2 = win.find('.picker-bar').height(),
    //         scroll1, scroll2;
    //
    //     win.find('.picker-year').scrollTop(win.find('.picker-li[data-id=' + curYear + ']').position().top - height * 2, win.find('.picker-li[data-id=' + curYear + ']'));
    //     win.find('.picker-month').scrollTop(win.find('.picker-li[data-id=' + parseInt(curMonth, 10) + ']').position().top - height * 2, win.find('.picker-li[data-id=' + parseInt(curMonth, 10) + ']'));
    //     win.on('click', function (e) {
    //         if (!$(e.target).closest('.picker-box').length) {
    //             win.off().remove();
    //         }
    //     }).on('click', '.cancel-btn,.confirm-btn', function (e) {
    //         var obj = $(e.currentTarget);
    //         if (obj.hasClass('cancel-btn')) {
    //             win.off().remove();
    //         } else {
    //             opt.onSelect(curYear, curMonth);
    //             win.off().remove();
    //             opt.callback(curYear, curMonth);
    //         }
    //     });
    //     win.find('.picker-year').on('scroll', function () {
    //         clearTimeout(scroll1);
    //         scroll1 = setTimeout(function () {
    //             var h = win.find('.picker-year').scrollTop(),
    //                 index = Math.round(h / height);
    //             win.find('.picker-year').scrollTop(height * index);
    //             curYear = startYear + index;
    //             $(".picker-year li").css("color", "#999");
    //             $($(".picker-year li")[index]).css("color", "#444");
    //         }, 100)
    //     });
    //     win.find('.picker-month').on('scroll', function () {
    //         clearTimeout(scroll2);
    //         scroll2 = setTimeout(function () {
    //             var h = win.find('.picker-month').scrollTop(),
    //                 index = Math.round(h / height);
    //             win.find('.picker-month').scrollTop(height * index);
    //             curMonth = n2s(index + 1);
    //             $(".picker-month li").css("color", "#999");
    //             $($(".picker-month li")[index]).css("color", "#444");
    //         }, 100)
    //     })
    // },
    inputAboveKeyWord: function (wrap, obj) {
        var top = 0;
        $(wrap).on('focus', obj, function () {
            top = $(wrap).scrollTop();
            setTimeout(function () {
                var ar = $(obj)[0].getBoundingClientRect();
                $(wrap).scrollTop($(wrap).scrollTop() + ar.top * 0.4);
            }, 500)
        });
        $(wrap).on('blur', obj, function () {
            $(wrap).scrollTop(top);
        });
    },
  // downloadApp: require('./download/download'),
  // fixDownloadApp: require('./download/downloadApp/index')
});

$.extend($.fn, {
    css3Hack: require('./css3Hack'),
    translate3d: function (x, y, z) {
        x = x || 0, y = y || 0, z = z || 0;
        $(this).css({
            "-webkit-transform": "translate3d(" + x + "px," + y + "px," + z + "px)",
            "-moz-transform": "translate3d(" + x + "px," + y + "px," + z + "px)",
            transform: "translate3d(" + x + "px," + y + "px," + z + "px)"
        })
    },
    setTransitionTime: function (num) {
        $(this).css({
            "-webkit-transition": +num + "s",
            "-moz-transition": +num + "s",
            transition: +num + "s"
        })
    },
    overSlides: function (callback) {
        $(this).each(function () {
            $(this).overSlide(callback);
        })
    },
    //整体滚动
    overSlide: require('./overSlider/overSlider'),
    //单个滚动
    bannerSlider: require('./overSlider/bannerSlider'),
    // calendarSlider: require('./overSlider/calendarSlider'),
    // pullRefresh: require('./pullRefresh')
});