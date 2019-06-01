var template = _.template(require('./order.html'));
require('./order.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.code=options.code
        this.getData();
    },
    getData:function(){
        var self=this;
        $.checkUser(function(){
            $.sync({
                url:fresh.apiRoot+'promotion/order/list',
                type:'post',
                data:{
                    promotionCode:self.code,
                    pageNo:1,
                    pageSize:1000
                },
                success:function(d){
                    self.cache=d;
                    self.render();
                }
            });
        });
    },
    render:function(){
        this.$el.html(template({list:this.cache.list}));
        $.setWeixinTitle('我的领取记录');
        return this;
    },
    events:{
        'tap .order-one':'changePage'
    },

    changePage:function(e){
        $.changePage('goods/'+$(e.currentTarget).attr('data-id'))
    }
});