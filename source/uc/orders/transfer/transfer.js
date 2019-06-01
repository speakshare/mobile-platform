var template = _.template(require('./transfer.html'));
require('../../../../libs/RangeSlider');
require('./transfer.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.oid = options.oid;
        this.getData();
    },
    getData:function(oid){
        var self=this;
        $.checkUser(function(){
            $.sync({
                url:fresh.apiRoot+'order/orderTransferConfirm',
                data:{orderNo:self.oid,transferVersion:'1'},
                type:'post',
                success:function(d){
                    self.oDetail = d;
                    self.minN = parseFloat(d.lowerLimitTransMoney);   //变现金额下限
                    self.maxN = parseFloat(d.upperLimitTransMoney);   //变现金额上限
                    self.rdined = parseFloat(d.transferFeeRate);   //手续费率
                    self.minM = parseFloat(d.lowerTransferFee);   //手续费下限
                    self.maxM = parseFloat(d.upperTransferFee);   //手续费上限
                    self.allM = parseFloat(d.originalTotalMoney);   //原始订单预期总金额(本金+预期总收益)
                    self.remainD = parseFloat(d.jieSuanDays);   //剩余期限/结算日
                    self.oDetail.oid = self.oid;
                    self.render();
                }
            });
        });
    },
    render:function(){
        var self = this;
        this.$el.html(template({oDetail:this.oDetail}));
        $.setAppNav('定期转让');
        if(self.oDetail.level>1){
            var memberType = ['普通','白银','黄金','铂金','钻石'];
            this.toTransferFee();
            $('.hui-yuan').html(memberType[self.oDetail.level-1]+'会员专享');
        }else{
            $('.hui-yuan').remove();
        }
        this.rangeNum(self.oDetail.transferAmt);
        this.loseBlur();
        return this;
    },
    events:{
        'tap .rule-rig':'ruleRig',
        'tap .confirm-btn':'confirmBtn',
        'tap .feed-num':'feedNum',
        'tap .transfer-pop-close,.btn,.fact-hint':'transferHint',
        'touchstart .money-range':'moneyRange',
        'input .inp-mon':'inpMon'
    },
    ruleRig:function(){
        $.changePage('staticPage/realizationRule');
    },
    inpMon:function(e){
        var self = $(e.currentTarget).val();
        if(self < this.minN || self == ''){
            $('.tip-mon').html('金额不能小于'+$.fmoneys(this.minN)+'元');
            self = this.minN
        }else if(self > this.maxN){
            $('.tip-mon').html('金额不能超过'+$.fmoneys(this.maxN)+'元');
            self = this.maxN
        }
        if(self >= this.minN && self <= this.maxN){
            this.changeNum(self)
        }
        $('.inp-range').val(parseFloat(self));
        this.rangeNum(parseFloat(self));
    },
    loseBlur:function(){
        var self = this;
        $('.inp-mon').on('blur',function(){
            var val = $('.inp-mon').val();
            if(val < self.minN || val == ''){
                $('.txt-num').html($.fmoneys(self.minN));
                $.toast('最低变现额度为'+self.minN+'元');
            }else if(val > self.maxN){
                $('.txt-num').html(self.maxN);
                $.toast('最大变现额度为'+self.maxN+'元');
            }else{
                $('.txt-num').html($.fmoneys(val))
            }
            self.moneyRange()
        });
    },
    rangeNum:function(val){
        var self = this;
        var change = function($input) {
                self.changeNum($input.value);
                $('.txt-num').html($.fmoneys($input.value));
            };
        $('.txt-num').html(val);
        $('.inp-range').attr('value',val).RangeSlider({min:self.minN,max:self.maxN,step:0.01,value:val,callback:change});
    },
    changeNum:function(val){
        if(val*this.rdined < this.minM){
            $('.poundage').html($.toDecimal(this.minM));
            $('.come-money').html($.toDecimal(val - this.minM));
        }else if(val*this.rdined > this.maxM){
            $('.poundage').html($.toDecimal(this.maxM));
            $('.come-money').html($.toDecimal(val - this.maxM));
        }else{
            $('.poundage').html($.toDecimal(val*this.rdined));
            $('.come-money').html($.toDecimal(val - $.toDecimal(val*this.rdined)));
            this.toTransferFee(val);
        }
        $('.tendency').html($.fmoneys((parseFloat(this.allM) - parseFloat(val))*365*100/(parseFloat(val)*parseInt(this.remainD))));
    },
    toTransferFee:function(val){
        var mon = this.oDetail.transferAmt*this.oDetail.oriTransferFeeRate;
        if(this.oDetail.transferFee == '300.00'){
            $('.old-transferFee').html('300元');
        }else if(mon <= this.oDetail.ptLowerTransferFee){
            $('.old-transferFee').html(this.oDetail.ptLowerTransferFee+'元');
        }else if(val){
            $('.old-transferFee').html($.toDecimal(val*this.oDetail.oriTransferFeeRate)+'元');
        }else{
            $('.old-transferFee').html($.toDecimal(mon)+'元');
        }
    },
    moneyRange:function(){
        $('.inp-money').hide();
        $('.txt-money').show();
    },
    feedNum:function(){
        $('.inp-mon').val($('.txt-num').text());
        $('.txt-money').hide();
        $('.inp-money').show();
    },
    transferHint:function(){
        $('.transfer-hint').toggle()
    },
    confirmBtn: function(){
        $.tradePassword({
            callback: this.verifyTradePwd.bind(this)
        });
    },
    verifyTradePwd : function(tradePwd){
        var that = this,
            money = $('.txt-num').text();
        if(tradePwd && tradePwd != ''){
            $.sync({
                url:fresh.apiRoot+'member/addCreditoTransfer',
                data:{orderNo:that.oid,transferVersion:'1',transferMoney:money,tradePwd:tradePwd},
                type:'post',
                success:function(d){
                    $.changePage("/uc/complete/" + that.oid)
                },
                error: function(d){
                    $.toast(d.msg);
                }
            });
        }
    }
});

