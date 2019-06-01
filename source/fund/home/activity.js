var template = _.template(require('./activity.html'));
require('./activity.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        this.isApp = $.isApp();
        this.getData();
    },
    getData:function(){
        this.render();
    },
    render:function(){
        this.$el.html(template({isApp: this.isApp}));
        $.setAppNav("基金预告");
        this._initEvent();
        return this;
    },
    events:{
        'tap .share-icon': 'shareApp'
    },
    shareApp: function(){
        window.location='/openAppShare';
    },
    _initEvent:function(){
        var self=this;
        var tempHref = location.href.indexOf("from=singlemessage") == -1 ? (location.origin+location.pathname) : encodeURIComponent(window.location.href.split("#")[0] + window.location.href.split("?")[1]);
        $.sync({
            url :fresh.weizhanApi+'/app/oauth/config.html',
            type:'get',
            data:{url: location.href.split("#")[0]},
            success: function (d) {
                self._initWeChat(d);
            }
        });
    },
    _initWeChat:function (d) {
        var self=this;
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: d.appid, // 必填，公众号的唯一标识
            timestamp: d.timestamp, // 必填，生成签名的时间戳
            nonceStr: d.nonceStr, // 必填，生成签名的随机串
            signature: d.signature,// 必填，签名，见附录1
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo','onMenuShareQZone', 'openLocation', 'getLocation', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2 onMenuShareAppMessage showOptionMenu
        });
        var cfg={
            title: '摇旺公募敬请期待!',
            desc: '会玩的投资者都在这里，让我们一起蓄势待发！',
            link: location.protocol+'//'+location.host+'/weizhan/#preFund',
            imgUrl: 'https://file.91yaowang.com/yaowang/dist/fun-share.jpg',
            success: function () {
            },
            cancel: function () { }
        };
        wx.showOptionMenu();
        wx.ready(function () {
            wx.onMenuShareAppMessage(cfg);
            wx.onMenuShareTimeline(cfg);
            wx.onMenuShareQQ(cfg);
            wx.onMenuShareWeibo(cfg);
        });
    },
});