module.exports = {
    routes: {
        'product/proOld/*':                             'productOld',
        'product/:pid/app/desc/*':                      'productAppDetail',
        'product/:pid/app/project/*':                   'productAppProject',
        'product/:pid/app/safety/*':                    'productAppSafety',

        'product/:pid/checkout/*':                      'productCheckout',
        'product/:pid/*':                               'productDetail',
        'product/:pid/records/*':                       'productRecords',
        'product/*':                                    'productList',

        'order/:oid/success/*':                         'productPaySuccess',

        'transfer/*':                                   'transferList',
        'transfer/detail/:oid/*':                       'transferDetail',
        'transfer/buy/:oid/checkout/*':                 'transferCheckout',
        'transfer/success/*':                           'transferSuccess',

        'yaobao/yaoBaoAutoInto/*':                      'yaoBaoAutoInto',
        'yaobao/:pid/rollin/*':                         'yaoBaoRollIn',
        'yaobao/:pid/rollin/success/:amount/:date/*':   'yaoBaoRollInSuc',
        'yaobao/:pid/rollout/*':                        'yaoBaoRollOut',
        'yaobao/:pid/rollout/success/:amount/*':        'yaoBaoRollOutSuc',
        'yaobao/:pid/profit/*':                         'yaoBaoProfit',
        'yaobao/:pid/*':                                'yaoBao',
        'yaobao/*':                                     'yaoBao'
    },
    methods: {
        productAppDetail: function (pid) {
            var Product = require('../main/product/app/detail/detail');
            new Product({el: fresh.$content, pid: pid});
        },
        productAppProject: function (pid) {
            var Product = require('../main/product/app/project/project');
            new Product({el: fresh.$content, pid: pid});
        },
        productAppSafety: function (pid) {
            var Product = require('../main/product/app/safety/safety');
            new Product({el: fresh.$content, pid: pid});
        },

        // productList: function () {
        //     var Product = require('../main/product/list/list');
        //     new Product({el: fresh.$content});
        // },
        productList:function(){
            var productList = require('../main/product/proList/proList');
            new productList({el:fresh.$content});
        },
        productOld: function () {
            var productOld = require('../main/product/proList/proOld/proOld');
            new productOld({el: fresh.$content});
        },
        productDetail: function (pid) {
            var Product = require('../main/product/detail/detail');
            new Product({el: fresh.$content, pid: pid});
        },
        productRecords: function (pid) {
            var Product = require('../main/product/records/records');
            new Product({el: fresh.$content, pid: pid});
        },
        productCheckout: function (pid) {
            var productCheckout = require('../main/product/check/check');
            new productCheckout({el: fresh.$content, pid: pid});
        },
        productPaySuccess: function (oid) {
            var productPaySuccess = require('../main/product/check/success/success');
            new productPaySuccess({el: fresh.$content, oid: oid});
        },

        transferList: function () {
            var TransferList = require('../main/transfer/list/list');
            new TransferList({el: fresh.$content});
        },
        transferSuccess: function () {
            var TransferSuccess = require('../main/transfer/success/success');
            new TransferSuccess({el: fresh.$content});
        },
        transferDetail: function (oid) {
            var transferDetail = require('../main/transfer/detail/detail');
            new transferDetail({el: fresh.$content, oid: oid});
        },
        transferCheckout: function (oid) {
            var transferPay = require('../main/transfer/check/check');
            new transferPay({el: fresh.$content, oid: oid});
        },
        yaoBaoAutoInto:function(){
            var yaoBaoAutoInto = require('../main/product/yaobao/yaoBaoAutoInto/yaoBaoAutoInto');
            new yaoBaoAutoInto({el: fresh.$content});
        },
        yaoBao: function (pid) {
            var yaoBao = require('../main/product/yaobao');
            new yaoBao({el: fresh.$content, pid: pid});
        },
        yaoBaoRollIn: function (pid) {
            var yaoBaoRollIn = require('../main/product/yaobao/rollin/rollin');
            new yaoBaoRollIn({el: fresh.$content, pid: pid});
        },
        yaoBaoRollInSuc: function (pid, amount, date) {
            var yaoBaoRollInSuc = require('../main/product/yaobao/success/success');
            new yaoBaoRollInSuc({el: fresh.$content, pid: pid, amount: amount, date: date});
        },
         yaoBaoRollOut: function (pid) {
            var yaoBaoRollOut = require('../main/product/yaobao/rollout/rollout');
            new yaoBaoRollOut({el: fresh.$content, pid: pid});
        },
        yaoBaoRollOutSuc: function (pid, amount) {
            var yaoBaoRollInSuc = require('../main/product/yaobao/rollout/rolloutsuccess');
            new yaoBaoRollInSuc({el: fresh.$content, pid: pid, amount: amount});
        },
        yaoBaoProfit: function (pid) {
            var yaoBaoProfit = require('../main/product/yaobao/profit/profit');
            new yaoBaoProfit({el: fresh.$content, pid: pid});
        }
    }
}