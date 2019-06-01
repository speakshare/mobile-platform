var template = _.template(require('./download.html'));
require('./download.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type=options.type;
        this.render();
    },
    render:function(title,content){
        $.setAppNav('摇旺客户端下载');
        window.location='http://a.app.qq.com/o/simple.jsp?pkgname=com.zb.yaowang';
        return this;
        var address={
            android:'http://www.91yaowang.com/downapp/yaowang.apk',
            ios:'https://itunes.apple.com/us/app/yao-wang-li-cai-jin-rong-tou/id1054843703?l=zh&ls=1&mt=8'
        };
        if($.isWeixin()){
            this.$el.html(template({title:title,content:content}));
        }else if($.isIOS()){
            window.location=address.ios;
        }else{
            window.location=address.android;
        }
    },
    events:{
        'tap .d-btn':'download',
        'tap .share_mask':'hideMask'

    },
    download:function(){
        if($.isWeixin()){
            this.$el.find('.share_mask').show();
        }
    },
    hideMask:function(){
        this.$el.find('.share_mask').hide();
    }
});

