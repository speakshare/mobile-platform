var template = _.template(require('./landingPage.html'));
require('./landingPage.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        $.setLoginTokenFormApp();
        this.getData();
    },
    getData: function () {
        var self = this;
        this.islogin = $.getLogin();
        var inviteCode = $.getParam('code') || '';
        var channelInviteValue = $.getParam('i') || '';
        self.shareurl = location.origin + '/weizhan/#uc/invite/landingPage?' + (inviteCode ? ('code=' + inviteCode) : ('i=' + channelInviteValue));
        if (inviteCode) {
            localStorage.setItem('yw_user_inviteCode', inviteCode);
            localStorage.removeItem('yw_user_channelCode');
            localStorage.removeItem('channelInviteValue');
        }
        if (channelInviteValue) {
            localStorage.setItem('yw_user_channelCode', channelInviteValue);
            localStorage.removeItem('yw_user_inviteCode');
        }
        $.batSync({
            data: [
                {url: fresh.apiRoot + 'activity/queryInviteLandingImg', data: {channelC: channelInviteValue}},
                {url: fresh.apiRoot + 'platformData/queryPlatformData'},
                {url: fresh.apiRoot + 'member/queryCusInfoByInviteValue', data: {inviteValue: inviteCode}}
            ],
            success: function (d) {
                self.cache = {
                    banner: d[0],
                    information: d[1],
                    inviter: d[2] || {customerName: '您的好友'}
                };
                self.render();
            }
        })
    },
    render: function () {
        this.$el.html(template(this.cache));
        $.setAppNav('新手福利');
        this._initEvent();
        return this;
    },
    events: {
        'click #register': 'toRegister'
    },
    _initEvent: function () {
        var self = this;
        jsb.setShareInfo({
            title: '跟我来摇旺赚钱吧，100元代金券、14%新手专享产品和万元体验金等你来拿~', //分享标题
            desc: '不会理财的人不漂亮！', //分享描述
            link: self.shareurl,
            callback: function () {
            }
        });
    },
    toRegister: function () {
        var loginTel = $('.phoneNumber').val();
        if ($.isMobileNum(loginTel)) {
            $.sync({
                url: fresh.apiRoot + 'member/registerSelect',
                type: 'post',
                dataType: 'json',
                data: {
                    phoneNum: loginTel
                },
                success: function (d) {
                    $.setNub(loginTel);
                    if (d.userId == -1) {
                        $.changePage('register/?mobile=' + loginTel, false);
                    } else {
                        $.setafterLogin('#home');
                        $.changePage('login/?mobile=' + loginTel, false);
                    }
                }
            })
        } else {
            $.toast('请输入正确的手机号码');
        }
    }
})