var template=_.template(require('./success.html'));
require('./success.css');
module.exports=Backbone.View.extend({
	initialize: function (options) {
		this.type = options.type;
		this.getData();
	},
	getData:function(){
		this.money=$.getParam('money');
		this.render();
	},
	render:function(){
		this.$el.html(template({money:this.money}));
		$.setAppNav('结果');
    $.fixDownloadApp();
		return this;
	},
	events:{
		'tap .resultbtn':'finish'
	},
	finish:function(){
		$.changePage('uc/home');
	}
})