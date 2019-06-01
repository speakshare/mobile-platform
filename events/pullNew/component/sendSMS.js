module.exports=function (opt){
    var self=this,
        mobile=opt.mobile,
        obj=opt.obj,
        url=fresh.apiRoot+'verifCode/getVerifCodeNew', 

        data={
            phoneNum:mobile,
            captcha:opt.captcha,
            captCode:opt.captCode,
            isRegisted:opt.isRegisted||'0'
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
                    $(obj).html('获取').css({'color':'#ff5532'});
                    $(obj).attr('disabled',false).removeClass('disabled');
                    clearInterval(timeout)
                    $(opt.tipObj).html('');
                }else{
                    $(obj).html('重新获取'+count+'S').css({'color':'#727272'});
                }
                count--;
            },1000);
        },
        error:function(d){
            $(obj).attr('disabled',false).removeClass('disabled');
            self.sendSMSing=false;
            $(opt.captInputBox).val('');
            $.toast(d.msg);
        }
    });
}