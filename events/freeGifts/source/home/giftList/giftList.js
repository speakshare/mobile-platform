var template = _.template(require('./giftList.html'));
var exchange1 = _.template(require('./tip1.html'));
var exchange2 = _.template(require('./tip2.html'));
var exchange3 = _.template(require('./tip3.html'));
require('./giftList.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.cache=options.cache;
        this.getData();
    },
    getData:function(){
        var self=this;
        $.sync({
            url:fresh.apiRoot+'rightGive/goodsList',
            type:'get',
            data:{
                loginToken:this.cache.isLogin
            },
            success:function(d){
                self.pdInfo=d.list;
                self.render();
            },
            error:function(d){
                console.log(d.msg);
                self.render();
            }
        });
    },

    render: function () {
        this.$el.html(template({user:this.cache,pdInfo:this.pdInfo}));
        return this;
    },
    _checkAddress:function(){
        var self=this;
        $.sync({
            url: fresh.apiRoot + 'rightGive/getAddress',
            type: 'post',
            success: function(d){
                $.popWindow({
                    // content:exchange2(''||{memberName:'',telephone:'',address:''}),
                    content:exchange2(d||{consignee:'',mobile:'',address:''}),
                    yes:'提交',
                    no:'退出',
                    type:2,
                    callback:function (bl) {
                        if(bl) {
                            var obj = $('.pop_window'),
                                addr = obj.find('textarea').val(),
                                phone = obj.find('input').eq(1).val(),
                                name = obj.find('input').eq(0).val();
                            if (name.length < 2 || name.length > 20) {
                                $.toast('请正确填写收货人姓名,字数在2~20之间');
                                return false;
                            }
                            if (!$.isMobileNum(phone)) {
                                $.toast('请正确填写手机号码');
                                return false;
                            }
                            if (addr.length < 11 || addr.length > 100) {
                                $.toast('请正确填写详细地址，字数在11~100之间');
                                return false;
                            }
                            $.sync({
                                url: fresh.apiRoot + 'rightGive/buy',
                                type: 'post',
                                data:{
                                    consignee:name,
                                    address:addr,
                                    mobile:phone,
                                    goodsNo:self.pdInfo[self.exchangeID].goodsNo
                                },
                                success: function() {
                                    self._exchange();
                                }
                            });

                        }
                    }
                })
            }
        });
    },
    _exchange:function(){
        var self=this,
            data=this.pdInfo[this.exchangeID]
        $.popWindow({
            content:exchange3(data),
            yes:'查看订单',
            type:2,
            callback:function (bl) {
                if(bl){
                    $.changePage('myGift');
                    self.cache.investAmt-=data.investVal;
                    self.cache.inviteNum-=data.inviteVal;
                    self.render();
                }
            }
        })
    },
    events: {
        'tap .exchange-btn': 'exchange',
        'tap .gift-btn': 'getGift'
    },
    exchange:function(e){
        var self=this,
            id=$(e.currentTarget).parent().attr('data-id'),
            data=this.pdInfo[id],
            str='';
        $.popWindow({
            content:exchange1(data),
            yes:'确认兑换',
            no:'考虑一下',
            type:2,
            callback:function (bl) {
                if(bl){
                    self.exchangeID=id;
                    self._checkAddress();
                }
            }
        })
    },
    getGift:function(e){
        var id=$(e.currentTarget).parent().attr('data-id'),
            data=this.pdInfo[id],
            bl=0,
            str='<p style="text-align:center">您还需要';
        if(!this.cache.isLogin){
            $.login();
            return false;
        }

        if(this.cache.investAmt<data.investVal){
            bl=1;
            str+='<span class="red">'+(data.investVal-this.cache.investAmt)+'投资值</span>'
        }
        if(this.cache.inviteNum<data.inviteVal){
            str+=(bl==1?' + ':'')+'<span class="red">'+(data.inviteVal-this.cache.inviteNum)+'个邀请值</span>';
        }
        str+='才能兑换该商品</p>';
        $.popWindow({
            title:data.goodsName,
            content:str,
            yes:'知道了',
            type:2
        })
    }
});