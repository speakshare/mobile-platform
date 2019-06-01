/**
 * Created by chenguodong on 2017/3/20.
 */
var template = _.template(require('./compactDetail2.html'));
require('../compact.css');

module.exports = Backbone.View.extend({
    initialize:function(options){
          $.setLoginTokenFormApp();
        this.type = options.type;
        this.id = options.id;
        this.getData(this.id);
    },
    getData: function(id) {
        var self = this;
        $.sync({
            url: fresh.apiRoot + 'contractAgreement/zqzrContract',
            type: 'post',
            data: {id:id},
            success:function(d){
                self.cache = d;
                self.render();
                console.log(d)
            },error:function(d){
                $.toast(d.msg)
            }
        });
    },
    render:function(){
        this.$el.html(template(this.cache));
        $.setAppNav('资产权益转让及受让协议');
        return this;
    }
});