var template = _.template(require('./success.html'));
require('./success.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.oid=options.oid;
        this.code = options.code;
        this.getData();
        // this.render();
    },
    getData:function(){
        var self=this;
        $.sync({
            url: fresh.apiRoot + 'promotion/order/result',
            type:'post',
            data:{
                orderNo:this.oid
            },
            success:function(d){
                self.cache=d;
                self.render();
            }
        })
    },
    render:function(){
        this.$el.html(template(this.cache));
        $.setAppNav('购买成功');
        return this;
    },
    events:{
        'tap #toAct':'toAct'
    },
    toAct:function(){
        $.changePage('/home/'+this.code);
    }
});