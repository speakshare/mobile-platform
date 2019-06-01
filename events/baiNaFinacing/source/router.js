var Backbone = require("../component/backbone.js");
/*var oldRouter, ref = '';*/

/*function clearPageData() {
 fresh.$content.off().html('<div class="loading"></div><div class="grey center">加载中...</div>');
 }*/

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
        /*clearPageData();
         oldRouter = curRouter;
         if (!ref) {
         fresh.$body.append('<div class="change_page_loading" id="changePageAnimate"><div class="page_loading"></div></div>');
         } else {
         $('#changePageAnimate').show();
         }*/
    },

    routes: {
        '':                         'home',
        'home/*':                   'home',
        'home/:code/*':             'home',
        'goods/:code/:gid/:pid/*':  'goodsDetail',
        'goods/:oid/:code/*':       'goodsSuccess',  //商品购买结果
        'goods/:oid/*':             'goodsOrderDetail',  //商品订单详情
        'order/:code/*':            'goodsOrder',
        'product/:pid/records/*':   'productRecord',  //购买记录
        'product/:oid/detail/*':    'productOrderDetail',  //投资产品详情
        'product/:pid/*':           'productDetail' , //产品详情
        'protocol/:pcode/*'    :    'protocol'
    },
    home:function(code){
        var Home = require('./home/home');
        new Home({el: fresh.$content,code:code});
    },
    goodsDetail:function(code,gid,pid){
        var HiCar = require('./home/HiCar/HiCar');
        var goodsDetail = require('./detail/detail');
        new goodsDetail({el: fresh.$content,code:code,gid:gid,pid:pid});
    },
    goodsOrder:function(code){
        var goodsOrder=require('./order/order');
        new goodsOrder({el: fresh.$content,code:code});
    },
    productDetail:function(pid){
        var productDetail = require('./product/detail/detail');
        new productDetail({el: fresh.$content, pid: pid});
    },
    productRecord:function(pid){
        var productRecord = require('./product/record/records');
        new productRecord({el: fresh.$content, pid: pid});
    },
    goodsSuccess: function (oid,code) {
        var goodsSuc = require('./detail/success/success');
        new goodsSuc({el: fresh.$content, oid: oid, code:code});
    },
    goodsOrderDetail:function(oid){
        var goodsOrderDetail = require('./order/detail/detail');
        new goodsOrderDetail({el: fresh.$content, oid: oid});
    },
    productOrderDetail: function (oid) {
        var productOrder = require('./product/order/orders-detail');
        new productOrder({el: fresh.$content, oid: oid});
    },
    protocol:function(pcode){
        var Protocol = require('./protocol/protocol');
        new Protocol({el: fresh.$content,pcode:pcode});
    }
});