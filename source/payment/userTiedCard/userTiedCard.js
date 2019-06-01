/**
 * Created by chenguodong on 2017/3/7.
 */
var template = _.template(require('./userTiedCard.html'));
window.LAreaData = require('../../../libs/LArea/LAreaData1');
require('../../../libs/LArea/LArea.min');
require('../../../libs/LArea/LArea.css');
require('./userTiedCard.css');

module.exports = Backbone.View.extend({
    initialize:function(){
        var self = this;
            this.bankCode = '';
            this.captCode = '';
            this.ticket = '';
            this.mak = 1;
        $.checkUser(function(){
            var tel = $.getNub();
            $.sync({
                url: fresh.apiRoot +  'member/queryUserFlowStatus',
                type: 'post',
                data: {phoneNum: tel},
                success:function(d){
                    var realNameVerifyFlag = d.realNameVerifyFlag;
                    if(realNameVerifyFlag == '0'){
                        $.popWindow({
                            content:'您还未实名认证，请先实名认证后再绑定银行卡！',
                            yes:'去实名',
                            no:'取消',
                            type:2,
                            callback:function(bl){
                                if(bl){
                                    $.changePage('payment/userAuthentication')
                                }else{
                                    history.back();
                                }
                            }
                        })
                    }else if(realNameVerifyFlag == '1'){
                        window.addEventListener('popstate',function(){
                            var url = location.href.split('#')[1];
                            if(url == 'payment/userTiedCard'){
                                $(".bank-card-limit").hide();
                            }
                        },false);
                        self.render();
                    }else{
                        $.toast('请重新访问！')
                    }
                },error:function(d){
                    $.toast(d.msg)
                }
            });
        })
    },
    render:function(){
        this.$el.html(template());
        $.setAppNav('绑定银行卡');
        var realName = localStorage.getItem('yw_user_realName');
        $('.real-name').html(realName);
        this.LAreaSt();
        return this;
    },
    events:{
        'tap #limitBank':'limitBank',
        'click .card-limit-list':'cardLimitList',
        'tap #getVer':'getVer',
        'input #bankCardNum,#telNum,#verCodeNum':'tiedCardInp',
        'tap #toTiedCard':'toTiedCard'
    },
    LAreaSt:function(){
        var area = new LArea();
        area.init({
            'trigger': '#accountCity', //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
            'valueTo': '#value', //选择完毕后id属性输出到该位置
            'keys': {
                id: 'id',
                name: 'name'
            }, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
            'type': 1, //数据源类型
            'data': LAreaData //数据源
        });
        area.value=[1,13,3];//控制初始位置，注意：该方法并不会影响到input的value
    },
    limitBank:function(){
        var state = {title:'',url:''};
        window.history.pushState(state,'','');
        $(".bank-card-limit").show();
        var paymentCardLimit = require('./../../payment/bankCard/cardLimit/cardLimit');
        new paymentCardLimit({el:this.$el.find('#bankCardLimit')});

    },
    cardLimitList:function(e){
        var self = $(e.currentTarget),
            bankName = self.attr('bank-name');
        this.bankCode = self.attr('bank-code');
        $('#accountBank').html(bankName).addClass('tied-card-type');
        $(".bank-card-limit").hide();
    },
    getVer:function(){
        this.toTiedCard();
    },
    countDownTime:function(){
        var count = 59,
            timeout,
            pos = $('.get-ver');
        timeout = setInterval(function(){
            if(count <= 0){
                pos.html('重新获取');
                pos.removeClass('col2').attr('id','getVer');
                clearInterval(timeout);
            }else{
                pos.addClass('col2').removeAttr('id');
                pos.html('重发('+count+'S)');
            }
            count--;
        },1000);
    },
    tiedCardInp:function(){
        var bankCardNum = $('#bankCardNum').val(),
            telNum = $('#telNum').val().length,
            verCodeNum = $('#verCodeNum').val().length,
            accountCity = $('#accountCity').val().length,
            accountBank = $('#accountBank').text(),
            BankCard = /^(\d{16,19})$/;
        if(BankCard.test(bankCardNum) && accountCity!=0 && telNum==11 && verCodeNum!=0 && accountBank !='请选择'){
            $('.common-btn1').addClass('common-btn2').attr('id','toTiedCard');
        }else{
            $('.common-btn1').removeClass('common-btn2').removeAttr('id');
        }
    },
    toTiedCard:function(){
        var self = this,
            bankCardNum = $('#bankCardNum').val(),
            accountPro = $('#accountCity').val().split(',')[0],
            accountCity = $('#accountCity').val().split(',')[1],
            telNum = $('#telNum').val(),
            verCodeNum = $('#verCodeNum').val(),
            idCard = localStorage.yw_user_idCard,
            phoneNum = /^(13[0-9]|14[57]|15[0-9]|17[0-9]|18[0-9])[0-9]{8}$/;
        if(this.bankCode.length==0){
            $.toast('请选择开户银行');
        }else if(bankCardNum.length==0){
            $.toast('请输入银行卡号');
        }else if(accountPro.length==0){
            $.toast('请选择开户省市');
        }else if(!phoneNum.test(telNum)){
            $.toast('请输入正确的手机号');
        }else if(this.mak==1){
            $.sync({
                url:fresh.apiRoot + 'member/bindingBankCard',
                type:'post',
                data:{
                    bankCode:self.bankCode,
                    cardNo:bankCardNum,
                    province:accountPro,
                    city:accountCity,
                    cardPhoneNum:telNum,
                    identityType:'0',
                    identityNo:idCard,
                    cardType:'1'
                },
                success:function(d){
                    self.ticket = d.ticket;
                    if(self.ticket){
                        self.countDownTime();
                        self.mak++;
                        $('#verCodeNum').removeAttr('readonly')
                    }
                },error:function(d){
                    $.toast(d.msg);
                }
            });
        }else if(this.mak==2){
            var ticket = self.ticket;
            $.sync({
                url:fresh.apiRoot + 'member/tradingPush',
                type:'post',
                data:{
                    ticket:ticket,
                    validCode:verCodeNum
                },
                success:function(){
                    $.toast('<div class="common-suc-icon"><i></i><p>银行卡绑定成功！</p></div>',2000);
                    setTimeout(function(){
                        $.changePage('payment/userSetPayPass')
                    },2000)
                },error:function(d){
                    $.toast(d.msg);
                }
            });
        }
    }
});