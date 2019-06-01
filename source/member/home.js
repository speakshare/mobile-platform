/**
 * Created by chenguodong on 2017/4/6.
 */
var template = _.template(require('./home.html'));
require('./home.css');

module.exports = Backbone.View.extend({
    initialize:function(){
        this.getData();
    },
    getData:function(){
        var self = this;
        $.checkUser(function(){
            $.sync({
                url: fresh.apiRoot + 'hytx/personal',
                type:'post',
                success:function(d){
                    self.cache = d;
                    self.cache.badgeName = ['普通','白银','黄金','铂金','钻石'];
                    // self.cache.rewardRules={1:{"pointDiscount":0.85,"realizeFee":0.25,"signPoint":0},
                    //     2:{"pointDiscount":0.75,"realizeFee":0.24,"signPoint":1},
                    //     3:{"pointDiscount":0.65,"realizeFee":0.23,"signPoint":2},
                    //     4:{"pointDiscount":0.55,"realizeFee":0.22,"signPoint":2},
                    //     5:{"pointDiscount":0.45,"realizeFee":0.21,"signPoint":5}}
                    self.render();
                    // console.log(d)
                },error:function(d){
                    $.toast(d.msg);
                }
            });
        })
    },
    render:function(){
        this.$el.html(template(this));
        $.setAppNav('我的会员');
        this.mySwiper();
        return this;
    },
    events:{
        'tap .exclusive':'exclusive',
        'tap .member-home> p .goto-products':'gotoProducts',
        'tap .member-home> p .goto-wangjia':'gotoWangjia'
    },
    gotoProducts:function () {
        $.changePage("product");
    },
    gotoWangjia:function () {
        $.changePage("mall");
    },
    mySwiper:function(){
        var self = this,
            index_id = this.cache.level,
            _index = this.cache.level - 1;
        $('.badge').addClass('badge'+index_id);
        $('.badge-name').html(this.cache.badgeName[index_id-1]);
        $('.member-home').css('height',document.body.scrollHeight);
        this.slideTab(_index);
        var mySwiper = new Swiper ('.swiper-container', {
            direction: 'horizontal',
            initialSlide :_index,
            slidesPerView: 1.47,
            centeredSlides: true,
            effect : 'coverflow',
            coverflow: {
                rotate:0,
                stretch:-40,
                depth:250,
                slideShadows:false
            },
            onTouchEnd: function(Swiper){
                setTimeout(function(){
                    self.slideTab(Swiper.activeIndex);
                },50)
            }
        });
    },
    slideTab:function(index){
        var level=index+1;
        $('.birth .text').html('生日礼LV' + parseInt(1+index));
        var wangdou=this.cache.rewardRules[level].signPoint;
        var wangjia=(100*this.cache.rewardRules[level].pointDiscount).toFixed(0);
        var fee=this.cache.rewardRules[level].realizeFee;
        if(wangjia%10==0){
            wangjia=(wangjia/10).toFixed(0);

        }
        var wangdouText='签到旺豆',wangjiaText='旺家折扣',feeText='低费变现';
        if(wangjia!=10){
            wangjiaText='旺家' + wangjia+"折";
        }
        if(wangdou>0){
            wangdouText='旺豆+' +wangdou;
        }
        if(level>1){
            feeText=fee+"%手续费";
        }
        $('.wangjiazhekou .text').html(wangjiaText);
        $('.qiandao .text').html(wangdouText);
        $('.difeibianxian .text').html(feeText);

        $('.exclusive').removeClass('enable');
        switch (index){
            case 0:
                $('.birth').addClass('enable');
                break;
            case 1:
                $('.birth,.qiandao,.huiyuanchanpin,.wangjiazhekou,.difeibianxian').addClass('enable');
                break;
            case 2:
                $('.birth,.qiandao,.huiyuanchanpin,.wangjiazhekou,.difeibianxian,.huodongtequan').addClass('enable');

                break;
            case 3:
                $('.birth,.qiandao,.huiyuanchanpin,.wangjiazhekou,.difeibianxian,.huodongtequan,.xianxiahuodong,.zhuanxiangguwen').addClass('enable');
                break;
            case 4:
                $('.birth,.qiandao,.huiyuanchanpin,.wangjiazhekou,.difeibianxian,.huodongtequan,.xianxiahuodong,.zhuanxiangguwen').addClass('enable');
                break;
        }

    },
    exclusive:function(e){

        var self = $(e.currentTarget),
            typeId = parseInt(self.attr('type-id')),
            wordHint = [
                '特权描述：会员生日当天摇旺会赠送一个生日礼包，礼包内含神秘祝福投资券，等级越高，礼包越大。',
                '特权描述：对应等级会员每日签到时会获取额外奖励。等级越高，额外奖励越丰厚。<div class="btn goto-wangjia"><span>去签到</span></div>',
                '特权描述：白银等级以上会员拥有专属高息项目投资权，专属项目利息随等级递增。<div class="btn goto-products"><span>去查看</span></div>',
                '特权描述：黄金等级以上会员参加活动有机会获取额外奖励，等级越高，奖励越丰富。',
                '特权描述：铂金等级以上会员有机会作为贵宾被邀请参加摇旺多种多样的线下活动。',
                '特权描述：铂金等级以上会员将配备专属理财顾问，让您享受一对一尊贵服务。',
                '特权描述：白银等级以上会员兑换旺家内礼品享受旺豆折扣，等级越高，兑换折扣越低，所需旺豆越少。<div class="btn goto-wangjia"><span>去逛逛</span></div>',
                '特权描述：白银以上会员使用变现功能，将享受变现手续费（原为0.2%）减免特权。等级越高，变现手续费越低。钻石会员享受免手续费权益。'
            ];
        $('.confirm-check').remove();
        self.prepend('<i class="confirm-check"></i>');
        $('.depict-hint').html(wordHint[typeId]);
        $('.member-home').css('height',document.body.scrollHeight);
    }
});