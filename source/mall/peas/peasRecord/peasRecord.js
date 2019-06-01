/**
 * Created by xmm  on 2016/9/5
 */
 var template = _.template(require('./peasRecord.html'));
 require('./peasRecord.css');
 module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type = options.type;
        this.list=[];
        this.getData();
    },
    getData:function(){
        var self=this;
        $.checkUser(function(){
            self.loadMore();   
        });
    },
    render:function (){
        this.$el.html(template({peaNum:this.pointTotalAmt,peasRecordlist:this.peasRecordlist}));
        $.setAppNav('我的旺豆');
        return this;
    },
    events:{
        'tap .exchangeRecords':'exchangeRecords',
        'tap .pearaidersbtn'    :'pearaiders'
    }, 
    exchangeRecords:function(){
        $.changePage('mall/exchangeRecords');
    },
    pearaiders:function(){
        $.changePage("staticPage/peasRaiders");
    },
    loadMore:function(){
        var self = this;
        if (self.startload) return;
        fresh.loadData&&fresh.loadData.destory();
        fresh.loadData=$.loadMore({
            loading: '.loading',
            padding: 20,
            url: fresh.apiRoot + 'point/history',
            type:'post',
            loadFirstPage: true,     
            data: {
                pageNo:1,
                pageSize:15
            },
            success: function (d) {
                self.pointTotalAmt  = d.pointTotalAmt;
                self.list=self.list.concat(d.list);
                self.peasRecordlist = self.list;
                self.render();
            },
            error: null
        });
    }

});