var template = _.template(require('./forget.html'));
require('./forget.css');

module.exports = function(mobileNum){
    var forgotBox=$(template({mobile:mobileNum||$.getParam('mobile')||localStorage.getItem('yw_user_phoneNum')})),captCode;
    
    $('body').append(forgotBox);
    $.setAppNav('找回密码');
    
    getGraphCode('#forgetGraphCode');

    $(window).on('popstate.forgotBox',function(){
        // history.go(1);
        hideForgotBox();
        $(window).off('popstate.forgotBox');
    });

    function hideForgotBox(callback){
        forgotBox.animate({bottom:'-100%'},500);
        setTimeout(function(){
            forgotBox.remove();
            callback && callback();
        },500);
    }

    function getGraphCode(obj){

        // $(obj).attr('src',fresh.apiRoot + 'member/getCaptcha?'+$.uniqID());
        
        $.sync({
            url:fresh.apiRoot + 'member/getCaptcha',
            type:'post',
            success:function(d){
                captCode=d.captCode;
                $(obj).attr('src','data:image/png;base64,'+d.captcha);
            }
        });
    }

    $.inputAboveKeyWord(forgotBox,'#forgetPassTel,#forgetPassVerify,#forgetPassNote,#forgetPassSet');

    forgotBox.on('input','#forgetPassTel,#forgetPassVerify,#forgetPassNote,#forgetPassSet',function(){
        var mobile = forgotBox.find('#forgetPassTel').val();
        var forgetPassNote = forgotBox.find('#forgetPassNote').val();
        var forgetPassSet = forgotBox.find('#forgetPassSet').val();

        if(mobile.length>0){
            forgotBox.find('.clear').show();
        }else{
            forgotBox.find('.clear').hide();
        }
        if(mobile.length==11 && forgetPassNote.length>=4 && forgetPassSet.length>=6){
            forgotBox.find('.common-btn1').css('background-color','#ff6046');
        }else{
            forgotBox.find('.common-btn1').css('background-color','#d8d8d8');
        }
    }).on('click','.clear',function(){
        loginBox.find('.clear').hide();
        forgotBox.find('#forgetPassTel').val('');
        loginBox.find('.common-btn1').css('background-color','#d8d8d8');
    }).on('click','#forgetGraphCode',function(){
        getGraphCode('#forgetGraphCode');
    }).on('click','#noteVerify',function(){
        var captCha = forgotBox.find('#forgetPassVerify').val();
        var mobile = forgotBox.find('#forgetPassTel').val();
        if(!$.isMobileNum(mobile)){
            $.toast('请输入正确的手机号码');
            return false;
        }
        if(captCha.length<4){
            $.toast('请输入正确图形验证码');
            // getGraphCode('#forgetGraphCode');
            forgotBox.find('#forgetPassVerify').val('');
            return false;
        }
        $.sendSMS({
            obj:forgotBox.find('#noteVerify'),
            mobile:mobile,
            captcha:captCha,
            captCode:captCode,
            isRegisted:2,
            // tipObj:forgotBox.find('.send-sms-tip'),
            captInputBox:forgotBox.find('#forgetPassVerify'),
            audioBox:forgotBox.find('.audio-box')
        });
    }).on('click','#enumerable',function(e){
        var obj = $(e.target);
        if(!obj.hasClass('enumerable')){
            obj.addClass('enumerable');
            forgotBox.find('#forgetPassSet').attr('type','text')
        }else{
            obj.removeClass('enumerable');
            forgotBox.find('#forgetPassSet').attr('type','password')
        }
    }).on('click','#toLogin',function(){
        hideForgotBox(function(){
            $.userLogin();
        })
    }).on('click','.common-btn1',function(){
        var mobile = forgotBox.find('#forgetPassTel').val();
        var forgetPassVerify = forgotBox.find('#forgetPassVerify').val();
        var forgetPassNote = forgotBox.find('#forgetPassNote').val();
        var forgetPassSet = forgotBox.find('#forgetPassSet').val();

        if(!$.isMobileNum(mobile)){
            $.toast('请输入正确的手机号码');
            return false;
        }
        if(forgetPassNote.length<4){
            $.toast('请输入短信验证码');
            return false;
        }
        if(forgetPassSet.length<6){
            $.toast('请输入登录密');
            return false;
        }

        $.sync({
            url: fresh.apiRoot + 'member/resetLoginPwd',
            type: 'post',
            data: {
                phoneNum:mobile,
                verifCode:forgetPassNote,
                loginpwd:forgetPassSet,
                confirmLoginPwd:forgetPassSet
            },
            success: function(d){
               $.toast('登录密码修改成功！',1000);
                hideForgotBox(function(){
                    history.go(-1);
                })
            }
        })
    });
};