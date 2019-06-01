var template = _.template(require('./category.html'));
require('./category.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        this.getData();
    },
    getData:function(){
        this.$el.html(template());
        this.render();
    },
    render:function(){
        return this;
    },
    events:{

    },

});