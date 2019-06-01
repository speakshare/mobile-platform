module.exports=function (opt){
    var self=this,
        mobile=opt.mobile,
        obj=opt.obj,
        url=fresh.apiRoot+'verifCode/getVerifCodeNew',
        audioBox=opt.audioBox,
        audioSending=false,
        audioToastTipTxt='',
        data={
            phoneNum:mobile,
            captcha:opt.captcha,
            captCode:opt.captCode,
            isRegisted:opt.isRegisted||1,

        };

    if(!$.isMobileNum(mobile)){
        $.toast('请输入正确的手机号码');
        return false;
    }
    if(this.sendSMSing) return false;
    this.sendSMSing=true;
    $.sync({
        url:url,
        type:'post',
        data:data,
        success:function(){
            var count=60,timeout;
            $(obj).attr('disabled',true).addClass('disabled');
            $(opt.tipObj).html('验证码已发送至 '+opt.mobile);
            timeout=setInterval(function(){
                if(count<=0){
                    self.sendSMSing=false;
                    $(obj).html('获取');
                    $(obj).attr('disabled',false).removeClass('disabled');
                    clearInterval(timeout)
                    $(opt.tipObj).html('');
                }else{
                    $(obj).html('重发('+count+'S)');
                }
                count--;
            },1000);
            if(audioBox && audioBox.length) showAudio();

        },
        error:function(d){
            $(obj).attr('disabled',false).removeClass('disabled');
            self.sendSMSing=false;
            $(opt.captInputBox).val('');
            $.toast(d.msg);
        }
    });
    function showAudio(){
        var count=60,timeout;
        audioBox.show().find('.audio-btn').on('click',function(){
            if(!audioSending){
                audioSending=true;
                count=60;
                $.sync({
                    url: fresh.apiRoot + 'verifCode/voiceVerifCodeNew',
                    type: 'post',
                    data: {
                        phoneNum:mobile,
                        isRegisted:opt.isRegisted||1
                    },
                    success: function (d) {
                        audioToastTipTxt=d||'请注意12590开头的号码来电';
                        $.toast(audioToastTipTxt);
                        timeout=setInterval(function(){
                            if(count<=0){
                                audioSending=false;
                                clearInterval(timeout)
                            }
                            count--;
                        },1000);
                    },
                    error:function(d){
                        audioSending=false;
                        $.toast(d.msg)
                    }
                });
            }else{
                $.toast('请在'+count+'s后重试');
            }
        })
    }
}