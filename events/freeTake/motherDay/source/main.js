window.underscore=window._=require('./../component/underscore.js');
window.Backbone=require('./../component/backbone.js');
window.store = require('./../component/store');

require('./../component/helper');
require('./base/base.css');
require('./../component/touch');
require('./../libs/jsBridge');

var apiPort = location.origin; //提测使用这个
// var apiPort = 'https://app.91yaowang.com'; //测试环境api地址
//var apiPort = 'http://dev.91yaowang.com'; //开发环境api地址
//var apiPort = 'http://192.168.10.42:80';
window.fresh = {
    cache: {},
    loadDate: 0,
    apiRoot:apiPort+'/app/webservice/v2/',
    init: function (){
        this.$body = $('body');
        this.$main = $('#mainPage');
        this.$content = $('#content');
        var Router = require('./router.js');
        window.fresh.router = new Router;
        Backbone.history.start({pushState: false});
    }
};
$(function(){
    fresh.init();
    var url=location.href,
    isApp=$.getParam(url,'isapp'),
    token = localStorage.getItem('yw_user_loginToken')||'',
    weChatCfg,
    inviteCode=$.getParam(url,'code')||'';

    if(isApp){
        token=$.getParam(url,'loginToken')||'';
    }
    if(token){
        localStorage.setItem('yw_user_loginToken',token);
    }
    if(inviteCode){
        localStorage.setItem('yw_user_inviteCode',inviteCode);
    }
    initInviteCode();
    function initInviteCode(){
        if(token && !inviteCode){
            $.ajax({
                method: 'POST',
                url:location.origin + '/app/webservice/v2/inviteCodeOption',
                data: {
                    url: location.href,
                    loginToken:token
                },
                dataType:'json',
                success: function (d) {
                    inviteCode=d.data.inviteValue;
                    localStorage.setItem('yw_user_tempCode',inviteCode);
                    shareDefault();             
                }
            });
        }else{
            shareDefault();  
        }
    }
    function shareDefault(){
        jsb.setShareInfo({
            title : '黄金、macbook 0元白拿啦！',
            desc : '甄选好礼 送给你至爱的人！',
            link : location.origin+'/events/freeTake/motherDay/index.html?code='+inviteCode,
            icon : $.getStaticOrgin()+'/yaowang/events/freeTake/motherDay/dist/share.jpg'
        });
    }
});

var _vds = _vds || [];
window._vds = _vds;
(function(){
    _vds.push(['setAccountId', '988386d1bd106017']);
    (function() {
        var vds = document.createElement('script');
        vds.type='text/javascript';
        vds.async = true;
        vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(vds, s);
    })();
})();