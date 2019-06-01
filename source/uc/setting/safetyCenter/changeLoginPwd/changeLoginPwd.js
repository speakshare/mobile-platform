/**
 * Created by chenguodong on 2017/3/3.
 */
var template = _.template(require('./changeLoginPwd.html'));
require('./changeLoginPwd.css');

module.exports = Backbone.View.extend({
    initialize:function(){
        var self = this;
        $.checkUser(function(){
            self.render();
        });

    },
    render:function(){
        this.$el.html(template());
        $.setAppNav('修改登录密码');
        return this;
    },
    events:{
        'tap .change-btn':'changeIcon',
        'input #oldPassword,#newPassword,#newPasswords':'listenInp',
        'tap #goUpdated':'goUpdated'
    },
    changeIcon:function(e){
        var self = $(e.target),
            _mak = self.hasClass('no-eye'),
            _id = self.attr('data-id');
        if(_mak){
            self.removeClass('no-eye').addClass('eye');
            this.btnSwitch(_id,'text');
        }else{
            self.removeClass('eye').addClass('no-eye');
            this.btnSwitch(_id,'password');
        }
    },
    btnSwitch:function(id,type){
        if(id == '1'){
            $('#oldPassword').attr('type',type)
        }else if(id == '2'){
            $('#newPassword').attr('type',type)
        }else{
            $('#newPasswords').attr('type',type)
        }
    },
    listenInp:function(){
        var inp1 = $('#oldPassword').val().length,
            inp2 = $('#newPassword').val().length,
            inp3 = $('#newPasswords').val().length,
            pos = $('.common-btn1');
        if(inp1!=0 && inp2!=0 && inp3!=0){
            pos.attr('id','goUpdated').addClass('common-btn2');
        }else{
            pos.removeAttr('id').removeClass('common-btn2');
        }
    },
    goUpdated:function(){
        var self = this,
            inp1 = $('#oldPassword').val(),
            inp2 = $('#newPassword').val(),
            inp3 = $('#newPasswords').val();
        var passInp = /(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{6,16}$/;  //密码格式正则
        if(passInp.test(inp1) && passInp.test(inp2) && passInp.test(inp3)){
            $.sync({
                url:fresh.apiRoot + 'member/updateLoginPwd',
                type:'post',
                data:{
                    oldLoginPwd:inp1,
                    newLoginPwd:inp2,
                    confirmLoginPwd:inp3
                },
                success:function(){
                    $.toast('<div class="common-suc-icon"><i></i><p>登录密码修改成功</p></div>',2000);
                    setTimeout(function(){
                        self.sucLogout();    //登录密码修改成功后重新调用退出登录接口
                    },1500)
                },error:function(d){
                    $.toast(d.msg,2000)
                }
            });
        }else{
            $.toast('登录密码请使用6~16位字母+数字组合',3500);
        }
    },
    sucLogout:function(){
        $.sync({
            url:fresh.apiRoot+'member/logout',
            type:'post',
            success:function(){
                localStorage.clear();
                setTimeout(function(){
                    if(localStorage.length>0){
                        window.localStorage.clear();
                    }
                    location.reload();
                },50);
                $.changePage('home')
            }
        })
    }
});