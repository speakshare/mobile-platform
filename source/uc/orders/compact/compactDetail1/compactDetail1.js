/**
 * Created by chenguodong on 2017/3/20.
 */
var template = _.template(require('./compactDetail1.html'));
require('../compact.css');

module.exports = Backbone.View.extend({
    initialize:function(options){
          $.setLoginTokenFormApp();
        this.type = parseInt(options.type);
        this.id = options.id;
        this.mid = parseInt(options.mid);
        this.getData(this.id,this.mid,this.type);
    },
    getData: function(id,mid,type) {
        var self = this;
        var _data={id: id,tradeMode:mid,buyType:type};
        if(this.mid=='1' || this.mid=='2'){
            _data={orderNo: id,tradeMode:mid,buyType:type};
        }
        $.sync({
            url: fresh.apiRoot + 'contractAgreement/dQContract',
            type: 'post',
            data: _data,
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
        $.setAppNav('定向委托投资协议');
        return this;
    }
});