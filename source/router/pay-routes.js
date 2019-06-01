module.exports = {
    routes: {
        'payment/card/cardManage/*':        'paymentBankCard',
        'payment/card/cardLimit/*':         'paymentCardLimit',
        'payment/withdrawals/notice/*':     'paymentWithdrawalsNotice',
        'payment/withdrawals/*':            'paymentWithdrawals',
        'payment/withdrawals/success/*':    'paymentWithdrawalsSuccess',
        'payment/recharge/*':               'paymentRecharge',
        'payment/recharge/:money':          'paymentRecharge',
        'payment/rechargeResult/*':         'paymentRechargeResult',
        'payment/userAuthentication/*':     'paymentAuthentication',
        'payment/userTiedCard/*':           'paymentTiedCard',
        'payment/userSetPayPass/*':         'paymentSetPayPass'
    },
    methods: {
        paymentBankCard: function () {
            require.ensure([],function(){
                var cardList = require('../payment/bankCard/cardManage/cardManage');
                new cardList({el: fresh.$content});
            },'pay')
        },
        paymentCardLimit: function () {
            require.ensure([],function(){
                var paymentCardLimit = require('../payment/bankCard/cardLimit/cardLimit');
                new paymentCardLimit({el: fresh.$content});
            },'pay')
        },
        paymentWithdrawalsNotice: function () {
            require.ensure([],function(){
                var WithdrawalsNotice = require('../payment/withdrawals/notice/notice');
                new WithdrawalsNotice({el: fresh.$content});
            },'pay')
        },
        paymentWithdrawals: function () {
            require.ensure([],function(){
                var Withdrawals = require('../payment/withdrawals/withdrawals');
                new Withdrawals({el: fresh.$content});
            },'pay')
        },
        paymentWithdrawalsSuccess: function () {
            require.ensure([],function(){
                var WithdrawalsSuccess = require('../payment/withdrawals/success/success');
                new WithdrawalsSuccess({el: fresh.$content});
            },'pay')
        },
        paymentRecharge: function (money) {
            require.ensure([],function(){
                var paymentRecharge = require('../payment/recharge/recharge');
                new paymentRecharge({el: fresh.$content,money:money})
            },'pay')
        },
        paymentRechargeResult: function () {
            require.ensure([],function(){
                var paymentRechargeResult = require('../payment/recharge/rechargeResult/rechargeResult');
                new paymentRechargeResult({el: fresh.$content})
            },'pay')
        },
        paymentAuthentication: function () {
            require.ensure([],function(){
                var paymentAuthentication = require('../payment/userAuthentication/userAuthentication');
                new paymentAuthentication({el: fresh.$content});
            },'pay')
        },
        paymentTiedCard: function () {
            require.ensure([],function(){
                var paymentTiedCard = require('../payment/userTiedCard/userTiedCard');
                new paymentTiedCard({el: fresh.$content});
            },'pay')
        },
        paymentSetPayPass: function () {
            require.ensure([],function(){
                var paymentSetPayPass = require('../payment/userSetPayPass/userSetPayPass');
                new paymentSetPayPass({el: fresh.$content});
            },'pay')
        }
    }
}