/**
 * Created by chenguodong on 2017/3/20.
 */
 var template = _.template(require('./compact.html'));
 require('./compact.css');

 module.exports = Backbone.View.extend({
    initialize:function(options){
        $.setLoginTokenFormApp();
        this.type = options.type;
        // this.oid = options.oid;
        this.oid=$.getParam('orderNo')||'';
        this.getData(this.oid);
    },
    getData: function(id) {
        var self = this;
        $.sync({
            url: fresh.apiRoot + 'contractAgreement/contractInformation',
            type: 'post',
            data: {orderNo:id},
            success:function(d){
                self.cache = d;
                self.render();
            },error:function(d){
                $.toast(d.msg)
            }
        });
    },
    render:function(){
        this.$el.html(template(this.cache));
        $.setAppNav('相关协议');
        return this;
    },
    events:{
        'tap .compact-box':'compactBox',
        'tap .download-box':'downloadBox'
    },
    compactBox:function(e){
        var self = $(e.currentTarget),
            _id = self.attr('data-id'),
            _tradeMode=this.cache.tradeMode,
            buyType = this.cache.buyType;
        if(buyType == '0'){
            if(_tradeMode == '1' || _tradeMode == '2'){
                _id=this.cache.orderNo;
            }
            $.changePage('uc/orders/compactDetail1/' + _tradeMode + '/' + _id + '/' + buyType);
        }else if(buyType == '2'){
            $.changePage('uc/orders/compactDetail2/' + _id);
        }
    },
    downloadBox:function(e){
        var self = $(e.currentTarget),
        _id = self.attr('data-id'),
        _tradeMode=this.cache.tradeMode;
        // if(_tradeMode != '0'){
        //     _id =this.cache.orderNo;
        // }
        that = this;
        $.popWindow({
            content:'<div><h3 style="font-size:16px;color:#444;">下载合同</h3>' +
            '<input type="text" id="compactEmail" style="text-align:center;width:100%;height:30px;line-height:30px;margin:15px 0 10px;border:1px solid #999;border-radius:5px;" placeholder="请输入您的邮箱">' +
            '<p style="line-height:20px;font-size:13px;color:#999">稍后电子合同将发送至您的邮箱,<br>请注意查收！</p></div>',
            yes:'确认',
            no:'取消',
            type:2,
            callback:function(bl){
                if(bl){
                    var compactEmail = $('#compactEmail').val();
                    if(!$.isEmail(compactEmail)){
                        $.toast('请输入正确的邮箱');
                        return false;
                    }
                    that.toDownload(compactEmail,_id,_tradeMode);
                }
            }
        })
    },
    toDownload:function(email,id,mid){
        var _data={mailAddress: email,id: id,tradeMode:mid};
        if(mid == '1' || mid == '2'){
            _data={mailAddress: email,orderNo: id,tradeMode:mid};
        }
        $.sync({
            url: fresh.apiRoot + 'contractAgreement/sendEmailByContract',
            type: 'post',
            data: _data,
            success:function(d){
                console.log(d)
            },error:function(d){
                $.toast(d.msg)
            }
        });
    }
});