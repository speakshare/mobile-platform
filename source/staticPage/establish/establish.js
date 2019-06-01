var template = _.template(require('./establish.html'));
require('./establish.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        this.render();
        // this.getData();
    },   
    getData:function(){
        var self=this;
        $.sync({
            url:fresh.apiRoot+'member/custodyAccountRegister',
            type:'post',
            success:function (d) {
                self.render(d);
            }
        })
    },
    render:function (d){
        this.$el.html(template());
    }
});