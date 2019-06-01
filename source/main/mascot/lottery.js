/**
 * Created by lifeng on 2017/5/19 0019.
 * 抽奖界面
 */
require('./lottery.css')
var template = _.template(require('./lottery.html'));
var template_diamond = _.template(require('./diamond.html'));
var template_ambassador = _.template(require('./ambassador.html'));
var template_bean = _.template(require('./bean.html'));
var template_ticket = _.template(require('./ticket.html'));
var template_error = _.template(require('./error.html'));
var shake=require('./shakeWrapper')
var shakeHanlder=shake(cb);
var pageType=''

//显示摇一摇夺宝
function showLottery(ptype) {
    pageType=ptype;
    $('#mainPage').append(template({isIOS:$.isIOS()}))
    $('.mascot-lottery .close').on('tap',function (e) {
        window.removeEventListener('devicemotion',shakeHanlder,false);
        $('.mascot-lottery').remove()
    })

    $('.mascot-lottery .find-dog').on('tap',getLottery);
    if(window.DeviceMotionEvent) {
        // Mobile browser support motion sensing eventt
        window.addEventListener('devicemotion',shakeHanlder , false);
        window.addEventListener("hashchange",hashHandler,false);
    } else {
        // Mobile browser does not support the motion sensing events
    }
}
function hashHandler() {
    window.removeEventListener('hashchange',hashHandler,false);
    window.removeEventListener('devicemotion',shakeHanlder,false);
    $('.mascot-lottery').remove();
}

//摇一摇回调，播放声音，抽奖
function cb() {
   var shakeAudio=document.getElementById("shakeMusic");
    if(shakeAudio.play){
        shakeAudio.play();
    }
    getLottery();
}

//抽奖
function getLottery(e) {

    window.removeEventListener('devicemotion',shakeHanlder,false);
    $.sync({
        url:fresh.apiRoot +'mascot/lottery',
        type:'post',
        data:{
            pageType:pageType
        },
        success:function (data) {
            showLotteryResult(data);

        },
        error:function(err){
            showLotteryResult({type:"0"});
        }
    })

}
//显示抽奖结果
function showLotteryResult(data) {
    switch (data.type){
        case "1":
        //bean
            $('#lottery-content').html(template_bean({count:data.count}));
            $('#lottery-content .button>span').on('tap',function () {
                $('.mascot-lottery').remove();
                $.changePage('mall')
            })
            break;
        case "2":
        //ambassador
            $('#lottery-content').html(template_ambassador({count:data.count}));
            $('#lottery-content .button>span').on('tap',function () {
                $('.mascot-lottery').remove();
                $.changePage('uc/manager/makeMoneyGuide')
            })
            break;
        case "3":
        //diamond
            $('#lottery-content').html(template_diamond({count:data.count}));
            $('#lottery-content .button>span').on('tap',function () {
                $('.mascot-lottery').remove();
                $.changePage('member/home')
            })
            break;
        case "4":
            //ticket
            $('#lottery-content').html(template_ticket({count:data.count}));
            $('#lottery-content .button>span').on('tap',function () {
                $('.mascot-lottery').remove();
                $.changePage('uc/couponList')
            })
            break;
        default:

            $('#lottery-content').html(template_error());


    }
    
}


module.exports={showLottery:showLottery}
