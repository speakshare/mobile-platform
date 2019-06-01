var template = _.template(require('./exponent.html'));
// require('../category/category.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        this.getData();
    },
    getData:function(){
        this.render();
    },
    render:function(){
        this.$el.html(template());
        return this;
    },
    events:{

    }
});