var template = _.template(require('./customerDetail.html'));
var list = _.template(require('./list.html'));
require('../manager.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type = options.type;
        this.cid = options.cid;
        this.list=[];
        this.getData(this.cid);
    },
    getData:function(cid){
        var self= this;
        self.flag = false;
        $.sync({
            url:fresh.apiRoot+'lcds/invite/personinfo',
            type:'post',
            data:{
                investId:cid
            },
            success:function(d){
                self.info = d;
                self.render();
            }
        });

    },
    render:function (){
        this.$el.html(template({info:this.info}));
        $.setAppNav('用户详情');
        this.listLoadMore(1);
        return this;
    },
    events:{
        'tap .tabbtn':'orderlist',
        'tap .tel':'phone'
    },
    orderlist:function(e){
       var _id = $(e.currentTarget).attr('data-type');
       $(e.currentTarget).addClass('tabon').siblings().removeClass('tabon');
       this.list=[];
       this.listLoadMore(_id);
   },
   listLoadMore:function(type){
    var self = this;
    if (self.startload) return;
    fresh.loadData&&fresh.loadData.destory();
    fresh.loadData=$.loadMore({
        loading: '.loading',
        padding: 20,
        url: fresh.apiRoot + 'inviteCustomerOrderList',
        type:'post',
        loadFirstPage: true,     
        data: {
            customerId:self.cid,
            investFlag:type,
            pageNo:0,
            pageSize:10
        },
        success: function (d,hasMore) {
            self.list=self.list.concat(d.inviteCustomerOrderList);
            self.cache={
                list:self.list,
                hasMore:hasMore
            }
            $('.ullist').html(list(self.cache));
        },
        error: null
    });
},
phone:function(e){
    var tel = $(e.currentTarget).attr('data-link');
    $.checkUser(function(){
        jsb.appTel(tel);
    })
}
});