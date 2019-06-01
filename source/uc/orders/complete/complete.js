var template = _.template(require('./complete.html'));
require('./complete.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
    	this.oid = options.oid;
        this.$el.html(template())
        $.setAppNav('变现转让','#uc/home');
        $.fixDownloadApp();
    },

    events:{
        'tap .toinvestbtn':'gotoOrders'
    },

    gotoOrders: function(){
    	$.changePage('transfer');
    }
});

