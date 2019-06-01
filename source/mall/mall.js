/**
 * Created by xmm  on 2016/9/5
 */
 var template = _.template(require('./mall.html'));
 require('./mall.css');
 module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type = options.type;
        $.setLoginTokenFormApp();
        window.customEvent( 3, '2.1.1', '积分商城子频道首页可见'  ); //埋点
        this.render();
        $.downloadApp();
    },

    render:function (){
        this.$el.html(template());
        $.setAppNav('旺豆家园');
        var peas = require('./peas/peas');
        new peas({el:$(".mall-peas")});
        var red = require('./red/red');
        new red({el:$(".mall-red")});
        var goods = require('./goods/goods');
        new goods({el:$(".mall-goods")});
        var phonefee = require('./phonefee/phonefee');
        new phonefee({el:$(".mall-phonefee")}); 
        if($.isApp() && $.getParam(location.href,'version')!="2.3"){
            $(".mall-index-wrapper").removeClass("pb51");
           fresh.$footer.hide();  
        }
        return this;
    }

});
  