var template=require('./home.html'),
    newUser=require('./newUser/newUser'),
    oldUser=require('./oldUser/oldUser');

require('./home.css')

module.exports = Backbone.View.extend({
    initialize: function () {
        this.analysis();
        this.getData();
    },
    analysis:function(){ // 埋点
        window.customEvent(3, '1.2.1', '首页可见'  );
    },
    getData:function(){
        var self = this;
        this.cache={
            isLogin:false
        };
        $.batSync({
            data:[
                {url:fresh.apiRoot+'member/selectPromotionNews'},
                {url:fresh.apiRoot+'member/sign/newHistory'},
                {url:fresh.apiRoot+'platformData/queryPlatformData'},
                {url:fresh.apiRoot+'avenueofstars/sysdateQuery'},
                {url:fresh.apiRoot+'member/homePage4Fund',data:{newFlag:1,platform:'wap'}},
                {url:fresh.apiRoot+'member/homePageBanner',data:{platform:'wap'}}
            ],
            success:function(d){
                self.cache={
                    notice:d[0] && d[0].list[0] || {},
                    signed:d[1] && d[1].todaySigned||false,
                    platformData:d[2]||{},
                    sysTime:$.dateFormat(d[3] && d[3].sysdate||new Date().getTime(),'h|m').split('|'),
                    homePage:d[4],
                    isNew:d[4].isNew || 1,
                    isLogin:d[4].isLogin || 0,
                    banner:d[5] && d[5].crmActivityImgInfoList||{}
                };
                self.render();
            }
        })
    },
    render:function (){
        this.$el.html(template);
        var homeBox=this.$el.find('.home-box');
        if(this.cache.isNew==0){
            new oldUser({el:homeBox,cache:this.cache});
        }else{
            new newUser({el:homeBox,cache:this.cache});
        }
        $.setAppNav('首页');
        $.downloadApp();
        this._initTip();
        return this;
    },
    _initTip:function(){
        console.log(this.cache)
        if(this.cache.homeAds && this.cache.homeAds.imageUrl && (!$.getCache('home-cfg-ads') || $.getCache('home-cfg-ads')!=this.cache.homeAds.imageUrl)){
            this.$el.append(_.template(require('./home-cfg-ads.html'))(this.cache.homeAds));
            $.setCache('home-cfg-ads',this.cache.homeAds.imageUrl);
        }
    }
});