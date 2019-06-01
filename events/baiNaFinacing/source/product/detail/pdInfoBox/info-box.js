var template = _.template(require('./info-box.html'));
require('./info-box.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.cache=options.cache;
        this.render();
    },
    render:function (){
        this.$el.html(template(this.cache));
        return this;
    },
   
    events:{
        'tap .info-bottom':'showRecords'
    },
    showRecords:function(){
        $.changePage("product/"+this.cache.pd.productNo+'/records');
    }
});