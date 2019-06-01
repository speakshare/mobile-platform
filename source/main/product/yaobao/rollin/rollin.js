var template = _.template(require('./rollin.html'));
require('./rollin.css');

module.exports = Backbone.View.extend({

  initialize: function (options) {
    this.pid = options.pid;
    this.getData();
  },

  getData: function () {
    var self = this;
    $.checkUser(1, function (bl) {
      if (bl) {
        $.batSync({
          data: [
            {url: fresh.apiRoot + 'member/selectShakeMong', data: {productNo: self.pid, sort: '-1'}},
            {url: fresh.apiRoot + 'newProductList', data: {currentPage: 0, pageCount: 15, productType: 4, channelCode: $.getCache('channelCode')}},
            {url: fresh.apiRoot + 'member/queryBalance', data: {loginToken: $.getToken()}},
            {url: fresh.apiRoot+'member/shakeRollOut',data:{isTurn:'0'}}
          ],
          success: function (d) {
            self.cache = {
              shakeMong: d[0],
              productInfo: d[1].currentProduct,
              queryBalance: d[2],
              shakeRollOut: d[3]
            };
            self.render();
            if(d[3].isTurn == '0'){
              $('.yaoBao-auto,.yaoBao-auto-word,.dis-agr').show();
              self.offTabBox();
            }else{
              $('.yaoBao-auto,.yaoBao-auto-word,.dis-agr').hide()
            }
            console.log(d[3].isTurn)
          }
        });
      }
    });
  },

  render: function () {
    var self = this;
    this.$el.html(template(this.cache));
    $.setAppNav('转入');

    self.amountTesting();

    return this;
  },
  events: {
    'tap .form-link': 'protocolFn',
    'tap .ux-button': 'confirmBtnTesting',
    'tap .tab-box':'tabBox',
    'tap .agr':'disAgr',
    'tap .auto-agr':'autoAgr'
  },
  disAgr:function(e){
    var self = $(e.target);
    self.toggleClass('no-agr');
  },
  tabBox:function(e){
    var self  = $(e.currentTarget),
        pos = $('.roll'),
        pangHas = self.hasClass('off');
    self.toggleClass('off');
    this.offTabBox();
    if(pangHas){
      pos.animate({'margin-left':'0'},500);
    }else{
      pos.animate({'margin-left':'16px'},500);
    }
  },
  autoAgr:function(){
    $.changePage('#staticPage/automateAgr')
  },
  offTabBox:function(){
    $.sync({
      url:fresh.apiRoot + 'member/shakeRollOut',
      type:'post',
      data:{isTurn:'1'},
      success:function(d){
        console.log(d)
      },error:function(d){
        $.toast(d.msg)
      }
    });
  },
  amountTesting:function(){
    var self =this;
    
    var cacheTemp = self.cache.shakeMong;
    var annualizedRate = cacheTemp.productRate;
    var minBuy = cacheTemp.procuctMinAmount;

    var $buyConfirm = $('#buyConfirm');
    var $buyAmount = $('#buyAmount');
    var $profitAmount = $('#profitAmount');
    
    $buyAmount.on('focus', function () {
      $buyConfirm.off('click');
    }).on('keyup', function () {
      $buyConfirm.off('click');
      var val = Number($(this).val());
      var reg = /^\d{1,10}(\.\d{1,2})?$/;
      if (isNaN(val) || val < minBuy || !reg.test($(this).val())) {
        $profitAmount.text('0.00');
          $buyConfirm.removeClass('ux-button');
      } else {
        $profitAmount.text($.amountFormat(self.toFixed2(self.asProfit(val, annualizedRate / 100, 1))));
          $buyConfirm.addClass('ux-button');
      }
    })
  },
  
  confirmBtnTesting: function () {
    var self=this;
    var minBuy = self.cache.shakeMong.procuctMinAmount;
    var piggy = self.cache.queryBalance.piggy;


    // var $agreeCheckbox = $('#buyAgreeCheckbox');
    var $buyAmount = $('#buyAmount');
    $buyAmount.blur();
    var noAgr = $('.agr').hasClass('no-agr');

    
    if (noAgr) {
      $.toast('请阅读并同意《摇旺会员服务协议》和《资金自动转入及摇宝代扣服务协议》，谢谢！');
      return false;
    }
    var buyMoney = Number($buyAmount.val());
    if (!buyMoney) {
      $.toast('请输入购买金额');

      return false;
    }
    if (isNaN(buyMoney) || !(/^[0-9|.]*$/).test(buyMoney)) {
      $.toast('请输入正确的购买金额');
      return false;
    }
    if (buyMoney < minBuy) {
      $.toast('您输入的购买金额低于产品最低购买金额，最低购买金额: ' + minBuy);
      return false;
    }

    if ((buyMoney*100) % (minBuy*100)) {
      $.toast('请输入' + minBuy + '的整数倍，如:' + minBuy * 2 + ',' + minBuy * 5 + ',' + minBuy * 10);
      return false;
    }
    if (buyMoney > piggy) {
      var money = self.digitalRound(buyMoney - piggy, 2);
      $.popWindow({
        'content': '余额不足<br/>您的投资还差' + money + '元，是否前去充值?',
        'type': 2,
        'yes': '立即充值',
        'no': '暂不充值',
        callback: function (dl) {
          if (dl) {
            $.changePage('payment/recharge/'+money);
          }
        }
      });
      return false;
    }
    
    self.goRollin();
    
  },
  goRollin:function(){
    var self =this;
    var productNo= self.pid;
    var unitAmt= $('#buyAmount').val();
    var date = self.cache.shakeMong.investDay;
    $.tradePassword({
      callback: function (tradePwd) {
        if (!tradePwd) return false;
        $.sync({
          url: fresh.apiRoot + 'member/pigAmountToBaseAmount',
          type: 'post',
          data: {
            loginToken: $.getToken(),
            tradePwd: tradePwd,
            productNo: productNo,
            investUnitAmt: unitAmt
          },
          success: function (d) {
            $.changePage('yaobao/' + productNo + '/rollin/success/'+unitAmt+'/'+ date);
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
                    self.goRollin();
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
                    $.changePage('yaobao/'+ productNo);
                  }
                }
              });
            } else {
              $.toast(e.msg);
            }
          }
        });
      }
    });
  },

  asProfit: function (money, rate, days) {
    return (money * rate / 365 * days).toFixed(4);
  },
  toFixed2: function (money) {
    money += '';
    var returnVal = money.replace(/([0-9]+\.[0-9]{2})[0-9]*/, '$1');
    if (returnVal == '0' || returnVal == 0) {
      return '0.00';
    }
    return returnVal;
  },
  digitalRound: function (v, e) {
    var t = 1;
    for (; e > 0; t *= 10, e--);
    for (; e < 0; t /= 10, e++);
    return Math.round(v * t) / t;
  },
 
  protocolFn: function (e) {
    var obj = $(e.currentTarget), id = obj.attr('data-protocol');
    switch (id) {
      case '1':
        $.changePage('staticPage/orientationYao');
        break;
      case '2':
        $.changePage('staticPage/riskHint');
        break;
      case '3':
        $.changePage('staticPage/accreditedInvestor');
        break;
    }
  }
});