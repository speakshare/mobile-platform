var template = _.template(require('./check.html'));
require('./check.css');

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