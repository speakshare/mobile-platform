/**
 * Created by chenguodong on 2017/3/3.
 */
var template = _.template(require('./tradePwdManager.html'));
require('./tradePwdManager.css');

module.exports = Backbone.View.extend({
    initialize:function(){
        this.getData();
    },
    getData:function(){
        var self = this;
        $.sync({
            url:fresh.apiRoot + 'member/selectTradePwd',
            type:'post',
            success:function(d){
                if(d.isTrue == 1){
                    self.render();
                }else{
                    $.popWindow({
                        content:'您还未设置交易密码，请先设置交易密码！',
                        yes:'确定',
                        no:'取消',
                        type:2,
                        callback:function(bl){
                            if(bl){
                                $.changePage('payment/userSetPayPass');
                            }else{
                                history.back();
                            }
                        }
                    })
                }
            }
        })
    },
    render:function(){
        this.$el.html(template());
        $.setAppNav('交易密码管理');
        return this;
    },
    events:{
        'tap #toUpdateTra':'toUpdateTra',
        'tap #forgetPay':'forgetPay'
    },
    toUpdateTra:function(){
        $.changePage('uc/setting/changePayPwd')
    },
    forgetPay:function(){
        $.changePage('uc/setting/forgetPayPwd')
    }
});