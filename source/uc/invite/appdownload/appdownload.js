var template = _.template(require('./appdownload.html'));
require('./appdownload.css');

module.exports = Backbone.View.extend({
	initialize: function () {
		$.setLoginTokenFormApp();
		this.getData();
    },
    getData:function(){
        var self = this;
        this.islogin=$.getLogin();
        var inviteCode = $.getParam(location.href,'code');
        if(inviteCode){
            localStorage.setItem("yw_user_inviteCode", inviteCode);
        }
        
        $.sync({
           url:fresh.apiRoot+'activity/queryInviteLandingImg',
           type:'post',
           success: function(d){
               self.cache=d;
               self.render();
           }
       });
    },
    render:function(){
        this.$el.html(template({banner:this.cache}));
        $.setAppNav('新手下载页');
        return this;
    },
    events:{
    	'tap #register':                  'toRegister'
    },
    toRegister:function(){
    	var loginTel = $('.phoneNumber').val();
        if($.isMobileNum(loginTel)){
            $.sync({
                url: fresh.apiRoot + 'member/registerSelect',
                type: 'post',
                dataType:'json',
                data: {
                    phoneNum:loginTel
                },
                success: function(d){
                    $.setNub(loginTel);
                    if(d.userId==-1){
                        $.changePage('register/?mobile='+loginTel,true);
                    }else{
                        $.changePage('login/?mobile='+loginTel,true);
                    }
                },error:function(d){
                    $.toast(d.msg);
                }
            })
        }else{
            $.toast('请输入正确的手机号码');
        }
    }
})