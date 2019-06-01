var template = _.template(require('./coupon.html'));
require('./coupon.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.cache = options.cache;
        this.cache.selectedID = options.selectedID||0;
        this.callback=options.callback||function(){};
        this.render();
    },
    render:function (){
        // console.log(this.cache)
        this.$el.html(template(this.cache));
        return this;
    },
    events:{
        'tap .cancel-selected':'chooseEmpty',
        'tap .coupon-one':'chooseCoupon'
    },
    chooseCoupon:function (e) {
        var self=this,
            obj=$(e.currentTarget);
        obj.addClass('coupon-selected').siblings().removeClass('coupon-selected');
        setTimeout(function(){
            self.callback({
                id:obj.attr('data-id'),
                amount:obj.attr('data-amount'),
                limitAmount:obj.attr('data-limitAmount'),
                ruleType:obj.attr("data-ruleType")
            });
        },200)
    },
    chooseEmpty:function(){
        this.$el.find('.selectbtn').removeClass('selected');
        this.callback();
    }
});