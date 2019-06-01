var template = _.template(require('./acquiredRed.html'));
var redList = _.template(require('./redList.html'));
require('../list.css');
var loadMoreNew = require('../loadmore.js');
module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.cache = options.cache || {};
        this.cache1 = {};
        this.$el.html(template({redInfo:this.cache}));
        this.getData();
    },
    getData:function(){
        var self = this;
        self.flag = false;
        $.sync({
            url:fresh.apiRoot +'member/selectCustomerRedReward',
            type:'post',
            data:{
                loginToken:$.getToken()
            },
            success:function(d){
                console.log(d);
                self.cache=d;
                self.render();
            }
        })     
    },
    render:function (){
        this.$el.html(template({redInfo:this.cache}));
        $.setAppNav('已领红包');
        if(this.cache.redRewardReceiveTotalCount>0) this._initEvent();
        return this;
    },
    _initEvent:function(){
        var self=this;
        fresh.loadData && fresh.loadData.destory();
        fresh.loadData=loadMoreNew({
            url:fresh.apiRoot + 'member/selectCustomerRewardByParam',
            type:'post',
            loadFirstPage:true,
            data:{
                loginToken:$.getToken(),
                ruleType:3,
                isUsed:1,
                page:0,
                count:7
            },
            success:function(d,hasMore){
                console.log(d);
                self.cache1 = d.list;
                if(!self.flag){
                    self.$el.find('.hasAcquired ul').html(redList({redList:self.cache1}));
                }else{
                    self.$el.find('.hasAcquired ul').append(redList({redList:self.cache1}));
                }
                if(!hasMore){
                    if(self.cache1.length > 7){
                      self.$el.find('.redbag').addClass("indexRed");
                    }
                    self.$el.find('.bottomLine').show();
                }
                self.flag = true;
            }
        })
    },
    events:{
        'tap .investFrd':'toInvite'
    },
    toInvite:function(){
        $.checkUser(function(){
            $.changePage('uc/invite');
        });
    }
});