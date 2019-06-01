var template = _.template(require('./myCustomer.html'));
var List = _.template(require('./myCustomerList.html'));
require('../manager.css');
module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.count=[];
        this.list=[];
        this.getData();
    },
    getData:function(){
        var self = this;
        $.checkUser(function(){
            $.sync({
                url:fresh.apiRoot+'lcds/customer/count',
                type:'post',
                success:function(d){
                    self.count=d;
                    self.render();
                }
            });
        });
    },
    render:function (){
        this.$el.html(template(this.count));
        $.setAppNav('我的客户');
        this.listLoadMore(1);
        return this;
    },
    events:{
        'tap .tabmeun':'customerlist',
        'tap .customerDetail':'detailPage'
    },

    listLoadMore:function(type){
        var self = this;
        if (self.startload) return;
        fresh.loadData&&fresh.loadData.destory();
        fresh.loadData=$.loadMore({
            loading: '.loading',
            padding: 20,
            url: fresh.apiRoot + 'lcds/customer/list',
            type:'post',
            loadFirstPage: true,     
            data: {
                type:type,
                pageNo:0,
                pageSize:10
            },
            success: function (d,hasMore) {
                self.list=self.list.concat(d.cusInfoList);
                self.cache={
                    list:self.list,
                    hasMore:hasMore
                }
                $('.customerlist').html(List(self.cache));
            },
            error: null
        });
    },
    customerlist:function(e){
        var _id = $(e.currentTarget).attr('data-type');
        $(e.currentTarget).addClass('tabon').siblings().removeClass('tabon');
        var _id = $(e.currentTarget).attr('data-type');
        this.list=[];
        this.listLoadMore(_id);
    },
    detailPage:function(e){
        var _id = $(e.currentTarget).attr('data-nid');
        $.changePage('uc/manager/Detail/'+_id);
    }

});