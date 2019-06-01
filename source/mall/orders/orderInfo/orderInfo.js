/**
 * Created by xmm  on 2016/10/8
 */
 var template = _.template(require('./orderInfo.html'));
 require('./orderInfo.css');
 module.exports = Backbone.View.extend({
 	initialize: function (options) {
 		this.type = options.type;
 		this.oid=options.oid;
 		this.getData(options.oid);
 		this.list=[];
 	},
 	getData:function(oid){
 		var self = this;
 		$.checkUser(function(bl){
 			if(bl){
 				$.sync({
 					url: fresh.apiRoot + 'pointshop/logistic',
 					type: 'post',
 					data:{orderId:oid},
 					success: function(d){
 						self.oinfo=d;
 						self.render();
 					},error:function(d){
 						$.toast(d.msg);
 						self.render();
 					}
 				});          
 			}else{
 				$.login();
 			}
 		});
 	},
 	events:{
 		'tap .exchangebtn'    :'goToExchange'
 	},
 	render:function (){
 		this.$el.html(template({oinfo:this.oinfo}));
		$.setAppNav('物流信息');
 		return this;
 	}
 	
 });