var template = _.template(require('./orders-detail.html'));
require('./orders-detail.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type = options.type;
        this.oid = options.oid;
        this.ptype=$.getParam('pType')||'';
        this.getData()
    },
    getData:function(oid){
        var self=this;
        $.checkUser(function(){
            $.sync({
                url:fresh.apiRoot+'order/orderDetail',
                data:{orderNo:self.oid,productType: self.ptype},
                type:'post',
                success:function(d){
                    self.oDetail=d;
                    self.oDetail.oid=self.oid;
                    self.oDetail.investAmtSum = parseFloat(self.oDetail.investAmtSum);
                    self.oDetail.profitAmt = parseFloat(self.oDetail.profitAmt);
                    self.oDetail.buyMoneyCftInterest = parseFloat(self.oDetail.buyMoneyCftInterest);
                    self.oDetail.rewardAmount = parseFloat(self.oDetail.rewardAmount);
                    self.oDetail.interestAddCouponProfit = self.oDetail.interestAddCouponProfit ? parseFloat(self.oDetail.interestAddCouponProfit) : 0;
                    self.render();
                }
            });


        });
    },
    render:function(){
        this.$el.html(template({oDetail:this.oDetail}));
        $.setAppNav('订单详情');
        return this;
    },
    events:{
        'tap .helpicon':'displayInfo',
        'tap .productname': 'gotoProductInfo',
        "tap .protocol": 'gotoConstruction',
        "tap .transfer": 'goToTransfer',
        "tap .cancleTransfer": 'cancleTransfer'
    },
    gotoProductInfo:function(){
        $.changePage('product/'+ this.oDetail.productNo);
    },

    //转让确认页面
    goToTransfer: function(){
        $.changePage("uc/transfer/" + this.oid);
    },

    cancleTransfer: function(){
        var that = this;
        var loginToken = localStorage.getItem("yw_user_loginToken");
        $.popWindow({
            content:'您是否确认要取消该变现操作？',
            type:'2',
            yes:'确认',
            no:'取消',
            callback:function(bl){
                if(bl){
                    $.sync({
                        url:fresh.apiRoot+'member/cancelTransferProduct',
                        data:{orderNo:that.oid, loginToken:loginToken},
                        type:'post',
                        success:function(d){
                            location.reload();
                        },
                        error: function(d){
                             $.toast(d.msg);
                        }
                    });
                }else{
                }
            }
        });
    },
    gotoConstruction: function(){
        var orderNo = this.oid;
        window.location.href='/weizhan/#uc/orders/compact?orderNo=' + orderNo;
    }, 

    displayInfo: function(){
        $(".helpinfo").css("display", "block");
        setTimeout(function(){
            $(".helpinfo").css("display", "none");
        }, 2000);
    }
});