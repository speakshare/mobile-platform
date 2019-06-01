;(function(){
    var host=location.host.split('.')[0],
        biApi={
            app:'https://tgw-stg.91yaowang.com/zbtgw/',
            apa:'https://tgw.91yaowang.com/zbtgw/',
            wz:'https://tgw.91yaowang.com/zbtgw/'
        },
        BIURL=biApi[host],
        timeout=1800*1000,
        debug=true;

    if(host!='wz'){
        window.customEvent=function(){};
        return ;
    }

    function getCfg(){
        $.ajax({
            url:BIURL+'/config',
            type:'get',
            success:function(d){
                timeout=(d.t>1800?d.t:1800)*1000;
                debug=d.s;
                setTimeout(function(){
                    getCfg();
                },timeout);
            }
        });
    }

    setTimeout(function(){
        getCfg();
    },timeout);

    function uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        localStorage.setItem('uuid',uuid);
        return uuid;
    }

    var ua=navigator.userAgent;
    function isIOS() {
        return /ipad|iphone|iPod|Macintosh|mac os/i.test(navigator.userAgent);
    }

    function detectBrowser(options) {

        var data = {};
        var browser = null;
        var version = null;
        var os = null;
        var webkit = null;

        parseUserAgent();

        // exception rules
        renameOsx();
        cutSafariVersion();

        prepareData();
        processOptions();

        return data;

        function parseUserAgent() {
            // console.log(ua)
            // var ua='MOzilla/5.0 (iPhone; CPU iPhone OS 9_3_4 like Mac OS X) AppleWebkit/6.1.1.46 (KHTML, linke Gecko) Mobile/13g35 micromessenger/6.3.25 NetType/WIFI Language/zh_CN'
            var browserParts = /(ie|firefox|chrome|safari|opera|micromessenger)(?:.*version)?(?:[ \/])?([\w.]+)/i.exec(ua),
                osParts = /(mac|win|linux|freebsd|mobile|iphone|ipod|ipad|android|blackberry|j2me|webtv)/i.exec(ua);
            if ( !! ua.match(/trident\/7\./)) {
                browser = "ie";
                version = 11;
            } else if (browserParts && browserParts.length > 2) {
                browser = browserParts[1];
                version = browserParts[2];
            }

            if (osParts && osParts.length > 1) {
                os = osParts[1];
            }

            webkit = ua.toLowerCase().match(/webkit\/(\d+)\.(\d+)\.(\d+)/i);
        }

        function prepareData() {
            data.browser = browser;
            data.version = parseFloat(version, 10) || null;
            data.os = os;
            if (webkit && webkit.length >= 3) {
                data.webkit = {
                    major: parseInt(webkit[1], 10),
                    minor: parseInt(webkit[2], 10),
                    patch: webkit[3] ? parseInt(webkit[3], 10) : undefined
                };
            }
        }

        function renameOsx() {
            if (os === 'mac') {
                os = 'osx';
            }
        }

        function cutSafariVersion() {
            if (os === 'safari') {
                version = version.substring(0, 1);
            }
        }

        function processOptions() {
            options = options || {};

            if (options.addClasses && data.os && data.browser && data.version) {
                document.body.parentNode.className += ' ' + data.os + ' ' + data.browser + ' ' + data.browser + '-' + data.version;
            }
        }

    };

    var browser=detectBrowser(),
        uuid=localStorage.getItem('yw_user_phoneNum')||localStorage.getItem('uuid')||uuid()

    var baseInfo={
        u: uuid,
        d:'',
        o: isIOS()?'iOS':'Android',//系统版本 Android 1.1.x,
        p: 3, // 平台类型 1、Android，2、ios,3、h5
        w: browser.browser+' '+browser.version, //浏览器版本
        s: $(window).width()+','+$(window).height(),//长,宽
        c:'',
        v: '1.0.1', //app版本号
        t: navigator.platform //机型， iphone6 iphone6 plus
    }

    $.ajax({
        url:BIURL,
        type:'post',
        contentType: "application/json; charset=utf-8",
        data:JSON.stringify({
            d:baseInfo,
            t:1
        })
    });

    function sendInfo(type,id,msg){
        if(debug) {
            $.ajax({
                url: BIURL,
                type: 'post',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    d: {
                        p:id,
                        u:uuid,
                        m:msg
                    },
                    t: type
                })
            });

        }else{
            console.log('统计服务关闭:::::'+options);
        }
    }
    window.customEvent=sendInfo;
}());


var _vds = _vds || [];
window._vds = _vds;
(function(){
    _vds.push(['setAccountId', '988386d1bd106017']);
    // 设置登录用户
    var userID=localStorage.getItem('userID');
    if(userID){
        _vds.push(['setCS1', 'user_id', userID]);
    }

    (function() {
        var vds = document.createElement('script');
        vds.type='text/javascript';
        vds.async = true;
        vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(vds, s);
    })();
})();