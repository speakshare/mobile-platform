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
        $.toast('服务器忙，请稍候再试!',1500);
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
        }else {
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
    isMobileNum:function(num){
        return !isNaN(num) && /^1[3|4|5|7|8]\d{9}$/.test(num);
    },
    isPassword:function (str){
        var reg=/^(([a-z]+[0-9]+)|([0-9]+[a-z]+))[a-z0-9]*$/i;
        return reg.test(str);
    },
    setCache:function(key,value,exp,type){
        //过期时间默认1天
        exp=exp||86400;
        type=type||0;
        !type && (key+='_'+ curUserID);
        fresh.cache[key] = value;
        store.set(key, value, exp);
    },
    getCache:function(key,type){
        type=type||0;
        !type && (key+='_'+ curUserID);
        return (fresh.cache[key] || store.get(key));
    },
    setToken:function(token){
        localStorage.setItem('yw_user_loginToken',token)
    },  
    getToken:function () {
        return localStorage.getItem('yw_user_loginToken');
        //return localStorage.getItem('yw_user_loginToken')==null?'':localStorage.getItem('yw_user_loginToken');
    },


    shareQQAddress:function(title,summary){
        return 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+encodeURIComponent('http://channel.hujiang.com/ch_click.aspx?ch_source=st_qq&page='+location.href)
        +'&showcount=0&summary='+encodeURIComponent(summary)+'&desc='+encodeURIComponent(summary)
        +'&title='+encodeURIComponent(title)+'&site='+encodeURIComponent('摇旺理财')
        +'&pics='+encodeURIComponent('http://ms.hujiang.com/st/images/icon114.png')
    },
    shareWeiboAddress:function(title){
        var url=escape('http://channel.hujiang.com/ch_click.aspx?ch_source=st_weibo&amp;page='+location.href);
        return 'http://service.weibo.com/share/share.php?url='+url
        +'&type=icon&language=zh_cn&title='+encodeURIComponent(title+'（阅读原文：'+location.href+'，下载沪江手机客户端：http://hj.vc/vrjU3vJ）')
        +'&searchPic=http://ms.hujiang.com/st/images/icon114.png&style=simple'
    },
    setWeixinTitle:function(title){
        document.title=title;
        // $.setAppTitle(title);
        // hack在微信IOS webview中无法修改document.title的情况
        if($.isWeixin() && $.isIOS()) {
            var $iframe = $('<iframe src="https://static.91yaowang.com/yaowang/dist/source/mall/images/9e3e8cf0.png" style="border: 0;outline: 0"></iframe>');
            $iframe.on('load', function () {
                setTimeout(function () {
                    $iframe.off('load').remove();
                }, 0);
            }).appendTo('body');
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
        }else if (htmlTag.createTextRange) { //IE
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
     getStaticOrgin:function(){
        var host=location.host.split('.')[0],
            sh={
                'dev':'http://staticdev.91yaowang.com',
                'app':'https://statictest.91yaowang.com',
                'wz':'https://file.91yaowang.com',
                'apa':'https://file.91yaowang.com'
            };
        return sh[host]||'https://statictest.91yaowang.com';
    },

    numberFormat:function(num,dot){
        dot=dot||1;
        if(isNaN(num=parseInt(num))) return 0..toFixed(dot);
        return num>=10000?((num/10000).toFixed(dot)+'万'):num;
    },
    changePage: function (hash_path,replace) {
        fresh.router.navigate(hash_path, {trigger:true,replace:replace});
    },
    
    //没有更多列表统一处理
    hasNotMoreData:function(obj,hasData,notDataText){
        if(hasData){
            obj.append('<div class="has_not_data">'+(notDataText||'暂无数据')+'</div>');
        }else{
            obj.append('<div class="has_not_more_topic">没有更多了</div>');
            setTimeout(function(){
                obj.find('.has_not_more_topic').fadeOut();
            },3000);
        }
    },
    
    getParam: function(str,key){
        var reg = new RegExp(key +"=([^#&]*)",'i');
        var r = str.match(reg);
        if (r!=null) return unescape(r[1]); return null;
    },


    //获取短信验证码
    sendSMS:require('./sendSMS'),
    isZipCode:function(num){
        return !isNaN(num) && /^[0-9]{6}$/.test(num);
    },
    sync:require('./sync'),
    batSync:require('./batSync'),
    customEvent:require('./customEvent'),
    toast:require('./toast/toast') ,
    parseURL:require('./parseUrl'),
    dateFormat: require('./dateFormat'),
    popWindow:require('./popWindow/popWindow'),
    loadMoreData:require('./loadMoreData'),
    amountFormat:function(v) {
        if(!v) return '0.00'
        v = v.toString().split('.');
        return (+v[0]).toLocaleString() + '.' + (v[1] >= 01 ? v[1] : '00');
    },
    isIDCard:require('./isIDCard'),
    login:function(){
        var isApp=$.getParam(location.href,'isapp');
        if(isApp){
            window.location='/weizhan/member/login';
        }else{
            localStorage.setItem('yw_user_after_login_link',location.href);
            window.location='/weizhan/#login';
        }
    }
});
$.extend($.fn, {
    css3Hack:require('./css3Hack'),
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
    bannerSlider:require('./overSlider/bannerSlider')
});