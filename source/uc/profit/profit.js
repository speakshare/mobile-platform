var template = _.template(require('./profit.html'));
var template2 = _.template(require('./profitList.html'));
require('./profit.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        this.$el.html(template());
        $.setAppNav('累计收益');
        this.getData();
    },
    getData:function(){
        var self=this;
        $.checkUser(function(){
            fresh.loadData && fresh.loadData.destory();
            fresh.loadData=$.loadMore({
                url:fresh.apiRoot+'member/queryProfitLog',
                type:'post',
                data:{
                    pageNo:0,
                    pageCount:15
                },
                loadFirstPage:true,
                success:function(d){
                    self.cache=d;
                    self.render();
                }
            })
        })
    },
    render:function(){
        this.$el.find('.asset-all-num').html($.amountFormat(this.cache.amtprofit));

        this.$el.find('.asset-detail').append(template2(this.cache));
        if(!this.first){
            this.first=true;
            this.$el.find('.profit-btn').eq(0).addClass('active arrow-down').next().show();
        }
        return this;
    },
    events:{
        'tap .profit-btn':'changeDetail'
    },
    changeDetail:function(e){
        var obj=$(e.currentTarget);
        if(!obj.hasClass('active')){
            obj.addClass('active arrow-down').next().show()
        }else{
            obj.removeClass('active  arrow-down').next().hide()
        }
    }
});