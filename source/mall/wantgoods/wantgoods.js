/**
 * Created by lifeng on 2017/6/19 0019.
 */
var template = _.template(require('./wantgoods.html'));
require('./wantgoods.css');
var MobileSelect = require('../../../component/mobileselect/mobileSelect');
// var frontBackCodeMap={0:3,1:0,2:1}
module.exports = Backbone.View.extend({
    initialize: function () {
        $.setLoginTokenFormApp();
        this.how = "";
        this.goodsName = "";
        this.goodsUrl = ""
        this.render();
        $.sync({
            url: fresh.apiRoot + 'verifCode/verifLogin',
            type: 'post',
            success: function () {
            },
            error: function () {
                $.popWindow({
                    content: '<p class="oneline-tips">抱歉，请您登录后再提交信息</p>',
                    type: 2,
                    yes: '去登录',
                    callback: function (bl) {
                        if (bl) {
                            jsb.login();
                        }
                    }
                });
            }
        });
    },
    events: {
        'input #want-name': 'checkName',
        'input #want-url': 'checkUrl',
        'tap .ux-button': 'submit'
    },

    checkUrl: function () {
        var url = $("#want-url").val().trim();
        if (/^((http|https):\/\/)?([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(:\d+)?(\/[-\w#?=&.]+)+/i.test(url)) {
            this.goodsUrl = url;
        } else {
            this.goodsUrl = "";
        }
        this.setBtnStatus();
    },
    checkName: function (e) {
        var name = $("#want-name").val().trim();
        this.goodsName = name;
        this.setBtnStatus();

    },
    submit: function () {
        if(!$.getLogin()){
            $.popWindow({
                content: '<p class="oneline-tips">抱歉，请您登录后再提交信息</p>',
                type: 2,
                yes: '去登录',
                callback: function (bl) {
                    if (bl) {
                        jsb.login();
                    }
                }
            });
            return ;
        }
            var data = {getFrom: this.how};
            if (this.goodsName != "") {
                data.businessName = this.goodsName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            }
            if (this.goodsUrl != "") {
                data.businessLink = this.goodsUrl.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            }
            $.sync({
                url: fresh.apiRoot + 'member/getUserDesire',
                type: 'post',
                data: data,
                success: function (d) {
                    $.popWindow({
                        content: '<p class="oneline-tips">提交成功</p>',
                        type: 2,
                        yes: '知道了'
                    });
                }, error: function (d) {
                    if(d.status==14||d.status==-1){
                        return ;
                    }
                    $.popWindow({
                        content: '<p class="oneline-tips">' + d.msg + '</p>',
                        type: 2,
                        yes: '知道了'
                    });
                }
            });
    },
    setBtnStatus: function () {
        $('.form-btn').removeClass('ux-button');
        if (this.how != "") {
            if (this.goodsName != "" || this.goodsUrl != "") {
                $('.form-btn').addClass('ux-button');
                return true;
            }
        }
        return false;
    },
    render: function () {
        var _this = this;
        $.setAppNav('我想要');
        var self = this;
        this.$el.html(template());
        new MobileSelect({
            trigger: '#want-way',
            el: 'want-list',
            callback: function (indexArr, data) {

                _this.how = parseInt(indexArr) + 1;
                _this.setBtnStatus();
                var notes = ['*去旺家直接用旺豆兑换',
                    '*如0元白拿活动：投资+邀请好友，满足条件可兑换商品',
                    '*如1旺豆兑好礼：投资获得1旺豆兑换权益，在旺家兑换指定商品'];
                $('.want-way-note').html(notes[indexArr]);
                $('.select-trigger').addClass("selected")
            },
            comfirmTxt: '完成',
            cancelTxt: '取消',
            wheels: [
                {data: ['旺豆兑换', '参加投资+邀请活动获得', '参加投资满额活动获得']}
            ],
            position: [0] //Initialize positioning
        });
        return this;
    }
});