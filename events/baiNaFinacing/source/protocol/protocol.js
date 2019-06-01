var template = _.template(require('./protocol.html'));
require('./protocol.css');
module.exports = Backbone.View.extend({
	initialize: function (options) {
		this.type=options.type;
		this.pcode=options.pcode;
		this.render(this.pcode);
	},
	render: function (code) {
		var IsMgs=false;
		if(code&&code.toLowerCase()=='mgs'){
			IsMgs=true;
		}
		this.$el.html(template({isMgsFlag:IsMgs}));
		$.setAppNav('异业合作合同');
		return this;
	}
});