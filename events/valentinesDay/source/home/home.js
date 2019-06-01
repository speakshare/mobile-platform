var template = _.template(require('./home.html'));
require('./home.css');


module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.uid = options.uid || '';
        this.getData();
    },
    getData:function(){
        var self=this;
        $.sync({
            type:'post',
            url:fresh.apiRoot+'loveractivity/homePage',
            data:{
                loverUserId:this.uid
            },
            success:function(d){
                self.cache=d||{};
                self.render();
            },
            error:function(){
                self.cache={};
                self.render();
            }
        });
    },
    render: function () {
        this.$el.html(template());
        $.setWeixinTitle('万元恋爱基金大作战');
        this._initEvent();
        return this;
    },
    _initEvent:function(){
        var TopInfo=require('./top-info/top-info');
        new TopInfo({el:this.$el.find('.top-info'),
            cache:this.cache,
            uid:this.uid
        });

        var GiftList=require('./gift-list/gift-list');
        new GiftList({el:this.$el.find('.gift-box'),
            uid:this.uid
        });
        if(this.cache.isReward){
            $.popWindow({
                title:'万元恋爱基金大作战',
                content:'您已成功投资，现在去邀请且选择一位情侣即可获得恋爱基金现金奖励',
                yes:'我知道了',
                type:2,
                tapMask:true,
                callback:function(){

                }
            })
        }
        setTimeout(function(){
            $.shareDefault();
        },1000);
    },
    events: {
        'tap .rule-btn': 'showRule',
    },
    showRule:function(){
        $.changePage('rule')
    }
});