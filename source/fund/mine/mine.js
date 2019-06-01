var template = _.template(require('./mine.html'));
var list = _.template(require('./list.html'));
var AssetInfo = require('./asset-info/asset-info');
require('./mine.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        var self=this;
        this.flag=options.flag||0;
        this.curPage=[1,1];
        this.hasData=[0,0];
        $.checkUser(function(){
            self.$el.html(template({flag:self.flag}));
            new AssetInfo({el:self.$el.find('.asset-info-box')});
            self.getData();
        });
    },
    getData:function(){
        var self=this;
        fresh.loadData && fresh.loadData.destory();
        fresh.loadData = $.loadMoreFund({
            url: fresh.apiRoot + 'fund/customer/position'+(this.flag==1?'/history':''),
            type: 'post',
            loadFirstPage: !self.hasData[self.flag],
            data: {
                loginToken:$.getToken(),
                platform:'wap',
                pageNo:self.curPage[self.flag],
                // pageSize:1
            },
            success:function(d,hasMore){
                self.hasData[self.flag]=1;
                if(d && d.result && d.result.length > 0){
                    self.curPage[self.flag]+=1;
                    self.render(d.result);
                }else{
                    if(self.curPage[self.flag]==1){
                        self.render([])
                    }
                    fresh.loadData.destory();
                }
                console.log(d)
            }
        });
    },
    render:function(d){
        this.$el.find('.fund-list-'+this.flag).append(list({list:d,flag:this.flag}));
    },
    events:{
        'tap .gotoFund': 'propApp',
        'tap .flist': 'switchTab',
        'tap .f-item':'gotoFund'
    },
    switchTab: function(e){
        var self=this,
            obj = $(e.target),
            flag=obj.attr('data-flag');
        if(!obj.hasClass("active")){

            self.flag=flag;
            self.getData();
            self.$el.find('.flist').eq(self.flag).addClass('active').siblings().removeClass('active');
            self.$el.find('.fund-list-'+self.flag).show().siblings().hide();
        }
    },
    propApp: function(){
        var that = this;
        $.popWindow({
            title: '',
            content: '相关功能目前仅在App提供请你下载摇旺App，为您提供更多服务',
            yes: '确认',
            no: '取消',
            type: 2,
            callback: function(flag){
                if(flag){
                    $.changePage('app/download')
                }
            }
        });
    },
    gotoFund:function(e){
        var id = $(e.currentTarget).attr("data-id");
        $.changePage('fund/me/holdPosition/'+id);
    }
});