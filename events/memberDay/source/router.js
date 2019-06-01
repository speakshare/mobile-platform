var Backbone = require("../component/backbone.js");
/*var oldRouter, ref = '';*/

function clearPageData() {
    fresh.$content.off().html('<div class="loading"></div><div class="grey center">加载中...</div>');
}

module.exports = Backbone.Router.extend({
    initialize: function () {
        // var that = this;
        this.bind('route', function (curRouter) {
            //after Route
        });
    },
    //before route
    _beforeRoute: function (curRouter) {
        clearPageData();
    },

    routes: {
        '':                         'home',
        'home/*':                   'home',
        'order/*':                  'order',
        'login/*':                  'login'
    },
    home:function(code){
        var Home = require('./home/home');
        new Home({el: fresh.$content,code:code});
    },
    order:function(code){
        var goodsOrder=require('./order/order');
        new goodsOrder({el: fresh.$content,code:code});
    },
    login:function(){
        localStorage.setItem('yw_user_after_login_link',location.origin+location.pathname);
        location.replace('/weizhan/#login');
    }
});