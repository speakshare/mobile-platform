module.exports = {
    routes: {
        'fund/*':                       'fundHome',  //基金首页
        'preFund/*':                    'fundActivity',
        'fund/archives/:id/*':          'fundArchives',  //基金经理
        'fund/cate/*':                  'fundCategory',  //基金超市
        'fund/exponent/*':              'fundExponent',  //指数宝
        'fund/rule/*':                  'fundRule',    //基金规则
        'fund/search/:key/*':           'fundSearch',
        'fund/search/*':                'fundSearch',
        'fund/me/*':                    'fundMine',   //我的基金
        'fund/me/history/*':            'fundMineHistory',   //我的基金
        'fund/me/holdPosition/:fid/*':  'fundHoldPosition',   //基金持仓
        'fund/me/record/:rid/*':        'fundRecord',  //基金持仓交易记录
        'fund/:id/checkout/*':          'fundCheckout',    //下单以及确认
        'fund/:id/history*':            'fundHistory',  //基金历史
        'fund/:id/*':                   'fundDetail'  //基金详情
    },
    methods: {
        fundHome: function () {
            require.ensure([],function(){
                var fundHome = require('../fund/home/home');
                new fundHome({el: fresh.$content});
            },'fund')
        },
        fundArchives: function (id) {
            require.ensure([],function(){
                var fundArchives = require('../fund/archives/archives');
                new fundArchives({el: fresh.$content, aid: id});
            },'fund')
        },
        fundActivity: function () {
            require.ensure([],function(){
                var fundAc = require('../fund/home/activity');
                new fundAc({el: fresh.$content});
            },'fund')
        },
// fundCategory:function(){
//     require.ensure([],function(){
//         var fundCategory = require('../fund/category/category');
//         new fundCategory({el:fresh.$content});
//     },'fund')
// },
        fundCheckout: function (id) {
            require.ensure([],function(){
                var fundCheckout = require('../fund/check/check');
                new fundCheckout({el: fresh.$content, fid: id});
            },'fund')
        },
        fundDetail: function (id) {
            require.ensure([],function(){
                var fundDetail = require('../fund/detail/detail');
                new fundDetail({el: fresh.$content, fid: id});
            },'fund')
        },
        fundExponent: function () {
            require.ensure([],function(){
                var fundExponent = require('../fund/exponent/exponent');
                new fundExponent({el: fresh.$content});
            },'fund')
        },
        fundRule: function (id) {
            require.ensure([],function(){
                var fundRule = require('../fund/rule/rule');
                new fundRule({el: fresh.$content});
            },'fund')
        },
        fundHistory: function (id) {
            require.ensure([],function(){
                var fundHistory = require('../fund/history/history');
                new fundHistory({el: fresh.$content, fid: id});
            },'fund')
        },
        fundSearch: function (key) {
            require.ensure([],function(){
                var fundSearch = require('../fund/search/search');
                new fundSearch({el: fresh.$content, key: key});
            },'fund')
        },
        fundHoldPosition: function (fid) {
            require.ensure([],function(){
                var holdPosition = require('../fund/holdPosition/holdPosition');
                new holdPosition({el: fresh.$content, fid: fid});
            },'fund')
        },
        fundRecord: function (rid) {
            require.ensure([],function(){
                var fundRecord = require('../fund/holdPosition/record/record');
                new fundRecord({el: fresh.$content, rid: rid})
            },'fund')
        },
        fundMine: function () {
            require.ensure([],function(){
                var Mine = require('../fund/mine/mine');
                new Mine({el: fresh.$content})
            },'fund')
        },
        fundMineHistory: function () {
            require.ensure([],function(){
                var Mine = require('../fund/mine/mine');
                new Mine({el: fresh.$content, flag: 1})
            },'fund')
        }
    }
}