var template = _.template(require('./home.html'));
module.exports = Backbone.View.extend({
	initialize: function (options) {
		$.setLoginTokenFormApp();
		this.type=options.type;
		this.code=options.code;
		this.render(this.code);
	},
	render: function (code) {
		this.$el.html(template());
		var page=require('./MBA/MBA');
        if(code &&(code.toLowerCase()=='pro_1')){
        	page=require('./HiCar/HiCar')
        }else{
        	page=require('./MBA/MBA');
        }
		new page({el:$(".home")});
		return this;
	}
});