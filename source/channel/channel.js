var template = _.template(require('./channel.html'));
require('./channel.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type=options.type;
        $.setWeixinTitle('正在识别，请稍等...');
        this.getData();
    },
    getData:function(){
        var self = this;
        var param=$.getParam(location.href,'p');
        localStorage.removeItem('yw_user_isSetTradersPwd');
        localStorage.removeItem('yw_user_bankCardNo');
        localStorage.removeItem('yw_user_finishedStep');

        $.ajax({
            url:fresh.apiRoot+'channel/authUser',
            type:'post',
            data:{
                p:param
            },
            success:function(d){
                if(d.status==0){
                    d=d.data;
                    if(!d.channelCode){
                        if(d.isMatchID==0){
                            self._notMatch('信息不匹配','您的手机号在 米付 和 摇旺 绑定的身份证号码不一致，请联系客服处理： <span class="red">400-049-9188</span>');
                            return false;
                        }
                        window.location='/weizhan/#app/download';
                        return false;
                    }
                    if(d.isMatchID==0){
                        self._notMatch('信息不匹配','您的手机号在 米付 和 摇旺 绑定的身份证号码不一致，请联系客服处理： <span class="red">400-049-9188</span>');
                        return false;
                    }

                    // $.setLogin(true);
                    // $.setToken(d.loginToken);
                    // $.changePage('product');

                    window.curUserID=d.phoneNum;
                    $.setNub(d.phoneNum);
                    $.setCache('channelCode',d.channelCode);
                    $.setToken(d.loginToken);
                    localStorage.yw_user_realName = d.realName;
                    localStorage.yw_user_idCard = d.idcard;
                    localStorage.yw_user_bankCardNo = d.bankCard;
                    localStorage.yw_user_bankName = d.bankName;
                    localStorage.yw_user_isSetTradersPwd = d.isSetTradersPwd;
                    localStorage.yw_user_tyj = d.tyj;
                    $.setLogin(true);
                    $.changePage('product');

                    // $.sync({
                    //     url: fresh.apiRoot+'member/login',
                    //     type: 'post',
                    //     data: {
                    //         phoneNum: d.mobile,
                    //         loginpwd:d.loginPwd,
                    //         type:'1'
                    //     },
                    //     success: function(d){
                    //
                    //         $.setToken(d.loginToken);
                    //         localStorage.yw_user_realName = d.realName;
                    //         localStorage.yw_user_idCard = d.idcard;
                    //         localStorage.yw_user_bankCardNo = d.bankCard;
                    //         localStorage.yw_user_bankName = d.bankName;
                    //         localStorage.yw_user_isSetTradersPwd = d.isSetTradersPwd;
                    //         localStorage.yw_user_tyj = d.tyj;
                    //         $.setLogin(true);
                    //         $.changePage('product');
                    //     }
                    // })
                }else{
                    // $.toast(d.msg)
                    self._notMatch('参数错误','请联系客服处理~ 客服电话<span class="red">400-049-9188</span>');
                }
            },
            error:function(){
                self._notMatch('网络提示','对不起，网络联系失败，请重试…');
            }
        })
    },
    _notMatch:function(title,content){
        this.$el.html(template({title:title,content:content}));
    }
});

