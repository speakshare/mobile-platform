window.underscore=window._=require('../component/underscore.js');
window.Backbone=require('../component/backbone.js');
window.store = require('../component/store');

require('../component/helper');
require('./base/base.css');
require('../component/touch');
require('../libs/jsBridge');
require('../component/exif');

var apiPort=location.origin;
// var apiPort='https://app.91yaowang.com';
window.fresh = {
    cache: {},
    loadDate: 0,
    apiRoot:apiPort+'/app/webservice/v2/',
    batchRoot:apiPort+'/app/',
    init: function (){
        this.$body = $('body');
        this.$main = $('#mainPage');
        this.$content = $('#content');
        var Router = require('./router.js');
        window.fresh.router = new Router;
        Backbone.history.start({pushState: false});
    }
};

// window.onerror=function(e){
//     console.log(e)
//     return true
// };

$(function(){

    if($.getParam('isapp')){
        localStorage.setItem('yw_user_loginToken',$.getParam('loginToken'));
    }

    // _initShareInfo();
    // function _initShareInfo(){
    //     jsb.setShareInfo({
    //         title : '万元恋爱基金大作战',
    //         desc : '现在来摇旺晒幸福，赢取万元恋爱基金',
    //         link : location.origin+'/events/valentinesDay/index.html',
    //         icon : $.getStaticOrgin()+'/yaowang/valentinesDay/dist/share.png'
    //     });
    // }
    fresh.init();
});