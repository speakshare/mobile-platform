var template = _.template(require('./login.html'));
require('./login.css');

module.exports = function(mobileNum){
    var loginBox=$(template({mobile:mobileNum||$.getParam('mobile')||localStorage.getItem('yw_user_phoneNum')}));
    $.setAppNav('登录');
    $('body').append(loginBox);

    $(window).on('popstate.loginBox',function(e){
        // history.go(1);
        hideLoginBox();
        $(window).off('popstate.loginBox');
    });

    function hideLoginBox(callback){
        loginBox.animate({bottom:'-100%'},500);
        setTimeout(function(){
            loginBox.remove();
            callback && callback();
        },500);
    }

    loginBox.on('touchmove',function(e){
        e.preventDefault();
    }).on('focus','#loginTel,#loginPassword',function() {
        loginBox.find('.safety-hint').hide()
    }).on('blur','#loginTel,#loginPassword',function() {
        setTimeout(function(){
            loginBox.find('.safety-hint').show();
        },500);
    }).on('input','#loginTel,#loginPassword',function(){
        var mobile = loginBox.find('#loginTel').val();
        var password = loginBox.find('#loginPassword').val();
        if(mobile.length>0){
            loginBox.find('.clear').show();
        }else{
            loginBox.find('.clear').hide();
        }
        if(mobile.length==11 && password.length>=6){
            loginBox.find('.common-btn1').css('background-color','#ff6046');
        }else{
            loginBox.find('.common-btn1').css('background-color','#d8d8d8');
        }
    }).on('click','.clear',function(){
        loginBox.find('.clear').hide();
        loginBox.find('#loginTel').val('');
        loginBox.find('.common-btn1').css('background-color','#d8d8d8');
    }).on('click','#enumerable',function(e){
        var obj = $(e.target);
        if(!obj.hasClass('enumerable')){
            obj.addClass('enumerable');
            loginBox.find('#loginPassword').attr('type','text')
        }else{
            obj.removeClass('enumerable');
            loginBox.find('#loginPassword').attr('type','password')
        }
    }).on('click','#toRegister',function(){
        hideLoginBox(function(){
            if(localStorage.getItem('yw_user_channelCode')){
                localStorage.removeItem('yw_user_channelCode');
            }
            $.userRegister();
        });
    }).on('click','#toFindPass',function(){
        hideLoginBox(function () {
            $.userForgetPassword();
        });
    }).on('click','.common-btn1',function(){
        var loginTel = loginBox.find('#loginTel').val();
        var loginPassword = loginBox.find('#loginPassword').val();
        if(!$.isMobileNum(loginTel)){
            $.toast('请输入正确的手机号码');
            return false;
        }
        if(loginPassword.length<6){
           $.toast('请输入登录密码');
           return false;
       }

       $.sync({
        url: fresh.apiRoot + 'member/login',
        type: 'post',
        dataType:'json',
        data: {
            phoneNum: loginTel,
            loginpwd:loginPassword,
            type:'1',
            openid:$.getCache('weixinOpenID',1)
        },
        success: function(d){
            $.setNub(loginTel);
            window.curUserID=parseInt(loginTel);
            localStorage.yw_user_realName = d.realName;
            localStorage.yw_user_idCard = d.idcard||'';
            localStorage.yw_user_bankCardNo = d.bankCard;
            localStorage.yw_user_bankName = d.bankName;
            localStorage.yw_user_isSetTradersPwd = d.isSetTradersPwd;
            localStorage.yw_user_tyj = d.tyj||0;
            localStorage.yw_user_isAuthed = d.isAuthed;
            localStorage.setItem('userID',d.uFlag);
            $.setLogin(true);
            $.setToken(d.loginToken);
            var after=localStorage.getItem('yw_user_after_login_link')
            if(after){
                localStorage.removeItem('yw_user_after_login_link')
                window.location=after;
            }else{
                hideLoginBox(function(){
                        //非弹窗模?
                        history.go(-1);
                    });
            }
        },
        error:function(d){
            if(d.status=='18'){
                $.popWindow({
                  content:'该手机号暂未注册，<br>请前往注册！',
                  yes:'注册',
                  no:'取消',
                  type:2,
                  callback:function(bl){
                    if(bl){
                        $.userRegister(loginTel);
                    }
                  }
                })
            }else{
                $.toast(d.msg);
                loginBox.find('#loginPassword').val('');               
            }
        }
    })
   })
}