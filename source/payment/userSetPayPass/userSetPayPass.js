/**
 * Created by chenguodong on 2017/3/7.
 */
/**
 * Created by chenguodong on 2017/3/7.
 */
var template = _.template(require('./userSetPayPass.html'));
require('./userSetPayPass.css');

module.exports = Backbone.View.extend({
    initialize:function(){
        var self = this;
        $.checkUser(function(){
            var tel = $.getNub();
            $.sync({
                url: fresh.apiRoot +  'member/queryUserFlowStatus',
                type: 'post',
                data: {phoneNum: tel},
                success:function(d){
                    var bindCardFlag = d.bindCardFlag;
                    if(bindCardFlag == '0'){
                        $.popWindow({
                            content:'您还未绑定银行卡，请先绑定银行卡后再设置交易密码',
                            yes:'去绑卡',
                            no:'取消',
                            type:2,
                            callback:function(bl){
                                if(bl){
                                    $.changePage('payment/userTiedCard')
                                }else{
                                    history.back();
                                }
                            }
                        })
                    }else if(bindCardFlag == '1'){
                        self.render();
                    }else{
                        $.toast('请重新访问！')
                    }
                },error:function(d){
                    $.toast(d.msg)
                }
            });
        })
    },
    render:function(){
        this.$el.html(template());
        $.setAppNav('设置交易密码');
        return this;
    },
    events:{
        'input #payPassword,#comPayPassword':'inpPayPassword',
        'tap #toSetPayPass':'toSetPayPass'
    },
    inpPayPassword:function(){
        var payPassword = $('#payPassword').val(),
            comPayPassword = $('#comPayPassword').val(),
            PayPassReg = /^[0-9]{6}$/;
        if(PayPassReg.test(payPassword) && PayPassReg.test(comPayPassword)){
            $('.common-btn1').addClass('common-btn2').attr('id','toSetPayPass')
        }else{
            $('.common-btn1').removeClass('common-btn2').removeAttr('id')
        }
    },
    toSetPayPass:function(){
        var payPassword = $('#payPassword').val(),
            comPayPassword = $('#comPayPassword').val();
        if(payPassword != comPayPassword){
            $.toast('两次密码输入不一致');
        }else{
            $.sync({
                url:fresh.apiRoot + 'member/addTradePwd',
                type:'post',
                data:{
                    tradePwd:payPassword,
                    confirmTradePwd:comPayPassword
                },
                success:function(){
                    $.toast('<div class="common-suc-icon"><i></i><p>交易密码设置成功！</p></div>',2000);
                    setTimeout(function(){
                        if(localStorage.getItem('afterSetPayPwd')){
                            localStorage.removeItem('afterSetPayPwd');
                            $.changePage(localStorage.getItem('afterSetPayPwd'));
                        }else{
                            $.changePage('product');
                        }
                    },2000)
                },error:function(d){
                    $.toast(d.msg);
                }
            });
        }
    }
});