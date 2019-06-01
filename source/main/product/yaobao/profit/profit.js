/**
 * Created by wangjingang on 2017/3/10 0010.
 */
var content = require('./profit.html');
var template = _.template(require('./template.html'));
require('./profit.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.pid = options.pid;
        this.render();
        this.loadMore=this.$('#loadMore')
        this.pageSize = 10;
        this.pageNum = 0;
        this.getData();
    },
    events:{
        'tap #loadMore':'loadMoreData'
    },
    loadMoreData:function () {
        if(this.pageNum==0){
            history.go(-1);
            return ;
        }
        if(this.isLast){
            this.loadMore.text("没有更多了");
        }else{
            this.getData();
        }

    },
    getData: function () {
        var self = this;
        $.checkUser(function () {
            $.sync({
                type: "POST",
                url: fresh.apiRoot + 'member/selectAccumulatedProfit',
                data: {
                    pageIndex: self.pageNum,
                    pageSize: self.pageSize,
                    productNo: self.pid,
                    sort: "-1"
                },

                success: function (d) {
                    self.$('#totalProfit').text($.amountFormat(d.totalProfit));
                    var pList = d.dataList;
                    if(pList && pList.length){
                        self.showInView(pList);
                        self.pageNum++;
                        if(pList.length<self.pageSize){
                            self.loadMore.text("没有更多了");
                            self.isLast=true;
                        }else{
                            self.loadMore.text("加载更多");
                        }
                    }else{
                        if(!self.pageNum){
                            self.loadMore.text("您还没有收益，快去投资赚取收益哦~");
                        }else{
                            self.loadMore.text("没有更多了");
                        }
                    }
                },
                error: function (e) {
                    self.$el.html('');
                    $.toast(e.msg);
                }
            });

        })

    },
    showInView: function (list) {
        var str='';
        for(var i=0;i<list.length;i++){
            var item=list[i];
            str+=template(item);
        }
        this.$("#profitListView").append(str);
    },
    render: function () {
        this.$el.html(content);
        $.setAppNav('摇宝累计收益');
        return this;
    }
})