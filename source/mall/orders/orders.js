/**
 * Created by xmm  on 2016/10/8
 */
 var template = _.template(require('./orders.html'));
 require('./orders.css');
 module.exports = Backbone.View.extend({
 	initialize: function (options) {
 		this.type = options.type;
 		this.getData();
 		this.list=[];
 	},
 	getData:function(){
 		var self = this;
 		$.checkUser(function(){
 			self.loadMore();             
 		});
 	},
 	events:{
 		'tap .exchangebtn'    :'goToExchange',
 		'tap .toinvestproduct':'getProductsByRuleId',
 		'tap .tousephonefee'  :'usephonefee',
 		'tap .viewlogistics'  :'viewlogistics'
 	},
 	render:function (){
 		this.$el.html(template({orders:this.entity}));
 		$.setAppNav('我的订单');
 		return this;
 	},
 	getProductsByRuleId: function(event){
 		var self = this;
 		var ruleId = $(event.target).attr("data-id");
 		var redBagId = $(event.target).attr("data-bagid");
 		var el = this.$el.find('.redbag');
 		$.sync({
 			url:fresh.apiRoot + 'member/selectListProductByRewardId',
 			type:'post',
 			data:{
 				ruleId:ruleId
 			},
 			success:function(d){
 				d.redBagId = redBagId;
 				self.showPerfactProducts(el, d);	
 			}
 		})
 		
 	},
 	showPerfactProducts: function(el, data){
 		var perfactProduct = require('./../../common/rightProduct/rightProduct');
 		new perfactProduct({el:el,data:data});
 	},
 	goToExchange:function(){
 		$.changePage('mall');
 	},
 	usephonefee:function(){
 		window.location.href="http://mall/ywcallapi";
 	},
 	viewlogistics:function(e){
 		var self = $(e.currentTarget);
 		var _idx=parseInt(self.attr('data-id'));
 		$.changePage('#mall/orderInfo/'+_idx);
 	},
 	loadMore:function(){
 		var self = this;
 		if (self.startload) return;
 		fresh.loadData&&fresh.loadData.destory();
 		fresh.loadData=$.loadMore({
 			loading: '.loading',
 			padding: 20,
 			url: fresh.apiRoot + 'pointshop/exchangeRecord',
 			type:'post',
 			loadFirstPage: true,     
 			data: {
 				pageNo:1,
 				pageSize:15
 			},
 			success: function (d) {
 				self.entity=d;
 				self.list=self.list.concat(d.list);
 				self.entity.list=self.list;
 				self.render();
 			},
 			error: null
 		});
 	}
 });