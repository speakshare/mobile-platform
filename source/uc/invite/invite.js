var template = _.template(require('./invite.html'));
require('./invite.css');

module.exports = Backbone.View.extend({
	initialize: function () {
		$.setLoginTokenFormApp();
        $.statistics('invite');
        this.getData();
    },
    getData:function(){
        var self=this;
        self.shareurl= location.protocol+'//'+location.host+'/weizhan/#uc/invite/landingPage?code=';
        $.checkUser(function(){
            $.sync({
                url:fresh.apiRoot + 'lcds/baseinfo',
                type: 'post',
                success:function(d){
                    self.cache={
                       info:d
                    };
                    localStorage.setItem('yw_user_inviteCode',d.inviteCode);
                    $('#codeval').text(d.inviteCode);
                    self.shareurl+= d.inviteCode;
                    jsb.setShareInfo({
                        title:'跟我来摇旺赚钱吧，100元代金券、14%新手专享产品和万元体验金等你来拿~', //分享标题
                        desc:'不会理财的人不漂亮！', //分享描述
                        link:self.shareurl,
                        callback:function(){
                        }
                    });
                   self.render();     
               }
        });
        });
    },
    render:function(){
        var self=this;
        if(!$.getCache('yw_invite_lead')){
            self.cache.lead=true;    
        }else{
            self.cache.lead=false;
        } 
        this.$el.html(template(this.cache));
        $.setAppNav('邀请好友');
        $('#qrcode').qrcode({width: 120, height: 120, text: self.shareurl});
        return this;
    }, 
    events:{
        'tap .invitebtn' :'maskshow',
        'tap .myinvite'  :'investrecord',
        'tap .inviterule':'inviterule',
        'tap .bannerbar' :'togrowplanner'
    },
    investrecord:function(){
        $.setCache('yw_invite_lead',true,30*24*60*60);
        if(this.cache.info.userType=='0'){
            $.changePage('uc/invite/inviteRecords');
        }else{
            $.changePage('uc/manager');
        }
    },
    maskshow:function(){
        jsb.share();
    },
    maskhidden:function(){
        $('.share_mask').hide();
    },
    inviterule:function(){
        $.changePage('staticPage/inviteRule');
    },
    togrowplanner:function(){
       $.changePage('uc/manager/makeMoneyGuide');
   }
})