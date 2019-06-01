module.exports = {
    routes: {
        'mall/*':                           'mall',
        'mall/phonefeeExchange/:pid/*':     'mallPhonefeeExchange',
        'mall/redExchange/:rid/*':          'mallRedExchange',
        'mall/addr/*':                      'mallAddr',
        'mall/peasRecord/*':                'mallPeasRecord',
        'mall/exchangeResult/:id/*':        'mallExchangeResult',
        'mall/goods/list/*':                'mallGoodsList',
        'mall/goodsDetail/:gid/*':          'mallGoodsDetail',
        'mall/goodsExchange/:gid/*':        'mallGoodsExchange',
        'mall/orders/*':                    'mallOrders',
        'mall/orderInfo/:oid/*':            'mallOrderInfo',
        'mall/lottery/*':                   'mallLottery',
        'mall/recharge/*':                  'mallRecharge',
        'mall/rechargeResult/*':            'mallRechargeResult',
        'mall/resign/*':                    'mallResign',
        'mall/wantgoods/*':                  'wantGoods',
    },
    methods: {
        mall: function () {
            require.ensure([],function(){
                var Mall = require('../mall/mall');
                new Mall({el: fresh.$content});
            },'mall')
        },
        mallGoodsExchange: function (gid) {
            require.ensure([],function(){
                var GoodsExchange = require('../mall/goods/goodsExchange/goodsExchange');
                new GoodsExchange({el: fresh.$content, gid: gid});
            },'mall')
        },
        mallPhonefeeExchange: function (pid) {
            require.ensure([],function(){
                var PhonefeeExchange = require('../mall/phonefee/phonefeeExchange/phonefeeExchange');
                new PhonefeeExchange({el: fresh.$content, pid: pid});
            },'mall')
        },
        mallRedExchange: function (rid) {
            require.ensure([],function(){
                var redExchange = require('../mall/red/redExchange/redExchange');
                new redExchange({el: fresh.$content, rid: rid});
            },'mall')
        },
        mallAddr: function () {
            require.ensure([],function(){
                var Addr = require('../mall/addr/addr');
                new Addr({el: fresh.$content});
            },'mall')
        },
        mallPeasRecord: function () {
            require.ensure([],function(){
                var PeasRecord = require('../mall/peas/peasRecord/peasRecord');
                new PeasRecord({el: fresh.$content});
            },'mall')
        },
        mallExchangeResult: function (id) {
            require.ensure([],function(){
                var ExchangeResult = require('../mall/exchangeResult/exchangeResult');
                new ExchangeResult({el: fresh.$content, id: id});
            },'mall')
        },
        mallGoodsList: function () {
            require.ensure([],function(){
                var goodsList = require('../mall/goods/list/list');
                new goodsList({el: fresh.$content});
            },'mall')
        },
        mallGoodsDetail: function (gid) {
            require.ensure([],function(){
                var goodsDetail = require('../mall/goods/goodsDetail/goodsDetail');
                new goodsDetail({el: fresh.$content, gid: gid});
            },'mall')
        },
        mallOrders: function () {
            require.ensure([],function(){
                var Orders = require('../mall/orders/orders');
                new Orders({el: fresh.$content});
            },'mall')
        },
        mallOrderInfo: function (oid) {
            require.ensure([],function(){
                var OrderInfo = require('../mall/orders/orderInfo/orderInfo');
                new OrderInfo({el: fresh.$content, oid: oid});
            },'mall')
        },
        mallLottery: function () {
            require.ensure([],function(){
                var Lottery = require('../mall/lottery/lottery');
                new Lottery({el: fresh.$content});
            },'mall')
        },
        mallRecharge: function () {
            require.ensure([],function(){
                var Recharge = require('../mall/recharge/recharge');
                new Recharge({el: fresh.$content});
            },'mall')
        },
        mallRechargeResult: function () {
            require.ensure([],function(){
                var RechargeResult = require('../mall/recharge/rechargeResult/rechargeResult');
                new RechargeResult({el: fresh.$content});
            },'mall')
        },
        mallResign: function () {
            require.ensure([],function(){
                var mallResign = require('../mall/peas/resign/resign');
                new mallResign({el: fresh.$content});
            },'mall')
        },
        wantGoods:function () {
            require.ensure([],function(){
                var wantGoodsPage = require('../mall/wantgoods/wantgoods');
                new wantGoodsPage({el: fresh.$content});
            },'mall')
        }
    }
}