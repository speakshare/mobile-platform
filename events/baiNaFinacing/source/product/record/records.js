var records = _.template(require('./records-list.html')),
    template = _.template(require('./records.html'));
require('./record.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.getData(options.pid);
        this.$el.html(template());

        $.setAppNav('投资记录');
    },
    getData:function(pid){
        var self = this;
        fresh.loadData && fresh.loadData.destory();
        fresh.loadData=$.loadMoreData({
            url: fresh.apiRoot + 'member/selectProductInvestmentRecords',
            type:'post',
            data: {
                productNo:pid,
                pageCount:15,
                currentPage:0
            },
            loadFirstPage:true,
            success: function(d){
                self.cache=d;
                self.render();
            }
        });
    },
    render:function (){
        if(this.cache.list.length){
            this.$el.find('.productRecords').append(records(this.cache));
        }else{
            this.$el.find('.productRecords').append('<p class="tip">没有更多了</p>');
            fresh.loadData.destory()
        }
        return this;
    }
});


