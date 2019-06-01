var template = _.template(require('./home.html'));
require('./home.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        this.getData();
    },
    getData:function(){
        var self=this;
        // var platform = $.isWeixin() ? 4 : 3;
        this.cache={
            isLogin:false,
            zc:{},
            level:{},
            vip:{}
        };
        $.checkUser(1,function(bl){
            if(!bl){
                $.sync({
                    url:fresh.apiRoot+'member/myPageInfo',
                    type:'post',
                    success:function(d){
                        self.cache.zc={
                            assetsBanners:d.assetsBanners
                        };
                        self.render();
                    },
                    error:function(){

                    }
                });
            }else{
                $.batSync({
                    data:[
                        {url:fresh.apiRoot+'member/queryCustomerAllMoneyInfo4Fund'},
                        {url:fresh.apiRoot+'hytx/level'},
                        {url:fresh.apiRoot+'member/myPageInfo'}
                    ],
                    success:function(d){
                        console.log(d);
                        self.cache.isLogin=true;
                        self.cache.zc=d[0];
                        self.cache.level=d[1];
                        self.cache.vip=d[2];
                        self.render();
                    }
                });
            }
        })

    },
    render:function(){
        // this.cache.tyj=100;
        this.cache.showInviteTip=$.getCache('ucInviteTap',1);
        this.$el.html(template(this.cache));
        this._showHomeTip();

        new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            freeMode: 'free',
            freeModeMomentum:false,
            freeModeMomentumBounce:false,
            slidesPerView: '2.6',
            slidesOffsetBefore:10,
            slidesOffsetAfter:10,
            spaceBetween: 10
        });
        $.setAppNav('我的资产');
        this._cacheAssetTxt();
        return this;
    },
    _cacheAssetTxt:function(){
        var self=this;
        this.cacheAssetTxt=[];
        this.$el.find('.assetTxt').each(function(i,n){
            self.cacheAssetTxt.push(n.innerHTML);
        })
    },
    _showCacheAsset:function(){
        var self=this;
        this.$el.find('.assetTxt').each(function(i,n){
            n.innerHTML=self.cacheAssetTxt[i];
        })
    },
    _showHomeTip:function(){
        if(!$.getCache('ucHomeTip',1)){
            this.$el.find('.tip-div1').show();
        }else{
            $.downloadApp();
        }
    },
    _showTip:function(){
        $.popWindow({
            content:'<div style="text-align:left;text-indent:2em">尊敬的用户，感谢您的关注。该功能需下载摇旺理财app方可使用哦，另有更多奖励和惊喜等您来发现！</div>',
            yes:'确定',
            type:2
        });
    },
    _changePage:function(url,bl){
        if($.getCache('channelCode') && !bl){
            this._showTip();
        }else if(this.cache.isLogin){
            $.changePage(url);
        }else{
            $.login('#'+url);
        }
    },
    _checkFinishedStep:function(url){
        var self = this,
            tel = $.getNub();
        if(!this.cache.isLogin){
            $.login();
            return false;
        }
        $.sync({
            url: fresh.apiRoot +  'member/queryUserFlowStatus',
            type: 'post',
            data: {phoneNum: tel},
            success:function(d){
                if(d.realNameVerifyFlag == '0'){
                    self._popWindow('您还未实名认证，请先去实名认证','立即认证','payment/userAuthentication')
                }else if(d.bindCardFlag == '0'){
                    self._popWindow('您还未绑定银行卡，请先去绑定银行卡','立即绑定','payment/userTiedCard')
                }else if(d.setTradePwdFlag == '0'){
                    self._popWindow('您还未设置交易密码','请先去设置交易密码','payment/userSetPayPass')
                }else{
                    $.changePage(url);
                }
            },error:function(d){
                $.toast(d.msg)
            }
        });
    },
    _popWindow:function(content,yes,url){
        $.popWindow({
            content:content,
            type:2,
            yes:yes,
            no:'取消',
            callback:function(bl){
                if(bl){
                    $.changePage(url)
                }
            }
        });
    },
    events:{
        'tap .login-btn':'login',
        'tap .uc-username':'myInfo',
        'tap .uc-msg':'newsCenter',
        'tap .recharge-btn':'recharge',
        'tap .withdrawals-btn':'withdrawals',
        'tap .all-asset':'asset',
        'tap .uc-asset-tip':'accountInsurance',
        'tap .asset-profit2':'profit',
        'tap .asset-actions .arrow-right':'changePage',
        'tap .asset-col':'changePage2',
        'tap .tip-div1':'showNextTip',
        'tap .tip-div2':'showNextTip2',
        'tap .tip-div3':'closeTip',
        'tap .asset-title':'hideAsset',
        'touchmove ':'scroll'
    },
    hideAsset:function(){
        var obj=this.$el.find('.asset-title');
        if(!obj.hasClass('asset-title-hidden')){
            this.$el.find('.assetTxt').html('****');
            obj.addClass('asset-title-hidden')
        }else{
            this._showCacheAsset();
            obj.removeClass('asset-title-hidden');
        }
        return false;
    },
    showNextTip:function(){
        this.$el.find('.tip-div1').hide();
        this.$el.find('.tip-div2').show();
    },
    showNextTip2:function(){
        this.$el.find('.tip-div2').hide();
        this.$el.find('.tip-div3').show();
    },
    closeTip:function(){
        this.$el.find('.tip-div3').hide();
        $.setCache('ucHomeTip',1,365*86000,1);
    },
    scroll:function(){
        var self=this;
        clearTimeout(this.timeOut);
        this.timeOut=setTimeout(function(){
            var st=$('body').scrollTop();
            if(st>30){
                self.$el.find('.uc-home').addClass('uc-top-fixed');
            }else{
                self.$el.find('.uc-home').removeClass('uc-top-fixed');
            }
        },60)

    },
    login:function(){
        $.login();
    },
    changePage:function(e){
        var obj=$(e.currentTarget),
            id=obj.attr('data-id'),
            link=obj.attr('data-link');
        if(link=='uc/invite'){
            $.setCache('ucInviteTap',1,365*86400,1);
        }
        this._changePage(link,!id);
    },
    changePage2:function(e){
        var obj=$(e.currentTarget),
            type=obj.attr('data-type');
        var typeValue={
            1:'uc/orders',
            2:'yaobao',
            3:'fund'
        };
        if(this.cache.isLogin){
            $.changePage(typeValue[type])
        }else{
            $.login('#'+typeValue[type])
        }
    },
    myInfo:function(){
        this._changePage('uc/myInfo',1);
    },
    newsCenter:function(){
        this._changePage('uc/newsCenter');
    },
    withdrawals:function(){
        this._checkFinishedStep('payment/withdrawals');
    },
    recharge:function(){
        this._checkFinishedStep('payment/recharge');
    },
    profit:function(){
        this._changePage('uc/profit');
    },
    asset:function(){
        this._changePage('uc/asset');
    },
    accountInsurance:function(){
        $.changePage('uc/accountInsurance');
    }
});