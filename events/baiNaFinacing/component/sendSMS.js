module.exports=function (opt){
    var self=this,
        mobile=opt.mobile,
        obj=opt.obj,
        url=fresh.apiRoot+'verifCode/getVerifCodeNew',
        audioBox=opt.audioBox,
        audioCount=60,
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
            showAudio();

        },
        error:function(d){
            $(obj).attr('disabled',false).removeClass('disabled');
            self.sendSMSing=false;
            $(opt.captInputBox).val('');
            $.toast(d.msg);
        }
    });
    function showAudio(){
        audioBox.show().find('.audio-btn').on('click',function(){
            if(audioCount==60){
                audioCount=59;
                $.sync({
                    url: fresh.apiRoot + 'verifCode/voiceVerifCodeNew',
                    type: 'post',
                    data: {
                        phoneNum:mobile,
                        isRegisted:opt.isRegisted||1
                    },
                    success: function (d) {
                        $.toast('请注意952129号码来电');
                        setTimeout(countDown,1000);
                        function countDown(){
                            if(audioCount>0){
                                setTimeout(countDown,1000)
                            }
                            audioCount--;
                        }
                    },
                    error:function(d){
                        audioCount=60;
                        $.toast(d.msg)
                    }
                });
            }else{
                $.toast('请在'+audioCount+'s后重试');
            }
        })
    }
}