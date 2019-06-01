var template = _.template(require('./banner.html'));
require('./banner.css');

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
        'tap .detail_banner2,.detail_banner_ads,.bannerBg':'changePage',
        'tap .detail_banner1':'invitePage'
    },
    invitePage:function(){
        // window.location = '/weizhan/member/inviteFriends?loginToken='+$.getToken();
        $.changePage('uc/invite');
    },
    changePage:function(e){
        var _link = $(e.currentTarget).attr('data-link');
        if(_link){
            window.location = $(e.currentTarget).attr('data-link');
        }
        else return;
    }
});