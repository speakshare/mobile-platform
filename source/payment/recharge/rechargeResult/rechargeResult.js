var template = _.template(require('./rechargeResult.html'));
require('./rechargeResult.css');

module.exports = Backbone.View.extend({
    initialize: function (){
        this.getData();
    },   
    getData:function (){
        var self=this;
        var moneys = $.getCache('yw_user_rechargeMoney');
        self.cache = this.toDecimal2(Number(moneys));
        self.render();
    },
    render:function (){
        this.$el.html(template({rechargeMoney:this.cache}));
        $.setAppNav('充值结果');
        $.fixDownloadApp();
        return this;
    },
    events:{
        'tap #keepRecharge':'keepRecharge',
        'tap #goPro':'goPro',
        'tap #checkChit':'checkChit'
    },
    keepRecharge:function(){
        $.changePage('payment/recharge');
    },
    goPro:function(){
        $.changePage('product');
    },
    checkChit:function(){
        $.changePage('uc/myPolicy/');
    },
    toDecimal2:function (x){
    var f = parseFloat(x);
    if (isNaN(f)) { return false; }
    var f = Math.round(x*100)/100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) { rs = s.length; s += '.'; }
    while (s.length <= rs + 2) { s += '0'; }
    return s;
}
});