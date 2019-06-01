var template = _.template(require('./recharge.html'));
require('./recharge.css');

module.exports = Backbone.View.extend({
    initialize: function(obj) {
        this.money=obj.money;
        this.getData();
        this.pass = [];
    },   
    getData:function (){
        var self=this;
        $(window).on('popstate',function(e){
            location.reload();
            $(window).off('popstate');
        });
        $.checkUser(function(){
            $.batSync({
                data:[
                    {url:fresh.apiRoot+'member/queryBankCardList'},
                    {url:fresh.apiRoot+'member/shakeRollOut',data:{isTurn:'0'}}
                ],
                success:function(d){
                    self.cache = {
                        list:d[0].List[0],
                        shakeRollOut:d[1],
                        money:self.money
                    };
                    $.setCache('bindId',d[0].List[0].bindId);
                    self.singleQuota = d[0].List[0].singleQuota;
                    self.render();
                    self.rechargeInp();
                    console.log(d[1].isTurn);
                    if(d[1].isTurn == '0'){
                        $('.yaoBao-auto,.yaoBao-auto-word,.yaoBao-auto-agr').show();
                        self.offTabBox();
                    }else{
                        $('.yaoBao-auto,.yaoBao-auto-word,.yaoBao-auto-agr').hide()
                    }
                }
            });
        });
    },
    render:function(){
        this.$el.html(template(this.cache));
        $.setAppNav('充值');
        return this;
    },
    events:{
        'input #rechargeInp':'rechargeInp',
        'tap .go-recharge':'goRecharge',
        'tap #ticketVer':'ticketVer',
        'tap #verifyBot':'verifyBot',
        'tap #close,.keyboard-bg':'close',
        'tap #forgetPass':'forgetPass',
        'tap .keyboard-tab td':'getNum',
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
    rechargeInp:function(){
        var mon = $('#rechargeInp').val();
        if(mon.length != 0){
            $('.common-btn3').css('background-color','#ff5532');
        }else{
            $('.common-btn3').css('background-color','#d8d8d8');
        }
    },
    goRecharge:function(){
        var rechargeInp = $('#rechargeInp').val(),
            noAgr = $('.agr').hasClass('no-agr'),
            MoneyReg = /^\d{1,10}(\.\d{1,2})?$/;   //验证输入金额格式
        if(noAgr){
            $.toast('请先阅读并同意《资金自动转入及摇宝代扣服务协议》！',2000)
        }else if(rechargeInp.length == 0){
            $.toast('请输入充值金额！',1500)
        }else if(!MoneyReg.test(rechargeInp)){
            $.toast('您输入的金额格式不正确',2000);
        }else if(rechargeInp<1){
            $.toast('充值金额不能少于1元')
        }else if(rechargeInp > this.singleQuota){
            $.toast('单笔限额'+this.singleQuota,1500)
        }else{
            $('input').blur();
            $('.keyboard-bg,.keyboard').show();
            $('.keyboard').animate({bottom:'0'},500);
            var wid = $('#passWord').width()/6;
            $('.password-box span').css('width',wid);
        }
    },
    close:function(){
        this.pass = [];
        $('#passWord span').html('');
        $('.keyboard').animate({bottom:'-100%'},500,function(){
            $('.keyboard-bg,.keyboard').hide();
        });
    },
    forgetPass:function(){
        $.checkUser(function(){
            $.changePage('uc/setting/forgetPayPwd');
        });
    },
    getNum:function(e){
        if(this.pass.length >= 6){
            this.pass = []
        }
        var selfNum = $(e.target).text(),
            math = /[0-9]/i;
        var pattern = math.test(selfNum);
        if(pattern){
            this.upPayPwd(selfNum);
        }else if(selfNum == 'x'){
            this.pass = [];
            $('#passWord span').html('');
        }
    },
    upPayPwd:function(num){
        var password = this.pass;
        password.push(num);
        for(var i=0;i<password.length;i++){
            $('#passWord span').eq(i).html('●');
        }
        if(password.length == 6){
            var passwords = password.join('');
            this.close();
            this.toRecharges(passwords);
        }
    },
    verifyBot:function(){
        this.toRecharges(this.pass);
    },
    toRecharges:function(pass){
        var self = this;
        var mon = $('#rechargeInp').val();
        var bindId = $.getCache('bindId');
        $.sync({
            url:fresh.apiRoot + 'member/recharge',
            type:'post',
            data:{
                rechargeAmt:mon,
                bindId:bindId,
                rechargeType:'4',
                tradePwd:pass||password
            },
            success:function(d){
                var ticket = d.ticket;
                var phoneNum = d.phoneNum;
                $.setCache('ticket',ticket);
                if(ticket){
                    self.pass = pass;
                    $('.keyboard').animate({bottom:'-100%'},500,function(){
                        $('.keyboard-bg,.keyboard').hide();
                        $('.recharge-verify,.hint-verify').show(500);
                        $('.common-btn3').removeClass('go-recharge').attr('id','ticketVer');

                        var opt = $('.verify-bot');
                        var count=60,timeout;
                        $('#telNum').html(phoneNum);
                        opt.removeAttr('id').css('background-color','#dad7d6');
                        timeout=setInterval(function(){
                            count--;
                            if(count<=0){
                                this.sendSMSing=false;
                                opt.html('重新获取');
                                opt.attr('id','verifyBot').css('background-color','#ff6046');
                                clearInterval(timeout);
                            }else{
                                opt.html('重发'+ count +'S');
                            }
                        },1000);
                    });
                }else{
                    $.setCache('yw_user_rechargeMoney',mon);
                    $.changePage('payment/rechargeResult');
                }
            },error:function(d){
                this.pass = [];
                $('#passWord span').html('');
                $.toast(d.msg,2500);
            }
        });
    },
    ticketVer:function(){
        var mon = $('#rechargeInp').val(),
            verify = $('#verifyCon').val(),
            ticket = $.getCache('ticket'),
            MoneyReg = /^\d{1,10}(\.\d{1,2})?$/;   //验证输入金额格式
        if(mon.length == 0){
            $.toast('请输入充值金额！',1500)
        }else if(!MoneyReg.test(mon)){
            $.toast('您输入的金额格式不正确',2000);
        }else if(mon > this.singleQuota){
            $.toast('单笔限额'+this.singleQuota,1500)
        }else if(mon<1){
            $.toast('充值金额不能少于1元')
        }else if(verify.length == 0){
            $.toast('请输入短信验证码！',1500)
        }else{
            $.sync({
                url:fresh.apiRoot + 'member/tradingPush',
                type:'post',
                data:{
                    ticket:ticket,
                    validCode:verify
                },
                success:function(d){
                    $.setCache('yw_user_rechargeMoney',mon);
                    $.changePage('payment/rechargeResult');
                },error:function(d){
                    $.toast(d.msg);
                }
            });
        }
    }
});