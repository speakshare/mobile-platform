var template = _.template(require('./coupleCard.html'));
require('./coupleCard.css');
module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type=options.type;
        this.cid=options.cid;
        this.getData(options.cid);
        this.list=[];
    },
    getData:function(id){
        var isShare=$.getParam('isShare')?true:false;
        var self=this;
        $.batSync({
            data:[
                {url:fresh.apiRoot + 'loveractivity/selectLoverCardInfo',data:{cardId:id}},
                {url:fresh.apiRoot + 'loveractivity/wishList',data:{cardId:id}}       
            ],
            success:function(d){
                self.cache={
                    cardinfo : d[0],
                    list : d[1],
                    isFromShare:isShare
                }
                self.render();
            },
            error:function(d){
                $.toast(d.msg);
                $.changePage('home')
            }
        });
    },
    render: function () {
        this.$el.html(template(this.cache));
        $.setWeixinTitle('情侣证');
        jsb.setShareInfo({
            title : '我们在一起了，祝福我们吧！',
            desc : '我们的幸福需要你的祝福',
            link : location.origin+'/events/valentinesDay/index.html#coupleCard/'+this.cid+'?isShare=true',
            icon : $.getStaticOrgin()+'/yaowang/events/valentinesDay/dist/share.jpg'
        });
        return this;
    },
    events:{
        'tap .blessbtn':'bless',
        'tap .sharebtn':'share',
        'tap .joinbtn' :'tohome'
    },
    bless:function(){
        var self=this;
        $.sync({
            url: fresh.apiRoot + 'loveractivity/sendWish',
            data: {cardId:self.cid},
            type: 'post',
            success: function(d){
                var textDom=self.$el.find('#blesscount');
                textDom.text(parseInt(textDom.text())+1);
                self.$el.find('.blesslist').prepend('<p class="blessinfo">'+d.wishContent+'</p>')
            }
        });
    },
    share:function(){
        jsb.share();
    },
    tohome:function(){
        $.changePage('home');
    }

});