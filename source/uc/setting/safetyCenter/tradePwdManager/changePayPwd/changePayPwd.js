/**
 * Created by chenguodong on 2017/3/3.
 */
var template = _.template(require('./changePayPwd.html'));
require('./changePayPwd.css');

module.exports = Backbone.View.extend({
    initialize:function(){
        var self = this;
        $.checkUser(function(){
            self.render();
            self.makNum = 1;
            self.oldPass = [];
            self.newPass = [];
            self.newsPass = [];
        });
    },
    render:function(){
        this.$el.html(template());
        $.setAppNav('修改交易密码');
        return this;
    },
    events:{
        'tap #keyboardTab td':'getNum'
    },
    getNum:function(e){
        var selfNum = $(e.target).text(),
            math = /[0-9]/i;
        var pattern = math.test(selfNum);
        if(pattern){
            this.upPayPwd(selfNum);
        }else if(selfNum == 'x'){
            if(this.makNum == 1){
                this.oldPass = [];
            }else if(this.makNum == 2){
                this.newPass = [];
            }else if(this.makNum == 3){
                this.newsPass = [];
            }
            $('#passWord span').html('');
        }
    },
    upPayPwd:function(num){
        var self = this,password;
        if(this.makNum == 1){
            password = this.oldPass;
        }else if(this.makNum == 2){
            password = this.newPass;
        }else if(this.makNum == 3){
            password = this.newsPass;
        }
        password.push(num);
        for(var i=0;i<password.length;i++){
            $('#passWord span').eq(i).html('●');
        }
        if(password.length == 6){
            var passwords = password.join('');
            if(this.makNum == 1){
                this.toUpdatePay(passwords);
            }else if(this.makNum == 2){
                this.makNum++;
                $('#passWord span').html('');
                $('#hintWord').html('请再次输入新交易密码');
            }else if(this.makNum == 3){
                var oldPass = this.oldPass.join(''),
                    newPass = this.newPass.join(''),
                    newsPass = this.newsPass.join('');
                if(newPass != newsPass){
                    $.popWindow({
                        content:'两次交易密码输入不一致！',
                        yes:'取消',
                        no:'重新输入',
                        type:2,
                        callback:function(bl){
                            if(!bl){
                                self.newPass = [];
                                self.newsPass = [];
                                self.makNum = 2;
                                $('#passWord span').html('');
                                $('#hintWord').html('请输入新交易密码');
                            }else{
                                history.back();
                            }
                        }
                    })
                }else{
                    this.toUpdatePay(oldPass,newPass,newsPass);
                }
            }
        }
    },
    toUpdatePay:function(oldPass,newPass,newsPass){
        var self = this;
        $.sync({
            url:fresh.apiRoot + 'member/updateTradePwd',
            type:'post',
            data:{
                oldTradePwd:oldPass,
                tradePwd:newPass||oldPass,
                confirmTradePwd:newsPass||oldPass
            },success:function(){
                if(self.makNum == 1){
                    $('#hintWord').html('请输入新交易密码');
                }else if(self.makNum == 3){
                    $.toast('<div class="common-suc-icon"><i></i><p>交易密码修改成功</p></div>',2000);
                    setTimeout(function(){
                        window.history.back();
                    },2000)
                }
                self.makNum++;
            },error:function(d){
                if(d.status == '2709'){
                    $.toast(d.msg,2500)
                }else if(d.status == '0834'){
                    $.popWindow({
                        content:d.msg,
                        yes:'确定',
                        no:'取消',
                        type:2,
                        callback:function(bl){
                            if(bl){
                                alert('重置交易密码')
                            }
                        }
                    })
                }
                self.oldPass = [];
            }
        });
        $('#passWord span').html('');
    }
});