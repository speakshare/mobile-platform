var template = _.template(require('./order.html'));
require('./order.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        $.setLoginTokenFormApp();
        this.getData();
    },
    getData:function(){
        var self=this;
        if($.getToken()){
            $.sync({
                url:fresh.apiRoot+'memberday/awardlist',
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
        }else{
            window.location='/weizhan/#login';
        }
    },
    render:function(){
        this.$el.html(template({list:this.cache.list}));
        $.setWeixinTitle('我的奖品');
        return this;
    },
    events:{
        'tap .back-btn':'changePage'
    },

    changePage:function(){
        $.changePage('')
    }
});