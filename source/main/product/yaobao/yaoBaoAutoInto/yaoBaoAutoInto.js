/**
 * Created by chenguodong on 2017/5/4.
 */
var template = _.template(require('./yaoBaoAutoInto.html'));
require('./yaoBaoAutoInto.css');

module.exports = Backbone.View.extend({
    initialize:function(){
        this.getData();
    },
    getData:function(){
        var self = this;
        $.checkUser(function(){
            $.sync({
               url:fresh.apiRoot+'member/shakeRollOut',
                type:'post',
                data:{isTurn:'0'},
                success:function (d) {
                    self.cache = d;
                    self.render();
                    if(d.isTurn == '0'){
                        $('.tab-box').removeClass('off');
                        $('.roll').animate({'margin-left':'0'},500);
                        $('.yaoBao-auto-word').html('已关闭: 开启后账户余额将在每日凌晨自动转入摇宝')
                    }else{
                        $('.tab-box').addClass('off');
                        $('.roll').animate({'margin-left':'16px'},500);
                        $('.yaoBao-auto-word').html('已开启: 账户余额将在每日凌晨自动转入摇宝')
                    }
                    console.log(d)
                }
            });
        });
    },
    render:function(){
        this.$el.html(template(this.cache));
        $.setAppNav('余额自动转入摇宝');
        return this;
    },
    events:{
        'tap .tab-box':'tabBox',
        'tap .agr':'disAgr',
        'tap .auto-agr':'autoAgr'
    },
    disAgr:function(e){
        var self = $(e.target);
        self.toggleClass('no-agr');
    },
    tabBox:function(e){
        var that = this,
            self  = $(e.currentTarget),
            pos = $('.roll'),
            pangHas = self.hasClass('off'),
            noAgr = $('.agr').hasClass('no-agr');
        if(pangHas){
            $.popWindow({
                content: '确定要关闭摇宝自动转入功能吗?',
                type: 2,
                yes: '关闭',
                no: '取消',
                callback: function (bl) {
                    if(bl){
                        self.toggleClass('off');
                        that.offTabBox();
                        pos.animate({'margin-left':'0'},500);
                        $('.yaoBao-auto-word').html('已关闭: 开启后账户余额将在每日凌晨自动转入摇宝')
                    }
                }
            });
        }else{
            if(noAgr){
                $.toast('请阅读并同意《资金自动转入及摇宝代扣服务协议》!');
            }else{
                self.toggleClass('off');
                this.offTabBox();
                pos.animate({'margin-left':'16px'},500);
                $('.yaoBao-auto-word').html('已开启: 账户余额将在每日凌晨自动转入摇宝')
            }
        }
    },
    autoAgr:function(){
        $.changePage('#staticPage/automateAgr')
    },
    offTabBox:function(){
        $.sync({
            url:fresh.apiRoot + 'member/shakeRollOut',
            type:'post',
            data:{isTurn:'1'},
            success:function(d){
                console.log(d)
            },error:function(d){
                $.toast(d.msg)
            }
        });
    }
});