var template = _.template(require('./../../common/red-bag/list/list.html'));
var tempTemplate = _.template(require('./list.html'));
var template2 = _.template(require('./../../common/red-bag/list/list2.html'));
var loadMoreNew = require('./../../common/red-bag/list/loadmore.js');
module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.pageSize = 10;
        this.pageIndex = 0;
        this.cache = options.cache;
        this.getData();
    },
    getData:function(){
        var self=this;
        $.checkUser(function(){
            self.getListByPageNo();
        });
    },

    loadMoreList: function(){
        var self = this;
        fresh.loadData && fresh.loadData.destory();
        fresh.loadData=loadMoreNew({
            url:fresh.apiRoot + 'member/selectCustomerRewardByParam',
            type:'post',
            loadFirstPage:true,
            data:{
                loginToken:$.getToken(),
                ruleType:'1,2,4',
                isUsed:'0,2',
                page:0,
                count:10
            },
            success:function(d,hasMore){ 
                 if(d){localStorage.setItem('yw-redbagservDate',d.servDate);}
                self.cache1 = d.list;
                // console.log(d);
                if(!self.flag){
                    self.$el.find('.giftList ul').html(template2({gift:self.cache1}));
                }else{
                    self.$el.find('.giftList ul').append(template2({gift:self.cache1}));
                }
                if(!hasMore){
                    self.$el.find('.bottomLine').show();
                }
                self.flag = true;
            }
        })
    },
    getListByPageNo: function(){
        var self = this;
        self.flag = false;
        $.batSync({
            data:[
            {url:fresh.apiRoot +'member/selectCustomerRewardByParam',data:{loginToken:$.getToken(),ruleType:3,isUsed:0,page:0,count:10}},
            {url:fresh.apiRoot +'member/selectCustomerRedReward',data:{loginToken:$.getToken()}},                
            {url:fresh.apiRoot +'member/selectCustomerReward',data:{loginToken:$.getToken(),page:0,count:10}}           
            ],
            success:function(d){
                // console.log(d);

                self.cache={
                    rewardByPar:d[0],
                    redReward:d[1],
                    reward:d[2]
                }

                self.render();
                self.loadMoreList();
            }
        })
    },
    appendData: function(data){
        var tempHtml = tempTemplate({data:data});
        $("#redPacketContainer").append(tempHtml);
    },

    render:function(){
        this.$el.html(template({red:this.cache}));
        $.setAppNav('我的礼券');
        return this;
    },
    events:{
        'tap #loadMore':'getMoreData',
        'tap .wrap': 'getProductsByRuleId',
        'tap .aquiredRed':'aquiredRedList',
        'tap .aquiredCoupon':'aquiredCouponList',
        'tap .getBtn':'gotoAcquire',
        'tap .investFrd':'toInvite',
        'tap .questions':'rule'
    },
    rule:function(){
        $.changePage('staticPage/redRule');
    },
    toInvite:function(){
        $.checkUser(function(){
            // location.href = '/weizhan/member/inviteFriends?loginToken='+ $.getToken();
            $.changePage('uc/invite');
        });
    },
    gotoAcquire:function(e){
        var self = this;
        var redId = $(e.currentTarget).attr('data-id');
        $.sync({
            url:fresh.apiRoot + 'member/receiveCoupon',
            type:'post',
            data:{
                loginToken:$.getToken(),
                sendRewardId:redId
            },
            success:function(d){
                // console.log(d);
                self.render();
                self.$el.find('.success').show();
                location.reload();
            }
        })
    },
    getProductsByRuleId: function(event){
        var that = this;
        var wrapper=$(event.currentTarget);
        var ruleId =wrapper.attr("data-id");
        var redBagId = wrapper.attr("data-bagid");
        var status = wrapper.attr("data-status");
        var el = this.$el.find('.redbag');
        if(status==2){
            return false;
        }else{
            $.sync({
                url:fresh.apiRoot + 'member/selectListProductByRewardId',
                type:'post',
                data:{
                    ruleId:ruleId
                },
                success:function(d){
                    d.redBagId = redBagId;
                    if(d.list.length < that.pageSize){
                        that.showPerfactProducts(el, d);
                    }
                }
            })
        }
    },
    showPerfactProducts: function(el, data){
        var perfactProduct = require('./../../common/rightProduct/rightProduct');
        new perfactProduct({el:el,data:data});
    },

    getMoreData: function(){
        this.getListByPageNo();
    },
    aquiredRedList:function(){
        $.changePage('common/aquiredRed');
    },
    aquiredCouponList:function(){
        $.changePage('common/acquiredCoupon');
    }

});