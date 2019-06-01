module.exports=function(opt){
    var defaultSetting={
            value:0,
            smsIsRequired:false,
            step:0,//step:0 交易密码， step:1 发验证码
            mobile:'',
            callback:function(){}
        },
        opt=$.extend(true,defaultSetting,opt),
        forgotUrl=location.origin + "/weizhan/#uc/setting/forgetPayPwd",
        password=[],
        tradePassword=[],
        smscode=[],
        win;
        win=$(template());
        $('body').append(win);
        win.on('touchmove',function(e){
            e.preventDefault();
        }).on('tap','.key-one',function(e){
            var obj=$(e.currentTarget),
            value=obj.attr('data-num');
            if(value=='reset'){
                password=[];
            }else if(value=='backspace'){
                password.pop();
            }else{
                password.push(value);
            }
            renderPassword();
            if(password.length>=6){   
                if(opt.smsIsRequired) {
                    if(opt.step==0){ 
                        opt.step=1;
                        tradePassword=password.join('');
                        password=[];
                        $('#tradepsdbox').hide();
                        $('#smspsdbox').show();
                    }else if(opt.step==1){
                        smscode=password.join('');
                        password=[];
                        setTimeout(function () {
                            opt.callback(tradePassword,smscode);
                            win.off().remove();
                        }, 300); 
                    }   
                }else{
                    setTimeout(function () {
                        opt.callback(password.join(''));
                        win.off().remove();
                    }, 300);
                }
            }
        }).on('touchend','.cancel-btn',function(event){
            event.preventDefault();
            win.off().remove();
            password=[];
            opt.callback('');
        });
        $(window).on('popstate',function(e){
            win.off().remove();
            password=[];
            opt.callback('');
            $(window).off('popstate');
        });
        function renderPassword(){
            var len=password.length,
            obj=win;
            if(opt.step==1){ //短信验证码框
                obj.find('#smscode').val('');
                var strnum="";
                for(var i=0;i<len;i++){
                    strnum+='●';
                    obj.find('#smscode').val(strnum);    
                }  
            }else{//交易密码框
                obj.find('.key-value').html('');
                for(var i=0;i<len;i++){
                    obj.find('.key-value').eq(i).html('●');
                } 
            }
        }
        function template(){
            var str='<div class="password-mask"><div class="fixedbox">'
            +'<div class="password-box" id="tradepsdbox"><div class="trade-password"><h3 class="trade-password-title">交易密码<div class="cancel-btn icons"></div></h3>'
            if(opt.value>0){
                str+='<p class="trade-tip">交易金额：<span class="trade-num">￥'+opt.value+'元</span></p>'
            }
            str+='<div class="trade-box"><span class="key-value"></span><span class="key-value"></span>'
            +'<span class="key-value"></span><span class="key-value"></span><span class="key-value"></span>'
            +'<span class="key-value"></span></div><a href="'+forgotUrl+'" class="forgot-password-btn">忘记密码?</a></div></div>'
            str+='<div class="password-box " id="smspsdbox" style="display:none;"><div class="trade-password"><h3 class="trade-password-title">验证码<div class="cancel-btn icons"></div></h3>'
            +'<div class="smstips">验证码已发送至您的手机号 '+opt.mobile+'</div>'
            +'<div class="smsbox"> <input class="smscode" id="smscode" placeholder="6位数字验证码" /><span class="timecount">59S</span></div>'
            +'<div class="conformbtn disablebtn">确定</div></div></div>';
            str+='<div class="keyboard-box">'
            +'<span class="key-one" data-num="1">1</span><span class="key-one" data-num="2">2</span>'
            +'<span class="key-one" data-num="3">3</span><span class="key-one" data-num="4">4</span>'
            +'<span class="key-one" data-num="5">5</span><span class="key-one" data-num="6">6</span>'
            +'<span class="key-one" data-num="7">7</span><span class="key-one" data-num="8">8</span>'
            +'<span class="key-one" data-num="9">9</span><span class="icons key-one reset" data-num="reset"></span>'
            +'<span class="key-one" data-num="0">0</span><span class="icons key-one backspace" data-num="backspace"></span></div></div></div>';
            return str;
        }
    }