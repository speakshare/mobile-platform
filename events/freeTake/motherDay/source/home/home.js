var template = _.template(require('./home.html'));
require('./home.css');
var flower=require('./jquery.let_it_snow');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.code=localStorage.getItem('yw_user_inviteCode')||'';
        this.type = options.type || '';
        this.token=localStorage.getItem('yw_user_loginToken')||'';
        this.isApp=$.getParam(location.href,'isapp');
        this.channelInviteValue=$.getParam(location.href,'i')||'ywlc';
        window.customEvent( 3, '22.22.22', '母亲节首页可见'  ); //埋点
        $.statistics('motherDayActivity');
        this.getData();

    },
    getData:function(){
        var self=this;
        this.cache={
            isApp:this.isApp,
            isLogin:this.token,
            investAmt:0,
            inviteNum:0
        };
        if(this.token){
            $.sync({
                url:fresh.apiRoot+'rightGive/getInvestInfo',
                type:'post',
                data:{
                    loginToken:this.token
                },
                success:function(d){
                    self.cache.investAmt=d.investAmt;
                    self.cache.inviteNum=d.inviteNum;
                    self.render();
                },
                error:function(d){
                    // console.log(d.msg);
                    self.render()
                }
            })
        }else{
            self.render();
        }
    },
    render: function () {
        this.$el.html(template());
        this._initEvent();
        return this;
    },
    _initEvent:function(){
        var Status=require('./status/status');
        new Status({el:this.$el.find('.top-status-box'),cache:this.cache});

        var GiftList=require('./giftList/giftList');
        new GiftList({el:this.$el.find('.gift-list'),cache:this.cache});
    }
});