var template = _.template(require('./notice.html'));
require('./notice.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        this.render();
    },
    render:function(){
        this.$el.html(template());
        $.setAppNav('提现公告');
        return this;
    }
})