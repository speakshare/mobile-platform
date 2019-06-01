var template = _.template(require('./home.html'));
require('./home.css');
var bar=require('./bar.js');

module.exports = Backbone.View.extend({
	initialize: function () {
        $.statistics('LCDS');
        this.getData();
    },
    getData:function(){
        var self=this;
        $.checkUser(function(){
            $.batSync({
                data:[
                {url:fresh.apiRoot + 'lcds/baseinfo'},
                {url:fresh.apiRoot + 'lcds/lately/redpacket'},
                {url:fresh.apiRoot + 'lcds/homeinfo'},      
                ],
                success:function(d){
                    self.cache={
                        info:d[0],
                        income : d[1],
                        investinfo:d[2]
                    }
                    self.render();
                },
                error: function(d){
                    $.toast(d.msg);
                    self.render();
                }
            });
        });
    },
    render:function(){
        var self=this;
        this.$el.html(template(this.cache));
        $.setAppNav('我的邀请');
        this.setDefaultShare();
        if(this.cache.income.redPacketList&&this.cache.income.redPacketList.length>0){ bar(this.cache.income.redPacketList);}
        return this;;
    }, 
    events:{
        'tap .levelrule' :'updateRule',
        'tap .makemoneyguide':'makemoneyguide',
        'tap .invitefrbtn':'share',
        // 'tap .toRedDetail':'toRedDetail',
        'tap .currmonth':'toRedDetail',
        'tap .myClient'   :'myClient',
        'tap .mytotalInvest':'mytotalInvest',
        'tap .askinfo,.answer ':'answer'
    },
    toRedDetail:function(e){
        var oTarget=$.findEleByClass(e.target, 'linebox');
        if(!oTarget){
            $.changePage('uc/manager/red');  
        } 
    },
    myClient:function(){
        $.changePage('uc/manager/myCustomer');
    },
    mytotalInvest:function(){
        $.changePage('uc/manager/accumulate');
    },
    setDefaultShare:function(){
        var shareurl= location.protocol+'//'+location.host+'/weizhan/#uc/invite/landingPage?code='+ localStorage.getItem('yw_user_inviteCode');
        jsb.setShareInfo({
                    title:'跟我来摇旺赚钱吧，100元代金券、14%新手专享产品和万元体验金等你来拿~', //分享标题
                    desc:'不会理财的人不漂亮！', //分享描述
                    link:shareurl,
                    callback:function(){
                    }
                });
    },
    share:function(){
        jsb.share();
    },
    answer:function(e){
        var oTarget=$.findEleByClass(e.target, 'answer');
        if(!oTarget){
            $(e.currentTarget).siblings('.answer').toggle().parents('.flex').siblings().find('.answer').hide(0);
        }else{
            $(e.currentTarget).hide(0);
        }
        e.preventDefault();

    },
    updateRule:function(){
        $.changePage('staticPage/updateStrategy');
    },
    makemoneyguide:function(){
        $.changePage('uc/manager/makeMoneyGuide');
    },
})