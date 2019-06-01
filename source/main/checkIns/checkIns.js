var template = _.template(require('./checkIns.html'));
require('./checkIns.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type=options.type;
        this.getData();
        this.shake();
        localStorage.signMarker = true;
    },   
    getData:function(){
        var self = this;
        $.checkUser(function(){
            $.sync({
                url: fresh.apiRoot + 'member/selectCustomerSign',
                type: 'post',
                data:{loginToken: $.getToken()},
                success: function(d){
                    var list = d.list;
                    $.setCache('signin',list);
                    self.render();
                },error:function(d){
                    self.render();
                }
            });
        });
    },
    render:function (){
        var weekDays = ['一','二','三','四','五','六','日'];
        var curdate =new Date().getDate();
        var _list=$.getCache('signin');
        for (var i = 0; i <_list.length; i++) {
            if( Number(_list[i].signDate.split('-')[2])==curdate&& Number(_list[i].signStatus)==1){
                $.setCache("todayIsSign",true);
            }
        }   
        this.$el.html(template({signedlist:_list,weekDays:weekDays,todayIsSign: $.getCache('todayIsSign')}));
        $.setAppNav('签到');
        return this;
    },
    events:{
        'tap #signHint':'redirect',
        'tap #hand':'shaking'
    },
    //摇一摇
    shake:function(){
        var _this=this;
        var SHAKE_THRESHOLD=3000;
        var last_update=0;
        var isShake=false;
        var x=y=z=last_x=last_y=last_z=0;
        if(window.DeviceMotionEvent){
            window.addEventListener('devicemotion', function (eventData) {
                var acceleration = eventData.accelerationIncludingGravity;
                var curTime = new Date().getTime();
                if ((curTime - last_update) > 100) {
                    var diffTime = curTime - last_update;
                    last_update = curTime;
                    x = acceleration.x;
                    y = acceleration.y;
                    z = acceleration.z;
                    var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
                    if (speed > SHAKE_THRESHOLD) {
                        isShake = true;
                        _this.shaking();
                    }
                    last_x = x;
                    last_y = y;
                    last_z = z;
                }
            }, false);
        }
    },
    shaking:function(){
        if(localStorage.signMarker == 'true'){
            var self=this;
            var hand = $('#hand'),
            audio = document.getElementById("shakeMusic");
            hand.addClass('hand');
            audio.play();
            setTimeout(function(){
                hand.removeClass('hand');
                audio.pause();
                self.shakeResult();
                localStorage.signMarker = true;
            },2000);
            localStorage.signMarker = false;
        }
    },
    shakeResult:function(){
        $.checkUser(1,function(){
            $.sync({
                url: fresh.apiRoot + 'shakEveDay',
                type: 'post',
                success: function(d){
                    console.log(d,1);
                    if(d.shakeAmt>0){
                        var self = this;
                        var shakeAmt = d.shakeAmt;
                        var openAudio = document.getElementById("openMusic");
                        $.batSync({
                            data:[
                            {url:fresh.apiRoot + 'member/queryExperienceLog',data:{loginToken: $.getToken()}},
                            {url:fresh.apiRoot + 'member/queryProgress',data:{loginToken: $.getToken()}}
                            ],
                            success:function(d){
                                openAudio.play();
                                self.cache={
                                    experienceLog : d[0],
                                    progress : d[1]
                                };
                                console.log(d,3);
                                if(self.cache.progress.currentProgress==self.cache.progress.progressSum){
                                    shakeAmt = shakeAmt*3
                                }
                                $.popWindow({
                                    content: '您摇到的理财积分是<br/><span style="font-size: 16px;color: #ff6046">'+shakeAmt+'分</span><br/><span style="color: #999">剩余累计积分为：<span style="color: #ff6046">'+self.cache.experienceLog.financing+'分</span></span>',
                                    type: 2,
                                    yes:'确定',
                                    callback:function(){
                                        location.reload();
                                    }
                                });
                            },error:function(d){
                                console.log(d,4);
                            }
                        });
                    }else{
                        if($.getCache('todayIsSign')){
                            $.toast('今日已签到！');
                        }else if(d.shakeAmt==-1){
                            $.popWindow({
                                content:'您还未投资，投资满<span style="color: #ff6046">100</span>元，可参与签到哦！',
                                type:2,
                                yes:'去投资',
                                no:'取消',
                                callback:function(bl){
                                    if(bl){
                                        $.changePage('product');
                                    }
                                }
                            });
                        }else if(d.shakeAmt==-2){
                            $.popWindow({
                                content: "签到机会用完了分享到朋友圈赠送5次签到的机会！",
                                yes: '立即分享',
                                no:'取消',
                                type: 2,
                                callback:function(bl){
                                    if(bl){
                                        // location.href="https://wz.91yaowang.com/weizhan/pages/member/inviteFriends";
                                        $.changePage('uc/invite');
                                    }
                                }
                            });
                        }else if(d.shakeAmt==-3){
                            $.popWindow({
                                content:'单笔投资定期产品满<span style="color: #ff6046">1000</span>元，才能天天签到哦！',
                                type:2,
                                yes:'去投资',
                                no:'取消',
                                callback:function(bl){
                                    if(bl){
                                        $.changePage('product');
                                    }
                                }
                            });
                        }
                    }
                },error:function(d){
                    $.toast(d.msg);
                    console.log(d)
                }
            });
});
},
redirect:function(){
    $.changePage('staticPage/checkInsHint')
}
});