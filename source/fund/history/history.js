var template = _.template(require('./history.html'));
require('./history.css');

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