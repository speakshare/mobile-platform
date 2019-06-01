var template = _.template(require('./policyClause.html'));
require('./../accountInsurance.css');

module.exports = Backbone.View.extend({
	initialize: function () {
        this.render();
    },
    render:function(){
        this.$el.html(template(this.cache));
        return this;
    },
    events:{
    	'tap .checkoutMyPolicy':      'seeMypolicy'
    },
    seeMypolicy:function(){
        $.changePage('staticPage/taipingInsurance');
    }
})