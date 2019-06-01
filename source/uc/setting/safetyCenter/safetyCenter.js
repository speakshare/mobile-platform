/**
 * Created by chenguodong on 2017/3/3.
 */
var template = _.template(require('./safetyCenter.html'));
require('./safetyCenter.css');

module.exports = Backbone.View.extend({
    initialize:function(){
        this.render();

    },
    render:function(){
        this.$el.html(template());
        $.setAppNav('账户安全');
        return this;
    },
    events:{
        'tap #toUpdateLog':'toUpdateLog',
        'tap #toManTrade':'toManTrade'
    },
    toUpdateLog:function(){
        $.changePage('uc/setting/changeLoginPwd')
    },
    toManTrade:function(){
        $.changePage('uc/setting/tradePwdManager')
    }
});