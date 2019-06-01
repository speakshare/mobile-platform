var template = _.template(require('./check.html'));
require('./check.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.oid=options.oid;
        this.password=[];
        this.getData(this.oid);
    },
    getData:function(id){
        var self= this;
        $.batSync({
            data:[
            {url:fresh.apiRoot + 'member/queryCreditoTransferDetail',data:{orderNo:id,transferVersion:'1'}},
            {url:fresh.apiRoot + 'member/queryPobalance'}
            ],
            success:function(d){
                self.cache={
                    transfer: d[0],
                    accountMoney : d[1]
                };
                self.render();
            },
            error:function(d){
                $.toast(d.msg);
            }
        });
    },
    render:function (){
        this.$el.html(template(this.cache));
        $.setAppNav('确认投资');
        return this;
    },
    _tradePassword:function(){
        var self=this;
        $.tradePassword({
            callback:function(tradePwd){
                if(!tradePwd) return false;
                $.sync({
                    url:fresh.apiRoot + 'member/buyTransferProduct',
                    type: 'post',
                    data: {
                        orderNo:self.oid,
                        tradePwd: tradePwd,
                        payType: parseInt($.getCache('tansfer_payType'))
                    },
                    success: function(d){
                        $.changePage('transfer/success?name='+d.productName+'&amount='+d.transferAmt+'&cycle='+d.investCount+'&profit='+d.profitAmt+'&type='+d.payType+'&time='+d.buyTime);
                    },
                    error:function(e){
                        $.toast(e.msg);
                        if(e.status=='0834'){
                            $('.btn').removeClass('invest-btn').addClass('resettradepsw').text('交易密码已锁定，点此重置');
                        }
                    }
                });
            }
        });
    },
    events:{
        'tap .toproductdetail':'toproductdetail',
        'tap .askicon':'toggle',
        'tap .redio':'accountswitch',
        'tap .invest-btn':'confirmBuy',
        'tap .forgot-password-btn':'forgotpassword',
        'tap .account-stock-wrap':'tradepophide',
        'tap #disAgr':'disAgr',
        'tap #agrCon':'agrCon'
    },
    agrCon:function(){
        $.changePage('staticPage/makeOver');
    },
    disAgr:function(e){
        var self = $(e.target),
            _chen = self.hasClass('no-agr');
        if(_chen){
            self.removeClass('no-agr');
            $('.mar').addClass('invest-btn')
        }else{
            self.addClass('no-agr');
            $('.mar').removeClass('invest-btn')
        }
    },
    confirmBuy:function(){
        var _self=this;
        $.checkUser(function(){
            _self.toBuy();
        });
    },
    toBuy:function(){
        var self=this;
        if($('.account-stock').is(':visible')){
            var realPayAmount=Number($('#realPayAmount').text()); //产品实付金额
            var buyMoney=Number($('.checked').text()); //实际购买金额
            var payType=$('.checked').attr('payType'); //支付方式 6:摇宝 7：账户
            $.setCache('tansfer_payType',payType);
            if(realPayAmount>buyMoney){
                var diffMoney=(realPayAmount-buyMoney).toFixed(2);
                $.popWindow({
                    content:'<p style="margin:0;font-size: 17px;color: rgb(51,51,51);font-weight: 700;padding-bottom: 25px">'+(payType=='6'?'摇宝':'账户')+'余额不足</p><p>您的投资还差<span style="color: #ff6046">'+diffMoney+'</span>元，是否前去充值？</p>',
                    type:2,
                    yes: payType=='6'?'摇宝转入':'立即充值',
                    no:'<span style="color: #ff6046">取消</span>',
                    callback:function(bl){
                        if(bl){
                            if(payType=='6'){
                                $.changPage('yaobao');
                            }else{
                                $.changePage('payment/recharge/'+diffMoney);
                              //location.href = '/weizhan/pages/assets/recharge';
                          }
                      }
                  }
              });
            }else{
                self._tradePassword();
                // $(".password-mask").show();
            }
        }else{
            $('.account-stock-wrap').show();
            setTimeout(function(){
                $('.account-stock').addClass('account-stock-show');
            },10);
        }
    },
    toproductdetail:function(e){
        var self=$(e.currentTarget);
        var _id=parseInt(self.attr('data-id'));
        $.changePage('product/'+_id);
    },
    toggle:function(){
        $('.tips').toggle(200);
    },
    accountswitch:function(e){
        var self = $(e.currentTarget);
        $(".redio").removeClass('checked');
        self.addClass('checked');
        return false;
    },
    forgotpassword:function(){
        $.changePage('uc/setting/forgetPayPwd');
    },
    tradepophide:function(e){
        var oTarget = $.findEleByClass(e.target, 'account-stock');
        if(!oTarget){
            $('.account-stock').removeClass('account-stock-show');
            setTimeout(function(){
             $('.account-stock-wrap').hide();
         },500)
        }
    }
});
