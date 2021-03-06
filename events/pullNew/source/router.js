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
            /* ref = location.href;
             setTimeout(function () {
             $('#changePageAnimate').fadeOut();
             }, 400);*/
        });
    },
    //before route
    _beforeRoute: function (curRouter) {
        clearPageData();
        /*oldRouter = curRouter;
         if (!ref) {
         fresh.$body.append('<div class="change_page_loading" id="changePageAnimate"><div class="page_loading"></div></div>');
         } else {
         $('#changePageAnimate').show();
         }*/
    },

    routes: {
        '': 'home',
        'home/*': 'home'
    },
    home: function () {
        var home = require('./home/home');
        new home({el: fresh.$content});
    }
});