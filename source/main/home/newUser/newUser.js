var template = _.template(require('./newUser.html'));
require('./newUser.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.cache=options.cache;
        this.render();
    },
    render:function (){
        var rewardType={
            1:'返现券',
            2:'加息券',
            3:'现金红包',
            4:'代金券'
        };
        $.each(this.cache.homePage.rewardList,function(i,n){
            n.rewardTxt=rewardType[n.ruleType];
        });
        if(this.cache.homePage.rewardList.length>3)
            this.cache.homePage.rewardList.length=3;
        
        this.$el.html(template(this.cache));
        this.$el.find('.over-slider .animate').overSlide();
        return this;
    },
    events:{
        'tap .login-btn':'login',
        'tap .top-banner .b-left':'securityGuarantee',
        'tap .top-banner .b-right':'securityGuarantee',
        'tap .event-box li':'changePage',
        'tap .weal-1':'productDetail',
        'tap .weal-2':'newshake',
        'tap .weal-3':'newUser',
        'tap .weal-btn':'buyProduct'
    },
    login:function(){
        $.login();
    },
    calendar:function(){
        $.changePage('uc/calendar')
    },
    securityGuarantee: function(){
        $.changePage('staticPage/securityGuarantee');
    },
    changePage:function(e){
        var link=$(e.currentTarget).attr('data-link');
        if(link){
            window.location=link;
        }
    },
    newUser:function(){
        if(this.cache.isLogin!=1) {
            $.register();
        }
    },
    newshake:function(){
        if(this.cache.isLogin!=1){
            $.register();
            return false;
        }
        if(this.cache.homePage.experienceAmtFlag!=1){
            if(this.cache.homePage.experienceAmt<=0){
                $.changePage('newshake');
            }else{
                $.changePage('product/'+this.cache.homePage.list[0].productNo);
            }
        }
    },
    buyProduct:function(e){
        var p=this.cache.homePage.list[0];
        if(!$(e.currentTarget).hasClass('disabled')){
            if(this.cache.isLogin!=1){
                $.register();
            }else if(this.cache.homePage.experienceAmt<=0){
                $.changePage('newshake');
            }else{
                $.changePage('product/'+p.productNo);
            }
        }
        return false;
    },
    productDetail:function(){
        var p=this.cache.homePage.list[0];
        $.changePage('product/'+p.productNo);
    }
});