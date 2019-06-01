var template = _.template(require('./register.html'));
require('./register.css');

module.exports = function(mobileNum){
    $.sync({
        url:fresh.apiRoot+'member/getRegisterImgUrl',
        type:'post',
        success:function(d){
            $('#bannerImg').attr('src',d.url)
        }
    });

    var inviteCode = localStorage.getItem('yw_user_inviteCode');
    var channelCode = localStorage.getItem('yw_user_channelCode') || $.getCache('channelInviteValue',1);
    
    var registerBox=$(template({channelCode:channelCode,inviteCode:inviteCode,mobile:mobileNum||$.getParam('mobile')||localStorage.getItem('yw_user_phoneNum')}));
    var captCode;
    var audioCount=60;
    $.setAppNav('注册');
    $('body').append(registerBox);
    getGraphCode('#graphCode');

    $(window).on('popstate.registerBox',function(){
        //<%= ($(window).width()>760)?334:($(window).width()/750*330) %>
        // history.go(1);
        hideRegisterBox();
        $(window).off('popstate.registerBox');
    });

    function hideRegisterBox(callback){
        registerBox.animate({bottom:'-100%'},500);
        setTimeout(function(){
            registerBox.remove();
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
    // $.inputAboveKeyWord(registerBox,'#registerTel,#registerVerify,#registerNote,#setPassword,#inviteCode');
    
    registerBox.on('input','#registerTel,#registerVerify,#registerNote,#setPassword',function(e){

        var mobile = registerBox.find('#registerTel').val();
        var registerNote = registerBox.find('#registerNote').val();
        var setPassword = registerBox.find('#setPassword').val();

        if(mobile.length>0){
            registerBox.find('.clear').show();
        }else{
            registerBox.find('.clear').hide();
        }
    }).on('click',function(e){
        var self = $(e.target),
        _idx = self.attr('id'),
        pos = _idx=='registerTel'||_idx=='registerVerify'||_idx=='registerNote'||_idx=='registerNote'||_idx=='setPassword'||_idx=='inviteCode';
        if(pos){
            $('.yw_logo').hide();
        }else{
            $('.yw_logo').show();
        }
    }).on('click','.clear',function(){
        registerBox.find('.clear').hide();
        registerBox.find('#registerTel').val('');
    }).on('click','#graphCode',function(){
        getGraphCode('#graphCode');
    }).on('click','#noteVerify',function(){
        var mobile = registerBox.find('#registerTel').val(),
        captCha=registerBox.find('#registerVerify').val();
        if(!$.isMobileNum(mobile)){
            $.toast('请输入正确的手机号码');
            return false;
        }
        if(captCha.length<4){
            $.toast('请输入正确图形验证码');
            registerBox.find('#registerVerify').val('');
            getGraphCode('#graphCode');
            return false;
        }
        $.sendSMS({
            obj:registerBox.find('#noteVerify'),
            mobile:mobile,
            captcha:captCha,
            captCode:captCode,
            isRegisted:'1',
            tipObj:registerBox.find('.send-sms-tip'),
            captInputBox:registerBox.find('#registerVerify'),
            audioBox:registerBox.find('.audio-box')
        });
        registerBox.find('.audio-box').show();
    }).on('click','#enumerable',function(e){
        var obj = $(e.target);
        if(!obj.hasClass('reg-enum')){
            obj.addClass('reg-enum');
            registerBox.find('#setPassword').attr('type','text')
        }else{
            obj.removeClass('reg-enum');
            registerBox.find('#setPassword').attr('type','password')
        }
    }).on('click','.agr',function(){
        var obj = registerBox.find('#agrIcon');
        if(obj.hasClass('un-agr-icon')){
            obj.removeClass('un-agr-icon');
        }else{
            obj.addClass('un-agr-icon');
        }
    }).on('click','#ywUserAgr',function(){
        hideRegisterBox(function(){
            $.changePage('staticPage/registerAgr');
        });
        return false
    }).on('click','#toLogin',function(){
        hideRegisterBox(function(){
            $.userLogin();
        });
    }).on('click','.common-btn2',function(){
        var mobile = registerBox.find('#registerTel').val();
        var registerVerify = registerBox.find('#registerVerify').val();
        var registerNote = registerBox.find('#registerNote').val();
        var setPassword = registerBox.find('#setPassword').val();
        if(!$.isMobileNum(mobile)){
            $.toast('请输入手机号码');
            return false;
        }
        if(registerVerify.length<4){
            $.toast('请输入图形码');
            return false;
        }
        if(registerNote.length<4){
            $.toast('请输入短信验证码');
            return false;
        }
        if(setPassword.length<6){
            $.toast('请输入登录密码');
            return false;
        }

        var channelInviteValue, inviteCode=registerBox.find('.invite-box').text()||registerBox.find('#inviteCode').val();
        if(!inviteCode){
            channelInviteValue=localStorage.getItem('yw_user_channelCode')||$.getCache('channelInviteValue',1);
        }

        $.sync({
            url: fresh.apiRoot + 'member/register',
            type: 'post',
            data: {
                phoneNum:mobile,
                captcha:registerBox.find('#registerVerify').val(),
                verifCode:registerNote,
                loginpwd:setPassword,
                inviteValue:inviteCode||'',
                appId:mobile,
                channelInviteValue:channelInviteValue,
                openid:$.getCache('weixinOpenID',1)
            },
            success: function(d){
                $.setCache('yw_user-id', d.userId);
                window.curUserID=parseInt(mobile);
                $.setNub(mobile);
                localStorage.yw_user_realName = '';
                localStorage.yw_user_idCard = '';
                localStorage.yw_user_bankCardNo = '';
                localStorage.yw_user_bankName = '';
                localStorage.yw_user_isSetTradersPwd = '';
                localStorage.yw_user_tyj = '';
                localStorage.yw_user_isAuthed = '';
                localStorage.setItem('userID',d.uFlag);
                $.setLogin(true);
                $.setToken(d.loginToken);
                var after=localStorage.getItem('yw_user_after_login_link')
                if(after){
                    localStorage.removeItem('yw_user_after_login_link')
                    window.location=after;
                }else{
                    hideRegisterBox(function(){
                        if($(window).width()>=760){
                            $.changePage('uc/invite/appdownload'); 
                        }else{
                            $.changePage('newshake');
                        }  
                    });
                }
            },
            error:function(d){
                if(d.status=='001701'){
                    $.popWindow({
                       content:'该手机号已经注册，<br>请前往登录！',
                       yes:'直接登录',
                       no:'换个号',
                       type:2,
                       callback:function(bl){
                           if(bl){
                               $.userLogin(mobile);
                           }else{
                               $('#registerTel').val('').focus();
                           }
                       }
                   })
                }else{
                    $.toast(d.msg)
                }
            }
        })
    });
};