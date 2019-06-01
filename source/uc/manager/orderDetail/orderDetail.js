var template = _.template(require('./orderDetail.html'));
require('../manager.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        $.setLoginTokenFormApp();
        this.type = options.type;
        this.oid = options.oid;
        this.getData(this.oid);
    },
    getData:function(oid){
        var self= this;
        $.batSync({
            data:[
                {url:fresh.apiRoot+'lcds/invite/order',data:{loginToken:$.getToken(),orderNo:oid}},
                {url:fresh.apiRoot +'order/orderDetail',data:{loginToken:$.getToken(),orderNo:oid}}             
            ],
            success:function(d){
                console.log(d);
                console.log(d.amount);
                self.cache={
                    amount: d[0],
                    order:d[1]
                };
                self.render();
            },
            error:function(){
                self.render();
            }
        })
    },
    render:function (){
        this.$el.html(template({amount:this.cache.amount,order:this.cache.order,oid:this.oid}));
        $.setAppNav('订单详情');
        return this;
    }
});