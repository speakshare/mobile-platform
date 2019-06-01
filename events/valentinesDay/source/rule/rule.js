var template = _.template(require('./rule.html'));
require('./rule.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        $('body')[0].scrollTop=0;
        this.render();
    },
    render: function () {
        this.$el.html(template());
        $.setWeixinTitle('活动细则');
        $.shareDefault();
    }
});