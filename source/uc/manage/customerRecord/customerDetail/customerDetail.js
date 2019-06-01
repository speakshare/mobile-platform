var template = _.template(require('./customerDetail.html'));
var deadline = _.template(require('./customerDetail2.html'));
require('../../manage.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type = options.type;
        this.did = options.did;
        this.getData(this.did);
    },
    getData:function(did){
        var self= this;
        self.flag = false;
        $.batSync({
            data:[
                {url:fresh.apiRoot +'inviteCustomerInfo',data:{loginToken:$.getToken(),customerId:did}},                
                {url:fresh.apiRoot +'inviteCustomerAchievement',data:{loginToken:$.getToken(),customerId:did}}             
            ],
            success: function(d){
                self.cache={
                    customer:d[0],
                    amount: d[1]
                };
                if(!self.cache.customer){
                    self.cache.customer = {};
                }
                console.log(self.cache);
                self.render();
                self.ing();
            },error:function(){
                self.render();
            }
        });
    },
    render:function (){
        var self = this;
        self.$el.html(template({A:self.cache}));
        $.setAppNav('用户详情');
        return this;
    },
    events:{
        'tap .ordering':'which',
        'tap .deadline':'toDeadLineOrder',
        'tap .investing':'ing',
        'tap .tel':'phone'
    },
    which:function(e){
        var _self = $(e.currentTarget).attr('data-type');
        var _orderId = $(e.currentTarget).attr('data-oid');
        if(_self=='1'){
            $.changePage('uc/manage/yaobaoRecord/'+this.did);
        }
        else{
            $.changePage('uc/manage/orderDetail/'+ _orderId);
        }
    },
    phone:function(e){
        var _url = $(e.currentTarget).attr('data-link');
        $.checkUser(function(){
            window.location=_url;
        })
    },
    ing:function(){
        var self = this;
        self.flag = false;
        fresh.loadData && fresh.loadData.destory();
        fresh.loadData=$.loadMore({
            url:fresh.apiRoot+'inviteCustomerOrderList',
            // url:'http://192.168.62.219:8080/app/webservice/v2/'+'inviteCustomerOrderList',
            type:'post',
            loadFirstPage:true,
            data:{
                loginToken:$.getToken(),
                customerId:self.did,
                pageNo:0,
                pageSize:10,
                investFlag:1
            },
            success:function(d,hasMore){
                self.data = d.inviteCustomerOrderList;
                console.log(d);
                if(!self.flag){
                    self.$el.find('.order ul').html(deadline({list:self.data}));
                }else{
                    self.$el.find('.order ul').append(deadline({list:self.data}));
                }
                if(!hasMore){
                    if(self.data.length > 4){
                      self.$el.find('.investType').addClass("manage1");
                    }
                    self.$el.find('.bottomLine').show();
                }
                self.flag = true;
                $('.investing').addClass('active').siblings().removeClass('active');
            }
        });
    },
    toDeadLineOrder:function(did){
        var self = this;
        self.flag = false;
        fresh.loadData && fresh.loadData.destory();
        fresh.loadData=$.loadMore({
            url:fresh.apiRoot+'inviteCustomerOrderList',
            // url:'http://192.168.62.219:8080/app/webservice/v2/'+'inviteCustomerOrderList',
            type:'post',
            loadFirstPage:true,
            data:{
                loginToken:$.getToken(),
                customerId:self.did,
                investFlag:0,
                pageNo:0,
                pageSize:10
            },
            success:function(d,hasMore){
                if(!hasMore){
                    if(self.cache.length > 4){
                      self.$el.find('.investType').addClass("manage1");
                    }
                    $(self.$el).find('.bottomLine').show();
                }
                self.cache = d.inviteCustomerOrderList;
                console.log(d);
                if(!self.flag){
                    self.$el.find('.order ul').html(deadline({list:self.cache}));
                }else{
                    self.$el.find('.order ul').append(deadline({list:self.cache}));
                }
                self.flag = true;
                $('.deadline').addClass('active').siblings().removeClass('active');
            }
        })
    }
});