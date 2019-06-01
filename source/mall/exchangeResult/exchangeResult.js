/**
 * Created by xmm  on 2016/9/13
 */
 var template = _.template(require('./exchangeResult.html'));
 require('./exchangeResult.css');
 module.exports = Backbone.View.extend({
 	initialize: function (options) {
 		this.type = options.type;
 		this.id = options.id;
 		this.getData(this.id);
 	},
 	getData:function(id){
 		this.id=parseInt(id);
 		this.render();	    
 	},
 	render:function (){
 		this.$el.html(template({typeid:this.id}));
		$.setAppNav('兑换结果');
 		return this;
 	} ,
 	events:{
 		'tap .backtomall' :'backtomall',
 		'tap .nowtouse'   :'nowtouse'
 	}, 
 	backtomall:function(){
 		$.changePage('mall');
 	},
 	nowtouse:function(e){
 		var self = $(e.currentTarget);
 		var _exid=parseInt(self.attr('data-exid'));
 		if(_exid==3){ //话费
 			window.location.href='http://mall/ywcallapi';
 		}else if(_exid==2){ //红包
 			$.changePage('product');
 		}
 	}
 });