var template = _.template(require('./makeMoneyGuide.html'));
require('../manager.css');


module.exports = Backbone.View.extend({
	initialize: function () {
        jsb.setShareInfo({
                        title:'《最佳赚钱指南》豪华升级', //分享标题
                        desc:'让人脉自动来赚钱，超安逸！最高2%现金奖励无上限，超豪气！', //分享描述
                        link:location.href,
                        callback:function(){
                        }
                    });
        this.render();
    },
    render:function(){
        this.$el.html(template());
        $.setAppNav('理财大使指南升级');
        return this;;
    }, 
    events:{
        'tap .invitebtn':'invite',
        'tap .lcdsrule':'tolcdsrule',
        'tap .sharebtn':'share'
    },
    invite:function(){
        $.changePage('uc/invite');
    },
    tolcdsrule:function(){
        $.changePage('staticPage/updateStrategy');
    },
    share:function(){
        jsb.share();
    }
})