/**
 * Created by lifeng on 2017/5/22 0022.
 */
function shakeWrapper(callBack) {
    var SHAKE_THRESHOLD = 300,
        last_update = 0,
        x = 0,y =0, z = 0,last_x = 0,last_y =0, last_z = 0;

    return function deviceMotionHandler(eventData) {
        var acceleration = eventData.accelerationIncludingGravity;
        var curTime = new Date().getTime();

        if ((curTime - last_update) > 500) {   //多次移动事件中取两个点的事件间隔
            var diffTime = curTime - last_update;
            last_update = curTime;

            x = acceleration.x;
            y = acceleration.y;
            z = acceleration.z;
            //var speed = Math.abs(x + y + z - last_x - last_y - last_z) / (diffTime * 1000);

            //主要优化点1:原来的计算方式把x、y、z三方向的移动有可能会互相干扰。比如x往真方向，y往负方向，就互相抵消了。
            var dist = Math.sqrt((x-last_x)*(x-last_x)+(y-last_y)*(y-last_y)+(z-last_y)*(z-last_y))
            var speed = dist/diffTime*10000;

            //优化点2:摇动速度测试调整，达到最优
            if (speed > SHAKE_THRESHOLD) {     //摇一摇灵敏度
                if(!callBack){
                    alert("没有添加摇一摇回调函数")
                }
                callBack();
            }
            last_x = x;
            last_y = y;
            last_z = z;
        }
    }
}
module.exports=shakeWrapper