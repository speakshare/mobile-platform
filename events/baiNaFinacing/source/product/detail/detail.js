var template = _.template(require('./detail.html')),
    pdDesc = _.template(require('./html/pd-desc.html')),
    pdProjectInfo = _.template(require('./html/pd-project-info.html')),
    pdSafe = _.template(require('./html/pd-safe.html')),
    pdInfoBox = require('./pdInfoBox/info-box'),
    pdInfoList = require('./pdInfoList/info-list');

require('./detail.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type=options.type;
        this.pid=options.pid;
        this.getData();
    },
    getData:function(){
        var self = this;
        this.cache={};
        $.batSync({
            data:[
                {url:fresh.apiRoot + 'productInfo',data:{productNo:this.pid, type:1}},
                {url:fresh.apiRoot + 'member/selectTyj'},
                {url:fresh.apiRoot +'member/queryBankCodeList'}
            ],
            type:'post',
            success:function(d){
                console.log(d);
                self.cache.pd=d[0];
                console.log(self.cache.pd);
                self.cache.tyj=d[1] && d[1].tyj||0;
                self.cache.bankList=d[2]||[];
                self.render();
            }
        });
    },
    render:function (){
        this.$el.html(template());
        
        $.setAppNav('产品详情');
        new pdInfoBox({el:this.$el.find('.pd-info-box'),cache:this.cache});
        new pdInfoList({el:this.$el.find('.pd-info-list'),cache:this.cache});

        this.$el.find('.pd-infos').eq(0).html(pdDesc(this.cache));
        this.$el.find('.pd-infos').eq(1).html(pdProjectInfo(this.cache));
        this.$el.find('.pd-infos').eq(2).html(pdSafe(this.cache));
        return this;
    },
    events:{
        'tap .pd-tab-li':'tabEvent',
        'tap .btn':'purchase',
        'tap .law':'redirectLaw'
    },
    tabEvent:function(e){
        var self = $(e.currentTarget),
            index=parseInt(self.attr('data-idx'));
        self.addClass('active').siblings().removeClass('active');
        this.$el.find(".tabline").animate({'margin-left':100/3*index+'%'});
        this.$el.find('.pd-infos').eq(index).show().siblings().hide();
        $('body').animate({scrollTop:self.offset().top}, 300);
    },
    redirectLaw:function(){
        var sort = this.cache.pd.tradeType;
        window.location.href="/weizhan/#staticPage/legalDoc?sort="+sort;
    },
    invitePage:function(){
          $.changePage('uc/invite');
    },
    changePage:function(e){
        window.location = $(e.currentTarget).attr('data-link');
    },
    purchase:function(){
        var self=this;
        if (self.cache.pd.investPercent==100) return;
        if ($('.btn').attr('disabled')) return;
        if($('.btn').attr('data-flag')){
            $.toast('每天23:40~06:00为系统维护时间，不能进行购买和提取活期资金操作！');
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
    }
});