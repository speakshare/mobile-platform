var template = _.template(require('./rollout.html'));
require('./rollout.css');
var MoneyReg = /^\d{1,10}(\.\d{1,2})?$/;
module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.pid = options.pid;
        this.getData()
    },
    getData: function () {
        var self = this;
        $.checkUser(1, function (bl) {
            if (bl) {
                $.sync({
                    url: fresh.apiRoot + 'member/selectShakeMong',
                    type: 'post',
                    data:{
                        productNo:self.pid
                    },
                    success: function (d) {
                        self.cache = d;
                        self.render();
                    }, error: function (d) {
                        $.toast(d.msg)
                    }
                });
            }

        });
    },
    events: {
        'tap #inputAllAmount': 'inputAll',
        'input #yaobaoOutAmount': 'moneyChange',
        'tap #yaobaoOutConfirm': 'confirmOut'
    },
    moneyChange: function () {
        var yaobaoOutConfirmBtn = $('#yaobaoOutConfirm');
        var shop_money1 = Number($('#yaobaoOutAmount').val());
        if (isNaN(shop_money1) || shop_money1 < 0.01 || shop_money1 > this.cache.sumAmount || !MoneyReg.test(shop_money1)) {
            yaobaoOutConfirmBtn.addClass('disabled-btn').off('click');
        } else {
            yaobaoOutConfirmBtn.removeClass('disabled-btn')
        }
    },
    inputAll: function () {
        $('#yaobaoOutAmount').val(this.cache.sumAmount);
        this.moneyChange()
        // $('#yaobaoOutConfirm').removeClass('disabled-btn')
    },
    confirmOut: function () {
        if($('#yaobaoOutConfirm').hasClass('disabled-btn')){
            return ;
        }

        $('#yaobaoOutAmount').blur();
        var outMoney = Number($('#yaobaoOutAmount').val());
        if (outMoney < 0.01) {
            $.toast('<p>单次转出最小金额：<span style="color: rgb(255,68,0)">0.01元</span></p>', null, null, '温馨提示');
            return false;
        }

        if (outMoney > this.cache.sumAmount) {
            $.toast('<p>可转出金额不足，当前可转出：<span style="color: rgb(255,68,0)">' + this.cache.sumAmount + '元</span></p>', null, null, '温馨提示');
            return false;
        }

        this.money = this.toFixed2(outMoney);
        this.getRollOut();


    },
    getRollOut: function () {
        var self = this;
        $.tradePassword({
            callback: function (tradePwd) {

                if (!tradePwd) return false;
                $.sync({
                    url: fresh.apiRoot + 'member/baseAmountToPigAmount',
                    type: 'post',
                    data: {
                        loginToken: $.getToken(),
                        tradePwd: tradePwd,
                        productNo: self.pid,
                        investUnitAmt: self.money
                    },
                    success: function (d) {
                        $.changePage('yaobao/' + self.pid + '/rollout/success/' + self.money);
                    },
                    error: function (e) {
                        if (e.status == '2709') {
                            $.popWindow({
                                content: e.msg,
                                type: 2,
                                no: '找回密码',
                                yes: '重新输入',
                                callback: function (bl) {
                                    if (bl) {
                                        self.getRollOut();
                                    } else {
                                        $.changePage('uc/setting/forgetPayPwd');
                                    }
                                }
                            });
                        } else if (e.status == '0834') {
                            $.popWindow({
                                content: e.msg,
                                type: 2,
                                no: '明日再试',
                                yes: '找回密码',
                                callback: function (bl) {
                                    if (bl) {
                                        $.changePage('uc/setting/forgetPayPwd');
                                    } else {
                                        $.changePage('yaobao/' + productNo);
                                    }
                                }
                            });
                        } else {
                            $.toast(e.msg);
                        }
                    }
                });
            }
        })

    },
    toFixed2: function (money) {
        money += '';
        var returnVal = money.replace(/([0-9]+\.[0-9]{2})[0-9]*/, '$1');
        if (returnVal == '0' || returnVal == 0) {
            return '0.00';
        }
        return returnVal;
    },
    render: function () {
        $.setAppNav('转出');
        this.$el.html(template(this.cache));
        return this;
    }
})