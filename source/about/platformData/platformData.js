var template = _.template(require('./platformData.html'));
require('./platformData.css');
module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type=options.type;
        this.getData();
    },
    getData:function(){
        var self = this;
        $.sync({
            url: fresh.apiRoot + 'platformData/queryPlatformData',
            type: 'post',
            success: function(d){
                self.cache=d;
                self.render();
            },error:function(d){
                self.render();
            }
        });
    },
    render:function (){
        this.$el.html(template(this.cache));
        $.setAppNav('平台数据');
        this.moreup();
        return this;
    },
    moreup:function(){
        var self=this;
        $("#mainPage,#content").addClass("posrel"); 
        var myswiper = $.swiper('.swiper-container',{
            direction:'vertical',
            effect:'slide',
            touchRatio:0.5,
            speed:500,
            parallax:true,
            roundLengths:true,
            shortSwipes:true,
            onInit: function(Swiper){
                $.swiperAnimate.swiperAnimateCache(Swiper);
                $.swiperAnimate.swiperAnimate(Swiper);
            },
            onSlideChangeEnd: function(Swiper){
                $.swiperAnimate.swiperAnimate(Swiper);
            },
            onTransitionEnd: function(myswiper){
                if(myswiper.isEnd){
                    $('.more-up').fadeOut(0);
                }else{
                    $('.more-up').fadeIn(500);
                }
            }
        });

    }
});