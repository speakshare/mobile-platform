module.exports = function (options) {
    var defaultSetting = {
            checkNetwork: true,
            timeout: 20000
        },
        opt = $.extend(true, defaultSetting, options),
        type = (opt.type || 'get').toLowerCase();
    if (type == 'get') {
        if (opt.data) {
            opt.data.uniq = $.uniqID();
        }else {
            opt.data = {
                uniq: $.uniqID()
            };
        }
    }
    if (!opt.checkNetwork || (opt.checkNetwork && $.checkNetwork())) {
        var data = {
            url: opt.url,
            type: type,
            data: opt.data,
            dataType:'json',
            timeout:opt.timeout,
            headers:{
                logintoken:$.getToken(),
                userID:localStorage.getItem('userID')||''
            },
            success:function(d){
                $('.loading-refresh').hide();
                if(d.status==-1 || d.status==14){
                    localStorage.clear();
                    $.popWindow({
                        content:'账号在异地登录，若非本人操作请修改密码！',
                        type:'2',
                        yes:'确定',
                        no:'取消',
                        callback:function(bl){
                            if(bl){
                               jsb.login();
                            }else{
                                // history.go(-1);
                            }
                        }
                    });
                }else if(d.status==-2){
                    $.popWindow({
                        content:'您的请求无效！',
                        type:'2',
                        yes:'确定',
                        callback:function(bl){
                            if(bl){
                                history.go(-1);
                            }
                        }
                    });
                    return true;
                }else if(d.status==-3){
                    $.popWindow({
                        content:d.msg,
                        type:'2',
                        yes:'确定',
                        callback:function(bl){
                            if(bl){
                                history.go(-1);
                            }
                        }
                    });
                    return true;
                }
                if (d.status == 0) {
                    opt.success && opt.success(d.data);
                } else if (opt.error && $.type(opt.error) === 'function') {
                    opt.error(d);
                } else {
                    $.toast(d.msg, 1000);
                }
            },
            error:function(d){
                $('.loading-refresh').hide();
                if (opt.error && $.type(opt.error) === 'function') {
                    opt.error(d);
                }else {
                    $.serverError();
                }
            }
        };
        $('.loading-refresh').show();
        $.ajax(data);
    }
};