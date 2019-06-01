var template = _.template(require('./legalList.html'));
require('./legal.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type=options.type;
        this.render();
    },
    events:{
        'tap .iconsa':'redirect'
    },
    render:function (){
        this.$el.html(template());
        $.setAppNav('法律文件');
        return this;
    },
    redirect:function(e){
        var self = $(e.currentTarget);
        var _idx=parseInt(self.attr('data-idx'));
        if (_idx=="2") {
            $.changePage("legalTransfer");
        }else{
            $.changePage("legalDoc/"+_idx);
        }
        
    }
});


