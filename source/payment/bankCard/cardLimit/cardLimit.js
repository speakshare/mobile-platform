/**
 * Created by chenguodong on 2017/3/2.
 */
var template = _.template(require('./cardLimit.html'));
require('./cardLimit.css');

module.exports = Backbone.View.extend({
    initialize:function(options){
        this.type=options.type;
        this.getData();
    },
    getData:function(){
        var self = this;
        $.sync({
            url:fresh.apiRoot + 'member/queryBankCodeList',
            type:'post',
            data:{},
            success:function(d){
                self.cache = d;
                self.render();
            }
        });
    },
    render:function(){
        this.$el.html(template(this.cache));
        var _title = $('title').text();
        if(_title == '银行卡管理'){
            $.setAppNav('支持银行卡及限额');
        }
        return this;
    }
});
