/**
 * Created by xmm  on 2016/9/5
 */
 var template = _.template(require('./peas.html'));
 require('./peas.css');
 var countup=require('./countUp.js');
 module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type = options.type;
        this.getData();
    },
    getData:function(){
        var self = this;
        this.isLogin =$.getLogin();
        if($.getLogin()){
            $.batSync({
                data:[
                {url:fresh.apiRoot + 'member/selectImageUrl',data:{type:'06'}},
                {url:fresh.apiRoot + 'member/sign/newHistory'}       
                ],
                success:function(d){
                    console.log(d);
                    self.cache={
                        imgUrl : d[0],
                        signinfo : d[1]
                    }
                    self.render(); 
                },error:function(d){
                    // $.setLogin(null);
                    self.cache={
                        imgUrl : null
                    }
                    self.render(); 
                }
            });
        }else{
            $.sync({
                url:fresh.apiRoot + 'member/selectImageUrl',
                type: 'post',
                data:{type:'06'},
                success: function(d){
                    self.cache={
                        imgUrl : d
                    }
                    self.render(); 
                },error:function(d){
                    // $.setLogin(null);
                    self.cache={
                        imgUrl : null
                    }
                    self.render(); 
                }
            });
        }
    },
    render:function (){
        this.$el.html(template(this.cache));
        new Swiper('.swiper-container-banner', {loop: true,pagination: '.swiper-pagination-banner',autoplay : 3000});
        if($.getLogin()&&this.cache.signinfo){new countup("currpeasnum", 0 ,$("#currpeasnum").text(), 0, 0.3, {separator : ''}).start();}
        return this;
    } ,
    events:{
        'tap .orderbtn'       :'orders',
        'tap .pearaiders'     :'pearaiders',
        'tap .peasrecordbtn'  :'peasrecord',
        'tap .gotologinbtn'   :'tologin',
        'tap .bannerflag'     :'bannerflag',
        'tap .lottery'        :'lottery',
        'tap .signbar'        :'signin',
        'tap .torecharge'     :'recharge',
        'touchend .signdaysbox'    :'tip'  
    }, 
    orders:function(){
        window.customEvent( 2, '2.1.4', '点击订单');
        $.checkUser(function(){
          $.changePage('mall/orders');
        });
    },
    recharge:function(){
        $.checkUser(function(){
            $.changePage('mall/recharge');
        });
    },
    pearaiders:function(){
        window.customEvent( 2, '2.1.5', '点击旺豆攻略');
        $.changePage('staticPage/peasRaiders');
    },
    bannerflag:function(e){
        var _id=$(e.currentTarget).attr("data-id");
        window.customEvent( 2, '2.2.1', '点击banner,id:'+_id);
    },
    peasrecord:function(){
        $.changePage("mall/peasRecord"); 
    },
    tologin:function(){
        $.login();
    },
    lottery:function(){
        $.changePage("mall/lottery"); 
    },
    tip:function(e){
        $('.tips').toggle();
        e.preventDefault(); 
    },
    signin:function(){
        var self=this;
        window.customEvent(2, '1.6.3', '发起签到');
        if(self.cache.signinfo && self.cache.signinfo.chanceFlag=='1'){
            $.changePage('mall/resign');
        }else{
            if(self.cache.signinfo&& !self.cache.signinfo.todaySigned){
                $.sync({
                    url: fresh.apiRoot + 'member/sign',
                    type: 'post',
                    success: function(res){
                        console.log(res);
                        self.info = res;
                        self.data = res.luckObj;
                        window.customEvent(2, '1.6.4', '发起签到成功');
                        if(res.nodeType=='01'){
                            // self.windowpop(self.getpeas(res.luckObj.quantity),3500);
                            self.showSignAnimate(res);
                        }else{
                            if(res.luckObj.luckType==1){
                                self.windowpop(self.openchest(res.luckObj.quantity),3500);
                            }else{
                                self.windowpop(self.openvouchers(res.luckObj.quantity),3500);
                            }
                        }
                    },error:function(d){
                        window.customEvent(2, '1.6.5', '发起签到失败');
                        $.toast(d.msg);
                    }
                }); 
            }else{
                $.toast('今日已签到');
            }
        }
    },
    getpeas:function(i){//普通得旺豆
        var mark=$('<div class="mask"></div>');
        var boxhtml=$('<div class="peasbox"><p class="text">恭喜您获得<span class="num">'+i+'</span>旺豆</p></div>');
        $('body').append(mark);
        $('body').append(boxhtml);
    },
    openchest:function(i){//开宝箱得旺豆
        var mark=$('<div class="mask"></div>');
        var boxhtml=$('<div class="chestbox"><span class="num"><span class="iconBean"></span><span class="beanNum">+'+i+'</span></span></div>');
        $('body').append(mark);
        $('body').append(boxhtml);
    },
    getpeas1:function(i){
        var mark=$('<div class="mask"></div>');
        var boxhtml=$('<div class="peasbox1"><i></i><p class="text">您抽中<span class="num">'+i+'个</span>旺豆</p><span class="plusNum">+'+i+'</span><span class="closeBtn"></span></div>');
        $('body').append(mark);
        $('body').append(boxhtml);
    },
    openvouchers:function(i){//开宝箱得礼券
        var mark=$('<div class="mask"></div>');
        var boxhtml=$('<div class="chestbox1"><span class="num1"><span class="iconvouchers"><span class="beanNum">¥'+i+'</span></span></span></div>');
        $('body').append(mark);
        $('body').append(boxhtml);
    },
    getvouchers:function(i,m){
        var mark=$('<div class="mask"></div>');
        var boxhtml=$('<div class="vouchers"><p class="text">您抽中<span class="num">'+i+'元</span>代金券一张</p><span class="plusNum">¥'+i+'</span><span class="tips">满'+m+'可减</span><span class="item">代金券</span><button class="useBtn"></button><span class="closeBtn"></span></div>');
        $('body').append(mark);
        $('body').append(boxhtml);
    },
    windowpop:function(bl,timer){
        var self=this;
        if(typeof(bl)=='function'){
            bl && bl();
        }
        $('body').off('tap.closeBtn').on("tap.closeBtn", ".closeBtn", function() {
            self.close()
            $('.mask,.chestbox,.peasbox1,.vouchers').remove();
            location.reload();
        })
        $('body').off('tap.useBtn').on("tap.useBtn", ".useBtn", function() {
            $('.mask,.vouchers').remove();
            $.changePage('uc/couponList');
        })
        if(timer){
            setTimeout(function(){self.close()},timer);
        }
    },
    close:function(){
        var self = this;
        $('.mask,.chestbox,.chestbox1,.peasbox').remove();
        if(self.info.nodeType && self.info.nodeType=='01'){
            location.reload();
        }else{
            if(self.data.luckType==1){
                self.windowpop(self.getpeas1(self.data.quantity));
            }else{
                self.windowpop(self.getvouchers(self.data.quantity,self.data.investThreshold));
            }
        }
    },

     showSignAnimate:function(data){
         var self=this;
         var signedTemp=_.template(require('./signAnimate.html'));
         this.$el.find('.my-new-peasbox').append(signedTemp({
             num:data.luckObj.quantity,
             levelBeans:this.cache.signinfo.levelBeans,
             level:this.cache.signinfo.level
         }));
         setTimeout(function(){
             self.$el.find('.sign-animate-box').remove();
             location.reload();
         },2000);
     }
});