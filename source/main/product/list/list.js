var template = _.template(require('./wrap.html')),
    list=_.template(require('./html/list.html')),
    newMemberProduct=_.template(require('./html/newMemberProduct.html')),
    yaobao=_.template(require('./html/yaobao.html')),
    saleOut=_.template(require('./html/saleOut.html'));
var wave=require('./wave');
require('./list.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        this.$el.html(template());
        this.channelCode=$.getCache('channelCode')||'';
        this.getData();

    },
    getData:function(){
        var self = this;
        $.sync({
            url: fresh.apiRoot + 'newProductList',
            type: 'post',
            data: {
                currentPage:0,
                pageCount:15,
                productType:4,
                channelCode:$.getCache('channelCode')
            },
            success:function(d){
                self.cache=d;
                console.log(self.cache);
                if(d.currentProduct){
                    self._yaobao(d.currentProduct);
                }
                self._newMemberProduct();
                window.customEvent( 3, '1.8.1', '' );
                $.setAppNav('产品列表');
                self.channelCode && $('.bannerSlide .animate').bannerSlider($('.bannerSlide .pages li'),3000);
                if(self.cache.list.length==0){
                    self.empty=true;
                    self.$el.find('.product-list').html('<div class="product"><p class="empty">今日定期产品已售馨</p></div>');
                }else{
                    self.$el.find('.product-list').html(list(d));
                    self.countdown($(".timer"));
                }
                $.downloadApp();
            }
        });

        fresh.loadData && fresh.loadData.destory();
        fresh.loadData = $.loadMoreData({
            url: fresh.apiRoot + 'newProductList',
            type: 'post',
            data: {
                currentPage:0,
                pageCount:15,
                productType:5,
                channelCode:$.getCache('channelCode')
            },
            success:function(d){
                self.cache=d;
                if(self.empty){
                    self.empty=false;
                    self.$el.find('.product-list').html('');
                }
                self._saleout();
            }
        });
        
    },
    _yaobao:function(d){
        if(!this.channelCode) {
            this.$el.find('.yb-product-box').html(yaobao(d));
            var waves = wave({parent: this.$el.find('#wave')[0]});
            waves.start();
        }
    },
    _newMemberProduct:function(){
        var d=this.cache.list,
            len=d.length,
            match=-1;
        for(var i=0;i<len;i++){
            if(d[i].productType==10){
                if(!this.channelCode) {
                    this.$el.find('.new-member-product').html(newMemberProduct(d[i]));
                }
                match=i;
                break;
            }
        }
        if(match>=0)
            d.splice(i,1);
    },
    _saleout:function (){
        this.$el.find('.product-list').append(saleOut(this.cache));
        return this;
    },
    countdown:function(classobj){
        $.each(classobj,function(){
            var _this=$(this);
            var endtime= _this.attr('data-time');

            var t_endtime = endtime;
            var t_day = 60 * 60 * 24;
            var t_hour = 60 * 60;
            var t_min = 60;

            var tt = (t_endtime - new Date().getTime())/1000;
            if(tt>3600 || tt<0){
                return;
            }

            var aa=setInterval(function () {
                var t_currenttime = new Date().getTime();
                var t_result = t_endtime - t_currenttime;
                if(t_result<=0){
                    clearInterval(aa);
                    // location.reload();
                    $('#timer').removeClass('countdown-icon');
                    return false;
                }
                var t_time = Math.floor( t_result / 1000 );
                var t_result_day = Math.floor( t_time / t_day );
                var t_result_hour = Math.floor( t_time % t_day / t_hour);
                var t_result_min = Math.floor(t_time % t_day % t_hour/ t_min);
                var t_result_sec = Math.floor( t_time % t_day % t_hour % t_min);

                if ( t_result_min < 10) {
                    t_result_min = "0" + t_result_min;
                }
                if ( t_result_sec < 10) {
                    t_result_sec = "0" + t_result_sec;
                }
                _this.find(".min").html(t_result_min+' :');
                _this.find(".sec").html(t_result_sec);
            }, 1000);
        })
    },
    events:{
        'tap .product':'redirect',
        'tap .bannerSlide li':'changePage',
        'tap .rate-ring':'ybredirect',
        'tap .fund':'gotoFundIndex',
        'tap .transfer-btn':'transferList'
    },
    gotoFundIndex: function(){
        $.changePage("fund");
    },

    ybredirect:function(e){
        $.checkUser(function(){
            var pid= $(e.currentTarget).attr('data-id');
            $.changePage('yaobao/'+pid);
        });
        /*$.checkUser(function(){
            location.href = '/weizhan/product/yaoBao/?loginToken='+$.getToken()+'&productNo='+$(e.currentTarget).attr('data-id');
        });*/
        return false;
    },
    changePage:function(e){
        window.location=$(e.currentTarget).attr('data-link');
    },
    transferList:function(){
        $.changePage('transfer');
    },
    redirect:function(e){
        var id = $(e.currentTarget).attr('data-id')
        if(id){
            $.changePage("product/"+id);
        }
    }
});