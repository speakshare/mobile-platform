var template=_.template(require('./withdrawals.html'));
require('./withdrawals.css');
module.exports=Backbone.View.extend({
	initialize: function (options) {
		this.type = options.type;
		this.getData();
	},
	getData:function(){
        var self=this;
        $.checkUser(function(){
            $.batSync({
                data:[
                {url:fresh.apiRoot + 'member/queryTradingInfos'},
                {url:fresh.apiRoot + 'member/queryCustomerAllMoneyInfo'},
                {url:fresh.apiRoot + 'member/queryBankCardList'}
                ],
                success:function(d){
                    self.cache={
                        TradingInfos : d[0]?d[0]:[],
                        piggy : d[1]?d[1].piggy:-1,
                        bankCard:d[2]?d[2].List[0]:[]
                    };
                    self.render(); 
                },error:function(d){
                    self.cache={
                        TradingInfos : [],
                        piggy :-1,
                        bankCard:[]
                    };
                    self.render(); 
                }
            });
        });
    },
    render:function(){
        this.$el.html(template(this.cache));
        $.setAppNav('提现');
        return this;
    },
    events:{
        'input #userWithdrawAmount':'amountcheck',
        'tap .canbtn':'tradePassword'
    },
    amountcheck:function(){
        var self=this;
        if(self.cache.TradingInfos.isTradingTime=='0'){
            var xReg = /^\d{1,10}(\.\d{1,2})?$/;   //验证输入金额格式
            var submitDom=$('.submit'),errorDom=$('.error'), errormsg='',checkflag=true;
            var userWithdrawAmount=Number($('#userWithdrawAmount').val());//提现金额
            var accountAmount=Number(self.cache.piggy);//账户金额
            var minWithdrawAmount=Number(self.cache.TradingInfos.withdrawMinMoney),maxWithdrawAmount=Number(self.cache.TradingInfos.withdrawMaxMoney)*10000;
            if(userWithdrawAmount<minWithdrawAmount){
                checkflag=false;
                errormsg='单笔提现不能少于'+ minWithdrawAmount + '元';
            }else if(userWithdrawAmount>accountAmount){
                checkflag=false;
                errormsg='金额已超出可提现余额';
            }else if(userWithdrawAmount>maxWithdrawAmount){
                checkflag=false;
                errormsg='单笔提现不能超过'+ maxWithdrawAmount + '元';
            }else if(!xReg.test($('#userWithdrawAmount').val())){
                checkflag=false;
            }else{
                errormsg='';
            }
        errorDom.text(errormsg);
        if(!checkflag){
            submitDom.removeClass('canbtn').addClass('disablebtn');
        }else{
            submitDom.removeClass('disablebtn').addClass('canbtn'); 
        }
    }
},
tradePassword:function(){
    var self=this;
     $('.input-text').blur(); 
    var money=Number($('#userWithdrawAmount').val());
    $.tradeSmsPassword({
        callback:function(tradePwd){
            if(!tradePwd) return false;
            $.sync({
                url:fresh.apiRoot + 'member/withdrawals',
                type: 'post',
                data: {
                    withdrawalsAmt:money,
                    tradePwd: tradePwd,
                    withdrawalsType: 5
                },
                success: function(d){
                    $.changePage('payment/withdrawals/success?money='+money);
                },
                error:function(e){
                    if(e.status=='2709'){
                        $.popWindow({
                            content:e.msg,
                            type:2,
                            no:'找回密码',
                            yes:'重新输入',
                            callback:function(bl){
                                if(bl){
                                 self.tradePassword();
                             }else{
                                 $.changePage('uc/setting/forgetPayPwd');
                          }
                      }
                  });
                    }else  if(e.status=='0834'){
                        $.popWindow({
                            content:e.msg,
                            type:2,
                            no:'明日再试',
                            yes:'找回密码',
                            callback:function(bl){
                                if(bl){
                                    $.changePage('uc/setting/forgetPayPwd');
                             }else{
                                $.changePage('uc/home');
                            }
                        }
                    });
                    }else{
                        $.toast(e.msg);
                    }
                }
            }); 
        }
    });
}
})