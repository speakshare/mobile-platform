var template = _.template(require('./newsTitle.html'));
var notice = _.template(require('./newsCenter.html'));
require('./newsCenter.css');
var loadMoreNew = require('../../common/red-bag/list/loadmore.js');
module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.cache = options.cache || {};
        this.data = {};
        this.$el.html(template());
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
                category:'1,3,4',
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
        'tap .activity':'viwActivity',
        'touchend .detailBtn':'detailPage',
        'touchend .content':'detailPage',
        'touchend .title':'detailPage'
    },
    render:function (){
        this.$el.find('.newsList').append(notice({list:this.data.list}));
        // var ac=this.data.unReadActivityCount||100,
        //     obj=this.$el.find('.newsTips');
        // if(ac>0){
        //     obj.show().text(ac>99?'...':ac);
        //     if(ac>99){
        //         obj.addClass('dot');
        //     }else{
        //         obj.removeClass('dot');
        //     }
        // }
        $.setAppNav('消息中心');
        return this;
    },
    viwActivity:function(){
        $.changePage('uc/newsCenter/activityPage');
    },
    detailPage:function(e){
        var obj=$(e.currentTarget);
        var cate=obj.parents('.item-li').attr('data-cate');
        var  id=obj.parents('.item-li').attr('data-id');
        var routes={
            3:'uc/couponList',
            4:'member/home/'
        };

        if(routes[cate]){
            $.changePage(routes[cate])
        }else{
            $.changePage('uc/newsCenter/noticeDetail/'+id);
        }
    }
});