var template = _.template(require('./cardManage.html'));
require('./cardManage.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        this.getData();
        this.pass = [];
    },
    getData:function(){
        var self=this;

        $.checkUser(function(){
            $.batSync({
                data:[
                    {url:fresh.apiRoot + 'member/queryBankCardList'},
                    {url:fresh.apiRoot + 'fund/user/info',data:{isAutoJudge:'0'}}
                ],
                success:function(d){
                    self.cache = {
                        card:d[0].List[0]||'false',
                        fund:'false'||d[1].content
                    };
                    self.render();
                },error:function(d){
                    $.toast(d.msg,1500)
                }
            });
        });
    },
    render:function(){
        this.$el.html(template(this.cache));
        $.setAppNav('银行卡管理');
        return this;
    },
    events:{
        'click #addCardBank':'addCardBank',
        'tap #bankCardTab':'bankCardTab',
        'click #addFundBank':'addFundBank',
        'tap #unbindCardBank':'unbindCardBank',
        'tap .keyboard-tab td':'getNum',
        'tap #closeKeyBoard,.keyboard-bg':'closeKeyBoard',
        'tap #lookLimit1,#lookLimit2':'lookLimit',
        'tap #forgetPass':'goSetPayPwd'
    },
    lookLimit:function(){
        $.changePage('payment/card/cardLimit')
    },
    bankCardTab:function(e){
        var self = $(e.target);
        var idem = self.attr('data-id');
        self.addClass('tab-state').siblings().removeClass('tab-state');
        if(idem == 1){
            $('#bankCard').show();
            $('#bankFund').hide();
        }else{
            $('#bankCard').hide();
            $('#bankFund').show();
        }
    },
    addCardBank:function(){
        $.changePage('payment/userTiedCard');
        // location.href = location.origin +'/weizhan/pages/member/bindCard?loginToken='+$.getToken();
    },
    addFundBank:function(){
        $.popWindow({
            content:'相关功能目前仅在APP提供<br/>请下载摇旺APP，为您提供更多服务',
            type:2,
            no:'取消',
            yes:'确认',
            callback:function(bl){
                if(bl){
                    $.changePage('app/download');
                }
            }
        })
    },
    unbindCardBank:function(){
        var self = this;
        $.sync({
            url: fresh.apiRoot + 'member/selectTradePwd',
            type: 'post',
            success: function (d) {
                if (d.isTrue == 1) {
                    $.sync({
                        url: fresh.apiRoot + 'member/checkCustomerM',
                        type: 'post',
                        success: function () {
                            self.revealKeyBoard();
                        }, error: function (d) {
                            $.toast(d.msg, 2000);
                        }
                    })
                } else {
                    $.popWindow({
                        content: '您还未设置交易密码，设置后可以解绑！',
                        yes: '立即设置',
                        no: '不解绑了',
                        type: 2,
                        callback: function (bl) {
                            if (bl) {
                                localStorage.setItem('afterSetPayPwd', 'payment/card/cardManage');
                                $.changePage('payment/userSetPayPass');
                            }
                        }
                    })
                }
            },
            error:function(d){
                $.toast(d.msg,2000);
            }
        })
    },
    revealKeyBoard:function(){
        $('.keyboard-bg,.keyboard').show();
        $('.keyboard').animate({bottom:'0'},500);
        var wid = $('#passWord').width()/6;
        $('.password-box span').css('width',wid);
    },
    closeKeyBoard:function(){
        this.pass = [];
        $('#passWord span').html('');
        $('.keyboard').animate({bottom:'-100%'},500,function(){
            $('.keyboard-bg').hide();
        });
    },
    getNum:function(e){
        if(this.pass.length >= 6){
            this.pass = []
        }
        var selfNum = $(e.target).text(),
            math = /[0-9]/i,
            pattern = math.test(selfNum);
        if(pattern){
            this.upPayPwd(selfNum);
        }else if(selfNum == 'x'){
            this.pass = [];
            $('#passWord span').html('');
        }
    },
    upPayPwd:function(num){
        var password = this.pass;
        password.push(num);
        for(var i=0;i<password.length;i++){
            $('#passWord span').eq(i).html('●');
        }
        if(password.length == 6){
            var passwords = password.join('');
            this.closeKeyBoard();
            this.toUnbindCardBank(passwords);
        }
    },
    toUnbindCardBank:function(pass){
        var self = this,
            bindId = self.cache.card.bindId.toString();
        console.log(this.pass,pass,bindId);
        $.sync({
            url:fresh.apiRoot+'member/newUnBindCard',
            type:'post',
            data:{
                bindId:bindId,
                tradePwd:pass
            },
            success:function(){
                location.reload();
                $.toast('<div class="common-suc-icon"><i></i><p>解绑银行卡成功</p></div>',2000);
            },error:function(d){
                $.toast(d.msg,2500)
            }
        });
    },
    goSetPayPwd: function(){
        $.changePage('uc/setting/forgetPayPwd');
    }
});