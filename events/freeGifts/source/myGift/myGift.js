var template = _.template(require('./myGift.html'));
require('./myGift.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type = options.type;
        //R01001,R01002,R01003,R01004
        this.getData();
    },
    getData:function(){
        var self=this;
        this.cache=[];
        $.sync({
            url:fresh.apiRoot+'rightGive/orderList',
            type:'get',
            data:{
                loginToken:localStorage.getItem('yw_user_loginToken')
            },
            success:function(d){
                self.cache=d.list;
                self.render();
            },
            error:function(d){
                self.render()
            }
        })
    },
    render: function () {
        this.$el.html(template({list:this.cache}));
        $.setWeixinTitle('兑换记录');
        return this;
    },
    events:{
        'tap .back-btn':'gotback'
    },
    gotback:function(){
        $.changePage('');
    }
});