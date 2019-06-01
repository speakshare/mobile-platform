var template = _.template(require('./mine.html'));
require('./mine.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        this.cache = {};
        this.data = {};
        this.data.flag = true;  //标示tab标签的选中状态
        var tempDate = new Date().getTime() ; 
        var tDay = new Date(tempDate);
        var yDay = new Date(tempDate - 86400000);
        var dayN = yDay.getDate();
        var monthN = yDay.getMonth() + 1;
        var tempMD = dayN + "/" + monthN;
        this.data.ydm = tempMD;
        this.data.dm = tDay.getDate()+ "/" + (tDay.getMonth() + 1);
        this.init();
    },

    //初始化页面数据
    init: function(){
        var platform = $.isWeixin() ? 4 : 3;
        var self = this;
        self.cache = {
            data:self.data,
            asset:{},
            list:[]
        };
        
        $.batSync({
            data:[
                {url:fresh.apiRoot + 'fund/customer/asset',data:{loginToken: $.getToken(), platform:platform}},
                {url:fresh.apiRoot + 'fund/customer/position',data:{loginToken: $.getToken(), platform:platform, pageNo:0}}
            ],
            success:function(d){
                self.cache={
                    asset:d[0] && d[0].data ? d[0].data : {},   //基金资产信息
                    list: d[1] && d[1].data && d[1].data.result ? d[1].data.result : [],  //中间部分的数据列表
                    data: self.data  //其他不需要请求接口可以获得的数据
                };
                self.render(self.cache);
            },
            error:function(d){
                $.toast(d.respMsg);
                self.cache = self.cache ? self.cache :{asset:{}, list:{}, data:self.data}
                self.render(self.cache);
            }
        });
        this.getData();
    },

    //页面滚动加载,flag标示是否是切换标签
    getData:function(flag){
        var self = this;
        var platform = $.isWeixin() ? 4 : 3;
        var pageNo = flag ? 0 : 1;
        fresh.loadData && fresh.loadData.destory();
        if(self.data.flag){
            fresh.loadData = $.loadMore({
                url: fresh.apiRoot + 'fund/customer/position',
                type: 'post',
                loadFirstPage: flag,
                data: {
                    loginToken: $.getToken(),
                    platform:platform,
                    pageNo:pageNo
                },
                success:function(d){
                    if(d.data && d.data.result && d.data.result.length > 0){
                        self.cache.list = self.cache.list.concat(d.data.result);
                    }
                    self.render(self.cache);
                },
                error: function(d){
                    if(d.msg){
                        $.toast(d.msg);
                    }
                    self.render(self.cache);
                }
            });
        }else{
            fresh.loadData = $.loadMore({
                url: fresh.apiRoot + 'fund/customer/position/history',
                type: 'post',
                loadFirstPage: true, 
                data: {
                    loginToken: $.getToken(),
                    platform:platform,
                    pageNo:0
                },
                success:function(d){
                    if(d.data && d.data.result && d.data.result.length > 0){
                        self.cache.list = self.cache.list.concat(d.data.result);
                    }
                    self.render(self.cache);
                },
                error: function(d){
                    if(d.msg){
                        $.toast(d.msg);
                    }
                    self.render(self.cache);

                }
            });
        }
    },
    render:function(data){
         this.$el.html(template(data));
        return this;
    },
    events:{
        'tap .gotoFund': 'propApp',
        'tap .flist': 'switchTab',
        'tap .f-item':'gotoFund'
    },
    //切换tab标签事件, flag：true表示持仓，false表示历史持仓
    switchTab: function(e){
        var target = e.target;
        var that = this;
        if(!$(target).hasClass("active")){
            that.cache.list = [];   //切换tab的时候，清空历史列表数据，其他数据不动
            if($(target).hasClass("holding")){
                that.cache.data.flag = true;
                that.data.flag = true;
            }else{
                that.cache.data.flag = false;
                that.data.flag = false;
            }
            that.getData(true);
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
            callback: that.callback.bind(that)
        });
    },

    //回调，跳转app下载页面
    callback: function(flag){
        if(flag){
            location.href = "/weizhan/#app/download";
        }
    },

    gotoFund:function(e){
        var self = $(e.currentTarget);
        var _idn = self.attr("data-id");
        $.changePage('fund/me/holdPosition/'+_idn);
    }
});