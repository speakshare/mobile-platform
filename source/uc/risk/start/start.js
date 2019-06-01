var template = _.template(require('./start.html'));
require('./start.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        var self=this;
        $.setLoginTokenFormApp();
        $.checkUser(function(){
            self.render();
        })
    },

    render:function(){
        this.$el.html(template());
        $.setAppNav('风险评测');
        return this;
    },
    events:{
        'tap .popwindowbtn':'popwindow',
        'tap .button'      :'gotoquestion'
    },
    popwindow:function(){
        var self=this;
        $.popWindow({
            content: '<div class="contentdesc">不测了<p class="f17">我就是保守型用户</p></div>',
            type: 2,
            yes:'确定',
            no:'取消',
            callback:function(bl){
                if(bl){
                    $.sync({
                        url:fresh.apiRoot + 'member/updateRiskControlTypes',
                        type: 'post',
                        data:{riskType:'A'},
                        success: function(){
                            $.changePage('uc/risk/result?resultType=A');
                        }
                    });
                }
            }
        });
        return false;
    },
    gotoquestion:function(){
       $.changePage('uc/risk/question');
   }

});