window.underscore = window._ = require('./../component/underscore.js');
window.Backbone = require('./../component/backbone.js');
window.store = require('./../component/store');
require('./base/base.css');
require('./../component/helper');
require('./../component/touch');

var apiPort = location.origin; //提测使用这个
// var apiPort = 'https://app.91yaowang.com'; //测试环境api地址
// var apiPort = 'http://dev.91yaowang.com'; //开发环境api地址

window.fresh = {
    cache: {},
    loadDate: 0,
    apiRoot: apiPort + '/app/webservice/v2/',
    batchRoot: apiPort + '/app/',
    init: function () {
        this.$body = $('body');
        this.$main = $('#mainPage');
        this.$content = $('#content');
        var Router = require('./router.js');
        window.fresh.router = new Router;
        Backbone.history.start({pushState: false});
    }
};

$(function () {
    var curUserID = $.getNub();
    if (curUserID) {
        window.curUserID = parseInt(curUserID);
    }
    var id = $.getParam(location.href, 'openid');
    $.setCache('weixinOpenID', id, 86400, 1);
    fresh.init();
});