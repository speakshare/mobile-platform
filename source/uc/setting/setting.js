var template = _.template(require('./setting.html'));
require('./setting.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        this.render();
    },
    render:function(){
        this.$el.html(template());
        $.setAppNav('设置');
        return this;
    },
    events:{
        'tap .logout-btn':'logout',
        'click .safety-center':'safetyCenter',
        'click .about-us':'about',
        'click .clear-data':'clear'
    },
    safetyCenter:function(){
        $.changePage('uc/setting/safetyCenter')
    },
    about:function(){
        $.changePage('staticPage/aboutUs')
    },
    clear:function(){
        localStorage.clear();
        $.toast('已清除缓存');
        setTimeout(function(){
            $.changePage('home');
        },3000)
    },
    logout:function(){
        $.popWindow({
            content:'确认要退出登录？',
            type:2,
            no:'确认',
            yes:'取消',
            callback:function(bl){
                if(!bl){
                    $.sync({
                        url:fresh.apiRoot+'member/logout',
                        type:'post',
                        success:function(){
                            localStorage.clear();
                            setTimeout(function(){
                                if(localStorage.length>0){
                                    window.localStorage.clear();
                                }
                                $.changePage('uc/home')
                            },50);
                        }
                    })
                }
            }
        })
    }
});