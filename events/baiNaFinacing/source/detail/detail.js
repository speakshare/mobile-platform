var template = _.template(require('./detail.html'));
require('./detail.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.pid=options.pid;
        this.code=options.code;
        this.gid=options.gid;
        this.coupon={
            id:'',
            amount:0
        };
        this.getData();
    },
    getData:function(){
        var self=this;
        $.batSync({
            data:[
                {url: fresh.apiRoot + 'baiNaActiGoodsDetail',data: {promotionCode:this.code,goodsId:this.gid,productNo:this.pid}},
                {url: fresh.apiRoot + 'member/selectListRewardByProduct',data: {productNo:this.pid}},
                {url: fresh.apiRoot + 'member/queryCustomerAllMoneyInfo'}
            ],
            success:function(d){
                self.cache={
                    pd:d[0] && d[0].baiNaActiGoodsDetail||{},
                    coupon: d[1]||{},
                    account:d[2]||{}
                };
                self.render();
            }
        });
    },
    render:function(){
        if(this.cache.pd.procuctStatus!=1 || this.cache.pd.procuctAmount-this.cache.pd.productAmountBuy<this.cache.pd.productPrice){
            $.toast('当前产品不能购买');
            $.changePage('home/'+this.code,true);
            return false;
        }
        this.$el.html(template(this.cache));
        $.setWeixinTitle('领取权益');
        return this;
    },
    _changeRegbag:function(){
        if(this.coupon.ruleType){
            this.$el.find('.d-t-coupon').html(this.coupon.amount+'元代金券');
        }else if(this.cache.coupon.list.length){
            this.$el.find('.d-t-coupon').html(this.cache.coupon.list.length+'张礼券');
        }else{
            this.$el.find('.d-t-coupon').html('暂无礼券');
        }
    },
    _showPayMask:function(){
        var self=this;
        $.checkUser(function(){
            var obj=self.$el.find('.account-layer');
            obj.show();
            setTimeout(function () {
                self.isShowChoose = true;
                obj.find('.account-stock').addClass('account-stock-show');
                self.$el.find('.buy-btn').html('确认支付'+(self.cache.pd.productPrice-self.coupon.amount)+'元');
            }, 10);

        })
    },
    _goPay:function(){
        var payType=this.$el.find('.account-stock .checked').attr('data-id'),
            v=this.cache.pd.productPrice,
            realAccount = this.cache.account.piggy||0,
            regbagAmount= this.coupon.amount||0;
        if(payType == 7 && realAccount+regbagAmount-v<0){
            $.popWindow({
                title:'账户余额不足',
                content:'您的投资还差<span class="red">'+parseFloat(v-regbagAmount-realAccount).toFixed(2)+'</span>元,是否前去充值？',
                yes:'先去充值',
                no:'取消',
                type:2,
                tapMask:true,
                callback:function(bl){
                    if(bl){
                        window.location='/weizhan/#payment/recharge';
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
                        payType:payType,
                        investCount:'',
                        investUnitAmt:amount,
                        amountCft:0,
                        sendRewardId:self.coupon.id,
                        tradePwd:tradePwd,
                        promotionCode:self.code,
                        goodsId:self.gid
                    },
                    type:'post',
                    success:function(d){
                        $.changePage('goods/'+d.orderNo+'/'+ self.code);
                    }
                });
            }
        });
    },
    events:{
        'tap .buy-btn':'buyGoods',
        'tap .account-box':'changePayType',
        'tap .to-goods':'toProduct',
        'tap .coupon-row':'showCoupon',
        'tap .account-layer':'hidePayLayer',

        'tap .rule-btn':'changePage',
        'tap .agree-box':'changeAgree'
    },
    changePage:function(e){
        var obj=$(e.currentTarget);
        window.location=obj.attr('data-link');
        return false;
    },
    changeAgree:function(e){
        var obj=$(e.currentTarget),
            dontAgree='dont-agree';
        if(!obj.hasClass(dontAgree)){
            obj.addClass(dontAgree);
        }else{
            obj.removeClass(dontAgree);
        }
    },
    toProduct:function(){
        $.changePage('product/'+this.pid);
    },
    hidePayLayer:function(e){
        var self=this;
        if(!$(e.target).closest('.account-stock').length){
            var obj=self.$el.find('.account-layer');
            obj.find('.account-stock').removeClass('account-stock-show');
            setTimeout(function () {
                self.isShowChoose = false;
                obj.hide();
                self.$el.find('.buy-btn').html('确认领取');
            }, 500);
        }
    },
    buyGoods:function(){
        var self=this;
        $.checkUser(function(){
            if(self.isShowChoose){
                self._goPay();
            }else{
                if(self.$el.find('.dont-agree').length){
                    $.toast('请同意协议！');
                    return false;
                }
                var v=self.cache.pd.productPrice;
                if(self.coupon.amount>0 && parseInt(v)<parseInt(self.coupon.limitAmount)){
                    $.toast('当前代金券无法使用');
                    return false;
                }
                self._showPayMask();
            }
        })



    },
    changePayType:function(e){
        $(e.currentTarget).addClass('checked').siblings().removeClass('checked');
    },
    showCoupon:function(){
        var self=this;
        if(this.cache.coupon.list && this.cache.coupon.list.length){
            this.$el.append('<div class="coupon-box"></div>');

            var coupon=require('./coupon/coupon');
            new coupon({el:this.$el.find('.coupon-box'),
                cache:this.cache.coupon,
                selectedID:this.couponSelectedID,
                callback:function(d){
                    if(d){
                        self.coupon.id=d.id;
                        self.coupon.amount=d.amount;
                        self.coupon.limitAmount=d.limitAmount;
                        self.coupon.ruleType = d.ruleType;
                    }else{
                        self.coupon={
                            id:'',
                            amount:0
                        };
                    }
                    self.couponSelectedID=self.coupon.id;
                    self._changeRegbag();
                    self.$el.find('.coupon-box').remove();
                }
            })
        }
    }
});