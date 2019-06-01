/**
 * Created by chenguodong on 2017/3/3.
 */
var template = _.template(require('./forgetPayPwd.html'));
require('./forgetPayPwd.css');
require('./../changePayPwd/changePayPwd.css');

module.exports = Backbone.View.extend({
    initialize:function(){
        this.getData();
        this.captCode = '';
        this.makNum = 1;
        this.newPass = [];
        this.newsPass = [];
        this.tradePwdKey ='';
    },
    getData:function(){
        var self = this;
        $.checkUser(function(){
            self.render();
            self.graphPic();
        });
    },
    render:function(){
        this.$el.html(template());
        var tel = $.telHide($.getNub());
        $('#telNum').html(tel);
        $.setAppNav('忘记交易密码');
        return this;
    },
    events:{
        'tap #graphPic':'graphPic',
        'tap #forgetPayVer':'forgetPayVer',
        'input #cardId,#verCode':'cardId',
        'tap #toForgetPay':'toForgetPay',
        'tap #keyboardTab td':'getNum'
    },
    graphPic:function(){
        var self = this;
        $.sync({
            url:fresh.apiRoot + 'member/getCaptcha',
            type:'post',
            success:function(d){
                self.captCode = d.captCode;
                $('#graphPic').attr('src','data:image/png;base64,'+d.captcha);
            }
        });
    },
    forgetPayVer:function(){
        var self = this,
            tel = $.getNub(),
            inpGraph = $('#inpGraph').val();
        $.sync({
            url:fresh.apiRoot + 'verifCode/getVerifCodeNew',
            type:'post',
            data:{
                phoneNum:tel,
                captcha:inpGraph,
                captCode:self.captCode
            },
            success:function(){
                self.countDownTime();
            },error:function(d){
                $.toast(d.msg,1500)
            }
        });
    },
    countDownTime:function(){
        var count = 59,
            timeout,
            pos = $('.get-ver');
        timeout = setInterval(function(){
            if(count <= 0){
                pos.html('重新获取');
                pos.removeClass('col1').attr('id','forgetPayVer');
                clearInterval(timeout);
            }else{
                pos.addClass('col1').removeAttr('id');
                pos.html('重发('+count+'S)');
            }
            count--;
        },1000);
    },
    cardId:function(){
        var verCode = $('#verCode').val(),
            cardId = $('#cardId').val(),
            IdCardReg = /^(\d{15}$)|((\d{17})([0-9]|(X|x))$)/;
        if(verCode.length!=0 && IdCardReg.test(cardId)){
            $('.common-btn1').attr('id','toForgetPay').addClass('common-btn2')
        }else{
            $('.common-btn1').removeAttr('id').removeClass('common-btn2')
        }
    },
    toForgetPay:function(){
        var self = this,
            verCode = $('#verCode').val(),
            cardId = $('#cardId').val();
        $.sync({
            url:fresh.apiRoot + 'member/resetTradePwdOne',
            type:'post',
            data:{
                verifCode:verCode,
                idcard:cardId
            },
            success:function(d){
                $('.forget-pay-pwd').hide();
                $('.forget-pays-pwd').show();
                self.tradePwdKey = d.tradePwdKey;
            },error:function(d){
                $.toast(d.msg,2000)
            }
        });
    },
    getNum:function(e){
        var selfNum = $(e.target).text(),
            math = /[0-9]/i;
        var pattern = math.test(selfNum);
        if(pattern){
            this.upPayPwd(selfNum);
        }else if(selfNum == 'x'){
            if(this.makNum == 1){
                this.newPass = [];
            }else if(this.makNum == 2){
                this.newsPass = [];
            }
            $('#passWord span').html('');
        }
    },
    upPayPwd:function(num){
        var self = this,password;
        if(this.makNum == 1){
            password = this.newPass;
        }else if(this.makNum == 2){
            password = this.newsPass;
        }
        password.push(num);
        for(var i=0;i<password.length;i++){
            $('#passWord span').eq(i).html('●');
        }
        if(password.length == 6){
            if(this.makNum == 1){
                this.makNum++;
                $('#passWord span').html('');
                $('#hintWord').html('请再次输入6位数交易密码');
            }else if(this.makNum == 2){
                var newPass = this.newPass.join(''),
                    newsPass = this.newsPass.join('');
                if(newPass != newsPass){
                    $.popWindow({
                        content:'两次交易密码输入不一致！',
                        yes:'重新输入',
                        no:'取消',
                        type:2,
                        callback:function(bl){
                            if(bl){
                                self.makNum = 1;
                                self.newPass = [];
                                self.newsPass = [];
                                $('#passWord span').html('');
                                $('#hintWord').html('请输入6位数交易密码');
                            }else{
                                location.reload();
                            }
                        }
                    })
                }else{
                    this.goResetPayPwd(newPass,newsPass,this.tradePwdKey);
                }
            }
        }
    },
    goResetPayPwd:function(newPass,newsPass,tradePwdKey){
        $.sync({
            url:fresh.apiRoot + 'member/resetTradePwdTwo',
            type:'post',
            data:{
                tradePwd:newPass,
                confirmTradePwd:newsPass,
                tradePwdKey:tradePwdKey
            },
            success:function(){
                $.toast('<div class="common-suc-icon"><i></i><p>交易密码重置成功</p></div>',2000);
                setTimeout(function(){
                    history.back();
                },2000)
            },error:function(d){
                $.toast(d.msg,2000)
            }
        });
    }
});