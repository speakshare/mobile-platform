var template = _.template(require('./myInfo.html'));
require('./myInfo.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        this.getData();
    },
    getData:function(){
        var self=this;
        $.checkUser(function(){
            $.batSync({
                data:[
                    {url:fresh.apiRoot+'member/selectRiskControlTypes'},
                    {url:fresh.apiRoot + 'member/queryUserFlowStatus'},
                    {url:fresh.apiRoot+'hytx/level'},
                    {url:fresh.apiRoot+'member/myPageInfo'}
                ],
                success:function(d){
                    self.cache={
                        risk:d[0],
                        state:d[1],
                        level:d[2],
                        name:d[3]
                    };
                    self.render()
                }
            })
        });        
    },
    render:function(){
        var type={
            1:'普通会员',
            2:'白银会员',
            3:'黄金会员',
            4:'铂金会员',
            5:'钻石会员'
        }
        // this.cache.state.realNameVerifyFlag=0;
        // this.cache.state.bindCardFlag=0;

        this.cache.level.type=type[this.cache.level.level];
        this.cache.mobile=localStorage.getItem('yw_user_phoneNum');
        this.cache.realName=localStorage.getItem('yw_user_realName')||'';
        this.cache.idCard=localStorage.getItem('yw_user_idCard')||'';


        this.$el.html(template(this.cache));
        $.setAppNav('个人信息');
        return this;
    },
    events:{
        'tap .vip-level':'vip',
        'tap .bankcard-btn':'bankcard',
        'tap .user-name,.idCard-btn':'authentication',
        'tap .risk-btn':'risk'
    },
    vip:function(){
        $.changePage('member/home');
    },
    bankcard:function(){
        $.changePage('payment/card/cardManage');
    },
    risk:function(){
        if(this.cache.risk.riskCode==0){
            $.changePage('uc/risk/start');
        }else{
            $.changePage('uc/risk/result?resultType='+this.cache.risk.riskCode);
        }
    },
    authentication:function(){
        if(this.cache.state.realNameVerifyFlag==0){
            $.changePage('payment/userAuthentication');
        }
    }
});