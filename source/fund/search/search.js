var template = _.template(require('./search.html'));
require('./search.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.id=options.id;
        this.getData( this.id);
    },
    getData:function(id){
        this.render();
    },
    render:function(){
       this.$el.html(template());
       $.setAppNav('搜索');
       return this;
   },
   events:{

   }
});