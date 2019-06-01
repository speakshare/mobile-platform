var template = _.template(require('./detail.html')),
    pdDesc = _.template(require('./html/pd-desc.html')),
    pdProjectInfo = _.template(require('./html/pd-project-info.html')),
    pdSafe = _.template(require('./html/pd-safe.html')),
    pdActionBtn = _.template(require('./html/action-btn.html')),
    pdInfoBox = require('./pdInfoBox/info-box'),
    pdInfoList = require('./pdInfoList/info-list'),
    DetailBanner = require('./banner/banner');


require('./detail.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type=options.type;
        this.pid=options.pid;
        this.getData();
    },
    getData:function(pid){
        var self = this;
        this.cache={};
        $.batSync({
            data:[
                {url:fresh.apiRoot + 'productInfo',data:{productNo:this.pid, type:1}},
                {url:fresh.apiRoot + 'member/selectTyj'},
                {url:fresh.apiRoot +'member/queryBankCodeList'},
                {url:fresh.apiRoot +'activity/queryPrdDetailAdImg'},
                {url:fresh.apiRoot +'projectDetails',data:{productNo:this.pid}}
            ],
            type:'post',
            success:function(d){
                console.log(d);
                self.cache.pd=d[0];
                console.log(self.cache.pd);
                self.cache.tyj=d[1] && d[1].tyj||0;
                self.cache.bankList=d[2]||[];
                self.cache.ads=d[3]||[];
                self.cache.pro=d[4] || [];
                console.log(self.cache.pro);
                //交易所模式按钮状态
                if(self.cache.pd){
                    var sysDate = $.dateFormat(self.cache.pd.sysDate, 'yyyy-MM-dd');
                    var raiseDate = $.dateFormat(self.cache.pd.mujiEndtime, 'yyyy-MM-dd');
                    if ((new Date(sysDate).getTime()) - (new Date(raiseDate).getTime()) > 0) {
                        self.cache.pd.isOver = 1;
                    } else {
                        self.cache.pd.isOver = 0;
                    }
                }
                self.render();
            }
        });
    },
    render:function (){
       if(!this.cache.pd){
           $.toast('暂时进入不了，请选择其它产品');
            $.changePage('product');
            return;
        }
        
        this.$el.html(template());
        
        window.customEvent( 3, '1.8.3', this.pid);
        $.setAppNav('产品详情');
        new pdInfoBox({el:this.$el.find('.pd-info-box'),cache:this.cache});
        new DetailBanner({el:this.$el.find('.detail-banner-box'),cache:this.cache});
        new pdInfoList({el:this.$el.find('.pd-info-list'),cache:this.cache});

        this.$el.find('.pd-infos').eq(0).html(pdDesc(this.cache));
        this.$el.find('.pd-infos').eq(1).html(pdProjectInfo(this.cache));
        this.$el.find('.pd-infos').eq(2).html(pdSafe(this.cache));
        var level={
            1:'普通',
            2:'白银',
            3:'黄金',
            4:'铂金',
            5:'钻石'
        }
        this.cache.pd.minMemberLevel && (this.cache.pd.levelName=level[this.cache.pd.minMemberLevel])
        this.$el.find('.action-btn-box').html(pdActionBtn(this.cache.pd));
        
        this.countdown($(".timer"));
        this._setShareInfo();
        return this;
    },
    _setShareInfo: function () {
        jsb.setShareInfo({
            title: '给你推荐摇旺这款热门理财产品',
            desc: this.cache.pd.surplusDay + '天期限，' + this.cache.pd.annualizedRate + '%年化收益率，稳健理财好收益，旋转！跳跃！根本停不下来',
            icon: $.getStaticOrgin() + '/yaowang/dist/globalImg/logo.png',
            link: location.href
        });
    },
    countdown:function(classobj){
        $.each(classobj,function(){
            var endtime= classobj.attr("data-time");
            var t_endtime = endtime;

            var t_day = 60 * 60 * 24;
            var t_hour = 60 * 60;
            var t_min = 60;

            var tt = (endtime - new Date().getTime())/1000;
            if(tt>3600 || tt<0){
                return;
            }

            var aa=setInterval(function () {
                var t_currenttime = new Date().getTime();
                var t_result = t_endtime - t_currenttime;
                if(t_result<=0){
                    clearInterval(aa);
                    location.reload();
                    return false;
                }

                var t_time = Math.floor( t_result / 1000 );
                var t_result_day = Math.floor( t_time / t_day );
                var t_result_hour = Math.floor( t_time % t_day / t_hour);
                var t_result_min = Math.floor(t_time % t_day % t_hour/ t_min);
                var t_result_sec = Math.floor( t_time % t_day % t_hour % t_min);

                if ( t_result_min < 10) {
                    t_result_min = "0" + t_result_min;
                }
                if ( t_result_sec < 10) {
                    t_result_sec = "0" + t_result_sec;
                }
                classobj.find(".min").html(t_result_min+' :');
                classobj.find(".sec").html(t_result_sec);
            }, 1000);
        })
    },
    events:{
        'tap .pd-tab-li':'tabEvent',
        'tap .btn':'purchase',
        'tap .law':'redirectLaw',
        'tap .fixed-more': 'openProList',
        'tap .ux-shutdown': 'shutDownBox'
    },
    tabEvent:function(e){
        var self = $(e.currentTarget),
            index=parseInt(self.attr('data-idx'));
        self.addClass('active').siblings().removeClass('active');
        this.$el.find(".tabline").animate({'margin-left':100/3*index+'%'});
        this.$el.find('.pd-infos').eq(index).show().siblings().hide();

        window.customEvent( 2, '1.8.3.'+(index+1), '' );
        $('body').animate({scrollTop:self.offset().top}, 300);
    },
    redirectLaw:function(){
        var sort = this.cache.pd.tradeType;
        $.changePage("staticPage/legalDoc?sort="+sort);
    },
    invitePage:function(){
        // window.location = '/weizhan/member/inviteFriends?loginToken='+$.getToken();
          $.changePage('uc/invite');
    },
    changePage:function(e){
        window.location = $(e.currentTarget).attr('data-link');
    },
    purchase:function(){

        window.customEvent(2, '1.8.7', '点击立即购买');

        var self=this;
        if (self.cache.pd.investPercent==100) return;
        if ($('.btn').attr('disabled')) return;
        if($('.btn').attr('data-flag')){
            $.toast('每天23:40~06:00为系统维护时间，不能进行购买和提取活期资金操作！');
            return false;
        }
        //渠道客户
        if($.getCache('channelCode')){
            if($.getCache('channelAuth')){
                this._gobuy();
            }else{
                this.$el.append('<div class="channel-auth-wrap"></div>');
                var channelAuth=require('../../../common/channel-auth/channel-auth');
                new channelAuth({el:this.$el.find('.channel-auth-wrap'),
                    callback:function(){
                        $.setCache('channelAuth',1,30*24*60*60);
                        self._gobuy();
                    }
                })
            }
            return false;
        }

        if ($.getToken()) {
            // 要先判断一下 是否还可以再摇 '体验金'
            $.canExperienceFund( function(){
                self._gobuy();
            }, this.pid); // 1:表明是从购买页面过来
            
        }else{
            $.popWindow({
                content:'您还未登录，请先去登录',
                type:2,
                yes:'立即登录',
                no:'取消',
                callback:function(bl){
                    if(bl){
                        $.login();
                    }
                }
            });
        }
    },
    _gobuy:function(){
        var self = this,
            tel = $.getNub();
        $.sync({
            url: fresh.apiRoot +  'member/queryUserFlowStatus',
            type: 'post',
            data: {phoneNum: tel},
            success:function(d){
                if(d.registerShakeFlag == '0'){
                    self.popWindow('您还未新手摇，请先去新手摇','确定','newshake')
                }else if(d.realNameVerifyFlag == '0'){
                    self.popWindow('您还未实名认证，请先去实名认证','立即认证','payment/userAuthentication')
                }else if(d.bindCardFlag == '0'){
                    self.popWindow('您还未绑定银行卡，请先去绑定银行卡','立即绑定','payment/userTiedCard')
                }else if(d.setTradePwdFlag == '0'){
                    self.popWindow('您还未设置交易密码，请先去设置','立即设置','payment/userSetPayPass')
                }else{
                    $.changePage("/product/" +  self.pid + "/checkout/");
                }
            },error:function(d){
                $.toast(d.msg)
            }
        });
    },
    popWindow:function(content,yes,url){
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
    openProList: function(){
        var $win= $(window);
        var width = $win.width() * 0.85;
        var height = $win.height() * 0.85;
        this.$el.find('.fixed-pop').show();
        this.$el.find('.ui-pro-list').width(width).height(height);
    },
    shutDownBox: function(){
        this.$el.find('.fixed-pop').hide();
    }
});