/**
 * Created by chenguodong on 2016/12/1.
 */
var template = _.template(require('./holdPosition.html'));
require('./holdPosition.css');

module.exports = Backbone.View.extend({
    initialize:function(options){
        this.type = options.type;
        this.fid = options.fid;
        this.getData();
    },
    getData:function(){
        var self = this;
        var platform = $.isWeixin() ? 4 : 3;
        var fundCode = this.fid;
        $.sync({
            url:fresh.apiRoot + 'fund/customer/position/detail',
            type:'post',
            data:{
                platform:platform,
                fundCode:fundCode
            },
            success:function(d){
                self.cache = {
                    data:d
                };
                if(d == undefined){
                    $.sync({
                        url:fresh.apiRoot + 'fund/customer/position/history',
                        type:'post',
                        data:{
                            platform:platform,
                            pageNo:0,
                            fundCode:fundCode
                        },
                        success:function(d){
                            self.cache = {
                                data:d.result[0]
                            };
                            self.render();
                        },error:function(d){
                            $.toast(d.msg);
                        }
                    });
                }else{
                    self.render();
                }

            },error:function(d){
                $.toast(d.msg);
            }
        });
    },
    render:function(){
        this.$el.html(template(this.cache));
        $.setAppNav('持仓详情');
        this.redefineXian();
        return this;
    },
    events:{
        'tap .hold-pos-but':'holdPosBut',
        'tap .hold-pos-records':'holdPosRecord'
    },
    redefineXian:function(){
        if(this.cache.isFundUpdate == '1'){
            $('.update-hint1').show(500);
            setTimeout(function(){
                $('.update-hint1').hide(500);
            },3000)
        }
    },
    holdPosBut:function(){
        $.popWindow({
            content:'相关功能目前仅在APP提供<br/>请下载摇旺APP，为您提供更多服务',
            type:2,
            no:'取消',
            yes:'确认',
            callback:function(bl){
                if(bl){
                    $.changePage('app/download');
                    // location.href = location.origin + '/app-last/view/app_Download.html'
                }
            }
        })
    },
    holdPosRecord:function(){
        $.changePage('fund/me/record/'+this.fid);
    }
});