var template = _.template(require('./status.html'));
require('./status.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.cache=options.cache;
        this.render();
    },
    render: function () {
        this.$el.html(template(this.cache));
        return this;
    },
    events: {
        'tap .go-product-btn': 'goProduct',
        'tap .go-invite-btn': 'invite',
        'tap .my-value,.my-invite': 'showTip',
        'tap .share': 'share',
        // 'tap .mask': 'hideMask',
        'tap .login-btn': 'login',
        'tap .myinvestval':'myinvestval',
        'tap .myinviteval':'myinviteval'
    },
    share:function(){
        if(this.cache.isLogin){
           jsb.share();
       }else{
           $.login();
       }
   },
    // hideMask:function(){
    //     this.$el.find('.mask').hide();
    // },
    goProduct:function(){
        if(this.cache.isApp){
            window.location='/weizhan/product/productClassifyList';
        }else{          
            window.location='/weizhan/#product';
        }
    },
    invite:function(){
        this.share();
        // if(this.cache.isApp){
        //     window.location='/weizhan/member/inviteFriends';
        // }else{
        //     window.location='/weizhan/member/inviteFriends?loginToken='+this.cache.isLogin;
        // }
    },
    login:function(){
       $.login();
   },
   showTip:function(e){
    var obj=$(e.currentTarget).find('.tip-txt');
    obj.show();
    setTimeout(function(){
        obj.hide();
    },5000);
},
myinvestval:function(){
    var self=this;
    $.popWindow({
        title:'投资值',
        content:'<p class="popcontent">活动期间每投资<span>年化金额1元</span><br/>增加<span>1个投资值</span><br/>年化金额计算方式：所投金额X投资产品期限/360</p>',
        yes:'我知道了',
        type:2
    })
},
myinviteval:function(){
    var self=this;
    $.popWindow({
        title:'邀请值',
        content:'<p class="popcontent">活动期间每邀请1个新投资用户<br/>增加1个邀请值<span><br/>(新用户需投资90天及以上产品≥1000元)</span></p>',
        yes:'我知道了',
        type:2
    })
}
});