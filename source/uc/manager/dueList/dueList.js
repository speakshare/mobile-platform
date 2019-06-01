var template = _.template(require('./dueList.html'));
require('../manager.css');


module.exports = Backbone.View.extend({
	initialize: function () {
        this.list=[];
        this.getData();
    },
    getData:function(){
        var self=this;
        $.checkUser(function(){
            self.listLoadMore();  
        });
        
    },
    render:function(){
        this.$el.html(template(this.cache));
        $.setAppNav('一级邀请即将到期');
        return this;;
    }, 
    listLoadMore:function(){
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
                type:1,
                isDue:1,
                pageNo:0,
                pageSize:20
            },
            success: function (d,hasMore) {
                self.list=self.list.concat(d.investOrderList);
                self.cache={
                   list:self.list,
                   hasMore:hasMore
                }
                self.render();
            },
            error: null
        });
    }

})