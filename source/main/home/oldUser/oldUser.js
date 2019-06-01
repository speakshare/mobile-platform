var template = _.template(require('./oldUser.html'));
require('./oldUser.css');

var timeout;
var SHAKE_THRESHOLD = 800;
var last_update = 0;
var x, y, z, last_x, last_y, last_z;
var viewObj;

function bindShakeEvent(){
    window.addEventListener('devicemotion',_shakeCallBack);
}
function _shakeCallBack(eventData){
    var acceleration =eventData.accelerationIncludingGravity;
    var curTime = new Date().getTime();
    if ((curTime - last_update)> 300) {
        var diffTime = curTime -last_update;
        last_update = curTime;
        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;
        var speed = Math.abs(x +y + z - last_x - last_y - last_z) / diffTime * 10000;
        if (speed > SHAKE_THRESHOLD) {
            clearTimeout(timeout);
            timeout=setTimeout(function(){
                viewObj._homeSign();
            },50);
        }
        last_x = x;
        last_y = y;
        last_z = z;
    }
}
function unBindShakeEvent(){
    window.removeEventListener('devicemotion',_shakeCallBack);
}



module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.cache=options.cache;
        this.render();
        viewObj=this;
    },
    render:function (){
        this.$el.html(template(this.cache));
            var mySwiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                initialSlide: 0,
                slidesPerView: 1.15,
                spaceBetween: ($(window).width() - 320) / 10,
                centeredSlides: true,
                loop: true,
                loopAdditionalSlides: 1,
                autoplay: 3000,
                preventClicks: true,
                effect: 'coverflow',

                coverflow: {
                    rotate: 0,
                    stretch: -45,
                    depth: 250,
                    slideShadows: false
                },
                onTouchEnd: function (Swiper) {
                    // var self=this;
                    // setTimeout(function () {
                    //     self.slideTab(Swiper.activeIndex);
                    // }, 50);
                    return false;
                },
                onTap:function(swiper,e){
                    var link=$(e.target).parent().attr('data-link');
                    if(link){
                        window.location=link;
                    }
                }
            });
        return this;
    },
    _homeSign:function(){
        var self=this;
        $.sync({
            url: fresh.apiRoot + 'member/sign',
            type: 'post',
            success: function(d){
                self._signedTip(d);
                unBindShakeEvent();
            },error:function(d){
                $.toast(d.msg);
            }
        });
    },
    _signedTip:function(d){
        this.$el.find('.sign-btn').addClass('signed-btn');
        this.$el.append(_.template(require('./sign-tip.html'),d));
    },
    events:{
        'tap .sign-mask':'closeSignMask',
        'tap .home-calendar':'calendar',
        'tap .safe-btn':'securityGuarantee',
        'tap .invite-btn':'invite',
        'tap .sign-btn':'goMall',
        // 'tap .swiper-slide':'changePage',
        'tap .notice-box':'notice',
        'tap .product-one,.member-box':'productDetail',
        'tap .member-btn':'gopay',
        'tap .total-data':'platformData'
    },
    notice:function(){
        if(this.cache.notice.newsType=='03'){
            this.cache.notice.newsLink && (window.location=this.cache.notice.newsLink);
        }else{
            $.changePage('uc/newsCenter/noticeDetail/'+this.cache.notice.id);
        }
    },
    platformData:function(){
        $.changePage('about/platformData');

    },
    goMall:function(){
        $.changePage('mall');
    },
    closeSignMask:function(){
        this.$el.find('.sign-mask').hide();
    },
    calendar:function(){
        $.changePage('uc/calendar');
    },
    securityGuarantee:function(){
        $.changePage('staticPage/securityGuarantee');
    },
    invite:function(){
        $.changePage('uc/invite');
    },
    changePage:function(e){
        var link=$(e.currentTarget).attr('data-link');
        if(link){
            window.location=link;
        };
        return false;
    },
    productDetail:function(e){
        var id=$(e.currentTarget).attr('data-id'),
            type=$(e.currentTarget).attr('data-type');
        $.changePage('product/'+id);
    },
    gopay:function(e){
        var obj=$(e.currentTarget),
            id=obj.parent().attr('data-id');
        if(!obj.hasClass('disabled')){
            $.changePage('product/'+id+'/checkout');
        }
        return false;
    }
});