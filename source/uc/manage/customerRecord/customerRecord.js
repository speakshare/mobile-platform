var template = _.template(require('./customerRecord.html'));
var investList = _.template(require('./customerRecord2.html'));
require('../manage.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        $.setLoginTokenFormApp();
        this.type = options.type;
        this.render();
        var st = $.getParam(location.href,'status');
        if(st==1){
            this.hasInvestList();   
        }else if(st==2){
            this.notInvestList();     
        }else{this.getData()}
    },
    getData:function(){
        var self= this;
        self.flag = false;
        fresh.loadData && fresh.loadData.destory();
        fresh.loadData=$.loadMore({
            url:fresh.apiRoot+'inviteCustomerRecordList',
            // url:'http://192.168.62.219:8080/app/webservice/v2/'+'inviteCustomerRecordList',
            type:'post',
            loadFirstPage:true,
            data:{
                loginToken:$.getToken(),
                investFlag:'',
                pageNo:0,
                pageSize:10
            },
            success:function(d,hasMore){
                self.cache = d.inviteCustomerRecordList;
                console.log(d.inviteCustomerRecordList.length);
                if(!self.flag){
                    self.$el.find('.container ul').html(investList({list:self.cache}));
                }else{
                    self.$el.find('.container ul').append(investList({list:self.cache}));
                }
                if(!hasMore){
                    if(self.cache.length > 7){
                      self.$el.find('.customer-record').addClass("manage2");
                    }
                    self.$el.find('.bottomLine').show();
                }
                self.flag = true;
                $('.all').addClass('active').siblings().removeClass('active');
            }
        });
    },
    render:function (){
        this.$el.html(template());
        $.setAppNav('用户记录');
        return this;
    },
    events:{
        'tap .customer-item':'toCustomerDetail',
        'tap .hasInvested':'hasInvestList',
        'tap .notToInvest':'notInvestList',
        'tap .all':'all'
    },
    toCustomerDetail:function(e){
        var _item = $(e.currentTarget).attr('data-cid');
        $.changePage('uc/manage/customerDetail/'+_item);
    },
    all:function(){
        var self = this;
        self.getData();
    },
    hasInvestList:function(){
        var self= this;
        self.flag = false;
        fresh.loadData && fresh.loadData.destory();
        fresh.loadData=$.loadMore({
            url:fresh.apiRoot+'inviteCustomerRecordList',
            // url:'http://192.168.62.219:8080/app/webservice/v2/'+'inviteCustomerRecordList',
            type:'post',
            loadFirstPage:true,
            data:{
                loginToken:$.getToken(),
                pageNo:0,
                pageSize:10,
                investFlag:1
            },
            success:function(d,hasMore){
                console.log(d);
                self.cache = d.inviteCustomerRecordList;
                console.log(self.cache);
                if(!self.flag){
                    self.$el.find('.container ul').html(investList({list:self.cache}));
                }else{
                    self.$el.find('.container ul').append(investList({list:self.cache}));
                }
                if(!hasMore){
                    if(self.cache.length > 7){
                      self.$el.find('.customer-record').addClass("manage2");
                    }
                    self.$el.find('.bottomLine').show();
                }
                self.flag = true;
                $('.hasInvested').addClass('active').siblings().removeClass('active');
            }
        });
    },
    notInvestList:function(e){
        var self= this;
        self.flag = false;
        fresh.loadData && fresh.loadData.destory();
        fresh.loadData=$.loadMore({
            url:fresh.apiRoot+'inviteCustomerRecordList',
            // url:'http://192.168.62.219:8080/app/webservice/v2/'+'inviteCustomerRecordList',
            type:'post',
            loadFirstPage:true,
            data:{
                loginToken:$.getToken(),
                pageNo:0,
                pageSize:10,
                investFlag:0
            },
            success:function(d,hasMore){
                console.log(d);
                self.cache = d.inviteCustomerRecordList;
                if(!hasMore){
                    if(self.cache.length > 8){
                      self.$el.find('.customer-record').addClass("manage2");
                    }
                    self.$el.find('.bottomLine').show();
                }
                if(!self.flag){
                    self.$el.find('.container ul').html(investList({list:self.cache}));
                }else{
                    self.$el.find('.container ul').append(investList({list:self.cache}));
                }
                self.flag = true;
                $('.notToInvest').addClass('active').siblings().removeClass('active');
            }
        });
    }
});