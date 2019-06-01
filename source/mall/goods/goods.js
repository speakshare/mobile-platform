
 var template = _.template(require('./goods.html'));
 require('./goods.css');
 module.exports = Backbone.View.extend({
 	initialize: function (options) {
 		this.type = options.type;
 		this.getData();
 	},
 	getData:function(){
 		var self = this;
 		$.sync({
 			url: fresh.apiRoot + 'pointshop/item/list',
 			data: {
 				pageNo:1,
 				pageSize:10
 			},
 			type: 'post',
 			success: function(d){
 				self.goodslist=d.list;
 				self.render();
 			},error:function(d){
 				//console.log(d);
 				self.render();
 			}
 		});			
 	},
 	render:function (){
 		this.$el.html(template({list: this.goodslist}));
 		return this;
 	},
 	events:{
 		'tap .goodinfo':'goods',
 		'tap .more':'list'
 	}, 
 	goods:function(e){
 		var self = $(e.currentTarget);
 		var _idx=parseInt(self.attr('data-id'));
 		window.customEvent( 2, '2.4.1', '点击商品兑换,id:'+_idx);
 		$.changePage("mall/goodsDetail/"+_idx);
 	},
 	list:function(){
 		$.changePage("mall/goods/list");
 	}
 });
