var template = _.template(require('./list.html'));
require('../goods.css');
module.exports = Backbone.View.extend({
	initialize: function (options) {
		this.type = options.type;
		this.getData();
		this.list=[];
	},
	getData:function(){	
	 	this.loadMore();   		
	 },
	 render:function (){
	 	this.$el.html(template({list: this.goodslist}));
	 	$.setAppNav('兑礼品');
	 	return this;
	 },
	 events:{
	 	'tap .goods':'goods'
	 }, 
	 goods:function(e){
	 	var self = $(e.currentTarget);
	 	var _idx=parseInt(self.attr('data-id'));
	 	window.customEvent( 2, '2.4.1', '点击商品兑换,id:'+_idx);
	 	$.changePage("mall/goodsDetail/"+_idx);
	 },
	 loadMore:function(){
	 	var self = this;
	 	if (self.startload) return;
	 	fresh.loadData&&fresh.loadData.destory();
	 	fresh.loadData=$.loadMore({
	 		loading: '.loading',
	 		padding: 20,
	 		url: fresh.apiRoot + 'pointshop/item/list',
	 		type:'post',
	 		loadFirstPage: true,     
	 		data: {
	 			pageNo:1,
	 			pageSize:20
	 		},
	 		success: function (d) {
	 			self.list=self.list.concat(d.list);
	 			self.goodslist=self.list;
	 			self.render();
	 		},
	 		error: null
	 	});
	 }
	});
