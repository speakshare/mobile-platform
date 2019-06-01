/**
 * Created by chenguodong on 2016/12/5.
 */
var template = _.template(require('./record.html'));
require('./record.css');

module.exports = Backbone.View.extend({
    initialize:function(options){
        this.type = options.type;
        this.rid = options.rid;
        this.Num = 10;
        this.getData();
    },
    getData:function(){
        var num = this.Num;
        var self = this;
        var platform = $.isWeixin() ? 4 : 3;
        var fundCodes = this.rid;
        $.checkUser(function(){
            $.sync({
                url:fresh.apiRoot + 'fund/customer/exchange',
                type:'post',
                data:{
                    platform:platform,
                    pageNo:1,
                    pageSize:num||10,
                    fundCodes:fundCodes
                },
                success:function(d){
                    self.cache = {
                        data:d,
                        list:d.result
                    };
                    $.setCache('totalCount',self.cache.data.totalCount);
                    self.render();
                },error:function(d){
                    $.toast(d.msg,1500)
                }
            });
        });
    },
    render:function(){
        this.$el.html(template(this.cache));
        $.setAppNav('交易记录');
        this.redefineWid();
        return this;
    },
    events:{
        'tap #moreRecord':'moreRecord'
    },
    moreRecord:function(){
        var totalCount = $.getCache('totalCount');
        if(totalCount>this.Num){
            this.Num = this.Num + 10;
            this.getData();
        }else{
            $('#moreRecord').html('没有更多了！');
        }
    },
    redefineWid:function(){
        var opt = $('.hold-pos-record'),
            opts = $('.record-wid'),
            padRig = opt.width() - opts.width();
        opts.css('padding-left',padRig);
    }
});