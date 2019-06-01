/**
 * Created by chenguodong on 2017/3/9.
 */
var template = _.template(require('./tradingRecordList.html'));

module.exports = Backbone.View.extend({
    initialize:function(options){
        this.recordType = options.recordType||'';
        this.getData(this.recordType);
    },
    getData:function(recordType){
        var self = this;
        $.sync({
            url:fresh.apiRoot + 'member/queryTransLog',
            type:'post',
            data:{
                type:recordType,
                currentPage:0,
                pageCount:10
            },
            success:function(d){
                self.cache = d;
                self.render();
            },error:function(d){
                $.toast(d.msg);
            }
        });
    },
    render:function(){
        this.$el.html(template(this.cache));
        $('html,body').scrollTop(0);
        $('#dataMore').show();
        $('#moreMak').hide();
        return this;
    }
});