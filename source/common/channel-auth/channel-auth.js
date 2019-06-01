var template = _.template(require('./channel-auth.html'));
require('./channel-auth.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.callback = options.callback;
        this.render();
    },

    render:function (){
        this.$el.html(template());
        return this;
    },
    events:{
        'click .auth-btn':'auth'
    },
    auth:function(){
        if(!this.$el.find('.auth-check').is(':checked')){
            $.toast('请同意注册/登录摇旺')
        }else{
            this.callback();
        }
    }
});