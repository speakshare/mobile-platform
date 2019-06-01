var template = _.template(require('./rechargeResult.html'));
require('../recharge.css');
module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.cache = options.cache || {};
        // this.getData();
        this.render();
    },
    render:function (){
        this.$el.html(template());
        $.setAppNav('兑换结果');
        return this;
    },
    events:{
        'tap .goOnEx':'toMall',
        'tap .checkOrders':'check'
    },
    toMall:function(){
        $.changePage('mall');
    },
    check:function(){
         $.changePage('mall/orders');
    }
});