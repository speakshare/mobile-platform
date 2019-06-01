var Backbone = require("../component/backbone.js");
// var oldRouter, ref = '';

function clearPageData() {
    $(window).scrollTop(0);
    fresh.$content.off();
    //.html('<div class="loading"></div><div class="grey center">加载中...</div>');
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
    _beforeRoute: function () {
        clearPageData();
    },

    routes: {
        '': 'yaoday',
        'yaoday/*': 'yaoday',
        'bonus/*': 'bonus'
    },
    yaoday: function () {
        var YaoDay = require('./home/home');
        new YaoDay({el: fresh.$content});
    },
    bonus: function () {
        var Bonus = require('./bonus/bonus');
        new Bonus({el: fresh.$content});
    }
});