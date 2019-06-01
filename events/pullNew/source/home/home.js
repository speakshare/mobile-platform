var template = _.template(require('./home.html'));
var reg = _.template(require('./reg.html'));
var download = _.template(require('./download.html'));
require('./home.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        this.getData();
    },
    getData: function () {
        var self = this;
        $.sync({
            url: fresh.apiRoot + 'platformData/queryPlatformData',
            type: 'post',
            success: function (d) {
                self.cache = d;
                var amount = Number((d.investmentAmount.replace(/,/g, '') * 1 / 100000000).toFixed(2));
                amount = Math.floor(amount);
                self.cache.amounts = amount;
                self.render();
                $('body').append(download);
                $('.ux-shutdown').on('tap', function () {
                    $('.ux-fixed-box').hide();
                });
                $('.btn-download').on('tap', function () {
                    window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.zb.yaowang';
                })
            }
        })

    },
    render: function () {
        this.$el.html(template(this.cache));
        $.setWeixinTitle('Home');
        return this;
    },
    events: {
        'tap .ux-sign-up': 'goSignUp',
        'tap .ux-register': 'goRegister',
        'tap .ux-fix-img': 'getCaptcha',
        'tap .ux-link-sign-in': 'goSignIn',
        'tap .ux-link-pc': 'goPcSite'
    },
    goSignUp: function () {

        var self = this;
        var $mobile = $('#J_mobile');
        var mobile = $mobile.val().trim();
        if (!$.isMobileNum(mobile)) {
            $.toast('请输入正确的手机号码');
            return false;
        }
        $.sync({
            url: fresh.apiRoot + 'member/registerSelect',
            type: 'post',
            data: {
                phoneNum: mobile
            },
            success: function (d) {
                self.cache = d;
                if (d.userId != -1) {
                    $.popWindow({
                        content: '手机号已注册，请直接登录',
                        yes: '直接登录',
                        no: '换个号',
                        type: 2,
                        tapMask: true,
                        callback: function (b) {
                            if (b) {
                                localStorage.setItem('yw_user_after_login_link', '/weizhan/#home');
                                window.location.href = '/weizhan/#login?mobile='+mobile;
                            } else {
                                $mobile.val('');
                            }
                        }
                    });
                } else {
                    $.sync({
                        url: fresh.apiRoot + 'member/getCaptcha',
                        type: 'post',
                        success: function (d) {
                            self.cache = d;
                            self.$el.find('#J_fixSignUp').hide();
                            self.$el.find('#J_section').html(reg);
                            self.$el.find('#J_captcha').attr('src', 'data:image/png;base64,' + d.captcha);
                            self.$el.find('#J_getVerifyCode').on('click', function () {
                                self.getVerifyCode();
                            });
                        }
                    })
                }
            }
        })
    },

    getCaptcha: function () {
        var self = this;
        $.sync({
            url: fresh.apiRoot + 'member/getCaptcha',
            type: 'post',
            success: function (d) {
                self.cache = d;
                $("#J_captcha").attr('src', 'data:image/png;base64,' + d.captcha);
            }
        })
    },
    getVerifyCode: function () {
        var self = this;
        var mobile = $('#J_mobile').val();
        var captcha = $("#J_captchaVal").val();
        var captCode = self.cache.captCode;
        if (!$.isMobileNum(mobile)) {
            $.toast('请输入正确的手机号码');
            return false;
        }
        if (captcha.length < 4) {
            $.toast('请输入正确图形验证码');
            $("#J_captcha").val();
            self.getCaptcha();
            return false;
        }

        $.sendSMS({
            obj: $('#J_getVerifyCode'),
            mobile: mobile,
            captcha: captcha,
            captCode: captCode,
            tipObj: $('.ux-form').find('.send-sms-tip'),
            captInputBox: $("#J_captcha")
        });
    },
    goRegister: function () {
        var self = this;
        var mobile = $('#J_mobile').val();
        var captcha = $('#J_captchaVal').val();
        var verify = $('#J_verifyCode').val();
        var password = $('#J_password').val();
        if (!$.isMobileNum(mobile)) {
            $.toast('请输入正确的手机号码');
            return false;
        }
        if (captcha.length < 4) {
            $.toast('请输入图形码');
            return false;
        }
        if (verify.length < 4) {
            $.toast('请输入短信验证码');
            return false;
        }
        if (!$.isPassword(password) || password.length < 6) {
            $.toast('密码为6位以上字母数字组合');
            return false;
        }

        $.sync({
            url: fresh.apiRoot + 'member/register',
            type: 'post',
            data: {
                phoneNum: mobile,
                captcha: captcha,
                verifCode: verify,
                loginpwd: password,
                inviteValue: '',
                appId: '',
                channelInviteValue: '',
                openid: ''
            },
            success: function (d) {
                $.setCache('yw_user-id', d.userId);
                window.curUserID = parseInt(mobile);
                $.setNub(mobile);
                localStorage.yw_user_realName = '';
                localStorage.yw_user_idCard = '';
                localStorage.yw_user_bankCardNo = '';
                localStorage.yw_user_bankName = '';
                localStorage.yw_user_isSetTradersPwd = '';
                localStorage.yw_user_tyj = '';
                localStorage.yw_user_isAuthed = '';
                localStorage.setItem('userID', d.uFlag);
                $.setLogin(true);
                $.setToken(d.loginToken);
                window.location.href = '/weizhan/#newshake';
            },
            error: function (d) {
                $.toast(d.msg);
            }
        })
    },
    goSignIn: function () {
        localStorage.setItem('yw_user_after_login_link', '/weizhan/#home');
        window.location.href = '/weizhan/#login';
        return false;
    },
    goPcSite: function () {
        window.location.href = 'http://www.91yaowang.com/';
    }
});