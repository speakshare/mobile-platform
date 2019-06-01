var template = _.template(require('./legalTransfer.html'));
require('./../legal.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type=options.type;
        this.render();
    },
    events:{
        'tap .iconsa':'redirect'
    },
    render:function (){
        this.$el.html(template(this.cache));
        $.setAppNav('债权转让及服务协议');
        return this;
    },
    redirect:function(e){
        var self = $(e.currentTarget);
        var _idx=parseInt(self.attr('data-idx'));
        $.changePage("legalDoc/"+_idx);
    }
});


