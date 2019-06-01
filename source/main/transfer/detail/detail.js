var template = _.template(require('./detail.html'));
require('./detail.css');
// var drawCurve=require('./drawCurve.js');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.oid=options.oid;
        this.getData(this.oid);
    },
    getData:function(id){
        var self= this;
        $.sync({
            url:fresh.apiRoot + 'member/queryCreditoTransferDetail',
            type: 'post',
            data: {orderNo:id,transferVersion:'1'},
            success: function(d){
                self.cache=d;
                self.render();
            },
            error:function(e){
                $.toast(e.msg);
            }
        });     
    },
    render:function (){
        this.$el.html(template({transfer:this.cache}));
        $.setAppNav('变现详情');
        $('.transfer-detail').css('height',$(window).height());
        return this;
    },
    events:{
        'tap #productDetail':'productDetail',
        'tap #buyBtn':'buyBtn',
        'tap .transfer-pop-close,.btn,#transferHint':'transferHint'

    },
    transferHint:function(){
        $('.transfer-hint').toggle()
    },
    productDetail:function(e){
        var self=$(e.currentTarget);
        var _id=parseInt(self.attr('data-id'));
        $.changePage('product/'+_id);
    },
    buyBtn:function(e){
        var self = this,
            tel = $.getNub();
        $.checkUser(function(){
            $.sync({
                url: fresh.apiRoot +  'member/queryUserFlowStatus',
                type: 'post',
                data: {phoneNum: tel},
                success:function(d){
                    if(d.realNameVerifyFlag == '0'){
                        self._popWindow('您还未实名认证，请先去实名认证','立即认证','payment/userAuthentication')
                    }else if(d.bindCardFlag == '0'){
                        self._popWindow('您还未绑定银行卡，请先去绑定银行卡','立即绑定','payment/userTiedCard')
                    }else if(d.setTradePwdFlag == '0'){
                        self._popWindow('您还未设置交易密码，请先去设置','立即设置','payment/userSetPayPass')
                    }else{
                        $.changePage('transfer/buy/'+self.cache.orderNo+'/checkout');
                    }
                },error:function(d){
                    $.toast(d.msg)
                }
            });
        });
        // if ($.getToken()) {
        // if(self.cache.isBuy=='1'){
        //     $.toast("您不能购买自己的变现产品",2000);
        //     return;
        // }
        //     $.sync({
        //         url: fresh.apiRoot + 'member/selectFinishedStep',
        //         type: 'post',
        //         data: {phoneNum:$.getNub()},
        //         success: function(d){
        //             localStorage.setItem('yw_user_finishedStep',d.currentStep);
        //             if (d.currentStep=="4") {
        //                 $.changePage('transfer/buy/'+self.cache.orderNo+'/checkout');
        //                 return;
        //             }
        //             var _obj={"0":['您还未实名认证，请先去实名认证','pages/member/identityAuthen','立即认证'],
        //             "1":['您还未实名认证，请先去实名认证','pages/member/identityAuthen','立即认证'],
        //             "2":['您还未实名认证，请先去实名认证','pages/member/identityAuthen','立即认证'],
        //             "3":['您还未绑定银行卡，请先去绑定银行卡','pages/member/bindCard','立即绑定']
        //         };
        //         _obj=_obj[d.currentStep];
        //         self._popWindow(_obj[0],_obj[2],function(){
        //             location.href = '/weizhan/'+_obj[1];
        //         });
        //     }
        // });
        // }else{
        //     self._popWindow('您还未登录，请先去登录','立即登录',function(){
        //         $.login();
        //     });
        // }
    },
    _popWindow:function(content,yes,url){
        $.popWindow({
            content:content,
            type:2,
            yes:yes,
            no:'取消',
            callback:function(bl){
                if(bl){
                    $.changePage(url)
                }
            }
        });
    }
});

