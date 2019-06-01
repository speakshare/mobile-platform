var template = _.template(require('./accumulateInvest.html'));
var list = _.template(require('./accumulateList.html'));
require('../manager.css');
module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.list=[];
        this.getData();
    },
    getData:function(){
        var self = this;
        $.checkUser(function(){
            $.sync({
                url:fresh.apiRoot+'lcds/investment/amount',
                type:'post',
                success:function(d){
                    self.cache=d;
                    self.render();
                }
            });
        });        
    },
    events:{
        'tap .dueList':'dueList',
        'tap .tabmeun':'tabmeun',


        'tap .item':'orderDetail',
        'tap .icoRight':'slide'
    },
    render:function (){
        this.$el.html(template(this.cache));
        $.setAppNav('累计投资');
        this.listLoadMore(1);

        // this.indexPage();
        return this;
    },
    dueList:function(){
        $.changePage('uc/manager/duelist');
    },
    listLoadMore:function(type){
        var self = this;
        if (self.startload) return;
        fresh.loadData&&fresh.loadData.destory();
        fresh.loadData=$.loadMore({
            loading: '.loading',
            padding: 20,
            url: fresh.apiRoot + 'lcds/investment/list',
            type:'post',
            loadFirstPage: true,     
            data: {
                type:type,
                isDue:2,
                pageNo:0,
                pageSize:10
            },
            success: function (d,hasMore) {
                self.list=self.list.concat(d.investOrderList);
                $('.ullist').html(list({list:self.list,hasMore:hasMore}));
            },
            error: null
        });
    },
    tabmeun:function(e){
        $(e.currentTarget).addClass('tabon').siblings().removeClass('tabon');
        var _id = $(e.currentTarget).attr('data-type');
        if(_id=='1'){
            $('.dueList').show(0);
        }else{
           $('.dueList').hide(0);
       }
       this.list=[];
       this.listLoadMore(_id);
   },



   slide:function(){
    $('.duetoTable ul').toggle(200);
},
orderDetail:function(e){
    var orderNo = $(e.currentTarget).attr('data-oid');
    if(this.data.baseInfo.userType=='1'){
        $.changePage('uc/manager/orderDetail/'+orderNo);
    }
},
indexPage:function(){
    var self = this;
    self.flag = false;
    fresh.loadData && fresh.loadData.destory();
    fresh.loadData=$.loadMore({
        url:fresh.apiRoot+'lcds/invest/list',
        type:'post',
        loadFirstPage:true,
        data:{
            loginToken:$.getToken(),
            type:'1',
            pageNo:0,
            pageSize:10
        },
        success:function(d,hasMore){
            self.info = d;
            if(!self.flag){
                $(self.$el).find('.duetoTable ul').html(duetoList({list:self.info.investOrderList}));
            }else{
                $(self.$el).find('.duetoTable ul').append(duetoList({list:self.info.investOrderList}));
            }
            self.flag = true;
        }
    })

    fresh.loadData && fresh.loadData.destory();
    fresh.loadData=$.loadMore({
        url:fresh.apiRoot+'lcds/invest/list',
        type:'post',
        loadFirstPage:true,
        data:{
            loginToken:$.getToken(),
            type:'0',
            pageNo:0,
            pageSize:10
        },
        success:function(d,hasMore){
            self.cache = d;
            console.log(d);
            if(!self.flag){
                $(self.$el).find('.accumulate .investList').html(list({list:self.cache.investOrderList}));
            }else{
                $(self.$el).find('.accumulate .investList').append(list({list:self.cache.investOrderList}));
            }
            if(!hasMore){
                self.$el.find('.bottomLine').show();
            }
            self.flag = true;
            $('.notice').addClass('active').siblings().removeClass('active');
        }
    });
}
});