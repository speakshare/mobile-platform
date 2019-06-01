var template = _.template(require('./activityPage.html'));
var activity = _.template(require('../newsCenter.html'));
require('../newsCenter.css');
var loadMoreNew = require('../../../common/red-bag/list/loadmore.js');
module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.cache = options.cache || {};
        this.data = {};
        this.$el.html(template({newsCount:this.data}));
        $.setAppNav('消息中心');
        this.getData();
    },
    getData:function(){

        var self = this;
        fresh.loadData && fresh.loadData.destory();
        fresh.loadData=loadMoreNew({
            url:fresh.apiRoot+'member/querySysInfo4Page',
            type:'post',
            loadFirstPage:true,
            data:{
                loginToken:$.getToken(),
                category:'2',
                page:0,
                count:10
            },
            success:function(d,hasMore){
                self.data = d;
                self.render();

                if(!hasMore){
                    if(self.data.list.length <4){
                        $('.newsTitle .bottomLine .title').addClass('titleModify');
                    }
                    self.$el.find('.bottomLine').show();
                }
            }
        });
    },
    events:{
        'tap .notice':'indexPage',
        'tap .detailBtn':'detailPage',
        'touchend .content':'detailPage',
        'touchend .title':'detailPage'
    },
    render:function (){
        this.$el.find('.newsList').append(activity({list:this.data.list}));
        return this;
    },
    indexPage:function(){
        $.changePage('uc/newsCenter');
    },
    detailPage:function(e){
        var  _id1 = $(e.currentTarget).parents('.item-li').attr('data-id');
        $.changePage('uc/newsCenter/activityDetail/'+_id1);
    }
});