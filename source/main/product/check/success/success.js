var template = _.template(require('./success.html'));
require('./success.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.oid=options.oid;
        this.getData();
        
    },
    getData:function(){
        var self=this;
        $.sync({
            url:fresh.apiRoot+'order/orderDetail',
            type:'post',
            data:{
                orderNo:this.oid
            },
            success:function(d){
                self.cache=d;
                self.render();
                console.log(d);
            }
        })
    },
    render:function(){
        window.customEvent(3,'1.9.4','');
        this.$el.html(template(this.cache));
        $.setAppNav('购买成功','#product');
        $.fixDownloadApp();
        return this;
    },
    events:{
        'tap #toProduct':'toProduct',
        'tap #toMall':'toMall',
        'tap .download-app-btn':'downloadApp'
    },
    toProduct:function(){
        $.changePage('product');
    },
    toMall:function(){
        $.changePage('mall');
    }
    // downloadApp:function(){
    //     $.changePage('app/download');
    // }
});