module.exports={
    routes: {
        'uc/manage/yaobaoRecord/:yid*':             'ucYaobaoRecord',
        'uc/manage/orderDetail/:oid/*':             'ucOrderDetailM',
        'uc/manage/inviteRecord/*':                 'ucInviteRecord',
        'uc/manage/investRecord/*':                 'ucInvestRecord',
        'uc/manage/customerRecord/*':               'ucCustomerRecord',
        'uc/manage/customerDetail/:did/*':          'ucCustomerDetail',

        'uc/manager/*':                             'ucManager',
        'uc/manager/myCustomer/*':                  'ucMyCustomer',
        'uc/manager/accumulate/*':                  'ucAccumulate',
        'uc/manager/red/*':                         'ucRed',
        'uc/manager/Detail/:cid/*':                 'ucDetail',
        'uc/manager/orderDetail/:oid/*':            'ucOrderDetails',
        'uc/manager/duelist/*':                     'dueList',
        'uc/manager/makeMoneyGuide/*':              'makeMoneyGuide',


        'common/aquiredRed/*':                      'coAcquiredRed',
        'common/acquiredCoupon/*':                  'coAcquiredCoupon',

        'uc/risk/start/*':                          'ucRiskStart',
        'uc/risk/question/*':                       'ucRiskQuestion',
        'uc/risk/result/*':                         'ucRiskResult',

        'uc/calendar/*':                            'ucCalendar',
        'uc/calendar/:year/*':                      'ucCalendar',
        'uc/calendar/:year/:month/*':               'ucCalendar',
        'uc/calendar/:year/:month/:day/*':          'ucCalendarDate',
        'uc/calendar/:year/:month/:day/:type/*':    'ucCalendarDate',

        'uc/setting/*':                             'ucSetting',
        'uc/setting/safetyCenter/*':                'ucSafetyCenter',
        'uc/setting/changeLoginPwd/*':              'ucChangeLoginPwd',
        'uc/setting/tradePwdManager/*':             'ucTradePwdManager',
        'uc/setting/changePayPwd/*':                'ucChangePayPwd',
        'uc/setting/forgetPayPwd/*':                'ucForgetPayPwd'
    },
    methods:{
        ucYaobaoRecord:function(yid){
            require.ensure([],function(){
                var ucYaobaoRecord = require('../uc/manage/yaobaoRecord/yaobaoRecord');
                new ucYaobaoRecord({el:fresh.$content,yid:yid});
            },'ucM')
        },
        ucOrderDetailM:function(oid){
            require.ensure([],function(){
                var ucOrderDetailM = require('../uc/manage/orderDetail/orderDetail');
                new ucOrderDetailM({el:fresh.$content,oid:oid});
            },'ucM')
        },
        ucInviteRecord:function(){
            require.ensure([],function(){
                var ucInviteRecord = require('../uc/manage/inviteRecord/inviteRecord');
                new ucInviteRecord({el:fresh.$content});
            },'ucM')
        },
        ucInvestRecord:function(){
            require.ensure([],function(){
                var ucInvestRecord = require('../uc/manage/investRecord/investRecord');
                new ucInvestRecord({el:fresh.$content});
            },'ucM')
        },
        ucCustomerRecord:function(){
            require.ensure([],function(){
                var ucCustomerRecord = require('../uc/manage/customerRecord/customerRecord');
                new ucCustomerRecord({el:fresh.$content});
            },'ucM')
        },
        ucCustomerDetail:function(did){
            require.ensure([],function(){
                var ucCustomerDetail = require('../uc/manage/customerRecord/customerDetail/customerDetail');
                new ucCustomerDetail({el:fresh.$content,did:did});
            },'ucM')
        },
        ucManager:function(){
            require.ensure([],function(){
                var ucManager = require('../uc/manager/home/home');
                new ucManager({el:fresh.$content});
            },'ucM')
        },
        ucMyCustomer:function(){
            require.ensure([],function(){
                var ucMyCustomer = require('../uc/manager/myCustomer/myCustomer');
                new ucMyCustomer({el:fresh.$content});
            },'ucM')
        },
        ucAccumulate:function(){
            require.ensure([],function(){
                var ucAccumulate = require('../uc/manager/accumulateInvest/accumulateInvest');
                new ucAccumulate({el:fresh.$content});
            },'ucM')
        },
        ucRed:function(){
            require.ensure([],function(){
                var ucRed = require('../uc/manager/accumulateRed/accumulateRed');
                new ucRed({el:fresh.$content});
            },'ucM')
        },
        ucDetail:function(cid){
            require.ensure([],function(){
                var ucDetail = require('../uc/manager/customerDetail/customerDetail');
                new ucDetail({el:fresh.$content,cid:cid});
            },'ucM')
        },
        ucOrderDetails:function(oid){
            require.ensure([],function(){
                var ucOrderDetails = require('../uc/manager/orderDetail/orderDetail');
                new ucOrderDetails({el:fresh.$content,oid:oid});
            },'ucM')
        },
        dueList:function(){
            require.ensure([],function(){
                var duelist = require('../uc/manager/dueList/dueList');
                new duelist({el:fresh.$content});
            },'ucM') 
        },
        makeMoneyGuide:function(){
            require.ensure([],function(){
                var makeMoneyGuide = require('../uc/manager/makeMoneyGuide/makeMoneyGuide');
                new makeMoneyGuide({el:fresh.$content});
            },'ucM') 
        },
        coAcquiredRed:function(){
            require.ensure([],function(){
                var temp = require('../common/red-bag/list/acquiredRed/acquiredRed');
                new temp({el:fresh.$content});
            },'ucM')
        },
        coAcquiredCoupon:function(){
            require.ensure([],function(){
                var temp = require('../common/red-bag/list/acquiredCoupon/acquiredCoupon');
                new temp({el:fresh.$content});
            },'ucM')
        },

        ucCalendar:function(year,month){
            require.ensure([],function(){
                var ucCalendar = require('../uc/calendar/calendar');
                new ucCalendar({el:fresh.$content,year:year,month:month});
            },'ucM')
        },
        ucCalendarDate:function(year,month,day,type){
            require.ensure([],function(){
                var ucCalendar = require('../uc/calendar/detail/detail');
                new ucCalendar({el:fresh.$content,year:year,month:month,day:day,type:type});
            },'ucM')
        },

        ucRiskStart:function(did){
            require.ensure([],function(){
                var ucRiskStart = require('../uc/risk/start/start');
                new ucRiskStart({el:fresh.$content,did:did});
            },'ucM')
        },
        ucRiskQuestion:function(did){
            require.ensure([],function(){
                var ucRiskQuestion = require('../uc/risk/question/question');
                new ucRiskQuestion({el:fresh.$content,did:did});
            },'ucM')
        },
        ucRiskResult:function(){
            require.ensure([],function(){
                var ucRiskResult = require('../uc/risk/result/result');
                new ucRiskResult({el:fresh.$content});
            },'ucM')
        },

        ucSetting:function(){
            require.ensure([],function(){
                var ucSetting = require('../uc/setting/setting');
                new ucSetting({el:fresh.$content});
            },'ucM')
        },
        ucSafetyCenter:function(){
            require.ensure([],function(){
                var ucSafetyCenter = require('../uc/setting/safetyCenter/safetyCenter');
                new ucSafetyCenter({el:fresh.$content});
            },'ucM')
        },
        ucChangeLoginPwd:function(){
            require.ensure([],function(){
                var ucChangeLoginPwd = require('../uc/setting/safetyCenter/changeLoginPwd/changeLoginPwd');
                new ucChangeLoginPwd({el:fresh.$content});
            },'ucM')
        },
        ucTradePwdManager:function(){
            require.ensure([],function(){
                var ucTradePwdManager = require('../uc/setting/safetyCenter/tradePwdManager/tradePwdManager');
                new ucTradePwdManager({el:fresh.$content});
            },'ucM')
        },
        ucChangePayPwd:function(){
            require.ensure([],function(){
                var ucChangePayPwd = require('../uc/setting/safetyCenter/tradePwdManager/changePayPwd/changePayPwd');
                new ucChangePayPwd({el:fresh.$content});
            },'ucM')
        },
        ucForgetPayPwd:function(){
            require.ensure([],function(){
                var ucForgetPayPwd = require('../uc/setting/safetyCenter/tradePwdManager/forgetPayPwd/forgetPayPwd');
                new ucForgetPayPwd({el:fresh.$content});
            },'ucM')
        }
    }
}