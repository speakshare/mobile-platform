/**
 * Created by chenguodong on 2017/3/7.
 */
var template = _.template(require('./userAuthentication.html'));
require('./userAuthentication.css');

module.exports = Backbone.View.extend({
    initialize:function(){
        var self = this;
        $.checkUser(function(){
            self.render();
        })
    },
    render:function(){
        this.$el.html(template());
        $.setAppNav('实名认证');
        return this;
    },
    events:{
        'input #userAuthName,#userAuthIdCard':'userAuthBtn',
        'tap #toAuth':'toAuth',
        'click #userTips':'userAuthBtn',
        'tap #J_goCredit': 'goCredit'
    },
    userAuthBtn:function(){
        var userName = $('#userAuthName').val(),
            userIdCard = $('#userAuthIdCard').val(),
            IdCardReg = /^(\d{15}$)|((\d{17})([0-9]|(X|x))$)/,
            $userTips = $('#userTips');
        
        if(userName.length!=0 && IdCardReg.test(userIdCard) && $userTips.is(':checked')){
            $('.common-btn1').addClass('common-btn2').attr('id','toAuth')
        }else{
            $('.common-btn1').removeClass('common-btn2').removeAttr('id')
        }
    },
    goCredit: function(){
        $.changePage('staticPage/credit');
    },
    toAuth:function(){
        var userName = $('#userAuthName').val(),
            userIdCard = $('#userAuthIdCard').val();
        $.sync({
            url:fresh.apiRoot + 'member/identityAuthen',
            type:'post',
            data:{
                realName:userName,
                idCard:userIdCard,
                idType:'0'
            },
            success:function(){
                $.toast('<div class="common-suc-icon"><i></i><p>实名认证成功！</p></div>',2000);
                localStorage.yw_user_realName = userName;
                localStorage.yw_user_idCard = userIdCard;
                setTimeout(function(){
                    $.changePage('payment/userTiedCard')
                },2000)
            },error:function(d){
                $.toast(d.msg);
            }
        });
    }
});