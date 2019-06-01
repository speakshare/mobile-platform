var template = _.template(require('./check.html'));
require('./check.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.pid=options.pid;
        this.redbag={
            id:'',
            amount:0
        };
        this.selectedBagId = $.getParam(location.href,'redBagId');
        this.getData();
    },
    getData:function(){
        var self=this;
        $.checkUser(function(){
            $.batSync({
                data:[
                {url: fresh.apiRoot + 'productInfo',data: {productNo:self.pid}},
                {url: fresh.apiRoot + 'member/selectListRewardByProduct',data: {productNo:self.pid}},
                {url: fresh.apiRoot + 'member/selectTyj'},
                {url: fresh.apiRoot + 'member/queryCustomerAllMoneyInfo'},
                {url: fresh.apiRoot + 'member/selectAgreeStatus'}
                ],
                success:function(d){
                    console.log(d);
                    self.cache={
                        pd:d[0],
                        redbag: (d[1] ? d[1] : {}),
                        tyj:(d[2] ? d[2].tyj : 0),
                        account:(d[3]?d[3]:{}),
                        agree:(d[4]? d[4].agreeStatus : 1)
                    };
                    if(d[1]){localStorage.setItem('yw-redbagservDate',d[1].servDate);}
                    self.render();
                },
                error:function(d){
                    // console.log(d);
                }
            });
        });
    },
    render:function(){
        // 已售罄的产品
        // if(this.cache.pd.isSaleOff){
        //     $.changePage('product');
        //     return false;
        // }
        window.customEvent(3,'1.9.1','');
        this.$el.html(template(this.cache));
        $.setAppNav('购买支付');
        if(this.selectedBagId && this.cache.redbag && this.cache.redbag.list && this.cache.redbag.list.length > 0){
            var temp = this.cache.redbag.list;
            var len = temp.length;
            for(var i = 0; i < len; i++){
                if(temp[i].sendRewardId == this.selectedBagId){
                    this.redbag.id=temp[i].sendRewardId;
                    this.redbag.amount=temp[i].amount;
                    this.redbag.limitAmount=temp[i].limitAmount;
                    this.redbag.ruleType = temp[i].ruleType;
                    if(temp[i].ruleType == 2){
                        this.redbag.amount= temp[i].interestAddVal;
                        this.redbag.limitDay = temp[i].interestAddDays;
                        this.redbag.maxLimit = temp[i].interestAddMaxPrincipal;
                    }
                    break;
                }
            }
            this._changeRegbag();
        }
        // $('.product-buy').css('height',$(window).height());
        return this;
    },
    _evalAmount:function(){
        var self=this,
            v=this.$el.find('#buyMoney').val(),

            min=this.cache.pd.minPurchaseAmount,
            max=this.cache.pd.financingAmount-this.cache.pd.currentAmount,
            step=this.cache.pd.stepAmount;

        // this.$el.find('.payAmount').val(v);


        if(max-min-v<0 && max-v>0){
            $.popWindow({
                content:'产品剩余额度仅剩'+ max +'元，推荐您全额购买或去选购其他产品',
                no:'取消',
                yes:'继续投资',
                type:2,
                callback:function (bl) {
                    if(bl){
                        self.$el.find('#buyMoney').val(max);
                        self.showPayTip();
                        self.evalBuyAmount();
                        return true;
                    }
                }
            });
            return false;
        }


        if(v==''){
            $.toast('请输入购买金额');
            return false;
        }

        if(v<min){
            $.toast('小于最低购买金额：'+min);
            return false;
        }
        if(v>max){
            $.toast('超过产品剩余可购买金额：'+max);
            return false;
        }
        if(this.cache.pd.productType==10 && v>10000){
            $.toast('新手标投资上限1万');
            return false;
        }
        if(this.cache.pd.productType==10 && v< 1000){
            $.toast('新手标起投金额1000');
            return false;
        }
        if((v-min)%step>0){
            $.toast('投资金额为'+min+'元起投，'+ Number(step)+'元递增');
            return false;
        }



        if(this.redbag.ruleType == "1"){
            if(this.redbag.amount>0 && parseInt(v)<parseInt(this.redbag.limitAmount)){
                $.toast('您选择的红包需投资'+this.redbag.limitAmount+'才能使用');
                return false;
            }
        }
        //验证加息劵的条件
        if(this.redbag.ruleType == "2" && this.redbag.amount >0 && parseInt(v)<parseInt(this.redbag.limitAmount)){
            $.toast('您选择的加息劵需投资'+this.redbag.limitAmount+'才能使用');
            return false;
        }
        if(this.redbag.ruleType == "4"){
            if(this.redbag.amount>0 && parseInt(v)<parseInt(this.redbag.limitAmount)){
                $.toast('投资金额不足，无法使用代金券，请修改投资金额');
                return false;
            }
        }

        return true;
    },
    _evalProfit:function(){
        var v=this.$el.find('#buyMoney').val(),
        d=this.cache,
        lv=(parseFloat(d.pd.annualizedRate)+ parseFloat(d.pd.productAddonRate))*d.pd.surplusDay/365;
        sy=0;
        if(d.pd.productType==10){
            sy=Math.floor((parseFloat(d.pd.annualizedRate)+ parseFloat(d.pd.productAddonRate))*5*d.tyj/365)/100;
        }
        if(this.redbag.ruleType == 1){  //返现 
            sy+= Math.floor(v*lv+parseInt(this.redbag.amount,10)*100)/100;
        }else if(this.redbag.ruleType == 2){
            var lvTemp = parseInt(v) > parseInt(this.redbag.maxLimit) ? this.redbag.maxLimit : v;
            var tempDay = parseInt(d.pd.surplusDay) > parseInt(this.redbag.limitDay) ? this.redbag.limitDay :d.pd.surplusDay; 
            var addInterest = lvTemp *this.redbag.amount*tempDay/365;
            sy+= Math.floor(v*lv+parseInt(addInterest))/100;
        }else{
             sy+= Math.floor(v*lv)/100;
        }

        this.$el.find('#profitAmount').html($.amountFormat(sy));
    },
    _goPay:function(e){
        var self=this,
        payType=this.$el.find('.account-stock .checked').attr('data-id'),
        v=this.$el.find('#buyMoney').val();
        var realAccount = this.cache.account.piggy?this.cache.account.piggy:0;
        var fullmount= self.redbag.ruleType==4?self.redbag.amount:0;
        if(payType == '7' && realAccount-(v-fullmount)<0){
            var money=parseFloat(v-fullmount-realAccount).toFixed(2);
            $.popWindow({
                title:'账户余额不足',
                content:'您的投资还差<span class="red">'+money+'</span>元,是否前去充值？',
                yes:'先去充值',
                no:'重新输入',
                type:2,
                tapMask:true,
                callback:function(bl){
                    if(bl){
                        $.changePage('payment/recharge/'+money);
                        // window.location='/weizhan/pages/assets/recharge';
                    }else{
                        //self._paying(payType,v,0);
                        $(".pop_window_wrap").remove();
                    }
                }
            })
        }else{
            this._paying(payType,v,0);
        }
    },
    _paying:function(payType,amount,tenderType){
        var self=this;
        $.tradePassword({
            callback:function(tradePwd){
                if(!tradePwd) return false;
                $.sync({
                    url:fresh.apiRoot+'member/buyProduct',
                    data:{
                        productNo:self.pid,
                        // tenderType:tenderType,
                        payType:payType,
                        investCount:'',
                        // rechargeAmt:(payType==6 || tenderType)?'':amount-this.cache.account.piggy,
                        investUnitAmt:amount,
                        amountCft:self.cache.pd.productType==10?self.cache.tyj:0,
                        sendRewardId:self.redbag.id,
                        tradePwd:tradePwd
                    },
                    type:'post',
                    success:function(d){
                        $.changePage('order/'+d.orderNo+'/success');
                    },
                    error:function(d){
                        window.customEvent(3,'1.9.5',d.msg);
                        $.toast(d.msg);
                    }
                });
            }
        });
    },
    _changeRegbag:function(){
        if(this.redbag.ruleType){
            if(this.redbag.ruleType == 1){
                this.$el.find('#liQua').html('满'+this.redbag.limitAmount+'返'+this.redbag.amount).show();
            }else if(this.redbag.ruleType == 2){
                this.$el.find('#liQua').html('加息'+this.redbag.amount+'%满'+this.redbag.limitDay + "天").show();
            }else if(this.redbag.ruleType == 4){
                this.$el.find('#liQua').html('满'+this.redbag.limitAmount+'减'+this.redbag.amount).show();
            }
            $('.li-num').hide();
            if(this.$el.find('#buyMoney').val()-this.redbag.limitAmount<0){
                // if(this.redbag.ruleType == 2){
                //     this.$el.find('#buyMoney').val(this.redbag.maxLimit);
                // }else{
                //     this.$el.find('#buyMoney').val(this.redbag.limitAmount);
                // }
                this.$el.find('#buyMoney').val(this.redbag.limitAmount);
            }
        }
        this._evalProfit();
    },
    _hidePayTip:function(callback){
        var self=this;
        this.$el.find('.account-stock').removeClass('account-stock-show');
        setTimeout(function(){
            self.isShowChoose=false;
            self.$el.find('.account-layer').hide();
            callback && callback();
        },500)
    },
    events:{
        // 'input #buyMoney':'buyMoney',
        'blur #buyMoney':'evalBuyAmount',
        'tap #proBtn':'showPayTip',
        'tap .account-layer':'hidePayTip',
        'tap #showRedBag':'showRedBag',
        'tap .account-box':'changePayType',
        'tap #disAgr':'disAgr',
        'tap .agr span':'agrCon'
    },
    // buyMoney:function(e){
    //     var self = $(e.target),
    //         _con = self.val();
    //     console.log(_con)
    // },
    disAgr:function(e){
        var self = $(e.target),
            mar = self.hasClass('no-agr');
        if(mar){
            self.removeClass('no-agr');
        }else{
            self.addClass('no-agr');
        }
    },
    agrCon:function(e){
        var self = $(e.target),
            _urlId = self.attr('data-url');
        $.changePage(_urlId);
    },
    changePayType:function(e){
        var self = $(e.currentTarget),
            id = self.attr('data-id'),
            v = this.$el.find('#buyMoney').val(),
            type=this.cache.pd.payType;
            // if((id==7 && type==1) ||(id==6 && type==0) || (id==6 && v-this.cache.account.currentAssets>0)){
            //     return false;
            // }
        self.addClass('checked').siblings().removeClass('checked');
    },
    evalBuyAmount:function(){
        if(this._evalAmount()){
            this._evalProfit();
            var self = this;
            var v=this.$el.find('#buyMoney').val();
            if(this.redbag.ruleType == "2" && parseInt(v) > parseInt(this.redbag.maxLimit)){
                return $.popWindow({
                    content:'投资金额超出最高加息本金，超出部分将不算加息',
                    yes: '继续',
                    no: '取消',
                    type:2,
                    callback:self.showAccount.bind(self)
                });
            }
        }
    },
    showAccount: function(flag){
        if(flag){
            var self=this;
            var obj=$(self.$el).find('.account-layer');
            obj.show();
            setTimeout(function () {
                self.isShowChoose = true;
                var temp = $("#buyMoney").val();
                if(self.redbag.ruleType == 4){ //代金
                    $("#payAmount").text((parseFloat(temp)-parseFloat(self.redbag.amount)).toFixed(2)+'元');
                }else{
                    $("#payAmount").text(parseFloat(temp).toFixed(2)+'元');
                }
                obj.find('.account-stock').addClass('account-stock-show');
            }, 10);
        }
    },
    showPayTip:function(){
        // var self=this, obj=this.$el.find('.account-stock-wrap');
        window.customEvent(2,'1.9.3','');
        if(this.isShowChoose){
            this._goPay();
        }else{
            var mak = $('#disAgr').hasClass('no-agr');
            if(mak){
                $.toast('请阅读并同意协议！');
                return false;
            }

            if(this._evalAmount()){
                this.showAccount(true);
            }
        }
    },
    hidePayTip:function(e){
        var self=this;
        if($(e.target).closest('.account-stock').length==0){
            this._hidePayTip();
        }
    },
    showRedBag:function(){
        var self=this;
        if(this.cache.redbag.list && this.cache.redbag.list.length){
            this.$el.append('<div class="redbag"><ul class="giftList red-bag-box"></ul></div>');
            var RedBag=require('../../../common/red-bag/list/list');
            var temp = {gift : this.cache.redbag.list, selectedBagId:this.selectedBagId,isUseByProduct:true};
            new RedBag({el:this.$el.find('.red-bag-box'),
                cache:temp,
                callback:function(d){
                    if(d){
                        self.redbag.id=d.id;
                        self.selectedBagId=d.id;
                        self.redbag.amount=d.amount;
                        self.redbag.limitAmount=d.limitAmount;
                        self.redbag.ruleType = d.ruleType;
                        if(d.ruleType == 2){
                            self.redbag.limitDay = d.limitDay;
                            self.redbag.maxLimit = d.maxLimit;
                        }
                    }else{
                        self.redbag={
                            id:'',
                            amount:0
                        };
                        self.selectedBagId='';
                        $('#liQua').hide();
                        $('.li-num').show();
                    }
                    self._changeRegbag();
                }
            })
        }
    }
});
