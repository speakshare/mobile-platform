var template = _.template(require('./detail.html'));
require('./detail.css');

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