var template = _.template(require('./info-list.html'));
require('./info-list.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.cache = options.cache;
        this.render();
    },
    render: function () {
        this.$el.html(template(this.cache));
        return this;
    }
});