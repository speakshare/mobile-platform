var template = _.template(require('./detail.html'));
require('./detail.css');

module.exports = Backbone.View.extend({
    initialize: function (option) {
        this.oid=option.oid;
        this.code= option.code;
        this.getData();
    },
    getData:function(){
        var self=this;
        $.sync({
            url:fresh.apiRoot+'promotion/order/detail',
            data:{
                orderNo:this.oid
            },
            type:'post',
            success:function(d){
                self.cache=d;
                self.render();
                console.log(d)
            }
        });
    },
    render:function(){
        this.$el.html(template(this.cache));
        $.setAppNav('订单详情');
        return this;
    },
    events:{
        'tap #investDetail':'investDetail'
    },
    investDetail:function(){
        var oid= this.oid;
        $.changePage('product/'+ oid +'/detail/');
    }
});