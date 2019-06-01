var template = _.template(require('./archives.html'));
require('./archives.css');

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