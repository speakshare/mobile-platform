module.exports={
    routes: {
        'uc/home/*':                                'ucHome',
        'uc/myInfo/*':                              'myInfo',
        // 'uc/careFoundation/*':                      'ucCareFoundation',

        'uc/asset/*':                               'ucAsset',
        'uc/profit/*':                              'ucProfit',
        'uc/tradingRecord/*':                       'ucTradingRecord',
        'uc/transfer/:oid/*':                       'ucTransfer',
        'uc/complete/:oid/*':                       'ucComplete',
        'uc/fund/':                                 'ucFund',
        'uc/fund/:id/':                             'ucFundDetail',
        'uc/orders/compact/*':                      'ucCompactList',
        'uc/orders/compactDetail1/:mid/:id/:type/*':       'ucCompactDetail1',
        'uc/orders/compactDetail2/:id/*':           'ucCompactDetail2',
        'uc/orders/:oid/*':                         'ucOrdersDetail',
        'uc/orders/*':                              'ucOrders',


        'uc/accountInsurance/*':                    'ucInsurance',
        'uc/myPolicy/*':                            'ucMyPolicy',
        'uc/policyClause/*':                        'ucPolicyClause',

        'uc/invite/landingPage/*':                  'ucInviteLandingPage',
        'uc/invite/appdownload/*':                  'ucInviteAppdownload',
        'uc/invite/*':                              'ucInvite',
        'uc/invite/inviteRecords/*':                'ucInviteRecords',

        'uc/couponList/*':                          'ucCouponList',

        'uc/newsCenter/*':                          'ucNewsCenter',
        'uc/newsCenter/activityPage/*':             'ucNewsActivity',
        'uc/newsCenter/noticeDetail/:nid/*':        'ucNoticeDetail',
        'uc/newsCenter/activityDetail/:aid/*':      'ucActivityDetail',
        'uc/help/*':                                'ucHelp'
    },
    methods:{
        ucHome:function(){
            require.ensure([],function(){
                var ucHome = require('../uc/home/home');
                new ucHome({el:fresh.$content});
            },'uc')
        },
        myInfo:function(){
            require.ensure([],function(){
                var myInfo = require('../uc/home/myInfo/myInfo');
                new myInfo({el:fresh.$content});
            },'uc')
        },
        // ucCareFoundation:function(){
        //     require.ensure([],function(){
        //         var ucCareFoundation = require('../uc/home/careFoundation/careFoundation');
        //         new ucCareFoundation({el:fresh.$content});
        //     },'uc')
        // },
        
        ucAsset:function(){
            require.ensure([],function(){
                var ucAsset = require('../uc/asset/asset');
                new ucAsset({el:fresh.$content});
            },'uc')
        },
        ucInsurance:function(){
            require.ensure([],function(){
                var UcInsurance = require('../uc/accountInsurance/accountInsurance');
                new UcInsurance({el:fresh.$content});
            },'uc')
        },
        ucMyPolicy:function(){
            require.ensure([],function(){
                var UcMyPolicy = require('../uc/accountInsurance/myPolicy/myPolicy');
                new UcMyPolicy({el:fresh.$content});
            },'uc')
        },
        ucPolicyClause:function(){
            require.ensure([],function(){
                var UcPolicyClause = require('../uc/accountInsurance/policyClause/policyClause');
                new UcPolicyClause({el:fresh.$content});
            },'uc')
        },
        ucProfit:function(){
            require.ensure([],function(){
                var ucProfit = require('../uc/profit/profit');
                new ucProfit({el:fresh.$content});
            },'uc')
        },
        ucOrders:function(){
            require.ensure([],function(){
                var ucOrders = require('../uc/orders/orders');
                new ucOrders({el:fresh.$content});
            },'uc')
        },
        ucOrdersDetail:function(oid,pid){
            require.ensure([],function(){
                var ucOrdersDetail = require('../uc/orders/ordersDetail/ordersDetail');
                new ucOrdersDetail({el:fresh.$content,oid:oid,pid:pid});
            },'uc')
        },
        ucTransfer: function(oid){
            require.ensure([],function(){
                var ucTransfer = require('../uc/orders/transfer/transfer');
                new ucTransfer({el:fresh.$content,oid:oid});
            },'uc')
        },
        ucInvite:function(){
            require.ensure([],function(){
                var ucInvest = require('../uc/invite/invite');
                new ucInvest({el:fresh.$content});
            },'uc')
        },
        ucInviteRecords:function(){
            require.ensure([],function(){
                var ucInvestRecords = require('../uc/invite/inviteRecords/inviteRecords');
                new ucInvestRecords({el:fresh.$content});
            },'uc')
        },
        ucInviteLandingPage:function(){
            require.ensure([],function(){
                var EventInvest = require('../uc/invite/landingPage/landingPage');
                new EventInvest({el:fresh.$content});
            },'uc')
        },
        ucInviteAppdownload:function(){
            require.ensure([],function(){
                var ucInviteAppdownload = require('../uc/invite/appdownload/appdownload');
                new ucInviteAppdownload({el:fresh.$content});
            },'uc')
        },
        ucComplete: function(oid){
            require.ensure([],function(){
                var ucComplete = require('../uc/orders/complete/complete');
                new ucComplete({el:fresh.$content,oid:oid});
            },'uc')
        },

        ucCouponList: function(){
            require.ensure([],function(){
                var temp = require('../uc/coupon/coupon');
                new temp({el:fresh.$content});
            },'uc')
        },
        ucNewsCenter:function(){
            require.ensure([],function(){
                var ucNewsCenter = require('../uc/newsCenter/newsCenter');
                new ucNewsCenter({el:fresh.$content});
            },'uc')
        },
        ucNewsActivity:function(){
            require.ensure([],function(){
                var ucNewsActivity = require('../uc/newsCenter/activityPage/activityPage');
                new ucNewsActivity({el:fresh.$content});
            },'uc')
        },
        ucNoticeDetail:function(nid){
            require.ensure([],function(){
                var ucNoticeDetail = require('../uc/newsCenter/detailPage/noticeDetail/notice');
                new ucNoticeDetail({el:fresh.$content,nid:nid});
            },'uc')
        },
        ucActivityDetail:function(aid){
            require.ensure([],function(){
                var ucActivityDetail = require('../uc/newsCenter/detailPage/activityDetail/activity');
                new ucActivityDetail({el:fresh.$content,aid:aid});
            },'uc')
        },
        
        ucTradingRecord:function(){
            require.ensure([],function(){
                var ucTradingRecord = require('../uc/tradingRecord/tradingRecord');
                new ucTradingRecord({el:fresh.$content});
            },'uc')
        },
        ucFund:function(){
            require.ensure([],function(){
                var ucFund = require('../uc/fund/home/home');
                new ucFund({el:fresh.$content});
            },'uc')
        },
        ucFundDetail:function(id){
            require.ensure([],function(){
                var ucFundDetail = require('../uc/fund/detail/detail');
                new ucFundDetail({el:fresh.$content});
            },'uc')
        },
        ucCompactList:function(){
            require.ensure([],function(){
                var ucCompactList = require('../uc/orders/compact/compact');
                new ucCompactList({el:fresh.$content});
            },'uc')
        },
        ucCompactDetail1:function(mid,id,type){
            require.ensure([],function(){
                var ucCompactDetail1 = require('../uc/orders/compact/compactDetail1/compactDetail1');
                new ucCompactDetail1({el:fresh.$content,mid:mid,id:id,type:type});
            },'uc')
        },
        ucCompactDetail2:function(id){
            require.ensure([],function(){
                var ucCompactDetail2 = require('../uc/orders/compact/compactDetail2/compactDetail2');
                new ucCompactDetail2({el:fresh.$content,id:id});
            },'uc')
        },
        ucHelp: function(){
            require.ensure([], function () {
                var ucHelp = require('../uc/setting/help/help');
                new ucHelp({el: fresh.$content});
            }, 'uc');
        }
    }
}