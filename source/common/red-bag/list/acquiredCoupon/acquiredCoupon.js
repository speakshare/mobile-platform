var template = _.template(require('./acquiredCoupon.html'));
var conponList = _.template(require('./acquiredCouponList.html'));
require('../list.css');
var loadMoreNew = require('../loadmore.js');
module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.cache = options.cache || {};
        this.getData();
    },
    getData:function(){
        var that = this;
        that.flag = false;
    	fresh.loadData && fresh.loadData.destory();
        fresh.loadData=loadMoreNew({
    		url:fresh.apiRoot + 'member/selectCustomerRewardByParam',
            type:'post',
            loadFirstPage:true,
            data:{
                loginToken:$.getToken(),
                ruleType:"1,2,4",
                isUsed:1,
                page:0,
                count:10
            },
            success:function(d,hasMore){
                // console.log(d);
                that.cache = d.list;
                if(!that.flag){
                    that.$el.find('.giftList ul').html(conponList({list1:that.cache}));
                }else{
                    that.$el.find('.giftList ul').append(conponList({list1:that.cache}));
                }
                if(!hasMore){
                    if(that.cache.length > 6){
                      that.$el.find('.redbag').addClass("indexRed");
                    }
                    that.$el.find('.bottomLine').show();
                }
                that.flag = true;
            }
    	})
        that.render();
    },
    render:function (){
        this.$el.html(template({list:this.cache}));
        $.setAppNav('已用礼券');
        return this;
    }
});