var template = _.template(require('./home.html'));
require('./home.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        this.getData();
    },
    getData:function(){

    },
    render:function(){

        return this;
    },
    events:{
    }
});