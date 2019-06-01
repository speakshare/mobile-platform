var template = _.template(require('./inviteRecord.html'));
require('../manage.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        $.setLoginTokenFormApp();
        this.type = options.type;
        this.curMonth();
        this.getData();
    },
    curMonth:function(){
        var curMonth = new Date().getMonth() + 1;
        if(curMonth < 10){
            return new Date().getFullYear()+'-0'+(new Date().getMonth()+1)
        }else{
            return new Date().getFullYear()+'-'+(new Date().getMonth()+1)
        }
    },
    getData:function(){
        var self= this;
        $.batSync({
            data:[
                {url:fresh.apiRoot +'inviteTotalAchievement',data:{loginToken:$.getToken(),investDate:self.curMonth()}},
                {url:fresh.apiRoot +'inviteCustomerInvestNotInvestTotalCount',data:{loginToken:$.getToken()}},
                {url:fresh.apiRoot +'member/selectImageUrl',data:{type:'07'}},
                {url:fresh.apiRoot +'inviteLCDSoOrCYProperty',data:{loginToken:$.getToken()}}             
            ],
            success: function(d){
                console.log(d);
                self.cache={
                    amount: d[0],
                    numOfPeople: d[1],
                    banner:d[2],
                    identity:d[3]
                };
                self.render();
            },error:function(d){
                $.toast(d.respMsg);
                self.render();
            }
        })
    },
    render:function (){
        this.$el.html(template(this.cache));
        $.setAppNav('邀请记录');
        new Swiper('.swiper-container-banner', {loop: true,pagination: '.swiper-pagination-banner',autoplay : 3000});
        return this;
    },
    events:{
        'click .grade':'toInvestRecord',
        'tap .customerInfo .title':'allCustomer',
        'tap .hasInvest':'hasInvest',
        'tap .notInvest':'notInvest',
        'touchend .redTips':'tipRed',
        'touchend .cashNumTips':'tipCashNum'
    },
    toInvestRecord:function(){
        localStorage.removeItem("date");
        $.changePage('uc/manage/investRecord');
    },
    allCustomer:function(){
        $.changePage('uc/manage/customerRecord?status=0');
    },
    hasInvest:function(){
        $.changePage('uc/manage/customerRecord?status=1');
    },
    notInvest:function(){
        $.changePage('uc/manage/customerRecord?status=2');
    },
    tipRed:function(e){
        var identity = $(e.currentTarget).attr('data-idf');
        if(identity==1){
            $.popWindow({
                content: '预计红包为本月理财顾问本人投资、理财顾问邀请的客户（一级客户）投资、客户转介绍客户（二级客户）投资的年化金额总和的1.5%，将随次月的薪资一起发放。例如：本月理财顾问本人共投资360天产品10,000元，客户共投资180天产品10,000元，客户转介绍客户共投资90天产品10,000元，则本月理财顾问预计红包为：（10000*360/365+10000*180/365+10000*90/365）*1.5%=258.90职位加成部分则由绩效部门清算，实际金额以绩效部门核对邮件为准',            
                type: 2,            
                yes:'确定',            
                callback:function(){
                    $('.pop_win_wrap').off();
                }
            });
        }else{
            $.popWindow({
                content: '预计红包为本月理财大使本人投资、理财大使邀请的客户（一级客户）投资、客户转介绍客户（二级客户）投资的年化金额总和的1.0%，将于次月中旬发放。例如：本月理财大使本人共投资360天产品10,000元，客户共投资180天产品10,000元，客户转介绍客户共投资90天产品10,000元，则本月理财大使预计红包为：（10000*360/365+10000*180/365+10000*90/365）*1.5%=172.60',            
                type: 2,            
                yes:'确定',            
                callback:function(){
                    $('.pop_win_wrap').off();
                }
            });
        }
    },
    tipCashNum:function(e){
        $.popWindow({
            content: '每一笔定期投资折标金额计算方法为：投资金额*投资产品期限（天）/365。例如：投资“旺财无忧360”产品10,000元，则对应折标金额为：10000*360/365=9863.01折标总额为所有定期投资折标金额总和。',
            type: 2,
            yes:'确定',
            callback:function(){
                $('.pop_win_wrap').off();
            }
        });
    }
});