/**
 * Created by chenguodong on 2017/3/9.
 */
var template = _.template(require('./tradingRecord.html'));
var template2 = _.template(require('./tradingRecordList/tradingRecordList.html'));
require('./tradingRecord.css');

module.exports = Backbone.View.extend({
    initialize:function(){
        this.recordType = '';
        this.pageNum = 0;
        this._index = 0;
        this.getData();
    },
    getData:function(){
        this.render();
    },
    render:function(){
        this.$el.html(template(this.cache));
        $.setAppNav('交易记录');
        $('#traRecdBox0').show();
        this._initEvent('',this._index);
        return this;
    },
    events:{
        'tap #typeTab span':'typeTab',
        'tap #dataMore':'dataMore'
    },
    typeTab:function(e){
        var self = $(e.currentTarget),
            dataType = self.attr('data-type'),
            _index = self.index();
        this._index = _index;
        self.addClass('sty1').siblings().removeClass('sty1');
        $('.trading-record-box').hide();
        $('#traRecdBox'+_index).show();
        this._initEvent(dataType,_index);
        this.recordType = dataType;
        this.pageNum = 0;
    },
    _initEvent:function(recordType,pos){
        var tradingRecordList = require('./tradingRecordList/tradingRecordList');
        new tradingRecordList({el:this.$el.find('#traRecdBox'+pos),recordType:recordType});
    },
    dataMore:function(){
        this.pageNum++;
        this._append(this.recordType,this.pageNum,this._index);
    },
    _append:function(recordType,pageNum,pos){
        $.sync({
            url:fresh.apiRoot + 'member/queryTransLog',
            type:'post',
            data:{
                type:recordType,
                currentPage:pageNum,
                pageCount:10
            },
            success:function(d){
                if(d.list.length < 10){
                    $('#dataMore').hide();
                    $('#moreMak').show();
                }else{
                    this.pageNum++;
                    $('#traRecdBox'+pos).append(template2(d));
                }
            },error:function(d){
                $.toast(d.msg);
            }
        });
    }
});