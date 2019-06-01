var template = _.template(require('./top-channel-nav.html'));
require('./top-channel-nav.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.backUrl = options.backUrl||'';
        this.title=options.title;
        this.render();
    },
    render:function (){
        this.$el.html(template({title:this.title}));
        $.setWeixinTitle('摇旺');
        return this;
    },
    events:{
        'tap .go-back':'goBack'
    },
    goBack:function(){
        if(!this.backUrl){
            history.go(-1);
        }else{
            window.location=this.backUrl;
        }
    }
});