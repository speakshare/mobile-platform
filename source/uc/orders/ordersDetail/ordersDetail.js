var template = _.template(require('./ordersDetail.html'));
require('./ordersDetail.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type = options.type;
        this.oid = options.oid;
        this.ptype=$.getParam('pType')||'';
        this.getData()
        // $.sync({url:'https://app.91yaowang.com/app/webservice/v2/activity/queryPrdDetailAdImg',type:'post'})
    },
    getData:function(oid){
        var self=this;
        $.checkUser(function(){
            $.sync({
                url:fresh.apiRoot+'order/orderDetail',
                data:{orderNo:self.oid,productType: self.ptype},
                type:'post',
                success:function(d){
                    console.log(d)
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
        var self = this;
        $.popWindow({
            content:'提交变现期间，该产品继续计息，变现成功后，一次性结息',
            type:'2',
            yes:'确定',
            no:'取消',
            callback:function(bl){
                if(bl){
                    $.changePage("uc/transfer/" + self.oid);
                }
            }
        });
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
                    // history.go(-1);
                }
            }
        });

        // $.sync({
        //     url:fresh.apiRoot+'member/cancelTransferProduct',
        //     data:{orderNo:that.oid, loginToken:loginToken, tradePwd:tradePwd},
        //     type:'post',
        //     success:function(d){
        //         location.reload();
        //     },
        //     error: function(d){
        //          $.toast(d.msg);
        //     }
        // });
    },
    gotoConstruction: function(){
        var orderNo = this.oid;
        $.changePage('uc/orders/compact?orderNo=' + orderNo);
        // var that = this;
        // var data = {
        //     loginToken:$.getToken(),
        //     orderNo:that.oid,
        //     url:"orderDetail",
        //     type:"0",
        //     productType:"2"
        // };
        //  window.location.href = window.location.origin + "/weizhan/hetong/creditoInformation?" + (data != null ? $.param(data) : "");
    }, 

    displayInfo: function(){
        $(".helpinfo").css("display", "block");
        setTimeout(function(){
            $(".helpinfo").css("display", "none");
        }, 2000);
    }
});