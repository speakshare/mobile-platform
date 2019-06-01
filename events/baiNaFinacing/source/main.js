window.underscore=window._=require('./../component/underscore.js');
window.Backbone=require('./../component/backbone.js');
window.store = require('./../component/store');
require('./base/base.css');
require('./../component/helper');
require('./../component/touch');
// require('./../libs/bi');
require('./../libs/jsBridge');


var apiPort = location.origin; //提测使用这个
// var apiPort = 'https://app.91yaowang.com'; //测试环境api地址
// var apiPort = 'http://dev.91yaowang.com'; //开发环境api地址
// var apiPort = 'http://192.168.62.207:8081';  //基金
window.fresh = {
    cache: {},
    loadDate: 0,
    apiRoot:apiPort + '/app/webservice/v2/',
    batchRoot:apiPort + '/app/',
    weizhanApi:apiPort,
    init: function () {
        this.$body = $('body');
        this.$main = $('#mainPage');
        this.$content = $('#content');
        this.$footer = $('#footer');
        var Router = require('./router.js');
        window.fresh.router = new Router;
        Backbone.history.start({pushState: false});
    }
};
// window.onerror=function(){
//     return true;
// }
$(function(){
    var curUserID = $.getNub();
    if(curUserID){
        window.curUserID=parseInt(curUserID);
    }
    var id=$.getParam(location.href,'openid');
    $.setCache('weixinOpenID',id,86400,1);
    fresh.init();
});