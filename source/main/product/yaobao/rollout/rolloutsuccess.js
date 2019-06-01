var template = _.template(require('./rolloutsuccess.html'));
require('./rolloutsuccess.css')
module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.cache = options;
        this.render();
    },
    events: {
        'tap .detail-banner': 'goInviteFriends',
        'tap #finished': 'goYaoBaoHome'
    },
    goInviteFriends:function(){
        $.changePage('#uc/invite');
    },
    goYaoBaoHome:function(){
        $.changePage('yaobao/' + this.cache.pid);
    },
    render: function () {
        $.setAppNav('结果');
        this.$el.html(template(this.cache));
        $.fixDownloadApp();
        return this;
    }
});