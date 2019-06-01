/**
 * Created by xmm  on 2016/9/5
 */
 var template = _.template(require('./phonefeeExchange.html'));
 require('./phonefeeExchange.css');
 module.exports = Backbone.View.extend({
 	initialize: function (options) {
 		this.type = options.type;
 		this.pid=options.pid;
 		$.setLoginTokenFormApp();
 		 window.customEvent( 3, '2.7.5', '话费详情页可见,id:'+this.pid);
 		this.getData(this.pid);
 	},
 	getData:function(pid){
 		var self=this;
 		this.islogin=$.getLogin();
 		$.sync({
 			url: fresh.apiRoot + 'pointshop/phonefee/detail',
 			type: 'post',
 			data:{phonefeeId:pid},
 			success: function(d){
 				self.cache = d.entity;
 				self.render();
 			},error:function(d){
 				$.toast(d.msg);
 				self.render();
 			}
 		});	
 	},
 	render:function (){
 		this.$el.html(template({phonefee:this.cache,islogin:this.islogin}));
		$.setAppNav('兑换话费');
 		return this;
 	},
 	events:{
 		"tap .canExchange":"Exchange",
 		"tap .tologinbtn" :"login"

 	},
 	Exchange:function(e){
 		var self = $(e.currentTarget);
 		var _ruleId=parseInt(self.attr('data-ruleId'));
 		var _exId=parseInt(self.attr('data-exId'));
 		var _pId=parseInt(self.attr('data-pid'));
 		window.customEvent( 2, '2.7.6', '点击话费兑换，id'+_pId);
 		if($.isApp()){
 			location.href="appphonefeeExchange/"+_exId;
 		}else{
 			$.sync({
 				url: fresh.apiRoot + 'pointshop/exchange',
 				type: 'post',
 				data:{ruleId:_ruleId},
 				success: function(d){
 					$.changePage("mall/exchangeResult/"+_exId);
 				},error:function(d){
 					$.toast(d.msg);
 				}
 			});
 		}
 	},
 	login:function(){
		jsb.login()
 	}
 });