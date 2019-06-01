/**
 * Created by chenguodong on 2017/4/12.
 */
$.extend({
    memberType:function(type){
        var content = ['普通','白银','黄金','铂金','钻石'];
        return content[type-1]
    },
    countdown:function(pos,dataTime){
        var t_day = 60 * 60 * 24;
        var t_hour = 60 * 60;
        var t_min = 60;

        var aa=setInterval(function () {
            var t_currenttime = new Date().getTime();
            var t_result = dataTime - t_currenttime;
            if(t_result<=0){
                clearInterval(aa);
                location.reload();
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
            $('.'+pos).html(t_result_min+' : '+t_result_sec);
        }, 1000);
    }

});