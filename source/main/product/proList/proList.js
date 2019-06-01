/**
 * Created by chenguodong on 2017/3/30.
 */
var template = _.template(require('./proList.html')),
    template1 = _.template(require('./proRegular.html')),
    template2 = _.template(require('./proLuxury.html')),
    template3 = _.template(require('./proTransfer.html'));
require('./dealSub');
require('./proList.css');

module.exports = Backbone.View.extend({
    initialize: function(){
        this.getData();
    },
    getData: function(){
        var self = this;
        $.batSync({
            data:[
                {url: fresh.apiRoot + 'sysDateQuery'},
                {url: fresh.apiRoot + 'productList2',data:{transferVersion:'1'}}
            ],
            success:function(d){
                self.cache = {
                    // sysTime:Date.parse(d[0].sysdate.replace(/-/g,"/")),        //获取系统时间
                    sysTime:d[0].sysDate,        //获取系统时间
                    yaoBaoList:d[1].currentProduct,    //摇宝
                    newsList:d[1].newProductList,   //新手产品
                    eventList:d[1].notCommonProductList,  //非普惠产品||活动产品
                    regularList:d[1].commonProductList,   //普惠产品
                    luxuryList:d[1].memberProductList,    //会员产品
                    transferList:d[1].creditoTransferingProductList,    //变现产品
                    dealTime:d[1].dealForbiddenTimeFlag        //交易期
                };
                self.render();
                console.log(d[1])
                $.downloadApp();
            },error:function(d){
                $.toast(d.msg)
            }
        });
    },
    render: function(){
        this.$el.html(template(this.cache));
        this.$el.find('.pro-regular').html(template1(this.cache));
        this.$el.find('.pro-luxury').html(template2(this.cache));
        this.$el.find('.pro-transfer').html(template3(this.cache));
        window.customEvent( 3, '1.8.1', '' );
        $.setAppNav('产品列表');
        this.mySwiper();
        return this;
    },
    events: {
        'tap .head-tab':'headTab',
        'tap .pro-yaoBao':'toYaoBao',
        'tap .to-proOld':'toProOld',
        'tap .to-transfer':'toTransfer',
        'tap .to-detail':'proBox',
        'click .pro-slide':'proSlide',
        'tap .transfer-detail':'transferDetail'
    },
    mySwiper:function(){
        var wid = 2 + ($(window).width() - 320)/160;
        var mySwiper = new Swiper ('.swiper-container', {
            direction: 'horizontal',
            slidesOffsetBefore: 20,
            slidesPerView: wid,
            freeMode:true
        })
    },
    headTab:function(e){
        var self = $(e.currentTarget),
            _index = self.index();
        if(_index == 1){
            $.changePage('fund');
        }
    },
    toYaoBao:function(e){
        $.checkUser(function(){
            var pid= $(e.currentTarget).attr('data-id');
            $.changePage('yaobao/'+pid);
        });
    },
    toProOld:function(){
        $.changePage('product/proOld')
    },
    toTransfer:function(){
        $.changePage('transfer')
    },
    proBox:function(e){
        var self = $(e.target),
            proId = $(e.currentTarget).attr('data-id'),
            buyBut = self.hasClass('buy-but'),
            buyButFre = self.hasClass('buy-but-fre');
        if(buyBut){
            this.detectionUser(proId);
        }else if(buyButFre){
            $.toast('每天23:40~06:00为系统维护时间，不能进行购买和提取活期资金操作！',2500)
        }else{
            $.changePage('product/' + proId)
        }
    },
    // toSaleHint:function(_proNo,_pos){
    //     $.checkUser(function(){
    //         $.sync({
    //             url:fresh.apiRoot + 'member/preBuyProduct',
    //             type:'post',
    //             data:{
    //                 productNo:_proNo
    //             },
    //             success:function(d){
    //                 $.toast('您已成功预约该产品!',1500);
    //                 _pos.html('已预约').removeClass().addClass('sub-but');
    //                 console.log(d)
    //             },error:function(d){
    //                 $.toast(d.msg)
    //             }
    //         });
    //     })
    // },
    proSlide:function(e){
        var proId = $(e.currentTarget).attr('data-id');
        $.changePage('product/' + proId)
    },
    transferDetail:function(e){
        var _id = $(e.currentTarget).attr('data-id');
        $.changePage('transfer/detail/' + _id);
    },
    detectionUser:function(pid){
        var self = this,
            tel = $.getNub();
        $.checkUser(function(){
            $.sync({
                url: fresh.apiRoot +  'member/queryUserFlowStatus',
                type: 'post',
                data: {phoneNum: tel},
                success:function(d){
                    if(d.registerShakeFlag == '0'){
                        self.popWindow('您还未新手摇，请先去新手摇','确定','newshake')
                    }else if(d.realNameVerifyFlag == '0'){
                        self.popWindow('您还未实名认证，请先去实名认证','立即认证','payment/userAuthentication')
                    }else if(d.bindCardFlag == '0'){
                        self.popWindow('您还未绑定银行卡，请先去绑定银行卡','立即绑定','payment/userTiedCard')
                    }else if(d.setTradePwdFlag == '0'){
                        self.popWindow('您还未设置交易密码，请先去设置','立即设置','payment/userSetPayPass')
                    }else{
                        $.changePage("/product/" +  pid + "/checkout/");
                    }
                },error:function(d){
                    $.toast(d.msg)
                }
            });
        },1)
    },
    popWindow:function(content,yes,url){
        $.popWindow({
            content:content,
            type:2,
            yes:yes,
            no:'取消',
            callback:function(bl){
                if(bl){
                    $.changePage(url)
                }
            }
        });
    }
});