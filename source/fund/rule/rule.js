var template = _.template(require('./rule.html'));
require('./rule.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        this.render();
    },

    render:function(){
        this.$el.html(template());
        return this;
    },
    events:{

    }
});