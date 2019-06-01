
require('./mascot.css')
var Lottery=require('./lottery')
/**
 * Created by lifeng on 2017/5/18 0018.
 */
var typeMap={
    'productList':2,
    'mall':3,
    'ucHome':4,
    'ucCalendar':5,
    'ucInvite':6,
    'productDetail':7,
    'productPaySuccess':8,
    'transferList':9,
    'transferSuccess':10,
    'fundHome':11,
    'yaoBao':12,
    'mallResign':13,
    'mallLottery':14,
    'mallRedExchange':15,
    'mallGoodsDetail':16,
    'mallRecharge':17,
    'peasRaiders':18,
    'mallOrders':19,
    'memberHome':20,
    'ucSetting':21,
    'ucNewsCenter':22,
    'ucNewsActivity':22,
    'ucAsset':23,
    'ucProfit':24,
    'paymentWithdrawals':25,
    'paymentRecharge':26,
    'paymentAuthentication':27,
    'ucOrders':28,
    'ucOrdersDetail':29,
    'fundMine':30,
    'ucCouponList':31,
    'ucTradingRecord':32
}
var floatPageMap={
    'home':1
}
//删除typeMap里重复定义的页面
for(var name in floatPageMap){
    if(typeMap[name]!==undefined){
        delete typeMap[name]
    }
}
/*
满足以下条件时调用接口请求显示吉祥物：
1 登录
2 产品指定可显示页面
 */
function find(routeName,map) {
    if(!$.getLogin()){
        //没登录
        return ;
    }
    var pageRoute=routeName;
    if(routeName==='staticPage'){
        //静态页面的路由都是'staticPage'，需要通过url重新区分
        var hash=location.hash
        pageRoute=hash.split('/')[1];
    }
    var pageType=map[pageRoute];
    if(pageType === undefined){
        //不显示吉祥物的页面
        return ;
    }
    //显示图片，点击后显示抽奖，可点击抽，可摇
    $.sync({
        url:fresh.apiRoot +'mascot/equity',
        type:'post',
        data:{
            pageType:pageType
        },
        success:function (data) {
            if(data.flag==1){
                addMascot();
            }
            // addMascot();
        },
        error:function(err){
            console.log("err",err)
        }
    })


}
//显示吉祥物
function addMascot() {
    var style=["top","left","right"];
    var url={top:require("./img/cute.gif"),left:require("./img/hide.gif"),right:require("./img/yea.gif")}
    var showType=style[Math.floor(Math.random()*3)];
    var img=new Image();
    // 图片加载完后显示
    img.onload=function () {
        var mascot=$('<div class="mascot '+showType +'" style="background-image:url('+url[showType]+');"></div>')
        mascot.on('tap',function mascotEnd(e) {
            console.log(e.target.className);
            mascot.unbind('tap');
            mascot.remove();
            Lottery.showLottery();

        })
        $('#mainPage').append(mascot);
        //3秒后消失
        setTimeout(function () {
            $('.mascot').remove()
        },3000)
    }
    img.src=url[showType]

}





function ordinaryFind(routeName) {
    find(routeName,typeMap)
}
function floatPageFind(routeName) {
    find(routeName,floatPageMap)
}

module.exports={find:ordinaryFind,floatPageFind:floatPageFind}
