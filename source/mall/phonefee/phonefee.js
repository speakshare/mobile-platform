/**
 * Created by xmm  on 2016/9/5
 */
 var template = _.template(require('./phonefee.html'));
 require('./phonefee.css');
 module.exports = Backbone.View.extend({
 	initialize: function (options) {
 		this.type = options.type;
 		this.getData();
 	},
 	getData:function(){
 		var self = this;	
 		$.sync({
 			url: fresh.apiRoot + 'pointshop/phonefee/list',
 			type: 'post',
 			success: function(d){
 				var list = d.list;
 				self.billlist=list;
 				self.render();
 			},error:function(d){
 				self.billlist=[];
 				self.render();
 			}
 		});
 	},
 	render:function (){
 		var self=this;
 		this.$el.html(template({billlist:this.billlist}));
 		new Swiper('.swiper-container', {preventLinksPropagation :true,preventClicks : true,touchMoveStopPropagation:true,slidesPerView: 2.5, spaceBetween: 10,freeMode: true,
 			onTap:function(swiper,e){
 				var oTarget = $.findEleByClass(e.target, 'billinfo');
 				if(oTarget){
 					self.billinfo(oTarget);
 				}
 			}});
 		return this;
 	},
 	events:{
 		'tap .ywcall'         :"ywcall"
 	}, 
 	billinfo:function(obj){
 		if(obj){
 			var _idx=parseInt(obj.getAttribute('data-id'));
            window.customEvent( 2, '2.5.1', '点击话费兑换,id:'+_idx);
 			$.changePage("mall/phonefeeExchange/"+_idx);
 		} 
 	},
 	ywcall:function(){
        window.customEvent( 2, '2.6.1', '摇旺电话使用');
 		window.location.href="http://mall/ywcallapi";
 	}
 });